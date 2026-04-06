# DocIngester Agent

## What's trending
Andrej Karpathy (1M-impression tweet) is actively advocating for agents as the best tool for document-to-knowledge conversion. His tweet about using agents to convert diverse epub files — "Epubs can be very diverse, the agent just goes in, figures it out, creates the output markdown and ensures it looks good works great" — is the first time he's explicitly positioned agents as *format-agnostic document ingesters*. Combined with his 1M-impression Farzapedia/Personal Wiki thread and the 8.3K-bookmark Graphify viral moment, there's a clear user demand for a GitClaw agent that turns any messy document format into a clean, agent-queryable knowledge base.

## Sources
- https://x.com/i/status/2040451573881737480 — @karpathy: "The best epub to txt converter I found is just asking your favorite agent to do it. Epubs can be very diverse, the agent just goes in, figures it out, creates the output markdown and ensures it looks good works great." (1,008 likes | 410 bookmarks | 50,717 impressions)
- https://x.com/i/status/2040572272944324650 — @karpathy: "Farzapedia, personal wikipedia of Farza, good example following my Wiki LLM tweet. I really like this approach to personalization..." (8,331 likes | 12,133 bookmarks | 1,004,920 impressions)
- https://x.com/i/status/2041192946369007924 — Graphify viral: "Someone just built the exact tool Andrej Karpathy said someone should build. 48 hours after Karpathy posted his LLM Knowledge Bases workflow..." (3,810 likes | 8,331 bookmarks | 203,483 impressions)

## The gap
Existing tools are single-format converters (epub→txt, PDF→text, etc.) that are brittle on edge cases. No open-source GitClaw agent exists that:
1. Accepts ANY file format (epub, PDF, Docx, HTML, Markdown, audio transcripts, web URLs)
2. Uses an LLM to intelligently parse each format's quirks (not regex/hardcoded parsers)
3. Normalizes everything into a single structured Markdown knowledge base
4. Makes the knowledge base queryable via natural language through the same agent

Graphify does step 1–3 for codebases only. Karpathy wants this for books and documents. No general-purpose OSS agent does this end-to-end.

## The GitClaw agent
**DocIngester** is a GitClaw agent that ingests any document (epub, PDF, Docx, URL, audio) and turns it into a clean, searchable `KNOWLEDGE.md` file. You run: `gitclaw run docingester --input ~/books/ --output KNOWLEDGE.md`. The agent inspects each file, picks the right extraction strategy using an LLM, normalizes content into structured Markdown with metadata headers, and optionally makes it queryable: `gitclaw ask "what does chapter 3 say about attention mechanisms?"` — the agent searches KNOWLEDGE.md and answers.

## MVP (1–2 weeks)
- **SOUL.md:** DocIngester is a document-to-knowledge agent. Its purpose is to ingest messy, format-diverse documents and produce clean, queryable Markdown knowledge bases. It is patient, precise, and never loses information — it adapts its extraction strategy per file format using an LLM.
- **Skills:**
  1. `ingest` — accepts a file path or folder; detects format; runs format-specific extraction via LLM; outputs clean Markdown
  2. `normalize` — strips formatting noise, inserts YAML front matter (title, source, date, word count), chunks into sections
  3. `query` — accepts a natural language question; searches KNOWLEDGE.md; returns answer with source attribution
- **Integrations:** Composio filesystem tools (read/write), optional Composio Google Drive or Dropbox connectors for remote files
- **Key feature 1:** LLM-first extraction — instead of brittle regex parsers, the agent describes the format to the model and asks it to extract cleanly
- **Key feature 2:** Persistent KNOWLEDGE.md that grows incrementally — each new document appends, deduplicates, and re-indexes

## Stack
GitAgent spec + Claude 3.5 Sonnet (extraction + normalization) + markitdown or pypandoc (format bootstrap) + Composio filesystem

## Why it'll get stars
1. Karpathy explicitly said "just ask your agent to do it" — this IS that agent, packaged and open-source
2. Directly feeds the Personal Wiki / Farzapedia trend that has 1M+ impressions and 12K bookmarks — developers will immediately use it to build their own knowledge bases
