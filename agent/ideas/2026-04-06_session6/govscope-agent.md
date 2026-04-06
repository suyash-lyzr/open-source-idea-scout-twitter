# GovScope — AI Government Accountability Agent

## What's trending
@karpathy tweeted (619,680 impressions, 4,888 likes, 3,087 bookmarks): "I am bullish on people (empowered by AI) increasing the visibility, legibility and accountability of their governments. Historically it is governments that act to make society legible ('Seeing like a state'). AI now flips this." This is a completely untapped space — no OSS GitClaw agent exists that gives citizens AI-powered tools to monitor, parse, and hold governments accountable in real time.

## Sources
- https://x.com/i/status/2040549459193704852 — @karpathy: "Bullish on people empowered by AI increasing the visibility, legibility and accountability of their governments." (619,680 impressions · 4,888 likes · 3,087 bookmarks · 594 RTs)
- https://x.com/i/status/2040572272944324650 — @karpathy: "Farzapedia — personal wikipedia. Explicit. Portable. Version-controlled. I really like this approach to personalization." (808,375 impressions · 7,127 likes · 10,402 bookmarks · 646 RTs) — confirms karpathy's "make things legible" arc

## The gap
There is no open-source agent that watches government data feeds (legislation, spending, contracts, lobbying disclosures, voting records) and generates plain-English summaries, alerts, and accountability reports. Civic tech tools like GovTrack and OpenSecrets exist but are read-only websites — not agents that monitor, summarize, compare, and alert you. No GitClaw agent tackles this.

## The GitClaw agent
GovScope is a scheduled GitClaw agent that watches government open data sources (Congress.gov API, USASpending.gov, FEC, OpenSecrets, local government data APIs), parses legislation and spending data via LLM, generates plain-English "accountability digests," detects anomalies (sudden budget redirections, voting flip-flops, undisclosed lobbying ties), and files findings as markdown reports committed to git — creating a version-controlled, auditable accountability record.

## MVP (1–2 weeks)

- **SOUL.md:** "I am GovScope. I watch your government so you don't have to. I turn dense legislative and spending data into plain-English accountability reports, filed daily to a git repo you own. I find the anomalies. I connect the dots. I make the state legible."
- **Skills:**
  - `fetch-legislation`: Polls Congress.gov API for new bills matching keyword filters. Summarizes in 3 sentences.
  - `spending-watchdog`: Queries USASpending.gov for contracts over threshold. Flags sudden redirections or unusual vendors.
  - `accountability-digest`: Assembles daily markdown report of all findings. Commits to git. Posts summary to Discord/Slack webhook.
- **Integrations:** Congress.gov API (free), USASpending.gov API (free), FEC API (free), Slack/Discord (Composio), GitHub (Composio for auto-commit)
- **Key feature 1:** Scheduled daily scan → markdown digest → git commit. Every report is auditable, diffable, shareable.
- **Key feature 2:** "Anomaly detection" — LLM compares this week's spending/votes against last week's baseline and flags deviations in plain English.

## Stack
GitAgent spec + Claude 3.5 Sonnet + Congress.gov / USASpending.gov / FEC free APIs + Composio (Slack, GitHub)

## Why it'll get stars
- @karpathy's 619K-impression tweet is a direct call to build this — it's the clearest influencer mandate in this scan
- Zero OSS competitors in the GitClaw/agent space — this is a genuine gap
- Civic tech angle attracts journalists, activists, and developers who want to "do something useful with AI" — strong viral potential
- Every government in the world has open data APIs — this scales globally with config changes
