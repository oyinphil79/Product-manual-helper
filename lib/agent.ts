import OpenAI from "openai";
import { EMBED_DIMS } from "./limits";
import type { Answer, Model, Scored } from "./types";

// Every OpenAI call lives in this file, on the server. The key is passed in
// per request and never logged or stored.
const EMBED_MODEL = "text-embedding-3-small";

function client(apiKey: string) {
  return new OpenAI({ apiKey, maxRetries: 1 });
}

// Embeds many texts in one request. Rounding to 5 decimals keeps the index
// small enough to ship to the browser without changing any ranking.
export async function embed(texts: string[], apiKey: string): Promise<number[][]> {
  const res = await client(apiKey).embeddings.create({
    model: EMBED_MODEL,
    input: texts,
    dimensions: EMBED_DIMS,
  });
  return res.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding.map((x) => Math.round(x * 1e5) / 1e5));
}

const INSTRUCTIONS = `You help people troubleshoot a device using only excerpts from its manual.
Answer in at most 3 short sentences, telling the reader exactly what to do.
If an excerpt contains a numbered step that fixes the problem, name it in "step" (e.g. "Step 3"), otherwise use "".
Set "covered" to "yes" if the excerpts fully answer the question, "partly" if they answer only part of it, "no" if not at all.
If they cover only part, answer that part and say what is missing. Do not refuse.
Never use outside knowledge. List the excerpt numbers you relied on in "used".`;

// Structured output: the model must return exactly this JSON shape.
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["answer", "covered", "step", "used"],
  properties: {
    answer: { type: "string" },
    covered: { type: "string", enum: ["yes", "partly", "no"] },
    step: { type: "string" },
    used: { type: "array", items: { type: "integer" } },
  },
} as const;

export async function answer(
  question: string,
  top: Scored[],
  model: Model,
  apiKey: string,
): Promise<Answer> {
  // Number the excerpts so the model can cite them back to us.
  const excerpts = top
    .map((c, i) => `[${i + 1}] (${c.doc}, page ${c.page})\n${c.text}`)
    .join("\n\n");

  const started = Date.now();
  const res = await client(apiKey).responses.create({
    model,
    reasoning: { effort: "low" }, // short reading task, no deep thinking needed
    instructions: INSTRUCTIONS,
    input: `Manual excerpts:\n\n${excerpts}\n\nQuestion: ${question}`,
    text: { format: { type: "json_schema", name: "manual_answer", strict: true, schema: SCHEMA } },
  });

  const parsed = JSON.parse(res.output_text || "{}") as Partial<Answer>;
  return {
    answer: String(parsed.answer ?? "").trim() || "The model returned an empty answer.",
    covered: parsed.covered === "yes" || parsed.covered === "partly" ? parsed.covered : "no",
    step: String(parsed.step ?? ""),
    // Keep only citations that point at real excerpts.
    used: (parsed.used ?? []).filter((n) => Number.isInteger(n) && n >= 1 && n <= top.length),
    ms: Date.now() - started,
    inputTokens: res.usage?.input_tokens ?? 0,
    outputTokens: res.usage?.output_tokens ?? 0,
  };
}
