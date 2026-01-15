import { createFallbackError } from "@/utils/errors/fallback";
import { assertUrlString } from "@/utils/url-string";

export function createRequest(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const request = new Request(input, init);
    return request;
  } catch (error) {
    if (error instanceof TypeError) {
      // This should throw InvalidURLError
      if (typeof input === "string") {
        assertUrlString(input);
      }
      // If the above assertion doesn't throw,
      // Then it's likely that the app is running in the browser
      // and the URL contains credentials
    }

    const fallbackError = createFallbackError({
      context: {
        url: input instanceof Request ? input.url : input.toString(),
        operation: "createRequest",
      },
      error,
    });
    throw fallbackError;
  }
}
