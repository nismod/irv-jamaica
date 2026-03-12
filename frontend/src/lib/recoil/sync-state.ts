import { useEffect } from 'react';
import { RecoilState, useSetRecoilState } from 'lib/jotai-compat/recoil';

export function useSyncRecoilState<T>(state: RecoilState<T>, value: T) {
  const setState = useSetRecoilState(state);

  useEffect(() => setState(value), [setState, value]);
}
