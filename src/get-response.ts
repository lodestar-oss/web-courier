import {
  TooManyRequestsError,
  ServerIsATeapotError,
  UnauthorizedError,
  UnexpectedError,
  WebCourierError,
  NotFoundError,
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

    if (!response.ok) {
      const status = response.status;
      const statusText = response.statusText;
      if (status === 401 || status === 403) {
        throw new UnauthorizedError({ statusText, status });
      }

      if (status === 404) {
        throw new NotFoundError({ statusText, status });
      }

      if (status === 418) {
        throw new ServerIsATeapotError({ statusText, status });
      }

      if (status === 429) {
        throw new TooManyRequestsError({ statusText, status });
      }

      if (status >= 400 && status < 500) {
        throw new ClientError({ statusText, status });
      }

      if (status >= 500) {
        throw new ServerError({ statusText, status });
      }

      const fallbackError = new UnexpectedError("Unexpected HTTP status code", {
        context: {
          inputs: {
            url:
              fetchInput instanceof Request
                ? fetchInput.url
                : fetchInput.toString(),
          },
          outputs: { statusText, status },
          operation: "getResponse",
        },
      });
      throw fallbackError;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await parseResponseBody({
      format: responseBodyFormat,
      response,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return body;
  } catch (error) {
    if (error instanceof WebCourierError) {
      throw error;
    }

    const fallbackError = createFallbackError({
      context: {
        url:
          fetchInput instanceof Request
            ? fetchInput.url
            : fetchInput.toString(),
        operation: "getResponse",
      },
      error,
    });
    throw fallbackError;
  }
}
