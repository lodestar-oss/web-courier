import {
  WebCourierError,
  NetworkError,
  AbortError,
} from "@/utils/errors/classes";
import { createFallbackError } from "@/utils/errors/fallback";
import { detectRuntime } from "@/utils/detect-runtime";
import { createRequest } from "@/create-request";

export async function webFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const request = createRequest(input, init);
    const response = await fetch(request);
    return response;
  } catch (error) {
    if (error instanceof WebCourierError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new AbortError(error.message, { cause: error });
    }

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

    const fallbackError = createFallbackError({
      context: {
        url: input instanceof Request ? input.url : input.toString(),
        operation: "webFetch",
      },
      error,
    });
    throw fallbackError;
  }
}
