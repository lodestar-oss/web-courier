import { NetworkError, TimeoutError, AbortError } from "@/utils/errors/classes";
import { createFallbackError } from "@/utils/errors/fallback";
import { detectRuntime } from "@/utils/detect-runtime";
import { createRequest } from "@/create-request";

export async function webFetch(input: RequestInfo | URL, init?: RequestInit) {
  const request = createRequest(input, init);
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    if (error instanceof TypeError) {
      const runtime = detectRuntime();

      if (runtime === "bun" || runtime === "deno") {
        // Only in Bun and Deno can we know for sure that TypeError means network error
        // In other runtimes, TypeError could also be caused by invalid values in RequestInit options
        throw new NetworkError("Network error", {
          inputs: { input, init },
          cause: error,
        });
      }
    }

    // This checks for native abort/timeout errors
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new AbortError(error.message, { cause: error });
      }
      if (error.name === "TimeoutError") {
        throw new TimeoutError(error.message, { cause: error });
      }
    }

    // This checks for custom abort reasons like `controller.abort(new Error('Custom reason'))`
    if (request.signal?.aborted) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const reason = request.signal.reason;
      let message = "Request was aborted";

      if (typeof reason === "string") {
        message = reason;
      } else if (reason instanceof Error) {
        message = reason.message;
      }

      throw new AbortError(message, { cause: error });
    }

    const fallbackError = createFallbackError({
      context: {
        operation: "webFetch",
        url: request.url,
      },
      error,
    });
    throw fallbackError;
  }
}
