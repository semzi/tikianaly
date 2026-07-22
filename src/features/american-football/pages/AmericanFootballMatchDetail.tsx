import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChartBarIcon,
  ClockIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import {
  mockAmericanFootballLiveMatches,
  mockAmericanFootballUpcomingMatches,
  type AmericanFootballMatch,
} from "../data/mockAmericanFootball";
import {
  getAmericanFootballMatchDetail,
  getAmericanFootballPlayByPlay,
  isAmericanFootballApiEnabled,
  normalizeAmericanFootballMatchDetail,
  normalizeAmericanFootballTimeline,
} from "@/lib/api/american-football";

type MatchTab = "stats" | "timeline" | "info";
type MatchLocationState = { match?: AmericanFootballMatch };

const splitScore = (score: string) => {
  const [home = "-", away = "-"] = String(score || "- -").split("-");
  return [home.trim() || "-", away.trim() || "-"] as const;
};

const teamInitials = (team: string) =>
  team
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AmericanFootballMatchDetail = () => {
  const { matchId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<MatchTab>("stats");
  const state = (location.state as MatchLocationState | undefined) ?? {};

  const detailQuery = useQuery({
    queryKey: ["american-football", "match", matchId],
    enabled: isAmericanFootballApiEnabled && Boolean(matchId),
    queryFn: async () => normalizeAmericanFootballMatchDetail(await getAmericanFootballMatchDetail(String(matchId))),
    staleTime: 20_000,
    refetchInterval: 20_000,
  });

  const playByPlayQuery = useQuery({
    queryKey: ["american-football", "match", matchId, "play-by-play"],
    enabled: isAmericanFootballApiEnabled && Boolean(matchId) && activeTab === "timeline",
    queryFn: async () => normalizeAmericanFootballTimeline(await getAmericanFootballPlayByPlay(String(matchId))),
    staleTime: 20_000,
    refetchInterval: 20_000,
  });

  const match = useMemo<AmericanFootballMatch>(() => {
    const fromMock = [
      ...mockAmericanFootballLiveMatches,
      ...mockAmericanFootballUpcomingMatches,
    ].find((item) => item.id === matchId);

    return (
      detailQuery.data ??
      state.match ??
      fromMock ?? {
        id: String(matchId ?? "american-football-game"),
        league: "American Football",
        homeTeam: "Home Team",
        awayTeam: "Away Team",
        status: "Scheduled",
        period: "Preview",
        clock: "--",
        kickoff: "TBD",
        venue: "Venue TBC",
        score: "- -",
        highlight: "Match information will be available soon.",
      }
    );
  }, [detailQuery.data, matchId, state.match]);

  const [homeScore, awayScore] = splitScore(match.score);
  const isLive = match.status.toLowerCase().includes("live");
  const tabs = [
    { id: "stats" as MatchTab, label: "Stats", icon: ChartBarIcon },
    { id: "timeline" as MatchTab, label: "Timeline", icon: ClockIcon },
    { id: "info" as MatchTab, label: "Info", icon: InformationCircleIcon },
  ];

  const statsRows = match.stats?.length ? match.stats : [
    { label: "Total Yards", home: isLive ? 238 : 0, away: isLive ? 261 : 0 },
    { label: "Passing Yards", home: isLive ? 156 : 0, away: isLive ? 184 : 0 },
    { label: "Rushing Yards", home: isLive ? 82 : 0, away: isLive ? 77 : 0 },
    { label: "First Downs", home: isLive ? 14 : 0, away: isLive ? 16 : 0 },
    { label: "Time of Possession", home: isLive ? 28 : 0, away: isLive ? 32 : 0 },
  ];

  const fallbackTimelineRows = isLive
    ? [
        { time: "Q1", event: `${match.homeTeam} opened the scoring.`, side: "home" },
        { time: "Q2", event: `${match.awayTeam} answered with a touchdown drive.`, side: "away" },
        { time: match.clock, event: `${match.period} — ${match.highlight}`, side: "neutral" },
      ]
    : [
        { time: match.kickoff, event: "Kickoff scheduled.", side: "neutral" },
        { time: "Preview", event: match.highlight, side: "neutral" },
      ];
  const timelineRows = playByPlayQuery.data?.length
    ? playByPlayQuery.data
    : match.timeline?.length
      ? match.timeline
      : fallbackTimelineRows;

  return (
    <div className="min-h-screen dark:bg-[#0D1117] bg-[#f6f6f6]">
      <PageHeader />

      <section className="relative isolate overflow-hidden bg-gradient-to-r from-orange-500 via-orange-500 to-pink-600 text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px)",
          }}
        />
        <div className="page-padding-x relative z-10 py-4 md:py-6">
          <button type="button" onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm text-white/95 hover:text-white">
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </button>
          <div className="grid grid-cols-3 items-center gap-3 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-white/90 text-neutral-700 flex items-center justify-center text-base md:text-xl font-bold">{teamInitials(match.homeTeam)}</div>
              <p className="mt-2 text-sm md:text-3xl font-semibold">{match.homeTeam}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="px-3 py-1 rounded-full bg-white text-orange-600 text-xs md:text-sm font-bold uppercase tracking-wide">{isLive ? "Live" : match.status}</span>
              <p className="mt-2 text-xl md:text-5xl font-black tracking-wide">{homeScore} - {awayScore}</p>
              <p className="mt-1 text-xs md:text-base text-white/90">{match.league}{isLive ? ` • ${match.period}` : ""}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-white/90 text-neutral-700 flex items-center justify-center text-base md:text-xl font-bold">{teamInitials(match.awayTeam)}</div>
              <p className="mt-2 text-sm md:text-3xl font-semibold">{match.awayTeam}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex h-12 w-full overflow-x-auto bg-brand-p3/30 dark:bg-brand-p2 backdrop-blur-2xl sticky top-0 z-20 hide-scrollbar">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`py-2 px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 flex items-center gap-1 ${activeTab === tab.id ? "text-orange-500 font-medium border-b-2 border-orange-500" : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"}`}><Icon className="h-4 w-4" />{tab.label}</button>;
          })}
        </div>
      </div>

      <div className="page-padding-x my-8">
        {activeTab === "stats" ? <div className="block-style !p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5"><p className="font-bold uppercase text-sm theme-text tracking-wide">American Football Match Statistics</p></div>
          <div className="p-5 space-y-6">
            {statsRows.map((row) => {
              const homeValue = Number(row.home) || 0;
              const awayValue = Number(row.away) || 0;
              const total = homeValue + awayValue;
              const homeWidth = total ? (homeValue / total) * 100 : 50;
              const awayWidth = total ? (awayValue / total) * 100 : 50;
              return <div key={row.label} className="space-y-2"><div className="text-center"><span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold theme-text uppercase tracking-wider">{row.label}</span></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><div className="space-y-1"><p className="text-sm font-bold theme-text text-right">{row.home}{row.label === "Time of Possession" && isLive ? ":00" : ""}</p><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-400 to-green-500" style={{ width: `${homeWidth}%` }} /></div></div><p className="text-xs uppercase font-semibold text-neutral-n4">vs</p><div className="space-y-1"><p className="text-sm font-bold theme-text">{row.away}{row.label === "Time of Possession" && isLive ? ":00" : ""}</p><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-l from-blue-400 to-blue-500" style={{ width: `${awayWidth}%` }} /></div></div></div></div>;
            })}
            {!isLive ? <p className="rounded-xl border border-snow-200 dark:border-[#1F2937] p-4 text-sm text-neutral-n4">Team statistics will appear when the game begins.</p> : null}
          </div>
        </div> : null}

        {activeTab === "timeline" ? <div className="block-style !p-0 overflow-hidden"><div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5"><p className="font-bold uppercase text-sm theme-text tracking-wide">Game Timeline</p></div><div className="p-5 space-y-3">{timelineRows.map((row, index) => <div key={`${row.time}-${index}`} className="flex items-start gap-3 rounded-lg border border-snow-200 dark:border-[#1F2937] p-3"><div className="w-16 text-xs font-bold text-neutral-n4">{row.time}</div><div className={`mt-1 h-2.5 w-2.5 rounded-full ${row.side === "home" ? "bg-green-500" : row.side === "away" ? "bg-blue-500" : "bg-brand-secondary"}`} /><p className="text-sm theme-text">{row.event}</p></div>)}</div></div> : null}

        {activeTab === "info" ? <div className="grid gap-4 md:grid-cols-2"><div className="block-style"><p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 mb-2">League</p><p className="text-lg font-semibold theme-text">{match.league}</p><p className="text-sm text-neutral-n4 mt-1">Status: {match.status} {isLive ? `• ${match.period}, ${match.clock}` : ""}</p></div><div className="block-style"><p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 mb-2">Game Details</p><p className="text-sm theme-text">Venue: {match.venue}</p><p className="text-sm theme-text">Kickoff: {match.kickoff}</p><p className="text-sm theme-text">Game ID: {match.id}</p></div><div className="block-style md:col-span-2"><p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 mb-2">Preview</p><p className="text-sm theme-text">{match.highlight}</p></div></div> : null}
      </div>
      <FooterComp />
    </div>
  );
};

export default AmericanFootballMatchDetail;
