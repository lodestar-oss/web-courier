import {
  ReadResponseError,
  InvalidJsonError,
  UnexpectedError,
} from "@/utils/errors/classes";
import { createFallbackError } from "@/utils/errors/fallback";
import { parseJsonBody } from "@/utils/parse-json-body";

export async function parseResponseBody({
  format = "json",
  response,
}: {
  format?: "json" | "text";
  response: Response;
}) {
  if (response.bodyUsed) {
    throw new ReadResponseError();
  }

  try {
    const rawText = await response.text();

    if (format === "text") {
      return rawText;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await parseJsonBody(rawText);
  } catch (error) {
    if (error instanceof InvalidJsonError || error instanceof UnexpectedError) {
      throw error;
    }

    const fallbackError = createFallbackError({
      context: { operation: "parseResponseBody", inputs: { response, format } },
      error,
    });
    throw fallbackError;
  }
}
