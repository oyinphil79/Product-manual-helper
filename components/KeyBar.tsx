import { ExternalLink, KeyRound } from "lucide-react";

type Props = { value: string; onChange: (v: string) => void; error: string };

// The "Live" bar: the visitor's own OpenAI key, kept only in this tab.
export default function KeyBar({ value, onChange, error }: Props) {
  return (
    <section className="card px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
          Live
        </span>
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 focus-within:border-black/30">
          <KeyRound className="size-3.5 shrink-0 text-neutral-400" strokeWidth={1.75} />
          <span className="sr-only">OpenAI API key</span>
          <input
            type="password"
            value={value}
            onChange={(e) => onChange(e.target.value.trim())}
            placeholder="sk-… your OpenAI API key"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </label>
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs text-neutral-600 underline-offset-2 hover:text-black hover:underline"
        >
          Get an API key <ExternalLink className="size-3" strokeWidth={1.75} />
        </a>
      </div>
      <p className="mt-2 text-xs text-neutral-500">Runs for real on your key. It stays in this browser tab and is never saved.</p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </section>
  );
}
