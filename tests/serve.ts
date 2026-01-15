import { serveOptions } from "@tests/server";

const server = Bun.serve(serveOptions);
console.log(`Server running on ${server.url}`);
