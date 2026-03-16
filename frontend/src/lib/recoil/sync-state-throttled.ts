import { useEffect } from 'react';
import { RecoilState, RecoilValueReadOnly, useSetRecoilState } from 'lib/jotai-compat/recoil';
import { useAtomValue } from 'jotai';

import { useThrottledCallback } from '../hooks/use-throttled-callback';

export function useSyncStateThrottled<T>(
  state: RecoilValueReadOnly<T>,
  replicaState: RecoilState<T>,
  ms: number,
) {
  const value = useAtomValue(state);
  const syncValue = useSetRecoilState(replicaState);

  const syncValueThrottled = useThrottledCallback(syncValue, ms);

  useEffect(() => {
    syncValueThrottled(value);
  }, [value, syncValueThrottled]);
}
