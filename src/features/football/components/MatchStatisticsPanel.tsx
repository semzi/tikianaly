import { useMemo, useState } from "react";

type Mode = "total" | "h1" | "h2";

type MatchStatsSide = {
  shots?: Record<string, string | undefined>;
  fouls?: Record<string, string | undefined>;
  corners?: Record<string, string | undefined>;
  offsides?: Record<string, string | undefined>;
  possestiontime?: Record<string, string | undefined>;
  yellowcards?: Record<string, string | undefined>;
  redcards?: Record<string, string | undefined>;
  saves?: Record<string, string | undefined>;
  passes?: Record<string, string | undefined>;
  expected_goals?: Record<string, string | undefined>;
};

type MatchStats = {
  home?: MatchStatsSide;
  away?: MatchStatsSide;
};

const toInt = (v: unknown) => {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const getByMode = (obj: any, baseKey: string, mode: Mode) => {
  if (!obj) return "";
  if (mode === "total") return String(obj?.[baseKey] ?? "");
  if (mode === "h1") return String(obj?.[`${baseKey}_h1`] ?? "");
  return String(obj?.[`${baseKey}_h2`] ?? "");
};

export default function MatchStatisticsPanel({
  stats,
  homeTeamName,
  awayTeamName,
}: {
  stats?: MatchStats;
  homeTeamName?: string;
  awayTeamName?: string;
}) {
  const [mode, setMode] = useState<Mode>("total");

  const home = stats?.home;
  const away = stats?.away;

  const possessionHome = useMemo(() => toInt(getByMode(home?.possestiontime, "total", mode)), [home, mode]);
  const possessionAway = useMemo(() => toInt(getByMode(away?.possestiontime, "total", mode)), [away, mode]);
  const totalPoss = possessionHome + possessionAway;
  const pctHome = totalPoss > 0 ? Math.round((possessionHome / totalPoss) * 100) : 0;
  const pctAway = totalPoss > 0 ? 100 - pctHome : 0;

  const rows = useMemo(
    () => [
      { label: "Total Shots", home: getByMode(home?.shots, "total", mode), away: getByMode(away?.shots, "total", mode) },
      { label: "Shots On Goal", home: getByMode(home?.shots, "ongoal", mode), away: getByMode(away?.shots, "ongoal", mode) },
      { label: "Shots Off Goal", home: getByMode(home?.shots, "offgoal", mode), away: getByMode(away?.shots, "offgoal", mode) },
      { label: "Corners", home: getByMode(home?.corners, "total", mode), away: getByMode(away?.corners, "total", mode) },
      { label: "Fouls", home: getByMode(home?.fouls, "total", mode), away: getByMode(away?.fouls, "total", mode) },
      { label: "Offsides", home: getByMode(home?.offsides, "total", mode), away: getByMode(away?.offsides, "total", mode) },
      { label: "Yellow Cards", home: getByMode(home?.yellowcards, "total", mode), away: getByMode(away?.yellowcards, "total", mode) },
      { label: "Red Cards", home: getByMode(home?.redcards, "total", mode), away: getByMode(away?.redcards, "total", mode) },
      { label: "Saves", home: getByMode(home?.saves, "total", mode), away: getByMode(away?.saves, "total", mode) },
      { label: "Total Passes", home: getByMode(home?.passes, "total", mode), away: getByMode(away?.passes, "total", mode) },
      { label: "Expected Goals", home: getByMode(home?.expected_goals, "total", mode), away: getByMode(away?.expected_goals, "total", mode) },
    ],
    [home, away, mode]
  );

  const ToggleBtn = ({ id, label }: { id: Mode; label: string }) => (
    <button
      type="button"
      onClick={() => setMode(id)}
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        mode === id ? "bg-brand-secondary text-white" : "bg-snow-200/60 dark:bg-white/10 theme-text"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="block my-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="sz-3">Match Statistics</p>
        <div className="flex items-center gap-2">
          <ToggleBtn id="total" label="Total" />
          <ToggleBtn id="h1" label="1st Half" />
          <ToggleBtn id="h2" label="2nd Half" />
        </div>
      </div>

      <div className="w-full flex text-sm bg-brand-p4 mb-7 py-2 px-5 justify-between mt-4">
        <div className="flex gap-3 items-center">
          <p className="sz-6">{homeTeamName ?? ""}</p>
        </div>
        <div className="flex gap-3 items-center">
          <p className="sz-6">{awayTeamName ?? ""}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="flex-1 md:hidden text-center theme-text flex items-center justify-center">Ball Possession</p>
        <div className="flex w-full h-9 overflow-hidden rounded-3xl">
          <p
            className="md:flex-2 h-full pl-6 text-left text-white bg-brand-primary flex items-center"
            style={{ width: `${pctHome}%` }}
          >
            {pctHome}%
          </p>
          <p className="flex-1 hidden md:flex h-full text-center theme-text  items-center justify-center">Ball Possession</p>
          <p
            className="md:flex-2 h-full pr-6 text-right bg-brand-secondary text-white flex items-center justify-end"
            style={{ width: `${pctAway}%` }}
          >
            {pctAway}%
          </p>
        </div>

        {rows.map((r, idx) => (
          <div key={`${r.label}-${idx}`} className="flex h-9 justify-between">
            <p className="h-full px-3 rounded text-center flex items-center theme-text">{r.home}</p>
            <p className="h-full text-center theme-text flex items-center justify-center">{r.label}</p>
            <p className="h-full px-3 rounded text-center flex items-center justify-end bg-brand-secondary text-white">
              {r.away}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
