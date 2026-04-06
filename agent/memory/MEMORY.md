# IdeaScout Memory

## Last Scouting Session
- Date: 2026-04-07 (Session 7 — full Twitter API v2, 8 searches)
- Sources: Twitter API v2 only (8 searches, ~80 tweets analyzed)
- Twitter API: WORKING via curl with Bearer Token from .env

## Key Signals Found (Session 7)
1. **Graphify viral tweet** — 198,368 impressions, 3,726 likes, 8,140 bookmarks, 395 RTs. "Someone just built the exact tool Karpathy said someone should build — 48 hours after Karpathy posted his LLM Knowledge Bases workflow." tweet/2041192946369007924. Graphify = static one-shot tool. Gap = GitClaw agent that continuously maintains + queries a living knowledge graph.
2. **@levelsio auto-dispute system** — 164,587 impressions, 685 likes, 926 bookmarks, 29 RTs. "@levelsio made an auto-dispute response system for Interior AI — Stripe webhook, syncs old disputes, auto submits evidence." tweet/2041132289065631988. No OSS GitClaw agent does this.
3. **Worldline launch (closed-source agent benchmarking)** — 260 impressions, 9 likes. "Teams choose AI coding agents by gut feel. Worldline captures sessions, scores them, tells you which agent to trust." tweet/2041222524185575663. No open-source equivalent exists.
4. **@karpathy Personal Wikipedia** — 1,004,135 impressions, 8,328 likes, 12,128 bookmarks (still the biggest ongoing signal). tweet/2040572272944324650
5. **@karpathy Government accountability** — 760,228 impressions, 5,582 likes, 3,550 bookmarks. tweet/2040549459193704852
6. **@karpathy GitHub Gists > X** — 135,323 impressions, 631 likes, 204 bookmarks. tweet/2040806346556428585
7. **Instaclaw cross-session memory shipped** — 1,249 impressions, 24 likes, 5 RTs. Tiered memory with session summaries. tweet/2041215763139235898

## Ideas Generated (Session 7)
16. **KnowledgeGraph Agent** — GitClaw agent that continuously rebuilds + queries a knowledge graph from a living codebase. "gitclaw ask 'what depends on auth.py?'" Karpathy LLM Knowledge Bases → Graphify → this is the agentic next step.
17. **DisputeBot Agent** — GitClaw agent that hooks Stripe webhooks, auto-collects evidence, drafts + submits dispute responses. @levelsio proved the need live on Twitter.
18. **AgentBench Agent** — GitClaw agent that wraps coding agent sessions, scores output quality, maintains a git-native LEADERBOARD.md per project. Worldline is the closed-source competition.

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
16. KnowledgeGraph Agent — Living codebase knowledge graph (Graphify viral, 198K impressions)
17. DisputeBot Agent — Stripe auto-dispute fighter (@levelsio signal, 164K impressions)
18. AgentBench Agent — Git-native coding agent benchmarker (Worldline gap)

## Files Created
- scouted/2026-04-06-trends.md
- scouted/2026-04-06-twitter-wishlist.md
- scouted/2026-04-06-session3-trends.md
- scouted/2026-04-06-session5-trends.md
- scouted/2026-04-06-session6-trends.md
- scouted/2026-04-07-trends.md ← NEW S7
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
- ideas/2026-04-07_02-54/graphify-agent.md ← NEW S7
- ideas/2026-04-07_02-54/disputebot-agent.md ← NEW S7
- ideas/2026-04-07_02-54/agentbench-agent.md ← NEW S7
- ideas/2026-04-07_02-54/index.md ← NEW S7
- ideas/index.md (18 ideas tracked)

## Twitter Note
- Twitter API v2 WORKING via: export $(cat .env | grep TWITTER_BEARER_TOKEN) + curl
- DO NOT use Composio Twitter tools — no search endpoint
- @karpathy author_id = 33836629
- @levelsio author_id = 1577241403
- @swyx author_id = 33521530