import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  AmericanFootballStandingsGroup,
  AmericanFootballStandingsTeam,
} from "../data/mockAmericanFootballStandings";
import { mockLeagueStandings } from "../data/mockAmericanFootballStandings";
import { teamInitials } from "../statUtils";
import {
  AF_LEAGUE_CODE_TO_MOCK_ID,
  getAllStandingsAsMockShape,
  isAmericanFootballApiEnabled,
} from "@/lib/api/american-football";

/** "NFL" -> "nfl", "NCAA FBS" -> "ncaa-fbs", "CFL" -> "cfl", ... */
const leagueToStandingsKey = (league?: string): string | undefined => {
  if (!league) return undefined;
  const upper = league.trim().toUpperCase();
  if (AF_LEAGUE_CODE_TO_MOCK_ID[upper]) return AF_LEAGUE_CODE_TO_MOCK_ID[upper];
  const code = upper.replace(/^NCAA\s+/, "").trim();
  if (AF_LEAGUE_CODE_TO_MOCK_ID[code]) return AF_LEAGUE_CODE_TO_MOCK_ID[code];
  return upper.toLowerCase();
};

/** Fuzzy name match so "Chiefs" lines up with "Kansas City Chiefs". */
const teamMatches = (standingName: string, matchTeam?: string) => {
  if (!standingName || !matchTeam) return false;
  const a = standingName.toLowerCase();
  const b = matchTeam.toLowerCase();
  return a.includes(b) || b.includes(a);
};

const DESKTOP_GRID =
  "grid-cols-[40px_1fr_40px_40px_40px_50px_50px_90px]";

const AmericanFootballStandings = ({
  league,
  homeTeam,
  awayTeam,
}: {
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
}) => {
  const standingsKey = leagueToStandingsKey(league);

  const standingsQuery = useQuery({
    queryKey: ["american-football", "standings", "all"],
    enabled: isAmericanFootballApiEnabled,
    queryFn: getAllStandingsAsMockShape,
    staleTime: 5 * 60 * 1000,
  });

  const groups = useMemo<AmericanFootballStandingsGroup[]>(() => {
    if (!standingsKey) return [];
    return standingsQuery.data?.[standingsKey]?.length
      ? standingsQuery.data[standingsKey]
      : (mockLeagueStandings[standingsKey] ?? []);
  }, [standingsKey, standingsQuery.data]);

  const rowHighlight = (team: AmericanFootballStandingsTeam) => {
    if (teamMatches(team.name, homeTeam)) return "bg-brand-secondary/10";
    if (teamMatches(team.name, awayTeam)) return "bg-brand-primary/10";
    return "";
  };

  if (!groups.length) {
    return (
      <p className="rounded-xl border border-snow-200 dark:border-[#1F2937] p-4 text-sm text-neutral-n4">
        Standings for this league aren't available yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group, idx) => (
        <div
          key={`${group.conference ?? "flat"}-${group.division ?? idx}`}
          className="block-style !p-0 overflow-hidden"
        >
          {group.conference || group.division ? (
            <div className="px-5 py-3 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
              <p className="font-bold uppercase text-sm theme-text tracking-wide">
                {[group.conference, group.division]
                  .filter(Boolean)
                  .join(" — ")}
              </p>
            </div>
          ) : null}

          {/* Desktop — football-style grid, home/away rows highlighted */}
          <div className="hidden md:block">
            <div className="min-w-full">
              <div
                className={`grid ${DESKTOP_GRID} gap-3 px-6 py-4 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap`}
              >
                <div className="text-center">#</div>
                <div>Team</div>
                <div className="text-center">W</div>
                <div className="text-center">L</div>
                <div className="text-center">T</div>
                <div className="text-center">PF</div>
                <div className="text-center">PA</div>
                <div className="text-center">Strk</div>
              </div>
              <div className="flex flex-col gap-1 px-2 pb-4">
                {group.teams.map((team) => (
                  <div
                    key={team.id}
                    className={`grid ${DESKTOP_GRID} gap-3 px-4 py-2 rounded items-center whitespace-nowrap ${rowHighlight(team)}`}
                  >
                    <div className="text-center font-medium text-sm text-neutral-n4 dark:text-snow-200">
                      {team.position}
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-full bg-snow-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-neutral-n4 shrink-0">
                        {teamInitials(team.name)}
                      </span>
                      <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">
                        {team.name}
                      </span>
                    </div>
                    <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                      {team.won}
                    </div>
                    <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                      {team.lost}
                    </div>
                    <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                      {team.ties}
                    </div>
                    <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                      {team.pointsFor}
                    </div>
                    <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">
                      {team.pointsAgainst}
                    </div>
                    <div className="text-center font-semibold text-sm text-brand-secondary">
                      {team.streak}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile — horizontally scrollable table */}
          <div className="md:hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-xs text-neutral-n4 uppercase bg-snow-100 dark:bg-white/5 border-b border-snow-200 dark:border-[#1F2937]">
                  <th className="text-left px-4 py-2">#</th>
                  <th className="text-left px-2 py-2">Team</th>
                  <th className="px-2 py-2">W</th>
                  <th className="px-2 py-2">L</th>
                  <th className="px-2 py-2">T</th>
                  <th className="px-2 py-2">PF</th>
                  <th className="px-2 py-2">PA</th>
                  <th className="px-2 py-2">Strk</th>
                </tr>
              </thead>
              <tbody>
                {group.teams.map((team, rowIdx) => (
                  <tr
                    key={team.id}
                    className={`border-b border-snow-200 dark:border-[#1F2937] last:border-b-0 ${
                      rowIdx % 2 === 1 ? "bg-snow-50 dark:bg-white/[0.02]" : ""
                    } ${rowHighlight(team)}`}
                  >
                    <td className="px-4 py-2 text-neutral-n4">
                      {team.position}
                    </td>
                    <td className="px-2 py-2 font-medium theme-text">
                      {team.name}
                    </td>
                    <td className="text-center px-2 py-2 theme-text">
                      {team.won}
                    </td>
                    <td className="text-center px-2 py-2 theme-text">
                      {team.lost}
                    </td>
                    <td className="text-center px-2 py-2 theme-text">
                      {team.ties}
                    </td>
                    <td className="text-center px-2 py-2 theme-text">
                      {team.pointsFor}
                    </td>
                    <td className="text-center px-2 py-2 theme-text">
                      {team.pointsAgainst}
                    </td>
                    <td className="text-center px-2 py-2 font-semibold text-brand-secondary">
                      {team.streak}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Column legend — mirrors football's standings footer */}
      <div className="block-style p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-sm">
          <div>
            <span className="font-semibold text-brand-primary">#:</span>{" "}
            <span className="text-neutral-n4 dark:text-snow-200">Position</span>
          </div>
          <div>
            <span className="font-semibold text-brand-primary">W:</span>{" "}
            <span className="text-neutral-n4 dark:text-snow-200">Wins</span>
          </div>
          <div>
            <span className="font-semibold text-brand-primary">L:</span>{" "}
            <span className="text-neutral-n4 dark:text-snow-200">Losses</span>
          </div>
          <div>
            <span className="font-semibold text-brand-primary">T:</span>{" "}
            <span className="text-neutral-n4 dark:text-snow-200">Ties</span>
          </div>
          <div>
            <span className="font-semibold text-brand-primary">PF:</span>{" "}
            <span className="text-neutral-n4 dark:text-snow-200">
              Points For
            </span>
          </div>
          <div>
            <span className="font-semibold text-brand-primary">PA:</span>{" "}
            <span className="text-neutral-n4 dark:text-snow-200">
              Points Against
            </span>
          </div>
          <div>
            <span className="font-semibold text-brand-primary">Strk:</span>{" "}
            <span className="text-neutral-n4 dark:text-snow-200">Streak</span>
          </div>
        </div>
        {homeTeam && awayTeam ? (
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-neutral-n4 dark:text-snow-200">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-brand-secondary/60" />
              {homeTeam}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-brand-primary/60" />
              {awayTeam}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AmericanFootballStandings;
