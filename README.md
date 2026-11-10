# Manual Helper

Troubleshoot a device from its manual. Upload the manual's PDFs (or pick a sample), describe the problem, and get a short answer with the **page** and the **numbered step** to follow.

It is built to practise **chunking and vector search by hand**: no vector database, no RAG library, no agent framework. The whole "index" is a plain array of chunks and their vectors, kept in the browser.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 through the `@tailwindcss/turbopack` loader (see `next.config.ts`)
- `openai` (Responses API for answers, embeddings API for vectors)
- `unpdf` 1.x to read PDF text, `lucide-react` for icons

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000, paste your OpenAI API key in the **Live** bar, and press **Ask**. The first sample (Wi-Fi router) is pre-filled.

The key is kept in `sessionStorage` under `openai-key` and sent as an `x-openai-key` header. It is never logged or saved on the server. To run without pasting a key, copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`; the header always wins over the env var.

## How it works

The page calls one API route per step, in order:

| Route | What it does |
| --- | --- |
| `POST /api/read` | PDF → one clean string per page (`unpdf`). Also serves the built-in samples. |
| `POST /api/chunk` | Each page → chunks of ~120 words, each starting 30 words before the previous one ended. A chunk never crosses a page, so it always knows its page number. |
| `POST /api/embed` | Every chunk → a 768-dimension vector (`text-embedding-3-small`). The result is the whole index; the browser keeps it, so follow-up questions skip read, chunk and embed. |
| `POST /api/search` | Embeds the question, scores every chunk with a hand-written cosine similarity, returns them ranked plus the top 4. |
| `POST /api/answer` | Sends only the top 4 chunks, numbered, to `gpt-5-mini` (or the cheaper `gpt-6.1-sol` from the switch at the top right) with low reasoning effort. It returns JSON: the answer, whether the manual covers it (`yes` / `partly` / `no`), the step to follow and which chunk numbers it used. |

Every route checks its input and returns `{ "error": "..." }` with a plain message. With no key at all, routes return 401 with "Add your OpenAI API key at the top of the page."

### Limits

One click can't burn a quota: at most 3 PDFs, 4 MB in total, 40 pages and 150 chunks per run.

### What you see

- A **step strip** (Read & chunk, Embed, Search, Answer): grey while waiting, black and pulsing while running, a green tick with real numbers when done.
- A **wall of page tiles**. Tiles pulse while being read, get one stripe per chunk, then turn green by how close their best chunk is to the question. `#1`–`#4` badges mark the chunks sent to the model; a tick marks the pages it used.
- The **answer card**: the source page, slightly tilted, with the chunk the model used highlighted, next to a big "Page N", the step, the answer, and the time and tokens.
- **All chunks ranked by score**, collapsed under the wall.

## Code map

```
app/page.tsx          state, the run loop and the layout
app/api/*/route.ts    one route per step
components/           one file per part of the screen
lib/agent.ts          every OpenAI call (server only)
lib/chunk.ts          sliding-window chunker
lib/cosine.ts         cosine similarity
lib/pdf.ts            PDF → page text
lib/samples.ts        three sample manuals (router, espresso machine, washing machine)
lib/validate.ts       input checks shared by the routes
lib/http.ts           key lookup and error responses
lib/tiles.ts          what each page tile shows at each moment
```

## Notes

- Scanned PDFs (pictures of pages) have no text layer, so they can't be read.
- `gpt-6.1-sol` must be available on your OpenAI account; if it isn't, the app says so and you can switch back to `gpt-5-mini`.
