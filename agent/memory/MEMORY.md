# IdeaScout Memory

## Last Scouting Session
- Date: 2026-04-07 (Session 8 — full Twitter API v2, 8 searches)
- Sources: Twitter API v2 only (8 searches, ~80 tweets analyzed)
- Twitter API: WORKING via curl with Bearer Token from .env

## Key Signals Found (Session 8)
1. **@karpathy epub→agent tweet** — 50,717 impressions, 1,008 likes, 410 bookmarks. "The best epub to txt converter I found is just asking your favorite agent to do it. Epubs can be very diverse, the agent just goes in, figures it out..." tweet/2040451573881737480. NEW signal — Karpathy explicitly saying agents are best for format-agnostic doc ingestion.
2. **Agent permission pain** — Multiple fresh tweets (Search 5 + AI agent trends). "The core problem with agent permissions: the constraints need to live outside the model." tweet/2041267324557439025. macOS all-or-nothing screen recording pain tweet/2041261816886780317. No OSS agent permission layer exists.
3. **@levelsio auto-dispute (refreshed)** — 167,217 impressions, 687 likes, 931 bookmarks. "None of this uses AI" confirmation. tweet/2041132289065631988. Still trending — still no OSS version exists.
4. **@karpathy Farzapedia** — 1,004,920 impressions, 8,331 likes, 12,133 bookmarks. tweet/2040572272944324650. Still #1 signal.
5. **@karpathy Government accountability** — 760,597 impressions, 5,586 likes, 3,551 bookmarks. tweet/2040549459193704852
6. **Graphify viral** — 203,483 impressions, 3,810 likes, 8,331 bookmarks. tweet/2041192946369007924
7. **Helicone acquired by Mintlify** — going into maintenance mode. LLM cost monitoring gap confirmed. tweet/2041222189219770709
8. **Worldline (coding agent benchmarking)** — 265 impressions, 9 likes. Still closed-source. tweet/2041222524185575663

## Ideas Generated (Session 8)
19. **DocIngester Agent** — Format-agnostic document ingestion agent. epub/PDF/Docx/URL → clean queryable KNOWLEDGE.md. LLM-first extraction strategy per file type. Karpathy signal: "just ask your agent to do it."
20. **AgentGuard Agent** — Policy-as-code permission enforcement middleware for GitClaw agents. PERMISSIONS.md defines allow/deny rules. Intercepts tool calls before execution. Logs to AUDIT.md. "Constraints must live outside the model."
21. **DisputeBot v2** — Open-source implementation of @levelsio's auto-dispute system. Stripe webhook → evidence collection → auto-submit. Zero-config templates for SaaS/digital goods/AI-generated content.

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
19. DocIngester Agent — Format-agnostic doc→KNOWLEDGE.md (Karpathy epub tweet, 50K impressions) ← NEW S8
20. AgentGuard Agent — Permission enforcement middleware (agent permission pain, fresh signal) ← NEW S8
21. DisputeBot v2 — Open-source @levelsio auto-dispute (167K impressions, 931 bookmarks) ← NEW S8

## Files Created
- scouted/2026-04-06-trends.md
- scouted/2026-04-06-twitter-wishlist.md
- scouted/2026-04-06-session3-trends.md
- scouted/2026-04-06-session5-trends.md
- scouted/2026-04-06-session6-trends.md
- scouted/2026-04-07-trends.md
- scouted/2026-04-07-session8-trends.md ← NEW S8
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
- ideas/2026-04-07_02-54/graphify-agent.md
- ideas/2026-04-07_02-54/disputebot-agent.md
- ideas/2026-04-07_02-54/agentbench-agent.md
- ideas/2026-04-07_02-54/index.md
- ideas/2026-04-07_03-01/docingester-agent.md ← NEW S8
- ideas/2026-04-07_03-01/agentguard-agent.md ← NEW S8
- ideas/2026-04-07_03-01/disputebot-v2-agent.md ← NEW S8
- ideas/2026-04-07_03-01/index.md ← NEW S8
- ideas/index.md (21 ideas tracked)

## Twitter Note
- Twitter API v2 WORKING via: export $(cat .env | grep TWITTER_BEARER_TOKEN) + curl
- DO NOT use Composio Twitter tools — no search endpoint
- @karpathy author_id = 33836629
- @levelsio author_id = 1577241403
- @swyx author_id = 33521530
