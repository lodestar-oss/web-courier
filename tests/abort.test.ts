import type { Server } from "bun";

import { beforeAll, afterAll, describe, expect, test } from "bun:test";
import { serveOptions, port } from "@tests/server";

import { AbortError } from "@/utils/errors/classes";
import { webFetch } from "@/web-fetch";

let server: Server<undefined>;
const baseUrl = `http://localhost:${port}`;

beforeAll(() => {
  server = Bun.serve(serveOptions);
});

describe("webFetch function", () => {
  test("should handle abort error", () => {
    expect(async () => {
      const controller = new AbortController();
      const fetchPromise = webFetch(`${baseUrl}/long-response`, {
        signal: controller.signal,
      });
      controller.abort();
      await fetchPromise;
    }).toThrow(AbortError);
  });
});

afterAll(async () => {
  await server.stop(true);
});
