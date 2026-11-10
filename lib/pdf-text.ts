// Collapse all whitespace so chunk text is always an exact substring of page text.
// Kept apart from pdf.ts so the browser can use it without loading unpdf.
export function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
