import type { Serve } from "bun";

export const port = 3000;
export const textContent = "Hello there!";
export const jsonContent = { message: "Hello there!" };

export const serveOptions: Serve.Options<undefined> = {
  routes: {
    "/unauthorized": new Response("Unauthorized", { status: 401 }),
    "/invalid-json": new Response("{ not json:"),
    "/json": Response.json(jsonContent),
    "/text": new Response(textContent),
  },
  fetch() {
    return new Response("Not Found", { status: 404 });
  },
  port,
};
