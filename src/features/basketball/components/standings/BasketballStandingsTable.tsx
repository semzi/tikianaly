import { useEffect, useMemo, useState } from "react";
import { getBasketballStandings } from "@/lib/api/endpoints";
import { navigate } from "@/lib/router/navigate";

export type BasketballStandingsRow = {
  position: number;
  team: string;
  teamId?: number;
  logo?: string;
  recentForm?: string;
  description?: string;
  played: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDiff: number;
  points: number;
};

type BasketballStandingApiRow = {
  team_id?: number;
  team_name?: string;
  position?: number;
  played?: number;
  wins?: number;
  losses?: number;
  points_for?: number;
  points_against?: number;
  points_diff?: number;
  points?: number;
  recent_form?: string;
  description?: string;
};

type BasketballStandingsResponse = {
  success?: boolean;
  message?: string;
  responseObject?: {
    items?: BasketballStandingApiRow[];
    total?: number;
  };
};

type Props = {
  leagueId?: string | number;
};

export const BasketballStandingsTable = ({ leagueId }: Props) => {
  const [apiData, setApiData] = useState<BasketballStandingsResponse | null>(
    null,
  );
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const openTeamProfile = (teamId?: number) => {
    if (!teamId) return;
    // Assuming basketball team profiles will follow this route
    navigate(`/basketball/team/${encodeURIComponent(String(teamId))}`);
  };

  const SkeletonBlock = ({ className }: { className: string }) => (
    <div
      className={`animate-pulse rounded bg-snow-200/80 dark:bg-white/10 ${className}`}
    />
  );

  const StandingsSkeletonDesktop = () => (
    <div className="hidden lg:block block-style overflow-x-auto">
      <div className="min-w-full">
        <div className="grid grid-cols-[40px_1fr_40px_40px_40px_60px_60px_60px_50px_90px] gap-3 px-6 py-4 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
          <div className="text-center">#</div>
          <div>Team</div>
          <div className="text-center">P</div>
          <div className="text-center">W</div>
          <div className="text-center">L</div>
          <div className="text-center">PF</div>
          <div className="text-center">PA</div>
          <div className="text-center">+/-</div>
          <div className="text-center">PTS</div>
          <div className="text-center">Form</div>
        </div>
        <div className="flex flex-col gap-2 px-6 pb-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[40px_1fr_40px_40px_40px_60px_60px_60px_50px_90px] gap-3 items-center"
            >
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <div className="flex items-center gap-3 min-w-0">
                <SkeletonBlock className="w-8 h-8 rounded-full" />
                <SkeletonBlock className="h-3 w-40" />
              </div>
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-10 mx-auto" />
              <SkeletonBlock className="h-4 w-10 mx-auto" />
              <SkeletonBlock className="h-4 w-10 mx-auto" />
              <SkeletonBlock className="h-4 w-8 mx-auto" />
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((__, j) => (
                  <SkeletonBlock key={j} className="h-2.5 w-2.5 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const id = String(leagueId ?? "").trim();
    // For basketball, we might want to fetch general standings if no ID is provided,
    // but the API test showed it might require a filter or return all.

    let isCancelled = false;

    const run = async () => {
      try {
        setIsLoading(true);
        setApiError("");
        const res = (await getBasketballStandings({
          league_id: id,
        })) as BasketballStandingsResponse;
        if (isCancelled) return;
        setApiData(res);
      } catch (e) {
        if (isCancelled) return;
        setApiError("Failed to load basketball standings");
        setApiData(null);
      } finally {
        if (isCancelled) return;
        setIsLoading(false);
      }
    };

    run();
    return () => {
      isCancelled = true;
    };
  }, [leagueId]);

  const data = useMemo<BasketballStandingsRow[]>(() => {
    const apiStandings = apiData?.responseObject?.items;
    if (Array.isArray(apiStandings) && apiStandings.length) {
      const toNum = (v: unknown) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      };

      return apiStandings
        .map((t) => {
          return {
            position: toNum(t.position),
            team: String(t.team_name ?? ""),
            teamId: Number.isFinite(Number(t.team_id))
              ? Number(t.team_id)
              : undefined,
            recentForm:
              typeof t.recent_form === "string" ? t.recent_form : undefined,
            description:
              typeof t.description === "string" ? t.description : undefined,
            played: toNum(t.played),
            wins: toNum(t.wins),
            losses: toNum(t.losses),
            pointsFor: toNum(t.points_for),
            pointsAgainst: toNum(t.points_against),
            pointsDiff: toNum(t.points_diff),
            points: toNum(t.points),
          } satisfies BasketballStandingsRow;
        })
        .filter((r) => r.team.trim())
        .sort((a, b) => a.position - b.position);
    }
    return [];
  }, [apiData]);

  const renderRecentForm = (recentForm?: string) => {
    const form = (typeof recentForm === "string" ? recentForm : "")
      .toUpperCase()
      .replace(/[^WL]/g, ""); // Basketball usually just W/L
    const chars = form.slice(0, 5).split("");
    while (chars.length < 5) chars.push("-");
    chars.reverse();

    const colorFor = (c: string) => {
      if (c === "W") return "bg-ui-success";
      if (c === "L") return "bg-ui-negative";
      return "bg-snow-200 dark:bg-white/10";
    };

    return (
      <div className="flex items-center justify-center gap-1">
        {chars.map((c, idx) => (
          <span
            key={`${c}-${idx}`}
            className={`h-2.5 w-2.5 rounded-full ${colorFor(c)}`}
            title={c === "W" ? "Win" : c === "L" ? "Loss" : ""}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="my-8">
      {apiError ? (
        <div className="mb-4 text-sm text-ui-negative">{apiError}</div>
      ) : null}
      {!isLoading && !apiError && data.length === 0 ? (
        <div className="mb-4 text-sm text-neutral-n4 dark:text-snow-200 text-center py-10 block-style font-medium">
          No records found for these standings.
        </div>
      ) : null}

      {isLoading ? <StandingsSkeletonDesktop /> : null}

      {!isLoading && data.length > 0 ? (
        <div className="block-style overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-[40px_1fr_40px_40px_40px_60px_60px_60px_50px_90px] gap-3 px-6 py-4 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
              <div className="text-center">#</div>
              <div>Team</div>
              <div className="text-center">P</div>
              <div className="text-center">W</div>
              <div className="text-center">L</div>
              <div className="text-center">PF</div>
              <div className="text-center">PA</div>
              <div className="text-center">+/-</div>
              <div className="text-center">PTS</div>
              <div className="text-center">Form</div>
            </div>
            <div className="flex flex-col gap-2 pb-6">
              {data.map((team) => (
                <div
                  key={`${team.position}-${team.team}`}
                  className="grid grid-cols-[40px_1fr_40px_40px_40px_60px_60px_60px_50px_90px] gap-3 px-6 items-center relative whitespace-nowrap hover:bg-snow-100/50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="text-center font-medium text-sm text-neutral-n4 dark:text-snow-200">
                    {team.position}
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-snow-100 dark:bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src="/loading-state/shield.svg"
                        alt={team.team}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate text-left hover:underline"
                      onClick={() => openTeamProfile(team.teamId)}
                    >
                      {team.team}
                    </button>
                  </div>
                  <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                    {team.played}
                  </div>
                  <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                    {team.wins}
                  </div>
                  <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                    {team.losses}
                  </div>
                  <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                    {team.pointsFor}
                  </div>
                  <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                    {team.pointsAgainst}
                  </div>
                  <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                    {team.pointsDiff > 0
                      ? `+${team.pointsDiff}`
                      : team.pointsDiff}
                  </div>
                  <div className="text-center font-semibold text-sm text-neutral-n4 dark:text-snow-200">
                    {team.points}
                  </div>
                  <div className="text-center">
                    {renderRecentForm(team.recentForm)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && data.length > 0 && (
        <div className="mt-6 block-style p-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex gap-1">
              <span className="font-bold text-brand-primary">P:</span>
              <span className="theme-text">Played</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-brand-primary">W:</span>
              <span className="theme-text">Wins</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-brand-primary">L:</span>
              <span className="theme-text">Losses</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-brand-primary">PF:</span>
              <span className="theme-text">Points For</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-brand-primary">PA:</span>
              <span className="theme-text">Points Against</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-brand-primary">+/-:</span>
              <span className="theme-text">Points Diff</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-brand-primary">PTS:</span>
              <span className="theme-text">Points</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
