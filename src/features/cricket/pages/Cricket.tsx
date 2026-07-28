import { useMemo, useState } from "react";
import { format, isToday } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import Category from "@/features/dashboard/components/Category";
import { RightBar } from "@/components/layout/RightBar";
import { CricketLeftBar } from "../components/CricketLeftBar";
import { navigate } from "@/lib/router/navigate";
import {
  cricketSummaryCards,
} from "../data/mockCricket";
import { useQuery } from "@tanstack/react-query";
import { getCricketLive, getUpcomingCricketFixtures } from "@/lib/api/cricket";
import { mapCricketMatch, type CricketMappedMatch } from "../utils/mappers";

type CricketTab = "live" | "fixtures";

const FAVORITES_STORAGE_KEY = "cricket_favorite_matches_v1";

const readFavorites = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const CricketPage = () => {
  const [activeTab, setActiveTab] = useState<CricketTab>("live");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>(readFavorites);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [collapsedLeagues, setCollapsedLeagues] = useState<Record<string, boolean>>({});

  const tabs = useMemo(
    () => [
      { id: "live" as CricketTab, label: "Live" },
      {
        id: "fixtures" as CricketTab,
        label:
          selectedDate && isToday(selectedDate)
            ? "Today"
            : selectedDate
              ? format(selectedDate, "MMM d")
              : "Fixtures",
      },
    ],
    [selectedDate],
  );

  // Fetch API data
  const dateString = selectedDate ? format(selectedDate, "dd.MM.yyyy") : undefined;
  
  const liveQuery = useQuery({
    queryKey: ["cricketLive"],
    queryFn: () => getCricketLive(),
    enabled: activeTab === "live",
    refetchInterval: 30000, // refresh every 30s for live data
  });

  const fixturesQuery = useQuery({
    queryKey: ["cricketFixtures", dateString],
    queryFn: () => getUpcomingCricketFixtures(1, 100, dateString),
    enabled: activeTab === "fixtures",
  });

  const matches = useMemo(() => {
    let rawItems: any[] = [];
    if (activeTab === "live") {
      rawItems = liveQuery.data?.responseObject?.items || [];
    } else {
      rawItems = fixturesQuery.data?.responseObject?.items || [];
    }
    
    return rawItems.map(mapCricketMatch);
  }, [activeTab, liveQuery.data, fixturesQuery.data]);

  const groupedMatches = useMemo(() => {
    const grouped = new Map<string, typeof matches>();
    for (const match of matches) {
      const current = grouped.get(match.league) ?? [];
      current.push(match);
      grouped.set(match.league, current);
    }
    return Array.from(grouped.entries()).map(([league, items]) => ({ league, items }));
  }, [matches]);

  const favoriteMatches = useMemo(
    () => matches.filter((match) => favorites[match.id]),
    [favorites, matches],
  );

  const toggleFavorite = (matchId: string) => {
    setFavorites((current) => {
      const next = { ...current, [matchId]: !current[matchId] };
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const matchCard = (match: CricketMappedMatch, pinned = false) => {
    const isLive = match.status.toLowerCase().includes("live") || match.status.toLowerCase().includes("innings");
    return (
      <div
        key={match.id}
        className={`relative flex flex-col px-3 py-2 transition rounded-xl mb-1.5 cursor-pointer hover:brightness-95 dark:hover:brightness-110 ${
          pinned ? "bg-amber-50/50 dark:bg-amber-500/10" : "bg-white dark:bg-[#1C1F26]"
        }`}
        onClick={() => window.open(`/cricket/match/${match.id}`, '_blank')}
      >
        {isLive && (
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-brand-secondary rounded-r" />
        )}
        <div className="flex justify-between items-center text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
          <span>{match.highlight || match.format}</span>
          <span>{match.startTime || format(new Date(), "dd MMM")}</span>
        </div>
        <div className={`text-xs mb-1 ${isLive ? "text-brand-secondary font-medium" : "text-neutral-500 dark:text-neutral-400"}`}>
          {match.status}
        </div>
        
        <div className="flex justify-between items-center mt-0.5">
          <div className="flex items-center gap-2">
            <img src={match.homeTeam.imageUrl} alt={match.homeTeam.name} className="w-5 h-5 object-contain" />
            {isLive && match.homeTeam.wickets === "Batting" && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
            )}
            <span className="font-semibold text-[#23272A] dark:text-white/90 text-sm line-clamp-1">{match.homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {match.homeTeam.score && (
              <span className="font-bold text-[#23272A] dark:text-white text-[13px]">
                {match.homeTeam.score}{" "}
                {match.homeTeam.overs && <span className="text-neutral-500 dark:text-neutral-400 font-normal text-[11px]">({match.homeTeam.overs})</span>}
              </span>
            )}
            <button type="button" onClick={(e) => { e.stopPropagation(); toggleFavorite(match.id); }}>
              {favorites[match.id] ? (
                <StarSolidIcon className="h-4 w-4 text-amber-500" />
              ) : (
                <StarIcon className="h-4 w-4 text-neutral-400 hover:text-white transition-colors" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-2">
            <img src={match.awayTeam.imageUrl} alt={match.awayTeam.name} className="w-5 h-5 object-contain" />
            {isLive && match.awayTeam.wickets === "Batting" && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
            )}
            <span className="font-semibold text-[#23272A] dark:text-white/70 text-sm line-clamp-1">{match.awayTeam.name}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {match.awayTeam.score && (
              <span className="font-bold text-[#23272A] dark:text-white text-[13px]">
                {match.awayTeam.score}{" "}
                {match.awayTeam.overs && <span className="text-neutral-500 dark:text-neutral-400 font-normal text-[11px]">({match.awayTeam.overs})</span>}
              </span>
            )}
            <div className="w-4" />
          </div>
        </div>

        {match.result && (
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
            {match.result}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />
      <Category />

      <div className="page-padding-x py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
          <aside className="hidden lg:block">
            <CricketLeftBar />
          </aside>

          <main className="min-w-0 flex flex-col gap-4">
            <section className="block-style !p-0 overflow-visible z-10">
              <div className="flex flex-wrap items-center gap-3 px-5 py-4 dark:border-[#1F2937]">
                <div className="flex rounded-full bg-snow-100 p-1 dark:bg-white/5">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        activeTab === tab.id
                          ? "bg-brand-secondary text-white"
                          : "text-[#586069] dark:text-snow-200"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-snow-200 p-2 text-[#586069] dark:border-white/10 dark:text-snow-200"
                    onClick={() =>
                      setSelectedDate((prev) =>
                        prev ? new Date(prev.getTime() - 86400000) : new Date(),
                      )
                    }
                    aria-label="Previous day"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-snow-200 p-2 text-[#586069] dark:border-white/10 dark:text-snow-200"
                    onClick={() =>
                      setSelectedDate((prev) =>
                        prev ? new Date(prev.getTime() + 86400000) : new Date(),
                      )
                    }
                    aria-label="Next day"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full border border-snow-200 px-4 py-2 text-sm text-[#586069] dark:border-white/10 dark:text-snow-200"
                      onClick={() => setShowDatePicker((value) => !value)}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {selectedDate && isToday(selectedDate)
                        ? "Today"
                        : selectedDate
                          ? format(selectedDate, "dd MMM")
                          : "Pick date"}
                    </button>
                    {showDatePicker ? (
                      <div className="absolute right-0 top-full z-20 mt-2 rounded-2xl border border-snow-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#111827]">
                        <DatePicker
                          inline
                          selected={selectedDate}
                          onChange={(date) => {
                            setSelectedDate(date);
                            setShowDatePicker(false);
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
            <div>
              {favoriteMatches.length ? (
                  <div className="mb-5 overflow-hidden rounded-2xl border border-snow-200 dark:border-[#1F2937]">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 border-b border-snow-200 px-5 py-3 text-left dark:border-[#1F2937]"
                      onClick={() => setFavoritesOpen((value) => !value)}
                    >
                      <p className="font-semibold text-[#23272A] dark:text-white">
                        Starred Matches ({favoriteMatches.length})
                      </p>
                      <ChevronDownIcon
                        className={`ml-auto h-5 w-5 text-brand-secondary transition-transform ${
                          favoritesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {favoritesOpen ? (
                      <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                        {favoriteMatches.map((match) => matchCard(match, true))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

              {(activeTab === "live" ? liveQuery.isLoading : fixturesQuery.isLoading) ? (
                  <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-secondary"></div>
                  </div>
                ) : groupedMatches.length ? (
                  <div className="space-y-3">
                    {groupedMatches.map(({ league, items }) => {
                      const collapsed = collapsedLeagues[league];
                      const fixtureCount = items.length;
                      return (
                        <div key={league} className="block-style !p-0">
                          <div
                            className="flex gap-3 border-b-1 px-5 py-3 border-snow-200 dark:border-[#1F2937] bg-gradient-to-r from-brand-primary/0 via-transparent to-orange-500/10 dark:from-brand-primary/0 dark:to-orange-500/20 cursor-pointer select-none"
                            onClick={() =>
                              setCollapsedLeagues((current) => ({
                                ...current,
                                [league]: !current[league],
                              }))
                            }
                          >
                            <div className="flex items-center gap-2">
                              <p className="font-[500] text-[#23272A] dark:text-snow-200 text-[14px] md:text-base">
                                {league}
                              </p>
                              {fixtureCount >= 10 ? (
                                <div className="flex items-center gap-1 bg-brand-secondary text-white px-2 py-0.5 rounded-full ml-1">
                                  <span className="text-xs font-medium">{fixtureCount}</span>
                                  <ChevronDownIcon className={`h-3 w-3 transition-transform ${collapsed ? "" : "rotate-180"}`} />
                                </div>
                              ) : (
                                <ChevronDownIcon
                                  className={`h-4 w-4 text-neutral-n5 dark:text-snow-200/70 transition-transform ml-1 ${collapsed ? "" : "rotate-180"}`}
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              className="ml-auto text-brand-secondary hover:opacity-80"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              aria-label="Toggle league matches"
                            >
                              <ArrowRightIcon className="w-5 h-5" />
                            </button>
                          </div>
                          {!collapsed ? (
                            <div className="p-2">
                              {items.map((match) => matchCard(match))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-snow-200 p-10 text-center text-sm text-neutral-500 dark:border-white/10 dark:text-snow-200">
                    No cricket matches found.
                  </div>
                )}
            </div>
          </main>

          <aside className="hidden xl:block">
            <RightBar />
          </aside>
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default CricketPage;
