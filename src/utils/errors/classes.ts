export class ParseURLError extends Error {
  inputs: { base?: string | URL; url: string | URL };
  code: "WEB_COURIER_PARSE_URL_ERROR";
  retriable: false;
  expected: true;

  constructor(
    message: string,
    {
      inputs,
      cause,
    }: { inputs: { base?: string | URL; url: string | URL }; cause: TypeError }
  ) {
    super(message, { cause });
    this.name = "ParseURLError";
    this.code = "WEB_COURIER_PARSE_URL_ERROR";
    this.inputs = inputs;
    this.expected = true;
    this.retriable = false;
  }
}

export class UnexpectedError extends Error {
  code: "WEB_COURIER_UNEXPECTED_ERROR";
  context?: Record<string, unknown>;
  retriable: false;
  expected: false;

  constructor(
    message: string,
    { context, cause }: { context?: Record<string, unknown>; cause?: unknown }
  ) {
    super(message, { cause });
    this.name = "UnexpectedError";
    this.context = context;
    this.code = "WEB_COURIER_UNEXPECTED_ERROR";
    this.retriable = false;
    this.expected = false;
  }
}
