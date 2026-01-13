import { UnexpectedError } from "@/utils/errors/classes";

export function createFallbackError({
  context,
  error,
}: {
  context?: Record<string, unknown>;
  error: unknown;
}): UnexpectedError {
  if (error instanceof Error) {
    return new UnexpectedError(error.message, { cause: error, context });
  }

  try {
    return new UnexpectedError(String(error), { cause: error, context });
  } catch {
    return new UnexpectedError("Unknown error", { cause: error, context });
  }
}
