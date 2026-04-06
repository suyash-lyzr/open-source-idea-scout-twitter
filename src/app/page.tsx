"use client";

import { useState, useEffect } from "react";
import {
  Lightbulb, Trophy, Medal, Award,
  ArrowUpRight, ChevronDown, Copy, Check,
  Search, Clock, Layers, Flame, Code2,
  MessageCircle, Star, Newspaper,
  CalendarDays, Zap
} from "lucide-react";

interface Source { url: string; description: string }
interface MarketCompetitor { name: string; url: string; snippet: string }
interface MarketCheck { exists: boolean; competitors: MarketCompetitor[]; verdict: string }
interface Idea {
  name: string; pitch: string; trend: string; sources: Source[];
  gap: string; agentDescription: string; mvp: string[];
  stack: string; buildTime: string; viralityScore: number;
  whyGitClaw: string; claudeMd: string; rawContent: string;
  marketCheck?: MarketCheck;
}
interface Session { name: string; date: string; time: string; ideas: Idea[] }

function clean(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^#+\s+/gm, "")
    .replace(/\[([^\]]*)\]\(https?:\/\/[^)]+\)/g, "$1")  // [text](url) → text, [](url) → ""
    .replace(/\(\s*\)/g, "")  // remove empty ()
    .replace(/\[\s*\]/g, "")  // remove empty []
    .replace(/\s{2,}/g, " ")  // collapse multiple spaces
    .trim();
}

const ranks = [
  { icon: Trophy, color: "text-amber-400", tag: "Top Pick" },
  { icon: Medal, color: "text-zinc-400", tag: "" },
  { icon: Award, color: "text-zinc-500", tag: "" },
];

function SourceIcon({ url }: { url: string }) {
  if (url.includes("x.com") || url.includes("twitter")) return <MessageCircle className="w-4 h-4" />;
  if (url.includes("ycombinator")) return <Newspaper className="w-4 h-4" />;
  return <Star className="w-4 h-4" />;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [active, setActive] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [checkingMarket, setCheckingMarket] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/scout")
      .then((r) => r.json())
      .then((d) => { if (d.sessions?.length) { setSessions(d.sessions); setActive(d.sessions[0]); } })
      .catch(() => {});
  }, []);

  const scout = async () => {
    setLoading(true); setError(null); setOpenCard(null);
    const start = Date.now();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    try {
      const res = await fetch("/api/scout", { method: "POST" });
      const data = await res.json();
      if (data.error && !data.ideas?.length) setError(data.error);
      else { setSessions(data.sessions || []); setActive(data.sessions?.[0] || null); }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { clearInterval(t); setLoading(false); }
  };

  const doCopy = async (i: number, text: string) => {
    await navigator.clipboard.writeText(text); setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const runMarketCheck = async (i: number, idea: Idea) => {
    setCheckingMarket(i);
    try {
      const res = await fetch("/api/market-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: idea.name, pitch: idea.pitch }),
      });
      const data = await res.json();
      if (!data.error) {
        // Update the idea's marketCheck in state
        setActive((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, ideas: prev.ideas.map((id, idx) =>
            idx === i ? { ...id, marketCheck: data } : id
          )};
          return updated;
        });
      }
    } catch { /* ignore */ }
    finally { setCheckingMarket(null); }
  };

  const ideas = active?.ideas || [];

  return (
    <div className="min-h-screen bg-[#1A1A1D] text-[#E8E8ED]">
      {/* Header */}
      <header className="border-b border-white/[0.08] sticky top-0 z-50 bg-[#1A1A1D]/95 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#EC7843]" />
              <span className="text-[15px] font-semibold text-white">IdeaScout</span>
            </div>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <span className="text-[#EC7843] font-medium">Ideas</span>
              <span className="text-white/40 hover:text-white/70 cursor-pointer transition-colors">History</span>
            </nav>
          </div>
          <span className="text-xs text-white/30">Powered by GitClaw</span>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto flex">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden lg:block border-r border-white/[0.06] min-h-[calc(100vh-56px)]">
          <div className="sticky top-14 px-4 py-6">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">Sessions</p>
            {sessions.length === 0 && <p className="text-sm text-white/20">No sessions yet</p>}
            <div className="space-y-0.5">
              {sessions.map((s) => (
                <button key={s.name} onClick={() => { setActive(s); setOpenCard(null); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                    active?.name === s.name
                      ? "text-[#EC7843] bg-[#EC7843]/[0.08]"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}>
                  <CalendarDays className="w-3.5 h-3.5 inline mr-2 opacity-50" />
                  {s.date}
                  <span className="text-white/25 ml-1 text-xs">({s.ideas.length})</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-8 py-8">
          {/* Hero */}
          <div className="mb-10">
            <h1 className="text-[32px] font-bold text-white tracking-tight mb-3">
              What should you build next?
            </h1>
            <p className="text-base text-white/55 mb-6 max-w-xl leading-relaxed">
              Deep-scans Twitter/X for viral tech trends, wishlists, pain points, and influencer takes. Surfaces the top 3 agent ideas worth building.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={scout} disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#EC7843] text-white text-sm font-medium rounded-lg transition-all hover:bg-[#d96a38] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Scouting... {elapsed}s
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Scout Ideas
                  </>
                )}
              </button>
              {loading && (
                <div className="flex gap-4 text-xs text-white/35">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"/>Wishlists</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" style={{animationDelay:"0.1s"}}/>Pain points</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{animationDelay:"0.2s"}}/>Influencers</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{animationDelay:"0.3s"}}/>Launches</span>
                </div>
              )}
            </div>
          </div>

          {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}

          {/* Idea Cards */}
          {ideas.length > 0 && (
            <div className="space-y-4">
              {ideas.map((idea, i) => {
                const isOpen = openCard === i;
                const rank = ranks[i] || ranks[2];
                const RankIcon = rank.icon;
                return (
                  <div key={i} className={`rounded-xl border border-white/[0.08] bg-[#222225] transition-all ${!isOpen ? "hover:border-white/[0.15]" : ""}`}>
                    {/* Header row */}
                    <button onClick={() => setOpenCard(isOpen ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-center gap-4">
                      <RankIcon className={`w-5 h-5 ${rank.color} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base font-semibold text-white">{idea.name}</h3>
                          {rank.tag && <span className="text-[10px] font-semibold uppercase tracking-wider text-[#EC7843] bg-[#EC7843]/10 px-1.5 py-0.5 rounded">{rank.tag}</span>}
                        </div>
                        <p className="text-sm text-white/45 mt-1 leading-relaxed">{clean(idea.pitch !== idea.name ? idea.pitch : idea.trend.split("\n").filter(l => l.trim())[0] || idea.gap.split("\n").filter(l => l.trim())[0] || "")}</p>
                        <div className="flex items-center gap-5 mt-2">
                          <div className="flex items-center gap-1.5">
                            <Flame className={`w-3.5 h-3.5 ${idea.viralityScore >= 4 ? "text-[#EC7843]" : "text-white/20"}`} />
                            <div className="flex gap-[3px]">
                              {[1,2,3,4,5].map(n => (
                                <div key={n} className={`h-[4px] w-3 rounded-full ${n <= idea.viralityScore ? "bg-[#EC7843]/70" : "bg-white/[0.08]"}`}/>
                              ))}
                            </div>
                            <span className="text-xs text-white/30 ml-0.5">{idea.viralityScore}/5</span>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-white/40">
                            <Clock className="w-3.5 h-3.5 text-white/25" />{idea.buildTime}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-white/30 font-mono hidden sm:flex">
                            <Layers className="w-3.5 h-3.5 text-white/20" />
                            {idea.stack.length > 30 ? idea.stack.slice(0, 30) + "..." : idea.stack}
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/30 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="border-t border-white/[0.06]">
                        <div className="px-5 py-5 grid md:grid-cols-2 gap-8">
                          {/* Left column */}
                          <div className="space-y-6">
                            <Section title="Problem It Solves">
                              <p className="text-sm text-white/55 leading-relaxed">{clean(idea.gap)}</p>
                            </Section>
                            <Section title="Sources">
                              <div className="space-y-2.5">
                                {idea.sources.map((s, j) => (
                                  <a key={j} href={s.url} target="_blank" rel="noopener noreferrer"
                                    className="group flex items-start gap-2.5 text-sm text-white/60 hover:text-[#EC7843] transition-colors">
                                    <span className="mt-0.5 text-white/30 group-hover:text-[#EC7843]/60"><SourceIcon url={s.url} /></span>
                                    <span className="flex-1 leading-relaxed">
                                      <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider mr-2 px-1.5 py-0.5 rounded ${
                                        s.url.includes("x.com") || s.url.includes("twitter") ? "bg-blue-500/10 text-blue-400" :
                                        s.url.includes("ycombinator") ? "bg-orange-500/10 text-orange-400" :
                                        s.url.includes("github") ? "bg-green-500/10 text-green-400" :
                                        "bg-white/[0.06] text-white/40"
                                      }`}>{
                                        s.url.includes("x.com") || s.url.includes("twitter") ? "X" :
                                        s.url.includes("ycombinator") ? "HN" :
                                        s.url.includes("github") ? "GitHub" : "Web"
                                      }</span>
                                      {clean(s.description)}
                                    </span>
                                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 shrink-0 mt-0.5 transition-opacity" />
                                  </a>
                                ))}
                              </div>
                            </Section>
                          </div>

                          {/* Right column */}
                          <div className="space-y-6">
                            <Section title="MVP Scope">
                              <ul className="space-y-2">
                                {idea.mvp.slice(0, 5).map((item, j) => (
                                  <li key={j} className="flex items-start gap-2.5 text-sm text-white/55">
                                    <Zap className="w-3.5 h-3.5 text-[#EC7843]/40 mt-0.5 shrink-0" />
                                    <span className="leading-relaxed">{clean(item)}</span>
                                  </li>
                                ))}
                              </ul>
                            </Section>
                            <Section title="Why GitClaw">
                              <p className="text-sm text-white/55 leading-relaxed">
                                {clean(idea.whyGitClaw.split("\n").filter(l => l.trim()).slice(0, 2).join(" ") || "GitAgent spec: define as markdown, run anywhere, ship fast.")}
                              </p>
                            </Section>
                          </div>
                        </div>

                        {/* Market Check */}
                        <div className="mx-5 mb-4">
                          {idea.marketCheck?.verdict ? (
                            <div className={`p-4 rounded-xl border ${idea.marketCheck.exists ? "bg-yellow-500/5 border-yellow-500/15" : "bg-green-500/5 border-green-500/15"}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Search className="w-4 h-4 text-white/30" />
                                <span className="text-[11px] font-semibold text-[#EC7843] uppercase tracking-wider">Market Check</span>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${idea.marketCheck.exists ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"}`}>
                                  {idea.marketCheck.exists ? "Competitors Found" : "Green Field"}
                                </span>
                              </div>
                              <p className="text-sm text-white/50 mb-3">{idea.marketCheck.verdict}</p>
                              {idea.marketCheck.competitors.length > 0 && (
                                <div className="space-y-2">
                                  {idea.marketCheck.competitors.map((c, ci) => (
                                    <a key={ci} href={c.url} target="_blank" rel="noopener noreferrer"
                                      className="group flex items-start gap-2 text-sm text-white/40 hover:text-[#EC7843] transition-colors">
                                      <ArrowUpRight className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-40 group-hover:opacity-100" />
                                      <div>
                                        <span className="font-medium text-white/60 group-hover:text-[#EC7843]">{c.name}</span>
                                        <p className="text-xs text-white/30 mt-0.5">{clean(c.snippet)}</p>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => runMarketCheck(i, idea)}
                              disabled={checkingMarket === i}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-[#2A2A2E] hover:border-[#EC7843]/30 hover:bg-[#EC7843]/[0.06] text-sm text-white/50 hover:text-[#EC7843] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {checkingMarket === i ? (
                                <>
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                  </svg>
                                  Checking market...
                                </>
                              ) : (
                                <>
                                  <Search className="w-4 h-4" />
                                  Market Check — Search if similar projects exist
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* CLAUDE.md — collapsed by default */}
                        <div className="mx-5 mb-5">
                          <div className="flex items-center justify-between px-4 py-3 bg-[#2A2A2E] rounded-xl border border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <Code2 className="w-4 h-4 text-white/30" />
                              <span className="text-xs font-medium text-white/40">CLAUDE.md</span>
                              <span className="text-[10px] text-white/20">Start building with Claude Code</span>
                            </div>
                            <button onClick={() => doCopy(i, idea.claudeMd)}
                              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-white/50 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-md transition-all">
                              {copied === i ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && !ideas.length && !error && (
            <div className="text-center py-20 bg-[#222225] rounded-xl border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-[#EC7843]/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-5 h-5 text-[#EC7843]/60" />
              </div>
              <p className="text-base text-white/40 mb-1">No ideas yet</p>
              <p className="text-sm text-white/25">Hit Scout Ideas to scan what is trending right now</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-[#EC7843] uppercase tracking-wider mb-2.5">{title}</p>
      {children}
    </div>
  );
}
