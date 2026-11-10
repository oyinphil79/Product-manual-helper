import { extractText, getDocumentProxy } from "unpdf";
import { clean } from "./pdf-text";

// One string per PDF page, in order. Page numbers are index + 1.
export async function readPdfPages(bytes: Uint8Array): Promise<string[]> {
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: false });
  return text.map(clean);
}
