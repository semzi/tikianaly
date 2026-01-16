import { useEffect, useMemo, useState } from "react";
import GetTeamLogo from "@/components/common/GetTeamLogo";
import { postTeamHeadToHead, type FootballHeadToHeadItem } from "@/lib/api/endpoints";

type Props = {
  teamAId?: string | number;
  teamBId?: string | number;
  teamAName?: string;
  teamBName?: string;
};

export const HeadToHeadSection = ({ teamAId, teamBId, teamAName, teamBName }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<FootballHeadToHeadItem | null>(null);

  const canFetch = String(teamAId ?? "").trim() !== "" && String(teamBId ?? "").trim() !== "";

  useEffect(() => {
    if (!canFetch) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await postTeamHeadToHead(teamAId as any, teamBId as any);
        const item = (res as any)?.responseObject?.item ?? null;
        if (!cancelled) setData(item);
      } catch (e: any) {
        if (!cancelled) {
          setData(null);
          setError(String(e?.message ?? "Failed to load head-to-head"));
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

  const totals = useMemo(() => {
    const played = Number(summary?.matchesPlayed ?? 0) || 0;
    const aWins = Number(summary?.teamA_wins ?? 0) || 0;
    const bWins = Number(summary?.teamB_wins ?? 0) || 0;
    const draws = Number(summary?.draws ?? 0) || 0;

    const safePlayed = played > 0 ? played : Math.max(aWins + bWins + draws, 0);
    const pct = (n: number) => (safePlayed > 0 ? (n / safePlayed) * 100 : 0);

    return {
      played: safePlayed,
      aWins,
      bWins,
      draws,
      aPct: pct(aWins),
      bPct: pct(bWins),
      dPct: pct(draws),
    };
  }, [summary]);

  const normalizeName = (v: unknown) => {
    const s = String(v ?? "").trim();
    return s || "-";
  };

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

  return (
    <div className="my-8">
      <div className="block-style overflow-hidden">
        <div className="px-4 py-3 border-b border-snow-200 dark:border-snow-100/10">
          <p className="theme-text font-bold">Last matches</p>
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
              const isTeamAHome = String(m.homeTeamId) === String(teamAId);
              const leftName = isTeamAHome ? normalizeName(teamAName) : normalizeName(teamBName);
              const rightName = isTeamAHome ? normalizeName(teamBName) : normalizeName(teamAName);
              const leftId = isTeamAHome ? teamAId : teamBId;
              const rightId = isTeamAHome ? teamBId : teamAId;
              const score = String(m.scoreline ?? `${m.homeScore} - ${m.awayScore}`);

              return (
                <div key={String(m.fixture_id)} className="px-4 py-3">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="min-w-0 flex items-center gap-2">
                      <GetTeamLogo teamId={leftId} alt={leftName} className="h-5 w-5 shrink-0" />
                      <p className="min-w-0 truncate text-[12px] theme-text">{leftName}</p>
                    </div>

                    {renderScoreBox(score)}

                    <div className="min-w-0 flex items-center gap-2 justify-end">
                      <p className="min-w-0 truncate text-[12px] theme-text text-right">{rightName}</p>
                      <GetTeamLogo teamId={rightId} alt={rightName} className="h-5 w-5 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="block-style overflow-hidden mt-4">
        <div className="px-4 py-3 border-b border-snow-200 dark:border-snow-100/10 flex items-center justify-between">
          <p className="theme-text font-bold">Total results</p>
          <p className="text-neutral-m6 text-xs">{totals.played} Matches</p>
        </div>

        {loading ? (
          <TotalResultsSkeleton />
        ) : (
        <div className="p-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <GetTeamLogo teamId={teamAId} alt={teamAName} className="h-6 w-6 shrink-0" />
              <p className="min-w-0 truncate text-[12px] theme-text">{normalizeName(teamAName)}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="px-3 py-2 rounded bg-snow-200 dark:bg-white/10 text-center">
                <p className="theme-text font-semibold text-[12px] tabular-nums">{totals.aWins}</p>
                <p className="text-neutral-m6 text-[10px]">Wins</p>
              </div>
              <div className="px-3 py-2 rounded bg-snow-200 dark:bg-white/10 text-center">
                <p className="theme-text font-semibold text-[12px] tabular-nums">{totals.draws}</p>
                <p className="text-neutral-m6 text-[10px]">Draws</p>
              </div>
              <div className="px-3 py-2 rounded bg-snow-200 dark:bg-white/10 text-center">
                <p className="theme-text font-semibold text-[12px] tabular-nums">{totals.bWins}</p>
                <p className="text-neutral-m6 text-[10px]">Wins</p>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end min-w-0">
              <p className="min-w-0 truncate text-[12px] theme-text text-right">{normalizeName(teamBName)}</p>
              <GetTeamLogo teamId={teamBId} alt={teamBName} className="h-6 w-6 shrink-0" />
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
    </div>
  );
};
