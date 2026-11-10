import { fail, InputError, readJson } from "@/lib/http";
import { LIMITS } from "@/lib/limits";
import { readPdfPages } from "@/lib/pdf";
import { samplePages } from "@/lib/samples";
import type { Page } from "@/lib/types";

// Step 1: turn PDFs (or a built-in sample) into one clean string per page.
// No key needed: nothing here talks to OpenAI.
export async function POST(req: Request) {
  try {
    const type = req.headers.get("content-type") ?? "";
    const pages = type.includes("multipart/form-data") ? await fromUpload(req) : await fromSample(req);
    if (pages.every((p) => !p.text)) {
      throw new InputError("No text found. Scanned PDFs (images of pages) can't be read.");
    }
    return Response.json({ pages });
  } catch (err) {
    return fail(err);
  }
}

async function fromSample(req: Request): Promise<Page[]> {
  const { sampleId } = await readJson(req);
  const pages = samplePages(String(sampleId));
  if (pages.length === 0) throw new InputError("Unknown sample manual.");
  return pages;
}

async function fromUpload(req: Request): Promise<Page[]> {
  const files = (await req.formData()).getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) throw new InputError("Choose at least one PDF.");
  if (files.length > LIMITS.files) throw new InputError(`Upload at most ${LIMITS.files} PDFs.`);
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > LIMITS.bytes) throw new InputError("PDFs must be 4 MB or less in total.");

  const pages: Page[] = [];
  const names = new Set<string>();
  for (const file of files) {
    if (!file.name.toLowerCase().endsWith(".pdf")) throw new InputError(`${file.name} is not a PDF.`);
    let texts: string[];
    try {
      texts = await readPdfPages(new Uint8Array(await file.arrayBuffer()));
    } catch {
      throw new InputError(`Could not read ${file.name}. Is it a valid PDF?`);
    }
    // Two uploads with the same name would share page keys, so number them.
    let doc = file.name.replace(/\.pdf$/i, "");
    for (let n = 2; names.has(doc); n++) doc = `${file.name.replace(/\.pdf$/i, "")} (${n})`;
    names.add(doc);
    texts.forEach((text, i) => pages.push({ doc, page: i + 1, text }));
    if (pages.length > LIMITS.pages) throw new InputError(`At most ${LIMITS.pages} pages in total.`);
  }
  return pages;
}
