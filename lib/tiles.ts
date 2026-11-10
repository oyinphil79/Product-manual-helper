import type { TileView } from "@/components/PageTile";
import { pageKey } from "./client";
import type { Chunk, Page, Scored } from "./types";

type Input = { pages: Page[]; chunks: Chunk[]; ranked: Scored[]; top: Scored[]; usedIds: number[]; reading: boolean };

// Works out what every page tile should show at this moment of the run.
export function buildTiles({ pages, chunks, ranked, top, usedIds, reading }: Input): TileView[] {
  const count = new Map<string, number>();
  for (const c of chunks) count.set(pageKey(c.doc, c.page), (count.get(pageKey(c.doc, c.page)) ?? 0) + 1);

  // Best score per page; ranked is sorted, so the first hit per page wins.
  const best = new Map<string, number>();
  for (const c of ranked) if (!best.has(pageKey(c.doc, c.page))) best.set(pageKey(c.doc, c.page), c.score);
  // Stretch scores between the worst and best page so the heatmap has contrast.
  const scores = [...best.values()];
  const hi = Math.max(...scores);
  const lo = Math.min(...scores);

  const docs = new Set(pages.map((p) => p.doc));
  return pages.map((p) => {
    const key = pageKey(p.doc, p.page);
    const s = best.get(key);
    return {
      ...p,
      reading,
      chunks: count.get(key) ?? 0,
      heat: s === undefined ? null : hi > lo ? (s - lo) / (hi - lo) : 1,
      ranks: top.flatMap((c, i) => (pageKey(c.doc, c.page) === key ? [i + 1] : [])),
      used: top.some((c) => usedIds.includes(c.id) && pageKey(c.doc, c.page) === key),
      showDoc: docs.size > 1,
    };
  });
}
