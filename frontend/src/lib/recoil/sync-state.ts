import { useEffect } from 'react';
import { RecoilState } from 'lib/jotai-compat/recoil';
import { useSetAtom } from 'jotai';

export function useSyncRecoilState<T>(state: RecoilState<T>, value: T) {
  const setState = useSetAtom(state);

  useEffect(() => setState(value), [setState, value]);
}
