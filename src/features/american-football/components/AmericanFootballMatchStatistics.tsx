import { useMemo } from "react";
import type { AmericanFootballStat } from "../data/mockAmericanFootball";
import { toNumeric } from "../statUtils";

type Winner = "home" | "away" | "none";

type DisplayRow = {
  label: string;
  home: string;
  away: string;
  winner: Winner;
};

/**
 * Fallback stats shown while a match is live but the backend has not
 * delivered any real stat lines yet (mirrors the old inline fallback).
 */
const fallbackLiveStats: AmericanFootballStat[] = [
  { label: "Total Yards", home: 238, away: 261 },
  { label: "Passing Yards", home: 156, away: 184 },
  { label: "Rushing Yards", home: 82, away: 77 },
  { label: "First Downs", home: 14, away: 16 },
  { label: "Time of Possession", home: 28, away: 32 },
];

/** Stats where a lower value is better (fewer penalties / turnovers). */
const isLowerBetter = (label: string) => /penalt|turnover/i.test(label);

const decide = (
  homeVal: number,
  awayVal: number,
  lowerBetter: boolean,
): Winner => {
  if (homeVal === awayVal) return "none";
  if (lowerBetter) return homeVal < awayVal ? "home" : "away";
  return homeVal > awayVal ? "home" : "away";
};

const AmericanFootballMatchStatistics = ({
  stats,
  homeTeamName,
  awayTeamName,
  isLive,
}: {
  stats?: AmericanFootballStat[];
  homeTeamName?: string;
  awayTeamName?: string;
  isLive: boolean;
}) => {
  const source = useMemo<AmericanFootballStat[]>(
    () => (stats?.length ? stats : isLive ? fallbackLiveStats : []),
    [stats, isLive],
  );

  const rows = useMemo<DisplayRow[]>(
    () =>
      source
        // Time of Possession is rendered as the possession bar, not a row.
        .filter((row) => !/time of possession/i.test(row.label))
        .map((row) => {
          const homeVal = toNumeric(row.home);
          const awayVal = toNumeric(row.away);
          return {
            label: row.label,
            home: String(row.home),
            away: String(row.away),
            winner: decide(homeVal, awayVal, isLowerBetter(row.label)),
          };
        }),
    [source],
  );

  const possession = useMemo(() => {
    const top = source.find((row) => /time of possession/i.test(row.label));
    if (!top) return { hasData: false, homePct: 0, awayPct: 0 };
    const homeVal = toNumeric(top.home);
    const awayVal = toNumeric(top.away);
    const total = homeVal + awayVal;
    const homePct = total > 0 ? Math.round((homeVal / total) * 100) : 0;
    return { hasData: true, homePct, awayPct: 100 - homePct };
  }, [source]);

  if (!source.length) {
    return (
      <p className="rounded-xl border border-snow-200 dark:border-[#1F2937] p-4 text-sm text-neutral-n4">
        Team statistics will appear when the game begins.
      </p>
    );
  }

  return (
    <div>
      {/* Team names header bar — mirrors MatchStatisticsPanel */}
      <div className="w-full flex text-sm bg-brand-p4 mb-7 py-2 px-5 justify-between mt-4">
        <div className="flex gap-3 items-center">
          <p className="sz-6">{homeTeamName ?? ""}</p>
        </div>
        <div className="flex gap-3 items-center">
          <p className="sz-6">{awayTeamName ?? ""}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Time of possession bar — the AF analog of "Ball Possession" */}
        {possession.hasData ? (
          <>
            <p className="flex-1 md:hidden text-center theme-text flex items-center justify-center">
              Time of Possession
            </p>
            <div className="flex w-full h-9 overflow-hidden rounded-3xl">
              <p
                className="md:flex-2 h-full pl-6 text-left text-white bg-brand-primary flex items-center"
                style={{ width: `${possession.homePct}%` }}
              >
                {possession.homePct}%
              </p>
              <p className="flex-1 hidden md:flex h-full text-center theme-text items-center justify-center">
                Time of Possession
              </p>
              <p
                className="md:flex-2 h-full pr-6 text-right bg-brand-secondary text-white flex items-center justify-end"
                style={{ width: `${possession.awayPct}%` }}
              >
                {possession.awayPct}%
              </p>
            </div>
          </>
        ) : null}

        {/* Stat rows — winning side highlighted, football style */}
        {rows.map((row, idx) => (
          <div key={`${row.label}-${idx}`} className="flex h-9 justify-between">
            <p
              className={`h-full px-3 rounded text-center flex items-center ${
                row.winner === "home"
                  ? "bg-brand-secondary text-white"
                  : "theme-text"
              }`}
            >
              {row.home}
            </p>
            <p className="h-full text-center theme-text flex items-center justify-center">
              {row.label}
            </p>
            <p
              className={`h-full px-3 rounded text-center flex items-center justify-end ${
                row.winner === "away"
                  ? "bg-brand-secondary text-white"
                  : "theme-text"
              }`}
            >
              {row.away}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmericanFootballMatchStatistics;
