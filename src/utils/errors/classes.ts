export type WebCourierErrorCode =
  | "INVALID_REQUEST_INIT_OPTIONS"
  | "REQUEST_URL_HAS_CREDENTIALS"
  | "INVALID_URL"
  | "UNKNOWN";

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
