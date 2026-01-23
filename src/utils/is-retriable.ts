import { WebCourierHTTPError, WebCourierError } from "@/utils/errors/classes";

export const retriableHTTPStatusCodes = [
  408, 409, 425, 429, 500, 502, 503, 504,
];

export function isRetriable(error: unknown): boolean {
  if (
    error instanceof WebCourierHTTPError &&
    retriableHTTPStatusCodes.includes(error.status)
  ) {
    return true;
  }

  if (error instanceof WebCourierError) {
    if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT_ERROR") {
      return true;
    }
  }

  return false;
}
