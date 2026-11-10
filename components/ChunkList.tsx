import { ChevronRight } from "lucide-react";
import type { Scored } from "@/lib/types";

type Props = { ranked: Scored[]; topIds: number[]; usedIds: number[] };

// Every chunk ranked by cosine score. Collapsed by default.
export default function ChunkList({ ranked, topIds, usedIds }: Props) {
  if (ranked.length === 0) return null;
  const best = ranked[0].score || 1;

  return (
    <details className="card group p-4">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
        <ChevronRight className="size-4 transition group-open:rotate-90" strokeWidth={1.75} />
        All {ranked.length} chunks ranked by score
      </summary>
      <ol className="mt-3 space-y-2">
        {ranked.map((c, i) => {
          const inTop = topIds.includes(c.id);
          return (
            <li key={c.id} className={`rounded-xl border p-3 text-xs ${inTop ? "border-black/15 bg-neutral-50" : "border-black/5"}`}>
              <div className="mb-1.5 flex items-center gap-3">
                <span className="w-6 font-mono text-neutral-400">{i + 1}</span>
                <span className="font-mono">{c.score.toFixed(3)}</span>
                <span className="h-1 w-24 overflow-hidden rounded-full bg-neutral-100">
                  <span className="block h-full bg-green-500" style={{ width: `${Math.max(0, (c.score / best) * 100)}%` }} />
                </span>
                <span className="text-neutral-500">
                  {c.doc} · p.{c.page}
                </span>
                {inTop && <span className="rounded-full bg-black px-1.5 font-mono text-[10px] text-white">#{i + 1}</span>}
                {usedIds.includes(c.id) && <span className="text-green-700">used</span>}
              </div>
              <p className="line-clamp-2 text-neutral-600">{c.text}</p>
            </li>
          );
        })}
      </ol>
    </details>
  );
}
