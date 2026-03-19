import { usePrevious } from 'lib/hooks/use-previous';
import { useCallback, useEffect } from 'react';
import { WritableAtom, useAtomValue } from 'jotai';
import { useAtomCallback, RESET } from 'jotai/utils';
import { Ops, StateEffect } from './types';

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
        const ops: Ops = {
          get: (s) => get(s),
          set: (s, v) => set(s, v),
          reset: (s) => set(s, RESET),
        };
        effect(ops, newValue, previousValue);
      },
      [effect],
    ),
  );

  useEffect(() => cb(stateValue, previousStateValue), [cb, stateValue, previousStateValue]);
}
