import type { WebCourierError } from "@/utils/errors/classes";
import type { Result } from "@/types/result";

import {
  type ParseResponseBodyErrorCode,
  parseResponseBody,
} from "@/parse-response-body";
import { type WebFetchErrorCode, webFetch } from "@/web-fetch";
import { WebCourierHTTPError } from "@/utils/errors/classes";
import { createRequest } from "@/create-request";

export async function getResponse({
  format,
  input,
  init,
}: {
  format?: "json" | "blob";
  input: RequestInfo | URL;
  init?: RequestInit;
}): Promise<
  Result<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    WebCourierError<
      ParseResponseBodyErrorCode | WebFetchErrorCode | "HTTP_ERROR"
    >
  >
> {
  const createRequestResult = createRequest({ input, init });
  if (!createRequestResult.success) {
    return createRequestResult;
  }
  const request = createRequestResult.data;

  const fetchResult = await webFetch({ input: request });
  if (!fetchResult.success) {
    return fetchResult;
  }
  const response = fetchResult.data;

  if (!response.ok) {
    const httpError = new WebCourierHTTPError({
      statusText: response.statusText,
      status: response.status,
      method: request.method,
      code: "HTTP_ERROR",
      url: request.url,
    });
    return { error: httpError, success: false };
  }

  return await parseResponseBody({
    response,
    format,
  });
}
