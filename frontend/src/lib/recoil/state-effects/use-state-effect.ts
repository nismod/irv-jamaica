import { usePrevious } from 'lib/hooks/use-previous';
import { useCallback, useEffect } from 'react';
import { WritableAtom, useAtomValue } from 'jotai';
import { useAtomCallback, RESET } from 'jotai/utils';
import { StateEffect } from './types';

/**
 * Run a state effect when a piece of state changes.
 * A state effect can modify other pieces of state.
 * @param state the recoil state to watch
 * @param effect the state effect to run when the state changes
 */
export function useStateEffect<T>(state: WritableAtom<T, unknown[], void>, effect: StateEffect<T>) {
  const stateValue = useAtomValue(state);

  const previousStateValue = usePrevious(stateValue);

  const cb = useAtomCallback(
    useCallback(
      (get, set, newValue: T, previousValue: T) => {
        const ops = {
          get: (s: any) => get(s),
          set: (s: any, v: any) => set(s, v),
          reset: (s: any) => set(s, RESET as never),
        };
        effect(ops, newValue, previousValue);
      },
      [effect],
    ),
  );

  useEffect(() => cb(stateValue, previousStateValue), [cb, stateValue, previousStateValue]);
}
