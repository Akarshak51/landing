# LandingForge

AI-powered B2B landing page generator using a local LLM via `@llama-node/core`.

## Setup

### 1. Install dependencies
```bash
npm install
```


### 2. Add a compatible local model

This project uses `@llama-node/core` and expects a **GGML model** (typically `.bin`).

Auto-discovery checks these paths first:
```text
models/model.bin
models/model.ggml
models/model.GGML
```

If multiple model files exist, set an explicit path:
```bash
# PowerShell
$env:LLM_MODEL_PATH = "models/model.bin"
```

Important:
- `GGUF` is **not supported** by this codebase/runtime.
- Some files named `.GGML` are actually GGUF internally; if the app reports `Unsupported model format: GGUF`, replace it with a true GGML `.bin` model.

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Fill in **Company Name** and **Short Description** (required).
2. Optionally add **Website URL** and/or paste content into **Website Text / Research Notes**.
3. Choose a **Tone**.
4. Click **Generate Landing Page**.
5. View the live **Preview**, inspect the **Content JSON**, or copy/download the generated HTML.

## What Changed (Design + Research)

- Each generation now uses an auto-selected visual variant (different font pair, palette, motion profile, and section treatment).
- Recent visual variants are avoided to reduce back-to-back repetition.
- If a `website_url` is provided, the API now fetches and summarizes key public HTML text (title, meta description, headings, paragraphs, list items) and merges it with pasted notes before prompting the model.

## Project Structure

```text
landingforge/
  app/
    api/generate/route.ts   <- API route: calls local LLM + website research fetch
    layout.tsx
    page.tsx
  components/
    LandingPageAgent.tsx    <- Main UI component
  lib/
    llm.ts                  <- Local LLM wrapper
    prompt.ts               <- System prompt + helpers
    research.ts             <- Website text preprocessing + URL fetch summarizer
    showcase-template.ts    <- Multi-variant landing page HTML renderer
  models/
    model.bin               <- Place your local model here (not in git)
  next.config.mjs
  package.json
  tsconfig.json
```

## Tech Stack

- Next.js 14 (App Router)
- `@llama-node/core`
- TypeScript
- React 18
