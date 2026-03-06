import { useEffect, useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import { FooterComp } from "../../../components/layout/Footer";
import { navigate } from "../../../lib/router/navigate";
import { ChartBarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import {
  getBasketballMatchDetail,
} from "@/lib/api/basketball/index";
import { useParams } from "react-router-dom";
import GetBasketballTeamLogo from "@/components/common/GetBasketballTeamLogo";

// Shimmer skeleton loader component with sleek animation
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-snow-200 dark:bg-[#1F2937] rounded ${className}`}
    style={{ minHeight: "1em" }}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
  </div>
);

// Skeleton for the match header section
const MatchHeaderSkeleton = () => (
  <div className="relative isolate overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white">
    {/* Themed strip background */}
    <div
      className="absolute blur-sm inset-0 pointer-events-none z-0 opacity-50"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px)",
      }}
    />
    <div className="page-padding-x py-6 relative z-[2]">
      {/* Back button skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-5 bg-white/30" />
        <Skeleton className="h-4 w-12 bg-white/30" />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="grid grid-cols-3 items-start gap-2">
          {/* Home Team */}
          <div className="min-w-0 flex flex-col items-center">
            <div className="h-12 w-12 shrink-0 bg-white/30 rounded-full flex items-center justify-center overflow-hidden border border-white/20">
              <Skeleton className="h-8 w-8 bg-white/30" />
            </div>
            <Skeleton className="mt-1 h-4 w-16 bg-white/30" />
          </div>

          {/* Center Status */}
          <div className="flex justify-center">
            <Skeleton className="h-5 w-14 bg-white/30 rounded" />
          </div>

          {/* Away Team */}
          <div className="min-w-0 flex flex-col items-center">
            <div className="h-12 w-12 shrink-0 bg-white/30 rounded-full flex items-center justify-center overflow-hidden border border-white/20">
              <Skeleton className="h-8 w-8 bg-white/30" />
            </div>
            <Skeleton className="mt-1 h-4 w-16 bg-white/30" />
          </div>
        </div>

        {/* Mobile Score */}
        <div className="mt-2 flex justify-center items-center gap-3">
          <Skeleton className="h-12 w-10 bg-white/30" />
          <Skeleton className="h-8 w-4 bg-white/30" />
          <Skeleton className="h-12 w-10 bg-white/30" />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex-1 text-center flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/30 rounded-full flex items-center justify-center mb-3 overflow-hidden border border-white/20">
            <Skeleton className="h-12 w-12 md:h-16 md:w-16 bg-white/30" />
          </div>
          <Skeleton className="h-6 w-28 bg-white/30" />
          <Skeleton className="mt-2 h-10 w-12 bg-white/30" />
        </div>

        <div className="flex flex-col items-center px-6">
          <Skeleton className="h-6 w-16 bg-white/30 rounded-full" />
          <Skeleton className="mt-2 h-4 w-10 bg-white/30" />
        </div>

        <div className="flex-1 text-center flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/30 rounded-full flex items-center justify-center mb-3 overflow-hidden border border-white/20">
            <Skeleton className="h-12 w-12 md:h-16 md:w-16 bg-white/30" />
          </div>
          <Skeleton className="h-6 w-28 bg-white/30" />
          <Skeleton className="mt-2 h-10 w-12 bg-white/30" />
        </div>
      </div>

      {/* League Info */}
      <div className="flex justify-center mt-4">
        <Skeleton className="h-4 w-40 bg-white/30" />
      </div>
    </div>
  </div>
);

// Skeleton for the tab bar
const TabBarSkeleton = () => (
  <div className="flex h-12 w-full bg-brand-p3/30 dark:bg-brand-p2 backdrop-blur-2xl sticky top-0">
    <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0">
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

// Skeleton for the info tab content
const InfoTabSkeleton = () => (
  <div className="page-padding-x my-8">
    <div className="space-y-6">
      {/* Score Summary Table */}
      <div className="block-style !p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-3">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-5 w-8" />
              </div>
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-3">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-5 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stadium Info */}
      <div className="block-style">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-1 h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main skeleton for the match detail page
const BasketballMatchDetailSkeleton = () => (
  <div className="min-h-screen dark:bg-[#0D1117]">
    <PageHeader />
    <MatchHeaderSkeleton />
    <TabBarSkeleton />
    <InfoTabSkeleton />
    <FooterComp />
  </div>
);

interface Team {
  id: string | number;
  team_id?: string | number;
  name: string;
  totalscore: string | number;
  q1: string | number;
  q2: string | number;
  q3: string | number;
  q4: string | number;
  ot: string | number;
  logo?: string;
  image_path?: string;
  possession?: boolean;
  team_fouls?: number;
  timeouts_left?: number;
}

interface MatchDetail {
  _id: string;
  match_id: number;
  localteam: Team;
  awayteam: Team;
  status: string;
  period?: string;
  timer?: string;
  league_name: string;
  league_id?: number;
  venue?: string;
  date?: string;
  time?: string;
  season?: string;
  stage?: string;
}

const BasketballMatchDetail = () => {
  const tabs = [{ id: "info", label: "Info", icon: ChartBarIcon }];

  const [activeTab, setActiveTab] = useState("info");
  const [matchData, setMatchData] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const { matchId } = useParams<{ matchId: string }>();

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!matchId) return;

      setLoading(true);
      try {
        const detailResponse = await getBasketballMatchDetail(matchId);

        if (detailResponse.success && detailResponse.responseObject) {
          setMatchData(detailResponse.responseObject.item);
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();

    // Auto-refresh for live matches every 15 seconds
    const isLive =
      matchData?.status?.toLowerCase().includes("quarter") ||
      matchData?.period?.toLowerCase().includes("quarter");
    const interval = isLive ? setInterval(fetchMatchData, 15000) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [matchId]);

  // Get scores - show actual score or empty string for scheduled games
  const homeScore = matchData?.localteam?.totalscore || "";
  const awayScore = matchData?.awayteam?.totalscore || "";

  // Check if we have scores to display
  const hasScores = homeScore !== "" && awayScore !== "";

  // Format date and time for display
  const formatMatchDateTime = () => {
    if (!matchData?.date) return null;
    const dateObj = new Date(matchData.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const formattedTime = matchData.time || dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return { date: formattedDate, time: formattedTime };
  };

  const matchDateTime = formatMatchDateTime();

  // Helper to display score or "-"
  const displayQuarter = (value: string | number | undefined) => {
    if (value === "" || value === undefined || value === null) return "-";
    return String(value);
  };

  if (loading) {
    return <BasketballMatchDetailSkeleton />;
  }

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />

      {/* Match Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white">
        {/* Themed strip background */}
        <div
          className="absolute blur-sm inset-0 pointer-events-none z-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--gameinfo-stripe-color) 0px, var(--gameinfo-stripe-color) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px)",
          }}
        />

       

        <div className="page-padding-x py-6 relative z-[2]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Mobile Layout - 3 column grid like football */}
          <div className="md:hidden">
            <div className="grid grid-cols-3 items-start gap-2">
              {/* Home Team */}
              <div className="min-w-0 flex flex-col items-center">
                <div className="h-12 w-12 shrink-0 bg-white rounded-full flex items-center justify-center overflow-hidden border border-white/20">
                  <GetBasketballTeamLogo
                    teamId={matchData?.localteam?.team_id || matchData?.localteam?.id}
                    alt={matchData?.localteam.name}
                    className="h-8 w-8 object-contain"
                    width={32}
                    height={32}
                  />
                </div>
                <p className="mt-1 w-full truncate text-[13px] font-semibold text-center">
                  {matchData?.localteam.name || "Home Team"}
                </p>
              </div>

              {/* Center Status */}
              <div className="flex justify-center">
                <span className="shrink-0 text-[11px] font-bold  bg-snow-100 text-brand-secondary px-2 py-0.5 rounded">
                  {hasScores ? (matchData?.period || matchData?.status || "VS") : (matchData?.time || matchData?.status || "Scheduled")}
                </span>
              </div>

              {/* Away Team */}
              <div className="min-w-0 flex flex-col items-center">
                <div className="h-12 w-12 shrink-0 bg-white rounded-full flex items-center justify-center overflow-hidden border border-white/20">
                  <GetBasketballTeamLogo
                    teamId={matchData?.awayteam?.team_id || matchData?.awayteam?.id}
                    alt={matchData?.awayteam.name}
                    className="h-8 w-8 object-contain"
                    width={32}
                    height={32}
                  />
                </div>
                <p className="mt-1 w-full truncate text-[13px] font-semibold text-center">
                  {matchData?.awayteam.name || "Away Team"}
                </p>
              </div>
            </div>

            {/* Mobile Score or Scheduled Time */}
            <div className="mt-2 flex flex-col items-center">
              {!hasScores ? (
                <div className="flex flex-col items-center">
                  {matchDateTime ? (
                    <>
                      <div className="flex items-center gap-2 text-white/90">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold">{matchDateTime.date}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-sm font-semibold">Match Scheduled</span>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex justify-center items-center gap-3 font-bold leading-none tabular-nums text-[46px]">
                    <p className="leading-none">{homeScore}</p>
                    <p className="text-[32px] leading-none">-</p>
                    <p className="leading-none">{awayScore}</p>
                  </div>
                  {matchData?.timer && (
                    <p className="mt-1 text-[11px] opacity-90">{matchData.timer}'</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex-1 text-center flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mb-3 overflow-hidden border border-white/20">
                <GetBasketballTeamLogo
                  teamId={matchData?.localteam?.team_id || matchData?.localteam?.id}
                  alt={matchData?.localteam.name}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                  width={64}
                  height={64}
                />
              </div>
              <p className="font-semibold text-lg md:text-xl mb-1">
                {matchData?.localteam.name || "Home Team"}
              </p>
              {!!hasScores && (
                <p className="text-3xl md:text-5xl font-bold">{homeScore}</p>
              )}
            </div>

            <div className="flex flex-col items-center px-6">
              <span className="text-xs mb-1 font-bold uppercase tracking-widest bg-snow-100 text-brand-secondary px-3 py-1 rounded-full">
                {!hasScores ? (matchData?.time || "Scheduled") : (matchData?.period || matchData?.status || "VS")}
              </span>
              {!hasScores ? (
                <div className="flex flex-col items-center mt-2">
                  {matchDateTime ? (
                    <>
                      <div className="flex items-center gap-2 text-white/90">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold">{matchDateTime.date}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-sm font-semibold">Match Scheduled</span>
                  )}
                </div>
              ) : (
                matchData?.timer && (
                  <span className="text-sm font-bold mt-2">
                    {matchData.timer}'
                  </span>
                )
              )}
            </div>

            <div className="flex-1 text-center flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mb-3 overflow-hidden border border-white/20">
                <GetBasketballTeamLogo
                  teamId={matchData?.awayteam?.team_id || matchData?.awayteam?.id}
                  alt={matchData?.awayteam.name}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                  width={64}
                  height={64}
                />
              </div>
              <p className="font-semibold text-lg md:text-xl mb-1">
                {matchData?.awayteam.name || "Away Team"}
              </p>
              {!!hasScores && (
                <p className="text-3xl md:text-5xl font-bold">{awayScore}</p>
              )}
            </div>
          </div>

          {/* League Info with Logo, Season and Location - Bottom Center */}
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col items-center gap-1 mt-4 text-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">
                {matchData?.league_name || "Basketball Match"}
                {matchData?.season ? `, ${matchData.season}` : ""}
              </span>
            </div>
            {matchData?.venue && (
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-3 h-3 opacity-70" />
                <span className="text-[11px] opacity-90">{matchData.venue}</span>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-center gap-2 mt-4 text-center">
            <span className="text-sm font-medium">
              {matchData?.league_name || "Basketball Match"}
              {matchData?.season ? `, ${matchData.season}` : ""}
            </span>
            {matchData?.venue && (
              <>
                <span className="text-sm opacity-70">•</span>
                <span className="text-sm opacity-90">{matchData.venue}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex z-10 h-12 w-full overflow-y-hidden overflow-x-auto bg-brand-p3/30 dark:bg-brand-p2 backdrop-blur-2xl sticky top-0 hide-scrollbar">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex items-center gap-2 flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-orange-500 font-medium border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="page-padding-x my-8">
        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* Score Summary Table */}
            <div className="block-style !p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
                <h3 className="font-bold theme-text uppercase text-xs tracking-wider">
                  {!hasScores ? "Match Info" : "Score Summary"}
                </h3>
              </div>
              {!hasScores ? (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Match info not available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs theme-text uppercase opacity-70 border-b border-snow-200 dark:border-[#1F2937]">
                      <tr>
                        <th className="px-6 py-3 font-medium">Team</th>
                        <th className="px-4 py-3 text-center">Q1</th>
                        <th className="px-4 py-3 text-center">Q2</th>
                        <th className="px-4 py-3 text-center">Q3</th>
                        <th className="px-4 py-3 text-center">Q4</th>
                        <th className="px-4 py-3 text-center font-bold text-brand-primary">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                      <tr className="theme-text">
                        <td className="px-6 py-4 font-semibold">
                          {matchData?.localteam.name || "Home Team"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {displayQuarter(matchData?.localteam?.q1)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {displayQuarter(matchData?.localteam?.q2)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {displayQuarter(matchData?.localteam?.q3)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {displayQuarter(matchData?.localteam?.q4)}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-brand-primary">
                          {displayQuarter(matchData?.localteam?.totalscore)}
                        </td>
                      </tr>
                      <tr className="theme-text">
                        <td className="px-6 py-4 font-semibold">
                          {matchData?.awayteam.name || "Away Team"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {displayQuarter(matchData?.awayteam?.q1)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {displayQuarter(matchData?.awayteam?.q2)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {displayQuarter(matchData?.awayteam?.q3)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {displayQuarter(matchData?.awayteam?.q4)}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-brand-primary">
                          {displayQuarter(matchData?.awayteam?.totalscore)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Stadium Info */}
            {matchData?.venue && (
              <div className="block-style">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-brand-primary/10 text-brand-primary">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs theme-text opacity-70 uppercase font-semibold">
                      Stadium
                    </p>
                    <p className="text-sm font-bold theme-text">
                      {matchData.venue}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <FooterComp />
    </div>
  );
};

export default BasketballMatchDetail;
