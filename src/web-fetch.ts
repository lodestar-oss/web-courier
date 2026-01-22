import type { Result } from "@/types/result";

import { WebCourierError } from "@/utils/errors/classes";
import { createRequest } from "@/create-request";

export async function webFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<
  Result<
    Response,
    WebCourierError<
      | "INVALID_REQUEST_INIT_OPTIONS"
      | "REQUEST_URL_HAS_CREDENTIALS"
      | "NETWORK_ERROR"
      | "INVALID_URL"
      | "ABORTED"
      | "TIMEOUT"
      | "UNKNOWN"
    >
  >
> {
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

    if (error instanceof DOMException) {
      if (error.name === "AbortError") {
        const abortError = new WebCourierError("Request aborted", {
          code: "ABORTED",
          cause: error,
        });
        return { error: abortError, success: false };
      }
      if (error.name === "TimeoutError") {
        const timeoutError = new WebCourierError("Request timeout", {
          code: "TIMEOUT",
          cause: error,
        });
        return { error: timeoutError, success: false };
      }
    }

    // This checks for custom abort reasons like `controller.abort(new Error('Custom reason'))`
    if (request.signal.aborted) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const reason = request.signal.reason;
      let message = "Request aborted";

      if (typeof reason === "string") {
        message = reason;
      } else if (reason instanceof Error) {
        message = reason.message;
      }

      const abortError = new WebCourierError(message, {
        code: "ABORTED",
        cause: reason,
      });
      return { error: abortError, success: false };
    }

    const unknownError = new WebCourierError("Unknown error", {
      code: "UNKNOWN",
      cause: error,
    });
    return { error: unknownError, success: false };
  }
}
