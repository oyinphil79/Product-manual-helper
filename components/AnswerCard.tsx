import { CircleAlert, Clock, ListOrdered } from "lucide-react";
import type { Answer, Model, Scored } from "@/lib/types";

type Props = { result: Answer; source: Scored; pageText: string; model: Model };

// The page the answer came from, "lifted out" of the wall, with the chunk the
// model used highlighted, next to the page number, the step and the answer.
export default function AnswerCard({ result, source, pageText, model }: Props) {
  const at = pageText.indexOf(source.text);
  const before = at >= 0 ? pageText.slice(0, at) : "";
  const after = at >= 0 ? pageText.slice(at + source.text.length) : "";

  return (
    <section className="card grid gap-6 p-5 sm:grid-cols-[minmax(0,15rem)_1fr]">
      <div className="mx-auto w-full max-w-60 -rotate-2 rounded-lg border border-black/10 bg-white p-3 shadow-[0_12px_30px_-10px_rgb(0_0_0/0.25)]">
        <p className="mb-1.5 font-mono text-[10px] text-neutral-500">
          {source.doc} · p.{source.page}
        </p>
        <p className="max-h-72 overflow-hidden text-[9px] leading-[13px] text-neutral-400">
          {before}
          <mark className="rounded-sm bg-green-200/70 px-0.5 text-neutral-800">{source.text}</mark>
          {after}
        </p>
      </div>

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-4xl font-semibold tracking-tight">Page {source.page}</h2>
          <span className="text-sm text-neutral-500">{source.doc}</span>
        </div>
        {result.step && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1 text-xs text-white">
            <ListOrdered className="size-3.5" strokeWidth={1.75} /> Follow {result.step}
          </span>
        )}
        <p className="text-[15px] leading-relaxed text-neutral-800">{result.answer}</p>
        {result.covered !== "yes" && (
          <p className="flex items-center gap-1.5 text-xs text-amber-700">
            <CircleAlert className="size-3.5" strokeWidth={1.75} />
            {result.covered === "partly" ? "The manual only covers part of this question." : "The manual does not seem to cover this."}
          </p>
        )}
        <p className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Clock className="size-3.5" strokeWidth={1.75} />
          {(result.ms / 1000).toFixed(1)} s · {result.inputTokens} in / {result.outputTokens} out tokens · {model}
        </p>
      </div>
    </section>
  );
}
