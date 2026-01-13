import type { Runtime } from "@/types";

export function detectRuntime(): Runtime {
  if (typeof Bun !== "undefined") {
    return "bun";
  }
  // @ts-expect-error - expected
  if (typeof Deno !== "undefined") {
    return "deno";
  }

  if (typeof process !== "undefined" && process.versions?.node) {
    return "node";
  }

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return "browser";
  }

  return "unknown";
}
