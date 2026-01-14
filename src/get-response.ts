import {
  TooManyRequestsError,
  ServerIsATeapotError,
  UnauthorizedError,
  InvalidJsonError,
  InvalidURLError,
  UnexpectedError,
  NotFoundError,
  NetworkError,
  ClientError,
  ServerError,
} from "@/utils/errors/classes";
import { createFallbackError } from "@/utils/errors/fallback";
import { parseResponseBody } from "@/parse-response-body";
import { createRequest } from "@/create-request";
import { webFetch } from "@/web-fetch";

export async function getResponse({
  responseBodyFormat,
  requestInit,
  fetchInput,
}: {
  responseBodyFormat?: "json" | "text";
  fetchInput: RequestInfo | URL;
  requestInit?: RequestInit;
}) {
  try {
    const request = createRequest(fetchInput, requestInit);
    const response = await webFetch(request);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await parseResponseBody({
      format: responseBodyFormat,
      response,
    });

    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return body;
    }

    const status = response.status;
    if (status === 401 || status === 403) {
      throw new UnauthorizedError({ response, request });
    }

    if (status === 404) {
      throw new NotFoundError({ response, request });
    }

    if (status === 418) {
      throw new ServerIsATeapotError({ response, request });
    }

    if (status === 429) {
      throw new TooManyRequestsError({ response, request });
    }

    if (status >= 400 && status < 500) {
      throw new ClientError({ response, request });
    }

    if (status >= 500) {
      throw new ServerError({ response, request });
    }

    const fallbackError = new UnexpectedError("Unexpected HTTP status code", {
      context: {
        inputs: { responseBodyFormat, requestInit, fetchInput },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        outputs: { parsedBody: body, response },
        operation: "getResponse",
      },
    });
    throw fallbackError;
  } catch (error) {
    if (
      error instanceof NetworkError ||
      error instanceof InvalidURLError ||
      error instanceof InvalidJsonError ||
      error instanceof ServerError ||
      error instanceof ClientError ||
      error instanceof ServerIsATeapotError ||
      error instanceof TooManyRequestsError ||
      error instanceof UnauthorizedError ||
      error instanceof NotFoundError ||
      error instanceof UnexpectedError
    ) {
      throw error;
    }

    const fallbackError = createFallbackError({
      context: {
        inputs: { responseBodyFormat, requestInit, fetchInput },
        operation: "getResponse",
      },
      error,
    });
    throw fallbackError;
  }
}
