import { getErrorMessage } from "./error";

export async function tryCatch<T>(promiseOrAsyncFunction: Promise<T> | (() => Promise<T>)): Promise<[T, null] | [null, Error]> {
  try {
    const promise = typeof promiseOrAsyncFunction === "function" ? promiseOrAsyncFunction() : promiseOrAsyncFunction;
    const data = await promise;
    return [data, null];
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(getErrorMessage(error));
    return [null, errorObj];
  }
}
