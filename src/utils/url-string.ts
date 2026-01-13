import type { URLString } from "@/types";

import { createURL } from "@/create-url";

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
