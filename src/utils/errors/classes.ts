export type WebCourierErrorCode =
  | "INVALID_REQUEST_INIT_OPTIONS"
  | "INVALID_URL"
  | "UNKNOWN";

export interface WebCourierErrorOptions extends ErrorOptions {
  code: WebCourierErrorCode;
}

export class WebCourierError extends Error {
  code: WebCourierErrorCode;
  constructor(message: string, options: WebCourierErrorOptions) {
    super(message, { cause: options.cause });
    this.code = options.code;
  }
}
