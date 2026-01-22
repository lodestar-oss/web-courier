import { WebCourierError } from "@/utils/errors/classes";

export function createURL(url: string | URL, base?: string | URL) {
  try {
    const urlObj = new URL(url, base);
    return { success: true, url: urlObj };
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
