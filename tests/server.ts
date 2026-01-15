import type { Serve } from "bun";

export const port = 3000;
export const textContent = "Hello there!";
export const jsonContent = { message: "Hello there!" };

export const serveOptions: Serve.Options<undefined> = {
  routes: {
    "/invalid-json": new Response("{ not json:"),
    "/json": Response.json(jsonContent),
    "/text": new Response(textContent),
  },
  port,
};
