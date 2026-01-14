import { WebCourierError, NetworkError } from "@/utils/errors/classes";
import { createFallbackError } from "@/utils/errors/fallback";
import { createRequest } from "@/create-request";

export async function webFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const request = createRequest(input, init);
    const response = await fetch(request);
    return response;
  } catch (error) {
    if (error instanceof WebCourierError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new NetworkError("Network error", {
        inputs: { input, init },
        cause: error,
      });
    }

    const fallbackError = createFallbackError({
      context: {
        inputs: { input, init },
        operation: "webFetch",
      },
      error,
    });
    throw fallbackError;
  }
}
