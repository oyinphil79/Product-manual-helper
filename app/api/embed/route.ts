import { embed } from "@/lib/agent";
import { fail, getKey, readJson } from "@/lib/http";
import { checkChunks } from "@/lib/validate";

// Step 3: one 768-number vector per chunk. The result is the whole index;
// the browser keeps it so follow-up questions skip this step.
export async function POST(req: Request) {
  try {
    const key = getKey(req);
    const chunks = checkChunks((await readJson(req)).chunks);
    const vectors = await embed(chunks.map((c) => c.text), key);
    return Response.json({ index: chunks.map((c, i) => ({ ...c, vector: vectors[i] })) });
  } catch (err) {
    return fail(err);
  }
}
