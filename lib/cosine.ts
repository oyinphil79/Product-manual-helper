// Cosine similarity: how closely two vectors point the same way (1 = same
// direction, 0 = unrelated). Written by hand on purpose, no vector library.
export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error("Vectors must have the same length.");
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
