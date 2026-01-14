import type { Runtime } from "@/types";

export function detectRuntime(): Runtime {
  // 1. Bun (Global object)
  if (typeof Bun !== "undefined") {
    return "bun";
  }

  // 2. Deno (Global object)
  // @ts-expect-error - expected Deno global
  if (typeof Deno !== "undefined") {
    return "deno";
  }

  // 3. Cloudflare Workers
  if (
    // @ts-expect-error - WebSocketPair is a Cloudflare Workers global
    typeof WebSocketPair !== "undefined"
  ) {
    return "cloudflare-workers";
  }

  // 4. Node.js
  // Check specifically for process.versions.node to avoid polyfills
  if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
  ) {
    return "node";
  }

  // 5. Browser
  // Check for window + document to distinguish from other edge runtimes
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return "browser";
  }

  return "unknown";
}
