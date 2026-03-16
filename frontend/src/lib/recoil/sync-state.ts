import { useEffect } from 'react';
import { useSetAtom, WritableAtom } from 'jotai';

export function useSyncRecoilState<T>(state: WritableAtom<T, unknown[], void>, value: T) {
  const setState = useSetAtom(state);

  useEffect(() => setState(value), [setState, value]);
}
