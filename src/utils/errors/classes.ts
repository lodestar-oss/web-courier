export interface WebCourierErrorOptions extends ErrorOptions {
  code: WebCourierErrorCode;
}

export type WebCourierErrorCode = "INVALID_URL";

export class WebCourierError extends Error {
  code: WebCourierErrorCode;
  constructor(message: string, options: WebCourierErrorOptions) {
    super(message, { cause: options.cause });
    this.code = options.code;
  }
}
