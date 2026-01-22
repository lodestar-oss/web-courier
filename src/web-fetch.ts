import { WebCourierError } from "@/utils/errors/classes";
import { createRequest } from "@/create-request";

export async function webFetch(input: RequestInfo | URL, init?: RequestInit) {
  const createRequestResult = createRequest(input, init);
  if (!createRequestResult.success) {
    return createRequestResult;
  }
  const request = createRequestResult.data;

  try {
    const response = await fetch(request);
    return { data: response, success: true };
  } catch (error) {
    if (error instanceof TypeError) {
      const networkError = new WebCourierError("Network error", {
        code: "NETWORK_ERROR",
        cause: error,
      });
      return { error: networkError, success: false };
    }

    const unknownError = new WebCourierError("Unknown error", {
      code: "UNKNOWN",
      cause: error,
    });
    return { error: unknownError, success: false };
  }
}
