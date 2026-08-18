import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { navigate } from "../../../lib/router/navigate";
import {
  StarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  getBasketballFixturesByDate,
  getLiveBasketballMatches,
} from "@/lib/api/endpoints";
import { BasketballLeftBar } from "../components/BasketballLeftBar";
import { isToday, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  subscribeBasketballLiveMatchesStream,
  closeBasketballLiveStream,
} from "@/lib/api/basketball/livestream";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import GetBasketballTeamLogo from "@/components/common/GetBasketballTeamLogo";
import { SportLayout } from "@/components/layout/SportLayout";
import { FixturesDateToggle } from "@/components/ui/FixturesDateToggle";
import ReturnToToday from "@/components/ui/ReturnToToday";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.has("date") ? "fixture" : "live";
  });
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  
  const [selectedDate, _setSelectedDate] = useState<Date | null>(() => {
    try {
      const dateParam = searchParams.get("date");
      if (dateParam) {
        const d = new Date(dateParam);
        if (!Number.isNaN(d.getTime())) return d;
      }
      return new Date();
    } catch {
      return new Date();
    }
  });

  const setSelectedDate = useCallback((dateOrUpdater: Date | null | ((prev: Date | null) => Date | null)) => {
    _setSelectedDate(prev => {
      const newDate = typeof dateOrUpdater === 'function' ? dateOrUpdater(prev) : dateOrUpdater;
      
      setSearchParams(prevParams => {
        if (newDate && !isToday(newDate)) {
          prevParams.set("date", format(newDate, 'yyyy-MM-dd'));
        } else {
          prevParams.delete("date");
        }
        return prevParams;
      }, { replace: false });
      
      return newDate;
    });
  }, [setSearchParams]);

  // Sync state with URL when navigating back/forward
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const d = new Date(dateParam);
      if (!Number.isNaN(d.getTime())) {
        _setSelectedDate(d);
        setActiveTab("fixture");
        return;
      }
    }
    _setSelectedDate(new Date());
  }, [searchParams]);

  // SSE & Live Override state
  const [liveMatches, setLiveMatches] = useState<Record<number, Match>>({});

  // Infinite scroll pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [accumulatedItems, setAccumulatedItems] = useState<Match[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fixturesMode = activeTab === "live" ? "live" : "date";
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

  const shouldShowReturnToToday = useMemo(() => {
    if (activeTab !== "fixture") return false;
    try {
      return !isToday(selectedDate ?? new Date());
    } catch {
      return false;
    }
  }, [activeTab, selectedDate]);

  // Sync state with React Query response (pagination and loading only)
  useEffect(() => {
    if (isQueryLoading && currentPage === 1 && Object.keys(liveMatches).length === 0) {
      setLoading(true);
    } else if (!isQueryFetching) {
      setLoading(false);
      setIsFetchingMore(false);
    }

    if (queryData && queryData.success && queryData.responseObject) {
      const newItems = queryData.responseObject.items || [];
      setTotalPages(queryData.responseObject.totalPages || 1);
      setHasNextPage(queryData.responseObject.hasNextPage || false);

      // Accumulate items across pages
      if (currentPage === 1) {
        setAccumulatedItems(newItems);
      } else {
        setAccumulatedItems((prev) => {
          // Deduplicate by match_id
          const existingIds = new Set(prev.map((m) => m.match_id));
          const deduped = newItems.filter((m) => !existingIds.has(m.match_id));
          return [...prev, ...deduped];
        });
      }
    }
  }, [queryData, isQueryLoading, isQueryFetching, currentPage]);

  // Combine accumulated pages + SSE updates
  const matches = useMemo(() => {
    const baseItems = accumulatedItems;
    const merged = [...baseItems];

    // 1. Update/Overwrite baseItems with liveMatches
    const finalItems = merged.map((m) => {
      if (liveMatches[m.match_id]) {
        return { ...m, ...liveMatches[m.match_id] };
      }
      return m;
    });

    // 2. Add live matches that aren't in the base items (if it's today)
    if (activeTab === "live" && isToday(selectedDate || new Date())) {
      Object.values(liveMatches).forEach((liveMatch) => {
        const alreadyExists = finalItems.some(
          (m) => m.match_id === liveMatch.match_id,
        );
        if (!alreadyExists && liveMatch) {
          finalItems.push(liveMatch);
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
  }, [accumulatedItems, liveMatches, activeTab, selectedLeagueId, selectedDate]);

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
    setAccumulatedItems([]);
  }, [activeTab]);

  // Reset live overrides when changing date (unless it's today)
  useEffect(() => {
    setCurrentPage(1);
    setAccumulatedItems([]);
    if (selectedDate && !isToday(selectedDate)) {
      setLiveMatches({});
    }
  }, [selectedDate, selectedLeagueId]);

  // IntersectionObserver — load next page when sentinel scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isQueryFetching && !loading) {
          setIsFetchingMore(true);
          setCurrentPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isQueryFetching, loading]);

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
      <SportLayout 
        leftBar={
          <BasketballLeftBar
            onSelectLeague={setSelectedLeagueId}
            selectedLeagueId={selectedLeagueId}
          />
        }
        pageBottom={
          <ReturnToToday
            show={shouldShowReturnToToday}
            onReturnToToday={() => {
              setSelectedDate(new Date());
              setActiveTab("fixture");
              try {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } catch {
                // ignore
              }
            }}
            subtitle="Go back to today's matches"
          />
        }
      >
          <FixturesDateToggle
            fixturesMode={fixturesMode}
            onModeChange={(mode) => setActiveTab(mode === "live" ? "live" : "fixture")}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            liveLabel="Live"
          />

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

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="w-full" />

            {/* Loading more indicator */}
            {isFetchingMore && (
              <div className="flex items-center justify-center py-6 gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
                <span className="text-sm text-neutral-n4 dark:text-snow-300">
                  Loading more matches…
                </span>
              </div>
            )}

            {/* End of list indicator */}
            {!hasNextPage && !loading && matches.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center py-4 gap-2">
                <div className="h-px flex-1 bg-snow-200 dark:bg-[#1F2937]" />
                <span className="text-xs text-neutral-n4 dark:text-snow-400 px-3">
                  All matches loaded
                </span>
                <div className="h-px flex-1 bg-snow-200 dark:bg-[#1F2937]" />
              </div>
            )}
          </div>
      </SportLayout>
  );
};

export default BasketballPage;

