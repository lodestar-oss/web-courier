/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Result } from "@/types/result";

import { type ParserErrorCode, WebCourierError } from "@/utils/errors/classes";

export async function jsonParser(response: Response): Promise<
  Result<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    WebCourierError<ParserErrorCode | "INVALID_JSON" | "UNKNOWN">
  >
> {
  if (response.bodyUsed) {
    const typeError = new TypeError(
      "Failed to execute 'json' on 'Response': body stream already read"
    );
    const bodyStreamWasReadError = new WebCourierError(
      "The response body is disturbed or locked.",
      {
        code: "BODY_STREAM_WAS_READ",
        cause: typeError,
      }
    );
    return { error: bodyStreamWasReadError, success: false };
  }

  try {
    const json = await response.json();
    return { success: true, data: json };
  } catch (error) {
    if (error instanceof TypeError) {
      const decodingError = new WebCourierError(
        "Failed to decode response body",
        {
          code: "DECODING_ERROR",
          cause: error,
        }
      );
      return { error: decodingError, success: false };
    }

    if (error instanceof SyntaxError) {
      const invalidJsonError = new WebCourierError(
        "The response body cannot be parsed as JSON",
        {
          code: "INVALID_JSON",
          cause: error,
        }
      );
      return { error: invalidJsonError, success: false };
    }

    const unknownError = new WebCourierError("Unknown error", {
      code: "UNKNOWN",
      cause: error,
    });
    return { error: unknownError, success: false };
  }
}
