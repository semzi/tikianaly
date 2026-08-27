import { useEffect, useMemo, useState } from "react";
import Image from "@/components/common/Image";
import { postTeamHeadToHead, type FootballHeadToHeadItem } from "@/lib/api/endpoints";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SegmentedSelector } from "@/components/ui/SegmentedSelector";

type Props = {
  teamAId?: string | number;
  teamBId?: string | number;
  teamAName?: string;
  teamBName?: string;
  teamAImageUrl?: string;
  teamBImageUrl?: string;
  recentHomeFixtures?: any[];
  recentAwayFixtures?: any[];
};

// Module-level cache to prevent refetch when switching tabs and coming back (component unmounts/remounts)
const h2hCache = new Map<string, FootballHeadToHeadItem | null>();
const h2hErrorCache = new Map<string, string>();
const h2hKey = (a: string | number | undefined, b: string | number | undefined) => `${String(a ?? "").trim()}-${String(b ?? "").trim()}`;

export const HeadToHeadSection = ({ teamAId, teamBId, teamAName, teamBName, teamAImageUrl, teamBImageUrl, recentHomeFixtures, recentAwayFixtures }: Props) => {
  const [subTab, setSubTab] = useState<"h2h" | "recent">("h2h");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<FootballHeadToHeadItem | null>(null);

  const canFetch = String(teamAId ?? "").trim() !== "" && String(teamBId ?? "").trim() !== "";

  useEffect(() => {
    if (!canFetch) return;
    const key = h2hKey(teamAId, teamBId);
    // Serve from cache instantly — no network when revisiting tab
    if (h2hCache.has(key)) {
      setData(h2hCache.get(key) ?? null);
      setError(h2hErrorCache.get(key) ?? "");
      setLoading(false);
      return;
    }
    if (h2hErrorCache.has(key)) {
      setError(h2hErrorCache.get(key) ?? "");
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await postTeamHeadToHead(teamAId as any, teamBId as any);
        const item = (res as any)?.responseObject?.item ?? null;
        h2hCache.set(key, item);
        h2hErrorCache.delete(key);
        if (!cancelled) setData(item);
      } catch (e: any) {
        const msg = String(e?.message ?? "Failed to load head-to-head");
        h2hErrorCache.set(key, msg);
        h2hCache.set(key, null);
        if (!cancelled) {
          setData(null);
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canFetch, teamAId, teamBId]);

  const summary = data?.summary;
  const matches = Array.isArray(data?.matches) ? data?.matches : [];

  const normalizeName = (v: unknown) => {
    const s = String(v ?? "").trim();
    return s || "-";
  };

  const totals = useMemo(() => {
    // Backend summary is incorrect (e.g. 0-0-3 vs actual 2-0-0) — derive correctly from matches teama_goals/teamb_goals
    let aWins = 0, bWins = 0, draws = 0;
    if (matches.length > 0 && matches.some((m: any) => m.teama_goals !== undefined || m.teamb_goals !== undefined)) {
      for (const m of matches as any[]) {
        const a = Number(m.teama_goals);
        const b = Number(m.teamb_goals);
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
        if (a > b) aWins++;
        else if (b > a) bWins++;
        else draws++;
      }
    } else {
      // fallback to backend summary for old shape
      aWins = Number(summary?.teamA_wins ?? 0) || 0;
      bWins = Number(summary?.teamB_wins ?? 0) || 0;
      draws = Number(summary?.draws ?? 0) || 0;
    }
    const played = matches.length > 0 ? matches.length : (Number(summary?.matchesPlayed ?? 0) || Math.max(aWins + bWins + draws, 0));
    const pct = (n: number) => (played > 0 ? (n / played) * 100 : 0);
    return {
      played,
      aWins,
      bWins,
      draws,
      aPct: pct(aWins),
      bPct: pct(bWins),
      dPct: pct(draws),
    };
  }, [summary, matches]);

  const chartData = useMemo(() => {
    const sliced = [...matches].slice(-8);
    const aLabel = normalizeName(teamAName) || "Team A";
    const bLabel = normalizeName(teamBName) || "Team B";
    return sliced.map((m: any, idx: number) => {
      let aScore: number, bScore: number;
      if (m.teama_goals !== undefined || m.teamb_goals !== undefined) {
        // New API: teamA/B fixed positions — do NOT swap by homeTeamId
        aScore = Number(m.teama_goals);
        bScore = Number(m.teamb_goals);
      } else {
        const isAHome = String(m.homeTeamId) === String(teamAId);
        aScore = isAHome ? Number(m.homeScore) : Number(m.awayScore);
        bScore = isAHome ? Number(m.awayScore) : Number(m.homeScore);
      }
      if (!Number.isFinite(aScore) || !Number.isFinite(bScore)) {
        const parts = String(m.scoreline ?? "").split("-").map((s: string) => Number(s.trim()));
        if (parts.length === 2 && parts.every(Number.isFinite)) {
          // scoreline is "TeamA - TeamB" in new API, not home-away
          aScore = parts[0]; bScore = parts[1];
        } else {
          aScore = 0; bScore = 0;
        }
      }
      const label = m.date ? new Date(m.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : `M${idx + 1}`;
      return { name: label, [aLabel]: aScore, [bLabel]: bScore };
    });
  }, [matches, teamAId, teamBId, teamAName, teamBName]);

  const renderScoreBox = (score: string) => {
    return (
      <div className="px-2 py-1 rounded bg-snow-200 dark:bg-white/10 text-[12px] theme-text tabular-nums min-w-[44px] text-center">
        {score}
      </div>
    );
  };

  const SkeletonBlock = ({ className }: { className: string }) => (
    <div className={`animate-pulse rounded bg-snow-200/80 dark:bg-white/10 ${className}`} />
  );

  const LastMatchesSkeleton = () => (
    <div className="px-4 py-4 space-y-3">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <SkeletonBlock className="h-5 w-5" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
          <SkeletonBlock className="h-6 w-12" />
          <div className="flex items-center gap-2 justify-end min-w-0">
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="h-5 w-5" />
          </div>
        </div>
      ))}
    </div>
  );

  const TotalResultsSkeleton = () => (
    <div className="p-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <SkeletonBlock className="h-6 w-6" />
          <SkeletonBlock className="h-3 w-28" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <SkeletonBlock className="h-14 w-20" />
          <SkeletonBlock className="h-14 w-20" />
          <SkeletonBlock className="h-14 w-20" />
        </div>

        <div className="flex items-center gap-2 justify-end min-w-0">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4">
        <SkeletonBlock className="h-2 w-full" />
        <div className="mt-2 flex items-center justify-between">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>
    </div>
  );

  const getRecentResult = (fixture: any, teamId: string | number | undefined) => {
    const id = String(teamId ?? "").trim();
    const hs = Number(String(fixture?.localteam?.score ?? fixture?.localteam?.ft_score ?? "").trim());
    const as = Number(String(fixture?.visitorteam?.score ?? fixture?.visitorteam?.ft_score ?? "").trim());
    if (!Number.isFinite(hs) || !Number.isFinite(as)) return null;
    const isHome = String(fixture?.localteam?.id) === id;
    const teamScore = isHome ? hs : as;
    const oppScore = isHome ? as : hs;
    if (teamScore > oppScore) return "W" as const;
    if (teamScore < oppScore) return "L" as const;
    return "D" as const;
  };
  const resultStyle = (r: string | null) => {
    if (r === "W") return "bg-green-600 text-white";
    if (r === "L") return "bg-red-600 text-white";
    if (r === "D") return "bg-yellow-500 text-white";
    return "bg-snow-200 dark:bg-white/10 text-neutral-m6";
  };
  const formatRecentDate = (d: any) => {
    try {
      const dt = new Date(String(d ?? ""));
      if (Number.isNaN(dt.getTime())) return String(d ?? "");
      return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch { return String(d ?? ""); }
  };
  const renderRecentList = (fixtures: any[] | undefined, teamId: string | number | undefined, _teamName?: string, _teamImageUrl?: string) => {
    const list = Array.isArray(fixtures) ? fixtures.slice(0, 5) : [];
    if (list.length === 0) {
      return <p className="text-sm text-neutral-m6 py-4 text-center">No recent matches</p>;
    }
    return (
      <div className="divide-y divide-snow-200 dark:divide-snow-100/10">
        {list.map((f: any) => {
          const tid = String(teamId ?? "").trim();
          const isHome = String(f.localteam?.id) === tid;
          const opponent = isHome ? f.visitorteam : f.localteam;
          const oppId = String(opponent?.id ?? "").trim();
          const oppName = String(opponent?.name ?? "Opponent");
          const oppImageUrl = oppId ? `https://cdn.tikianaly.com/soccer/team/${oppId}.png` : "";
          const score = `${String(f.localteam?.score ?? "-")} - ${String(f.visitorteam?.score ?? "-")}`;
          const result = getRecentResult(f, teamId);
          const venueTag = isHome ? "vs" : "@";
          const fid = f.fixture_id ?? f.id;
          return (
            <Link
              key={String(fid ?? `${oppId}-${f.date}`)}
              to={`/football/gameinfo/${fid}?fixtureId=${encodeURIComponent(String(fid ?? ""))}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors"
            >
              <span className="text-[11px] text-neutral-m6 w-14 shrink-0">{formatRecentDate(f.date)}</span>
              <span className={`h-6 w-6 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${resultStyle(result)}`}>{result ?? "-"}</span>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {oppImageUrl ? <Image src={oppImageUrl} alt={oppName} className="h-5 w-5 shrink-0 object-contain" /> : <div className="h-5 w-5 shrink-0 rounded-full bg-snow-200 dark:bg-white/10" />}
                <span className="text-[11px] text-neutral-m6 shrink-0">{venueTag}</span>
                <p className="min-w-0 truncate text-[12px] theme-text">{oppName}</p>
              </div>
              <span className="px-2 py-1 rounded bg-snow-200 dark:bg-white/10 text-[12px] theme-text tabular-nums shrink-0">{score}</span>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="my-8">
      <div className="mb-4">
        <SegmentedSelector
          value={subTab}
          onChange={(val) => setSubTab(val as "h2h" | "recent")}
          size="lg"
          className="w-full"
          options={[
            { value: "h2h", label: "Head to Head" },
            { value: "recent", label: "Recent Form" },
          ]}
        />
      </div>

      {subTab === "h2h" ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="block-style overflow-hidden">
              <div className="px-4 py-3 border-b border-snow-200 dark:border-snow-100/10 flex items-center justify-between">
                <p className="theme-text font-medium text-sm">Total results</p>
                <p className="text-neutral-m6 text-xs">{totals.played} Matches</p>
              </div>
              {loading ? (
                <TotalResultsSkeleton />
              ) : (
              <div className="p-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {teamAImageUrl ? <Image src={teamAImageUrl} alt={teamAName} className="h-6 w-6 shrink-0 object-contain" /> : <div className="h-6 w-6 shrink-0 rounded-full bg-snow-200 dark:bg-white/10" />}
                    <p className="min-w-0 truncate text-[12px] theme-text font-normal">{normalizeName(teamAName)}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="px-3 py-2 rounded bg-snow-200 dark:bg-white/10 text-center">
                      <p className="theme-text font-medium text-[12px] tabular-nums">{totals.aWins}</p>
                      <p className="text-neutral-m6 text-[10px]">Wins</p>
                    </div>
                    <div className="px-3 py-2 rounded bg-snow-200 dark:bg-white/10 text-center">
                      <p className="theme-text font-medium text-[12px] tabular-nums">{totals.draws}</p>
                      <p className="text-neutral-m6 text-[10px]">Draws</p>
                    </div>
                    <div className="px-3 py-2 rounded bg-snow-200 dark:bg-white/10 text-center">
                      <p className="theme-text font-medium text-[12px] tabular-nums">{totals.bWins}</p>
                      <p className="text-neutral-m6 text-[10px]">Wins</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end min-w-0">
                    <p className="min-w-0 truncate text-[12px] theme-text text-right font-normal">{normalizeName(teamBName)}</p>
                    {teamBImageUrl ? <Image src={teamBImageUrl} alt={teamBName} className="h-6 w-6 shrink-0 object-contain" /> : <div className="h-6 w-6 shrink-0 rounded-full bg-snow-200 dark:bg-white/10" />}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full rounded bg-snow-200 dark:bg-white/10 overflow-hidden flex">
                    <div className="h-full bg-brand-secondary" style={{ width: `${totals.aPct}%` }} />
                    <div className="h-full bg-neutral-m6/60" style={{ width: `${totals.dPct}%` }} />
                    <div className="h-full bg-brand-primary" style={{ width: `${totals.bPct}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-m6">
                    <p>{totals.aWins} wins ({Math.round(totals.aPct)}%)</p>
                    <p>{totals.draws} draws ({Math.round(totals.dPct)}%)</p>
                    <p>{totals.bWins} wins ({Math.round(totals.bPct)}%)</p>
                  </div>
                </div>
              </div>
              )}
            </div>
            <div className="block-style overflow-hidden p-4 flex flex-col">
              <p className="theme-text font-medium text-sm mb-3">Goals Trend</p>
              {loading ? (
                <div className="h-[180px] flex items-center justify-center">
                  <div className="animate-pulse w-full h-full bg-snow-200/60 dark:bg-white/5 rounded" />
                </div>
              ) : chartData.length === 0 ? (
                <p className="text-sm text-neutral-m6 py-8 text-center">No trend data</p>
              ) : (
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, #e5e7eb)" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                      <Line type="monotone" dataKey={normalizeName(teamAName) || "Team A"} stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey={normalizeName(teamBName) || "Team B"} stroke="#ff6b00" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <p className="text-[11px] text-neutral-m6 mt-2 text-center">Goals per head-to-head match (last 8, chronological)</p>
            </div>
          </div>
          <div className="block-style overflow-hidden mt-4">
            <div className="px-4 py-3 border-b border-snow-200 dark:border-snow-100/10">
              <p className="theme-text font-medium text-sm">Last matches</p>
            </div>
            {loading ? (
              <LastMatchesSkeleton />
            ) : error ? (
              <div className="px-4 py-6">
                <p className="theme-text">{error}</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="px-4 py-6">
                <p className="theme-text">No records at the Moment check back later</p>
              </div>
            ) : (
              <div className="divide-y divide-snow-200 dark:divide-snow-100/10">
                {matches.map((m) => {
                  // Team A always left, Team B always right — do NOT swap by homeTeamId; backend teama_goals/teamb_goals are already TeamA/B order
                  const leftName = normalizeName(teamAName);
                  const rightName = normalizeName(teamBName);
                  const leftImageUrl = teamAImageUrl;
                  const rightImageUrl = teamBImageUrl;
                  const score = (m as any).teama_goals !== undefined || (m as any).teamb_goals !== undefined
                    ? `${String((m as any).teama_goals ?? "-")} - ${String((m as any).teamb_goals ?? "-")}`
                    : String((m as any).scoreline ?? `${(m as any).homeScore ?? "-"} - ${(m as any).awayScore ?? "-"}`);
                  const fixtureId = m.fixture_id;
                  return (
                    <Link
                      key={String(m.fixture_id)}
                      to={`/football/gameinfo/${fixtureId}?fixtureId=${encodeURIComponent(String(fixtureId ?? ""))}`}
                      className="block px-4 py-3 hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors"
                    >
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <div className="min-w-0 flex items-center gap-2">
                          {leftImageUrl ? <Image src={leftImageUrl} alt={leftName} className="h-5 w-5 shrink-0 object-contain" /> : <div className="h-5 w-5 shrink-0 rounded-full bg-snow-200 dark:bg-white/10" />}
                          <p className="min-w-0 truncate text-[12px] theme-text">{leftName}</p>
                        </div>
                        {renderScoreBox(score)}
                        <div className="min-w-0 flex items-center gap-2 justify-end">
                          <p className="min-w-0 truncate text-[12px] theme-text text-right">{rightName}</p>
                          {rightImageUrl ? <Image src={rightImageUrl} alt={rightName} className="h-5 w-5 shrink-0 object-contain" /> : <div className="h-5 w-5 shrink-0 rounded-full bg-snow-200 dark:bg-white/10" />}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="block-style overflow-hidden">
            <div className="px-4 py-3 border-b border-snow-200 dark:border-snow-100/10 flex items-center gap-2">
              {teamAImageUrl ? <Image src={teamAImageUrl} alt={teamAName} className="h-6 w-6 shrink-0 object-contain" /> : null}
              <p className="theme-text font-medium text-sm">{normalizeName(teamAName)} — Last 5</p>
            </div>
            {renderRecentList(recentHomeFixtures, teamAId, teamAName, teamAImageUrl)}
          </div>
          <div className="block-style overflow-hidden">
            <div className="px-4 py-3 border-b border-snow-200 dark:border-snow-100/10 flex items-center gap-2">
              {teamBImageUrl ? <Image src={teamBImageUrl} alt={teamBName} className="h-6 w-6 shrink-0 object-contain" /> : null}
              <p className="theme-text font-medium text-sm">{normalizeName(teamBName)} — Last 5</p>
            </div>
            {renderRecentList(recentAwayFixtures, teamBId, teamBName, teamBImageUrl)}
          </div>
        </div>
      )}
    </div>
  );
};
