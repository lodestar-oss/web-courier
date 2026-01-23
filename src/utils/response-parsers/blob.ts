import type { Result } from "@/types/result";

import { type ParserErrorCode, WebCourierError } from "@/utils/errors/classes";

export async function blobParser(
  response: Response
): Promise<Result<Blob, WebCourierError<ParserErrorCode | "UNKNOWN">>> {
  if (response.bodyUsed) {
    const typeError = new TypeError(
      "Failed to execute 'blob' on 'Response': body stream already read"
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
    const blob = await response.blob();
    return { success: true, data: blob };
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

    const unknownError = new WebCourierError("Unknown error", {
      code: "UNKNOWN",
      cause: error,
    });
    return { error: unknownError, success: false };
  }
}
