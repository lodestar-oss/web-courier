import { createFallbackError } from "@/utils/errors/fallback";
import { createURL } from "@/create-url";

export function createRequest(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const request = new Request(input, init);
    return request;
  } catch (error) {
    const fallbackError = createFallbackError({
      context: {
        operation: "createRequest",
        inputs: { input, init },
      },
      error,
    });

    if (error instanceof TypeError) {
      // This case should not happen.
      // This is just for narrowing the type of input
      if (input instanceof Request) {
        throw fallbackError;
      }

      // Call createURL for it to throw
      const url = createURL(input);
      // If it didn't throw, then we fallback to unexpected error
      if (url) {
        throw fallbackError;
      }
    }

    throw fallbackError;
  }
}
