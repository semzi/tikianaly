import { useMemo, type ReactNode } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import type { AmericanFootballMatch } from "../data/mockAmericanFootball";
import { teamInitials, toNumeric } from "../statUtils";

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 dark:text-snow-200 mb-4">
    {children}
  </p>
);

/** Stats the mini bars show (first 4 meaningful, excluding TOP + efficiency). */
const buildMiniStats = (stats?: AmericanFootballMatch["stats"]) =>
  (stats ?? [])
    .filter((row) => !/time of possession|efficiency/i.test(row.label))
    .slice(0, 4)
    .map((row) => {
      const homeVal = toNumeric(row.home);
      const awayVal = toNumeric(row.away);
      const total = homeVal + awayVal;
      const homePct = total > 0 ? Math.round((homeVal / total) * 100) : 50;
      return {
        label: row.label,
        home: String(row.home),
        away: String(row.away),
        homePct,
        awayPct: total > 0 ? 100 - homePct : 50,
      };
    });

/** Cumulative score per quarter for the game-flow line chart. */
const buildFlow = (
  quarters?: AmericanFootballMatch["quarters"],
): { name: string; home: number; away: number }[] => {
  if (!quarters) return [];
  const placeholder = (v: unknown) => {
    const s = String(v ?? "-").trim();
    return s === "-" || s === "";
  };
  const series: { name: string; home: number; away: number }[] = [];
  let home = 0;
  let away = 0;
  for (let i = 0; i < 4; i++) {
    const homeRaw = quarters.home[i];
    const awayRaw = quarters.away[i];
    if (placeholder(homeRaw) && placeholder(awayRaw)) break;
    home += toNumeric(homeRaw);
    away += toNumeric(awayRaw);
    series.push({ name: `Q${i + 1}`, home, away });
  }
  return series;
};

const AmericanFootballMatchOverview = ({
  match,
  isLive,
}: {
  match: AmericanFootballMatch;
  isLive: boolean;
}) => {
  const miniStats = useMemo(() => buildMiniStats(match.stats), [match.stats]);
  const flow = useMemo(() => buildFlow(match.quarters), [match.quarters]);

  // Match leaders — team-level, sourced from the stats we have. Player-level
  // data can slot in here once the backend ships per-player stat lines.
  const leaders = useMemo(() => {
    const rows = match.stats ?? [];
    const pick = (pattern: RegExp) =>
      rows.find((row) => pattern.test(row.label));
    const toCard = (category: string, pattern: RegExp) => {
      const row = pick(pattern);
      if (!row) return null;
      const homeVal = toNumeric(row.home);
      const awayVal = toNumeric(row.away);
      const leader =
        homeVal === awayVal ? ("none" as const) : homeVal > awayVal ? ("home" as const) : ("away" as const);
      return {
        category,
        home: String(row.home),
        away: String(row.away),
        leader,
      };
    };
    return [
      toCard("Passing Yards", /passing/i),
      toCard("Rushing Yards", /rushing/i),
      toCard("First Downs", /first downs/i),
    ].filter((card): card is NonNullable<typeof card> => card !== null);
  }, [match.stats]);

  const lastEvent = useMemo(
    () => (match.timeline?.length ? match.timeline[match.timeline.length - 1] : undefined),
    [match.timeline],
  );

  const statusText = isLive
    ? `${match.period}${match.clock && match.clock !== "--" ? ` · ${match.clock}` : ""}`
    : match.status;

  return (
    <div className="space-y-6">
      {/* Row 1 — condensed stats bars + live game flow chart */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="block-style">
          <SectionTitle>Team Stats</SectionTitle>
          {miniStats.length ? (
            <div className="space-y-4">
              {miniStats.map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <span className="text-sm font-bold theme-text tabular-nums">
                      {row.home}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-neutral-n4 dark:text-snow-200">
                      {row.label}
                    </span>
                    <span className="text-sm font-bold theme-text tabular-nums">
                      {row.away}
                    </span>
                  </div>
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-snow-200 dark:bg-white/10">
                    <div
                      className="bg-brand-primary"
                      style={{ width: `${row.homePct}%` }}
                    />
                    <div
                      className="bg-brand-secondary"
                      style={{ width: `${row.awayPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-n4 dark:text-snow-200">
              Team statistics will appear when the game begins.
            </p>
          )}
        </div>

        <div className="block-style">
          <SectionTitle>Game Flow</SectionTitle>
          {flow.length > 1 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={flow} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.25)" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#161B22",
                    border: "1px solid #1F2937",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="home" name={match.homeTeam} stroke="#0056d2" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="away" name={match.awayTeam} stroke="#FF4500" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-neutral-n4 dark:text-snow-200">
              Score progression will appear once the game starts.
            </p>
          )}
        </div>
      </div>

      {/* Row 2 — match leaders */}
      <div className="block-style">
        <SectionTitle>Top Performers</SectionTitle>
        {leaders.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {leaders.map((card) => (
              <div
                key={card.category}
                className="rounded-xl border border-snow-200 dark:border-[#1F2937] p-3"
              >
                <p className="text-[11px] uppercase font-bold tracking-wide text-neutral-n4 dark:text-snow-200 mb-3">
                  {card.category}
                </p>
                {[
                  { side: "home" as const, team: match.homeTeam, value: card.home },
                  { side: "away" as const, team: match.awayTeam, value: card.away },
                ].map((entry) => (
                  <div
                    key={entry.side}
                    className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 ${
                      card.leader === entry.side ? "bg-brand-secondary/10" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="h-6 w-6 rounded-full bg-snow-200 dark:bg-white/10 flex items-center justify-center text-[9px] font-bold text-neutral-n4 dark:text-snow-200 shrink-0">
                        {teamInitials(entry.team)}
                      </span>
                      <span className="truncate text-sm font-medium theme-text">
                        {entry.team}
                      </span>
                    </span>
                    <span className="text-sm font-bold theme-text tabular-nums">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-n4 dark:text-snow-200">
            Match leaders will appear when the game begins.
          </p>
        )}
      </div>

      {/* Row 3 — last play + game info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="block-style">
          <SectionTitle>Last Play</SectionTitle>
          {lastEvent ? (
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                  lastEvent.side === "home"
                    ? "bg-green-500"
                    : lastEvent.side === "away"
                      ? "bg-blue-500"
                      : "bg-brand-secondary"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm theme-text">{lastEvent.event}</p>
                <p className="text-xs text-neutral-n4 dark:text-snow-200 mt-1">{lastEvent.time}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold theme-text tabular-nums">
                  {match.score}
                </p>
                <p className="text-xs text-neutral-n4 dark:text-snow-200">{statusText}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-n4 dark:text-snow-200">
              {match.highlight || "No plays recorded yet."}
            </p>
          )}
        </div>

        <div className="block-style">
          <SectionTitle>Game Info</SectionTitle>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TrophyIcon className="h-4 w-4 text-neutral-n4 dark:text-snow-200 shrink-0" />
              <span className="text-xs uppercase tracking-wide text-neutral-n4 dark:text-snow-200 w-20">
                League
              </span>
              <span className="text-sm font-semibold theme-text">
                {match.league}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDaysIcon className="h-4 w-4 text-neutral-n4 dark:text-snow-200 shrink-0" />
              <span className="text-xs uppercase tracking-wide text-neutral-n4 dark:text-snow-200 w-20">
                Kickoff
              </span>
              <span className="text-sm font-semibold theme-text">
                {match.kickoff}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-4 w-4 text-neutral-n4 dark:text-snow-200 shrink-0" />
              <span className="text-xs uppercase tracking-wide text-neutral-n4 dark:text-snow-200 w-20">
                Venue
              </span>
              <span className="text-sm font-semibold theme-text">
                {match.venue}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ClockIcon className="h-4 w-4 text-neutral-n4 dark:text-snow-200 shrink-0" />
              <span className="text-xs uppercase tracking-wide text-neutral-n4 dark:text-snow-200 w-20">
                Status
              </span>
              <span className="text-sm font-semibold theme-text">
                {statusText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmericanFootballMatchOverview;
