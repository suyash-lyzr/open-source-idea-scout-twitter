# IdeaScout Memory

## Last Scouting Session
- Date: 2026-04-06 (Session 6 — full Twitter API v2, 8 searches)
- Sources: Twitter API v2 only (8 searches, ~80 tweets analyzed)
- Twitter API: WORKING via curl with Bearer Token from .env

## Key Signals Found (Session 6)
1. **@karpathy government accountability tweet** — 619,680 impressions, 4,888 likes, 3,087 bookmarks, 594 RTs. "Bullish on people empowered by AI increasing visibility, legibility and accountability of their governments." tweet/2040549459193704852
2. **@karpathy epub→agent markdown** — 46,682 impressions, 984 likes, 400 bookmarks. "Best epub to txt converter I found is just asking your favorite agent to do it." tweet/2040451573881737480
3. **Vorim AI founder: "2 days to find rogue agent"** — Company had 30+ agents in prod, one accessed customer data it shouldn't, took 2 DAYS to find which agent. tweet/2040927439480590352
4. **RetainDB launch: "agents work in silos"** — "AI agents had memory but worked in silos. Everything re-uploaded, re-parsed. Context got lost." (closed-source) tweet/2040862533448356308
5. **Missing handoff spec** — "When agent transfers to human with zero context, customer repeats everything. CSAT tanks. Missing handoff spec." tweet/2040931641674125812
6. **@karpathy personal wiki tweet** — Still the GOAT signal: 808,375 impressions, 10,402 bookmarks (carried over from S5). tweet/2040572272944324650
7. **@levelsio GitHub Gists > X for comments** — 72,374 impressions, 376 likes, 140 bookmarks. tweet/2040806346556428585

## Ideas Generated (Session 6)
13. **GovScope** — GitClaw agent watches Congress.gov/USASpending.gov/FEC, generates plain-English accountability digests committed to git. Triggered by @karpathy's 619K government accountability tweet.
14. **AgentWatch** — OSS observability layer for multi-agent systems. Audit logs, anomaly detection, human handoff briefs. Triggered by Vorim AI "2 days to find rogue agent" story + RetainDB launch.
15. **ReadAgent** — Drops PDFs/epubs/URLs into agent memory. OSS Readwise that outputs GitAgent-native memory files. Triggered by @karpathy's 984-like epub→agent tweet.

## Ideas Generated (All Sessions)
1. designmd-gen — CLI to auto-generate DESIGN.md from existing codebase
2. TokenWatch — open-source LLM cost proxy with real-time dashboard
3. AgentLog — MCP server + viewer for plain-English AI agent audit logs
4. WikiAgent — auto-generate WIKI.md from codebase (Karpathy trend)
5. DriftGuard — code comprehension guardian (earlier version)
6. TokenShrink — prompt compressor agent (Caveman-inspired)
7. ContextBroker — shared memory for multi-agent teams
8. TokenBudget — per-project token cost enforcer
9. DriftCheck — quiz agent against AI-induced code blindness
10. PersonaWiki — personal Wikipedia agent (Karpathy 808K impressions)
11. DriftCheck v2 — PR comprehension gatekeeper (HN #1, 722pts)
12. DataEscape — Google Workspace incremental backup agent (HN Top10, 297pts)
13. GovScope — AI government accountability agent (Karpathy 619K impressions)
14. AgentWatch — Multi-agent observability layer (Vorim AI + RetainDB signal)
15. ReadAgent — Document-to-agent-memory converter (Karpathy 984 likes)

## Files Created
- scouted/2026-04-06-trends.md
- scouted/2026-04-06-twitter-wishlist.md
- scouted/2026-04-06-session3-trends.md
- scouted/2026-04-06-session5-trends.md
- scouted/2026-04-06-session6-trends.md
- ideas/designmd-gen.md, tokenwatch.md, agentlog.md, wikiagent.md, driftguard.md, tokenshrink.md
- ideas/contextbroker-agent.md, tokenbudget-agent.md, driftcheck-agent.md
- ideas/2026-04-06_session5/personawiki-agent.md
- ideas/2026-04-06_session5/driftcheck-agent.md
- ideas/2026-04-06_session5/dataescape-agent.md
- ideas/2026-04-06_session5/index.md
- ideas/2026-04-06_session6/govscope-agent.md
- ideas/2026-04-06_session6/agentwatch-agent.md
- ideas/2026-04-06_session6/readwise-agent.md
- ideas/2026-04-06_session6/index.md
- ideas/index.md (15 ideas tracked)

## Twitter Note
- Twitter API v2 WORKING via: export $(cat .env | grep TWITTER_BEARER_TOKEN) + curl
- DO NOT use Composio Twitter tools — no search endpoint
- @karpathy author_id = 33836629
- @levelsio author_id = 33836629 (NOTE: same value in DB — verify separately if needed)
- @swyx author_id = 33521530
