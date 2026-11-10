import { answer } from "@/lib/agent";
import { fail, getKey, InputError, readJson } from "@/lib/http";
import { TOP_K } from "@/lib/limits";
import { MODELS, type Model } from "@/lib/types";
import { checkChunks, checkQuestion } from "@/lib/validate";

// Step 5: the model reads only the top 4 chunks and answers in JSON.
export async function POST(req: Request) {
  try {
    const key = getKey(req);
    const body = await readJson(req);
    const question = checkQuestion(body.question);
    const top = checkChunks(body.top, TOP_K).map((c, i) => ({
      ...c,
      score: Number((body.top as { score?: number }[])[i].score) || 0,
    }));
    if (!MODELS.includes(body.model as Model)) throw new InputError("Pick one of the listed models.");

    return Response.json(await answer(question, top, body.model as Model, key));
  } catch (err) {
    return fail(err);
  }
}
