import { Check } from "lucide-react";

export type StepState = "wait" | "run" | "done";
export type Step = { label: string; state: StepState; detail: string };

// Slim strip of the 4 pipeline steps: grey waiting, black pulsing, green done.
export default function StepStrip({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {steps.map((s, i) => (
        <li
          key={s.label}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
            s.state === "run"
              ? "animate-pulse border-black bg-black text-white"
              : s.state === "done"
                ? "border-green-200 bg-green-50 text-green-900"
                : "border-black/5 bg-white/70 text-neutral-400"
          }`}
        >
          <span
            className={`grid size-4 shrink-0 place-items-center rounded-full text-[10px] ${
              s.state === "done" ? "bg-green-500 text-white" : s.state === "run" ? "bg-white text-black" : "bg-neutral-200 text-neutral-500"
            }`}
          >
            {s.state === "done" ? <Check className="size-3" strokeWidth={3} /> : i + 1}
          </span>
          <span className="whitespace-nowrap font-medium">{s.label}</span>
          <span className="min-w-0 truncate opacity-75">{s.detail}</span>
        </li>
      ))}
    </ol>
  );
}
