import { InputError } from "./http";
import { EMBED_DIMS, LIMITS } from "./limits";
import type { Chunk, IndexedChunk, Page } from "./types";

// Plain checks on what the browser sends, so routes can trust their inputs.

export function checkQuestion(value: unknown): string {
  const q = typeof value === "string" ? value.trim() : "";
  if (!q) throw new InputError("Type a question first.");
  if (q.length > LIMITS.questionChars) throw new InputError(`Keep the question under ${LIMITS.questionChars} characters.`);
  return q;
}

export function checkPages(value: unknown): Page[] {
  if (!Array.isArray(value) || value.length === 0) throw new InputError("No pages were sent.");
  if (value.length > LIMITS.pages) throw new InputError(`At most ${LIMITS.pages} pages at a time.`);
  return value.map((p) => {
    if (typeof p?.text !== "string" || typeof p?.doc !== "string" || !Number.isInteger(p?.page)) {
      throw new InputError("Each page needs a doc name, a page number and its text.");
    }
    return { doc: p.doc, page: p.page, text: p.text };
  });
}

export function checkChunks(value: unknown, max = LIMITS.chunks): Chunk[] {
  if (!Array.isArray(value) || value.length === 0) throw new InputError("No chunks were sent.");
  if (value.length > max) throw new InputError(`Too many chunks (max ${max}). Use fewer or shorter PDFs.`);
  return value.map((c) => {
    if (!Number.isInteger(c?.id) || !Number.isInteger(c?.page) || typeof c?.text !== "string" || typeof c?.doc !== "string") {
      throw new InputError("Each chunk needs an id, a doc, a page number and text.");
    }
    if (!c.text.trim()) throw new InputError("A chunk was empty.");
    return { id: c.id, doc: c.doc, page: c.page, text: c.text };
  });
}

export function checkIndex(value: unknown): IndexedChunk[] {
  const chunks = checkChunks(value);
  return chunks.map((c, i) => {
    const vector = (value as { vector?: unknown }[])[i].vector;
    if (!Array.isArray(vector) || vector.length !== EMBED_DIMS || !vector.every((x) => typeof x === "number")) {
      throw new InputError(`Every chunk needs a ${EMBED_DIMS}-number vector. Run the search again.`);
    }
    return { ...c, vector };
  });
}
