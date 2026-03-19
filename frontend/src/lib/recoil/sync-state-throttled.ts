import { useEffect } from 'react';
import { Atom, useAtomValue, useSetAtom, WritableAtom } from 'jotai';

import { useThrottledCallback } from '../hooks/use-throttled-callback';

export function useSyncStateThrottled<T>(
  state: Atom<T>,
  replicaState: WritableAtom<T, unknown[], void>,
  ms: number,
) {
  const value = useAtomValue(state);
  const syncValue = useSetAtom(replicaState);

  const syncValueThrottled = useThrottledCallback(syncValue, ms);

  useEffect(() => {
    syncValueThrottled(value);
  }, [value, syncValueThrottled]);
}
