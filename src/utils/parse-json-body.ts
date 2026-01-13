import { createFallbackError } from "@/utils/errors/fallback";
import { InvalidJsonError } from "@/utils/errors/classes";

export async function parseJsonBody(rawText: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await JSON.parse(rawText);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new InvalidJsonError({ cause: error, rawText });
    }

    const fallbackError = createFallbackError({
      context: { operation: "parseJsonBody", rawText },
      error,
    });
    throw fallbackError;
  }
}
