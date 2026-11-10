import { chunkPages } from "@/lib/chunk";
import { fail, InputError, readJson } from "@/lib/http";
import { LIMITS } from "@/lib/limits";
import { checkPages } from "@/lib/validate";

// Step 2: cut each page into overlapping ~120-word chunks.
export async function POST(req: Request) {
  try {
    const pages = checkPages((await readJson(req)).pages);
    const chunks = chunkPages(pages);
    if (chunks.length === 0) throw new InputError("The pages had no text to chunk.");
    if (chunks.length > LIMITS.chunks) {
      throw new InputError(`That makes ${chunks.length} chunks; the cap is ${LIMITS.chunks}. Use fewer pages.`);
    }
    return Response.json({ chunks });
  } catch (err) {
    return fail(err);
  }
}
