import { UnexpectedError } from "@/utils/errors/classes";
import { SUPPORTED_RUNTIMES } from "@/utils/constants";
import { detectRuntime } from "@/utils/detect-runtime";

export function createFallbackError({
  context = {},
  message,
  error,
}: {
  context?: Record<string, unknown>;
  message?: string;
  error: unknown;
}): UnexpectedError {
  const runtime = detectRuntime();
  const isSupported = SUPPORTED_RUNTIMES.includes(runtime);

  // Auto-inject runtime info into context for easier debugging
  const finalContext = {
    ...context,
    isSupported,
    runtime,
  };

  let finalMessage = message;

  if (!finalMessage) {
    if (!isSupported) {
      finalMessage = `An unexpected error occurred in an unsupported runtime (${runtime}). Please open an issue.`;
    } else if (error instanceof Error) {
      finalMessage = error.message;
    } else {
      finalMessage = String(error);
    }
  }

  return new UnexpectedError(finalMessage, {
    context: finalContext,
    cause: error,
  });
}
