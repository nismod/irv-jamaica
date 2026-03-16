import { Provider, atom as jotaiAtom, useAtomValue, useSetAtom, useStore } from 'jotai';
import { atomFamily as jotaiAtomFamily, loadable as jotaiLoadable, useResetAtom } from 'jotai/utils';
import stableStringify from 'json-stable-stringify';
import { useMemo } from 'react';

export const RecoilRoot = Provider;

export class DefaultValue {}

export type RecoilValue<T = unknown> = any;
export type RecoilValueReadOnly<T = unknown> = any;
export type RecoilState<T = unknown> = any;

export type TransactionInterface_UNSTABLE = {
  get: (state: any) => any;
  set: (state: any, value: any) => void;
  reset: (state: any) => void;
};

const NEVER_PROMISE: Promise<never> = new Promise(() => undefined);

function fromJotaiLoadable(value: { state: 'loading' | 'hasData' | 'hasError'; data?: unknown; error?: unknown }) {
  if (value.state === 'hasData') {
    return { state: 'hasValue' as const, contents: value.data };
  }
  if (value.state === 'hasError') {
    return { state: 'hasError' as const, contents: value.error };
  }
  return { state: 'loading' as const, contents: NEVER_PROMISE };
}

function resolveParamKey(param: unknown) {
  try {
    return stableStringify(param);
  } catch {
    return String(param);
  }
}

export function atom<T = unknown>(options: {
  key: string;
  default?: T;
  effects?: Array<(ops: {
    setSelf: (value: T | DefaultValue | ((prev: T) => T | DefaultValue)) => void;
    onSet: (fn: (newValue: T | DefaultValue, oldValue: T, isReset: boolean) => void) => void;
    getPromise: (state: any) => Promise<any>;
    getLoadable: (state: any) => { state: 'loading' | 'hasValue' | 'hasError'; contents: unknown };
    trigger: 'get' | 'set';
  }) => void | (() => void)>;
}): any {
  const initialValue = options.default as T;
  const UNSET = Symbol(`${options.key}__unset`);
  const defaultRecoilValue =
    options.default && typeof options.default === 'object' && 'read' in (options.default as object)
      ? (options.default as any)
      : null;

  const resolveCurrent = (get: (state: any) => any): T => {
    const current = get(base);
    if (current !== UNSET) {
      return current as T;
    }
    if (defaultRecoilValue) {
      return get(defaultRecoilValue as never) as T;
    }
    return initialValue;
  };

  const onSetHandlers: Array<(newValue: T | DefaultValue, oldValue: T, isReset: boolean) => void> = [];
  let suppressOnSetHandlers = false;

  const base = jotaiAtom<T | symbol>(UNSET);
  const recoilAtom = jotaiAtom(
    (get) => resolveCurrent(get),
    (get, set, update: T | DefaultValue | ((prev: T) => T | DefaultValue)) => {
      const prev = resolveCurrent(get);
      const candidate = typeof update === 'function' ? (update as (prev: T) => T | DefaultValue)(prev) : update;
      const isReset = candidate instanceof DefaultValue;
      const next = isReset ? UNSET : (candidate as T);
      set(base, next);
      if (suppressOnSetHandlers) {
        suppressOnSetHandlers = false;
        return;
      }
      onSetHandlers.forEach((handler) =>
        handler(isReset ? new DefaultValue() : (candidate as T), prev, isReset),
      );
    },
  );

  if (options.effects?.length) {
    recoilAtom.onMount = (setAtom) => {
      const cleanups: Array<() => void> = [];

      const setSelf = (value: T | DefaultValue | ((prev: T) => T | DefaultValue)) => {
        suppressOnSetHandlers = true;
        if (value instanceof DefaultValue) {
          setAtom(UNSET as T);
          return;
        }
        if (typeof value === 'function') {
          suppressOnSetHandlers = false;
          return;
        }
        setAtom(value as T);
      };

      const onSet = (fn: (newValue: T | DefaultValue, oldValue: T, isReset: boolean) => void) => {
        onSetHandlers.push(fn);
      };

      const getPromise = async (_state: any) => undefined;
      const getLoadable = (_state: any) => ({ state: 'loading' as const, contents: NEVER_PROMISE });

      options.effects?.forEach((effect) => {
        const cleanup = effect({ setSelf, onSet, getPromise, getLoadable, trigger: 'get' });
        if (typeof cleanup === 'function') {
          cleanups.push(cleanup);
        }
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    };
  }

  return recoilAtom;
}

export function selector<T = unknown>(config: {
  key: string;
  get: ({ get }: { get: (state: any) => any }) => T | Promise<T>;
  set?: (
    ops: {
      get: (state: any) => any;
      set: (state: any, value: any) => void;
      reset: (state: any) => void;
    },
    newValue: T | DefaultValue,
  ) => void;
  dangerouslyAllowMutability?: boolean;
}): any {
  if (!config.set) {
    return jotaiAtom((get) => config.get({ get }));
  }

  return jotaiAtom(
    (get) => config.get({ get }),
    (get, set, value: T | DefaultValue) => {
      config.set?.(
        {
          get,
          set: (state, newValue) => set(state as never, newValue as never),
          reset: (state) => set(state as never, new DefaultValue() as never),
        },
        value,
      );
    },
  );
}

export function atomFamily<T = unknown, P = unknown>(config: {
  key: string;
  default?: T | ((param: P) => T);
  effects?: (param: P) => Array<(ops: {
    setSelf: (value: T | DefaultValue | ((prev: T) => T | DefaultValue)) => void;
    onSet: (fn: (newValue: T | DefaultValue, oldValue: T, isReset: boolean) => void) => void;
    getPromise: (state: any) => Promise<any>;
    getLoadable: (state: any) => { state: 'loading' | 'hasValue' | 'hasError'; contents: unknown };
    trigger: 'get' | 'set';
  }) => void | (() => void)>;
}): any {
  const defaultFactory =
    typeof config.default === 'function'
      ? (config.default as (param: P) => T)
      : () => config.default as T;

  return jotaiAtomFamily(
    (param: P) =>
      atom({
        key: `${config.key}-${resolveParamKey(param)}`,
        default: defaultFactory(param),
        effects: config.effects?.(param),
      }),
    (a, b) => resolveParamKey(a) === resolveParamKey(b),
  );
}

export function selectorFamily<T = unknown, P = unknown>(config: {
  key: string;
  get: (param: P) => ({ get }: { get: (state: any) => any }) => T | Promise<T>;
  set?: (param: P) => (
    ops: {
      get: (state: any) => any;
      set: (state: any, value: any) => void;
      reset: (state: any) => void;
    },
    newValue: T | DefaultValue,
  ) => void;
}): any {
  return jotaiAtomFamily(
    (param: P) =>
      selector({
        key: `${config.key}-${resolveParamKey(param)}`,
        get: config.get(param),
        set: config.set?.(param),
      }),
    (a, b) => resolveParamKey(a) === resolveParamKey(b),
  );
}

export function waitForAll(states: any): any {
  if (Array.isArray(states)) {
    return jotaiAtom(async (get) => Promise.all(states.map((state) => get(state))));
  }

  return jotaiAtom(async (get) => {
    const entries = Object.entries(states);
    const resolved = await Promise.all(
      entries.map(async ([key, state]) => [key, await get(state as never)]),
    );
    return Object.fromEntries(resolved);
  });
}

export function noWait(state: any): any {
  const loadableAtom = jotaiLoadable(state);
  return jotaiAtom((get) => fromJotaiLoadable(get(loadableAtom)));
}

export function useRecoilValue(state: any) {
  return useAtomValue(state) as any;
}

export function useSetRecoilState(state: any) {
  return useSetAtom(state as never) as (value: any) => void;
}

export function useResetRecoilState(state: any) {
  return useResetAtom(state as never);
}

export function useRecoilValueLoadable(state: any) {
  return useRecoilValue(noWait(state));
}

export function useRecoilCallback<TArgs extends unknown[], TResult>(
  callbackFactory: (ops: {
    set: TransactionInterface_UNSTABLE['set'];
    reset: TransactionInterface_UNSTABLE['reset'];
    snapshot: {
      getLoadable: (state: any) => { state: 'loading' | 'hasValue' | 'hasError'; contents: unknown };
      getPromise: (state: any) => Promise<any>;
    };
    transact_UNSTABLE: (fn: (ops: TransactionInterface_UNSTABLE) => void) => void;
  }) => (...args: TArgs) => TResult,
  deps: unknown[] = [],
) {
  const store = useStore();
  const depsKey = resolveParamKey(deps);

  return useMemo(() => {
    const set: TransactionInterface_UNSTABLE['set'] = (state, value) => {
      store.set(state as never, value as never);
    };

    const reset: TransactionInterface_UNSTABLE['reset'] = (state) => {
      store.set(state as never, new DefaultValue() as never);
    };

    const txOps: TransactionInterface_UNSTABLE = {
      get: (state) => store.get(state),
      set,
      reset,
    };

    return callbackFactory({
      set,
      reset,
      snapshot: {
        getLoadable: (state) => store.get(noWait(state) as never),
        getPromise: async (state) => store.get(state),
      },
      transact_UNSTABLE: (fn) => fn(txOps),
    });
  }, [store, callbackFactory, depsKey]);
}

export function useRecoilTransaction_UNSTABLE<TArgs extends unknown[], TResult>(
  transactionFactory: (ops: TransactionInterface_UNSTABLE) => (...args: TArgs) => TResult,
  deps: unknown[] = [],
) {
  const store = useStore();
  const depsKey = resolveParamKey(deps);

  return useMemo(() => {
    const set: TransactionInterface_UNSTABLE['set'] = (state, value) => {
      store.set(state as never, value as never);
    };

    const reset: TransactionInterface_UNSTABLE['reset'] = (state) => {
      store.set(state as never, new DefaultValue() as never);
    };

    return transactionFactory({
      get: (state) => store.get(state),
      set,
      reset,
    });
  }, [store, transactionFactory, depsKey]);
}
