import type { Result } from "@/types/result";

import { WebCourierError } from "@/utils/errors/classes";
import { createURL } from "@/create-url";

export function createRequest(
  input: RequestInfo | URL,
  init?: RequestInit
): Result<Request, WebCourierError> {
  try {
    if (input instanceof Request) {
      const request = new Request(input, init);
      return { success: true, data: request };
    }

    const createURLResult = createURL(input);
    if (!createURLResult.success) {
      return createURLResult;
    }

    const request = new Request(createURLResult.data, init);
    return { success: true, data: request };
  } catch (error) {
    if (error instanceof TypeError) {
      const invalidRequestOptionsError = new WebCourierError(
        "Invalid request init options",
        {
          code: "INVALID_REQUEST_INIT_OPTIONS",
          cause: error,
        }
      );
      return { error: invalidRequestOptionsError, success: false };
    }

    const unknownError = new WebCourierError("Unknown error", {
      code: "UNKNOWN",
      cause: error,
    });
    return { error: unknownError, success: false };
  }
}
