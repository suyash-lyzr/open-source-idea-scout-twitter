---
name: ideate
description: Generate open-source project ideas from scouted trends. Use when the user asks for ideas, project suggestions, or what to build.
---

# Ideate

Generate actionable open-source project ideas from scouted data:

## Step 1: Read latest scouting data
Read the most recent file in `scouted/` to get current trends.

## Step 2: For each interesting trend, check for existing solutions
```bash
# Search GitHub for existing projects
curl -s "https://api.github.com/search/repositories?q={keywords}&sort=stars&order=desc&per_page=5"
```

## Step 3: Identify gaps
For each trend, ask:
- Is there an open-source version? If no → opportunity
- Is the existing OSS version abandoned/poorly maintained? → opportunity
- Could a simpler, more focused version win? → opportunity
- Is there a new angle nobody has tried? → opportunity

## Step 4: Generate ideas
For each gap, write a detailed idea following the format in SOUL.md:
- Project name suggestion
- The trend + the gap
- What to build
- Why it would get traction
- Competitors
- MVP scope (buildable in 1-2 weeks by one person)
- Tech stack + difficulty

## Step 5: Save ideas
- Save each idea to `ideas/<idea-name>.md`
- Update `ideas/index.md` with the new idea
- Report all ideas to the user with a summary
