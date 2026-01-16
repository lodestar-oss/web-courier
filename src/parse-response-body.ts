import { ReadResponseError, WebCourierError } from "@/utils/errors/classes";
import { createFallbackError } from "@/utils/errors/fallback";
import { parseJsonBody } from "@/utils/parse-json-body";

export async function parseResponseBody({
  format = "json",
  response,
}: {
  format?: "json" | "text";
  response: Response;
}) {
  try {
    const rawText = await response.text();

    if (format === "text") {
      return rawText;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return parseJsonBody(rawText);
  } catch (error) {
    if (error instanceof WebCourierError) {
      throw error;
    }

    if (error instanceof TypeError && response.bodyUsed) {
      throw new ReadResponseError({ cause: error });
    }

    const fallbackError = createFallbackError({
      context: { operation: "parseResponseBody", format },
      error,
    });
    throw fallbackError;
  }
}
