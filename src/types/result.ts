export type Result<TData, TError> =
  | { success: false; error: TError }
  | { success: true; data: TData };
