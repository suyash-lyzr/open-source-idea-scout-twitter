# AgentGuard Agent

## What's trending
Multiple tweets this session all converge on the same pain: AI agents ignore their own constraints. One developer tweeted "I asked my AI agent to only draft emails, never send them. But it can just edit the Gmail script itself. And it would, to be helpful. The core problem with agent permissions: the constraints need to live outside the model." Another developer flagged macOS's all-or-nothing screen recording permission as a blocking problem for building agent tools. A third tweet from @AndroidStudio noted "granular permissions for AI agents is exactly right." This is a fresh, recurring signal with no good OSS solution — every team building agents is hitting this wall independently.

## Sources
- https://x.com/i/status/2041267324557439025 — "I asked my AI agent to only draft emails, never send them. But it can just edit the Gmail script itself. And it would, to be helpful. The core problem with agent permissions: the constraints need to live outside the model." (0 likes | 0 bookmarks | newly posted — catching it early)
- https://x.com/i/status/2041261816886780317 — "granular permissions for AI agents is exactly right. on macOS the screen recording permission is all or nothing which is a pain for building agent tools that need to see what the user sees. you basically have to ask for full screen access even if you only need a single window" (0 likes | 7 impressions — fresh signal)
- https://x.com/i/status/2041222524185575663 — Worldline launch: "most teams using AI coding agents still choose them by gut feel... it captures agent sessions, scores them, and tells you which agent to trust, where it fails..." (9 likes | 265 impressions) — closed-source; confirms agent reliability tracking is an unsolved problem

## The gap
No open-source GitClaw agent exists that:
1. Defines and enforces agent permission policies as code (markdown files in the agent's folder)
2. Intercepts tool calls before execution and validates them against a policy file (e.g. `PERMISSIONS.md` or `agent.yaml` rules)
3. Logs every action with a human-readable audit trail
4. Alerts/pauses the agent when a disallowed action is attempted — rather than letting the model work around it

Existing solutions are either model-side (prompt instructions the model ignores) or OS-level (too coarse). AgentGuard sits in the middleware layer — between the agent brain and its tools.

## The GitClaw agent
**AgentGuard** is a GitClaw meta-agent (a wrapper) that enforces permission policies on any other GitClaw agent. You define a `PERMISSIONS.md` in your agent's folder:

```markdown
## Allowed
- Read: filesystem (~/projects only)
- Write: filesystem (~/projects only)
- Send: none

## Denied
- Send: email
- Delete: any file
- Edit: any script outside ~/projects
```

AgentGuard intercepts every tool call, checks it against the policy, logs it to `AUDIT.md`, and either executes or blocks it. If blocked, it surfaces a plain-English explanation: "Agent attempted to send email — denied by PERMISSIONS.md line 6."

## MVP (1–2 weeks)
- **SOUL.md:** AgentGuard is the permission enforcement layer for GitClaw agents. Its purpose is to make agent constraints enforceable, not just hopeful. It intercepts tool calls, validates them against a policy file, logs every action, and blocks anything outside the policy — without modifying the underlying agent.
- **Skills:**
  1. `policy-parse` — reads `PERMISSIONS.md` or `agent.yaml` permissions block; builds a runtime allow/deny ruleset
  2. `intercept` — wraps each outgoing tool call; checks against ruleset before execution; logs to `AUDIT.md`
  3. `report` — generates a daily `AUDIT.md` summary: what the agent did, what it tried to do, what was blocked
- **Integrations:** None required — pure GitAgent middleware; works with any Composio tool the underlying agent uses
- **Key feature 1:** Policy-as-code — permissions live in version-controlled Markdown, not in a prompt or a dashboard
- **Key feature 2:** Audit log (`AUDIT.md`) — every tool call, timestamp, allowed/blocked status, human-readable reason

## Stack
GitAgent spec + Claude 3.5 Haiku (fast policy checking) + Python tool-call interceptor middleware

## Why it'll get stars
1. The "constraints must live outside the model" insight is going viral — this is the exact OSS implementation of that insight
2. Every team shipping agents needs this; there is zero good OSS answer today — AgentGuard fills the gap with a dead-simple Markdown-based policy system that fits GitAgent's philosophy perfectly
