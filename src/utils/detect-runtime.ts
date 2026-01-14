import type { Runtime } from "@/types";

export function detectRuntime(): Runtime {
  // 1. Bun
  if (typeof Bun !== "undefined") {
    return "bun";
  }

  // 2. Deno
  // @ts-expect-error - global
  if (typeof Deno !== "undefined") {
    return "deno";
  }

  // 3. Cloudflare Workers
  if (navigator.userAgent === "Cloudflare-Workers") {
    return "cloudflare-workers";
  }

  // 4. Node.js
  if (typeof process !== "undefined" && process.versions?.node) {
    return "node";
  }

  // 5. Browser (Generic)
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return "browser";
  }

  return "unknown";
}
