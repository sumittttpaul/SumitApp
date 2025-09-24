import { useCallback, useLayoutEffect, useRef } from "react";

export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return callbackRef.current(...args);
  }, []) as T;
}
