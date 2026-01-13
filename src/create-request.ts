export function createRequest(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const request = new Request(input, init);
    return request;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
