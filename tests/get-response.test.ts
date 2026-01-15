/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Server } from "bun";

import { serveOptions, jsonContent, textContent, port } from "@tests/server";
import { beforeAll, afterAll, describe, expect, test } from "bun:test";

import { getResponse } from "@/get-response";

let server: Server<undefined>;
const baseUrl = `http://localhost:${port}`;

beforeAll(() => {
  server = Bun.serve(serveOptions);
});

describe("getResponse function", () => {
  test("should return text response body", async () => {
    const content = await getResponse({
      fetchInput: `${baseUrl}/text`,
      responseBodyFormat: "text",
    });
    expect(content).toBe(textContent);
  });

  test("should return JSON response body", async () => {
    const content = await getResponse({
      fetchInput: `${baseUrl}/json`,
      responseBodyFormat: "json",
    });
    expect(content).toStrictEqual(jsonContent);
  });
});

afterAll(async () => {
  await server.stop(true);
});
