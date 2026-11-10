import { CHUNK_WORDS, OVERLAP_WORDS } from "./limits";
import type { Chunk, Page } from "./types";

// Sliding window over words: ~120 words per chunk, each one starting 30 words
// before the previous one ended, so a step split across a boundary still
// appears whole in at least one chunk. We chunk page by page, so a chunk never
// crosses a page and always knows its page number.
export function chunkPages(pages: Page[]): Chunk[] {
  const chunks: Chunk[] = [];
  const stride = CHUNK_WORDS - OVERLAP_WORDS;

  for (const p of pages) {
    const words = p.text.split(" ").filter(Boolean);
    for (let start = 0; start < words.length; start += stride) {
      const slice = words.slice(start, start + CHUNK_WORDS);
      chunks.push({ id: chunks.length, doc: p.doc, page: p.page, text: slice.join(" ") });
      // Stop once this window reached the end of the page; otherwise the next
      // window would only repeat the overlap.
      if (start + CHUNK_WORDS >= words.length) break;
    }
  }
  return chunks;
}
