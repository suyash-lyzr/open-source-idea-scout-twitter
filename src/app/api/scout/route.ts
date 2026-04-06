import { NextResponse } from "next/server";

export const maxDuration = 120;

const TWITTER_BEARER = process.env.TWITTER_BEARER_TOKEN || "";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";

// In-memory session store
const sessionStore: Session[] = [];

// ── Types ───────────────────────────────────────────────────────

interface Tweet {
  id: string; text: string; author_id: string; created_at: string;
  public_metrics: {
    retweet_count: number; reply_count: number; like_count: number;
    quote_count: number; bookmark_count: number; impression_count: number;
  };
  category: string; engagement: number; link: string;
}

interface Source { url: string; description: string }
interface Idea {
  name: string; fileName: string; pitch: string; trend: string;
  sources: Source[]; gap: string; agentDescription: string;
  mvp: string[]; stack: string; buildTime: string;
  viralityScore: number; whyGitClaw: string; claudeMd: string;
  rawContent: string;
  marketCheck: { exists: boolean; competitors: { name: string; url: string; snippet: string }[]; verdict: string };
}
interface Session { name: string; date: string; time: string; ideas: Idea[] }

// ── Twitter Searches ────────────────────────────────────────────

const SEARCHES = [
  { query: '%22someone%20should%20build%22%20-is:retweet', category: 'Wishlist' },
  { query: '%22I%20wish%20there%20was%22%20-is:retweet', category: 'Pain Point' },
  { query: '%22open%20source%20alternative%22%20-is:retweet', category: 'OSS Demand' },
  { query: '(%22just%20shipped%22%20OR%20%22just%20launched%22)%20(AI%20agent%20OR%20developer%20tool)%20-is:retweet', category: 'New Launch' },
  { query: '(AI%20agent%20OR%20coding%20agent)%20(idea%20OR%20build%20OR%20need%20OR%20missing)%20-is:retweet', category: 'Agent Trend' },
  { query: '(from:karpathy%20OR%20from:levelsio%20OR%20from:swyx)%20(agent%20OR%20AI%20OR%20build%20OR%20open%20source)%20-is:retweet', category: 'Influencer' },
  { query: '%22why%20is%20there%20no%22%20(tool%20OR%20app%20OR%20agent)%20-is:retweet', category: 'Unmet Need' },
  { query: '(%22so%20frustrating%22%20OR%20%22waste%20of%20time%22)%20(developer%20OR%20coding%20OR%20AI)%20-is:retweet', category: 'Frustration' },
];

async function searchTwitter(query: string, category: string): Promise<Tweet[]> {
  try {
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=10&tweet.fields=public_metrics,author_id,created_at`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TWITTER_BEARER}` } });
    const data = await res.json();
    if (!data.data) return [];

    return data.data.map((t: Record<string, unknown>) => {
      const metrics = t.public_metrics as Tweet["public_metrics"];
      const engagement =
        (metrics?.like_count || 0) * 3 + (metrics?.retweet_count || 0) * 5 +
        (metrics?.bookmark_count || 0) * 4 + (metrics?.reply_count || 0) * 2 +
        (metrics?.quote_count || 0) * 3;
      return {
        id: t.id, text: t.text, author_id: t.author_id, created_at: t.created_at,
        public_metrics: metrics, category, engagement,
        link: `https://x.com/i/status/${t.id}`,
      };
    });
  } catch { return []; }
}

// ── Claude Analysis (Anthropic API) ─────────────────────────────

async function analyzeWithClaude(tweets: Tweet[]): Promise<string> {
  const tweetData = tweets.map((t) => {
    const m = t.public_metrics;
    return `[${t.category}] ${t.text}
  Link: ${t.link}
  Metrics: ${m?.like_count || 0} likes, ${m?.retweet_count || 0} RTs, ${m?.bookmark_count || 0} bookmarks, ${m?.impression_count || 0} impressions
  Engagement score: ${t.engagement}`;
  }).join("\n\n");

  const systemPrompt = `You are IdeaScout — an agent that analyzes Twitter/X trends and generates the top 3 open-source GitClaw/GitAgent agent ideas.

## What is GitAgent/GitClaw
- GitAgent = open spec for defining AI agents as folders of markdown files (SOUL.md + agent.yaml + skills/ + memory/)
- GitClaw = runtime that executes GitAgent agents (CLI, SDK, Voice UI)
- Agents can use: CLI tools, file read/write, memory, Composio integrations (500+ apps)
- Agents are portable — export to Claude Code, Cursor, Windsurf, etc.

## Types of ideas to look for
1. Closed-source tools that should be open-source agents
2. Ideas from tech influencers (Karpathy, Levelsio, swyx, etc.)
3. Trending workflows that should be automated
4. Gaps in the AI agent ecosystem
5. Viral complaints/wishlists — "someone should build X" tweets

## Output format — respond with EXACTLY this JSON structure:
{
  "ideas": [
    {
      "name": "AgentName",
      "pitch": "2-3 sentence description of what this agent does",
      "trend": "What's trending and why this matters",
      "sources": [
        { "url": "https://x.com/i/status/...", "description": "tweet text (likes, bookmarks, impressions)" }
      ],
      "gap": "What problem this solves — why no good agent/tool exists for this",
      "agentDescription": "Detailed description of what this GitClaw agent would do",
      "mvp": ["SOUL.md: ...", "Skill 1: ...", "Skill 2: ...", "Key feature 1", "Key feature 2"],
      "stack": "GitAgent spec + Claude Sonnet 4.6 + relevant integrations",
      "buildTime": "1-2 weeks",
      "viralityScore": 4,
      "whyGitClaw": "Why this is perfect as a GitClaw agent and why it'll get stars"
    }
  ]
}

## Rules
- Output EXACTLY 3 ideas, ranked by potential (highest first)
- Every idea MUST have real tweet links from the data provided
- Every idea MUST be buildable as a GitClaw agent by a single developer in 1-2 weeks
- viralityScore: 1-5 based on engagement (5 = highest engagement tweets)
- NEVER fabricate metrics — only use what's in the tweet data
- NEVER suggest ideas that are just "clone X" — there must be a unique angle
- Focus on ideas with the highest engagement tweets as signal
- Respond with ONLY the JSON, no markdown fences, no extra text`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: `Here are ${tweets.length} viral tweets from 8 different Twitter searches. Analyze them and generate the top 3 GitClaw agent ideas.\n\n${tweetData}`,
      }],
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.content?.[0]?.text || "";
}

// ── API Routes ──────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({ sessions: sessionStore });
}

export async function POST() {
  try {
    // Step 1: Fetch tweets from all 8 searches in parallel
    const allResults = await Promise.all(
      SEARCHES.map((s) => searchTwitter(s.query, s.category))
    );

    const allTweets = allResults.flat()
      .filter((t) => {
        const m = t.public_metrics;
        return (m?.like_count || 0) >= 5 || (m?.impression_count || 0) >= 500;
      })
      .filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i)
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 40); // Send top 40 tweets to Claude

    if (allTweets.length === 0) {
      return NextResponse.json({ error: "No viral tweets found. Twitter API may be rate-limited." }, { status: 500 });
    }

    // Step 2: Send tweets to Claude Sonnet 4.6 for analysis
    const claudeResponse = await analyzeWithClaude(allTweets);

    // Step 3: Parse Claude's JSON response
    let parsed: { ideas: Array<{
      name: string; pitch: string; trend: string;
      sources: Source[]; gap: string; agentDescription: string;
      mvp: string[]; stack: string; buildTime: string;
      viralityScore: number; whyGitClaw: string;
    }> };

    try {
      // Strip markdown fences if present
      const jsonStr = claudeResponse.replace(/^```json?\n?/m, "").replace(/\n?```$/m, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse Claude response:", claudeResponse.slice(0, 500));
      return NextResponse.json({ error: "Failed to parse AI response. Please try again." }, { status: 500 });
    }

    // Step 4: Build Idea objects
    const ideas: Idea[] = (parsed.ideas || []).slice(0, 3).map((idea) => {
      const fileName = idea.name.toLowerCase().replace(/\s+/g, "-") + ".md";
      const claudeMd = `# ${idea.name}

## Identity
You are building "${idea.name}" — a GitClaw/GitAgent-based open-source agent.

## What this agent does
${idea.pitch}

## Problem it solves
${idea.gap}

## Architecture
\`\`\`
${idea.name.toLowerCase().replace(/\s+/g, "-")}/
  agent.yaml
  SOUL.md
  RULES.md
  skills/
  memory/
  .env
\`\`\`

## MVP Scope
${idea.mvp.map((item) => `- ${item}`).join("\n")}

## How to build
1. Create the folder structure above
2. Write SOUL.md with the agent's identity
3. Write agent.yaml with model, tools, and skills
4. Build each skill as a SKILL.md file
5. Test with: \`gitclaw --dir . "test prompt"\`
`;

      return {
        name: idea.name,
        fileName,
        pitch: idea.pitch,
        trend: idea.trend,
        sources: idea.sources || [],
        gap: idea.gap,
        agentDescription: idea.agentDescription,
        mvp: idea.mvp || [],
        stack: idea.stack || "GitAgent spec + Claude Sonnet 4.6 + Composio",
        buildTime: idea.buildTime || "1-2 weeks",
        viralityScore: idea.viralityScore || 3,
        whyGitClaw: idea.whyGitClaw,
        claudeMd,
        rawContent: claudeResponse,
        marketCheck: { exists: false, competitors: [], verdict: "" },
      };
    });

    ideas.sort((a, b) => b.viralityScore - a.viralityScore);

    // Step 5: Save to session store
    const now = new Date();
    const session: Session = {
      name: `${now.toISOString().slice(0, 10)}_${now.toISOString().slice(11, 16).replace(":", "-")}`,
      date: now.toISOString().slice(0, 10),
      time: now.toISOString().slice(11, 16),
      ideas,
    };

    sessionStore.unshift(session);
    if (sessionStore.length > 10) sessionStore.pop();

    return NextResponse.json({ ideas, session: session.name, sessions: sessionStore });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Scout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
