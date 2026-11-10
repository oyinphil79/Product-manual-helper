// Shared shapes passed between the browser and the API routes.

export type Page = { doc: string; page: number; text: string };

export type Chunk = { id: number; doc: string; page: number; text: string };

// A chunk plus its embedding. A list of these is the whole "vector index".
export type IndexedChunk = Chunk & { vector: number[] };

export type Scored = Chunk & { score: number };

export type Answer = {
  answer: string;
  covered: "yes" | "partly" | "no";
  step: string; // e.g. "Step 3", or "" if the manual has no numbered step
  used: number[]; // 1-based positions in the top-4 list
  ms: number;
  inputTokens: number;
  outputTokens: number;
};

export const MODELS = ["gpt-5-mini", "gpt-6.1-sol"] as const;
export type Model = (typeof MODELS)[number];
