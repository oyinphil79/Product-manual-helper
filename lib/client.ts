// Browser-side helper: POST to one of our API routes with the visitor's key.

export const KEY_STORAGE = "openai-key";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function callApi<T>(path: string, body: object | FormData, key: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (key) headers["x-openai-key"] = key;
  const isForm = body instanceof FormData;
  if (!isForm) headers["content-type"] = "application/json";

  const res = await fetch(`/api/${path}`, {
    method: "POST",
    headers,
    body: isForm ? body : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ error: "The server sent a reply we could not read." }));
  if (!res.ok || data.error) throw new ApiError(data.error ?? `Request failed (${res.status}).`, res.status);
  return data as T;
}

// Pages from different PDFs can share a number, so key them by both.
export const pageKey = (doc: string, page: number) => `${doc}#${page}`;
