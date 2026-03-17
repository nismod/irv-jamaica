import { atom as jotaiAtom, useStore } from 'jotai';
import { loadable as jotaiLoadable, RESET } from 'jotai/utils';
import stableStringify from 'json-stable-stringify';
import { useMemo } from 'react';

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
      store.set(state as never, RESET as never);
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
