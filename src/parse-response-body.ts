import type { ParserErrorCode, WebCourierError } from "@/utils/errors/classes";
import type { Result } from "@/types/result";

import { jsonParser } from "@/utils/response-parsers/json";
import { blobParser } from "@/utils/response-parsers/blob";

export type ParseResponseBodyErrorCode =
  | ParserErrorCode
  | "INVALID_JSON"
  | "UNKNOWN";

export async function parseResponseBody({
  format = "json",
  response,
}: {
  format?: "json" | "blob";
  response: Response;
}): Promise<
  Result<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    WebCourierError<ParseResponseBodyErrorCode>
  >
> {
  switch (format) {
    case "json": {
      return await jsonParser(response);
    }
    case "blob": {
      return await blobParser(response);
    }
    default: {
      return await jsonParser(response);
    }
  }
}
