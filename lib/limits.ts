// Hard caps so one click can never burn through a quota.
export const LIMITS = {
  files: 3,
  bytes: 4 * 1024 * 1024, // 4 MB across all uploaded PDFs
  pages: 40,
  chunks: 150,
  questionChars: 500,
};

export const TOP_K = 4;
export const CHUNK_WORDS = 120;
export const OVERLAP_WORDS = 30;
export const EMBED_DIMS = 768;
