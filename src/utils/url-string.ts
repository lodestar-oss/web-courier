import type { Branded } from "@/types/brand";

import { createURL } from "@/create-url";

type URLString = Branded<string, "URLString">;

export function isUrlString(value: string): value is URLString {
  try {
    createURL(value);
    return true;
  } catch {
    return false;
  }
}

export function assertUrlString(value: string): asserts value is URLString {
  createURL(value);
}
