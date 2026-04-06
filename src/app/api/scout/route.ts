import { NextResponse } from "next/server";

export const maxDuration = 120;

const TWITTER_BEARER = process.env.TWITTER_BEARER_TOKEN || "";
const TAVILY_KEY = process.env.TAVILY_API_KEY || "";

// In-memory session store (persists across requests while server is running)
const sessionStore: Session[] = [];

// Minimum engagement to consider a tweet "viral"
const MIN_LIKES = 5;
const MIN_IMPRESSIONS = 500;

// ── Twitter Search ──────────────────────────────────────────────

interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    bookmark_count: number;
    impression_count: number;
  };
  category: string;
  engagement: number;
  link: string;
}

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
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TWITTER_BEARER}` },
    });
    const data = await res.json();
    if (!data.data) return [];

    return data.data.map((t: Record<string, unknown>) => {
      const metrics = t.public_metrics as Tweet["public_metrics"];
      const engagement =
        (metrics?.like_count || 0) * 3 +
        (metrics?.retweet_count || 0) * 5 +
        (metrics?.bookmark_count || 0) * 4 +
        (metrics?.reply_count || 0) * 2 +
        (metrics?.quote_count || 0) * 3;

      return {
        id: t.id,
        text: t.text,
        author_id: t.author_id,
        created_at: t.created_at,
        public_metrics: metrics,
        category,
        engagement,
        link: `https://x.com/i/status/${t.id}`,
      };
    });
  } catch {
    return [];
  }
}

// ── Tavily Search ───────────────────────────────────────────────

interface TavilyResult {
  url: string;
  title: string;
  content: string;
  score: number;
}

async function tavilySearch(query: string): Promise<TavilyResult[]> {
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_KEY,
        query,
        max_results: 3,
        search_depth: "basic",
      }),
    });
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

// ── Idea Generation ─────────────────────────────────────────────

interface Idea {
  name: string;
  fileName: string;
  pitch: string;
  trend: string;
  sources: { url: string; description: string }[];
  gap: string;
  agentDescription: string;
  mvp: string[];
  stack: string;
  buildTime: string;
  viralityScore: number;
  whyGitClaw: string;
  claudeMd: string;
  rawContent: string;
  marketCheck: {
    exists: boolean;
    competitors: { name: string; url: string; snippet: string }[];
    verdict: string;
  };
}

function groupTweetsByTheme(tweets: Tweet[]): Map<string, Tweet[]> {
  const themes = new Map<string, Tweet[]>();
  const keywords: Record<string, string[]> = {};

  for (const tweet of tweets) {
    const text = tweet.text.toLowerCase();
    // Extract 2-3 word phrases as rough theme keys
    const words = text
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["should", "build", "there", "would", "could", "someone", "really", "about", "their", "these", "those", "with", "from", "have", "this", "that", "just", "more", "been", "what", "when", "will", "like", "than", "into", "also", "very"].includes(w));

    // Use category + top keywords as grouping key
    const key = `${tweet.category}:${words.slice(0, 3).join("+")}`;

    // Find similar existing theme or create new
    let matched = false;
    for (const [existingKey, existingTweets] of themes) {
      const existingWords = keywords[existingKey] || [];
      const overlap = words.filter((w) => existingWords.includes(w));
      if (overlap.length >= 2 || existingKey.split(":")[0] === tweet.category && overlap.length >= 1) {
        existingTweets.push(tweet);
        keywords[existingKey] = [...new Set([...existingWords, ...words])];
        matched = true;
        break;
      }
    }
    if (!matched) {
      themes.set(key, [tweet]);
      keywords[key] = words;
    }
  }

  return themes;
}

function generateIdeaFromTweets(tweets: Tweet[], rank: number): Omit<Idea, "marketCheck"> {
  // Sort by engagement within the group
  tweets.sort((a, b) => b.engagement - a.engagement);
  const topTweet = tweets[0];
  const totalEngagement = tweets.reduce((s, t) => s + t.engagement, 0);
  const avgLikes = Math.round(tweets.reduce((s, t) => s + (t.public_metrics?.like_count || 0), 0) / tweets.length);

  // Extract a rough idea name from the most engaging tweet
  const cleanText = topTweet.text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/@\w+/g, "")
    .replace(/\n/g, " ")
    .trim();

  // Generate a name from keywords
  const significantWords = cleanText
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 3);

  const name = significantWords.length > 0
    ? significantWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") + " Agent"
    : `Idea${rank} Agent`;

  const fileName = name.toLowerCase().replace(/\s+/g, "-") + ".md";

  // Virality score based on engagement
  let viralityScore = 2;
  if (totalEngagement > 500) viralityScore = 5;
  else if (totalEngagement > 200) viralityScore = 4;
  else if (totalEngagement > 50) viralityScore = 3;

  const sources = tweets.slice(0, 3).map((t) => {
    const metrics = t.public_metrics;
    const engagement = `${metrics?.like_count || 0} likes, ${metrics?.bookmark_count || 0} bookmarks, ${metrics?.impression_count || 0} impressions`;
    return {
      url: t.link,
      description: `${t.text.slice(0, 200).replace(/\n/g, " ")} (${engagement})`,
    };
  });

  const gap = `People on Twitter are actively asking for this (${tweets.length} related tweets found, avg ${avgLikes} likes). The tweets in the "${topTweet.category}" category show clear demand for a tool that addresses: ${cleanText.slice(0, 200)}.`;

  const pitch = cleanText.slice(0, 300);

  const mvp = [
    `SOUL.md defining the agent's purpose based on the Twitter demand signal`,
    `Core skill that addresses the main pain point from these tweets`,
    `Memory system to track and learn from usage patterns`,
    `Composio integration for relevant external services`,
    `CLI-runnable via gitclaw --dir . "prompt"`,
  ];

  const claudeMd = generateClaudeMd(name, pitch, gap, mvp);

  return {
    name,
    fileName,
    pitch,
    trend: `${tweets.length} tweets found in "${topTweet.category}" category with total weighted engagement of ${totalEngagement}. Top tweet has ${topTweet.public_metrics?.like_count || 0} likes and ${topTweet.public_metrics?.impression_count || 0} impressions.`,
    sources,
    gap,
    agentDescription: `A GitClaw agent that addresses the demand signal from ${tweets.length} viral tweets about ${significantWords.join(" ").toLowerCase()}.`,
    mvp,
    stack: "GitAgent spec + Claude Sonnet 4.6 + Composio",
    buildTime: "1-2 weeks",
    viralityScore,
    whyGitClaw: `${tweets.length} tweets validate demand. Average ${avgLikes} likes per tweet. Open-source GitClaw agent = first to market with a portable, agent-native solution.`,
    claudeMd,
    rawContent: tweets.map((t) => `[${t.category}] ${t.text} (${t.link})`).join("\n\n"),
  };
}

function generateClaudeMd(name: string, pitch: string, gap: string, mvp: string[]): string {
  return `# ${name}

## Identity
You are building "${name}" — a GitClaw/GitAgent-based open-source agent.

## What this agent does
${pitch}

## Problem it solves
${gap}

## Architecture
This is a GitAgent-spec agent:
\`\`\`
${name.toLowerCase().replace(/\s+/g, "-")}/
  agent.yaml
  SOUL.md
  RULES.md
  skills/
  memory/
  .env
\`\`\`

## MVP Scope
${mvp.map((item) => `- ${item}`).join("\n")}

## How to build
1. Create the folder structure above
2. Write SOUL.md with the agent's identity
3. Write agent.yaml with model, tools, and skills
4. Build each skill as a SKILL.md file
5. Test with: \`gitclaw --dir . "test prompt"\`

## Rules
- Keep it buildable by one person in 1-2 weeks
- Use GitAgent spec (SOUL.md + agent.yaml + skills/)
- Make it portable (exportable to Claude Code, Cursor, etc.)
`;
}

// ── API Routes ──────────────────────────────────────────────────

interface Session {
  name: string;
  date: string;
  time: string;
  ideas: Idea[];
}

// GET — return existing sessions from in-memory store
export async function GET() {
  return NextResponse.json({ sessions: sessionStore });
}

// POST — run a new scout
export async function POST() {
  try {
    // Step 1: Run all 8 Twitter searches in parallel
    const allResults = await Promise.all(
      SEARCHES.map((s) => searchTwitter(s.query, s.category))
    );

    const allTweets = allResults
      .flat()
      .filter((t) => {
        const m = t.public_metrics;
        return (m?.like_count || 0) >= MIN_LIKES || (m?.impression_count || 0) >= MIN_IMPRESSIONS;
      })
      .filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i)
      .sort((a, b) => b.engagement - a.engagement);

    // Step 2: Group tweets into themes and pick top 3
    const themes = groupTweetsByTheme(allTweets);
    const sortedThemes = [...themes.entries()]
      .map(([key, tweets]) => ({
        key,
        tweets,
        totalEngagement: tweets.reduce((s, t) => s + t.engagement, 0),
      }))
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 3);

    // Step 3: Generate ideas from top themes
    const rawIdeas = sortedThemes.map((theme, i) =>
      generateIdeaFromTweets(theme.tweets, i + 1)
    );

    const ideas: Idea[] = rawIdeas.map((idea) => ({
      ...idea,
      marketCheck: { exists: false, competitors: [], verdict: "" },
    }));

    // Sort by virality
    ideas.sort((a, b) => b.viralityScore - a.viralityScore);

    // Save to in-memory store
    const now = new Date();
    const session: Session = {
      name: `${now.toISOString().slice(0, 10)}_${now.toISOString().slice(11, 16).replace(":", "-")}`,
      date: now.toISOString().slice(0, 10),
      time: now.toISOString().slice(11, 16),
      ideas,
    };

    // Keep max 10 sessions in memory
    sessionStore.unshift(session);
    if (sessionStore.length > 10) sessionStore.pop();

    return NextResponse.json({
      ideas,
      session: session.name,
      sessions: sessionStore,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
