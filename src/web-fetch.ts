import { InvalidURLError, UnexpectedError } from "@/utils/errors/classes";
import { createRequest } from "@/create-request";

export async function webFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const request = createRequest(input, init);
    const response = await fetch(request);
    return response;
  } catch (error) {
    if (error instanceof InvalidURLError || error instanceof UnexpectedError) {
      throw error;
    }
    throw error;
  }
}
