import { atom as jotaiAtom, useAtomValue, useSetAtom, useStore } from 'jotai';
import type { Atom, WritableAtom } from 'jotai';
import { atomFamily as jotaiAtomFamily, loadable as jotaiLoadable, useResetAtom } from 'jotai/utils';
import stableStringify from 'json-stable-stringify';
import { useMemo } from 'react';

export class DefaultValue {}

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
}): WritableAtom<T, any[], any> {
  if (!config.set) {
    return jotaiAtom((get) => config.get({ get })) as unknown as WritableAtom<T, any[], any>;
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
  ) as unknown as WritableAtom<T, any[], any>;
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
}): (param: P) => WritableAtom<T, any[], any> {
  return jotaiAtomFamily(
    (param: P) =>
      selector({
        key: `${config.key}-${resolveParamKey(param)}`,
        get: config.get(param),
        set: config.set?.(param),
      }),
    (a, b) => resolveParamKey(a) === resolveParamKey(b),
  ) as unknown as (param: P) => WritableAtom<T, any[], any>;
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
