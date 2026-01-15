/* eslint-disable perfectionist/sort-modules */

// --- 1. The Base Class ---

export abstract class WebCourierError extends Error {
  abstract retriable: boolean;
  abstract expected: boolean;
  abstract code: string;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

// --- 2. Request & Network Errors ---

export class InvalidURLError extends WebCourierError {
  inputs: { base?: string | URL; url: string | URL };
  code = "WEB_COURIER_INVALID_URL_ERROR" as const;
  retriable = false;
  expected = true;

  constructor(
    message: string,
    {
      inputs,
      cause,
    }: { inputs: { base?: string | URL; url: string | URL }; cause: TypeError }
  ) {
    super(message, { cause });
    this.inputs = inputs;
  }
}

export class NetworkError extends WebCourierError {
  inputs: { input: RequestInfo | URL; init?: RequestInit };
  code = "WEB_COURIER_NETWORK_ERROR" as const;
  retriable = true;
  expected = true;

  constructor(
    message: string,
    {
      inputs,
      cause,
    }: {
      inputs: { input: RequestInfo | URL; init?: RequestInit };
      cause?: unknown;
    }
  ) {
    super(message, { cause });
    this.inputs = inputs;
  }
}

// --- 3. HTTP Protocol Errors (The Meat) ---

export class HttpError extends WebCourierError {
  // Generic code, meant to be overridden
  code: string = "WEB_COURIER_HTTP_ERROR";
  statusText: string;
  retriable: boolean;
  expected = true;
  status: number;

  constructor({
    statusText,
    retriable,
    status,
  }: {
    statusText: string;
    retriable: boolean;
    status: number;
  }) {
    super(`[${status}] ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.retriable = retriable;
  }
}

export class ServerError extends HttpError {
  override code = "WEB_COURIER_SERVER_ERROR";

  constructor(opts: {
    retriable: boolean;
    statusText: string;
    status: number;
  }) {
    // 5xx errors are retriable by default
    super(opts);
  }
}

export class ServiceUnavailableError extends ServerError {
  override code = "WEB_COURIER_SERVICE_UNAVAILABLE_ERROR" as const;
  retryAfter?: number; // In seconds, or undefined

  constructor(opts: {
    retryAfter?: number;
    statusText: string;
    status: number;
  }) {
    // 429 IS retriable
    super({ ...opts, retriable: true });
    this.retryAfter = opts.retryAfter;
  }
}

export class ClientError extends HttpError {
  override code = "WEB_COURIER_CLIENT_ERROR";

  constructor(
    opts: { statusText: string; status: number },
    // 4xx errors are NOT retriable by default (unless overridden)
    retriable = false
  ) {
    super({ ...opts, retriable });
  }
}

export class UnauthorizedError extends ClientError {
  override code = "WEB_COURIER_UNAUTHORIZED_ERROR" as const;
  // 401 is generally not retriable (need new token)
}

export class NotFoundError extends ClientError {
  override code = "WEB_COURIER_NOT_FOUND_ERROR" as const;
  // 404 is never retriable
}

export class ServerIsATeapotError extends ClientError {
  override code = "WEB_COURIER_SERVER_IS_A_TEAPOT_ERROR" as const;
}

export class TooManyRequestsError extends ClientError {
  override code = "WEB_COURIER_TOO_MANY_REQUESTS_ERROR" as const;
  retryAfter?: number; // In seconds, or undefined

  constructor(opts: {
    retryAfter?: number;
    statusText: string;
    status: number;
  }) {
    // 429 IS retriable
    super(opts, true);
    this.retryAfter = opts.retryAfter;
  }
}

// --- 4. Processing Errors ---

export class InvalidJsonError extends WebCourierError {
  code = "WEB_COURIER_INVALID_JSON_ERROR" as const;
  retriable = false;
  expected = true;
  rawText: string;

  constructor({ rawText, cause }: { cause: SyntaxError; rawText: string }) {
    super("Response body is not valid JSON", { cause });
    this.rawText = rawText;
  }
}

export class ReadResponseError extends WebCourierError {
  code = "WEB_COURIER_READ_RESPONSE_ERROR" as const;
  retriable = false;
  expected = true;

  constructor() {
    super("The response body stream has been locked or disturbed");
  }
}

export class UnexpectedError extends WebCourierError {
  code = "WEB_COURIER_UNEXPECTED_ERROR" as const;
  context?: Record<string, unknown>;
  retriable = false;
  expected = false; // The only "unexpected" one

  constructor(
    message: string,
    { context, cause }: { context?: Record<string, unknown>; cause?: unknown }
  ) {
    super(message, { cause });
    this.context = context;
  }
}

// --- 5. Abort Errors ---

export class AbortError extends WebCourierError {
  code = "WEB_COURIER_ABORT_ERROR" as const;
  retriable = false; // User cancelled, do not retry
  expected = true;

  constructor(message = "The request was aborted", options?: ErrorOptions) {
    super(message, options);
  }
}
