import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import { FooterComp } from "../../../components/layout/Footer";
import { navigate } from "../../../lib/router/navigate";
import { ChartBarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import {
  getBasketballMatchDetail,
  getBasketballMatchPlayByPlay,
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



// Stat Row Component - Unique Design with Progress Bars
interface StatRowProps {
  label: string;
  teamAValue: string;
  teamBValue: string;
  teamAPercentage: number;
  teamBPercentage: number;
  teamAColor: string;
  teamBColor: string;
}

const StatRow: React.FC<StatRowProps> = ({
  label,
  teamAValue,
  teamBValue,
  teamAPercentage,
  teamBPercentage,
  teamAColor,
  teamBColor,
}) => {
  const colorClassesA = {
    green: "bg-gradient-to-r from-green-400 to-green-500",
    blue: "bg-gradient-to-r from-blue-400 to-blue-500",
  };

  const colorClassesB = {
    green: "bg-gradient-to-l from-green-400 to-green-500",
    blue: "bg-gradient-to-l from-blue-400 to-blue-500",
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold theme-text uppercase tracking-wider">
          {label}
        </span>
      </div>

      {/* Progress Bars & Values */}
      <div className="flex items-center gap-4">
        {/* Left Team */}
        <div className="flex-1 flex flex-col items-end gap-1">
          <span className="text-sm font-bold theme-text">{teamAValue}</span>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${colorClassesA[teamAColor as keyof typeof colorClassesA]} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${teamAPercentage}%` }}
            />
          </div>
        </div>

        {/* Right Team */}
        <div className="flex-1 flex flex-col items-start gap-1">
          <span className="text-sm font-bold theme-text">{teamBValue}</span>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${colorClassesB[teamBColor as keyof typeof colorClassesB]} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${teamBPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Rebound Bar Component - Enhanced Visual Design
interface ReboundBarProps {
  label: string;
  teamAValue: number;
  teamBValue: number;
  teamAColor: string;
  teamBColor: string;
}

const ReboundBar: React.FC<ReboundBarProps> = ({
  label,
  teamAValue,
  teamBValue,
  teamAColor,
  teamBColor,
}) => {
  const total = teamAValue + teamBValue;
  const aPercentage = total > 0 ? (teamAValue / total) * 100 : 50;
  
  const colorClassesA = {
    green: "bg-gradient-to-r from-green-400 to-green-500",
    blue: "bg-gradient-to-r from-blue-400 to-blue-500",
  };

  const colorClassesB = {
    green: "bg-gradient-to-l from-green-400 to-green-500",
    blue: "bg-gradient-to-l from-blue-400 to-blue-500",
  };

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold theme-text uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md">
            Home: {teamAValue}
          </span>
          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
            Away: {teamBValue}
          </span>
        </div>
      </div>
      <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <div className="absolute inset-0 flex">
          <div
            className={`h-full ${colorClassesA[teamAColor as keyof typeof colorClassesA]} transition-all duration-700 ease-out shadow-lg`}
            style={{ width: `${aPercentage}%` }}
          />
          <div
            className={`h-full ${colorClassesB[teamBColor as keyof typeof colorClassesB]} transition-all duration-700 ease-out shadow-lg`}
            style={{ width: `${100 - aPercentage}%` }}
          />
        </div>
        {/* Center marker */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/50 dark:bg-black/30 transform -translate-x-1/2" />
      </div>
      <div className="flex justify-between text-xs font-semibold theme-text opacity-60">
        <span>{aPercentage.toFixed(1)}%</span>
        <span>{(100 - aPercentage).toFixed(1)}%</span>
      </div>
    </div>
  );
};

// Quarter Section Component - Enhanced Play-by-Play Timeline
interface QuarterSectionProps {
  period: number;
  homeScore: number;
  awayScore: number;
  events: PlayByPlayEvent[];
  isExpanded: boolean;
  onToggle: () => void;
}

const QuarterSection: React.FC<QuarterSectionProps> = ({
  period,
  homeScore,
  awayScore,
  events,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="border-b border-snow-200 dark:border-[#1F2937] last:border-0">
      {/* Quarter Header - Collapsible */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold theme-text uppercase tracking-wider bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            Q{period}
          </span>
          <span className="text-sm font-bold theme-text">
            {homeScore} - {awayScore}
          </span>
        </div>
        <svg
          className={`w-5 h-5 theme-text transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Events List */}
      {isExpanded && (
        <div className="px-5 pb-4 space-y-2 animate-fadeIn">
          {events.map((event) => {
            // Determine which team the event belongs to
            const isHomeEvent = event.team_id.toString() !== event.away_score.toString();
            
            return (
              <div
                key={event._id}
                className={`flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                  isHomeEvent ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Left Side (Home Team Events) */}
                <div className={`flex-1 ${isHomeEvent ? "text-right" : "text-left"}`}>
                  {isHomeEvent ? (
                    <>
                      {/* Time */}
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                        {event.time}
                      </span>
                      {/* Player Name */}
                      {event.player_name && (
                        <p className="text-sm font-medium theme-text leading-tight mb-0.5">
                          {event.player_name}
                        </p>
                      )}
                      {/* Action Description */}
                      <p className="text-xs theme-text opacity-60 leading-tight">
                        {event.event_description}
                      </p>
                    </>
                  ) : (
                    <div className="h-full" />
                  )}
                </div>

                {/* Center - Score */}
                <div className="flex flex-col items-center px-4 min-w-[100px]">
                  {/* Points Indicator */}
                  {event.points_scored && (
                    <span className={`text-[10px] font-black mb-0.5 px-1.5 py-0.5 rounded-full ${
                      isHomeEvent 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    }`}>
                      +{event.points_scored}
                    </span>
                  )}
                  {/* Score */}
                  <span className="text-base font-black theme-text tabular-nums">
                    {event.home_score} - {event.away_score}
                  </span>
                </div>

                {/* Right Side (Away Team Events) */}
                <div className={`flex-1 ${!isHomeEvent ? "text-right" : "text-left"}`}>
                  {!isHomeEvent ? (
                    <>
                      {/* Time */}
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                        {event.time}
                      </span>
                      {/* Player Name */}
                      {event.player_name && (
                        <p className="text-sm font-medium theme-text leading-tight mb-0.5">
                          {event.player_name}
                        </p>
                      )}
                      {/* Action Description */}
                      <p className="text-xs theme-text opacity-60 leading-tight">
                        {event.event_description}
                      </p>
                    </>
                  ) : (
                    <div className="h-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

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

interface MatchStats {
  teamA: {
    freeThrowsMade: number;
    freeThrowsAttempted: number;
    twoPointsMade: number;
    twoPointsAttempted: number;
    threePointsMade: number;
    threePointsAttempted: number;
    fieldGoalsMade: number;
    fieldGoalsAttempted: number;
    rebounds: number;
    assists: number;
    turnovers: number;
    steals: number;
    blocks: number;
  };
  teamB: {
    freeThrowsMade: number;
    freeThrowsAttempted: number;
    twoPointsMade: number;
    twoPointsAttempted: number;
    threePointsMade: number;
    threePointsAttempted: number;
    fieldGoalsMade: number;
    fieldGoalsAttempted: number;
    rebounds: number;
    assists: number;
    turnovers: number;
    steals: number;
    blocks: number;
  };
}

interface PlayByPlayEvent {
  _id: string;
  match_id: number;
  period: number;
  time: string;
  team_id: number;
  player_name?: string;
  event_type: string;
  event_description: string;
  points_scored?: number;
  assist_player?: string;
  home_score: number;
  away_score: number;
}

interface QuarterGroup {
  period: number;
  events: PlayByPlayEvent[];
  homeScore: number;
  awayScore: number;
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
  const tabs = [
    { id: "stats", label: "Stats", icon: ChartBarIcon },
    { id: "timeline", label: "Timeline", icon: ChartBarIcon },
    { id: "info", label: "Info", icon: ChartBarIcon },
  ];

  const [activeTab, setActiveTab] = useState("stats");
  const [matchData, setMatchData] = useState<MatchDetail | null>(null);
  const [playByPlay, setPlayByPlay] = useState<PlayByPlayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuarter, setSelectedQuarter] = useState<string>("ALL");
  const [expandedQuarters, setExpandedQuarters] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const { matchId } = useParams<{ matchId: string }>();

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!matchId) return;

      setLoading(true);
      try {
        const detailResponse = await getBasketballMatchDetail(matchId);
        const pbpResponse = await getBasketballMatchPlayByPlay(matchId);

        if (detailResponse.success && detailResponse.responseObject) {
          setMatchData(detailResponse.responseObject.item);
        }

        if (pbpResponse.success && pbpResponse.responseObject) {
          setPlayByPlay(pbpResponse.responseObject.item || []);
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

  // Toggle quarter expansion
  const toggleQuarter = (period: number) => {
    setExpandedQuarters((prev) => ({
      ...prev,
      [period]: !prev[period],
    }));
  };

  // Group play-by-play events by quarter
  const groupEventsByQuarter = (): QuarterGroup[] => {
    const quarters: Record<number, QuarterGroup> = {};
    
    playByPlay.forEach((event) => {
      const period = event.period;
      if (!quarters[period]) {
        quarters[period] = {
          period,
          events: [],
          homeScore: 0,
          awayScore: 0,
        };
      }
      quarters[period].events.push(event);
      // Track final scores for each quarter
      if (quarters[period].events.length > 0) {
        const lastEvent = quarters[period].events[quarters[period].events.length - 1];
        quarters[period].homeScore = lastEvent.home_score;
        quarters[period].awayScore = lastEvent.away_score;
      }
    });

    return Object.values(quarters).sort((a, b) => a.period - b.period);
  };

  const groupedEvents = groupEventsByQuarter();

  // Calculate stats percentages
  const calculatePercentage = (made: number, attempted: number) => {
    if (attempted === 0) return 0;
    return Math.round((made / attempted) * 100);
  };

  // Mock stats data (replace with actual API call when available)
  const mockStats: MatchStats = {
    teamA: {
      freeThrowsMade: 22,
      freeThrowsAttempted: 29,
      twoPointsMade: 35,
      twoPointsAttempted: 58,
      threePointsMade: 12,
      threePointsAttempted: 32,
      fieldGoalsMade: 47,
      fieldGoalsAttempted: 90,
      rebounds: 45,
      assists: 28,
      turnovers: 12,
      steals: 8,
      blocks: 5,
    },
    teamB: {
      freeThrowsMade: 18,
      freeThrowsAttempted: 23,
      twoPointsMade: 32,
      twoPointsAttempted: 55,
      threePointsMade: 10,
      threePointsAttempted: 28,
      fieldGoalsMade: 42,
      fieldGoalsAttempted: 83,
      rebounds: 42,
      assists: 25,
      turnovers: 15,
      steals: 6,
      blocks: 7,
    },
  };

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
        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Quarter Filter */}
            <div className="flex justify-center gap-2">
              {["ALL", "Q1", "Q2", "Q3", "Q4"].map((quarter) => (
                <button
                  key={quarter}
                  onClick={() => setSelectedQuarter(quarter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedQuarter === quarter
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {quarter}
                </button>
              ))}
            </div>

            {/* Stats Comparison Panel */}
            <div className="block-style !p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
                <h3 className="font-bold theme-text uppercase text-xs tracking-wider">
                  Team Statistics
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Free Throws */}
                <StatRow
                  label="Free throws"
                  teamAValue={`${mockStats.teamA.freeThrowsMade}/${mockStats.teamA.freeThrowsAttempted}`}
                  teamBValue={`${mockStats.teamB.freeThrowsMade}/${mockStats.teamB.freeThrowsAttempted}`}
                  teamAPercentage={calculatePercentage(mockStats.teamA.freeThrowsMade, mockStats.teamA.freeThrowsAttempted)}
                  teamBPercentage={calculatePercentage(mockStats.teamB.freeThrowsMade, mockStats.teamB.freeThrowsAttempted)}
                  teamAColor="green"
                  teamBColor="blue"
                />

                {/* 2 Pointers */}
                <StatRow
                  label="2 pointers"
                  teamAValue={`${mockStats.teamA.twoPointsMade}/${mockStats.teamA.twoPointsAttempted}`}
                  teamBValue={`${mockStats.teamB.twoPointsMade}/${mockStats.teamB.twoPointsAttempted}`}
                  teamAPercentage={calculatePercentage(mockStats.teamA.twoPointsMade, mockStats.teamA.twoPointsAttempted)}
                  teamBPercentage={calculatePercentage(mockStats.teamB.twoPointsMade, mockStats.teamB.twoPointsAttempted)}
                  teamAColor="green"
                  teamBColor="blue"
                />

                {/* 3 Pointers */}
                <StatRow
                  label="3 pointers"
                  teamAValue={`${mockStats.teamA.threePointsMade}/${mockStats.teamA.threePointsAttempted}`}
                  teamBValue={`${mockStats.teamB.threePointsMade}/${mockStats.teamB.threePointsAttempted}`}
                  teamAPercentage={calculatePercentage(mockStats.teamA.threePointsMade, mockStats.teamA.threePointsAttempted)}
                  teamBPercentage={calculatePercentage(mockStats.teamB.threePointsMade, mockStats.teamB.threePointsAttempted)}
                  teamAColor="green"
                  teamBColor="blue"
                />

                {/* Field Goals */}
                <StatRow
                  label="Field goals"
                  teamAValue={`${mockStats.teamA.fieldGoalsMade}/${mockStats.teamA.fieldGoalsAttempted}`}
                  teamBValue={`${mockStats.teamB.fieldGoalsMade}/${mockStats.teamB.fieldGoalsAttempted}`}
                  teamAPercentage={calculatePercentage(mockStats.teamA.fieldGoalsMade, mockStats.teamA.fieldGoalsAttempted)}
                  teamBPercentage={calculatePercentage(mockStats.teamB.fieldGoalsMade, mockStats.teamB.fieldGoalsAttempted)}
                  teamAColor="green"
                  teamBColor="blue"
                />

                {/* Rebounds - Special Bar */}
                <ReboundBar
                  label="Rebounds"
                  teamAValue={mockStats.teamA.rebounds}
                  teamBValue={mockStats.teamB.rebounds}
                  teamAColor="green"
                  teamBColor="blue"
                />

                {/* Assists */}
                <StatRow
                  label="Assists"
                  teamAValue={mockStats.teamA.assists.toString()}
                  teamBValue={mockStats.teamB.assists.toString()}
                  teamAPercentage={calculatePercentage(mockStats.teamA.assists, mockStats.teamA.assists + mockStats.teamB.assists)}
                  teamBPercentage={calculatePercentage(mockStats.teamB.assists, mockStats.teamA.assists + mockStats.teamB.assists)}
                  teamAColor="green"
                  teamBColor="blue"
                />

                {/* Turnovers */}
                <StatRow
                  label="Turnovers"
                  teamAValue={mockStats.teamA.turnovers.toString()}
                  teamBValue={mockStats.teamB.turnovers.toString()}
                  teamAPercentage={calculatePercentage(mockStats.teamA.turnovers, mockStats.teamA.turnovers + mockStats.teamB.turnovers)}
                  teamBPercentage={calculatePercentage(mockStats.teamB.turnovers, mockStats.teamA.turnovers + mockStats.teamB.turnovers)}
                  teamAColor="green"
                  teamBColor="blue"
                />

                {/* Steals */}
                <StatRow
                  label="Steals"
                  teamAValue={mockStats.teamA.steals.toString()}
                  teamBValue={mockStats.teamB.steals.toString()}
                  teamAPercentage={calculatePercentage(mockStats.teamA.steals, mockStats.teamA.steals + mockStats.teamB.steals)}
                  teamBPercentage={calculatePercentage(mockStats.teamB.steals, mockStats.teamA.steals + mockStats.teamB.steals)}
                  teamAColor="green"
                  teamBColor="blue"
                />

                {/* Blocks */}
                <StatRow
                  label="Blocks"
                  teamAValue={mockStats.teamA.blocks.toString()}
                  teamBValue={mockStats.teamB.blocks.toString()}
                  teamAPercentage={calculatePercentage(mockStats.teamA.blocks, mockStats.teamA.blocks + mockStats.teamB.blocks)}
                  teamBPercentage={calculatePercentage(mockStats.teamB.blocks, mockStats.teamA.blocks + mockStats.teamB.blocks)}
                  teamAColor="green"
                  teamBColor="blue"
                />
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <div className="block-style !p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
                <h3 className="font-bold theme-text uppercase text-xs tracking-wider">
                  Play by Play
                </h3>
              </div>
              <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                {groupedEvents.map((quarter) => (
                  <QuarterSection
                    key={quarter.period}
                    period={quarter.period}
                    homeScore={quarter.homeScore}
                    awayScore={quarter.awayScore}
                    events={quarter.events}
                    isExpanded={expandedQuarters[quarter.period] || false}
                    onToggle={() => toggleQuarter(quarter.period)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
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
