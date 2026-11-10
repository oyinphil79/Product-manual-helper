// Small helpers every API route shares.

export const NO_KEY = "Add your OpenAI API key at the top of the page.";

// Thrown on purpose for bad input; the message is safe to show the visitor.
export class InputError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

// The visitor's key wins; the server's .env.local key is only a fallback.
export function getKey(req: Request): string {
  const key = req.headers.get("x-openai-key")?.trim() || process.env.OPENAI_API_KEY?.trim();
  if (!key) throw new InputError(NO_KEY, 401);
  return key;
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    if (body && typeof body === "object") return body;
  } catch {}
  throw new InputError("The request body must be JSON.");
}

// Turns any thrown error into `{ error }` without leaking keys or stack traces.
export function fail(err: unknown): Response {
  if (err instanceof InputError) {
    return Response.json({ error: err.message }, { status: err.status });
  }
  const status = (err as { status?: number })?.status;
  if (status === 401) {
    return Response.json({ error: "OpenAI rejected that API key. Check it and try again." }, { status: 401 });
  }
  if (status === 429) {
    return Response.json({ error: "OpenAI rate limit or quota reached. Wait a moment and retry." }, { status: 429 });
  }
  if (status === 404) {
    return Response.json({ error: "That model is not available on your OpenAI account." }, { status: 400 });
  }
  if ((err as Error)?.name === "APIConnectionError") {
    return Response.json({ error: "Could not reach OpenAI. Check your connection and retry." }, { status: 502 });
  }
  console.error("Route failed:", (err as Error)?.message ?? "unknown error");
  return Response.json({ error: "Something went wrong talking to OpenAI. Please retry." }, { status: 500 });
}
