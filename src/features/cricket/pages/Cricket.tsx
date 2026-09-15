import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { format, isToday } from "date-fns";
import {
  ChevronDownIcon,
  StarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "react-router-dom";
import { FixturesDateToggle } from "@/components/ui/FixturesDateToggle";
import ReturnToToday from "@/components/ui/ReturnToToday";
import { SportLayout } from "@/components/layout/SportLayout";
import { CricketLeftBar } from "../components/CricketLeftBar";
import { navigate } from "@/lib/router/navigate";
import { useQuery } from "@tanstack/react-query";
import { getCricketLive, getUpcomingCricketFixtures } from "@/lib/api/cricket";
import { mapCricketMatch, type CricketMappedMatch } from "../utils/mappers";

type CricketFixturesMode = "live" | "date";

const FAVORITES_STORAGE_KEY = "cricket_favorite_matches_v1";
const CRICKET_FIXTURES_MODE_KEY = "cricket_fixtures_mode";

const readFavorites = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const CricketPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [fixturesMode, setFixturesMode] = useState<CricketFixturesMode>(() => {
    try {
      const tabParam = searchParams.get("tab");
      if (tabParam === "live") return "live";
      const dateParam = searchParams.get("date");
      if (dateParam) return "date";
      const stored = localStorage.getItem(CRICKET_FIXTURES_MODE_KEY);
      if (stored === "live" || stored === "date") return stored;
    } catch {
      // ignore storage errors
    }
    return "date";
  });

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

  const selectedDateRef = useRef(selectedDate);
  selectedDateRef.current = selectedDate;

  useEffect(() => {
    try {
      localStorage.setItem(CRICKET_FIXTURES_MODE_KEY, fixturesMode);
    } catch {
      // ignore storage errors
    }
  }, [fixturesMode]);

  const handleModeChange = useCallback((mode: CricketFixturesMode) => {
    setFixturesMode(mode);
    try {
      localStorage.setItem(CRICKET_FIXTURES_MODE_KEY, mode);
    } catch {
      // ignore
    }
    setSearchParams(prevParams => {
      const next = new URLSearchParams(prevParams);
      if (mode === "live") {
        next.set("tab", "live");
        next.delete("date");
      } else {
        next.delete("tab");
        if (selectedDateRef.current && !isToday(selectedDateRef.current)) {
          next.set("date", format(selectedDateRef.current, "yyyy-MM-dd"));
        } else {
          next.delete("date");
        }
      }
      return next;
    }, { replace: false });
  }, [setSearchParams]);

  const setSelectedDate = useCallback((dateOrUpdater: Date | null | ((prev: Date | null) => Date | null)) => {
    const prev = selectedDateRef.current;
    const newDate = typeof dateOrUpdater === 'function' ? dateOrUpdater(prev) : dateOrUpdater;
    
    _setSelectedDate(newDate);
    setFixturesMode("date");
    try {
      localStorage.setItem(CRICKET_FIXTURES_MODE_KEY, "date");
    } catch {
      // ignore
    }

    setSearchParams(prevParams => {
      const next = new URLSearchParams(prevParams);
      next.delete("tab");
      if (newDate && !isToday(newDate)) {
        next.set("date", format(newDate, "yyyy-MM-dd"));
      } else {
        next.delete("date");
      }
      return next;
    }, { replace: false });
  }, [setSearchParams]);

  // Sync state with URL when navigating back/forward
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const dateParam = searchParams.get("date");

    if (tabParam === "live") {
      setFixturesMode("live");
      _setSelectedDate(new Date());
      return;
    }

    if (dateParam) {
      const d = new Date(dateParam);
      if (!Number.isNaN(d.getTime())) {
        _setSelectedDate(d);
        setFixturesMode("date");
        return;
      }
    }

    // When at root /cricket without query params, restore mode from localStorage
    try {
      const stored = localStorage.getItem(CRICKET_FIXTURES_MODE_KEY);
      if (stored === "live") {
        setFixturesMode("live");
      } else {
        setFixturesMode("date");
      }
    } catch {
      setFixturesMode("date");
    }
    _setSelectedDate(new Date());
  }, [searchParams]);

  const [favorites, setFavorites] = useState<Record<string, boolean>>(readFavorites);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [collapsedLeagues, setCollapsedLeagues] = useState<Record<string, boolean>>({});

  const shouldShowReturnToToday = useMemo(() => {
    if (fixturesMode !== "date") return false;
    try {
      return !isToday(selectedDate ?? new Date());
    } catch {
      return false;
    }
  }, [fixturesMode, selectedDate]);

  const dateString = selectedDate ? format(selectedDate, "dd.MM.yyyy") : undefined;

  const liveQuery = useQuery({
    queryKey: ["cricketLive"],
    queryFn: () => getCricketLive(),
    enabled: fixturesMode === "live",
    refetchInterval: 30000, // refresh every 30s for live data
  });

  const fixturesQuery = useQuery({
    queryKey: ["cricketFixtures", dateString],
    queryFn: () => getUpcomingCricketFixtures(1, 100, dateString),
    enabled: fixturesMode === "date",
  });

  const matches = useMemo(() => {
    let rawItems: any[] = [];
    const responseObj = fixturesMode === "live" 
      ? liveQuery.data?.responseObject 
      : fixturesQuery.data?.responseObject;
      
    if (responseObj) {
      if (Array.isArray(responseObj)) {
        rawItems = responseObj;
      } else if (Array.isArray(responseObj.items)) {
        rawItems = responseObj.items;
      } else if (typeof responseObj === "object") {
        rawItems = Object.values(responseObj).flat();
      }
    }
    
    return rawItems.map(mapCricketMatch);
  }, [fixturesMode, liveQuery.data, fixturesQuery.data]);

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
    <SportLayout 
      leftBar={<CricketLeftBar />}
      pageBottom={
        <ReturnToToday
          show={shouldShowReturnToToday}
          onReturnToToday={() => {
            setSelectedDate(new Date());
            setFixturesMode("date");
            try {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } catch {
              // ignore
            }
          }}
        />
      }
    >
      <FixturesDateToggle
        fixturesMode={fixturesMode}
        onModeChange={handleModeChange}
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

        {(fixturesMode === "live" ? liveQuery.isLoading : fixturesQuery.isLoading) ? (
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
    </SportLayout>
  );
};

export default CricketPage;
