import { useEffect } from 'react';
import { RecoilState, RecoilValueReadOnly } from 'lib/jotai-compat/recoil';
import { useAtomValue, useSetAtom } from 'jotai';

import { useThrottledCallback } from '../hooks/use-throttled-callback';

export function useSyncStateThrottled<T>(
  state: RecoilValueReadOnly<T>,
  replicaState: RecoilState<T>,
  ms: number,
) {
  const value = useAtomValue(state);
  const syncValue = useSetAtom(replicaState);

  const syncValueThrottled = useThrottledCallback(syncValue, ms);

  useEffect(() => {
    syncValueThrottled(value);
  }, [value, syncValueThrottled]);
}
