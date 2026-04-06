# Idea: AgentBench Agent
**Session:** 2026-04-07_02-54
**Rank:** #3

## What's trending
A tool called Worldline launched on Twitter: it captures coding agent sessions, scores them, and tells you which agent to trust and when. It's closed-source and targets teams that run multiple AI coding agents. The tweet surfaced a real pain: **teams choose AI coding agents by gut feel.** Meanwhile, on the same day, a developer mentioned that granular agent permission control is all-or-nothing on macOS — another signal that developers are trying to wrangle multiple agents but lack tooling to compare, score, or constrain them. No open-source agent does this.

## Sources
- https://x.com/i/status/2041222524185575663 — "most teams using AI coding agents still choose them by gut feel. we just launched Worldline: a decision interface for coding agents. it captures agent sessions, scores them, and tells you: which agent to trust, where it fails, which one to use for a workflow" (9 likes | 1 QT | 260 impressions)
- https://x.com/i/status/2041261816886780317 — "granular permissions for AI agents is exactly right. on macOS the screen recording permission is all or nothing which is a pain for building agent tools that need to see what the user sees. you basically have to ask for full screen access even if you only need a single window" (7 impressions)
- https://x.com/i/status/2041215763139235898 — Instaclaw: "just shipped cross-session memory to every Instaclaw agent. tiered memory with automatic session summaries, semantic search, and progressive context loading." (24 likes | 5 RTs | 1,249 impressions) — signal that agent memory/session quality is top of mind

## The gap
Developers run Claude Code, Cursor, Copilot, Windsurf — often all on the same project. There is NO open-source way to:
- Record what each agent actually did during a session (files changed, commands run, tokens used)
- Score each agent's output quality on a given task type
- See a leaderboard of which agent performs best on YOUR codebase
- Replay sessions to understand where an agent went wrong
Worldline is closed-source and requires a paid account. GitClaw has native session + memory primitives that make this buildable in days.

## The GitClaw agent: AgentBench Agent
A GitClaw agent that wraps any coding agent session and:
1. Logs all actions taken (file reads/writes, shell commands, LLM calls) into a structured session JSON
2. Scores the session on: task completion, diff quality, test pass rate, token efficiency
3. Commits session scores to a git-backed leaderboard (LEADERBOARD.md per project)
4. Surfaces recommendations: "For refactoring tasks, Claude Code beats Cursor by 23% on this repo"

## MVP (1-2 weeks)
- **SOUL.md:** "I am your agent referee. I watch every coding agent session, score the work, and tell you which AI to trust — on your codebase, on your tasks, with real data."
- **Skills:**
  - `session-recorder` — wraps a coding agent run, captures file diffs, shell output, LLM calls into structured log
  - `scorer` — evaluates session output: lint/test pass rate, diff size vs. task scope, hallucination indicators
  - `leaderboard-writer` — commits session scores to LEADERBOARD.md and updates running averages
  - `recommender` — given a task description, queries memory to recommend best agent for the job
- **Integrations:** GitHub (Composio — for PR diff analysis), local git CLI (built-in), optional Slack (Composio — post leaderboard updates to team channel)
- **Key feature 1:** `gitclaw bench --agent cursor --task "refactor auth"` — wraps any agent run in a scored session
- **Key feature 2:** Git-native leaderboard — LEADERBOARD.md lives in the repo, shareable with the whole team, full history via git

## Stack
GitAgent spec + Claude 3.5 Sonnet + git CLI + GitHub Composio integration + local file system

## Why it'll get stars
- Every team using multiple AI agents is flying blind on which one to trust for which tasks. This gives them data.
- Worldline proved the market exists by launching a paid product for it. AgentBench is the open-source answer.
- Git-native leaderboard is a novel primitive — you can PR changes to your "which agent wins" knowledge base.
