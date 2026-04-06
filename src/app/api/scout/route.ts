import { NextResponse } from "next/server";
import { query } from "gitclaw";
import type { GCMessage } from "gitclaw";
import path from "path";

export const maxDuration = 300;

const AGENT_DIR = path.join(process.cwd(), "agent");

// In-memory session store
const sessionStore: Session[] = [];

// ── Types ───────────────────────────────────────────────────────

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

// ── API Routes ──────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({ sessions: sessionStore });
}

export async function POST() {
  try {
    // Run gitclaw SDK with the agent directory
    const messages: GCMessage[] = [];
    const stream = query({
      prompt: "Run the scout skill. Deep-scan Twitter/X right now — run all 8 searches. Find the top 3 open-source GitClaw agent ideas based on what people are tweeting about. Include tweet links and engagement metrics for every idea. Follow the SOUL.md output format exactly.",
      dir: AGENT_DIR,
      maxTurns: 50,
    });

    // Collect all messages from the agent
    for await (const msg of stream) {
      messages.push(msg);
    }

    // Extract the final assistant response
    const assistantMessages = messages
      .filter((m): m is GCMessage & { type: "assistant" } => m.type === "assistant")
      .map((m) => m.content)
      .filter(Boolean);

    const finalResponse = assistantMessages[assistantMessages.length - 1] || "";

    // Parse ideas from the response
    const ideas = parseIdeasFromResponse(finalResponse);

    if (ideas.length === 0) {
      return NextResponse.json({
        error: "Agent didn't generate ideas. Raw response: " + finalResponse.slice(0, 300),
      }, { status: 500 });
    }

    ideas.sort((a, b) => b.viralityScore - a.viralityScore);

    // Save to session store
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
    return NextResponse.json({ error: `Scout failed: ${message}` }, { status: 500 });
  }
}

// ── Parse Ideas from Agent Response ─────────────────────────────

function parseIdeasFromResponse(response: string): Idea[] {
  const ideas: Idea[] = [];

  // Split by "## Idea" headers
  const ideaBlocks = response.split(/##\s+Idea\s+\d+:\s*/i).filter((b) => b.trim());

  for (const block of ideaBlocks.slice(0, 3)) {
    const lines = block.split("\n");
    const name = lines[0]?.replace(/^#+\s*/, "").replace(/\s*—.*$/, "").trim() || "Unnamed Idea";

    const getField = (label: string): string => {
      const regex = new RegExp(`\\*\\*${label}:?\\*\\*\\s*(.*)`, "i");
      const match = block.match(regex);
      return match ? match[1].trim() : "";
    };

    const getSection = (label: string): string => {
      const regex = new RegExp(`\\*\\*${label}:?\\*\\*\\s*`, "i");
      const startIdx = lines.findIndex((l) => regex.test(l));
      if (startIdx === -1) return "";
      const endIdx = lines.findIndex((l, i) => i > startIdx && /^\*\*[A-Z]/.test(l));
      const section = lines.slice(startIdx + 1, endIdx === -1 ? undefined : endIdx).join("\n").trim();
      // Also include the inline value after **Label:**
      const inlineMatch = lines[startIdx]?.match(regex);
      const inline = inlineMatch ? lines[startIdx].replace(regex, "").trim() : "";
      return inline ? inline + "\n" + section : section;
    };

    // Extract sources (tweet links)
    const sources: Source[] = [];
    const urlRegex = /[-*]\s*(https?:\/\/x\.com\/i\/status\/\S+)\s*[—-]\s*(.*)/g;
    let match;
    while ((match = urlRegex.exec(block)) !== null) {
      sources.push({ url: match[1], description: match[2].trim() });
    }
    // Fallback: find any x.com links
    if (sources.length === 0) {
      const tweetRegex = /(https:\/\/x\.com\/i\/status\/\d+)/g;
      let tm;
      while ((tm = tweetRegex.exec(block)) !== null) {
        const idx = block.indexOf(tm[1]);
        const lineStart = block.lastIndexOf("\n", idx) + 1;
        const lineEnd = block.indexOf("\n", idx);
        const line = block.slice(lineStart, lineEnd === -1 ? undefined : lineEnd)
          .replace(tm[1], "").replace(/^[-*\s]+/, "").trim();
        sources.push({ url: tm[1], description: line || "Tweet source" });
      }
    }

    // Extract MVP items
    const mvpSection = getSection("MVP");
    const mvpItems: string[] = [];
    for (const line of mvpSection.split("\n")) {
      const item = line.replace(/^[-*\s\[\]x]+/, "").trim();
      if (item && !item.startsWith("**")) mvpItems.push(item);
    }

    // Calculate virality from engagement numbers
    let viralityScore = 3;
    const numbers = block.match(/(\d{1,3}(?:,\d{3})*)\s*(?:likes?|impressions?|bookmarks?)/gi) || [];
    const maxEng = Math.max(...numbers.map((n) => parseInt(n.replace(/[^\d]/g, "")) || 0), 0);
    if (maxEng > 10000) viralityScore = 5;
    else if (maxEng > 1000) viralityScore = 4;
    else if (maxEng > 100) viralityScore = 3;

    const trend = getField("What's trending") || getSection("What's trending");
    const gap = getField("The gap") || getSection("The gap");
    const agentDesc = getField("The GitClaw agent") || getSection("The GitClaw agent");
    const whyStars = getField("Why it'll get stars") || getSection("Why it'll get stars");
    const stack = getField("Stack") || "GitAgent spec + Claude Sonnet 4.6 + Composio";
    const pitch = agentDesc.split("\n")[0] || gap.split("\n")[0] || name;

    const fileName = name.toLowerCase().replace(/\s+/g, "-") + ".md";

    const claudeMd = `# ${name}

## Identity
You are building "${name}" — a GitClaw/GitAgent-based open-source agent.

## What this agent does
${pitch}

## Problem it solves
${gap}

## Architecture
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
${mvpItems.map((item) => `- ${item}`).join("\n")}

## How to build
1. Create the folder structure above
2. Write SOUL.md with the agent's identity
3. Write agent.yaml with model, tools, and skills
4. Build each skill as a SKILL.md file
5. Test with: \`gitclaw --dir . "test prompt"\`
`;

    ideas.push({
      name, fileName, pitch, trend, sources, gap,
      agentDescription: agentDesc, mvp: mvpItems,
      stack, buildTime: "1-2 weeks", viralityScore,
      whyGitClaw: whyStars, claudeMd, rawContent: block,
      marketCheck: { exists: false, competitors: [], verdict: "" },
    });
  }

  return ideas;
}
