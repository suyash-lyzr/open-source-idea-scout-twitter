# AgentWatch — Open-Source Agent Observability Layer

## What's trending
A founder building Vorim AI tweeted: "A friend's company had 30+ AI agents in production. One of them started accessing customer data it shouldn't have. Took them 2 DAYS to figure out which agent it was. 2 days. For something that should take 30 seconds." This captures an exploding real pain: as multi-agent systems hit production (Codex plugins, Cursor agents, GitClaw pipelines), there is NO open-source observability layer — no way to see which agent did what, when, and why. RetainDB's closed-source launch (161 impressions, 3 RTs) confirmed: teams are hitting the "agents work in silos, context gets lost" problem at scale.

## Sources
- https://x.com/i/status/2040927439480590352 — Vorim AI founder: "Company had 30+ AI agents in prod. One accessed customer data it shouldn't. Took 2 DAYS to find which agent. Should take 30 seconds." (10 impressions · 1 like — very fresh signal)
- https://x.com/i/status/2040862533448356308 — RetainDB launch: "Until now, AI agents had memory, but they still worked in silos. One agent processes a document, another has no idea it exists. Everything has to be re-uploaded, re-parsed. Context keeps getting lost. We fixed that." (161 impressions · 3 likes · 3 RTs · 1 QT — closed-source gap)
- https://x.com/i/status/2040915514092929373 — "Codex v0.117.0 just shipped. Sub-agents use readable paths like /root/agent_a instead of raw UUIDs" — confirms multi-agent systems are shipping NOW and readability/tracing is already a concern (7 impressions)
- https://x.com/i/status/2040931641674125812 — "When the agent doesn't understand, it transfers to a human with zero context. Customer repeats everything. CSAT tanks. The real culprit is a missing handoff spec." (2 impressions — strong concept signal)

## The gap
Multi-agent systems are entering production in 2026 — Codex, Cursor agents, GitClaw pipelines, dental scheduling agents, trading bots. But there is NO open-source tool that:
1. Logs every agent action with structured, queryable audit trails
2. Lets you trace which agent accessed what data and when
3. Detects anomalies across agents in real time
4. Produces human-readable handoff context when an agent escalates to a human
Closed-source tools (RetainDB, Vorim AI) are being built but cost money and lock in your data.

## The GitClaw agent
AgentWatch is a GitClaw meta-agent that wraps around your existing agents. It intercepts every tool call and LLM invocation, logs them to a structured SQLite store, detects anomalies (unexpected data access, repeated failures, out-of-scope tool use), writes daily audit digests to markdown, and generates handoff summaries when an agent escalates to a human — so the human has full context without the customer repeating themselves.

## MVP (1–2 weeks)

- **SOUL.md:** "I am AgentWatch. I watch your agents so you always know what they did, what they touched, and why. I turn chaotic multi-agent logs into structured audit trails you own — in plain markdown, committed to git. When something goes wrong, I tell you in 30 seconds, not 2 days."
- **Skills:**
  - `action-logger`: Intercepts any GitClaw agent's tool calls. Writes structured JSON event log to SQLite. Tags by agent name, tool, timestamp, data accessed.
  - `anomaly-scanner`: Runs on schedule. Checks for agents accessing unexpected resources, repeated failures, or out-of-pattern behavior. Posts alerts to Slack.
  - `handoff-brief`: When a GitClaw agent uses an `escalate` skill, generates a plain-English context summary for the human who takes over. No customer should ever have to repeat themselves.
  - `audit-digest`: Daily markdown report of all agent activity. Diffs against yesterday. Committed to git.
- **Integrations:** Composio (Slack for alerts, GitHub for audit commits), SQLite (local-first), optional Composio Linear/Jira for creating incident tickets on anomaly detection
- **Key feature 1:** 30-second agent forensics — query "which agent accessed X?" and get an instant answer from the SQLite audit log
- **Key feature 2:** Human handoff briefs — structured context doc generated every time an agent escalates, so no customer ever repeats themselves again

## Stack
GitAgent spec + Claude 3.5 Sonnet + SQLite (local audit store) + Composio (Slack, GitHub, Jira)

## Why it'll get stars
- The "2 days to find the rogue agent" story is viscerally relatable — every team running agents in prod has felt this
- RetainDB and Vorim AI are raising money to solve this closed-source — an OSS alternative will attract developers who won't pay $X/month for observability
- Strong "DevOps for agents" angle — analogous to how Datadog/Prometheus blew up for microservices; this is the same moment for AI agents
- GitClaw-native: no other agent framework has an OSS observability layer built in
