import { type ReactNode } from "react";
import { ClockIcon, MapPinIcon, TrophyIcon, UserGroupIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import type { CricketMatch } from "../data/mockCricket";
type CricketMatchDetail = any; type CricketInningSummary = any;

type CricketMatchOverviewProps = {
  match: CricketMatch;
  detail: CricketMatchDetail | null;
  loading?: boolean;
};

const toShortName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3) || name.slice(0, 3).toUpperCase();

const StatCard = ({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="rounded-2xl border border-snow-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111827]">
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-brand-secondary/10 p-2 text-brand-secondary">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-[#23272A] dark:text-white">{value}</p>
        {hint ? <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p> : null}
      </div>
    </div>
  </div>
);

const formatTopBatter = (inning: CricketInningSummary) => {
  const batter = [...inning.batters].sort((a, b) => b.runs - a.runs || b.balls - a.balls)[0];
  if (!batter) return "No batting data";
  return `${batter.name} ${batter.runs}(${batter.balls})`;
};

const formatTopBowler = (inning: CricketInningSummary) => {
  const bowler = [...inning.bowlers].sort((a, b) => b.wickets - a.wickets || a.runs - b.runs)[0];
  if (!bowler) return "No bowling data";
  return `${bowler.name} ${bowler.wickets}/${bowler.runs}`;
};

const CricketMatchOverview = ({ match, detail, loading = false }: CricketMatchOverviewProps) => {
  if (loading && !detail) {
    return (
      <div className="block-style !p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
          <p className="font-semibold text-[#23272A] dark:text-white">Match Overview</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Loading live cricket data...</p>
        </div>
        <div className="p-5 space-y-4 animate-pulse">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-20 rounded-2xl bg-snow-100 dark:bg-white/5" />
            ))}
          </div>
          <div className="h-24 rounded-2xl bg-snow-100 dark:bg-white/5" />
          <div className="h-24 rounded-2xl bg-snow-100 dark:bg-white/5" />
        </div>
      </div>
    );
  }

  const homeTeam = detail?.homeTeam ?? match.homeTeam;
  const awayTeam = detail?.awayTeam ?? match.awayTeam;
  const innings = detail?.innings ?? [];
  const wickets = detail?.wickets ?? [];
  const commentaries = detail?.commentaries ?? [];
  const localLineup = detail?.lineups.localTeam ?? [];
  const visitorLineup = detail?.lineups.visitorTeam ?? [];
  const latestCommentary = commentaries.slice(0, 3);
  const latestWickets = wickets.slice(0, 3);
  const totalPlayers = localLineup.length + visitorLineup.length;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)]">
      <section className="block-style !p-0 overflow-hidden">
        <div className="border-b border-snow-200 px-5 py-4 dark:border-[#1F2937]">
          <p className="font-semibold text-[#23272A] dark:text-white">Match Overview</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real data from the cricket match-by-id endpoint
          </p>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCard icon={<TrophyIcon className="h-4 w-4" />} label="Status" value={detail?.status ?? match.status} hint={`${detail?.format ?? match.format} match`} />
          <StatCard icon={<MapPinIcon className="h-4 w-4" />} label="Venue" value={detail?.venue ?? match.venue} hint={detail?.seriesId ? `Series ${detail.seriesId}` : match.league} />
          <StatCard icon={<ClockIcon className="h-4 w-4" />} label="Date & Time" value={`${detail?.matchDate ?? match.startTime} ${detail?.matchTime ? `• ${detail.matchTime}` : ""}`.trim()} hint={detail?.matchTime ? "From the live fixture payload" : "Fallback match time"} />
          <StatCard icon={<UserGroupIcon className="h-4 w-4" />} label="Lineups" value={`${totalPlayers} players listed`} hint={`${localLineup.length} home, ${visitorLineup.length} away`} />
          <StatCard icon={<ChatBubbleLeftRightIcon className="h-4 w-4" />} label="Commentary" value={`${commentaries.length} ball-by-ball updates`} hint={latestCommentary[0]?.post || "Awaiting commentary feed"} />
          <StatCard icon={<TrophyIcon className="h-4 w-4" />} label="Wickets" value={`${wickets.length} wicket events`} hint={latestWickets[0]?.description || "No wicket trail available"} />
        </div>

        <div className="border-t border-snow-200 px-5 py-5 dark:border-[#1F2937]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#23272A] dark:text-white">Innings Breakdown</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Top performers and innings totals from the live response</p>
            </div>
            <div className="text-right text-xs text-neutral-500 dark:text-neutral-400">
              <p>{innings.length} innings loaded</p>
              <p>{detail?.result || match.result || "No result message returned"}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {(innings.length ? innings : []).map((inning: any, index: number) => {
              const topBatter = [...inning.batters].sort((a, b) => b.runs - a.runs || b.balls - a.balls)[0];
              const topBowler = [...inning.bowlers].sort((a, b) => b.wickets - a.wickets || a.runs - b.runs)[0];
              const teamShort = toShortName(inning.name);
              return (
                <article key={`${inning.teamKey}-${index}`} className="rounded-2xl border border-snow-200 bg-snow-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/10 text-sm font-black text-brand-secondary">
                        {teamShort}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#23272A] dark:text-white">{inning.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {inning.total || "No total returned"} {inning.overs ? `• ${inning.overs} overs` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="rounded-full bg-white px-2.5 py-1 dark:bg-[#0F172A]">Top batter: {topBatter ? `${topBatter.name} (${topBatter.runs})` : "N/A"}</span>
                      <span className="rounded-full bg-white px-2.5 py-1 dark:bg-[#0F172A]">Top bowler: {topBowler ? `${topBowler.name} (${topBowler.wickets})` : "N/A"}</span>
                      <span className="rounded-full bg-white px-2.5 py-1 dark:bg-[#0F172A]">Run rate: {inning.runRate || "-"}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-3 dark:bg-[#111827]">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Batting leader</p>
                      <p className="mt-1 text-sm font-semibold text-[#23272A] dark:text-white">{formatTopBatter(inning)}</p>
                    </div>
                    <div className="rounded-xl bg-white p-3 dark:bg-[#111827]">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Bowling leader</p>
                      <p className="mt-1 text-sm font-semibold text-[#23272A] dark:text-white">{formatTopBowler(inning)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
            {!innings.length ? (
              <div className="rounded-2xl border border-dashed border-snow-200 p-6 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400">
                The live match response did not include innings data yet.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <aside className="grid gap-4">
        <section className="block-style !p-0 overflow-hidden">
          <div className="border-b border-snow-200 px-5 py-4 dark:border-[#1F2937]">
            <p className="font-semibold text-[#23272A] dark:text-white">Latest Commentary</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Latest ball-by-ball updates from the endpoint</p>
          </div>
          <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
            {latestCommentary.length ? (
              latestCommentary.map((item: any) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{item.post}</span>
                    <span>{item.over ? `Over ${item.over}` : `Inning ${item.inning}`}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#23272A] dark:text-white">
                    {item.runs} runs{item.balls ? ` off ${item.balls} balls` : ""}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-5 py-4 text-sm text-neutral-500 dark:text-neutral-400">No commentary entries were returned.</div>
            )}
          </div>
        </section>

        <section className="block-style !p-0 overflow-hidden">
          <div className="border-b border-snow-200 px-5 py-4 dark:border-[#1F2937]">
            <p className="font-semibold text-[#23272A] dark:text-white">Wicket Trail</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Recent wickets from the live fixture feed</p>
          </div>
          <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
            {latestWickets.length ? (
              latestWickets.map((item: any) => (
                <div key={item.id} className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#23272A] dark:text-white">{item.description || item.post}</p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {item.runs ? `${item.runs} runs` : ""} {item.overs ? `• ${item.overs} overs` : ""} {item.wickets ? `• ${item.wickets} wickets` : ""}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-5 py-4 text-sm text-neutral-500 dark:text-neutral-400">No wicket trail was returned in this response.</div>
            )}
          </div>
        </section>

        <section className="block-style !p-0 overflow-hidden">
          <div className="border-b border-snow-200 px-5 py-4 dark:border-[#1F2937]">
            <p className="font-semibold text-[#23272A] dark:text-white">Lineup Snapshot</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Players listed in the live match response</p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-snow-200 dark:divide-[#1F2937]">
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">{homeTeam.name}</p>
              <div className="mt-3 space-y-2">
                {localLineup.slice(0, 4).map((player: any) => (
                  <div key={player.profileId || player.name} className="rounded-xl bg-snow-50 px-3 py-2 text-xs text-[#23272A] dark:bg-white/5 dark:text-white">
                    <p className="font-medium">{player.name}</p>
                    <p className="mt-0.5 text-neutral-500 dark:text-neutral-400">C {player.catches} • RO {player.runOuts} • ST {player.stumpings}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">{awayTeam.name}</p>
              <div className="mt-3 space-y-2">
                {visitorLineup.slice(0, 4).map((player: any) => (
                  <div key={player.profileId || player.name} className="rounded-xl bg-snow-50 px-3 py-2 text-xs text-[#23272A] dark:bg-white/5 dark:text-white">
                    <p className="font-medium">{player.name}</p>
                    <p className="mt-0.5 text-neutral-500 dark:text-neutral-400">C {player.catches} • RO {player.runOuts} • ST {player.stumpings}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
};

export default CricketMatchOverview;

