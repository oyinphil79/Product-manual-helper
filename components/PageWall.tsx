import type { ReactNode } from "react";
import PageTile, { type TileView } from "./PageTile";

type Props = { tiles: TileView[]; placeholders: number; strip: ReactNode };

// The always-visible wall of page tiles, with the step strip on top.
export default function PageWall({ tiles, placeholders, strip }: Props) {
  return (
    <section className="card space-y-4 p-4">
      {strip}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
        {tiles.map((t) => (
          <PageTile key={`${t.doc}#${t.page}`} {...t} />
        ))}
        {/* Uploaded PDFs have no pages until they are read. */}
        {tiles.length === 0 &&
          Array.from({ length: placeholders }, (_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-lg border border-dashed border-black/10 bg-neutral-50" />
          ))}
      </div>
      <p className="text-[11px] text-neutral-400">
        Tiles pulse while read, get one stripe per chunk, then turn green by how close their best chunk is to your question.
        #1–#4 mark the chunks sent to the model; a tick marks the pages it used.
      </p>
    </section>
  );
}
