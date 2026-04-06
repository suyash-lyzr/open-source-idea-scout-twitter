# Idea: Graphify Agent
**Session:** 2026-04-07_02-54
**Rank:** #1

## What's trending
Andrej Karpathy named "LLM Knowledge Bases" as a key new workflow. 48 hours later, a tool called Graphify appeared on GitHub. The tweet announcing it has 198,368 impressions and **8,140 bookmarks** — a ratio that signals strong developer intent. Graphify is a static one-shot tool. What's missing is a GitClaw agent that continuously maintains, regenerates, and lets you query a knowledge graph from a living folder.

## Sources
- https://x.com/i/status/2041192946369007924 — "🚨 BREAKING: Someone just built the exact tool Andrej Karpathy said someone should build. 48 hours after Karpathy posted his LLM Knowledge Bases workflow, this showed up on GitHub. It's called Graphify." (3,726 likes | 395 RTs | 8,140 bookmarks | 198,368 impressions)
- https://x.com/i/status/2040572272944324650 — @karpathy: "Farzapedia, personal wikipedia of Farza, good example following my Wiki LLM tweet..." (8,328 likes | 748 RTs | 12,128 bookmarks | 1,004,135 impressions)

## The gap
Graphify is a one-command static script. It generates a snapshot. It does NOT:
- Regenerate when files change
- Let you QUERY the knowledge graph via natural language
- Commit the graph to git with a history/changelog
- Integrate with your editor or agent runtime
There is no GitClaw-native, continuously-maintained, query-able knowledge graph agent.

## The GitClaw agent: KnowledgeGraph Agent
An agent that sits in your repo/folder and:
1. On a schedule (or file change), re-scans all files and rebuilds/updates the knowledge graph (nodes = concepts/files, edges = relationships)
2. Commits updated graph markdown to git with a changelog entry
3. Answers natural-language queries against the graph ("what modules touch the auth layer?")
4. Surfaces new relationships that appeared since last scan

## MVP (1-2 weeks)
- **SOUL.md:** "I am your codebase's memory. I watch every file, map every relationship, and answer any question about your system in plain English."
- **Skills:**
  - `scan-and-graph` — traverse folder, extract entities/relationships using LLM, output structured graph markdown
  - `query-graph` — accept natural language question, search graph, return answer with node references
  - `diff-and-commit` — compare new graph vs old, generate human-readable changelog, commit to git
- **Integrations:** File read/write (built-in), git CLI (built-in), optional GitHub via Composio for PR summaries
- **Key feature 1:** `gitclaw run graph --watch` — runs in background, auto-regenerates on file changes
- **Key feature 2:** `gitclaw ask "what depends on auth.py?"` — queries the living graph in natural language

## Stack
GitAgent spec + Claude 3.5 Sonnet + file system tools + git CLI

## Why it'll get stars
- Karpathy's original tweet has 1M+ impressions and 12K bookmarks — the demand is enormous
- Graphify proved the concept is valid. This is the agentic evolution of that same idea.
- Every developer with a large codebase wants this. "gitclaw ask 'what calls my payment handler'" is magical.
