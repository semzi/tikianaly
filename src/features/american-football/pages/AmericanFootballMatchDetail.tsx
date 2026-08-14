import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChartBarIcon,
  ClockIcon,
  InformationCircleIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import AmericanFootballMatchOverview from "../components/AmericanFootballMatchOverview";
import AmericanFootballMatchStatistics from "../components/AmericanFootballMatchStatistics";
import AmericanFootballStandings from "../components/AmericanFootballStandings";
import { teamInitials } from "../statUtils";
import {
  type AmericanFootballMatch,
} from "../data/mockAmericanFootball";
import {
  getAmericanFootballFixtureById,
  getAmericanFootballPlayByPlay,
  normalizeAmericanFootballMatchDetail,
  normalizeAmericanFootballTimeline,
} from "@/lib/api/american-football";

type MatchTab = "overview" | "stats" | "timeline" | "info" | "standings";
type MatchLocationState = { match?: AmericanFootballMatch };

const splitScore = (score: string) => {
  const [home = "-", away = "-"] = String(score || "- -").split("-");
  return [home.trim() || "-", away.trim() || "-"] as const;
};

const quarterTotal = (values: (string | number)[]) =>
  values.reduce<number>((sum, v) => {
    const n = typeof v === "number" ? v : parseInt(String(v), 10);
    return Number.isFinite(n) ? sum + n : sum;
  }, 0);

const QuarterScoreBox = ({ match }: { match: AmericanFootballMatch }) => {
  const placeholder: [string, string, string, string] = ["-", "-", "-", "-"];
  const home = match.quarters?.home ?? placeholder;
  const away = match.quarters?.away ?? placeholder;
  const hasData = Boolean(match.quarters);

  return (
    <div className="bg-black/30 rounded-xl px-3 py-2.5 backdrop-blur-sm">
      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1.5">
        Qtr Score
      </p>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-white/60">
            <th className="font-medium w-6"></th>
            <th className="font-medium px-1.5">Q1</th>
            <th className="font-medium px-1.5">Q2</th>
            <th className="font-medium px-1.5">Q3</th>
            <th className="font-medium px-1.5">Q4</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-white">
            <td className="text-[9px] uppercase font-semibold text-white/60">
              Home
            </td>
            {home.map((q, i) => (
              <td key={i} className="text-center font-bold px-1.5 py-0.5">
                {q}
              </td>
            ))}
          </tr>
          <tr className="text-white">
            <td className="text-[9px] uppercase font-semibold text-white/60">
              Away
            </td>
            {away.map((q, i) => (
              <td key={i} className="text-center font-bold px-1.5 py-0.5">
                {q}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {hasData ? (
        <p className="text-center text-[10px] font-bold text-white/80 mt-1">
          Tot {quarterTotal(home)} - {quarterTotal(away)}
        </p>
      ) : null}
    </div>
  );
};

const AmericanFootballMatchDetail = () => {
  const { matchId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<MatchTab>("overview");
  const state = (location.state as MatchLocationState | undefined) ?? {};

  const detailQuery = useQuery({
    queryKey: ["american-football", "match", matchId],
    enabled: Boolean(matchId),
    queryFn: async () =>
      normalizeAmericanFootballMatchDetail(
        await getAmericanFootballFixtureById(String(matchId)),
      ),
    staleTime: 20_000,
    refetchInterval: 20_000,
  });

  const playByPlayQuery = useQuery({
    queryKey: ["american-football", "match", matchId, "play-by-play"],
    enabled: Boolean(matchId) && activeTab === "timeline",
    queryFn: async () =>
      normalizeAmericanFootballTimeline(
        await getAmericanFootballPlayByPlay(String(matchId)),
      ),
    staleTime: 20_000,
    refetchInterval: 20_000,
  });

  const match = useMemo<AmericanFootballMatch>(() => {
    return (
      detailQuery.data ??
      state.match ?? {
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
    { id: "overview" as MatchTab, label: "Overview", icon: Squares2X2Icon },
    { id: "stats" as MatchTab, label: "Stats", icon: ChartBarIcon },
    { id: "timeline" as MatchTab, label: "Timeline", icon: ClockIcon },
    { id: "info" as MatchTab, label: "Info", icon: InformationCircleIcon },
    { id: "standings" as MatchTab, label: "Standings", icon: TableCellsIcon },
  ];

  const fallbackTimelineRows = isLive
    ? [
        {
          time: "Q1",
          event: `${match.homeTeam} opened the scoring.`,
          side: "home",
        },
        {
          time: "Q2",
          event: `${match.awayTeam} answered with a touchdown drive.`,
          side: "away",
        },
        {
          time: match.clock,
          event: `${match.period} — ${match.highlight}`,
          side: "neutral",
        },
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

      <section className="relative isolate overflow-hidden bg-brand-primary text-white">
        <div
          className="absolute blur-sm inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--gameinfo-stripe-color) 0px, var(--gameinfo-stripe-color) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px)",
          }}
        />
        <div className="relative z-[2] page-padding-x pt-10 pb-16 md:pt-14 md:pb-20">
          {/* Toolbar - back | status | (actions) */}
          <div className="relative px-3 grid grid-cols-3 items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex gap-4 items-center w-fit cursor-pointer text-left"
            >
              <ArrowLeftIcon className="text-white h-5" />
              <p className="text-white hidden md:block">Back</p>
            </button>
            <div className="bg-brand-secondary font-semibold text-white py-1.5 px-4 rounded w-fit mx-auto hidden md:block">
              {isLive ? "Live" : match.status}
            </div>
            <div className="flex justify-end" />
          </div>

          {/* Mobile hero - football-style, quarter box below the score */}
          <div className="md:hidden px-3 mt-2 text-white">
            <div className="grid grid-cols-3 items-start gap-2">
              <div className="min-w-0 flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-white/90 text-neutral-700 flex items-center justify-center text-xs font-bold">
                  {teamInitials(match.homeTeam)}
                </div>
                <p className="mt-1 w-full truncate text-[13px] font-semibold text-center">
                  {match.homeTeam}
                </p>
              </div>
              <div className="flex justify-center">
                <p className="shrink-0 text-[11px] bg-brand-secondary px-2 py-0.5 rounded">
                  {isLive ? "Live" : match.status}
                </p>
              </div>
              <div className="min-w-0 flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-white/90 text-neutral-700 flex items-center justify-center text-xs font-bold">
                  {teamInitials(match.awayTeam)}
                </div>
                <p className="mt-1 w-full truncate text-[13px] font-semibold text-center">
                  {match.awayTeam}
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-col items-center">
              <div className="flex justify-center items-center gap-3 leading-none tabular-nums tall-font text-[56px]">
                <p className="leading-none">{homeScore}</p>
                <p className="text-[32px] leading-none">-</p>
                <p className="leading-none">{awayScore}</p>
              </div>
              <p className="mt-1 text-[11px] text-white/90">
                {match.league}
                {isLive ? ` • ${match.period}` : ""}
              </p>
            </div>
            <div className="mt-3 flex justify-center">
              <QuarterScoreBox match={match} />
            </div>
          </div>

          {/* Desktop hero - football-style, quarter box inline */}
          <div className="hidden md:grid md:mt-5 mb-5 px-3 grid-cols-3 items-start text-white">
            <div className="flex flex-col items-center md:items-end">
              <div className="h-12 w-12 rounded-full bg-white/90 text-neutral-700 flex items-center justify-center text-base font-bold">
                {teamInitials(match.homeTeam)}
              </div>
              <p className="mt-2 text-[20px] font-light text-center md:text-right">
                {match.homeTeam}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex text-[56px] md:text-[80px] tall-font justify-center items-center gap-3 leading-none tabular-nums">
                <p className="leading-none">{homeScore}</p>
                <p>-</p>
                <p className="leading-none">{awayScore}</p>
              </div>
              <p className="mt-1 text-sm text-white/90">
                {match.league}
                {isLive ? ` • ${match.period}` : ""}
              </p>
              <div className="mt-3">
                <QuarterScoreBox match={match} />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="h-12 w-12 rounded-full bg-white/90 text-neutral-700 flex items-center justify-center text-base font-bold">
                {teamInitials(match.awayTeam)}
              </div>
              <p className="mt-2 text-[20px] font-light text-center md:text-left">
                {match.awayTeam}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex h-12 w-full overflow-x-auto bg-brand-p3/30 dark:bg-gray-800 backdrop-blur-2xl sticky top-0 z-20 hide-scrollbar">
        <div className="flex md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0 md:mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 flex items-center gap-1 ${activeTab === tab.id ? "text-orange-500 font-medium border-b-2 border-orange-500" : "text-gray-600 hover:text-gray-800 dark:text-gray-800 dark:hover:text-gray-900"}`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="page-padding-x my-8">
        {activeTab === "overview" ? (
          <AmericanFootballMatchOverview match={match} isLive={isLive} />
        ) : null}

        {activeTab === "stats" ? (
          <div className="block-style !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
              <p className="font-bold uppercase text-sm theme-text tracking-wide">
                American Football Match Statistics
              </p>
            </div>
            <div className="p-5">
              <AmericanFootballMatchStatistics
                stats={match.stats}
                homeTeamName={match.homeTeam}
                awayTeamName={match.awayTeam}
              />
            </div>
          </div>
        ) : null}

        {activeTab === "timeline" ? (
          <div className="block-style !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
              <p className="font-bold uppercase text-sm theme-text tracking-wide">
                Game Timeline
              </p>
            </div>
            <div className="p-5 space-y-3">
              {timelineRows.map((row, index) => (
                <div
                  key={`${row.time}-${index}`}
                  className="flex items-start gap-3 rounded-lg border border-snow-200 dark:border-[#1F2937] p-3"
                >
                  <div className="w-16 text-xs font-bold text-neutral-n4 dark:text-snow-200">
                    {row.time}
                  </div>
                  <div
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${row.side === "home" ? "bg-green-500" : row.side === "away" ? "bg-blue-500" : "bg-brand-secondary"}`}
                  />
                  <p className="text-sm theme-text">{row.event}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "info" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="block-style">
              <p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 dark:text-snow-200 mb-2">
                League
              </p>
              <p className="text-lg font-semibold theme-text">{match.league}</p>
              <p className="text-sm text-neutral-n4 dark:text-snow-200 mt-1">
                Status: {match.status}{" "}
                {isLive ? `• ${match.period}, ${match.clock}` : ""}
              </p>
            </div>
            <div className="block-style">
              <p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 dark:text-snow-200 mb-2">
                Game Details
              </p>
              <p className="text-sm theme-text">Venue: {match.venue}</p>
              <p className="text-sm theme-text">Kickoff: {match.kickoff}</p>
              {match.matchInfo?.referee ? (
                <p className="text-sm theme-text">
                  Referee: {match.matchInfo.referee}
                </p>
              ) : null}
              {match.matchInfo?.attendance ? (
                <p className="text-sm theme-text">
                  Attendance: {match.matchInfo.attendance}
                </p>
              ) : null}
              {match.matchInfo?.weather ? (
                <p className="text-sm theme-text">
                  Weather: {match.matchInfo.weather}
                </p>
              ) : null}
              {match.matchInfo?.surface ? (
                <p className="text-sm theme-text">
                  Surface: {match.matchInfo.surface}
                </p>
              ) : null}
              <p className="text-sm theme-text">Game ID: {match.id}</p>
            </div>
            <div className="block-style md:col-span-2">
              <p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 dark:text-snow-200 mb-2">
                Preview
              </p>
              <p className="text-sm theme-text">{match.highlight}</p>
            </div>
          </div>
        ) : null}

        {activeTab === "standings" ? (
          <div className="block-style !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
              <p className="font-bold uppercase text-sm theme-text tracking-wide">
                League Standings
              </p>
            </div>
            <div className="p-5">
              <AmericanFootballStandings
                league={match.league}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
              />
            </div>
          </div>
        ) : null}
      </div>
      <FooterComp />
    </div>
  );
};

export default AmericanFootballMatchDetail;
