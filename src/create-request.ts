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

      // It is likely that the input is not a valid url
      // Call createURL to throw the InvalidURLError
      const url = createURL(input);
      // If it doesn't throw, then we fallback to unexpected error
      // This case will happen in the browser environment if the url contains credentials
      // However, currently, we don't support browser yet so we fallback to unexpected error
      if (url) {
        throw fallbackError;
      }
    }

    throw fallbackError;
  }
}
