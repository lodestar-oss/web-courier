import type { Result } from "@/types/result";

import { WebCourierError } from "@/utils/errors/classes";

export type CreateURLErrorCode = "INVALID_URL" | "UNKNOWN";

export function createURL({
  base,
  url,
}: {
  base?: string | URL;
  url: string | URL;
}): Result<URL, WebCourierError<CreateURLErrorCode>> {
  try {
    const urlObj = new URL(url, base);
    return { success: true, data: urlObj };
  } catch (error) {
    if (error instanceof TypeError) {
      const invalidURLError = new WebCourierError("Invalid URL", {
        code: "INVALID_URL",
        cause: error,
      });
      return { error: invalidURLError, success: false };
    }

    const unknownError = new WebCourierError("Unknown error", {
      code: "UNKNOWN",
      cause: error,
    });
    return { error: unknownError, success: false };
  }
}
