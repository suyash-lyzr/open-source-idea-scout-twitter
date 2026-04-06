# Idea: DisputeBot Agent
**Session:** 2026-04-07_02-54
**Rank:** #2

## What's trending
@levelsio (Pieter Levels) shipped an auto-dispute response system for Interior AI in real-time on Twitter. It hooks Stripe webhooks, syncs past disputes, and auto-submits evidence including generated images. The tweet hit **164,587 impressions and 926 bookmarks** — enormous engagement for a technical tweet. Every indie hacker and SaaS founder paying Stripe fees is watching this. There is NO open-source GitClaw agent that does this. Every solution is either manual or locked in expensive SaaS.

## Sources
- https://x.com/i/status/2041132289065631988 — @levelsio: "✅ Done. 💳 Made an auto-dispute response system for Interior AI to see how easy it'd be. It syncs old disputes but also catches new disputes via Stripe webhook and then auto submits evidence to try win them, it even includes the interior designs they generated in the evidence" (685 likes | 29 RTs | 926 bookmarks | 164,587 impressions)
- https://x.com/i/status/2040806346556428585 — @karpathy: "Surprised with how good the comments on github gists are... @github consider competing with X (?)" (631 likes | 204 bookmarks | 135,323 impressions) — background signal on the builder community watching levelsio closely

## The gap
Stripe disputes ("chargebacks") cost founders $15-35 per dispute in fees, plus lost revenue. Responding manually is time-consuming and inconsistent. No open-source agent:
- Monitors Stripe for new disputes via webhook
- Auto-pulls relevant evidence (receipts, usage logs, emails, generated content)
- Drafts a dispute response using LLM
- Submits evidence to Stripe automatically
- Tracks win/loss rates and improves over time

## The GitClaw agent: DisputeBot Agent
A GitClaw agent that plugs into your Stripe account and:
1. Listens for dispute webhooks
2. Fetches customer transaction history, product logs, any delivery proof
3. Generates a dispute response letter using LLM
4. Submits the response and evidence to Stripe via API
5. Logs outcome to git memory — tracks which response patterns win disputes

## MVP (1-2 weeks)
- **SOUL.md:** "I am your chargeback fighter. I watch your Stripe disputes 24/7, gather evidence automatically, and submit the strongest possible response — so you get your money back without lifting a finger."
- **Skills:**
  - `dispute-watcher` — Stripe webhook listener, polls for new disputes
  - `evidence-collector` — fetches purchase data, user activity logs, delivery receipts from Stripe + connected data sources
  - `response-drafter` — LLM-generates dispute response letter from evidence
  - `outcome-tracker` — commits win/loss record to git memory for pattern learning
- **Integrations:** Stripe (Composio), Gmail/email (Composio for customer comms), Notion/Airtable (Composio for product logs if needed)
- **Key feature 1:** Zero-touch dispute response — from webhook to submitted evidence with no human intervention
- **Key feature 2:** Win rate memory — agent learns which evidence types and response patterns win disputes, improves over time

## Stack
GitAgent spec + Claude 3.5 Sonnet + Stripe Composio integration + Gmail Composio integration + git memory

## Why it'll get stars
- @levelsio has one of the most-watched developer audiences on X. He literally demo'd the need for this in real-time.
- Every indie hacker loses money to chargebacks. This directly saves founders money.
- "Set it up once, never lose a winnable dispute again" is an extremely shareable outcome.
