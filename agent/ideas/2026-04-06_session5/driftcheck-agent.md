# DriftCheck Agent

**Session:** 2026-04-06 Session 5
**Rank:** 🥈 #2

## Trend
HN's #1 story this week: **"The threat is comfortable drift toward not understanding what you're doing"** — 722 points, 479 comments. Developers are shipping AI-written code at speed but losing comprehension of their own codebase. The Caveman token-minimization tool (561pts, 275cmts) shows devs want tighter, leaner AI interactions — not just passive acceptance of AI output.

## Sources
- https://news.ycombinator.com/item?id=47647788 — "The threat is comfortable drift toward not understanding what you're doing" (722pts, 479 cmts — HN #1 this week)
- https://news.ycombinator.com/item?id=47647455 — "Caveman: Why use many token when few token do trick" (561pts, 275 cmts — HN #2 this week)
- https://github.com/sanbuphy/learn-coding-agent — learn-coding-agent (11,331⭐ in 7 days) — devs rushing to understand how coding agents actually work

## The Gap
No tool exists that automatically generates comprehension questions from AI-authored git diffs and posts them to the PR for the developer to answer before merging. Code review tools (Danger, reviewdog) check for style — not *understanding*. There is **no GitClaw agent** that acts as a "Socratic mentor" on your own pull requests.

GitHub search for "code comprehension quiz AI agent" returned **0 relevant repos**.

## The GitClaw Agent
**DriftCheck** is a GitClaw agent that monitors your GitHub PRs for AI-generated code (detected via `git diff` heuristics + attribution), generates 3 Socratic comprehension questions about what changed and why, and posts them as a GitHub PR comment. The developer must answer before the agent approves the review. Optionally saves answered Q&A to `wiki/learnings/` for future reference.

## MVP (1-2 weeks)
- **SOUL.md:** "I am DriftCheck — I watch your pull requests for AI-written code and ask you to explain what it does before it merges. I am your Socratic code mentor. I keep you honest."
- **Skills:**
  - `detect-ai-diff.md` — analyze git diff for AI-attribution markers (Claude code comments, Cursor annotations, large coherent blocks with no history)
  - `generate-questions.md` — given a diff, produce 3 comprehension questions: "What does this function do?", "Why did you choose this approach?", "What would break if X changed?"
  - `post-pr-comment.md` — post questions to the PR as a GitHub Actions bot comment, block merge until answered
  - `save-learnings.md` — store answered Q&A pairs in `wiki/learnings/<date>-<pr>.md`
- **Integrations (Composio):** GitHub (PR comments, review approval, webhooks)
- **Key feature 1:** Works as a GitHub Action — drop a YAML into `.github/workflows/` and it runs on every PR
- **Key feature 2:** Questions are generated per-diff (not generic) — the agent reads the actual code change
- **Key feature 3:** Skips questions if the diff is small/trivial (configurable threshold)

## Stack
GitAgent spec + Claude 3.5 Sonnet + Composio (GitHub) + GitHub Actions webhook

## Why it'll get stars
- HN's #1 story with 722pts and 479 comments is the clearest possible signal. The comments are full of "someone should build X" energy.
- Every engineering team using Claude Code / Cursor will want this the moment they realize their devs are copy-pasting without understanding.
