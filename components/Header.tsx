import { BookOpenText } from "lucide-react";
import { MODELS, type Model } from "@/lib/types";

type Props = { model: Model; onModel: (m: Model) => void; disabled: boolean };

const LABELS: Record<Model, string> = { "gpt-5-mini": "gpt-5-mini", "gpt-6.1-sol": "gpt-6.1-sol · cheaper" };

// Title on the left, model switch at the top right.
export default function Header({ model, onModel, disabled }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-black text-white">
          <BookOpenText className="size-4.5" strokeWidth={1.75} />
        </span>
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight">Manual Helper</h1>
          <p className="text-xs text-neutral-500">Troubleshoot a device and get the exact step to follow.</p>
        </div>
      </div>
      <div role="radiogroup" aria-label="Model" className="flex rounded-full border border-black/5 bg-white p-1 shadow-sm">
        {MODELS.map((m) => (
          <button
            key={m}
            role="radio"
            aria-checked={model === m}
            disabled={disabled}
            onClick={() => onModel(m)}
            className={`rounded-full px-3 py-1 text-xs transition disabled:opacity-60 ${
              model === m ? "bg-black text-white" : "text-neutral-600 hover:text-black"
            }`}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>
    </header>
  );
}
