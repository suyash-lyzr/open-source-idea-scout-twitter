---
name: research
description: Deep-dive research on a specific idea using live web search. Use when the user wants to know more about an idea — competitors, existing projects, discussions, market validation.
confidence: 1
usage_count: 1
success_count: 1
failure_count: 0
negative_examples: []
---

# Research

Deep-research a specific idea by searching the live web for competitors, existing projects, discussions, and validation signals.

## Step 1: Load Tavily API key
```bash
export $(cat .env | grep TAVILY_API_KEY)
```

## Step 2: Run multiple searches about the idea
For the given idea name/topic, run these searches:

```bash
# Search 1: Find existing competitors and alternatives
curl -s -X POST "https://api.tavily.com/search" \
  -H "Content-Type: application/json" \
  -d "{\"api_key\": \"$TAVILY_API_KEY\", \"query\": \"<IDEA_NAME> open source alternative competitor\", \"max_results\": 5, \"search_depth\": \"advanced\"}"

# Search 2: Find GitHub repos
curl -s -X POST "https://api.tavily.com/search" \
  -H "Content-Type: application/json" \
  -d "{\"api_key\": \"$TAVILY_API_KEY\", \"query\": \"<IDEA_NAME> github repo open source\", \"max_results\": 5, \"search_depth\": \"advanced\"}"

# Search 3: Find discussions (HN, Reddit, Twitter)
curl -s -X POST "https://api.tavily.com/search" \
  -H "Content-Type: application/json" \
  -d "{\"api_key\": \"$TAVILY_API_KEY\", \"query\": \"<IDEA_NAME> discussion hacker news reddit\", \"max_results\": 5, \"search_depth\": \"advanced\"}"

# Search 4: Market validation — are people paying for this?
curl -s -X POST "https://api.tavily.com/search" \
  -H "Content-Type: application/json" \
  -d "{\"api_key\": \"$TAVILY_API_KEY\", \"query\": \"<IDEA_NAME> pricing SaaS tool market\", \"max_results\": 5, \"search_depth\": \"advanced\"}"
```

Replace `<IDEA_NAME>` with keywords from the idea (e.g., "personal wiki AI agent", "token cost tracker LLM").

## Step 3: Also check GitHub API directly
```bash
curl -s "https://api.github.com/search/repositories?q=<KEYWORDS>&sort=stars&order=desc&per_page=10"
```

## Step 4: Compile research report
Analyze all results and produce a structured report:

```
## Research Report: [Idea Name]

### Existing Competitors
- [Name] — [what it does] — [stars/users/pricing] — [link]
- ...

### Open Source Projects
- [Repo] — [stars] — [last updated] — [link]
- ...

### Community Discussions
- [HN/Reddit/Twitter thread] — [key takeaway] — [link]
- ...

### Market Validation
- Are people paying for this? [yes/no + evidence]
- Estimated market size / demand signal
- Pricing of closest competitor

### Verdict
- Is this idea still worth building? [yes/no]
- What would make yours different?
- Suggested unique angle
```

## Step 5: Save report
Save to the idea's session folder as `<idea-name>-research.md`.
