import type { Result } from "@/types/result";

import { WebCourierError } from "@/utils/errors/classes";
import { hasCredentials } from "@/utils/has-credentials";
import { createURL } from "@/create-url";

export function createRequest(
  input: RequestInfo | URL,
  init?: RequestInit
): Result<
  Request,
  WebCourierError<
    | "INVALID_REQUEST_INIT_OPTIONS"
    | "REQUEST_URL_HAS_CREDENTIALS"
    | "INVALID_URL"
    | "UNKNOWN"
  >
> {
  try {
    if (input instanceof Request) {
      const request = new Request(input, init);
      return { success: true, data: request };
    }

    const createURLResult = createURL(input);
    if (!createURLResult.success) {
      return createURLResult;
    }
    const url = createURLResult.data;

    if (hasCredentials(url)) {
      const requestUrlHasCredentialsError = new WebCourierError(
        "Credentials in request URL are not supported by the Fetch Standard. Please use the Authorization header instead.",
        {
          code: "REQUEST_URL_HAS_CREDENTIALS",
        }
      );
      return { error: requestUrlHasCredentialsError, success: false };
    }

    const request = new Request(url, init);
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
