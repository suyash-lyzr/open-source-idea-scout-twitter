---
name: evaluate
description: Deep-dive evaluation of a specific project idea. Use when the user asks to evaluate, validate, or go deeper on an idea.
---

# Evaluate

When the user wants to go deeper on a specific idea:

## Step 1: Read the idea
Read the idea file from `ideas/`.

## Step 2: Deep competitor analysis
```bash
# Search for all related repos
curl -s "https://api.github.com/search/repositories?q={keywords}&sort=stars&order=desc&per_page=20"
```

For each competitor found:
- Stars, forks, last commit date
- Open issues (indicates demand + pain points)
- What they do well
- What they do poorly (read their GitHub issues for complaints)

## Step 3: Demand validation
- Check HN for discussions: are people asking for this?
- Check GitHub issues on related projects: what features are requested?
- Look for "awesome-*" lists in the space

## Step 4: Technical feasibility
- What's the minimum tech stack?
- Are there key libraries/APIs that make this easier?
- What's the hardest part to build?
- Estimated time for an MVP

## Step 5: Write evaluation report
Save to `ideas/<idea-name>-evaluation.md`:

```markdown
# Evaluation: [Idea Name]

## Verdict: BUILD / SKIP / MAYBE

## Competitor Landscape
(detailed competitor analysis)

## Demand Signals
(evidence that people want this)

## Technical Plan
(how to build the MVP)

## Risks
(what could go wrong)

## Recommended First Steps
1. ...
2. ...
3. ...
```
