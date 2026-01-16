import { useEffect, useMemo, useState } from "react";
import GetTeamLogo from "@/components/common/GetTeamLogo";
import { getStandingsByLeagueId } from "@/lib/api/endpoints";

export type StandingsRow = {
  position: number;
  team: string;
  teamId?: number;
  logo?: string;
  recentForm?: string;
  description?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

type GoalServeTeamSideStats = {
  d?: string;
  ga?: string;
  gp?: string;
  gs?: string;
  l?: string;
  p?: string;
  w?: string;
};

export type GoalServeStandingTeam = {
  id?: string;
  name?: string;
  position?: string;
  recent_form?: string;
  home?: GoalServeTeamSideStats;
  away?: GoalServeTeamSideStats;
  total?: { gd?: string; p?: string };
  description?: { value?: string };
};

export type GoalServeStandingsResponse = {
  standings?: {
    tournament?: {
      team?: GoalServeStandingTeam[];
    };
  };
};

type LeagueStandingRow = {
  team_id?: number;
  team_name?: string;
  position?: number;
  overall?: {
    played?: number;
    wins?: number;
    draws?: number;
    losses?: number;
    goals_for?: number;
    goals_against?: number;
  };
  goal_difference?: number;
  points?: number;
  recent_form?: string;
  description?: string;
};

type StandingsByLeagueResponse = {
  success?: boolean;
  message?: string;
  responseObject?: {
    item?: Array<{
      league_id?: number;
      standings?: LeagueStandingRow[];
    }>;
  };
};

type Props = {
  rows?: StandingsRow[];
  standingsData?: GoalServeStandingsResponse;
  leagueId?: string | number;
  localteamId?: string | number;
  visitorteamId?: string | number;
};

export const StandingsTable = ({ leagueId, localteamId, visitorteamId }: Props) => {
  const [apiData, setApiData] = useState<StandingsByLeagueResponse | null>(null);
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const SkeletonBlock = ({ className }: { className: string }) => (
    <div className={`animate-pulse rounded bg-snow-200/80 dark:bg-white/10 ${className}`} />
  );

  const StandingsSkeletonDesktop = () => (
    <div className="hidden lg:block block-style overflow-x-auto">
      <div className="min-w-full">
        <div className="grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 px-6 py-4 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
          <div className="text-center">#</div>
          <div>Team</div>
          <div className="text-center">P</div>
          <div className="text-center">W</div>
          <div className="text-center">D</div>
          <div className="text-center">L</div>
          <div className="text-center">GF</div>
          <div className="text-center">GA</div>
          <div className="text-center">GD</div>
          <div className="text-center">PTS</div>
          <div className="text-center">Form</div>
        </div>
        <div className="flex flex-col gap-2 px-6 pb-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 items-center"
            >
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <div className="flex items-center gap-3 min-w-0">
                <SkeletonBlock className="w-8 h-8 rounded-full" />
                <SkeletonBlock className="h-3 w-40" />
              </div>
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-8 mx-auto" />
              <SkeletonBlock className="h-4 w-8 mx-auto" />
              <SkeletonBlock className="h-4 w-8 mx-auto" />
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

  const StandingsSkeletonMobile = () => (
    <div className="block lg:hidden">
      <div className="block-style">
        <div className="flex">
          <div className="w-[220px] shrink-0">
            <div className="grid grid-cols-[40px_1fr] gap-3 px-4 py-2 mb-2 h-10 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap items-center">
              <div className="text-center">#</div>
              <div>Team</div>
            </div>
            <div className="flex flex-col gap-0">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="grid grid-cols-[40px_1fr] gap-3 px-4 h-10 items-center whitespace-nowrap">
                  <SkeletonBlock className="h-4 w-6 mx-auto" />
                  <div className="flex items-center gap-2 min-w-0">
                    <SkeletonBlock className="w-7 h-7 rounded-full" />
                    <SkeletonBlock className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-x-auto hide-scrollbar">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 px-4 py-2 mb-2 h-10 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap items-center">
                <div className="text-center">P</div>
                <div className="text-center">W</div>
                <div className="text-center">D</div>
                <div className="text-center">L</div>
                <div className="text-center">GF</div>
                <div className="text-center">GA</div>
                <div className="text-center">GD</div>
                <div className="text-center">PTS</div>
                <div className="text-center">Form</div>
              </div>
              <div className="flex flex-col gap-0">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div key={idx} className="grid grid-cols-[40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 px-4 h-10 items-center whitespace-nowrap">
                    <SkeletonBlock className="h-4 w-6 mx-auto" />
                    <SkeletonBlock className="h-4 w-6 mx-auto" />
                    <SkeletonBlock className="h-4 w-6 mx-auto" />
                    <SkeletonBlock className="h-4 w-6 mx-auto" />
                    <SkeletonBlock className="h-4 w-8 mx-auto" />
                    <SkeletonBlock className="h-4 w-8 mx-auto" />
                    <SkeletonBlock className="h-4 w-8 mx-auto" />
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
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const id = String(leagueId ?? "").trim();
    if (!id) return;

    let isCancelled = false;

    const run = async () => {
      try {
        setIsLoading(true);
        setApiError("");
        const res = (await getStandingsByLeagueId(id)) as StandingsByLeagueResponse;
        if (isCancelled) return;
        setApiData(res);
      } catch (e) {
        if (isCancelled) return;
        setApiError("Failed to load standings");
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

  const data = useMemo<StandingsRow[]>(() => {
    const apiStandings = apiData?.responseObject?.item?.[0]?.standings;
    if (Array.isArray(apiStandings) && apiStandings.length) {
      const toNum = (v: unknown) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      };

      return apiStandings
        .map((t) => {
          const overall = t.overall ?? {};
          const goalsFor = toNum(overall.goals_for);
          const goalsAgainst = toNum(overall.goals_against);
          const goalDiff = Number.isFinite(Number(t.goal_difference))
            ? Number(t.goal_difference)
            : goalsFor - goalsAgainst;

          return {
            position: toNum(t.position),
            team: String(t.team_name ?? ""),
            teamId: Number.isFinite(Number(t.team_id)) ? Number(t.team_id) : undefined,
            recentForm: typeof t.recent_form === "string" ? t.recent_form : undefined,
            description: typeof t.description === "string" ? t.description : undefined,
            played: toNum(overall.played),
            wins: toNum(overall.wins),
            draws: toNum(overall.draws),
            losses: toNum(overall.losses),
            goalsFor,
            goalsAgainst,
            goalDiff,
            points: toNum(t.points),
          } satisfies StandingsRow;
        })
        .filter((r) => r.team.trim())
        .sort((a, b) => a.position - b.position);
    }
    return [];
  }, [apiData]);

  const getHighlightBgClass = (teamId?: number) => {
    if (!teamId) return "";
    const homeIdNum = Number(localteamId);
    const awayIdNum = Number(visitorteamId);

    if (Number.isFinite(homeIdNum) && teamId === homeIdNum) return "bg-brand-secondary/10";
    if (Number.isFinite(awayIdNum) && teamId === awayIdNum) return "bg-brand-primary/10";
    return "";
  };

  const getZoneMeta = (description?: string) => {
    const d = (description ?? "").toLowerCase();
    if (!d.trim()) return null;

    if (d.includes("relegation")) {
      return { label: description ?? "Relegation", borderClass: "border-l-[3px] border-ui-negative" };
    }

    if (d.includes("champions league")) {
      return {
        label: description ?? "UEFA Champions League",
        borderClass: "border-l-[3px] border-ui-success",
      };
    }

    if (d.includes("europa league")) {
      return {
        label: description ?? "UEFA Europa League",
        borderClass: "border-l-[3px] border-yellow-500",
      };
    }

    if (d.includes("conference league")) {
      return {
        label: description ?? "UEFA Conference League",
        borderClass: "border-l-[3px] border-blue-500",
      };
    }

    if (d.includes("promotion")) {
      return { label: description ?? "Promotion", borderClass: "border-l-[3px] border-ui-success" };
    }

    return { label: description ?? "", borderClass: "border-l-[3px] border-snow-200 dark:border-white/20" };
  };

  const legendItems = useMemo(() => {
    const seen = new Set<string>();
    const items: Array<{ label: string; borderClass: string }> = [];

    data.forEach((row) => {
      const meta = getZoneMeta(row.description);
      if (!meta) return;
      const key = meta.label.trim();
      if (!key || seen.has(key)) return;
      seen.add(key);
      items.push({ label: meta.label, borderClass: meta.borderClass });
    });

    return items;
  }, [data]);

  const renderRecentForm = (recentForm?: string) => {
    const form = (typeof recentForm === "string" ? recentForm : "")
      .toUpperCase()
      .replace(/[^WDL]/g, "");
    const chars = form.slice(0, 5).split("");
    while (chars.length < 5) chars.push("-");

    const colorFor = (c: string) => {
      if (c === "W") return "bg-ui-success";
      if (c === "L") return "bg-ui-negative";
      if (c === "D") return "bg-snow-200 dark:bg-white/20";
      return "bg-snow-200 dark:bg-white/10";
    };

    return (
      <div className="flex items-center justify-center gap-1">
        {chars.map((c, idx) => (
          <span
            key={`${c}-${idx}`}
            className={`h-2.5 w-2.5 rounded-full ${colorFor(c)}`}
            title={c === "W" ? "Win" : c === "D" ? "Draw" : c === "L" ? "Loss" : ""}
          />
        ))}
      </div>
    );
  };

  const renderRows = (rowItems: StandingsRow[], paddingX: string) => (
    <div className="flex flex-col gap-2">
      {rowItems.map((team) => {
        const borderClass = getZoneMeta(team.description)?.borderClass ?? "";
        const highlightBg = getHighlightBgClass(team.teamId);

        return (
          <div
            key={`${team.position}-${team.team}`}
            className={`grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 ${paddingX} items-center relative whitespace-nowrap ${borderClass} ${highlightBg}`}
          >
            <div className="text-center font-medium text-sm text-neutral-n4 dark:text-snow-200">
              {team.position}
            </div>
            <div className="flex items-center gap-3 min-w-0">
              {team.teamId ? (
                <GetTeamLogo
                  teamId={team.teamId}
                  alt={team.team}
                  className="w-8 h-8 rounded-full object-contain flex-shrink-0"
                />
              ) : (
                <img
                  src={team.logo || "/loading-state/shield.svg"}
                  alt={team.team}
                  className="w-8 h-8 rounded-full object-contain flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/loading-state/shield.svg";
                  }}
                />
              )}
              <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">
                {team.team}
              </span>
            </div>
            <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
              {team.played}
            </div>
            <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
              {team.wins}
            </div>
            <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
              {team.draws}
            </div>
            <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
              {team.losses}
            </div>
            <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
              {team.goalsFor}
            </div>
            <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
              {team.goalsAgainst}
            </div>
            <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
              {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
            </div>
            <div className="text-center font-semibold text-sm text-neutral-n4 dark:text-snow-200">
              {team.points}
            </div>
            <div className="text-center">{renderRecentForm(team.recentForm)}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="my-8">
      {apiError ? (
        <div className="mb-4 text-sm text-ui-negative">{apiError}</div>
      ) : null}
      {!isLoading && !apiError && data.length === 0 ? (
        <div className="mb-4 text-sm text-neutral-n4 dark:text-snow-200">No records at the Moment check back later</div>
      ) : null}

      {isLoading ? (
        <>
          <StandingsSkeletonDesktop />
          <StandingsSkeletonMobile />
        </>
      ) : null}

      {!isLoading ? (
        <>
          <div className="hidden lg:block block-style overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 px-6 py-4 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
                <div className="text-center">#</div>
                <div>Team</div>
                <div className="text-center">P</div>
                <div className="text-center">W</div>
                <div className="text-center">D</div>
                <div className="text-center">L</div>
                <div className="text-center">GF</div>
                <div className="text-center">GA</div>
                <div className="text-center">GD</div>
                <div className="text-center">PTS</div>
                <div className="text-center">Form</div>
              </div>
              {renderRows(data, "px-6")}
            </div>
          </div>

          <div className="block lg:hidden">
            <div className="block-style">
              <div className="flex">
                <div className="w-[220px] shrink-0">
                  <div className="grid grid-cols-[40px_1fr] gap-3 px-4 py-2 mb-2 h-10 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap items-center">
                    <div className="text-center">#</div>
                    <div>Team</div>
                  </div>
                  <div className="flex flex-col gap-0">
                    {data.map((team) => (
                      <div
                        key={`mobile-team-${team.position}-${team.team}`}
                        className={`grid grid-cols-[40px_1fr] gap-3 px-4 h-10 items-center whitespace-nowrap ${getZoneMeta(team.description)?.borderClass ?? ""} ${getHighlightBgClass(team.teamId)}`}
                      >
                        <div className="text-center font-medium text-sm text-neutral-n4 dark:text-snow-200">
                          {team.position}
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          {team.teamId ? (
                            <GetTeamLogo
                              teamId={team.teamId}
                              alt={team.team}
                              className="w-7 h-7 rounded-full object-contain flex-shrink-0"
                            />
                          ) : (
                            <img
                              src={team.logo || "/loading-state/shield.svg"}
                              alt={team.team}
                              className="w-7 h-7 rounded-full object-contain flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/loading-state/shield.svg";
                              }}
                            />
                          )}
                          <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">
                            {team.team}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-x-auto hide-scrollbar">
                  <div className="min-w-[680px]">
                    <div className="grid grid-cols-[40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 px-4 py-2 mb-2 h-10 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap items-center">
                      <div className="text-center">P</div>
                      <div className="text-center">W</div>
                      <div className="text-center">D</div>
                      <div className="text-center">L</div>
                      <div className="text-center">GF</div>
                      <div className="text-center">GA</div>
                      <div className="text-center">GD</div>
                      <div className="text-center">PTS</div>
                      <div className="text-center">Form</div>
                    </div>
                    <div className="flex flex-col gap-0">
                      {data.map((team) => (
                        <div
                          key={`mobile-stats-${team.position}-${team.team}`}
                          className={`grid grid-cols-[40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 px-4 h-10 items-center whitespace-nowrap ${getZoneMeta(team.description)?.borderClass ?? ""} ${getHighlightBgClass(team.teamId)}`}
                        >
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                            {team.played}
                          </div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                            {team.wins}
                          </div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                            {team.draws}
                          </div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                            {team.losses}
                          </div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                            {team.goalsFor}
                          </div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                            {team.goalsAgainst}
                          </div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                            {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
                          </div>
                          <div className="text-center font-semibold text-sm text-neutral-n4 dark:text-snow-200">
                            {team.points}
                          </div>
                          <div className="text-center">{renderRecentForm(team.recentForm)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-6 block-style p-4 md:p-6">
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 text-sm">
            <div>
              <span className="font-semibold text-brand-primary">#:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Position</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">Team:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Team</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">P:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Played</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">W:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Wins</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">D:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Draws</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">L:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Losses</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">GF:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Goals For</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">GA:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Goals Against</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">GD:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Goal Difference</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">PTS:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Points</span>
            </div>
          </div>
        </div>

        {legendItems.length ? (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {legendItems.map((item) => {
              const colorClass =
                item.borderClass
                  .split(" ")
                  .find(
                    (c) =>
                      c.startsWith("border-") &&
                      !c.startsWith("border-l") &&
                      !c.startsWith("border-r") &&
                      !c.startsWith("border-t") &&
                      !c.startsWith("border-b")
                  ) ?? "border-snow-200";
              const textColorClass = colorClass.replace("border-", "text-");

              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-[3px] h-6 ${colorClass.replace("border-", "bg-")}`} />
                  <span className={`text-sm ${textColorClass}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StandingsTable;
