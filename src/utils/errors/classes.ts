export type WebCourierErrorCode =
  | "INVALID_REQUEST_INIT_OPTIONS"
  | "REQUEST_URL_HAS_CREDENTIALS"
  | "BODY_STREAM_WAS_READ"
  | "DECODING_ERROR"
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
}

export interface WebCourierErrorOptions<
  TCode extends WebCourierErrorCode,
> extends ErrorOptions {
  code: TCode;
}

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

  constructor(message: string, options: WebCourierHTTPErrorOptions) {
    super(message, options);
    this.statusText = options.statusText;
    this.status = options.status;
  }
}
