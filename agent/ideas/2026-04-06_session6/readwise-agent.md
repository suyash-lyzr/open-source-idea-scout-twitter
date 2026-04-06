# ReadAgent — Open-Source Document-to-Agent-Memory Converter

## What's trending
@karpathy tweeted (46,682 impressions, 984 likes, 400 bookmarks): "The best epub to txt converter I found is just asking your favorite agent to do it. Epubs can be very diverse, the agent just goes in, figures it out, creates the output markdown and ensures it looks good — works great." This signals a massive untapped workflow: people have libraries of PDFs, epubs, Kindle books, research papers, and web clippings — and they want agents to be able to *read and remember* them. The missing piece (per a reply in search 1: "Best I've found is manual export into a knowledge graph. The automation piece is missing. Someone should build it.") is a pipeline that takes ANY document format → extracts key concepts → stores them as structured agent memory the LLM can actually use.

## Sources
- https://x.com/i/status/2040451573881737480 — @karpathy: "Best epub to txt converter I found is just asking your favorite agent to do it. Agent goes in, figures it out, creates output markdown, ensures it looks good — works great." (46,682 impressions · 984 likes · 400 bookmarks · 29 RTs)
- https://x.com/i/status/2040572272944324650 — @karpathy: "Farzapedia — personal wikipedia. Explicit. Portable. Version-controlled. The memory artifact is transparent, you know exactly what the AI knows about you." (808,375 impressions · 10,402 bookmarks · 7,127 likes) — confirms "readable, git-versioned agent memory" is the right direction
- https://x.com/i/status/2040915670162907280 — "Best I found is manual export into a knowledge graph. The automation piece is missing. Someone should build it." (43 impressions · 1 like — replying to @chamath about knowledge graph automation)
- https://x.com/i/status/2040929859309125964 — "The most advanced AI infra you need is just a plain text file that both you and your agent can actually understand." (25 impressions · 1 like — confirms plain-text/markdown memory is the right format)

## The gap
There is no open-source GitClaw agent that takes your reading pile — epubs, PDFs, Kindle exports, web articles, research papers — and converts them into structured, queryable agent memory files (markdown + YAML frontmatter) that another GitClaw agent can actually use as context. Readwise does captures, but it's $8/month, cloud-only, and doesn't output GitAgent-compatible memory files. There's no OSS pipeline that goes from "document" to "something my agent knows."

## The GitClaw agent
ReadAgent is a document-ingestion GitClaw agent. Drop a PDF, epub, Kindle export, or URL into its watch folder. It extracts text (handling every messy format via agent-driven parsing, just as @karpathy described), chunks it, extracts key concepts and quotes using an LLM, and writes them as structured markdown memory files into your agent's `memory/` folder. Other GitClaw agents can then load these memory files as context. It's a personal Readwise — but open-source, local-first, and GitAgent-native.

## MVP (1–2 weeks)

- **SOUL.md:** "I am ReadAgent. I read everything so your other agents can know it too. Drop a PDF, epub, or URL into my inbox. I'll extract the ideas, chunk the knowledge, and file it as structured memory your agents can load. Your reading pile becomes your agent's long-term memory — transparent, portable, git-versioned."
- **Skills:**
  - `doc-ingestor`: Watches a folder for new files (PDF, epub, txt, HTML). Calls agent to parse each format, extract clean markdown text. Falls back to agent-driven extraction for unusual formats (exactly as @karpathy described for epubs).
  - `concept-extractor`: Passes extracted text to LLM. Outputs: title, summary (3 sentences), 5–10 key concepts with definitions, best quotes, suggested tags. Writes to `memory/readings/<title>.md` with YAML frontmatter.
  - `memory-indexer`: Maintains `memory/readings/INDEX.md` — a searchable table of everything ReadAgent has ingested. Agents load this file to know what's available.
  - `url-clipper`: Takes a URL, fetches article content (via curl + readability parsing), runs through concept-extractor. Works for blog posts, research papers, docs pages.
- **Integrations:** No Composio required for core — pure local-first. Optional: Composio (Notion sync for sharing memory across devices, Slack for "I just read X" digest posts)
- **Key feature 1:** Any format → clean agent memory. PDF, epub, Kindle HTML export, web URL — all become `memory/readings/book-name.md` files other agents can load.
- **Key feature 2:** `memory/readings/INDEX.md` is a human-readable + agent-queryable index. Ask any GitClaw agent "what do you know about X?" and it searches the index first.

## Stack
GitAgent spec + Claude 3.5 Sonnet + local file watcher (Python watchdog) + optional Composio (Notion, Slack)

## Why it'll get stars
- @karpathy's 984-like tweet is an explicit endorsement of "use an agent to parse documents" — this builds exactly that as a reusable GitClaw skill
- Readwise is $8/month and cloud-only — developers immediately want a self-hosted alternative
- Connects to @karpathy's 808K-impression wiki tweet: your personal wiki needs a way to *ingest books* — ReadAgent is that missing piece
- Solo buildable in a weekend: file watcher + LLM call + markdown write = working MVP; everything else is polish
