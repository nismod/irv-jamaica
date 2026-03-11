import throttle from 'lodash/throttle';
import { useEffect, useMemo } from 'react';

export function useThrottledCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  ms: number,
  leading: boolean = false,
  trailing: boolean = true,
) {
  const throttledHandler = useMemo(
    () => throttle(callback, ms, { leading, trailing }),
    [callback, ms, leading, trailing],
  );

  useEffect(() => {
    return () => {
      throttledHandler.cancel();
    };
  }, [throttledHandler]);

  return throttledHandler;
}
