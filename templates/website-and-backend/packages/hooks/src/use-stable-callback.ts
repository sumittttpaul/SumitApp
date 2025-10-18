import { useCallback, useLayoutEffect, useRef } from "react";

export function useStableCallback<Args extends readonly any[], Return>(callback: (...args: Args) => Return): (...args: Args) => Return {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args: Args) => {
    return callbackRef.current(...args);
  }, []);
}
