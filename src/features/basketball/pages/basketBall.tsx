import { useEffect, useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import { FooterComp } from "../../../components/layout/Footer";
import { navigate } from "../../../lib/router/navigate";
import {
  ClockIcon,
  StarIcon,
  ChevronDownIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  getLiveBasketballMatches,
  getBasketballFixtures,
  searchBasketballFixturesByStatus,
} from "@/lib/api/endpoints";

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
  _id: string;
  match_id: number;
  localteam: Team;
  awayteam: Team;
  status: string;
  period?: string;
  timer?: string;
  date?: string;
  time?: string;
  league_name: string;
  league_id?: number;
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
  const tabs = [
    { id: "live", label: "Live" },
    { id: "fixtures", label: "Fixtures" },
    { id: "results", label: "Results" },
  ];

  const [activeTab, setActiveTab] = useState("live");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedLeague, setSelectedLeague] = useState<string>("All Leagues");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [total, setTotal] = useState(0);

  // Extract unique leagues from matches
  const leagues = [
    "All Leagues",
    ...Array.from(new Set(matches.map((m) => m.league_name))),
  ];

  // Fetch data based on active tab and page
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data: ApiResponse;

        if (activeTab === "live") {
          data = await getLiveBasketballMatches(currentPage);
        } else if (activeTab === "fixtures") {
          data = await getBasketballFixtures(currentPage);
        } else {
          data = await searchBasketballFixturesByStatus(
            "finished",
            currentPage
          );
        }

        if (data && data.success && data.responseObject) {
          setMatches(data.responseObject.items || []);
          setTotalPages(data.responseObject.totalPages || 1);
          setHasNextPage(data.responseObject.hasNextPage || false);
          setHasPreviousPage(data.responseObject.hasPreviousPage || false);
          setTotal(data.responseObject.total || 0);
          setCurrentPage(data.responseObject.page || 1);
        } else {
          setMatches([]);
        }
      } catch (error) {
        console.error("Error fetching basketball data:", error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-refresh live matches every 30 seconds
    const interval =
      activeTab === "live" ? setInterval(fetchData, 30000) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, currentPage]);

  // Reset to page 1 when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Filter matches by selected league
  const filteredMatches =
    selectedLeague === "All Leagues"
      ? matches
      : matches.filter((m) => m.league_name === selectedLeague);

  // Get status display text
  const getStatusDisplay = (match: Match) => {
    if (activeTab === "live") {
      return {
        text: `${match.period || match.status}`,
        subtext: match.timer ? `${match.timer}'` : "",
        isLive: true,
      };
    } else if (activeTab === "fixtures") {
      return {
        text: match.date
          ? new Date(match.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "TBD",
        subtext: match.time || "",
        isLive: false,
      };
    } else {
      return {
        text: match.status || "Finished",
        subtext: match.date
          ? new Date(match.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "",
        isLive: false,
      };
    }
  };

  // Check if match has scores
  const hasScores = (match: Match) => {
    return (
      match.localteam.totalscore !== "" && match.awayteam.totalscore !== ""
    );
  };

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />

      {/* Basketball Header Banner */}
      <div
        className="relative w-full overflow-hidden h-[200px]"
        style={{
          backgroundImage: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex items-center justify-center px-6 md:px-12 py-6">
          <div className="flex flex-col items-center gap-2 text-white text-center">
            <div className="text-4xl md:text-5xl font-bold">🏀</div>
            <h1 className="font-bold text-2xl md:text-4xl">Basketball</h1>
            <p className="text-sm md:text-base opacity-90">
              Live Scores, Fixtures & Results
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex z-10 h-12 w-full overflow-y-hidden overflow-x-auto bg-brand-p3/30 dark:bg-brand-p2 backdrop-blur-2xl cursor-pointer sticky top-0 hide-scrollbar">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-orange-500 font-medium border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
              {tab.id === "live" &&
                matches.length > 0 &&
                activeTab === "live" && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {matches.length}
                  </span>
                )}
            </button>
          ))}
        </div>
      </div>

      <div className="page-padding-x">
        <div className="flex flex-col-reverse md:flex-row my-8 gap-7">
          {/* Left Sidebar - Featured Match & Filters */}
          <div className="flex flex-col gap-5 flex-2">
            {/* Featured Match */}
            {activeTab === "live" && (
              <div className="block-style">
                <p className="font-[500] mb-4 flex items-center sz-4 theme-text">
                  Featured Match
                </p>

                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-20 bg-snow-200 dark:bg-[#1F2937] rounded-lg" />
                  </div>
                ) : filteredMatches.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-col p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 rounded-lg border border-orange-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          LIVE
                        </span>
                        <span className="text-xs theme-text">
                          {filteredMatches[0].period ||
                            filteredMatches[0].status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium theme-text text-sm">
                            {filteredMatches[0].localteam.name}
                          </span>
                          <span className="font-bold text-lg theme-text">
                            {filteredMatches[0].localteam.totalscore || 0}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium theme-text text-sm">
                            {filteredMatches[0].awayteam.name}
                          </span>
                          <span className="font-bold text-lg theme-text">
                            {filteredMatches[0].awayteam.totalscore || 0}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/basketball/match/${filteredMatches[0].match_id}`
                          )
                        }
                        className="w-full mt-3 py-2 px-4 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-brand-primary/90 transition"
                      >
                        View Live Stats
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-n4 dark:text-snow-200 text-center py-4">
                    No live matches available
                  </p>
                )}
              </div>
            )}

            {/* Filters */}
            <div className="block-style">
              <p className="font-[500] mb-4 flex items-center gap-2 sz-4 theme-text">
                <FunnelIcon className="w-4 h-4" />
                Filters
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-n4 dark:text-snow-200 mb-2 block">
                    League
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-snow-100 dark:bg-[#1F2937] text-sm theme-text px-3 py-2 rounded-lg border border-snow-200 dark:border-transparent hover:border-neutral-n5 transition pr-8"
                      value={selectedLeague}
                      onChange={(e) => setSelectedLeague(e.target.value)}
                    >
                      {leagues.map((league) => (
                        <option key={league} value={league}>
                          {league}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-neutral-n4 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="block-style">
              <p className="font-[500] mb-3 sz-4 theme-text">Summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-n4 dark:text-snow-200">
                    Total Matches:
                  </span>
                  <span className="font-semibold theme-text">{total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-n4 dark:text-snow-200">
                    Showing:
                  </span>
                  <span className="font-semibold theme-text">
                    {filteredMatches.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-n4 dark:text-snow-200">
                    Page:
                  </span>
                  <span className="font-semibold theme-text">
                    {currentPage} of {totalPages}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Matches */}
          <div className="flex flex-col gap-5 flex-5">
            {loading ? (
              <div className="block-style">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-snow-200 dark:bg-[#1F2937] rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ) : filteredMatches.length > 0 ? (
              <>
                <div className="space-y-4">
                  {filteredMatches.map((match) => {
                    const status = getStatusDisplay(match);
                    const showScores = hasScores(match);

                    return (
                      <div
                        key={match._id}
                        className="block-style hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() =>
                          navigate(`/basketball/match/${match.match_id}`)
                        }
                      >
                        {/* League Header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-snow-200 dark:border-[#1F2937]">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium theme-text">
                              {match.league_name}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(match._id);
                            }}
                            className={`p-1.5 rounded-full transition ${
                              favorites[match._id]
                                ? "bg-orange-500"
                                : "bg-transparent border border-neutral-n4"
                            }`}
                          >
                            <StarIcon
                              className={`w-3 h-3 ${
                                favorites[match._id]
                                  ? "text-white"
                                  : "text-neutral-n4 dark:text-snow-200"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Match Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-3">
                            {/* Home Team */}
                            <div className="flex items-center justify-between">
                              <span className="font-medium theme-text">
                                {match.localteam.name}
                              </span>
                              {showScores && (
                                <span className="font-bold text-xl theme-text">
                                  {match.localteam.totalscore}
                                </span>
                              )}
                            </div>

                            {/* Away Team */}
                            <div className="flex items-center justify-between">
                              <span className="font-medium theme-text">
                                {match.awayteam.name}
                              </span>
                              {showScores && (
                                <span className="font-bold text-xl theme-text">
                                  {match.awayteam.totalscore}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status/Time */}
                        <div className="mt-3 pt-3 border-t border-snow-200 dark:border-[#1F2937] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {status.isLive ? (
                              <>
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-xs font-semibold text-red-500">
                                  {status.text} {status.subtext}
                                </span>
                              </>
                            ) : (
                              <>
                                <ClockIcon className="w-4 h-4 text-neutral-n4" />
                                <span className="text-xs text-neutral-n4 dark:text-snow-200">
                                  {status.text}{" "}
                                  {status.subtext && `• ${status.subtext}`}
                                </span>
                              </>
                            )}
                          </div>

                          <span className="text-xs text-brand-primary font-medium hover:underline">
                            View Details →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
              </>
            ) : (
              <div className="block-style text-center py-12">
                <div className="text-4xl mb-4">🏀</div>
                <p className="text-lg font-semibold theme-text mb-2">
                  No {activeTab} matches
                </p>
                <p className="text-sm text-neutral-n4 dark:text-snow-200">
                  {activeTab === "live"
                    ? "There are no live matches at the moment"
                    : `No ${activeTab} available for the selected filters`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default BasketballPage;
