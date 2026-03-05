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
} from "@heroicons/react/24/outline";
import {
  getBasketballFixturesByDate,
  getLiveBasketballMatches,
} from "@/lib/api/endpoints";
import { BasketballLeftBar } from "../components/BasketballLeftBar";
import Category from "@/features/dashboard/components/Category";
import { subDays, addDays, isToday, format, isValid, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  subscribeBasketballLiveMatchesStream,
  closeBasketballLiveStream,
} from "@/lib/api/basketball/livestream";
import DatePicker from "react-datepicker";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import RightBar from "@/components/layout/RightBar";

interface Team {
  id: number;
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
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      { id: "all", label: "All" },
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
      (activeTab === "all" || activeTab === "live") &&
      isToday(selectedDate || new Date())
    ) {
      Object.values(liveMatches).forEach((liveMatch) => {
        const alreadyExists = finalItems.some(
          (m) => m.match_id === liveMatch.match_id,
        );
        if (!alreadyExists) {
          if (activeTab === "all" || (activeTab === "live" && liveMatch)) {
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
    if (activeTab === "live" || activeTab === "all") {
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

    const safeFormat = (dateStr?: string, fmt: string = "MMM d") => {
      if (!dateStr) return "";
      try {
        const d = parseISO(dateStr);
        return isValid(d) ? format(d, fmt) : "";
      } catch {
        return "";
      }
    };

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
        subtext: safeFormat(match.date),
        isLive: false,
      };
    } else {
      return {
        text: safeFormat(match.date) || "TBD",
        subtext: match.time || "",
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
          <div className="block-style">
            <div className="flex flex-col gap-4">
              {/* Tabs */}
              <div className="flex gap-4 border-b border-snow-200 dark:border-[#1F2937]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 text-sm font-medium transition-all duration-200 relative ${
                      activeTab === tab.id
                        ? "text-brand-secondary"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-secondary transition-all duration-200" />
                    )}
                  </button>
                ))}
              </div>

              {/* Date Navigation (only for all/fixture) */}
              {(activeTab === "all" || activeTab === "fixture") && (
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
                    <p className="font-medium">
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
              )}
            </div>
          </div>

          {/* Matches */}
          <div className="flex flex-col gap-y-4">
            {loading ? (
              <div className="block-style space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-snow-200 dark:bg-[#1F2937] rounded-lg"
                  />
                ))}
              </div>
            ) : groupedMatches.length > 0 ? (
              groupedMatches.map((group) => (
                <div
                  key={group.leagueId}
                  className="block-style !p-0 overflow-hidden"
                >
                  {/* League Header */}
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
                    <GetLeagueLogo
                      leagueId={group.leagueId}
                      alt={group.leagueName}
                      className="w-6 h-6 object-contain"
                    />
                    <p className="font-semibold theme-text text-sm md:text-base">
                      {group.leagueName}
                    </p>
                    <button
                      onClick={() =>
                        navigate(`/basketball/league/${group.leagueId}`)
                      }
                      className="ml-auto p-1.5 rounded-full text-brand-primary hover:bg-brand-primary/10 transition-all"
                      title="View League Profile"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
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
                          className="px-5 py-4 hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors cursor-pointer group"
                          onClick={() =>
                            navigate(`/basketball/match/${match.match_id}`)
                          }
                        >
                          <div className="flex items-center gap-4">
                            {/* Time/Status */}
                            <div className="w-16 text-center">
                              <p
                                className={`text-xs font-bold ${
                                  status.isLive
                                    ? "text-red-500 animate-pulse"
                                    : "theme-text opacity-70"
                                }`}
                              >
                                {status.text}
                              </p>
                              {status.subtext && (
                                <p className="text-[10px] theme-text opacity-50">
                                  {status.subtext}
                                </p>
                              )}
                            </div>

                            {/* Teams and Scores */}
                            <div className="flex-1 space-y-2">
                              {/* Home Team */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium theme-text">
                                    {match?.localteam?.name || "Unknown"}
                                  </span>
                                </div>
                                {showScores && (
                                  <span className="font-bold text-sm theme-text">
                                    {match?.localteam?.totalscore}
                                  </span>
                                )}
                              </div>

                              {/* Away Team */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium theme-text">
                                    {match?.awayteam?.name || "Unknown"}
                                  </span>
                                </div>
                                {showScores && (
                                  <span className="font-bold text-sm theme-text">
                                    {match?.awayteam?.totalscore}
                                  </span>
                                )}
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

            {/* Pagination (only for all/fixture) */}
            {(activeTab === "all" || activeTab === "fixture") &&
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
    </div>
  );
};

export default BasketballPage;
