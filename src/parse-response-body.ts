import {
  type JSONParserResult,
  jsonParser,
} from "@/utils/response-parsers/json";
import {
  type BlobParserResult,
  blobParser,
} from "@/utils/response-parsers/blob";

export function parseResponseBody(args: {
  format?: undefined;
  response: Response;
}): Promise<JSONParserResult>;

export function parseResponseBody(args: {
  response: Response;
  format: "json";
}): Promise<JSONParserResult>;

export function parseResponseBody(args: {
  response: Response;
  format: "blob";
}): Promise<BlobParserResult>;

// eslint-disable-next-line perfectionist/sort-modules
export async function parseResponseBody({
  format = "json",
  response,
}: {
  format?: "json" | "blob";
  response: Response;
}): Promise<JSONParserResult | BlobParserResult> {
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
