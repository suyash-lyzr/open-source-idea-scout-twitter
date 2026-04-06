# IdeaScout — Open Source Idea Scout

A Next.js web app that deep-scans Twitter/X for viral tech trends and generates the top 3 open-source GitClaw/GitAgent agent ideas worth building.

## What this app does

1. User clicks "Scout Ideas"
2. The app calls the gitclaw SDK (`import { query } from "gitclaw"`)
3. Gitclaw loads the agent in `agent/` (SOUL.md + scout skill)
4. Claude runs all 8 Twitter searches via the skill instructions
5. Claude analyzes viral tweets and generates 3 high-quality agent ideas
6. Results are parsed and displayed in the UI with virality scores, sources, MVP scope, and market check

## Project structure

```
idea-scout/
  src/
    app/
      page.tsx                    ← Main UI (Composio dark theme, session sidebar, idea cards)
      layout.tsx                  ← Fonts (Playfair Display, Noto Sans, Geist Mono)
      globals.css                 ← Dark theme (#1A1A1D bg, #EC7843 orange accent)
      api/
        scout/route.ts            ← POST: runs gitclaw SDK, parses ideas. GET: returns sessions
        market-check/route.ts     ← POST: Tavily web search for competitor analysis
  agent/                          ← GitAgent spec folder (used by gitclaw SDK at runtime)
    SOUL.md                       ← Agent identity + 8 Twitter search instructions
    agent.yaml                    ← model: anthropic:claude-sonnet-4-6, tools, skills
    RULES.md                      ← Hard constraints
    skills/
      scout/SKILL.md              ← Scout skill instructions
      ideate/SKILL.md
      evaluate/SKILL.md
    ideas/                        ← Generated idea sessions (date-stamped folders)
    memory/
    scouted/
  nixpacks.toml                   ← Railway: installs git + curl (gitclaw needs git)
  next.config.ts                  ← serverExternalPackages: gitclaw, baileys, sharp, jimp
```

## Key technical decisions

### Why gitclaw SDK (not CLI, not raw Anthropic API)
- `import { query } from "gitclaw"` runs the full agent loop in-process
- Loads SOUL.md + skills → Claude reasons with full context → higher quality ideas
- Previous approaches: CLI shelling (needed git on server, slow), raw Anthropic API (bypassed agent skills)
- `serverExternalPackages` in next.config.ts prevents baileys/sharp bundling issues

### Why nixpacks.toml
- gitclaw SDK calls `git init` and `git clone` internally (session management, memory commits)
- Railway containers don't have git by default
- `nixPkgs = ["git", "curl"]` installs them at build time

### Session storage
- Sessions stored in-memory (`sessionStore` array) — resets on server restart
- Filesystem save to `agent/ideas/` is attempted but not required (fails gracefully on Railway)
- GET /api/scout returns in-memory sessions

### Market check
- Separate `/api/market-check` endpoint using Tavily API
- Button appears on each expanded idea card if no market data exists
- Shows "Green Field" or "Competitors Found" with links

## UI design

- Theme: Composio docs-style dark (#1A1A1D background, #E8E8ED text, #EC7843 orange)
- Left sidebar: session history
- Idea cards: collapsed by default, expand to show full details
- Rank icons: Trophy (1st), Medal (2nd), Award (3rd)
- Sections: Problem It Solves, Sources (with X/HN/GitHub platform tags), MVP Scope, Why GitClaw, Market Check, CLAUDE.md (copy button)
- Source tags: X (blue), HN (orange), GitHub (green)
- Virality score: 1-5 flame bars

## Environment variables

```
ANTHROPIC_API_KEY=         ← Required: gitclaw uses Claude Sonnet 4.6
TWITTER_BEARER_TOKEN=      ← Required: Twitter API v2 Bearer Token
TAVILY_API_KEY=            ← Required: market check web search
```

Set in Railway dashboard (Variables tab). Locally set in `agent/.env` (gitignored).

## Running locally

```bash
cd idea-scout
npm install
# Set env vars in agent/.env
npm run dev     # http://localhost:3000
```

## Deployment (Railway)

- GitHub repo: https://github.com/suyash-lyzr/open-source-idea-scout-twitter
- Railway auto-detects Next.js, runs npm install → npm build → npm start
- nixpacks.toml handles git + curl installation
- Set ANTHROPIC_API_KEY, TWITTER_BEARER_TOKEN, TAVILY_API_KEY in Railway Variables

## Twitter searches (8 categories)

The agent in `agent/SOUL.md` runs these searches via curl:
1. `"someone should build"` — Wishlist tweets
2. `"I wish there was"` — Pain points
3. `"open source alternative"` — OSS demand
4. `"just shipped" OR "just launched"` + AI agent — New launches
5. `AI agent OR coding agent` + idea/build/need — Agent trends
6. `from:karpathy OR from:levelsio OR from:swyx` — Influencer takes
7. `"why is there no"` + tool/app/agent — Unmet needs
8. `"so frustrating" OR "waste of time"` + developer/coding — Frustrations

## Parsing ideas from agent response

The agent returns markdown formatted as:
```
## Idea 1: AgentName
**What's trending:** ...
**Sources:**
- [text](https://x.com/i/status/...) — description
**The gap:** ...
**The GitClaw agent:** ...
**MVP (1-2 weeks):**
- ...
**Stack:** GitAgent spec + Claude Sonnet 4.6 + ...
**Why it'll get stars:** ...
```

`parseIdeasFromResponse()` in route.ts handles multiple markdown link formats and filters meta-output blocks.

## Known issues / gotchas

- Scout takes 2-4 minutes (gitclaw runs full agent loop with Claude)
- Sessions are in-memory — lost on Railway restart (not persisted to DB)
- Ideas folder on Railway filesystem is ephemeral
- Twitter API rate limits can return 0 tweets on some searches
- If Claude returns raw JSON instead of markdown, parsing may fail (retry works)
