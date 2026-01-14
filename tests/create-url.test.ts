import { describe, expect, test } from "bun:test";

import { InvalidURLError } from "@/utils/errors/classes";
import { createURL } from "@/create-url";

describe("createURL function", () => {
  test("should create a URL object with valid url string", () => {
    const url = createURL("https://example.com");
    expect(url).toBeInstanceOf(URL);
  });

  test("should throw InvalidURLError with invalid url string", () => {
    expect(() => createURL("invalid-url")).toThrow(InvalidURLError);
  });
});
