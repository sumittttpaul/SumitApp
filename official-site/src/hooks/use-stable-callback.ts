import { useCallback, useLayoutEffect, useRef } from "react";

export default function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return callbackRef.current(...args);
  }, []) as T;
}
