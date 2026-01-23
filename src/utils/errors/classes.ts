export type WebCourierErrorCode =
  | "INVALID_REQUEST_INIT_OPTIONS"
  | "REQUEST_URL_HAS_CREDENTIALS"
  | ParserErrorCode
  | "NETWORK_ERROR"
  | "INVALID_JSON"
  | "INVALID_URL"
  | "HTTP_ERROR"
  | "ABORTED"
  | "TIMEOUT"
  | "UNKNOWN";

export interface WebCourierHTTPErrorOptions extends WebCourierErrorOptions<"HTTP_ERROR"> {
  code: "HTTP_ERROR";
  statusText: string;
  status: number;
  method: string;
  url: string;
}

export interface WebCourierErrorOptions<
  TCode extends WebCourierErrorCode,
> extends ErrorOptions {
  code: TCode;
}

export type ParserErrorCode = "BODY_STREAM_WAS_READ" | "DECODING_ERROR";

export class WebCourierError<TCode extends WebCourierErrorCode> extends Error {
  code: TCode;

  constructor(message: string, options: WebCourierErrorOptions<TCode>) {
    super(message, { cause: options.cause });
    this.code = options.code;
  }
}

export class WebCourierHTTPError extends WebCourierError<"HTTP_ERROR"> {
  statusText: string;
  status: number;
  method: string;
  url: string;

  constructor({
    statusText,
    method,
    status,
    cause,
    code,
    url,
  }: WebCourierHTTPErrorOptions) {
    super(`HTTP Error: [${method}] "${url}": ${status} ${statusText}`, {
      cause,
      code,
    });
    this.statusText = statusText;
    this.status = status;
    this.method = method;
    this.url = url;
  }
}
