import { NextResponse } from "next/server";
import { exec } from "child_process";
import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export const maxDuration = 300;

const AGENT_DIR = path.join(process.cwd(), "agent");

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
interface Session {
  name: string; date: string; time: string; ideas: Idea[];
}

// ── GET — return existing sessions ──────────────────────────────

export async function GET() {
  try {
    const sessions = await loadSessions();
    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ sessions: [] });
  }
}

// ── POST — run gitclaw scout ────────────────────────────────────

export async function POST() {
  try {
    const gitclawPath = await findGitclaw();

    // Ensure agent/.env exists with current env vars (Railway sets them in dashboard)
    await ensureAgentEnv();

    // Ensure ideas/ dir exists
    await mkdir(path.join(AGENT_DIR, "ideas"), { recursive: true });
    await mkdir(path.join(AGENT_DIR, "scouted"), { recursive: true });

    await execAsync(
      `${gitclawPath} --dir "${AGENT_DIR}" "Run the scout skill. Deep-scan Twitter/X right now — run all 8 searches. Find the top 3 open-source GitClaw agent ideas based on what people are tweeting about. Include tweet links and engagement metrics for every idea. Follow the SOUL.md output format exactly. Save results to the ideas/ folder."`,
      {
        timeout: 280000,
        maxBuffer: 1024 * 1024 * 10,
        env: {
          ...process.env,
          HOME: process.env.HOME || "/root",
          PATH: `${process.env.HOME}/.npm-global/bin:/usr/local/bin:/usr/bin:/bin:${process.env.PATH}`,
        },
        cwd: AGENT_DIR,
      }
    );

    const sessions = await loadSessions();
    return NextResponse.json({
      ideas: sessions[0]?.ideas || [],
      session: sessions[0]?.name || "live",
      sessions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Scout error:", message);
    return NextResponse.json({ error: `Scout failed: ${message}` }, { status: 500 });
  }
}

// ── Helpers ─────────────────────────────────────────────────────

async function ensureAgentEnv() {
  const envVars = [
    "ANTHROPIC_API_KEY",
    "TWITTER_BEARER_TOKEN",
    "TAVILY_API_KEY",
    "COMPOSIO_API_KEY",
    "COMPOSIO_USER_ID",
    "OPENAI_API_KEY",
  ];
  const envContent = envVars
    .filter((key) => process.env[key])
    .map((key) => `${key}=${process.env[key]}`)
    .join("\n");

  if (envContent) {
    await writeFile(path.join(AGENT_DIR, ".env"), envContent + "\n", "utf-8");
  }
}

async function findGitclaw(): Promise<string> {
  const candidates = [
    path.join(process.cwd(), "node_modules", ".bin", "gitclaw"),
    `${process.env.HOME}/.npm-global/bin/gitclaw`,
    "/usr/local/bin/gitclaw",
    "gitclaw",
  ];
  for (const c of candidates) {
    try {
      await execAsync(`test -x "${c}" || which "${c}" 2>/dev/null`);
      return c;
    } catch { /* try next */ }
  }
  return candidates[0]; // fallback to node_modules
}

async function loadSessions(): Promise<Session[]> {
  const sessions: Session[] = [];
  try {
    const ideasDir = path.join(AGENT_DIR, "ideas");
    const entries = await readdir(ideasDir, { withFileTypes: true });
    const sessionDirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
      .reverse();

    for (const dirName of sessionDirs) {
      const sessionPath = path.join(ideasDir, dirName);
      const files = await readdir(sessionPath);
      const ideaFiles = files.filter(
        (f) => f.endsWith(".md") && f !== "index.md" && !f.includes("research") && !f.includes("trends")
      );

      const ideas: Idea[] = await Promise.all(
        ideaFiles.map(async (file) => {
          const content = await readFile(path.join(sessionPath, file), "utf-8");
          return parseIdeaFile(content, file);
        })
      );

      ideas.sort((a, b) => b.viralityScore - a.viralityScore);

      const parts = dirName.split("_");
      sessions.push({
        name: dirName,
        date: parts[0] || dirName,
        time: parts[1]?.replace("-", ":") || "",
        ideas,
      });
    }
  } catch {
    // ideas/ dir may not exist yet
  }
  return sessions;
}

function parseIdeaFile(content: string, fileName: string): Idea {
  const lines = content.split("\n");
  const name = (lines[0] || "").replace(/^#\s+/, "").replace(/\s*—.*$/, "").trim() || fileName.replace(".md", "");

  const getSection = (heading: string): string => {
    const regex = new RegExp(`##\\s+${heading}`, "i");
    const startIdx = lines.findIndex((l) => regex.test(l));
    if (startIdx === -1) return "";
    const endIdx = lines.findIndex((l, i) => i > startIdx && /^##\s/.test(l));
    return lines.slice(startIdx + 1, endIdx === -1 ? undefined : endIdx).join("\n").trim();
  };

  const trendSection = getSection("What.s trending") || getSection("The Trend") || "";
  const gapSection = getSection("The Gap") || getSection("The gap") || "";
  const agentSection = getSection("The GitClaw Agent") || getSection("The agent") || "";
  const mvpSection = getSection("MVP") || "";
  const whyGitClaw = getSection("Why it.ll get stars") || getSection("Why") || "";

  // Extract sources (tweet links)
  const sources: Source[] = [];
  const urlRegex = /[-*]\s*(https?:\/\/\S+)\s*[—-]\s*(.*)/g;
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    sources.push({ url: match[1], description: match[2].trim() });
  }
  if (sources.length === 0) {
    const tweetRegex = /(https:\/\/x\.com\/i\/status\/\d+)/g;
    let tweetMatch;
    while ((tweetMatch = tweetRegex.exec(content)) !== null) {
      const idx = content.indexOf(tweetMatch[1]);
      const lineStart = content.lastIndexOf("\n", idx) + 1;
      const lineEnd = content.indexOf("\n", idx);
      const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).replace(tweetMatch[1], "").replace(/^[-*\s]+/, "").trim();
      sources.push({ url: tweetMatch[1], description: line || "Tweet source" });
    }
  }

  const mvpItems: string[] = [];
  for (const line of mvpSection.split("\n")) {
    const item = line.replace(/^[-*\s\[\]x]+/, "").trim();
    if (item && !item.startsWith("#")) mvpItems.push(item);
  }

  let viralityScore = 3;
  const numbers = content.match(/(\d{1,3}(?:,\d{3})*)\s*(?:stars?|points?|pts|likes?|impressions?|bookmarks?)/gi) || [];
  const maxEngagement = Math.max(...numbers.map((n) => parseInt(n.replace(/[^\d]/g, "")) || 0), 0);
  if (maxEngagement > 10000) viralityScore = 5;
  else if (maxEngagement > 1000) viralityScore = 4;
  else if (maxEngagement > 500) viralityScore = 4;
  else if (maxEngagement > 100) viralityScore = 3;

  const agentFirstPara = agentSection.split("\n").filter((l) => l.trim() && !l.startsWith("#")).slice(0, 2).join(" ").replace(/\*\*(.*?)\*\*/g, "$1").replace(/`(.*?)`/g, "$1").trim();
  const gapFirstPara = gapSection.split("\n").filter((l) => l.trim() && !l.match(/^\d+\./)).slice(0, 2).join(" ").replace(/\*\*(.*?)\*\*/g, "$1").replace(/`(.*?)`/g, "$1").trim();
  const pitch = agentFirstPara || gapFirstPara || name;

  const stackMatch = content.match(/\*\*Stack:?\*\*\s*(.*)/i) || content.match(/##\s+Stack\s*\n(.*)/i);
  const stack = stackMatch ? stackMatch[1].trim() : "GitAgent spec + Claude Sonnet 4.6 + Composio";

  const claudeMd = `# ${name}

## Identity
You are building "${name}" — a GitClaw/GitAgent-based open-source agent.

## What this agent does
${pitch}

## Problem it solves
${gapSection}

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

  return {
    name, fileName, pitch,
    trend: trendSection, sources, gap: gapSection,
    agentDescription: agentSection, mvp: mvpItems,
    stack, buildTime: "1-2 weeks", viralityScore, whyGitClaw,
    claudeMd, rawContent: content,
    marketCheck: { exists: false, competitors: [], verdict: "" },
  };
}
