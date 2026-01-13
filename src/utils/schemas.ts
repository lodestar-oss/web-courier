import * as z from "zod";

export const URLStringSchema = z.url().brand<"URL">();
export type URLString = z.infer<typeof URLStringSchema>;
