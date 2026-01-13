import { UnexpectedError } from "@/utils/errors/classes";

export function createFallbackError({
  message,
  context,
  error,
}: {
  context?: Record<string, unknown>;
  message?: string;
  error: unknown;
}): UnexpectedError {
  if (error instanceof Error) {
    return new UnexpectedError(message ?? error.message, {
      cause: error,
      context,
    });
  }

  try {
    return new UnexpectedError(message ?? String(error), {
      cause: error,
      context,
    });
  } catch {
    return new UnexpectedError(message ?? "Unknown error", {
      cause: error,
      context,
    });
  }
}
