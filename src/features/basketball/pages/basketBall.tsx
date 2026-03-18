import { useEffect, useState, useMemo } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import { FooterComp } from "../../../components/layout/Footer";
import { navigate } from "../../../lib/router/navigate";
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import {
  getBasketballFixturesByDate,
  getLiveBasketballMatches,
} from "@/lib/api/endpoints";
import { BasketballLeftBar } from "../components/BasketballLeftBar";
import Category from "@/features/dashboard/components/Category";
import { subDays, addDays, isToday, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  subscribeBasketballLiveMatchesStream,
  closeBasketballLiveStream,
} from "@/lib/api/basketball/livestream";
import DatePicker from "react-datepicker";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import GetBasketballTeamLogo from "@/components/common/GetBasketballTeamLogo";
import RightBar from "@/components/layout/RightBar";

// Shimmer skeleton loader component with sleek animation
const Skeleton = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden bg-snow-200 dark:bg-[#1F2937] rounded ${className}`}
    style={{ minHeight: "1em" }}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
  </div>
);

// Skeleton for a league group header
const SkeletonLeagueHeader = () => (
  <div className="flex gap-3 border-b px-5 py-3 border-snow-200 dark:border-[#1F2937]">
    <Skeleton className="h-6 w-6 rounded" />
    <Skeleton className="h-5 w-32" />
    <Skeleton className="h-5 w-5 ml-auto" />
  </div>
);

// Skeleton for a match row (desktop)
const SkeletonMatchRow = () => (
  <div className="hidden md:flex items-center gap-4 px-5 py-4">
    {/* Status */}
    <Skeleton className="h-4 w-12" />
    {/* Teams and Scores */}
    <div className="flex-1 flex items-center gap-4">
      {/* Home Team */}
      <div className="flex-1 flex items-center justify-end gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      {/* Scores */}
      <div className="w-20 flex justify-center gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      {/* Away Team */}
      <div className="flex-1 flex items-center justify-start gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    {/* Favorite */}
    <Skeleton className="h-6 w-6 rounded-full" />
  </div>
);

// Skeleton for a match row (mobile)
const SkeletonMatchRowMobile = () => (
  <div className="flex md:hidden items-center justify-between px-3 py-3">
    <div className="flex flex-1 items-center">
      <Skeleton className="h-4 w-10" />
      <div className="flex-1 flex flex-col gap-2 mx-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-5 w-5 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </div>
    </div>
    <Skeleton className="h-6 w-6 rounded-full" />
  </div>
);

// Skeleton for a full league group with matches
const SkeletonLeagueGroup = ({ matchCount = 3 }: { matchCount?: number }) => (
  <div className="block-style !p-0 overflow-hidden">
    <SkeletonLeagueHeader />
    <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
      {Array.from({ length: matchCount }).map((_, i) => (
        <div key={i}>
          <SkeletonMatchRow />
          <SkeletonMatchRowMobile />
        </div>
      ))}
    </div>
  </div>
);

// Main skeleton for the dashboard loading state
const BasketballDashboardSkeleton = () => (
  <div className="flex flex-col gap-y-4">
    {/* Control bar skeleton */}
    <div className="block-style flex flex-col gap-4">
      <div className="relative flex items-center justify-between dark:text-snow-200">
        <Skeleton className="h-5 w-5" />
        <div className="flex gap-3 items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-5" />
        </div>
        <Skeleton className="h-5 w-5" />
      </div>
      <div className="relative flex w-full bg-snow-200 dark:bg-[#1F2937] rounded-full p-1 h-9">
        <Skeleton className="h-7 w-1/3 rounded-full bg-brand-secondary/50" />
      </div>
    </div>
    {/* League groups skeleton */}
    <SkeletonLeagueGroup matchCount={3} />
    <SkeletonLeagueGroup matchCount={2} />
    <SkeletonLeagueGroup matchCount={4} />
  </div>
);

interface Team {
  id: number;
  team_id?: number;
  name: string;
  totalscore: string | number;
  q1: string | number;
  q2: string | number;
  q3: string | number;
  q4: string | number;
  ot: string | number;
}

interface Match {
  id?: string;
  _id?: string;
  match_id: number;
  localteam: Team;
  awayteam: Team;
  status: string;
  period?: string;
  timer?: string;
  date?: string;
  time?: string;
  league_name: string;
  league_id: number;
  venue?: string;
  season?: string;
  stage?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  responseObject: {
    items: Match[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  statusCode: number;
}

const BasketballPage = () => {
  const [activeTab, setActiveTab] = useState("fixture");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReturnToTodayCollapsed, setIsReturnToTodayCollapsed] = useState(false);

  // SSE & Live Override state
  const [liveMatches, setLiveMatches] = useState<Record<number, Match>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const tabs = useMemo(() => {
    let dateLabel = "Fixture";
    if (selectedDate) {
      if (isToday(selectedDate)) {
        dateLabel = "Today";
      } else {
        dateLabel = format(selectedDate, "MMM d");
      }
    }
    return [
      { id: "live", label: "Live" },
      { id: "fixture", label: dateLabel },
    ];
  }, [selectedDate]);

  // Fetch data with React Query
  const fetchMatchesData = async () => {
    if (activeTab === "live") {
      try {
        return (await getLiveBasketballMatches(currentPage)) as ApiResponse;
      } catch (err) {
        console.error("Error fetching live basketball matches:", err);
        return null;
      }
    }

    const formattedDate = selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : "";

    try {
      const data = (await getBasketballFixturesByDate(
        formattedDate,
        currentPage,
      )) as ApiResponse;
      return data;
    } catch (err) {
      console.error("Error fetching basketball matches:", err);
      return null;
    }
  };

  const {
    data: queryData,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery({
    queryKey: [
      "basketball-matches",
      activeTab,
      currentPage,
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
    ],
    queryFn: fetchMatchesData,
    staleTime: 5 * 60 * 1000,
  });

  // Auto-switch to fixtures tab when date is not today
  useEffect(() => {
    try {
      if (!isToday(selectedDate ?? new Date())) {
        setActiveTab("fixture");
      }
    } catch {
      // ignore date comparison errors
    }
  }, [selectedDate]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowReturnToToday = useMemo(() => {
    if (activeTab !== "fixture") return false;
    try {
      return !isToday(selectedDate ?? new Date());
    } catch {
      return false;
    }
  }, [activeTab, selectedDate]);

  useEffect(() => {
    if (!shouldShowReturnToToday) return;
    if (!isMobile) {
      setIsReturnToTodayCollapsed(false);
      return;
    }
    setIsReturnToTodayCollapsed(false);
    const t = window.setTimeout(() => setIsReturnToTodayCollapsed(true), 5000);
    return () => window.clearTimeout(t);
  }, [shouldShowReturnToToday, isMobile]);

  // Sync state with React Query response (pagination and loading only)
  useEffect(() => {
    if (isQueryLoading && Object.keys(liveMatches).length === 0) {
      setLoading(true);
    } else if (!isQueryFetching) {
      setLoading(false);
    }

    if (queryData && queryData.success && queryData.responseObject) {
      setTotalPages(queryData.responseObject.totalPages || 1);
      setHasNextPage(queryData.responseObject.hasNextPage || false);
      setHasPreviousPage(queryData.responseObject.hasPreviousPage || false);
    }
  }, [queryData, isQueryLoading, isQueryFetching]);

  // Combine query data and SSE updates
  const matches = useMemo(() => {
    const baseItems = queryData?.responseObject?.items || [];
    const merged = [...baseItems];

    // Apply filters first if needed, or filter later
    // Let's filter the final list

    // 1. Update/Overwite baseItems with liveMatches
    const finalItems = merged.map((m) => {
      if (liveMatches[m.match_id]) {
        return { ...m, ...liveMatches[m.match_id] };
      }
      return m;
    });

    // 2. Add live matches that aren't in the base items (if it's today)
    if (
      activeTab === "live" &&
      isToday(selectedDate || new Date())
    ) {
      Object.values(liveMatches).forEach((liveMatch) => {
        const alreadyExists = finalItems.some(
          (m) => m.match_id === liveMatch.match_id,
        );
        if (!alreadyExists) {
          if (activeTab === "live" && liveMatch) {
            finalItems.push(liveMatch);
          }
        }
      });
    }

    // 3. Final filter by league
    let filteredItems = finalItems;
    if (selectedLeagueId) {
      filteredItems = filteredItems.filter(
        (m: Match) => !m.league_id || m.league_id === selectedLeagueId,
      );
    }

    // 4. If viewing "live" tab, only show matches that are actually live
    if (activeTab === "live") {
      filteredItems = filteredItems.filter((m) => {
        const s = (m.status || "").toLowerCase();
        return (
          s.includes("quarter") ||
          s.includes("half") ||
          s.includes("overtime") ||
          s.includes("live")
        );
      });
    }

    return filteredItems;
  }, [queryData, liveMatches, activeTab, selectedLeagueId, selectedDate]);

  // Handle SSE for Live matches
  useEffect(() => {
    if (activeTab === "live") {
      const eventSource = subscribeBasketballLiveMatchesStream({
        onUpdate: (fixtures) => {
          if (fixtures && fixtures.length > 0) {
            setLiveMatches((prev) => {
              const next = { ...prev };
              fixtures.forEach((m) => {
                next[m.match_id] = m;
              });
              return next;
            });
          }
        },
        onError: (err) => {
          console.error("Live SSE Error:", err);
        },
      });

      return () => closeBasketballLiveStream(eventSource);
    }
  }, [activeTab]); // Only restart on tab change if needed, but keeping it simple

  // Reset to page 1 when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Reset live overrides when changing date (unless it's today)
  useEffect(() => {
    setCurrentPage(1);
    if (selectedDate && !isToday(selectedDate)) {
      setLiveMatches({});
    }
  }, [selectedDate, selectedLeagueId]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const groupMatchesByLeague = (matchList: Match[]) => {
    const grouped: Record<
      string,
      { leagueName: string; leagueId: number | string; items: Match[] }
    > = {};
    matchList.forEach((match) => {
      const lid = match.league_id || match.league_name || "unknown";
      if (!grouped[lid]) {
        grouped[lid] = {
          leagueName: match.league_name || "Unknown League",
          leagueId: match.league_id || lid,
          items: [],
        };
      }
      grouped[lid].items.push(match);
    });

    // Sort items within each league: Live > Upcoming > Finished
    Object.values(grouped).forEach((group) => {
      group.items.sort((a, b) => {
        const getPriority = (m: Match) => {
          const status = (m.status || "").toLowerCase();
          // Live priorities
          if (
            status.includes("quarter") ||
            status.includes("half") ||
            status.includes("overtime") ||
            status.includes("live")
          )
            return 1;
          // Upcoming priorities
          if (status.includes("not started") || status === "ns") return 2;
          // Finished priorities
          if (
            status.includes("finished") ||
            status === "ft" ||
            status === "aot"
          )
            return 3;
          return 4;
        };

        const priorityA = getPriority(a);
        const priorityB = getPriority(b);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // Within same priority, sort by time/date
        const dateA = a.date || "";
        const dateB = b.date || "";
        if (dateA !== dateB) {
          return (dateA || "").localeCompare(dateB || "");
        }
        const timeA = a.time || "00:00";
        const timeB = b.time || "00:00";
        return (timeA || "").localeCompare(timeB || "");
      });
    });

    return Object.values(grouped);
  };

  const groupedMatches = useMemo(
    () => groupMatchesByLeague(matches),
    [matches],
  );

  console.log("groupedMatches", groupedMatches);

  const getStatusDisplay = (match: Match) => {
    const rawStatus = match.status || "";
    const status = rawStatus.toLowerCase();
    const isLive =
      status.includes("quarter") ||
      status.includes("half") ||
      status.includes("overtime") ||
      status.includes("live");

    if (isLive) {
      return {
        text: `${match.period || rawStatus || "Live"}`,
        subtext: match.timer ? `${match.timer}'` : "",
        isLive: true,
      };
    } else if (
      status.includes("finished") ||
      status === "ft" ||
      status === "aot"
    ) {
      return {
        text: "FT",
        subtext: "",
        isLive: false,
      };
    } else {
      // Show only time for upcoming matches
      return {
        text: match.time || "TBD",
        subtext: "",
        isLive: false,
      };
    }
  };

  const hasScores = (match: Match) => {
    return (
      match?.localteam?.totalscore !== undefined &&
      match?.localteam?.totalscore !== "" &&
      match?.awayteam?.totalscore !== undefined &&
      match?.awayteam?.totalscore !== ""
    );
  };

  return (
    <div className="transition-all min-h-screen dark:bg-[#0D1117]">
      <PageHeader />
      <Category />

      <div className="flex page-padding-x gap-5 py-5 justify-around">
        {/* Left Sidebar */}
        <section className="h-full pb-30 overflow-y-auto hide-scrollbar w-1/5 hidden lg:block pr-2">
          <BasketballLeftBar
            onSelectLeague={setSelectedLeagueId}
            selectedLeagueId={selectedLeagueId}
          />
        </section>

        {/* Main Content Area */}
        <div className="w-full pb-30 flex flex-col gap-y-3 md:gap-y-5 lg:w-3/5 h-full overflow-y-auto hide-scrollbar pr-2">
          {/* Controls */}
          <div className="block-style flex flex-col gap-4">
            {/* Date Navigation */}
            <div className="relative flex items-center justify-between dark:text-snow-200">
              <ArrowLeftIcon
                className="h-5 w-5 transition-colors text-neutral-n4 cursor-pointer hover:text-brand-secondary"
                onClick={() => {
                  setSelectedDate((prev) => subDays(prev || new Date(), 1));
                }}
              />
              <div
                className="flex gap-3 items-center cursor-pointer hover:text-brand-secondary"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <p className="font-semibold theme-text">
                  {selectedDate && isToday(selectedDate)
                    ? "Today"
                    : selectedDate
                      ? format(selectedDate, "EEE, MMM d, yyyy")
                      : "Select Date"}
                </p>
                <CalendarIcon className="h-5 w-5 text-neutral-n4" />
              </div>
              <ArrowRightIcon
                className="h-5 w-5 transition-colors text-neutral-n4 cursor-pointer hover:text-brand-secondary"
                onClick={() => {
                  setSelectedDate((prev) => addDays(prev || new Date(), 1));
                }}
              />
              {showDatePicker && (
                <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                    inline
                  />
                </div>
              )}
            </div>

            {/* Pill Tabs */}
            <div className="relative flex w-full bg-snow-200 dark:bg-[#1F2937] rounded-full p-1">
              {/* Sliding indicator */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-brand-secondary transition-all duration-300 ease-in-out"
                style={{
                  width: `calc(${100 / tabs.length}% - 4px)`,
                  left: `calc(${tabs.findIndex((t) => t.id === activeTab) * (100 / tabs.length)}% + 2px)`,
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Matches */}
          <div className="flex flex-col gap-y-4">
            {loading ? (
              <BasketballDashboardSkeleton />
            ) : groupedMatches.length > 0 ? (
              groupedMatches.map((group) => (
                <div
                  key={group.leagueId}
                  className="block-style !p-0 overflow-hidden"
                >
                  {/* League Header */}
                  <div className="flex gap-3 border-b px-5 py-3 border-snow-200 dark:border-[#1F2937] bg-gradient-to-r from-brand-primary/0 via-transparent to-orange-500/10 dark:from-brand-primary/20 dark:to-orange-500/20">
                    <GetLeagueLogo
                      leagueId={group.leagueId}
                      alt={group.leagueName}
                      className="w-6 h-6 object-contain"
                    />
                    <p className="font-[500] text-[#23272A] dark:text-neutral-m6 text-[14px] md:text-base">
                      {group.leagueName}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/basketball/league/${group.leagueId}`)
                      }
                      className="ml-auto text-brand-secondary hover:opacity-80"
                      aria-label="Open league profile"
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* League Matches */}
                  <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                    {group.items.map((match) => {
                      const status = getStatusDisplay(match);
                      const showScores = hasScores(match);
                      const matchUniqueId = (
                        match._id ||
                        match.id ||
                        String(match.match_id)
                      ).toString();

                      return (
                        <div
                          key={matchUniqueId}
                          className="hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors dark:border-[#1F2937] border-snow-200/70 last:border-b-0"
                        >
                          {/* Desktop Layout - Horizontal */}
                          <div
                            className="hidden md:flex items-center gap-4 px-5 py-4 cursor-pointer"
                            onClick={() =>
                              navigate(`/basketball/match/${match.match_id}`)
                            }
                          >
                            {/* Time/Status - Styled box for upcoming games */}
                            {status.isLive || status.text === "FT" ? (
                              <div className="w-12 text-center">
                                <p
                                  className={`text-xs font-bolder ${
                                    status.isLive
                                      ? "text-red-500 animate-pulse"
                                      : "theme-text "
                                  }`}
                                >
                                  {status.text}
                                </p>
                              </div>
                            ) : (
                              <div className="w-12 text-center">
                                <p className="theme-text opacity-70 text-xs font-bold">
                                  {status.text}
                                </p>
                              </div>
                            )}

                            {/* Teams and Scores */}
                            <div className="flex-1 flex items-center gap-4">
                              {/* Home Team */}
                              <div className="flex-1 flex items-center justify-end gap-2">
                                <span className="text-sm font-medium theme-text">
                                  {match?.localteam?.name || "Unknown"}
                                </span>
                                <GetBasketballTeamLogo
                                  teamId={match?.localteam?.team_id || match?.localteam?.id}
                                  alt={match?.localteam?.name}
                                  className="w-5 h-5 object-contain"
                                  width={20}
                                  height={20}
                                />
                              </div>

                              {/* Scores */}
                              <div className="w-20 flex justify-center gap-3">
                                <span className="font-bold text-sm theme-text neutral-n1 whitespace-nowrap text-center py-0.5 px-2 text-xs dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">
                                  {showScores ? match?.localteam?.totalscore : "-"}
                                </span>
                                <span className="font-bold text-sm theme-text neutral-n1 whitespace-nowrap text-center py-0.5 px-2 text-xs dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">
                                  {showScores ? match?.awayteam?.totalscore : "-"}
                                </span>
                              </div>

                              {/* Away Team */}
                              <div className="flex-1 flex items-center justify-start gap-2">
                                <GetBasketballTeamLogo
                                  teamId={match?.awayteam?.team_id || match?.awayteam?.id}
                                  alt={match?.awayteam?.name}
                                  className="w-5 h-5 object-contain"
                                  width={20}
                                  height={20}
                                />
                                <span className="text-sm font-medium theme-text">
                                  {match?.awayteam?.name || "Unknown"}
                                </span>
                              </div>
                            </div>

                            {/* Favorite Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(matchUniqueId);
                              }}
                              className={`p-1.5 rounded-full transition-all ${
                                favorites[matchUniqueId]
                                  ? "bg-brand-primary text-white scale-110 shadow-md"
                                  : "text-neutral-n4 hover:bg-snow-200 dark:hover:bg-white/10"
                              }`}
                            >
                              <StarIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Mobile Layout - Stacked */}
                          <div className="flex md:hidden items-center justify-between px-3 py-3">
                            <div
                              className="flex flex-1 items-center cursor-pointer"
                              onClick={() =>
                                navigate(`/basketball/match/${match.match_id}`)
                              }
                            >
                              {/* Status */}
                              <div className="w-12 text-center">
                                <p
                                  className={`text-xs font-bold ${
                                    status.isLive
                                      ? "text-red-500 animate-pulse"
                                      : "theme-text opacity-70"
                                  }`}
                                >
                                  {status.text}
                                </p>
                              </div>

                              {/* Teams Column */}
                              <div className="flex-1 flex flex-col gap-2 mx-2">
                                {/* Home Team */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <GetBasketballTeamLogo
                                      teamId={match?.localteam?.team_id || match?.localteam?.id}
                                      alt={match?.localteam?.name}
                                      className="w-5 h-5 object-contain"
                                      width={20}
                                      height={20}
                                    />
                                    <span className="text-sm font-medium theme-text">
                                      {match?.localteam?.name || "Unknown"}
                                    </span>
                                  </div>
                                  <span className="font-bold text-sm theme-text neutral-n1 whitespace-nowrap text-center py-0.5 px-2 text-xs dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">
                                    {showScores ? match?.localteam?.totalscore : "-"}
                                  </span>
                                </div>

                                {/* Away Team */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <GetBasketballTeamLogo
                                      teamId={match?.awayteam?.team_id || match?.awayteam?.id}
                                      alt={match?.awayteam?.name}
                                      className="w-5 h-5 object-contain"
                                      width={20}
                                      height={20}
                                    />
                                    <span className="text-sm font-medium theme-text">
                                      {match?.awayteam?.name || "Unknown"}
                                    </span>
                                  </div>
                                  <span className="font-bold text-sm theme-text neutral-n1 whitespace-nowrap text-center py-0.5 px-2 text-xs dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">
                                    {showScores ? match?.awayteam?.totalscore : "-"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Favorite Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(matchUniqueId);
                              }}
                              className={`p-2 rounded transition-all ${
                                favorites[matchUniqueId]
                                  ? "bg-brand-primary text-white"
                                  : "text-neutral-n4 hover:bg-snow-200 dark:hover:bg-white/10"
                              }`}
                            >
                              <StarIcon className={`w-4 h-4 ${favorites[matchUniqueId] ? "fill-current" : ""}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="block-style text-center py-12">
                <div className="text-4xl mb-4">🏀</div>
                <p className="text-lg font-semibold theme-text mb-2">
                  No {activeTab} matches
                </p>
                <p className="text-sm text-neutral-n4 dark:text-snow-200">
                  {selectedLeagueId
                    ? `No matches found for the selected league and filters.`
                    : `There are no ${activeTab} matches at the moment.`}
                </p>
              </div>
            )}

            {/* Pagination (only for fixture) */}
            {activeTab === "fixture" &&
              totalPages > 1 && (
                <div className="flex items-center justify-between block-style">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={!hasPreviousPage}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                      hasPreviousPage
                        ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                        : "bg-snow-200 dark:bg-[#1F2937] text-neutral-n4 cursor-not-allowed"
                    }`}
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Previous
                  </button>

                  <span className="text-sm theme-text">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={!hasNextPage}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                      hasNextPage
                        ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                        : "bg-snow-200 dark:bg-[#1F2937] text-neutral-n4 cursor-not-allowed"
                    }`}
                  >
                    Next
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 pb-30 hidden lg:block h-full overflow-y-auto hide-scrollbar">
          <RightBar />
        </div>
      </div>

      <FooterComp />

      {shouldShowReturnToToday && (
        <div className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-50 flex justify-center px-4 pointer-events-none w-full">
          <button
            type="button"
            className={`pointer-events-auto backdrop-blur shadow-[0_0_18px_rgba(34,211,238,0.35)] dark:shadow-[0_0_22px_rgba(217,70,239,0.30)] hover:shadow-[0_0_24px_rgba(34,211,238,0.55)] dark:hover:shadow-[0_0_28px_rgba(217,70,239,0.50)] transition-shadow border border-cyan-400/40 dark:border-fuchsia-400/30 bg-white/90 dark:bg-black/40 ${
              isMobile && isReturnToTodayCollapsed
                ? "w-14 h-14 rounded-full flex items-center justify-center"
                : "w-full max-w-md rounded-2xl px-4 py-3 text-left"
            }`}
            onClick={() => {
              setSelectedDate(new Date());
              setActiveTab("fixture");
              setShowDatePicker(false);
              try {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } catch {
                // ignore
              }
            }}
          >
            {isMobile && isReturnToTodayCollapsed ? (
              <ArrowUturnLeftIcon className="h-6 w-6 text-brand-primary dark:text-white" />
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 border border-cyan-400/30 dark:border-fuchsia-400/30 flex items-center justify-center flex-shrink-0">
                  <ArrowUturnLeftIcon className="h-5 w-5 text-brand-primary dark:text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-primary dark:text-white">Return to Today</p>
                  <p className="text-xs text-neutral-n5 dark:text-snow-200 truncate">Go back to today's matches</p>
                </div>
                <div className="text-xs font-semibold text-brand-secondary dark:text-cyan-300 flex-shrink-0">
                  Open
                </div>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BasketballPage;
