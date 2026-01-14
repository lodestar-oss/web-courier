import type { Branded } from "@/types/brand";

export type Runtime =
  | "cloudflare-workers"
  | "browser"
  | "unknown"
  | "node"
  | "deno"
  | "bun";

export type URLString = Branded<string, "URLString"> & string;
