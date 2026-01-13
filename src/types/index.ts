import type { Branded } from "@/types/brand";

export type URLString = Branded<string, "URLString"> & string;
