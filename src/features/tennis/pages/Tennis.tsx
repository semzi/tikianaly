import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  StarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  addDays,
  subDays,
  differenceInCalendarDays,
  format,
  isToday,
  startOfDay,
} from "date-fns";
import DatePicker from "react-datepicker";
import { PageHeader } from "@/components/layout/PageHeader";
import { RightBar } from "@/components/layout/RightBar";
import { FooterComp } from "@/components/layout/Footer";
import Category from "@/features/dashboard/components/Category";
import {
  getTennisLiveMatches,
  getTennisMatchesByDayOffset,
} from "@/lib/api/tennis";
import {
  closeTennisLiveStream,
  subscribeTennisLiveMatchesStream,
} from "@/lib/api/tennis/livestream";
import {
  mockTennisLiveMatches,
  mockTennisTodayMatches,
  mockTennisUpcomingMatches,
  type TennisMatch,
} from "../data/mockTennis";
import { TennisLeftBar } from "../components/TennisLeftBar";

type TennisTab = "live" | "fixture";

type TennisApiResponse = {
  responseObject?: {
    items?: any[];
  };
  items?: any[];
  matches?: any[];
};

const generateFallbackMatchId = () => {
  const rand = Math.random().toString(36).slice(2, 10);
  return `tennis-${Date.now()}-${rand}`;
};

const isLiveStatus = (status?: string) => {
  const value = String(status ?? "").toLowerCase();
  return (
    value === "live" ||
    value.includes("live") ||
    value.includes("set") ||
    value.includes("in progress")
  );
};

const normalizeMatch = (raw: any): TennisMatch => {
  const p1 =
    raw?.player1 ?? raw?.home ?? raw?.localteam ?? raw?.player?.[0] ?? {};
  const p2 =
    raw?.player2 ?? raw?.away ?? raw?.visitorteam ?? raw?.player?.[1] ?? {};

  const setScores = [1, 2, 3, 4, 5]
    .map((setIndex) => {
      const key = `s${setIndex}`;
      const p1Set = p1?.[key] ?? raw?.[`p1_${key}`] ?? "";
      const p2Set = p2?.[key] ?? raw?.[`p2_${key}`] ?? "";
      if (p1Set === "" && p2Set === "") return null;
      return { p1: p1Set, p2: p2Set };
    })
    .filter(Boolean) as Array<{ p1: string | number; p2: string | number }>;

  const status = String(raw?.status ?? raw?.state ?? "Not Started");

  return {
    id: String(
      raw?.id ?? raw?.match_id ?? raw?._id ?? generateFallbackMatchId(),
    ),
    tournament: String(
      raw?.tournament ?? raw?.league_name ?? raw?.league ?? "Tennis Match",
    ),
    round: raw?.round ?? raw?.stage,
    court: raw?.court ?? raw?.venue,
    status,
    startTime: String(raw?.time ?? raw?.startTime ?? raw?.date ?? "--:--"),
    player1: {
      id: p1?.id ? String(p1.id) : undefined,
      name: String(p1?.name ?? p1?.player_name ?? "Player 1"),
      score: p1?.totalscore ?? p1?.score ?? "-",
    },
    player2: {
      id: p2?.id ? String(p2.id) : undefined,
      name: String(p2?.name ?? p2?.player_name ?? "Player 2"),
      score: p2?.totalscore ?? p2?.score ?? "-",
    },
    setScores,
    isLive: isLiveStatus(status),
  };
};

const normalizeMatches = (
  payload: TennisApiResponse | any[],
): TennisMatch[] => {
  const source = Array.isArray(payload)
    ? payload
    : (payload?.responseObject?.items ??
      payload?.items ??
      payload?.matches ??
      []);

  if (!Array.isArray(source)) return [];

  const parseDateTime = (raw: any): number | null => {
    const dateValue = String(raw?.date ?? "").trim();
    const timeValue = String(raw?.time ?? "").trim();

    if (!dateValue && !timeValue) return null;

    let normalizedDate = dateValue;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateValue)) {
      const [day, month, year] = dateValue.split(".");
      normalizedDate = `${year}-${month}-${day}`;
    }

    const isoLike =
      `${normalizedDate}${timeValue ? ` ${timeValue}` : ""}`.trim();
    const timestamp = Date.parse(isoLike);
    return Number.isNaN(timestamp) ? null : timestamp;
  };

  const sortedSource = [...source].sort((a, b) => {
    const tsA = parseDateTime(a);
    const tsB = parseDateTime(b);
    if (tsA === null || tsB === null) return 0;
    return tsA - tsB;
  });

  return sortedSource.map(normalizeMatch);
};

const getFallbackMatches = (
  tab: TennisTab,
  selectedDate: Date | null,
): TennisMatch[] => {
  if (tab === "fixture") {
    return isToday(selectedDate ?? new Date())
      ? mockTennisTodayMatches
      : mockTennisUpcomingMatches;
  }
  return mockTennisLiveMatches;
};

const groupMatchesByTournament = (matchList: TennisMatch[]) => {
  const grouped: Record<string, { tournament: string; items: TennisMatch[] }> =
    {};

  matchList.forEach((match) => {
    const key = match.tournament || "Tennis Match";
    if (!grouped[key]) {
      grouped[key] = {
        tournament: key,
        items: [],
      };
    }
    grouped[key].items.push(match);
  });

  return Object.values(grouped);
};

const getMatchStatusDisplay = (match: TennisMatch) => {
  const rawStatus = String(match.status ?? "");
  const status = rawStatus.toLowerCase();

  const compactStartTime = (value?: string) => {
    const text = String(value ?? "").trim();
    const timeMatch = text.match(/\b\d{1,2}:\d{2}\b/);
    if (timeMatch) return timeMatch[0];
    return text || "TBD";
  };

  if (
    status.includes("live") ||
    status.includes("set") ||
    status.includes("in progress")
  ) {
    return {
      text: "Live",
      subtext: rawStatus,
      isLive: true,
    };
  }

  if (
    status.includes("finished") ||
    status.includes("completed") ||
    status.includes("ended")
  ) {
    return {
      text: "FT",
      subtext: "",
      isLive: false,
    };
  }

  return {
    text: compactStartTime(match.startTime),
    subtext: "",
    isLive: false,
  };
};

const Tennis = () => {
  const [activeTab, setActiveTab] = useState<TennisTab>("fixture");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedLeagueName, setSelectedLeagueName] = useState<string | null>(
    null,
  );
  const [liveOverrides, setLiveOverrides] = useState<
    Record<string, TennisMatch>
  >({});
  const livestreamRef = useRef<WebSocket | null>(null);

  const tabs = useMemo(() => {
    let dateLabel = "Fixture";
    if (selectedDate) {
      dateLabel = isToday(selectedDate)
        ? "Today"
        : format(selectedDate, "MMM d");
    }
    return [
      { id: "live" as TennisTab, label: "Live" },
      { id: "fixture" as TennisTab, label: dateLabel },
    ];
  }, [selectedDate]);

  const activeTabLabel =
    tabs.find((option) => option.id === activeTab)?.label?.toLowerCase() ??
    activeTab;

  const query = useQuery({
    queryKey: [
      "tennis",
      activeTab,
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
    ],
    queryFn: async () => {
      try {
        if (activeTab === "live") {
          const data = await getTennisLiveMatches();
          const normalized = normalizeMatches(data);
          return normalized.length > 0
            ? normalized
            : getFallbackMatches("live", selectedDate);
        }

        const offset = differenceInCalendarDays(
          startOfDay(selectedDate ?? new Date()),
          startOfDay(new Date()),
        );
        const data = await getTennisMatchesByDayOffset(offset);
        const normalized = normalizeMatches(data);
        return normalized.length > 0
          ? normalized
          : getFallbackMatches(activeTab, selectedDate);
      } catch {
        return getFallbackMatches(activeTab, selectedDate);
      }
    },
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    try {
      if (!isToday(selectedDate ?? new Date())) {
        setActiveTab("fixture");
      }
    } catch {
      // ignore date comparison errors
    }
  }, [selectedDate]);

  const matches = useMemo(() => {
    const base = query.data ?? [];
    const merged =
      activeTab === "live"
        ? base.map((item) => liveOverrides[item.id] ?? item)
        : base;

    if (!selectedLeagueName) return merged;
    const selected = selectedLeagueName.toLowerCase();

    return merged.filter((match) =>
      String(match.tournament ?? "")
        .toLowerCase()
        .includes(selected),
    );
  }, [activeTab, query.data, liveOverrides, selectedLeagueName]);

  const groupedMatches = useMemo(
    () => groupMatchesByTournament(matches),
    [matches],
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (activeTab !== "live") {
      closeTennisLiveStream(livestreamRef.current);
      livestreamRef.current = null;
      return;
    }

    const ws = subscribeTennisLiveMatchesStream({
      onUpdate: (payload) => {
        const normalized = normalizeMatches(payload);
        if (normalized.length === 0) return;

        setLiveOverrides((current) => {
          const next = { ...current };
          for (const match of normalized) {
            next[match.id] = match;
          }
          return next;
        });
      },
    });

    livestreamRef.current = ws;

    return () => {
      closeTennisLiveStream(ws);
      livestreamRef.current = null;
    };
  }, [activeTab]);

  return (
    <div className="dark:bg-[#0D1117] min-h-screen bg-[#f6f6f6] md:pb-3">
      <PageHeader />
      <Category />

      <div className="flex page-padding-x gap-5 py-5 justify-around">
        <section className="h-full pb-30 overflow-y-auto hide-scrollbar w-1/5 hidden lg:block pr-2">
          <TennisLeftBar
            selectedLeagueName={selectedLeagueName}
            onSelectLeagueName={setSelectedLeagueName}
          />
        </section>

        <div className="w-full pb-30 flex flex-col gap-y-3 md:gap-y-5 lg:w-3/5 h-full overflow-y-auto hide-scrollbar pr-2">
          <div className="block-style flex flex-col gap-4">
            <div className="relative flex items-center justify-between dark:text-snow-200">
              <ArrowLeftIcon
                className="h-5 w-5 transition-colors text-neutral-n4 cursor-pointer hover:text-brand-secondary"
                onClick={() => {
                  setSelectedDate((prev) => subDays(prev || new Date(), 1));
                }}
              />
              <div
                className="flex gap-3 items-center cursor-pointer hover:text-brand-secondary"
                onClick={() => setShowDatePicker((prev) => !prev)}
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

            <div className="relative flex w-full bg-snow-200 dark:bg-[#1F2937] rounded-full p-1">
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

          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="block-style animate-pulse h-28 bg-snow-100 dark:bg-[#1F2937]"
                />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="block-style text-center py-12">
              <div className="text-6xl mb-4">🎾</div>
              <p className="text-lg font-semibold theme-text mb-2">
                No {activeTabLabel} matches
              </p>
              <p className="text-sm text-neutral-n4 dark:text-snow-200">
                {selectedLeagueName
                  ? "No matches found for the selected league and filters."
                  : `There are no ${activeTabLabel} matches at the moment.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groupedMatches.map((group) => (
                <div
                  key={group.tournament}
                  className="block-style !p-0 overflow-hidden"
                >
                  <div className="flex gap-3 border-b px-5 py-3 border-snow-200 dark:border-[#1F2937] bg-gradient-to-r from-brand-primary/0 via-transparent to-orange-500/10 dark:from-brand-primary/20 dark:to-orange-500/20">
                    <p className="font-[500] text-[#23272A] dark:text-neutral-m6 text-[14px] md:text-base">
                      {group.tournament}
                    </p>
                    <ArrowRightIcon className="w-5 h-5 ml-auto text-brand-secondary" />
                  </div>

                  <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                    {group.items.map((match) => {
                      const statusDisplay = getMatchStatusDisplay(match);
                      const showScores =
                        match.player1.score !== undefined &&
                        match.player1.score !== "" &&
                        match.player2.score !== undefined &&
                        match.player2.score !== "";

                      return (
                        <div
                          key={match.id}
                          className="hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors dark:border-[#1F2937] border-snow-200/70 last:border-b-0"
                        >
                          <div className="hidden md:flex items-center gap-4 px-5 py-4">
                            <div className="w-12 text-center">
                              <p
                                className={`text-xs font-bold ${
                                  statusDisplay.isLive ||
                                  statusDisplay.text === "FT"
                                    ? "text-brand-secondary"
                                    : "theme-text opacity-70"
                                }`}
                              >
                                {statusDisplay.text}
                              </p>
                            </div>

                            <div className="flex-1 flex items-center gap-4">
                              <div className="flex-1 flex items-center justify-end gap-2">
                                <span className="text-sm font-medium theme-text text-right">
                                  {match.player1.name}
                                </span>
                              </div>

                              <div className="w-20 flex justify-center gap-3">
                                <span className="font-bold text-sm theme-text neutral-n1 whitespace-nowrap text-center py-0.5 px-2 text-xs dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">
                                  {showScores ? match.player1.score : "-"}
                                </span>
                                <span className="font-bold text-sm theme-text neutral-n1 whitespace-nowrap text-center py-0.5 px-2 text-xs dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">
                                  {showScores ? match.player2.score : "-"}
                                </span>
                              </div>

                              <div className="flex-1 flex items-center justify-start gap-2">
                                <span className="text-sm font-medium theme-text">
                                  {match.player2.name}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleFavorite(match.id);
                              }}
                              className={`p-1.5 rounded-full transition-all ${
                                favorites[match.id]
                                  ? "bg-brand-primary text-white scale-110 shadow-md"
                                  : "text-neutral-n4 hover:bg-snow-200 dark:hover:bg-white/10"
                              }`}
                            >
                              <StarIcon className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex md:hidden items-center justify-between px-3 py-3">
                            <div className="flex flex-1 items-center">
                              <div className="w-12 text-center">
                                <p
                                  className={`text-xs font-bold ${
                                    statusDisplay.isLive ||
                                    statusDisplay.text === "FT"
                                      ? "text-brand-secondary"
                                      : "theme-text opacity-70"
                                  }`}
                                >
                                  {statusDisplay.text}
                                </p>
                              </div>

                              <div className="flex-1 flex flex-col gap-2 mx-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium theme-text">
                                    {match.player1.name}
                                  </span>
                                  <span className="font-bold text-sm theme-text neutral-n1 whitespace-nowrap text-center py-0.5 px-2 text-xs dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">
                                    {showScores ? match.player1.score : "-"}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium theme-text">
                                    {match.player2.name}
                                  </span>
                                  <span className="font-bold text-sm theme-text neutral-n1 whitespace-nowrap text-center py-0.5 px-2 text-xs dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">
                                    {showScores ? match.player2.score : "-"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleFavorite(match.id);
                              }}
                              className={`p-2 rounded transition-all ${
                                favorites[match.id]
                                  ? "bg-brand-primary text-white"
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
              ))}
            </div>
          )}
        </div>

        <div className="w-1/5 pb-30 hidden lg:block h-full overflow-y-auto hide-scrollbar">
          <RightBar />
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default Tennis;
