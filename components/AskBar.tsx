import { ArrowRight, FileText, Loader2, Search, Upload } from "lucide-react";
import { useRef } from "react";
import { LIMITS } from "@/lib/limits";
import { SAMPLES } from "@/lib/samples";

type Props = {
  question: string;
  onQuestion: (q: string) => void;
  sourceLabel: string;
  activeSample: string | null;
  onSample: (id: string) => void;
  onFiles: (files: File[]) => void;
  onAsk: () => void;
  running: boolean;
  error: string;
};

// Search-style ask bar: preset chips, one rounded box with Ask inside, and a
// line saying which manuals are being searched.
export default function AskBar(p: Props) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            onClick={() => p.onSample(s.id)}
            disabled={p.running}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition disabled:opacity-60 ${
              p.activeSample === s.id ? "border-black/20 bg-white shadow-sm" : "border-black/5 bg-white/60 text-neutral-600 hover:bg-white"
            }`}
          >
            <span className="size-1.5 rounded-full" style={{ background: s.dot }} />
            {s.name}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          p.onAsk();
        }}
        className="card flex items-center gap-2 rounded-full! py-1.5 pr-1.5 pl-4"
      >
        <Search className="size-4 shrink-0 text-neutral-400" strokeWidth={1.75} />
        <input
          value={p.question}
          onChange={(e) => p.onQuestion(e.target.value)}
          maxLength={LIMITS.questionChars}
          placeholder="Describe the problem, e.g. the light is blinking orange…"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={p.running || !p.question.trim()}
          className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {p.running ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" strokeWidth={1.75} />}
          Ask
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-neutral-500">
        <span className="flex min-w-0 items-center gap-1.5">
          <FileText className="size-3.5 shrink-0" strokeWidth={1.75} />
          <span className="truncate">Searching {p.sourceLabel}</span>
        </span>
        <button
          onClick={() => fileInput.current?.click()}
          disabled={p.running}
          className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1 text-neutral-700 hover:border-black/25 disabled:opacity-60"
        >
          <Upload className="size-3.5" strokeWidth={1.75} /> Upload your PDFs
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = ""; // allow picking the same files again
            if (files.length) p.onFiles(files);
          }}
        />
      </div>
      <p className="px-1 text-[11px] text-neutral-400">
        Up to {LIMITS.files} PDFs, 4 MB, {LIMITS.pages} pages and {LIMITS.chunks} chunks per run.
      </p>
      {p.error && <p className="px-1 text-sm text-red-600">{p.error}</p>}
    </section>
  );
}
