import { UnexpectedError } from "@/utils/errors/classes";
import { SUPPORTED_RUNTIMES } from "@/utils/constants";
import { detectRuntime } from "@/utils/detect-runtime";

export function createFallbackError({
  message,
  context,
  error,
}: {
  context?: Record<string, unknown>;
  message?: string;
  error: unknown;
}): UnexpectedError {
  const runtime = detectRuntime();
  const runtimeWarningMessage =
    "An unexpected error occurred. This can happen because your runtime is not currently supported by web-courier. Please open an issue if you see this message.";
  const shouldWarn = !SUPPORTED_RUNTIMES.includes(runtime);

  const errorMessage =
    message ?? (shouldWarn ? runtimeWarningMessage : undefined);

  if (error instanceof Error) {
    return new UnexpectedError(errorMessage ?? error.message, {
      cause: error,
      context,
    });
  }

  try {
    return new UnexpectedError(errorMessage ?? String(error), {
      cause: error,
      context,
    });
  } catch {
    return new UnexpectedError(errorMessage ?? "Unknown error", {
      cause: error,
      context,
    });
  }
}
