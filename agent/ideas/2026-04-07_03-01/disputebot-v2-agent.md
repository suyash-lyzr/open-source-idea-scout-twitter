# DisputeBot v2 Agent

## What's trending
@levelsio (Pieter Levels) live-tweeted building an auto-dispute response system for his SaaS Interior AI — complete with Stripe webhooks, automated evidence collection, and auto-submission to Stripe. The tweet hit 167,217 impressions and 931 bookmarks. What makes this special: it's not a product announcement — it's a solo founder showing real-time that this works, costs almost nothing to build, and can reclaim thousands in fraudulent chargebacks. Every indie hacker and SaaS founder is watching. The gap: @levelsio built this for himself and kept it closed. There's no open-source GitClaw agent that any founder can deploy in minutes.

## Sources
- https://x.com/i/status/2041132289065631988 — @levelsio: "✅ Done. Made an auto-dispute response system for Interior AI to see how easy it'd be. It syncs old disputes but also catches new disputes via Stripe webhook and then auto submits evidence to try win them, it even includes the interior designs they generated in the evidence" (687 likes | 931 bookmarks | 29 RTs | 167,217 impressions)
- https://x.com/i/status/2041136501233262996 — @levelsio reply: "@spaceMonster None of this uses AI" (10 likes | 2,161 impressions) — confirms this is pure automation logic, not LLM-dependent; any developer can replicate it

## The gap
Stripe's chargeback/dispute system costs founders real money — typically 1–3% of revenue in fraud if left undefended. Existing tools (Chargebacks911, Disputify) are expensive SaaS products ($300–$1000+/month). @levelsio proved a working system can be built in a weekend. But:
1. His implementation is private and Interior AI-specific
2. No open-source GitClaw agent exists that generalizes this pattern
3. The agent needs to: listen for Stripe webhooks → auto-collect evidence (purchase records, usage logs, IP data, screenshots) → format a dispute response → submit via Stripe API — all autonomously

## The GitClaw agent
**DisputeBot** is a GitClaw agent that connects to your Stripe account, listens for dispute webhooks, auto-assembles evidence packets from your existing data sources (Stripe logs, database records, email receipts, generated assets), drafts a dispute response, and submits it to Stripe — all without human intervention. You configure it once via `config.yaml`: point it at your Stripe key, your evidence sources, and a template for your product type. Then it runs as a scheduled GitClaw task.

## MVP (1–2 weeks)
- **SOUL.md:** DisputeBot is an autonomous Stripe dispute fighter. Its purpose is to protect indie founders from chargeback fraud by automatically collecting evidence and submitting dispute responses the moment a new dispute lands. It is fast, thorough, and relentless — it never misses a dispute deadline.
- **Skills:**
  1. `webhook-listener` — registers a Stripe webhook endpoint; fires on `charge.dispute.created` events; saves dispute metadata to `disputes/YYYY-MM-DD-{id}.md`
  2. `evidence-collector` — given a dispute, pulls: Stripe charge details, customer metadata, usage logs from a configurable data source, and any generated assets (screenshots, PDFs)
  3. `submit-response` — formats evidence into Stripe's required format; submits via Stripe API; logs outcome to `disputes/{id}-outcome.md`
- **Integrations:** Composio Stripe connector (charge lookup, dispute submission), Composio filesystem (evidence storage), optional Composio SendGrid (notify founder on win/loss)
- **Key feature 1:** Zero-config evidence templates — ships with templates for SaaS, digital goods, and AI-generated content products (the @levelsio use case)
- **Key feature 2:** Dispute deadline tracker — Stripe gives 7–21 days to respond; the agent surfaces a `DISPUTES.md` leaderboard showing pending deadlines

## Stack
GitAgent spec + Claude 3.5 Haiku (evidence drafting) + Composio Stripe + Composio filesystem + ngrok or Cloudflare tunnel for webhook endpoint

## Why it'll get stars
1. @levelsio's live-build tweet is the playbook — every indie hacker who saw it (167K impressions, 931 bookmarks) will want to deploy the open-source version for their own SaaS
2. It's a money-making agent — directly recoverable revenue — which means founders will actually use it, not just star it
