import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GetTeamLogo from "@/components/common/GetTeamLogo";
import { getTeamById } from "@/lib/api/endpoints";

type TeamStatsTotals = {
  win: number;
  draw: number;
  lost: number;
};

const normalizeTeamName = (name: string) => {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return "";
  return trimmed
    .replace(/\bfc\b/gi, "")
    .replace(/\bcf\b/gi, "")
    .replace(/\bsc\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

const abbreviateTeamName = (name: string, maxLen: number) => {
  const n = normalizeTeamName(name);
  if (n.length <= maxLen) return n;
  return `${n.slice(0, Math.max(0, maxLen - 1)).trim()}…`;
};

type TeamStatsBreakdown = {
  total: TeamStatsTotals;
  home: TeamStatsTotals;
  away: TeamStatsTotals;
};

type TeamApiResponse = {
  responseObject?: {
    item?: any;
  };
};

const toNumber = (v: unknown) => {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : 0;
};

const emptyTotals = (): TeamStatsTotals => ({ win: 0, draw: 0, lost: 0 });

const addTotals = (a: TeamStatsTotals, b: Partial<TeamStatsTotals>) => {
  a.win += toNumber(b.win);
  a.draw += toNumber(b.draw);
  a.lost += toNumber(b.lost);
};

const parseDetailedStats = (detailedStats: any[]): TeamStatsBreakdown => {
  const acc: TeamStatsBreakdown = {
    total: emptyTotals(),
    home: emptyTotals(),
    away: emptyTotals(),
  };

  if (!Array.isArray(detailedStats)) return acc;

  detailedStats.forEach((row) => {
    const fulltime = row?.fulltime;

    const win = fulltime?.win;
    const draw = fulltime?.draw;
    const lost = fulltime?.lost;

    addTotals(acc.total, { win: toNumber(win?.total), draw: toNumber(draw?.total), lost: toNumber(lost?.total) });
    addTotals(acc.home, { win: toNumber(win?.home), draw: toNumber(draw?.home), lost: toNumber(lost?.home) });
    addTotals(acc.away, { win: toNumber(win?.away), draw: toNumber(draw?.away), lost: toNumber(lost?.away) });
  });

  return acc;
};

export default function TeamComparison({
  localTeamId,
  visitorTeamId,
}: {
  localTeamId?: string | number;
  visitorTeamId?: string | number;
}) {
  const [localTeam, setLocalTeam] = useState<any>(null);
  const [visitorTeam, setVisitorTeam] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsMobile(!!mq.matches);
    apply();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }

    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  useEffect(() => {
    const run = async (localId: string | number, visitorId: string | number) => {
      setLoading(true);
      setError(null);

      try {
        const [localRes, visitorRes] = await Promise.all([
          getTeamById(localId),
          getTeamById(visitorId),
        ]);

        const localItem = (localRes as TeamApiResponse)?.responseObject?.item;
        const visitorItem = (visitorRes as TeamApiResponse)?.responseObject?.item;

        setLocalTeam(Array.isArray(localItem) ? localItem[0] : localItem);
        setVisitorTeam(Array.isArray(visitorItem) ? visitorItem[0] : visitorItem);
      } catch (e: any) {
        setError(String(e?.message ?? "Failed to load teams"));
      } finally {
        setLoading(false);
      }
    };

    if (!localTeamId || !visitorTeamId) {
      setLocalTeam(null);
      setVisitorTeam(null);
      setLoading(false);
      setError(null);
      return;
    }

    const localId = localTeamId;
    const visitorId = visitorTeamId;
    run(localId, visitorId);
  }, [localTeamId, visitorTeamId]);

  const localName = String(localTeam?.name ?? "Local team");
  const visitorName = String(visitorTeam?.name ?? "Visitor team");

  const localStats = useMemo(
    () => parseDetailedStats(localTeam?.detailed_stats ?? []),
    [localTeam]
  );
  const visitorStats = useMemo(
    () => parseDetailedStats(visitorTeam?.detailed_stats ?? []),
    [visitorTeam]
  );

  const hasIds = Boolean(localTeamId) && Boolean(visitorTeamId);
  const hasData = Boolean(localTeam) && Boolean(visitorTeam);

  const displayLocalId = localTeamId ?? "";
  const displayVisitorId = visitorTeamId ?? "";

  const displayLocalName = hasData ? localName : "Local team";
  const displayVisitorName = hasData ? visitorName : "Visitor team";

  const chartData = useMemo(
    () => [
      {
        label: `${isMobile ? (abbreviateTeamName(localName, 14) || localName) : localName} (Home)`,
        labelShort: `${abbreviateTeamName(localName, 10) || localName} (H)`,
        win: localStats.home.win,
        draw: localStats.home.draw,
        lost: localStats.home.lost,
      },
      {
        label: `${isMobile ? (abbreviateTeamName(localName, 14) || localName) : localName} (Away)`,
        labelShort: `${abbreviateTeamName(localName, 10) || localName} (A)`,
        win: localStats.away.win,
        draw: localStats.away.draw,
        lost: localStats.away.lost,
      },
      {
        label: `${isMobile ? (abbreviateTeamName(visitorName, 14) || visitorName) : visitorName} (Home)`,
        labelShort: `${abbreviateTeamName(visitorName, 10) || visitorName} (H)`,
        win: visitorStats.home.win,
        draw: visitorStats.home.draw,
        lost: visitorStats.home.lost,
      },
      {
        label: `${isMobile ? (abbreviateTeamName(visitorName, 14) || visitorName) : visitorName} (Away)`,
        labelShort: `${abbreviateTeamName(visitorName, 10) || visitorName} (A)`,
        win: visitorStats.away.win,
        draw: visitorStats.away.draw,
        lost: visitorStats.away.lost,
      },
    ],
    [isMobile, localName, visitorName, localStats, visitorStats]
  );

  const dashOrNumber = (v: number) => (hasData ? String(v) : "-");

  if (!hasIds) {
    return (
      <div className="block-style my-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold theme-text">Team comparison</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22] p-4">
            <div className="flex items-center gap-3 mb-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]" />
              <p className="font-semibold theme-text truncate min-w-0 flex-1">Local team</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
                <p className="text-xs text-neutral-n5 dark:text-snow-200">Wins</p>
                <p className="font-semibold theme-text">-</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
                <p className="text-xs text-neutral-n5 dark:text-snow-200">Draws</p>
                <p className="font-semibold theme-text">-</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
                <p className="text-xs text-neutral-n5 dark:text-snow-200">Losses</p>
                <p className="font-semibold theme-text">-</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22] p-4">
            <div className="flex items-center gap-3 mb-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]" />
              <p className="font-semibold theme-text truncate min-w-0 flex-1">Visitor team</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
                <p className="text-xs text-neutral-n5 dark:text-snow-200">Wins</p>
                <p className="font-semibold theme-text">-</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
                <p className="text-xs text-neutral-n5 dark:text-snow-200">Draws</p>
                <p className="font-semibold theme-text">-</p>
              </div>
              <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
                <p className="text-xs text-neutral-n5 dark:text-snow-200">Losses</p>
                <p className="font-semibold theme-text">-</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium theme-text mb-3">Home / away results (fulltime)</p>
          <div className="w-full h-80 flex items-center justify-center rounded-lg border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22]">
            <p className="text-sm text-neutral-n5 dark:text-snow-200">Data not available</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="block-style my-6">
        <p className="theme-text">Loading team comparison...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="block-style my-6">
        <p className="theme-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="block-style my-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold theme-text">Team comparison</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22] p-4">
          <div className="flex items-center gap-3 mb-4 min-w-0">
            {hasData ? (
              <GetTeamLogo teamId={displayLocalId} alt={displayLocalName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]" />
            )}
            <p className="font-semibold theme-text truncate min-w-0 flex-1">{displayLocalName}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
              <p className="text-xs text-neutral-n5 dark:text-snow-200">Wins</p>
              <p className="font-semibold theme-text">{dashOrNumber(localStats.total.win)}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
              <p className="text-xs text-neutral-n5 dark:text-snow-200">Draws</p>
              <p className="font-semibold theme-text">{dashOrNumber(localStats.total.draw)}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
              <p className="text-xs text-neutral-n5 dark:text-snow-200">Losses</p>
              <p className="font-semibold theme-text">{dashOrNumber(localStats.total.lost)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22] p-4">
          <div className="flex items-center gap-3 mb-4 min-w-0">
            {hasData ? (
              <GetTeamLogo teamId={displayVisitorId} alt={displayVisitorName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]" />
            )}
            <p className="font-semibold theme-text truncate min-w-0 flex-1">{displayVisitorName}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
              <p className="text-xs text-neutral-n5 dark:text-snow-200">Wins</p>
              <p className="font-semibold theme-text">{dashOrNumber(visitorStats.total.win)}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
              <p className="text-xs text-neutral-n5 dark:text-snow-200">Draws</p>
              <p className="font-semibold theme-text">{dashOrNumber(visitorStats.total.draw)}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-snow-100 dark:bg-[#0D1117] border border-snow-200 dark:border-[#1F2937]">
              <p className="text-xs text-neutral-n5 dark:text-snow-200">Losses</p>
              <p className="font-semibold theme-text">{dashOrNumber(visitorStats.total.lost)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium theme-text mb-3">Home / away results (fulltime)</p>
        {hasData ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={isMobile ? "labelShort" : "label"}
                  tick={{ fontSize: isMobile ? 11 : 12 }}
                  interval={0}
                  angle={isMobile ? -35 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 80 : 60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="win" stackId="a" fill="#22c55e" name="Wins" />
                <Bar dataKey="draw" stackId="a" fill="#f97316" name="Draws" />
                <Bar dataKey="lost" stackId="a" fill="#ef4444" name="Losses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-80 flex items-center justify-center rounded-lg border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22]">
            <p className="text-sm text-neutral-n5 dark:text-snow-200">Data not available</p>
          </div>
        )}
      </div>
    </div>
  );
}
