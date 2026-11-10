import { embed } from "@/lib/agent";
import { cosine } from "@/lib/cosine";
import { fail, getKey, readJson } from "@/lib/http";
import { TOP_K } from "@/lib/limits";
import { checkIndex, checkQuestion } from "@/lib/validate";

// Step 4: embed the question the same way, score every chunk, keep the best 4.
export async function POST(req: Request) {
  try {
    const key = getKey(req);
    const body = await readJson(req);
    const question = checkQuestion(body.question);
    const index = checkIndex(body.index);

    const [q] = await embed([question], key);
    // Drop vectors from the reply: the browser already has them.
    const ranked = index
      .map(({ vector, ...chunk }) => ({ ...chunk, score: cosine(q, vector) }))
      .sort((a, b) => b.score - a.score);

    return Response.json({ ranked, top: ranked.slice(0, TOP_K) });
  } catch (err) {
    return fail(err);
  }
}
