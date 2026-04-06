# Scouting Session 5 — 2026-04-06

## Source 1: Twitter/X (6 searches via Twitter API v2)

### Key Signals Found

**@levelsio (33836629)** — 2 high-signal tweets:
- tweet/2040847956472164706 (122 likes, 9 bookmarks, 4655 impressions): "AI activity has been growing out of control... Read endpoints can be a lot cheaper but Write endpoints a lot more expensive" — about X API pricing, reinforces token cost as dev pain
- tweet/2040806346556428585 (317 likes, 120 bookmarks, 60254 impressions): "Surprised with how good the comments on GitHub Gists are... I should gist more. @github consider competing with X (?)" — huge signal: GitHub Gists as low-noise dev social graph

**@karpathy (33836629)** — HUGE signal tweet:
- tweet/2040572272944324650 (6815 likes, 9935 bookmarks, 758740 impressions): "Farzapedia, personal wikipedia of Farza, good example following my Wiki LLM tweet. I really like this approach to personalization... Explicit. The memory artifact [is portable]" — Karpathy endorsing personal wiki as the future of LLM memory

**@karpathy** — government transparency tweet:
- tweet/2040549459193704852 (4701 likes, 2947 bookmarks, 584047 impressions): "I am bullish on people (empowered by AI) increasing the visibility, legibility and accountability of their governments."

**Just Shipped — AI email for agents:**
- tweet/2040835691425218641 (5 likes, 126 impressions): "@voidmail.ai — one API call → instant inbox. No phone. No CAPTCHA. No OAuth. Your agent can now send, receive, and search email autonomously." — CLOSED SOURCE. Zero-knowledge. $$/month SaaS.

**Just Shipped — context silo fix:**
- tweet/2040862533448356308 (2 likes, 123 impressions): "RetainDB: AI agents had memory, but worked in silos. One agent processes a document, another has no idea it exists. We fixed that." — CLOSED SOURCE SaaS.

**Tax eval agent wishlist:**
- tweet/2040193208718958794 (0 likes, 141 impressions): "Complex taxes are actually a great 'final boss' test for automation. Someone should build an eval explicitly for this use case."

**Unified freelance notification hub:**
- tweet/2040701044544634918 (4 likes, 46 impressions): "Someone should build an app that connects everything — Twitter, LinkedIn, Fiverr, Upwork — all in one menu bar icon."

**"App that makes you finish building apps":**
- tweet/2040791613786542360 (0 likes, 9 impressions): "Someone should build an app that makes you finish building apps"

---

## Source 2: Hacker News (Top 30 stories)

| Score | Comments | ID | Title |
|-------|----------|----|-------|
| 722 | 479 | 47647788 | **The threat is comfortable drift toward not understanding what you're doing** |
| 561 | 275 | 47647455 | **Caveman: Why use many token when few token do trick** |
| 421 | 126 | 47648828 | **Eight years of wanting, three months of building with AI** |
| 297 | 155 | 47648404 | **My Google Workspace account suspension** |
| 303 | 219 | 47649721 | Artemis II crew see first glimpse of far side of Moon |
| 231 | 121 | 47646843 | Lisette language inspired by Rust compiles to Go |
| 260 | 176 | 47649113 | Finnish sauna heat exposure immune responses |

**Top developer pain signals:**
1. **#1 (722pts/479cmts): Comfortable Drift** — developers shipping AI-written code they don't understand. The most-discussed dev anxiety story on HN this week. No tool exists that quizzes devs on their own AI-written code.
2. **#2 (561pts/275cmts): Caveman** — token minimization. Fewer tokens = faster + cheaper. Trending library for prompt compression.
3. **#3 (297pts/155cmts): Google Workspace Suspension** — account lockout with zero recourse. 155 comments of shared horror stories. No OSS agent guards against this.

---

## Source 3: GitHub Trending (7 days)

| Stars | Repo | Description |
|-------|------|-------------|
| 170,430 | ultraworkers/claw-code | Fastest repo ever to 100K stars — agent harness unlock |
| 16,145 | Gitlawb/openclaude | Open-source Claude Code CLI alternative |
| 13,923 | VoltAgent/awesome-design-md | DESIGN.md collection from popular websites |
| 13,878 | claude-code-best/claude-code | Runnable Claude Code |
| 11,331 | sanbuphy/learn-coding-agent | Research on Coding Agents |
| 5,132 | tvytlx/ai-agent-deep-dive | AI Agent source code deep dive research |
| 4,926 | HKUDS/OpenHarness | Open Agent Harness |
| 4,793 | JackChen-me/open-multi-agent | TS multi-agent framework — one runTeam() call |
| 2,705 | therealXiaomanChu/ex-skill | "Distill your ex into an AI skill" — ⚡viral concept |

**Key GitHub gaps identified:**
- Zero repos for "personal wiki agent" (GitAgent/GitClaw-style)
- Zero repos for "google workspace backup agent"
- No GitClaw agent that enforces code comprehension on AI diffs
- ex-skill (2705⭐) viral concept: distill a person into an AI skill → could be "WikiAgent" for any person or project

---

## Top Signals → Ideas

1. **@karpathy 758K impressions on personal wiki** → PersonaWiki agent (build your Wikipedia from notes/tweets/repos, no OSS version exists)
2. **HN #1: Comfortable Drift (722pts/479cmts)** → DriftCheck v2 agent (PRs with AI code → comprehension quiz before merge, updated angle: Git-native, uses GitHub PR comments)
3. **HN #3: Google Workspace Suspension (297pts/155cmts)** + **Twitter: "app that makes you finish apps"** → DataEscape agent (continuously export your Google Workspace data so you never lose access)
