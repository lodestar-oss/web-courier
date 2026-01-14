export class ServerIsATeapotError extends Error {
  code: "WEB_COURIER_SERVER_IS_A_TEAPOT_ERROR";
  response: Response;
  request: Request;
  retriable: false;
  expected: true;

  constructor({ response, request }: { response: Response; request: Request }) {
    super(
      "The server refuses to brew coffee because it is, permanently, a teapot"
    );
    this.name = "ServerIsATeapotError";
    this.code = "WEB_COURIER_SERVER_IS_A_TEAPOT_ERROR";
    this.request = request;
    this.response = response;
    this.retriable = false;
    this.expected = true;
  }
}

export class ClientError extends Error {
  code: "WEB_COURIER_CLIENT_ERROR";
  response: Response;
  retriable: boolean;
  request: Request;
  expected: true;

  constructor({
    retriable = false,
    response,
    request,
  }: {
    retriable?: boolean;
    response: Response;
    request: Request;
  }) {
    super(`[${response.status}] ${response.statusText}`);
    this.name = "ClientError";
    this.code = "WEB_COURIER_CLIENT_ERROR";
    this.request = request;
    this.response = response;
    this.retriable = retriable;
    this.expected = true;
  }
}

export class NetworkError extends Error {
  inputs: { input: RequestInfo | URL; init?: RequestInit };
  code: "WEB_COURIER_NETWORK_ERROR";
  retriable: true;
  expected: true;

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
    this.name = "NetworkError";
    this.inputs = inputs;
    this.code = "WEB_COURIER_NETWORK_ERROR";
    this.retriable = true;
    this.expected = true;
  }
}

export class InvalidURLError extends Error {
  inputs: { base?: string | URL; url: string | URL };
  code: "WEB_COURIER_INVALID_URL_ERROR";
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
    this.name = "InvalidURLError";
    this.code = "WEB_COURIER_INVALID_URL_ERROR";
    this.inputs = inputs;
    this.expected = true;
    this.retriable = false;
  }
}

export class TooManyRequestsError extends Error {
  code: "WEB_COURIER_TOO_MANY_REQUESTS_ERROR";
  response: Response;
  request: Request;
  retriable: true;
  expected: true;

  constructor({ response, request }: { response: Response; request: Request }) {
    super(`[${response.status}] ${response.statusText}`);
    this.name = "TooManyRequestsError";
    this.code = "WEB_COURIER_TOO_MANY_REQUESTS_ERROR";
    this.request = request;
    this.response = response;
    this.retriable = true;
    this.expected = true;
  }
}

export class UnauthorizedError extends Error {
  code: "WEB_COURIER_UNAUTHORIZED_ERROR";
  response: Response;
  request: Request;
  retriable: false;
  expected: true;

  constructor({ response, request }: { response: Response; request: Request }) {
    super(`[${response.status}] ${response.statusText}`);
    this.name = "UnauthorizedError";
    this.code = "WEB_COURIER_UNAUTHORIZED_ERROR";
    this.request = request;
    this.response = response;
    this.retriable = false;
    this.expected = true;
  }
}

export class NotFoundError extends Error {
  code: "WEB_COURIER_NOT_FOUND_ERROR";
  response: Response;
  request: Request;
  retriable: false;
  expected: true;

  constructor({ response, request }: { response: Response; request: Request }) {
    super(`[${response.status}] ${response.statusText}`);
    this.name = "NotFoundError";
    this.code = "WEB_COURIER_NOT_FOUND_ERROR";
    this.request = request;
    this.response = response;
    this.retriable = false;
    this.expected = true;
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

export class InvalidJsonError extends Error {
  code: "WEB_COURIER_INVALID_JSON_ERROR";
  retriable: false;
  rawText: string;
  expected: true;

  constructor({ rawText, cause }: { cause: SyntaxError; rawText: string }) {
    super("Response body is not valid JSON", { cause });
    this.name = "InvalidJsonError";
    this.code = "WEB_COURIER_INVALID_JSON_ERROR";
    this.retriable = false;
    this.rawText = rawText;
    this.expected = true;
  }
}

export class ReadResponseError extends Error {
  code: "WEB_COURIER_READ_RESPONSE_ERROR";
  response: Response;
  retriable: false;
  expected: true;

  constructor({ response }: { response: Response }) {
    super("This response body stream has been locked or disturbed");
    this.name = "ReadResponseError";
    this.code = "WEB_COURIER_READ_RESPONSE_ERROR";
    this.response = response;
    this.retriable = false;
    this.expected = true;
  }
}
