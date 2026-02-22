import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { BasketballStandingsTable } from "../components/standings/BasketballStandingsTable";
import Category from "@/features/dashboard/components/Category";
import {
  getBasketballLeagues,
  getLiveBasketballMatches,
  getBasketballFixturesByDate,
  searchBasketballFixturesByStatus,
} from "@/lib/api/endpoints";
import { BasketballLeftBar } from "../components/BasketballLeftBar";
import RightBar from "@/components/layout/RightBar";
import { format, isToday, subDays, addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface LeagueInfo {
  id: number;
  name: string;
  type: string;
  country?: string;
  logo?: string;
  season?: string;
}

interface Team {
  id: number;
  name: string;
  totalscore: string | number;
}

interface Match {
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
}

const BasketballLeagueProfile = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("fixtures");
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    // If before August, the "current" season is (year-1)/year
    if (month < 7) {
      return `${year - 1}/${year}`;
    }
    return `${year}/${year + 1}`;
  });
  const [showSeasonPicker, setShowSeasonPicker] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  console.log("league id:", leagueId);

  const tabs = [
    // { id: "overview", label: "Overview" },
    { id: "fixtures", label: "Fixtures" },
    { id: "results", label: "Results" },
    { id: "standings", label: "Standings" },
  ];

  const seasons = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const month = now.getMonth();
    const baseYear = month < 7 ? currentYear : currentYear + 1;

    const years = [];
    for (let i = 0; i < 5; i++) {
      const year = baseYear - i;
      years.push(`${year - 1}/${year}`);
    }
    return years;
  }, []);

  useEffect(() => {
    const fetchLeagueData = async () => {
      if (!leagueId) return;
      setLoading(true);
      try {
        const response = await getBasketballLeagues();
        if (response.success && response.responseObject) {
          const leagues = response.responseObject.items || [];
          const found = leagues.find(
            (l: any) =>
              String(l.id) === String(leagueId) ||
              String(l.league_id) === String(leagueId) ||
              String(l.leagueId) === String(leagueId),
          );
          if (found) {
            setLeagueInfo({
              id: found.league_id || found.id,
              name: found.name,
              type: found.type || "League",
              country: found.country_name || found.country,
              logo: found.logo || found.image_path,
              season: found.season_name,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching league info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueData();
  }, [leagueId]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!leagueId || activeTab === "standings") return;
      setMatchesLoading(true);
      try {
        let allMatches: Match[] = [];
        const formattedDate = selectedDate
          ? format(selectedDate, "yyyy-MM-dd")
          : "";

        if (activeTab === "overview") {
          // For overview, we might want a mix or just live matches if any
          const liveRes = await getLiveBasketballMatches(currentPage);
          if (liveRes.success && liveRes.responseObject) {
            allMatches = liveRes.responseObject.items || [];
          }
          // Also fetch some recent results/upcoming fixtures
          const fixturesRes = await searchBasketballFixturesByStatus(
            "not started",
            currentPage,
          );
          if (fixturesRes.success && fixturesRes.responseObject) {
            allMatches = [
              ...allMatches,
              ...(fixturesRes.responseObject.items || []),
            ];
          }
          const resultsRes = await searchBasketballFixturesByStatus(
            "finished",
            currentPage,
          );
          if (resultsRes.success && resultsRes.responseObject) {
            allMatches = [
              ...allMatches,
              ...(resultsRes.responseObject.items || []),
            ];
          }
        } else if (activeTab === "fixtures") {
          const res = await getBasketballFixturesByDate(
            formattedDate,
            currentPage,
          );
          if (res.success && res.responseObject) {
            allMatches = res.responseObject.items || [];
            setTotalPages(res.responseObject.totalPages || 1);
            setHasNextPage(res.responseObject.hasNextPage || false);
            setHasPreviousPage(res.responseObject.hasPreviousPage || false);
          }
        } else if (activeTab === "results") {
          const res = await getBasketballFixturesByDate(
            formattedDate,
            currentPage,
          );
          if (
            res.success &&
            res.responseObject &&
            res.responseObject.items.length > 0
          ) {
            allMatches = res.responseObject.items.filter(
              (m: any) =>
                m.status.toLowerCase().includes("finished") ||
                m.localteam.totalscore !== "",
            );
            setTotalPages(res.responseObject.totalPages || 1);
            setHasNextPage(res.responseObject.hasNextPage || false);
            setHasPreviousPage(res.responseObject.hasPreviousPage || false);
          } else {
            const fallbackRes = await searchBasketballFixturesByStatus(
              "finished",
              currentPage,
            );
            if (fallbackRes.success && fallbackRes.responseObject) {
              allMatches = fallbackRes.responseObject.items || [];
              setTotalPages(fallbackRes.responseObject.totalPages || 1);
              setHasNextPage(fallbackRes.responseObject.hasNextPage || false);
              setHasPreviousPage(
                fallbackRes.responseObject.hasPreviousPage || false,
              );
            }
          }
        }

        // Filter matches by current league but use the same endpoints/logic
        const filtered = allMatches.filter(
          (m) =>
            String(m.league_id) === String(leagueId) ||
            String(m.league_name).toLowerCase() ===
              String(leagueInfo?.name).toLowerCase(),
        );
        setMatches(filtered);
      } catch (error) {
        console.error("Error fetching league matches:", error);
        setMatches([]);
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchMatches();
  }, [leagueId, activeTab, selectedDate, currentPage, leagueInfo?.name]);

  // Reset to page 1 when changing tabs or date
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedDate]);

  const getStatusDisplay = (match: Match) => {
    if (match.status.toLowerCase().includes("live")) {
      return {
        text: match.period || match.status,
        subtext: match.timer ? `${match.timer}'` : "",
        isLive: true,
      };
    }
    return {
      text: match.status.toLowerCase().includes("finished")
        ? "FT"
        : match.date
          ? format(new Date(match.date), "MMM d")
          : "TBD",
      subtext: match.time || "",
      isLive: false,
    };
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderMatchList = (matchList: Match[], title?: string) => (
    <div className="block-style !p-0 overflow-hidden mb-5">
      {title && (
        <div className="px-5 py-3 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
          <h3 className="font-bold theme-text uppercase text-xs tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
        {matchList.length > 0 ? (
          matchList.map((match) => {
            const status = getStatusDisplay(match);
            const matchUniqueId = String(match.match_id);
            return (
              <div
                key={match.match_id}
                className="px-5 py-4 hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors cursor-pointer group"
                onClick={() => navigate(`/basketball/match/${match.match_id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 text-center">
                    <p
                      className={`text-xs font-bold ${status.isLive ? "text-red-500 animate-pulse" : "theme-text opacity-70"}`}
                    >
                      {status.text}
                    </p>
                    {status.subtext && (
                      <p className="text-[10px] theme-text opacity-50">
                        {status.subtext}
                      </p>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium theme-text">
                        {match.localteam.name}
                      </span>
                      <span className="font-bold text-sm theme-text">
                        {match.localteam.totalscore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium theme-text">
                        {match.awayteam.name}
                      </span>
                      <span className="font-bold text-sm theme-text">
                        {match.awayteam.totalscore}
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
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center theme-text opacity-50 text-sm">
            No matches found
          </div>
        )}
      </div>
    </div>
  );

  const StatusIcon = () => (
    <svg
      className="w-4 h-4 text-brand-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-[#0D1117]">
        <PageHeader />
        <Category />
        <div className="page-padding-x py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-snow-200 dark:bg-[#1F2937] rounded-xl" />
            <div className="h-96 bg-snow-200 dark:bg-[#1F2937] rounded-xl" />
          </div>
        </div>
        <FooterComp />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />
      <Category />

      <div className="flex page-padding-x gap-5 py-5 justify-around">
        {/* Left Sidebar */}
        <section className="h-full pb-30 overflow-y-auto hide-scrollbar w-1/5 hidden lg:block pr-2">
          <BasketballLeftBar
            onSelectLeague={(id) => navigate(`/basketball/league/${id}`)}
            selectedLeagueId={Number(leagueId)}
          />
        </section>

        {/* Main Content Area */}
        <div className="w-full pb-30 flex flex-col gap-y-5 lg:w-3/5 h-full overflow-y-auto hide-scrollbar pr-2">
          {/* Header Banner */}
          <div className="secondary-gradient relative z-0 rounded-[10px] overflow-hidden shadow-lg">
            <div className="w-full px-6 py-8 relative z-0 flex items-center">
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors flex-shrink-0"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>

                <div className="bg-white p-3 rounded-xl shadow-lg flex-shrink-0">
                  <img
                    src={leagueInfo?.logo || "/loading-state/league.svg"}
                    alt={leagueInfo?.name}
                    className="w-20 h-20 object-contain"
                  />
                </div>

                <div className="text-center md:text-left text-white min-w-0">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md border border-white/10">
                      Basketball
                    </span>
                    <span className="bg-orange-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md border border-orange-500/20 text-orange-200">
                      {leagueInfo?.type}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight truncate">
                    {leagueInfo?.name || "League Profile"}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-snow-100 opacity-90 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{leagueInfo?.country || "International"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="flex flex-col gap-5">
            <div className="block-style">
              <div className="flex gap-4 border-b border-snow-200 dark:border-[#1F2937]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? "text-brand-primary"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* Date Navigation (only for fixtures/results) */}
              {(activeTab === "fixtures" || activeTab === "results") && (
                <div className="mt-4 flex items-center justify-between dark:text-snow-200 border-b border-snow-200 dark:border-[#1F2937] pb-4">
                  <button
                    onClick={() =>
                      setSelectedDate((prev) => subDays(prev || new Date(), 1))
                    }
                    disabled={
                      activeTab === "fixtures" &&
                      !!selectedDate &&
                      isToday(selectedDate)
                    }
                    className={`p-1 transition-colors ${
                      activeTab === "fixtures" &&
                      selectedDate &&
                      isToday(selectedDate)
                        ? "text-gray-300 cursor-not-allowed opacity-50"
                        : "hover:text-brand-primary"
                    }`}
                  >
                    <ChevronRightIcon className="w-5 h-5 rotate-180" />
                  </button>
                  <div
                    className="flex gap-3 items-center cursor-pointer hover:text-brand-primary relative"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <p className="font-medium text-sm">
                      {selectedDate && isToday(selectedDate)
                        ? "Today"
                        : selectedDate
                          ? format(selectedDate, "EEE, MMM d, yyyy")
                          : "Select Date"}
                    </p>
                    <CalendarIcon className="h-4 w-4 text-neutral-n4" />
                    {showDatePicker && (
                      <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date: Date | null) => {
                            setSelectedDate(date);
                            setShowDatePicker(false);
                          }}
                          minDate={
                            activeTab === "fixtures" ? new Date() : undefined
                          }
                          maxDate={
                            activeTab === "results" ? new Date() : undefined
                          }
                          inline
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setSelectedDate((prev) => addDays(prev || new Date(), 1))
                    }
                    disabled={
                      activeTab === "results" &&
                      !!selectedDate &&
                      isToday(selectedDate)
                    }
                    className={`p-1 transition-colors ${
                      activeTab === "results" &&
                      selectedDate &&
                      isToday(selectedDate)
                        ? "text-gray-300 cursor-not-allowed opacity-50"
                        : "hover:text-brand-primary"
                    }`}
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              )}

              {activeTab === "standings" && (
                <div className="mt-4 flex items-center justify-between">
                  <h2 className="text-base font-bold theme-text">
                    League Standings
                  </h2>
                  <div className="relative">
                    <button
                      onClick={() => setShowSeasonPicker(!showSeasonPicker)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-white/10 text-sm theme-text hover:bg-snow-200 dark:hover:bg-white/10 transition-colors"
                    >
                      <span>Season: {selectedSeason}</span>
                      <CalendarIcon className="w-4 h-4" />
                    </button>
                    {showSeasonPicker && (
                      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#1F2937] border border-snow-200 dark:border-[#374151] rounded-lg shadow-xl z-50 overflow-hidden">
                        {seasons.map((season) => (
                          <button
                            key={season}
                            onClick={() => {
                              setSelectedSeason(season);
                              setShowSeasonPicker(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-snow-100 dark:hover:bg-white/5 transition-colors ${selectedSeason === season ? "text-brand-primary font-bold" : "theme-text"}`}
                          >
                            {season}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="min-h-[400px] mt-2">
              {matchesLoading ? (
                <div className="block-style space-y-4 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-snow-200 dark:bg-[#1F2937] rounded-lg"
                    />
                  ))}
                </div>
              ) : activeTab === "overview" ? (
                <>
                  {renderMatchList(
                    matches.filter(
                      (m) =>
                        m.status.toLowerCase().includes("finished") ||
                        m.localteam.totalscore !== "",
                    ),
                    "Recent Results",
                  )}
                  {renderMatchList(
                    matches.filter(
                      (m) =>
                        !m.status.toLowerCase().includes("finished") &&
                        m.localteam.totalscore === "",
                    ),
                    "Upcoming Fixtures",
                  )}
                </>
              ) : activeTab === "fixtures" ? (
                renderMatchList(matches)
              ) : activeTab === "results" ? (
                renderMatchList(matches)
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <BasketballStandingsTable
                    leagueId={leagueId}
                    season={selectedSeason}
                  />
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 &&
              (activeTab === "fixtures" || activeTab === "results") && (
                <div className="flex items-center justify-between mt-4 px-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={!hasPreviousPage}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      hasPreviousPage
                        ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                        : "bg-snow-200 dark:bg-white/5 text-neutral-n4 cursor-not-allowed"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-xs theme-text">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={!hasNextPage}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      hasNextPage
                        ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                        : "bg-snow-200 dark:bg-white/5 text-neutral-n4 cursor-not-allowed"
                    }`}
                  >
                    Next
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

export default BasketballLeagueProfile;
