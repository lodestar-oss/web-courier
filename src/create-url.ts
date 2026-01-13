import { createFallbackError } from "@/utils/errors/fallback";
import { InvalidURLError } from "@/utils/errors/classes";

export function createURL(url: string | URL, base?: string | URL) {
  try {
    const urlObj = new URL(url, base);
    return urlObj;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new InvalidURLError(`Invalid URL: ${url}`, {
        inputs: { base, url },
        cause: error,
      });
    }

    const fallbackError = createFallbackError({
      context: {
        operation: "createURL",
        inputs: { base, url },
      },
      error,
    });
    throw fallbackError;
  }
}
