import { Check } from "lucide-react";

export type TileView = {
  doc: string;
  page: number;
  text: string;
  reading: boolean;
  chunks: number; // stripes, one per chunk
  heat: number | null; // 0..1, how close this page's best chunk is to the question
  ranks: number[]; // which of #1..#4 came from this page
  used: boolean; // the model cited a chunk on this page
  showDoc: boolean;
};

// One page of the manual as a small sheet of paper.
export default function PageTile(t: TileView) {
  // Heatmap: blend from white towards green by how relevant the page is.
  const bg = t.heat === null ? "#ffffff" : `rgb(${255 - 135 * t.heat} ${255 - 45 * t.heat} ${255 - 120 * t.heat})`;
  const lines = t.text.split(" ").reduce<string[]>((acc, w, i) => {
    const row = Math.floor(i / 6);
    acc[row] = acc[row] ? `${acc[row]} ${w}` : w;
    return acc;
  }, []);

  return (
    <div
      className={`relative aspect-[3/4] overflow-hidden rounded-lg border p-2 shadow-sm transition-colors duration-500 ${
        t.used ? "border-green-600 ring-2 ring-green-600/30" : "border-black/10"
      } ${t.reading ? "animate-pulse" : ""}`}
      style={{ background: bg }}
      title={`${t.doc}, page ${t.page}`}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="font-mono text-[10px] text-neutral-500">p.{t.page}</span>
        {t.used && (
          <span className="grid size-4 place-items-center rounded-full bg-green-600 text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
        )}
      </div>
      {t.showDoc && <p className="truncate text-[9px] text-neutral-400">{t.doc}</p>}

      {/* A few faint lines of the page's real text. */}
      <div className="mt-1 space-y-0.5 text-[5.5px] leading-[7px] text-neutral-400/80 select-none">
        {lines.slice(0, 9).map((l, i) => (
          <p key={i} className="truncate">{l}</p>
        ))}
      </div>

      {t.ranks.length > 0 && (
        <div className="absolute right-1.5 bottom-4 flex gap-0.5">
          {t.ranks.map((r) => (
            <span key={r} className="rounded-full bg-black px-1.5 py-px font-mono text-[9px] text-white">#{r}</span>
          ))}
        </div>
      )}

      {/* One stripe per chunk cut from this page. */}
      {t.chunks > 0 && (
        <div className="absolute inset-x-1.5 bottom-1.5 flex gap-0.5">
          {Array.from({ length: t.chunks }, (_, i) => (
            <span key={i} className="h-1 flex-1 rounded-full bg-black/25" />
          ))}
        </div>
      )}
    </div>
  );
}
