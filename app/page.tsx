"use client";

import { useEffect, useState } from "react";
import AnswerCard from "@/components/AnswerCard";
import AskBar from "@/components/AskBar";
import ChunkList from "@/components/ChunkList";
import Header from "@/components/Header";
import KeyBar from "@/components/KeyBar";
import PageWall from "@/components/PageWall";
import StepStrip, { type Step, type StepState } from "@/components/StepStrip";
import { ApiError, callApi, KEY_STORAGE } from "@/lib/client";
import { SAMPLES, samplePages } from "@/lib/samples";
import { buildTiles } from "@/lib/tiles";
import type { Answer, Chunk, IndexedChunk, Model, Page, Scored } from "@/lib/types";

type Source = { kind: "sample"; id: string } | { kind: "upload"; files: File[] };
const LABELS = ["Read & chunk", "Embed", "Search", "Answer"];
const idle = (): Step[] => LABELS.map((label) => ({ label, state: "wait", detail: "" }));

export default function Home() {
  const [key, setKey] = useState("");
  const [model, setModel] = useState<Model>("gpt-5-mini");
  const [source, setSource] = useState<Source>({ kind: "sample", id: SAMPLES[0].id });
  const [question, setQuestion] = useState(SAMPLES[0].question);
  const [pages, setPages] = useState<Page[]>(() => samplePages(SAMPLES[0].id));
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [index, setIndex] = useState<IndexedChunk[] | null>(null); // the vector index, kept in the browser
  const [ranked, setRanked] = useState<Scored[]>([]);
  const [top, setTop] = useState<Scored[]>([]);
  const [result, setResult] = useState<Answer | null>(null);
  const [steps, setSteps] = useState<Step[]>(idle);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [keyError, setKeyError] = useState("");

  // The key lives in sessionStorage only: gone when the tab closes.
  useEffect(() => setKey(sessionStorage.getItem(KEY_STORAGE) ?? ""), []);
  const saveKey = (k: string) => {
    setKey(k);
    setKeyError("");
    if (k) sessionStorage.setItem(KEY_STORAGE, k);
    else sessionStorage.removeItem(KEY_STORAGE);
  };

  // A new set of manuals means the old index no longer applies.
  function switchSource(next: Source, nextPages: Page[]) {
    setSource(next);
    setPages(nextPages);
    setChunks([]);
    setIndex(null);
    setRanked([]);
    setTop([]);
    setResult(null);
    setSteps(idle());
    setError("");
  }

  const mark = (i: number, state: StepState, detail = "") =>
    setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, state, detail } : s)));

  async function run() {
    if (running) return;
    setRunning(true);
    setError("");
    setKeyError("");
    setRanked([]);
    setTop([]);
    setResult(null);
    setSteps(idle());
    let current = 0;
    try {
      let idx = index;
      // Only read, chunk and embed once per set of manuals; follow-ups reuse the index.
      if (!idx) {
        mark(0, "run", "reading pages…");
        const body = source.kind === "sample" ? { sampleId: source.id } : toForm(source.files);
        const read = await callApi<{ pages: Page[] }>("read", body, key);
        setPages(read.pages);
        const { chunks: cut } = await callApi<{ chunks: Chunk[] }>("chunk", { pages: read.pages }, key);
        setChunks(cut);
        mark(0, "done", `${read.pages.length} pages · ${cut.length} chunks`);

        current = 1;
        mark(1, "run", `${cut.length} chunks…`);
        idx = (await callApi<{ index: IndexedChunk[] }>("embed", { chunks: cut }, key)).index;
        setIndex(idx);
      } else {
        mark(0, "done", `${pages.length} pages · ${chunks.length} chunks`);
      }
      mark(1, "done", `${idx.length} vectors · 768-d`);

      current = 2;
      mark(2, "run", "scoring…");
      const found = await callApi<{ ranked: Scored[]; top: Scored[] }>("search", { question, index: idx }, key);
      setRanked(found.ranked);
      setTop(found.top);
      mark(2, "done", `top ${found.top.length} of ${found.ranked.length}`);

      current = 3;
      mark(3, "run", model);
      const answer = await callApi<Answer>("answer", { question, top: found.top, model }, key);
      setResult(answer);
      mark(3, "done", `${(answer.ms / 1000).toFixed(1)} s · ${answer.used.length} used`);
    } catch (err) {
      mark(current, "wait");
      const message = err instanceof Error ? err.message : "Something went wrong.";
      if (err instanceof ApiError && err.status === 401) setKeyError(message);
      else setError(message);
    } finally {
      setRunning(false);
    }
  }

  const usedIds = result ? result.used.map((n) => top[n - 1]?.id).filter((id) => id !== undefined) : [];
  const tiles = buildTiles({ pages, chunks, ranked, top, usedIds, reading: steps[0].state === "run" });
  const lifted = result ? (top[result.used[0] - 1] ?? top[0]) : null;
  const liftedPage = lifted ? pages.find((p) => p.doc === lifted.doc && p.page === lifted.page) : null;
  const sourceLabel =
    source.kind === "sample"
      ? `the ${SAMPLES.find((s) => s.id === source.id)!.name.toLowerCase()} manual (sample)`
      : source.files.map((f) => f.name).join(", ");

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:py-10">
      <Header model={model} onModel={setModel} disabled={running} />
      <KeyBar value={key} onChange={saveKey} error={keyError} />
      <AskBar
        question={question}
        onQuestion={setQuestion}
        sourceLabel={sourceLabel}
        activeSample={source.kind === "sample" ? source.id : null}
        onSample={(id) => {
          switchSource({ kind: "sample", id }, samplePages(id));
          setQuestion(SAMPLES.find((s) => s.id === id)!.question);
        }}
        onFiles={(files) => switchSource({ kind: "upload", files }, [])}
        onAsk={run}
        running={running}
        error={error}
      />
      {result && lifted && <AnswerCard result={result} source={lifted} pageText={liftedPage?.text ?? lifted.text} model={model} />}
      <PageWall tiles={tiles} placeholders={source.kind === "upload" ? 8 : 0} strip={<StepStrip steps={steps} />} />
      <ChunkList ranked={ranked} topIds={top.map((c) => c.id)} usedIds={usedIds} />
    </main>
  );
}

function toForm(files: File[]): FormData {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return form;
}
