/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Server } from "bun";

import {
  serveOptions,
  jsonContent,
  textContent,
  retryAfter,
  port,
} from "@tests/server";
import { beforeAll, afterAll, describe, expect, test } from "bun:test";

import {
  ServerIsATeapotError,
  TooManyRequestsError,
  UnauthorizedError,
  InvalidJsonError,
  NotFoundError,
} from "@/utils/errors/classes";
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
    });
    expect(content).toStrictEqual(jsonContent);
  });

  test("should throw InvalidJsonError for invalid JSON", () => {
    expect(
      async () =>
        await getResponse({
          fetchInput: `${baseUrl}/invalid-json`,
        })
    ).toThrow(InvalidJsonError);
  });

  test("should throw UnauthorizedError for 401 status code", () => {
    expect(
      async () =>
        await getResponse({
          fetchInput: `${baseUrl}/unauthorized`,
        })
    ).toThrow(UnauthorizedError);
  });

  test("should throw NotFoundError for 404 status code", () => {
    expect(
      async () =>
        await getResponse({
          fetchInput: `${baseUrl}/non-existent-route`,
        })
    ).toThrow(NotFoundError);
  });

  test("should throw ServerIsATeapotError for 418 status code", () => {
    expect(
      async () =>
        await getResponse({
          fetchInput: `${baseUrl}/get-coffee`,
        })
    ).toThrow(ServerIsATeapotError);
  });

  test("should throw TooManyRequestsError for 429 status code", () => {
    expect(
      async () =>
        await getResponse({
          fetchInput: `${baseUrl}/rate-limited`,
        })
    ).toThrow(
      new TooManyRequestsError({
        statusText: "Too Many Requests",
        retryAfter: retryAfter,
        status: 429,
      })
    );
  });
});

afterAll(async () => {
  await server.stop(true);
});
