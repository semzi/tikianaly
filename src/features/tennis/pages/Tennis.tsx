import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import Leftbar from "@/components/layout/LeftBar";
import { RightBar } from "@/components/layout/RightBar";
import { FooterComp } from "@/components/layout/Footer";
import Category from "@/features/dashboard/components/Category";
import { SegmentedSelector } from "@/components/ui/SegmentedSelector";
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

type TennisTab = "live" | "today" | "upcoming";

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

const getStatusLabel = (status?: string): string => {
  const value = String(status ?? "").toLowerCase();

  // If not started yet (check this first!)
  if (
    value === "not started" ||
    value.includes("postponed") ||
    value.includes("cancelled")
  ) {
    return "Starts";
  }

  // If already started or in progress
  if (
    value === "live" ||
    value.includes("live") ||
    value.includes("in progress") ||
    value.includes("set")
  ) {
    return "Started";
  }

  // If finished/completed
  if (
    value.includes("finished") ||
    value.includes("completed") ||
    value.includes("ended")
  ) {
    return "Finished";
  }

  // Default
  return "Starts";
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
  return source.map(normalizeMatch);
};

const getFallbackMatches = (tab: TennisTab): TennisMatch[] => {
  if (tab === "live") return mockTennisLiveMatches;
  if (tab === "upcoming") return mockTennisUpcomingMatches;
  return mockTennisTodayMatches;
};

const Tennis = () => {
  const [activeTab, setActiveTab] = useState<TennisTab>("live");
  const [liveOverrides, setLiveOverrides] = useState<
    Record<string, TennisMatch>
  >({});
  const livestreamRef = useRef<WebSocket | null>(null);

  const tabOptions: Array<{ value: TennisTab; label: string }> = [
    { value: "live", label: "Live" },
    { value: "today", label: "Today" },
    { value: "upcoming", label: "Upcoming" },
  ];

  const query = useQuery({
    queryKey: ["tennis", activeTab],
    queryFn: async () => {
      try {
        if (activeTab === "live") {
          const data = await getTennisLiveMatches();
          const normalized = normalizeMatches(data);
          return normalized.length > 0
            ? normalized
            : getFallbackMatches("live");
        }

        const offset = activeTab === "today" ? 0 : 1;
        const data = await getTennisMatchesByDayOffset(offset);
        const normalized = normalizeMatches(data);
        return normalized.length > 0
          ? normalized
          : getFallbackMatches(activeTab);
      } catch {
        return getFallbackMatches(activeTab);
      }
    },
    staleTime: 60 * 1000,
  });

  const matches = useMemo(() => {
    const base = query.data ?? [];
    if (activeTab !== "live") return base;

    return base.map((item) => liveOverrides[item.id] ?? item);
  }, [activeTab, query.data, liveOverrides]);

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

      <div className="flex page-padding-x gap-4 pt-2">
        <div className="w-1/5 pb-30 hidden lg:block h-full overflow-y-auto hide-scrollbar">
          <Leftbar />
        </div>

        <div className="w-full lg:w-3/5 space-y-4 pb-24 lg:pb-8">
          <div className="block-style">
            <h1 className="text-xl md:text-2xl font-bold theme-text">Tennis</h1>
            <p className="text-sm text-neutral-n4 dark:text-snow-200 mt-1">
              Live updates via WebSocket with today and upcoming fixtures.
            </p>
          </div>

          <div className="block-style">
            <SegmentedSelector
              value={activeTab}
              options={tabOptions}
              onChange={(value) => setActiveTab(value)}
            />
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
                No {activeTab} matches
              </p>
              <p className="text-sm text-neutral-n4 dark:text-snow-200">
                There are no {activeTab} matches at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <article key={match.id} className="block-style">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold theme-text">
                        {match.tournament}
                      </p>
                      <p className="text-xs text-neutral-n4 dark:text-snow-200 mt-1">
                        {[match.round, match.court]
                          .filter(Boolean)
                          .join(" • ") || "Match"}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        match.isLive
                          ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-snow-200 text-neutral-n4 dark:bg-[#1F2937] dark:text-snow-200"
                      }`}
                    >
                      {getStatusLabel(match.status)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="theme-text font-medium">
                        {match.player1.name}
                      </p>
                      <p className="theme-text font-bold">
                        {match.player1.score ?? "-"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="theme-text font-medium">
                        {match.player2.name}
                      </p>
                      <p className="theme-text font-bold">
                        {match.player2.score ?? "-"}
                      </p>
                    </div>
                  </div>

                  {Array.isArray(match.setScores) &&
                    match.setScores.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {match.setScores.map((setScore, index) => (
                          <span
                            key={`${match.id}-${index}`}
                            className="text-xs px-2 py-1 rounded bg-snow-200 dark:bg-[#1F2937] theme-text"
                          >
                            S{index + 1}: {setScore.p1}-{setScore.p2}
                          </span>
                        ))}
                      </div>
                    )}

                  <p className="mt-3 text-xs text-neutral-n4 dark:text-snow-200">
                    Start: {match.startTime}
                  </p>
                </article>
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
