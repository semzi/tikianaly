import { useEffect, useMemo, useState } from "react";
import { format, isToday } from "date-fns";
import {
  ChevronDownIcon,
  StarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import Category from "@/features/dashboard/components/Category";
import { RightBar } from "@/components/layout/RightBar";
import { FixturesDateToggle } from "@/components/ui/FixturesDateToggle";
import ReturnToToday from "@/components/ui/ReturnToToday";
import { CricketLeftBar } from "../components/CricketLeftBar";
import { navigate } from "@/lib/router/navigate";
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
  const [favorites, setFavorites] = useState<Record<string, boolean>>(readFavorites);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [collapsedLeagues, setCollapsedLeagues] = useState<Record<string, boolean>>({});

  const fixturesMode = activeTab === "live" ? "live" : "date";
  const shouldShowReturnToToday = useMemo(() => {
    if (activeTab !== "fixtures") return false;
    try {
      return !isToday(selectedDate ?? new Date());
    } catch {
      return false;
    }
  }, [activeTab, selectedDate]);
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

  useEffect(() => {
    if (!isToday(selectedDate ?? new Date())) {
      setActiveTab("fixtures");
    }
  }, [selectedDate]);

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
        onClick={() => navigate(`/cricket/match/${match.id}`)}
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
            <FixturesDateToggle
              fixturesMode={fixturesMode}
              onModeChange={(mode) => setActiveTab(mode === "live" ? "live" : "fixtures")}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              liveLabel="Live"
            />
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

      <ReturnToToday
        show={shouldShowReturnToToday}
        onReturnToToday={() => {
          setSelectedDate(new Date());
          setActiveTab("fixtures");
          try {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch {
            // ignore
          }
        }}
        subtitle="Go back to today's matches"
      />
    </div>
  );
};

export default CricketPage;
