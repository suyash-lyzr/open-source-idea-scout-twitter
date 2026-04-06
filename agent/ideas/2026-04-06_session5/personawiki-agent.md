# PersonaWiki Agent

**Session:** 2026-04-06 Session 5
**Rank:** 🥇 #1

## Trend
Andrej Karpathy's tweet endorsing "Farzapedia" — a personal Wikipedia built by Farza — went **viral with 6,815 likes, 9,935 bookmarks, and 758,740 impressions**. Karpathy called out that the key advantage is that the memory artifact is *explicit, portable, and version-controllable* — unlike "AI that allegedly gets better the more you use it." This is a direct design blueprint for a GitClaw agent.

## Sources
- https://x.com/i/status/2040572272944324650 — @karpathy: "Farzapedia... I really like this approach to personalization... Explicit. The memory artifact [is portable]" (6815 likes, 9935 bookmarks, 758,740 impressions)
- https://x.com/i/status/2040806346556428585 — @levelsio: "Surprised with how good the comments on GitHub Gists are... I should gist more" (317 likes, 120 bookmarks, 60,254 impressions)

## The Gap
There is **no open-source GitClaw/GitAgent-native personal wiki agent**. Farzapedia is a one-off personal project. Obsidian plugins exist but require manual curation. NotebookLM/Mem.ai are closed SaaS. No tool automatically ingests your tweets, GitHub commits, blog posts, and notes — and outputs a structured, portable, git-versioned personal Wikipedia.

GitHub search for "personal wiki LLM agent" returned **0 relevant repos** with >5 stars.

## The GitClaw Agent
**PersonaWiki** is a GitClaw agent that watches your digital exhaust (GitHub, Twitter, notes, blog) and continuously builds and updates a structured personal Wikipedia in Markdown. Every fact is sourced. Every page is version-controlled in git. The output is a folder of Markdown files that any LLM can read as context — making the wiki the memory layer for all your future agents.

## MVP (1-2 weeks)
- **SOUL.md:** "I am PersonaWiki — I turn your scattered digital presence into a structured, portable, git-versioned personal Wikipedia. I run on a schedule, ingest from your sources, and write Markdown files that any agent can read."
- **Skills:**
  - `ingest-github.md` — fetch your starred repos, commits, README contributions → extract facts
  - `ingest-twitter.md` — fetch your recent tweets → extract opinions, projects, interests
  - `build-wiki-page.md` — given a topic (project, belief, skill), write a structured wiki page with sources
  - `update-on-schedule.md` — run weekly, diff what's new, append to relevant pages
- **Integrations (Composio):** GitHub, Twitter/X, Notion (optional export)
- **Key feature 1:** `wiki/` folder structure — one `.md` file per topic (projects/, beliefs/, skills/, people/)
- **Key feature 2:** Every claim has a `[source: tweet/2040572272944324650]` citation inline — no hallucinations
- **Key feature 3:** Outputs a `CONTEXT.md` that any GitClaw sub-agent can load as instant background

## Stack
GitAgent spec + Claude 3.5 Sonnet + Composio (GitHub + Twitter) + cron schedule

## Why it'll get stars
- Karpathy's 758K-impression tweet is the best free marketing signal you'll find. Anyone who saw that tweet and wants to build their own version will search GitHub.
- "Portable AI memory" is the #1 unsolved problem in the personal AI space — this is the simplest possible implementation of it.
