import { useMemo } from "react";
import GetTeamLogo from "@/components/common/GetTeamLogo";

export type StandingsRow = {
  position: number;
  team: string;
  teamId?: number;
  logo?: string;
  recentForm?: string;
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

type Props = {
  rows?: StandingsRow[];
  standingsData?: GoalServeStandingsResponse;
};

export const StandingsTable = ({ rows, standingsData }: Props) => {
  const data = useMemo<StandingsRow[]>(() => {
    const rawTeams = standingsData?.standings?.tournament?.team;
    if (Array.isArray(rawTeams) && rawTeams.length) {
      const toInt = (v: unknown) => {
        const n = Number(String(v ?? "0").replace(/[^0-9-]/g, ""));
        return Number.isFinite(n) ? n : 0;
      };

      const sumSide = (
        sideA?: GoalServeTeamSideStats,
        sideB?: GoalServeTeamSideStats
      ) => {
        const gp = toInt(sideA?.gp) + toInt(sideB?.gp);
        const w = toInt(sideA?.w) + toInt(sideB?.w);
        const d = toInt(sideA?.d) + toInt(sideB?.d);
        const l = toInt(sideA?.l) + toInt(sideB?.l);
        const gs = toInt(sideA?.gs) + toInt(sideB?.gs);
        const ga = toInt(sideA?.ga) + toInt(sideB?.ga);
        return { gp, w, d, l, gs, ga };
      };

      return rawTeams
        .map((t) => {
          const combined = sumSide(t.home, t.away);
          const teamId = toInt(t.id);
          const points = toInt(t.total?.p);
          const goalDiff = combined.gs - combined.ga;

          return {
            position: toInt(t.position),
            team: String(t.name ?? ""),
            teamId: teamId || undefined,
            recentForm: typeof t.recent_form === "string" ? t.recent_form : undefined,
            played: combined.gp,
            wins: combined.w,
            draws: combined.d,
            losses: combined.l,
            goalsFor: combined.gs,
            goalsAgainst: combined.ga,
            goalDiff,
            points,
          } satisfies StandingsRow;
        })
        .sort((a, b) => a.position - b.position);
    }

    return (
      rows ?? [
        {
          position: 1,
          team: "Manchester City",
          recentForm: "WLWWD",
          logo: "/assets/icons/Football/Team/Manchester City.png",
          played: 23,
          wins: 19,
          draws: 2,
          losses: 2,
          goalsFor: 58,
          goalsAgainst: 34,
          goalDiff: 23,
          points: 58,
        },
        {
          position: 2,
          team: "Arsenal",
          recentForm: "WWWWW",
          logo: "/assets/icons/Football/Team/Arsenal.png",
          played: 23,
          wins: 19,
          draws: 2,
          losses: 2,
          goalsFor: 58,
          goalsAgainst: 34,
          goalDiff: 23,
          points: 58,
        },
        {
          position: 3,
          team: "Liverpool",
          recentForm: "WLWWL",
          logo: "/assets/icons/Football/Team/Liverpool.png",
          played: 23,
          wins: 18,
          draws: 3,
          losses: 2,
          goalsFor: 55,
          goalsAgainst: 32,
          goalDiff: 23,
          points: 57,
        },
        {
          position: 4,
          team: "Chelsea",
          recentForm: "LWDWW",
          logo: "/assets/icons/Football/Team/Chelsea.png",
          played: 23,
          wins: 17,
          draws: 4,
          losses: 2,
          goalsFor: 52,
          goalsAgainst: 30,
          goalDiff: 22,
          points: 55,
        },
        {
          position: 5,
          team: "Tottenham",
          recentForm: "WLWDD",
          logo: "/assets/icons/Football/Team/Tottenham.png",
          played: 23,
          wins: 16,
          draws: 3,
          losses: 4,
          goalsFor: 50,
          goalsAgainst: 28,
          goalDiff: 22,
          points: 51,
        },
        {
          position: 6,
          team: "Manchester United",
          recentForm: "DWLWW",
          logo: "/assets/icons/Football/Team/Manchester United.png",
          played: 23,
          wins: 15,
          draws: 4,
          losses: 4,
          goalsFor: 48,
          goalsAgainst: 26,
          goalDiff: 22,
          points: 49,
        },
        {
          position: 7,
          team: "Newcastle",
          recentForm: "DLWWW",
          logo: "/assets/icons/Football/Team/Newcastle.png",
          played: 23,
          wins: 14,
          draws: 5,
          losses: 4,
          goalsFor: 46,
          goalsAgainst: 24,
          goalDiff: 22,
          points: 47,
        },
        {
          position: 8,
          team: "Brighton",
          recentForm: "WLDWL",
          logo: "/assets/icons/Football/Team/Brighton.png",
          played: 23,
          wins: 13,
          draws: 5,
          losses: 5,
          goalsFor: 44,
          goalsAgainst: 22,
          goalDiff: 22,
          points: 44,
        },
        {
          position: 9,
          team: "West Ham",
          recentForm: "LLWWW",
          logo: "/assets/icons/Football/Team/West Ham.png",
          played: 23,
          wins: 12,
          draws: 6,
          losses: 5,
          goalsFor: 42,
          goalsAgainst: 20,
          goalDiff: 22,
          points: 42,
        },
        {
          position: 10,
          team: "Aston Villa",
          recentForm: "WWLLW",
          logo: "/assets/icons/Football/Team/Aston Villa.png",
          played: 23,
          wins: 11,
          draws: 6,
          losses: 6,
          goalsFor: 40,
          goalsAgainst: 18,
          goalDiff: 22,
          points: 39,
        },
        {
          position: 11,
          team: "Crystal Palace",
          logo: "/assets/icons/Football/Team/Crystal Palace.png",
          played: 23,
          wins: 10,
          draws: 7,
          losses: 6,
          goalsFor: 38,
          goalsAgainst: 16,
          goalDiff: 22,
          points: 37,
        },
        {
          position: 12,
          team: "Fulham",
          logo: "/assets/icons/Football/Team/Fulham.png",
          played: 23,
          wins: 9,
          draws: 7,
          losses: 7,
          goalsFor: 36,
          goalsAgainst: 14,
          goalDiff: 22,
          points: 34,
        },
        {
          position: 13,
          team: "Wolves",
          logo: "/assets/icons/Football/Team/Wolves.png",
          played: 23,
          wins: 8,
          draws: 8,
          losses: 7,
          goalsFor: 34,
          goalsAgainst: 12,
          goalDiff: 22,
          points: 32,
        },
        {
          position: 14,
          team: "Everton",
          logo: "/assets/icons/Football/Team/Everton.png",
          played: 23,
          wins: 7,
          draws: 8,
          losses: 8,
          goalsFor: 32,
          goalsAgainst: 10,
          goalDiff: 22,
          points: 29,
        },
        {
          position: 15,
          team: "Brentford",
          logo: "/assets/icons/Football/Team/Brentford.png",
          played: 23,
          wins: 6,
          draws: 9,
          losses: 8,
          goalsFor: 30,
          goalsAgainst: 8,
          goalDiff: 22,
          points: 27,
        },
        {
          position: 16,
          team: "Nottingham Forest",
          logo: "/assets/icons/Football/Team/Nottingham Forest.png",
          played: 23,
          wins: 5,
          draws: 9,
          losses: 9,
          goalsFor: 28,
          goalsAgainst: 6,
          goalDiff: 22,
          points: 24,
        },
        {
          position: 17,
          team: "Leicester",
          logo: "/assets/icons/Football/Team/Leicester.png",
          played: 23,
          wins: 4,
          draws: 10,
          losses: 9,
          goalsFor: 26,
          goalsAgainst: 4,
          goalDiff: 22,
          points: 22,
        },
        {
          position: 18,
          team: "Leeds",
          logo: "/assets/icons/Football/Team/Leeds.png",
          played: 23,
          wins: 3,
          draws: 10,
          losses: 10,
          goalsFor: 24,
          goalsAgainst: 2,
          goalDiff: 22,
          points: 19,
        },
        {
          position: 19,
          team: "Southampton",
          logo: "/assets/icons/Football/Team/Southampton.png",
          played: 23,
          wins: 2,
          draws: 11,
          losses: 10,
          goalsFor: 22,
          goalsAgainst: 0,
          goalDiff: 22,
          points: 17,
        },
        {
          position: 20,
          team: "Bournemouth",
          logo: "/assets/icons/Football/Team/Bournemouth.png",
          played: 23,
          wins: 1,
          draws: 11,
          losses: 11,
          goalsFor: 20,
          goalsAgainst: -2,
          goalDiff: 22,
          points: 14,
        },
      ]
    );
  }, [rows, standingsData]);

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
        const isTopFour = team.position <= 4;
        const isFifth = team.position === 5;
        const isRelegation = team.position >= 18;
        const borderClass = isTopFour
          ? "border-l-[3px] border-ui-success"
          : isFifth
            ? "border-l-[3px] border-yellow-500"
            : isRelegation
              ? "border-l-[3px] border-ui-negative"
              : "";

        return (
          <div
            key={`${team.position}-${team.team}`}
            className={`grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 ${paddingX} items-center relative whitespace-nowrap ${borderClass}`}
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
              <div className="grid grid-cols-[40px_1fr] gap-3 px-4 py-3 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
                <div className="text-center">#</div>
                <div>Team</div>
              </div>
              <div className="flex flex-col gap-2">
                {data.map((team) => (
                  <div
                    key={`mobile-team-${team.position}-${team.team}`}
                    className="grid grid-cols-[40px_1fr] gap-3 px-4 items-center whitespace-nowrap"
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
                <div className="grid grid-cols-[40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 px-4 py-3 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
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
                <div className="flex flex-col gap-2">
                  {data.map((team) => (
                    <div
                      key={`mobile-stats-${team.position}-${team.team}`}
                      className="grid grid-cols-[40px_40px_40px_40px_50px_50px_50px_50px_90px] gap-3 px-4 items-center whitespace-nowrap"
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

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-6 bg-ui-success" />
            <span className="text-sm text-neutral-n4 dark:text-snow-200">
              UEFA Champions League
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-6 bg-yellow-500" />
            <span className="text-sm text-neutral-n4 dark:text-snow-200">
              UEFA Europa League
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-6 bg-ui-negative" />
            <span className="text-sm text-neutral-n4 dark:text-snow-200">Relegation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;
