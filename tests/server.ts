import type { Serve } from "bun";

export const port = 3000;
export const textContent = "Hello there!";
export const jsonContent = { message: "Hello there!" };
export const retryAfter = 60;

export const serveOptions: Serve.Options<undefined> = {
  routes: {
    "/rate-limited": new Response("Too Many Requests", {
      headers: { "Retry-After": retryAfter.toString() },
      status: 429,
    }),
    "/long-response": () => {
      Bun.sleepSync(3000);
      return new Response("Long Response", { status: 200 });
    },
    "/server-error": new Response("Internal Server Error", { status: 500 }),
    "/unauthorized": new Response("Unauthorized", { status: 401 }),
    "/client-error": new Response("Bad Request", { status: 400 }),
    "/get-coffee": new Response("I'm a teapot", { status: 418 }),
    "/invalid-json": new Response("{ not json:"),
    "/json": Response.json(jsonContent),
    "/text": new Response(textContent),
  },
  fetch() {
    return new Response("Not Found", { status: 404 });
  },
  port,
};
