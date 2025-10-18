import { getErrorMessage } from "@packages/utils";

export async function useTryCatch<T>(promise: Promise<T>): Promise<[T, null] | [null, Error]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(getErrorMessage(error));
    return [null, errorObj];
  }
}
