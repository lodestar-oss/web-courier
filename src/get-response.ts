import {
  ServiceUnavailableError,
  TooManyRequestsError,
  ServerIsATeapotError,
  UnauthorizedError,
  UnexpectedError,
  NotFoundError,
  ClientError,
  ServerError,
} from "@/utils/errors/classes";
import { parseResponseBody } from "@/parse-response-body";
import { webFetch } from "@/web-fetch";

export async function getResponse({
  responseBodyFormat = "json",
  requestInit,
  fetchInput,
}: {
  responseBodyFormat?: "json" | "text";
  fetchInput: RequestInfo | URL;
  requestInit?: RequestInit;
}) {
  const response = await webFetch(fetchInput, requestInit);

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
      const retryAfter = response.headers.get("Retry-After");
      throw new TooManyRequestsError({
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
        statusText,
        status,
      });
    }

    if (status === 503) {
      const retryAfter = response.headers.get("Retry-After");
      throw new ServiceUnavailableError({
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
        statusText,
        status,
      });
    }

    if (status >= 400 && status < 500) {
      throw new ClientError({ statusText, status });
    }

    if (status >= 500) {
      let method = "GET";
      if (fetchInput instanceof Request) {
        method = fetchInput.method;
      }
      if (requestInit?.method) {
        method = requestInit.method;
      }
      const isIdempotent = [
        "OPTIONS",
        "DELETE",
        "TRACE",
        "HEAD",
        "GET",
        "PUT",
      ].includes(method);
      throw new ServerError({ retriable: isIdempotent, statusText, status });
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
}
