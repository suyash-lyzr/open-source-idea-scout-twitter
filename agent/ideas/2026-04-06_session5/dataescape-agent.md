# DataEscape Agent

**Session:** 2026-04-06 Session 5
**Rank:** 🥉 #3

## Trend
HN story "My Google Workspace account suspension" hit **297 points and 155 comments** this week — all of them developers sharing their own horror stories of losing years of Gmail, Drive, and Docs access overnight with no recourse. Meanwhile on Twitter, voidmail.ai just launched a closed-source paid "email inbox for AI agents" — proving email autonomy for agents is a hot space but still proprietary.

## Sources
- https://news.ycombinator.com/item?id=47648404 — "My Google Workspace account suspension" (297pts, 155 cmts — HN Top 10 this week)
- https://x.com/i/status/2040835691425218641 — @voidmail.ai: "We just shipped email for AI agents. One API call → instant inbox. No CAPTCHA. No OAuth. Unlike AgentMail or Gmail MCP — we encrypt everything." (5 likes, 126 impressions) — CLOSED SOURCE, SaaS pricing
- https://x.com/i/status/2040791613786542360 — "Someone should build an app that makes you finish building apps" (0 likes, 9 impressions) — related wishlist

## The Gap
There is **no open-source GitClaw agent** that continuously exports your Google Workspace data (Gmail, Drive, Docs, Calendar, Contacts) on a schedule and stores it in a structured, versioned local/cloud archive — so that an account suspension can never wipe out years of your data. Existing tools like Google Takeout are manual one-time exports. There is no automated, scheduled, incremental, agent-driven backup system.

GitHub search for "google workspace backup agent" returned **0 relevant repos**.

## The GitClaw Agent
**DataEscape** is a GitClaw agent that runs on a weekly schedule, incrementally exports your Google Workspace data (Gmail threads, Drive files, Docs as Markdown, Calendar events, Contacts), and commits them to a local git repo. If your account ever gets suspended — you have everything. Optionally syncs to a second cloud (S3, Backblaze, Notion). Sends a Slack/email confirmation after each successful backup.

## MVP (1-2 weeks)
- **SOUL.md:** "I am DataEscape — I make sure you never lose your data to a platform. I run every week, export everything from your Google Workspace, and commit it to a local git archive. Your data is yours."
- **Skills:**
  - `export-gmail.md` — use Gmail API to fetch threads since last export, save as `.eml` or structured JSON
  - `export-drive.md` — use Drive API to incrementally download new/changed files, convert Docs→Markdown
  - `export-calendar.md` — fetch calendar events as `.ics` and structured JSON
  - `commit-and-tag.md` — git commit the export with a timestamp tag, push to remote if configured
  - `notify.md` — send a Slack or email summary: "Backed up 47 emails, 12 Drive files — last backup: 2026-04-06"
- **Integrations (Composio):** Gmail, Google Drive, Google Calendar, Slack (notifications), AWS S3 (optional remote)
- **Key feature 1:** Incremental — only exports what's new since last run (uses `lastExportTimestamp` stored in `memory/`)
- **Key feature 2:** Converts Google Docs to Markdown automatically — human-readable without Google's servers
- **Key feature 3:** Single `agent.yaml` config — set your Google credentials, schedule, and output path

## Stack
GitAgent spec + Claude 3.5 Haiku (cheap, scheduled) + Composio (Gmail + Drive + Calendar + Slack) + cron

## Why it'll get stars
- Every developer who read the HN thread will want this immediately. 297pts/155cmts of pure fear and no solution.
- "Own your data" is a universal developer value — this will get shared on HN/Reddit the moment it ships.
