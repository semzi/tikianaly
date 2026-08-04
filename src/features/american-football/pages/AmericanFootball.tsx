import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import {
  addDays,
  format,
  isToday,
  isYesterday,
  isTomorrow,
  subDays,
} from "date-fns";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { RightBar } from "@/components/layout/RightBar";
import { FooterComp } from "@/components/layout/Footer";
import Category from "@/features/dashboard/components/Category";
import { navigate } from "@/lib/router/navigate";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { AmericanFootballLeftBar } from "../components/AmericanFootballLeftBar";
import {
  mockAmericanFootballLiveMatches,
  mockAmericanFootballUpcomingMatches,
  type AmericanFootballMatch,
} from "../data/mockAmericanFootball";
import {
  getAmericanFootballFixturesByDate,
  getAmericanFootballLiveMatches,
  isAmericanFootballApiEnabled,
  normalizeAmericanFootballMatches,
} from "@/lib/api/american-football";

const FAVORITES_STORAGE_KEY = "american_football_favorite_matches_v1";

type AmericanFootballTab = "live" | "fixture";

const readFavorites = (): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const groupMatchesByLeague = (matches: AmericanFootballMatch[]) => {
  const grouped: Record<string, AmericanFootballMatch[]> = {};
  matches.forEach((match) => {
    const league = match.league || "American Football";
    grouped[league] ??= [];
    grouped[league].push(match);
  });
  return Object.entries(grouped).map(([league, items]) => ({ league, items }));
};

const splitScore = (score: string) => {
  const [home = "-", away = "-"] = String(score || "- -").split("-");
  return [home.trim() || "-", away.trim() || "-"] as const;
};

const quarterTotal = (values: (string | number)[]) =>
  values.reduce<number>((sum, v) => {
    const n = typeof v === "number" ? v : parseInt(String(v), 10);
    return Number.isFinite(n) ? sum + n : sum;
  }, 0);

const QuarterTooltipContent = ({ match }: { match: AmericanFootballMatch }) => {
  if (!match.quarters) return null;
  const { home, away } = match.quarters;

  const row = (label: string, values: (string | number)[], total: number) => (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[10px] font-semibold text-neutral-n4 dark:text-snow-200/50 w-4">
        {label}
      </span>
      <div className="flex items-center justify-end gap-3 flex-1">
        <div className="flex items-center gap-3">
          {values.map((q, i) => (
            <span
              key={i}
              className="font-bold text-sm theme-text w-4 text-center"
            >
              {q}
            </span>
          ))}
        </div>
        <span className="font-bold text-sm text-brand-secondary w-6 text-center ml-2">
          {total}
        </span>
      </div>
    </div>
  );

  const header = (label: string) => (
    <div className="flex items-center justify-between gap-3">
      <span className="w-4" />
      <div className="flex items-center justify-end gap-3 flex-1">
        <div className="flex items-center gap-3">
          {["Q1", "Q2", "Q3", "Q4"].map((q) => (
            <span
              key={q}
              className="text-[10px] font-semibold text-neutral-n4 dark:text-snow-200/50 w-4 text-center"
            >
              {q}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-semibold text-neutral-n4 dark:text-snow-200/50 w-6 text-center ml-2">
          {label}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {header("T")}
      {row("H", home, quarterTotal(home))}
      {row("A", away, quarterTotal(away))}
    </div>
  );
};

const getStatus = (
  match: AmericanFootballMatch,
  activeTab: AmericanFootballTab,
) => {
  if (activeTab === "live" || match.status.toLowerCase().includes("live")) {
    return { text: match.period || "Live", isLive: true };
  }
  if (match.status.toLowerCase().includes("finished")) {
    return { text: "FT", isLive: false };
  }
  return { text: match.kickoff || "TBD", isLive: false };
};

const AmericanFootballPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<AmericanFootballTab>("fixture");

  // --- Calendar state (ported from Football dashboard's CustomDatePicker pattern) ---
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

  const setSelectedDate = useCallback(
    (dateOrUpdater: Date | null | ((prev: Date | null) => Date | null)) => {
      _setSelectedDate((prev) => {
        const newDate =
          typeof dateOrUpdater === "function"
            ? dateOrUpdater(prev)
            : dateOrUpdater;
        setSearchParams(
          (prevParams) => {
            if (newDate && !isToday(newDate)) {
              prevParams.set("date", format(newDate, "yyyy-MM-dd"));
            } else {
              prevParams.delete("date");
            }
            return prevParams;
          },
          { replace: true },
        );
        return newDate;
      });
    },
    [setSearchParams],
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  // --- end calendar state ---

  const [favorites, setFavorites] =
    useState<Record<string, boolean>>(readFavorites);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [collapsedLeagues, setCollapsedLeagues] = useState<
    Record<string, boolean>
  >({});
  const [selectedLeagueName, setSelectedLeagueName] = useState<string | null>(
    null,
  );

  // Mouse-following Q1–Q4 tooltip (desktop only; mobile keeps click-through).
  const [quarterTooltip, setQuarterTooltip] = useState<{
    match: AmericanFootballMatch;
    x: number;
    y: number;
  } | null>(null);

  const trackQuarterTooltip =
    (match: AmericanFootballMatch) => (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!match.quarters) return;
      // Hover does not exist on touch — skip so taps navigate straight to detail.
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      const OFFSET = 14;
      const WIDTH = 210;
      const HEIGHT = 96;
      let x = event.clientX + OFFSET;
      let y = event.clientY + OFFSET;
      if (x + WIDTH > window.innerWidth) x = event.clientX - WIDTH - OFFSET;
      if (y + HEIGHT > window.innerHeight) y = event.clientY - HEIGHT - OFFSET;
      setQuarterTooltip({ match, x, y });
    };

  const hideQuarterTooltip = () => setQuarterTooltip(null);

  const tabs = useMemo(
    () => [
      { id: "live" as AmericanFootballTab, label: "Live" },
      {
        id: "fixture" as AmericanFootballTab,
        label:
          selectedDate && isToday(selectedDate)
            ? "Today"
            : selectedDate
              ? format(selectedDate, "MMM d")
              : "Fixture",
      },
    ],
    [selectedDate],
  );

  const matchesQuery = useQuery({
    queryKey: [
      "american-football",
      activeTab,
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
    ],
    enabled: isAmericanFootballApiEnabled,
    queryFn: async () => {
      const payload =
        activeTab === "live"
          ? await getAmericanFootballLiveMatches()
          : await getAmericanFootballFixturesByDate(
              format(selectedDate ?? new Date(), "yyyy-MM-dd"),
            );
      return normalizeAmericanFootballMatches(payload);
    },
    staleTime: activeTab === "live" ? 20_000 : 60 * 60 * 1000,
    refetchInterval: activeTab === "live" ? 20_000 : false,
  });

  const allMatches = useMemo(() => {
    const fallback =
      activeTab === "live"
        ? mockAmericanFootballLiveMatches
        : mockAmericanFootballUpcomingMatches;
    return matchesQuery.data?.length ? matchesQuery.data : fallback;
  }, [activeTab, matchesQuery.data]);

  const matches = useMemo(() => {
    if (!selectedLeagueName) return allMatches;
    return allMatches.filter((match) =>
      match.league.toLowerCase().includes(selectedLeagueName.toLowerCase()),
    );
  }, [allMatches, selectedLeagueName]);

  const groupedMatches = useMemo(
    () => groupMatchesByLeague(matches),
    [matches],
  );
  const favoriteMatches = useMemo(
    () => matches.filter((match) => favorites[match.id]),
    [matches, favorites],
  );

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage can be unavailable in private browsing contexts.
    }
  }, [favorites]);

  useEffect(() => {
    if (favoriteMatches.length) setFavoritesOpen(true);
  }, [favoriteMatches.length]);

  useEffect(() => {
    if (!isToday(selectedDate ?? new Date())) setActiveTab("fixture");
  }, [selectedDate]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => ({ ...current, [id]: !current[id] }));
  };

  const openMatch = (match: AmericanFootballMatch) => {
    navigate(`/american-football/match/${encodeURIComponent(match.id)}`, {
      state: { match },
    });
  };

  const matchRow = (match: AmericanFootballMatch, compact = false) => {
    const status = getStatus(match, activeTab);
    const [homeScore, awayScore] = splitScore(match.score);
    const score = (value: string) => (
      <span className="font-bold text-xs py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">
        {value}
      </span>
    );

    if (compact) {
      return (
        <div
          key={`fav-${match.id}`}
          className="hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors px-5 py-3 cursor-pointer"
          onClick={() => openMatch(match)}
        >
          <div className="flex items-center gap-4">
            <p
              className={`text-xs font-bold w-16 text-center ${status.isLive || status.text === "FT" ? "text-brand-secondary" : "theme-text opacity-70"}`}
            >
              {status.text}
            </p>
            <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
              <p className="text-sm font-medium theme-text truncate">
                {match.homeTeam} vs {match.awayTeam}
              </p>
              <div className="flex items-center gap-2">
                {score(homeScore)}
                {score(awayScore)}
              </div>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleFavorite(match.id);
              }}
              className="p-1.5 rounded-full bg-brand-primary text-white"
              aria-label="Remove from starred matches"
            >
              <StarSolidIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={match.id}
        className="hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors cursor-pointer"
        onClick={() => openMatch(match)}
        onMouseEnter={trackQuarterTooltip(match)}
        onMouseMove={trackQuarterTooltip(match)}
        onMouseLeave={hideQuarterTooltip}
      >
        <div className="hidden md:flex items-center gap-4 px-5 py-4">
          <p
            className={`text-xs font-bold w-16 text-center ${status.isLive || status.text === "FT" ? "text-brand-secondary" : "theme-text opacity-70"}`}
          >
            {status.text}
          </p>
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1 text-right text-sm font-medium theme-text">
              {match.homeTeam}
            </div>
            <div className="w-20 flex justify-center gap-3">
              {score(homeScore)}
              {score(awayScore)}
            </div>
            <div className="flex-1 text-sm font-medium theme-text">
              {match.awayTeam}
            </div>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleFavorite(match.id);
            }}
            className={`p-1.5 rounded-full transition-all ${favorites[match.id] ? "bg-brand-primary text-white scale-110 shadow-md" : "text-neutral-n4 hover:bg-snow-200 dark:hover:bg-white/10"}`}
            aria-label="Toggle favourite"
          >
            {favorites[match.id] ? (
              <StarSolidIcon className="w-4 h-4" />
            ) : (
              <StarIcon className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex md:hidden items-center gap-3 px-3 py-3">
          <p
            className={`text-xs font-bold w-14 text-center ${status.isLive || status.text === "FT" ? "text-brand-secondary" : "theme-text opacity-70"}`}
          >
            {status.text}
          </p>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between gap-3 text-sm font-medium theme-text">
              <span>{match.homeTeam}</span>
              {score(homeScore)}
            </div>
            <div className="flex justify-between gap-3 text-sm font-medium theme-text">
              <span>{match.awayTeam}</span>
              {score(awayScore)}
            </div>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleFavorite(match.id);
            }}
            className={`p-2 rounded transition-all ${favorites[match.id] ? "bg-brand-primary text-white" : "text-neutral-n4 hover:bg-snow-200 dark:hover:bg-white/10"}`}
            aria-label="Toggle favourite"
          >
            {favorites[match.id] ? (
              <StarSolidIcon className="w-4 h-4" />
            ) : (
              <StarIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dark:bg-[#0D1117] min-h-screen bg-[#f6f6f6] md:pb-3">
      <PageHeader />
      <Category />
      <div className="flex page-padding-x gap-5 py-5 justify-around">
        <section className="h-full pb-30 overflow-y-auto hide-scrollbar w-1/5 hidden lg:block pr-2">
          <AmericanFootballLeftBar
            selectedLeagueName={selectedLeagueName}
            onSelectLeagueName={setSelectedLeagueName}
          />
        </section>
        <div className="w-full pb-30 flex flex-col gap-y-3 md:gap-y-5 lg:w-3/5 h-full overflow-y-auto hide-scrollbar pr-2">
          <div className="block-style flex flex-col gap-4">
            <div className="relative flex items-center justify-between dark:text-snow-200">
              <ArrowLeftIcon
                className="h-5 w-5 transition-colors text-neutral-n4 cursor-pointer hover:text-brand-secondary"
                onClick={() =>
                  setSelectedDate((date) => subDays(date || new Date(), 1))
                }
              />
              <div
                className="flex gap-3 items-center cursor-pointer hover:text-brand-secondary"
                onClick={() => setShowDatePicker((open) => !open)}
              >
                <p className="font-semibold theme-text">
                  {selectedDate
                    ? isToday(selectedDate)
                      ? "Today"
                      : isYesterday(selectedDate)
                        ? "Yesterday"
                        : isTomorrow(selectedDate)
                          ? "Tomorrow"
                          : format(selectedDate, "EEE, MMM d, yyyy")
                    : "Select Date"}
                </p>
                <CalendarIcon className="h-5 w-5 text-neutral-n4" />
              </div>
              <ArrowRightIcon
                className="h-5 w-5 transition-colors text-neutral-n4 cursor-pointer hover:text-brand-secondary"
                onClick={() =>
                  setSelectedDate((date) => addDays(date || new Date(), 1))
                }
              />
              {showDatePicker ? (
                <div className="absolute z-50 top-full mt-2 lg:left-1/2 lg:-translate-x-1/2 right-0 lg:right-auto">
                  <CustomDatePicker
                    selectedDate={selectedDate}
                    onChange={(date: Date) => {
                      setSelectedDate(date);
                      setActiveTab("fixture");
                      setShowDatePicker(false);
                    }}
                  />
                </div>
              ) : null}
            </div>
            <div className="relative flex w-full bg-snow-200 dark:bg-[#1F2937] rounded-full p-1">
              <div
                className="absolute top-1 bottom-1 rounded-full bg-brand-secondary transition-all duration-300 ease-in-out"
                style={{
                  width: "calc(50% - 4px)",
                  left: `calc(${activeTab === "live" ? 0 : 1} * 50% + 2px)`,
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${activeTab === tab.id ? "text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {matches.length === 0 ? (
            <div className="block-style text-center py-12">
              <div className="text-6xl mb-4">🏈</div>
              <p className="text-lg font-semibold theme-text mb-2">
                No {activeTab === "live" ? "live" : "fixture"} matches
              </p>
              <p className="text-sm text-neutral-n4 dark:text-snow-200">
                {selectedLeagueName
                  ? "No matches found for the selected league and filters."
                  : "There are no matches at the moment."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteMatches.length ? (
                <div className="block-style !p-0 overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 border-b px-5 py-3 border-snow-200 dark:border-[#1F2937]"
                    onClick={() => setFavoritesOpen((open) => !open)}
                  >
                    <p className="font-[600] text-[#23272A] dark:text-neutral-m6 text-[14px] md:text-base">
                      Starred Matches ({favoriteMatches.length})
                    </p>
                    <ChevronDownIcon
                      className={`w-5 h-5 ml-auto text-brand-secondary transition-transform ${favoritesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {favoritesOpen ? (
                    <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                      {favoriteMatches.map((match) => matchRow(match, true))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {groupedMatches.map(({ league, items }) => (
                <div key={league} className="block-style !p-0 overflow-hidden">
                  <div className="flex gap-3 border-b px-5 py-3 border-snow-200 dark:border-[#1F2937] bg-gradient-to-r from-brand-primary/0 via-transparent to-orange-500/10 dark:from-brand-primary/20 dark:to-orange-500/20">
                    <button
                      type="button"
                      className="font-[500] text-[#23272A] dark:text-neutral-m6 text-[14px] md:text-base hover:text-brand-primary"
                      onClick={() => setSelectedLeagueName(league)}
                    >
                      {league}
                    </button>
                    <button
                      type="button"
                      className="ml-auto"
                      onClick={() =>
                        setCollapsedLeagues(
                          (current: Record<string, boolean>) => ({
                            ...current,
                            [league]: !current[league],
                          }),
                        )
                      }
                      aria-label="Toggle league matches"
                    >
                      <ChevronDownIcon
                        className={`w-5 h-5 text-brand-secondary transition-transform ${collapsedLeagues[league] ? "" : "rotate-180"}`}
                      />
                    </button>
                  </div>
                  {!collapsedLeagues[league] ? (
                    <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                      {items.map((match) => matchRow(match))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-1/5 pb-30 hidden lg:block h-full overflow-y-auto hide-scrollbar">
          <RightBar />
        </div>
      </div>
      <FooterComp />
      {quarterTooltip ? (
        <div
          className="fixed z-50 hidden md:block pointer-events-none"
          style={{ left: quarterTooltip.x, top: quarterTooltip.y }}
        >
          <div className="rounded-xl border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22] shadow-2xl px-4 py-3">
            <QuarterTooltipContent match={quarterTooltip.match} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AmericanFootballPage;
