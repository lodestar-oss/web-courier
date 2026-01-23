import { WebCourierHTTPError } from "@/utils/errors/classes";
import { parseResponseBody } from "@/parse-response-body";
import { createRequest } from "@/create-request";
import { webFetch } from "@/web-fetch";

export async function getResponse({
  format,
  input,
  init,
}: {
  format?: "json" | "blob";
  input: RequestInfo | URL;
  init?: RequestInit;
}) {
  const createRequestResult = createRequest(input, init);
  if (!createRequestResult.success) {
    return createRequestResult;
  }
  const request = createRequestResult.data;

  const fetchResult = await webFetch(request);
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
