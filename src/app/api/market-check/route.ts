import { NextResponse } from "next/server";

const TAVILY_KEY = process.env.TAVILY_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { name, pitch } = await req.json();
    if (!name) return NextResponse.json({ error: "Missing idea name" }, { status: 400 });

    const keywords = name.replace(/ Agent$/, "").replace(/([A-Z])/g, " $1").trim();
    const query = `${keywords} ${pitch ? pitch.slice(0, 60) : ""} open source tool agent`;

    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_KEY,
        query,
        max_results: 5,
        search_depth: "basic",
      }),
    });
    const data = await res.json();
    const results = data.results || [];

    const competitors = results
      .filter((r: { score: number }) => r.score > 0.4)
      .slice(0, 4)
      .map((r: { title?: string; url: string; content?: string }) => ({
        name: r.title?.split(" - ")[0]?.split(" |")[0]?.trim() || "Unknown",
        url: r.url,
        snippet: r.content?.slice(0, 150) || "",
      }));

    const exists = competitors.length > 0;
    const verdict = exists
      ? `${competitors.length} similar tool(s) found. Study them for differentiation opportunities.`
      : `No direct competitors found — green field opportunity.`;

    return NextResponse.json({ exists, competitors, verdict });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
