import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { DefaultValue } from './recoil';

type SyncStoreRuntime = {
  read?: (itemKey: string) => unknown;
  write?: (opts: { diff: Map<string, unknown> }) => void;
  listen?: (opts: {
    updateItem: (itemKey: string, value: unknown) => void;
    updateItems?: (items: Iterable<[string, unknown]>) => void;
    updateAllKnownItems?: (updater: (itemKey: string) => unknown) => void;
    updateAllItems?: (updater: (itemKey: string) => unknown) => void;
  }) => void | (() => void);
  subscribers: Map<string, Set<(value: unknown) => void>>;
  knownItems: Set<string>;
};

const syncStores = new Map<string, SyncStoreRuntime>();

function getStore(storeKey: string): SyncStoreRuntime {
  let store = syncStores.get(storeKey);
  if (!store) {
    store = {
      subscribers: new Map(),
      knownItems: new Set(),
    };
    syncStores.set(storeKey, store);
  }
  return store;
}

function notifyStore(storeKey: string, itemKey: string, value: unknown) {
  const run = () => {
    const store = getStore(storeKey);
    const subs = store.subscribers.get(itemKey);
    subs?.forEach((notify) => notify(value));
  };

  if (typeof queueMicrotask === 'function') {
    queueMicrotask(run);
    return;
  }

  Promise.resolve().then(run);
}

function writeItem(storeKey: string, itemKey: string, value: unknown) {
  const store = getStore(storeKey);
  if (store.write) {
    store.write({ diff: new Map([[itemKey, value]]) });
  }
  notifyStore(storeKey, itemKey, value);
}

function readItem(storeKey: string, itemKey: string) {
  const store = getStore(storeKey);
  if (!store.read) {
    return new DefaultValue();
  }
  const value = store.read(itemKey);
  return typeof value === 'undefined' ? new DefaultValue() : value;
}

function subscribeItem(storeKey: string, itemKey: string, cb: (value: unknown) => void) {
  const store = getStore(storeKey);
  store.knownItems.add(itemKey);
  if (!store.subscribers.has(itemKey)) {
    store.subscribers.set(itemKey, new Set());
  }
  const set = store.subscribers.get(itemKey)!;
  set.add(cb);

  return () => {
    set.delete(cb);
    if (set.size === 0) {
      store.subscribers.delete(itemKey);
    }
  };
}

export type ReadAtom = ({ read }: { read: (itemKey: string) => unknown }) => unknown;
export type WriteAtom<T = any> = (
  api: { write: (itemKey: string, value: unknown) => void; reset: (itemKey: string) => void },
  value: T | DefaultValue,
) => void;

export type SyncEffectOptions<T = any> = {
  storeKey: string;
  itemKey: string;
  refine?: unknown;
  syncDefault?: boolean;
  read?: ReadAtom;
  write?: WriteAtom<T>;
};

export function syncEffect<T = any>(options: SyncEffectOptions<T>) {
  return ({ setSelf, onSet }) => {
    const { storeKey, itemKey } = options;
    let applyingExternalUpdate = false;

    const fromStore = options.read
      ? options.read({ read: (key) => readItem(storeKey, key) })
      : readItem(storeKey, itemKey);

    if (!(fromStore instanceof DefaultValue)) {
      setSelf(fromStore as T);
    }

    const unsubscribe = subscribeItem(storeKey, itemKey, (value) => {
      applyingExternalUpdate = true;
      const mappedValue = options.read
        ? options.read({
            read: (key) => (key === itemKey ? value : readItem(storeKey, key)),
          })
        : value;

      if (mappedValue instanceof DefaultValue) {
        setSelf(mappedValue);
        applyingExternalUpdate = false;
        return;
      }

      setSelf(mappedValue as T);
      applyingExternalUpdate = false;
    });

    onSet((newValue) => {
      if (applyingExternalUpdate) {
        return;
      }
      if (options.write) {
        options.write(
          {
            write: (key, value) => writeItem(storeKey, key, value),
            reset: (key) => writeItem(storeKey, key, new DefaultValue()),
          },
          newValue as T | DefaultValue,
        );
      } else {
        writeItem(storeKey, itemKey, newValue);
      }
    });

    return () => {
      unsubscribe();
    };
  };
}

export function urlSyncEffect<T>(options: SyncEffectOptions<T>) {
  return syncEffect(options);
}

export type RecoilSyncOptions = {
  storeKey: string;
  read?: (itemKey: string) => unknown;
  write?: (opts: { diff: Map<string, unknown> }) => void;
  listen?: (opts: {
    updateItem: (itemKey: string, value: unknown) => void;
    updateItems?: (items: Iterable<[string, unknown]>) => void;
    updateAllKnownItems?: (updater: (itemKey: string) => unknown) => void;
    updateAllItems?: (updater: (itemKey: string) => unknown) => void;
  }) => void | (() => void);
  children?: ReactNode;
};

export function RecoilSync({ storeKey, read, write, listen, children }: RecoilSyncOptions) {
  useEffect(() => {
    const runtime = getStore(storeKey);
    runtime.read = read;
    runtime.write = write;
    runtime.listen = listen;

    // Effects can subscribe before the runtime store is ready. Once read/listen are
    // attached, immediately hydrate all known keys from the active backing store.
    runtime.knownItems.forEach((itemKey) => {
      const value = runtime.read?.(itemKey);
      notifyStore(storeKey, itemKey, typeof value === 'undefined' ? new DefaultValue() : value);
    });

    const stopListening = listen?.({
      updateItem: (itemKey, value) => {
        notifyStore(storeKey, itemKey, value);
      },
      updateItems: (items) => {
        for (const [itemKey, value] of items) {
          notifyStore(storeKey, itemKey, value);
        }
      },
      updateAllKnownItems: (updater) => {
        runtime.knownItems.forEach((itemKey) => notifyStore(storeKey, itemKey, updater(itemKey)));
      },
      updateAllItems: (updater) => {
        runtime.knownItems.forEach((itemKey) => notifyStore(storeKey, itemKey, updater(itemKey)));
      },
    });

    return () => {
      if (runtime.read === read) runtime.read = undefined;
      if (runtime.write === write) runtime.write = undefined;
      if (runtime.listen === listen) runtime.listen = undefined;
      if (typeof stopListening === 'function') {
        stopListening();
      }
    };
  }, [storeKey, read, write, listen]);

  return <>{children}</>;
}

type RecoilURLSyncProps = {
  storeKey: string;
  location?: { part?: 'queryParams' | string };
  serialize?: (value: unknown) => string;
  deserialize?: (value: string) => unknown;
  children?: ReactNode;
};

export function RecoilURLSync({
  storeKey,
  serialize = (value) => JSON.stringify(value),
  deserialize = (value) => JSON.parse(value),
  children,
}: RecoilURLSyncProps) {
  return (
    <RecoilSync
      storeKey={storeKey}
      read={(itemKey) => {
        const query = new URLSearchParams(window.location.search);
        if (!query.has(itemKey)) {
          return new DefaultValue();
        }
        const raw = query.get(itemKey);
        if (raw == null) {
          return new DefaultValue();
        }
        try {
          return deserialize(raw);
        } catch {
          return raw;
        }
      }}
      write={({ diff }) => {
        const query = new URLSearchParams(window.location.search);
        for (const [itemKey, value] of diff) {
          if (value instanceof DefaultValue) {
            query.delete(itemKey);
            continue;
          }
          const encoded =
            typeof value === 'string'
              ? value
              : serialize(value) ?? JSON.stringify(value);
          query.set(itemKey, encoded);
        }
        const url = new URL(window.location.href);
        url.search = query.toString();
        window.history.replaceState({}, '', url.toString());
      }}
      listen={({ updateAllKnownItems }) => {
        const onPopState = () => {
          updateAllKnownItems?.((itemKey) => {
            const query = new URLSearchParams(window.location.search);
            if (!query.has(itemKey)) {
              return new DefaultValue();
            }
            const raw = query.get(itemKey);
            if (raw == null) {
              return new DefaultValue();
            }
            try {
              return deserialize(raw);
            } catch {
              return raw;
            }
          });
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
      }}
    >
      {children}
    </RecoilSync>
  );
}
