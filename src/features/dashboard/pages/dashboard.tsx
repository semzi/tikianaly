import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getFixtureDetails, getFootballFixturesByDate } from "@/lib/api/endpoints";
import {
  closeLiveStream,
  subscribeDashboardLiveFixtures,
  type DashboardLiveFixture,
} from "@/lib/api/livestream";
import { useToast } from "@/context/ToastContext";
import { FixturesDateToggle } from "@/components/ui/FixturesDateToggle";
import ReturnToToday from "@/components/ui/ReturnToToday";
import { isToday, format } from "date-fns";
import {
  ArrowRightIcon,
  InboxIcon,
  ChevronDownIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Leftbar from "@/components/layout/LeftBar";
import { SportLayout } from "@/components/layout/SportLayout";
import { Link, useSearchParams } from "react-router-dom";
// import { AfconBanner } from "@/features/dashboard/components/AfconBanner";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import Image from "@/components/common/Image";
import { getMatchUiInfo } from "@/lib/matchStatusUi";
import { navigate } from "@/lib/router/navigate";
import { useQueryClient } from "@tanstack/react-query";

// Number of league groups fetched per request in date mode. Kept below the
// API max (100) so the list loads progressively as the user scrolls.
const DATE_FIXTURES_PAGE_SIZE = 40;

// Shimmer skeleton loader component with sleek animation
const Skeleton = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden bg-snow-200 dark:bg-[#1F2937] rounded ${className}`}
    style={{ minHeight: "1em" }}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
  </div>
);

const AnimatedScore = ({
  value,
  className = "",
}: {
  value: string | number | null | undefined;
  className?: string;
}) => {
  const toNum = (v: string | number | null | undefined) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const current = toNum(value);
  const prevRef = useRef<number>(current);
  const [bumpKey, setBumpKey] = useState(0);

  useEffect(() => {
    const prev = prevRef.current;
    if (current > prev) {
      setBumpKey((k) => k + 1);
    }
    prevRef.current = current;
  }, [current]);

  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <span className="opacity-0 select-none">{current}</span>
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          key={bumpKey}
          className={bumpKey > 0 ? "score-bump" : ""}
        >
          {current}
        </span>
      </span>
      <style>{`
        @keyframes scoreBumpIn {
          0% { transform: translateY(-14px); opacity: 0; background: rgba(34,197,94,0.0); }
          20% { opacity: 1; }
          40% { background: rgba(34,197,94,0.25); }
          100% { transform: translateY(0); opacity: 1; background: rgba(34,197,94,0.0); }
        }
        .score-bump {
          padding: 0 6px;
          border-radius: 6px;
          animation: scoreBumpIn 450ms ease-out;
        }
      `}</style>
    </span>
  );
};

export const dashboard = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [sseRevision, setSseRevision] = useState(0);
  const liveEventSourceRef = useRef<EventSource | null>(null);
  const leagueFixturesMapRef = useRef<Map<number, any[]>>(new Map());
  const flushFixturesTimeoutRef = useRef<number | null>(null);
  // Infinite scroll pagination for date-mode fixtures
  const dateNextPageRef = useRef<number>(2);
  const dateHasMoreRef = useRef<boolean>(true);
  const dateLoadingMoreRef = useRef<boolean>(false);
  const [dateLoadingMore, setDateLoadingMore] = useState(false);
  const latestSseUpdatesRef = useRef<{
    byStaticId: Map<string, any>;
    byMatchId: Map<string, any>;
    byFixtureId: Map<string, any>;
  }>({ byStaticId: new Map(), byMatchId: new Map(), byFixtureId: new Map() });

  const queryClient = useQueryClient();

  const isInSseStream = (game: any) => {
    const staticIdKey = game?.static_id ? String(game.static_id) : "";
    const matchIdKey = game?.match_id ? String(game.match_id) : "";
    const fixtureIdKey = game?.fixture_id ? String(game.fixture_id) : "";
    const { byStaticId, byMatchId, byFixtureId } = latestSseUpdatesRef.current;
    return (
      (staticIdKey && byStaticId.has(staticIdKey)) ||
      (matchIdKey && byMatchId.has(matchIdKey)) ||
      (fixtureIdKey && byFixtureId.has(fixtureIdKey))
    );
  };

  const sortFixturesLiveFirst = (games: any[]) => {
    const safe = Array.isArray(games) ? [...games] : [];
    safe.sort((a: any, b: any) => {
      const aUi = getMatchUiInfo({ status: a?.status, timer: a?.timer });
      const bUi = getMatchUiInfo({ status: b?.status, timer: b?.timer });
      const rank = (ui: { state: string }) => {
        if (ui.state === "timer" || ui.state === "ht") return 0; // live
        if (ui.state === "ft") return 1; // finished
        return 2; // upcoming
      };

      const aRank = rank(aUi);
      const bRank = rank(bUi);
      if (aRank !== bRank) return aRank - bRank;

      const aMs = a?.date ? new Date(a.date).getTime() : NaN;
      const bMs = b?.date ? new Date(b.date).getTime() : NaN;
      if (Number.isFinite(aMs) && Number.isFinite(bMs)) return aMs - bMs;
      if (Number.isFinite(aMs)) return -1;
      if (Number.isFinite(bMs)) return 1;
      return 0;
    });
    return safe;
  };

  const getStatusLabel = (game: any, ui: { state: string; minutes: number }) => {
    const rawStatus = String(game?.status ?? "").trim();
    const s = rawStatus.toLowerCase();
    if (s === "postp." || s === "postponed" || s.includes("postp")) return "Postp.";
    if (ui.state === "ft") return "FT";
    if (ui.state === "ht") return "HT";
    if (ui.state === "timer") return `${ui.minutes}'`;
    return getDateModeTimeLabel(game);
  };

  const getPenaltyInfo = (game: any) => {
    const rawStatus = String(game?.status ?? "").trim().toLowerCase();
    const homePen = Number(String(game?.localteam?.pen_score ?? "").trim());
    const awayPen = Number(String(game?.visitorteam?.pen_score ?? "").trim());
    const hasPensByScore = Number.isFinite(homePen) && Number.isFinite(awayPen) && (homePen > 0 || awayPen > 0);
    const hasPensByStatus = rawStatus === "pen" || rawStatus.startsWith("pen");
    const show = hasPensByScore || hasPensByStatus;

    let winner: "localteam" | "visitorteam" | null = null;
    if (Number.isFinite(homePen) && Number.isFinite(awayPen)) {
      if (homePen > awayPen) winner = "localteam";
      if (awayPen > homePen) winner = "visitorteam";
    }

    return {
      show,
      homePen: Number.isFinite(homePen) ? homePen : null,
      awayPen: Number.isFinite(awayPen) ? awayPen : null,
      winner,
    };
  };

  const getDateModeTimeLabel = (game: any) => {
    const useTimer = isInSseStream(game);
    if (useTimer) return game?.timer;

    const rawIso = game?.date;
    if (rawIso) {
      const d = new Date(rawIso);
      if (!Number.isNaN(d.getTime())) {
        return format(d, "HH:mm");
      }
    }

    return game?.time ?? game?.timer;
  };
  const [loadingLeagueIds, setLoadingLeagueIds] = useState<Set<number>>(
    () => new Set()
  );
  const [fixturesMode, setFixturesMode] = useState<"live" | "date">(() => {
    try {
      const stored = localStorage.getItem("dashboard_fixtures_mode");
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

  const setSelectedDate = useCallback((dateOrUpdater: Date | null | ((prev: Date | null) => Date | null)) => {
    const prev = selectedDateRef.current;
    const newDate = typeof dateOrUpdater === 'function' ? dateOrUpdater(prev) : dateOrUpdater;
    
    _setSelectedDate(newDate);
    
    if (newDate && !isToday(newDate)) {
      setSearchParams(prevParams => {
        prevParams.set("date", format(newDate, 'yyyy-MM-dd'));
        return prevParams;
      }, { replace: false });
    } else {
      setSearchParams(prevParams => {
        prevParams.delete("date");
        return prevParams;
      }, { replace: false });
    }
  }, [setSearchParams]);

  // Sync state with URL when navigating back/forward
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const d = new Date(dateParam);
      if (!Number.isNaN(d.getTime())) {
        _setSelectedDate(d);
        setFixturesMode("date");
        return;
      }
    }
    _setSelectedDate(new Date());
  }, [searchParams]);

  const COLLAPSED_LEAGUES_KEY = "dashboard_collapsed_leagues_v2";
  const [userToggledLeagues, setUserToggledLeagues] = useState<Record<string, Record<number, boolean>>>(() => {
    try {
      if (typeof window === "undefined") return {};
      const raw = localStorage.getItem(COLLAPSED_LEAGUES_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(COLLAPSED_LEAGUES_KEY, JSON.stringify(userToggledLeagues));
    } catch {
      // ignore storage errors
    }
  }, [userToggledLeagues]);

  const dateKey = useMemo(() => format(selectedDate || new Date(), 'yyyy-MM-dd'), [selectedDate]);

  const isLeagueCollapsed = useCallback((leagueId: number, fixtureCount: number) => {
    const dayToggles = userToggledLeagues[dateKey] || {};
    if (dayToggles[leagueId] !== undefined) {
      return dayToggles[leagueId];
    }
    return fixtureCount >= 10;
  }, [userToggledLeagues, dateKey]);

  const toggleLeagueCollapse = useCallback((leagueId: number, fixtureCount: number) => {
    setUserToggledLeagues(prev => {
      const dayToggles = prev[dateKey] || {};
      return {
        ...prev,
        [dateKey]: {
          ...dayToggles,
          [leagueId]: !isLeagueCollapsed(leagueId, fixtureCount)
        }
      };
    });
  }, [isLeagueCollapsed, dateKey]);

  const shouldShowReturnToToday = useMemo(() => {
    if (fixturesMode !== "date") return false;
    try {
      return !isToday(selectedDate ?? new Date());
    } catch {
      return false;
    }
  }, [fixturesMode, selectedDate]);

  // Auto-switch to fixtures tab when date is not today
  useEffect(() => {
    try {
      if (!isToday(selectedDate ?? new Date())) {
        setFixturesMode("date");
      }
    } catch {
      // ignore date comparison errors
    }
  }, [selectedDate]);

  const selectedDateKey = useMemo(() => {
    try {
      return format(selectedDate ?? new Date(), "yyyy-MM-dd");
    } catch {
      return format(new Date(), "yyyy-MM-dd");
    }
  }, [selectedDate]);

  const PINNED_STORAGE_KEY = "dashboard_pinned_fixtures_v1";
  const readPinnedStore = (): Record<string, Array<string | number>> => {
    try {
      const raw = localStorage.getItem(PINNED_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const writePinnedStore = (next: Record<string, Array<string | number>>) => {
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [pinnedRevision, setPinnedRevision] = useState(0);
  const [pinnedLoading, setPinnedLoading] = useState(false);
  const [pinnedFixtures, setPinnedFixtures] = useState<any[]>([]);

  const pinnedFixtureIds = useMemo(() => {
    if (typeof window === "undefined") return [] as Array<string | number>;
    const store = readPinnedStore();
    const list = store?.[selectedDateKey] ?? [];
    return Array.isArray(list) ? list : [];
  }, [selectedDateKey, pinnedRevision]);

  const isPinnedFixtureId = useCallback(
    (fixtureId: any) => {
      if (!fixtureId) return false;
      return pinnedFixtureIds.some((x) => String(x) === String(fixtureId));
    },
    [pinnedFixtureIds]
  );

  const togglePinnedFixture = useCallback(
    (fixtureId: any) => {
      if (typeof window === "undefined") return;
      if (!fixtureId) return;
      const store = readPinnedStore();
      const current = Array.isArray(store?.[selectedDateKey]) ? store[selectedDateKey] : [];
      const exists = current.some((x) => String(x) === String(fixtureId));
      const nextList = exists
        ? current.filter((x) => String(x) !== String(fixtureId))
        : [...current, fixtureId];
      const next = { ...store, [selectedDateKey]: nextList };
      writePinnedStore(next);
      setPinnedRevision((v) => v + 1);
      if (!exists) setPinnedOpen(true);
    },
    [selectedDateKey]
  );

  const extractFixtureDetails = (resp: any) => {
    const root = resp?.responseObject ?? resp?.data ?? resp;

    const tryGetFirst = (v: any) => {
      if (!v) return null;
      if (Array.isArray(v)) return v[0] ?? null;
      if (typeof v === "object") {
        const arr = (v as any)?.item ?? (v as any)?.items ?? (v as any)?.fixtures ?? null;
        if (Array.isArray(arr)) return arr[0] ?? null;
      }
      return v;
    };

    return (
      resp?.responseObject?.item?.[0] ??
      tryGetFirst(root?.item) ??
      tryGetFirst(root?.items) ??
      root?.fixture ??
      root?.match ??
      root
    );
  };

  const normalizeFixtureTeams = (fixture: any) => {
    if (!fixture || typeof fixture !== "object") return fixture;

    const homeName = fixture?.localteam?.name ?? fixture?.localteam_name ?? fixture?.homeTeam?.name ?? fixture?.home_name;
    const awayName = fixture?.visitorteam?.name ?? fixture?.visitorteam_name ?? fixture?.awayTeam?.name ?? fixture?.away_name;

    const localteam = fixture?.localteam && typeof fixture.localteam === "object"
      ? fixture.localteam
      : homeName
        ? { name: homeName, id: fixture?.localteam_id ?? fixture?.home_id ?? fixture?.homeTeam?.id }
        : fixture?.localteam;

    const visitorteam = fixture?.visitorteam && typeof fixture.visitorteam === "object"
      ? fixture.visitorteam
      : awayName
        ? { name: awayName, id: fixture?.visitorteam_id ?? fixture?.away_id ?? fixture?.awayTeam?.id }
        : fixture?.visitorteam;

    const homeTeam = {
      ...fixture?.homeTeam,
      image_url: localteam?.teamImageUrl ?? fixture?.homeTeam?.image_url,
    };

    const awayTeam = {
      ...fixture?.awayTeam,
      image_url: visitorteam?.teamImageUrl ?? fixture?.awayTeam?.image_url,
    };

    return {
      ...fixture,
      localteam,
      visitorteam,
      homeTeam,
      awayTeam,
      localteam_name: fixture?.localteam_name ?? homeName,
      visitorteam_name: fixture?.visitorteam_name ?? awayName,
    };
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncPinnedOpen = () => {
      const store = readPinnedStore();
      const list = store?.[selectedDateKey] ?? [];
      if (!Array.isArray(list) || list.length === 0) {
        setPinnedOpen(false);
      }
    };
    syncPinnedOpen();
  }, [selectedDateKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const ids = pinnedFixtureIds;
    if (!ids.length) {
      setPinnedFixtures([]);
      setPinnedLoading(false);
      return;
    }

    setPinnedLoading(true);
    (async () => {
      const results = await Promise.allSettled(ids.map((id) => getFixtureDetails(id)));
      if (cancelled) return;
      const ok = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map((r) => r.value);
      const normalized = ok
        .map((resp: any) => extractFixtureDetails(resp))
        .map((fixture: any, idx: number) => {
          const fixtureId = ids[idx];
          const base = normalizeFixtureTeams(fixture);
          if (!base) return base;
          return {
            ...base,
            fixture_id: base?.fixture_id ?? fixtureId,
          };
        })
        .filter(Boolean);
      setPinnedFixtures(normalized);
      setPinnedLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [pinnedFixtureIds]);

  const pinnedFixturesWithLive = useMemo(() => {
    void sseRevision;
    const { byStaticId, byMatchId, byFixtureId } = latestSseUpdatesRef.current;
    const items = Array.isArray(pinnedFixtures) ? pinnedFixtures : [];
    if (!byStaticId.size && !byMatchId.size && !byFixtureId.size) return items;
    return items.map((game: any) => {
      const staticIdKey = game?.static_id ? String(game.static_id) : "";
      const matchIdKey = game?.match_id ? String(game.match_id) : "";
      const fixtureIdKey = game?.fixture_id ? String(game.fixture_id) : "";
      const update =
        (staticIdKey && byStaticId.get(staticIdKey)) ||
        (matchIdKey && byMatchId.get(matchIdKey)) ||
        (fixtureIdKey && byFixtureId.get(fixtureIdKey));
      return update ? { ...game, ...update } : game;
    });
  }, [pinnedFixtures, sseRevision]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onOffline = () => {
      toast.show({
        id: "dashboard-connection",
        variant: "error",
        message: "Trying to reconnect, check your network",
      });
    };

    const onOnline = () => {
      toast.dismiss("dashboard-connection");
      toast.show({
        variant: "success",
        message: "Connected",
        durationMs: 5000,
      });
    };

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);

    if (window.navigator && window.navigator.onLine === false) {
      onOffline();
    }

    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [toast]);

  const topLeagueIds = useMemo(
    () => [ 1204, 1059, 1399, 1198, 1005, 1056, 1007, 1205, 1534, 1326, 1229, 1440, 1269, 1368, 1221, 1141, 1322, 1206, 1197, 2129, 1352, 1081, 1308, 1457, 1271, 1282, 1370, 1169, 1191, 1338, 1342, 1441, 1447, 1258, 1193, 1082, 1194, 1253, 1276, 1284, 2457, 1097, 2453, 1171, 1306, 2476, 2030],
    []
  );
  // const topLeagueIds = [1399, 1204, 1269 1352];

  const topLeagueOrder = useMemo(() => {
    const m = new Map<number, number>();
    topLeagueIds.forEach((id, idx) => m.set(id, idx));
    return m;
  }, [topLeagueIds]);

  // Fixture merge helpers (shared by the main fetch effect and the infinite-scroll
  // "load more" fetcher). Kept at component level so both can use them.
  const patchWithLatestSse = useCallback((games: any[]) => {
    const { byStaticId, byMatchId, byFixtureId } = latestSseUpdatesRef.current;
    if (!byStaticId.size && !byMatchId.size && !byFixtureId.size) return games;
    return games.map((game: any) => {
      const staticIdKey = game?.static_id ? String(game.static_id) : "";
      const matchIdKey = game?.match_id ? String(game.match_id) : "";
      const fixtureIdKey = game?.fixture_id ? String(game.fixture_id) : "";
      const update =
        (staticIdKey && byStaticId.get(staticIdKey)) ||
        (matchIdKey && byMatchId.get(matchIdKey)) ||
        (fixtureIdKey && byFixtureId.get(fixtureIdKey));
      return update ? { ...game, ...update } : game;
    });
  }, []);

  const flushFixturesToState = useCallback(() => {
    const blocks = Array.from(leagueFixturesMapRef.current.entries()).map(([leagueId, fx]) => ({
      leagueId,
      fixtures: fx,
    }));

    if (fixturesMode === "date") {
      blocks.sort(
        (a, b) =>
          (topLeagueOrder.get(a.leagueId) ?? 999999) -
          (topLeagueOrder.get(b.leagueId) ?? 999999)
      );
    } else {
      blocks.sort((a, b) => a.leagueId - b.leagueId);
    }

    setFixtures(blocks);
  }, [topLeagueOrder, fixturesMode]);

  const scheduleFlushFixtures = useCallback(() => {
    if (flushFixturesTimeoutRef.current !== null) return;
    flushFixturesTimeoutRef.current = window.setTimeout(() => {
      flushFixturesTimeoutRef.current = null;
      flushFixturesToState();
    }, 80);
  }, [flushFixturesToState]);

  const upsertLeagueFixtures = useCallback(
    (leagueId: number, leagueFixtures: any[]) => {
      const fixturesToInsert =
        fixturesMode === "date" ? patchWithLatestSse(leagueFixtures) : leagueFixtures;
      leagueFixturesMapRef.current.set(leagueId, sortFixturesLiveFirst(fixturesToInsert));
      scheduleFlushFixtures();
    },
    [fixturesMode, patchWithLatestSse, scheduleFlushFixtures]
  );

  const fixturesByLeagueId = useMemo(() => {
    const m = new Map<number, any>();
    for (const block of fixtures) {
      const leagueId = Number(block?.leagueId);
      if (Number.isFinite(leagueId)) m.set(leagueId, block);
    }
    return m;
  }, [fixtures]);

  // In date mode, render the preferred/top leagues first, then any additional
  // league groups already loaded. Additional leagues are appended at the bottom
  // as more pages are fetched on scroll.
  const dateRenderLeagueIds = useMemo(() => {
    if (fixturesMode !== "date") return [] as number[];
    const additional = fixtures
      .filter((block) => !topLeagueOrder.has(block.leagueId))
      .map((block) => block.leagueId);
    return [...topLeagueIds, ...additional];
  }, [fixtures, fixturesMode, topLeagueIds, topLeagueOrder]);

  const extraLiveLeagueBlocks = useMemo(() => {
    void sseRevision;
    if (fixturesMode !== "live") return [] as Array<{ leagueId: number; fixtures: any[] }>;
    if (loadingLeagueIds.size > 0) return [] as Array<{ leagueId: number; fixtures: any[] }>;

    const existingMatchIds = new Set<string>();
    const existingFixtureIds = new Set<string>();
    const existingStaticIds = new Set<string>();
    for (const leagueBlock of fixtures) {
      const games = Array.isArray(leagueBlock?.fixtures) ? leagueBlock.fixtures : [];
      for (const g of games) {
        if (g?.match_id) existingMatchIds.add(String(g.match_id));
        if (g?.fixture_id) existingFixtureIds.add(String(g.fixture_id));
        if (g?.static_id) existingStaticIds.add(String(g.static_id));
      }
    }

    const sseItems = Array.from(latestSseUpdatesRef.current.byStaticId.values());
    const grouped = new Map<number, any[]>();
    for (const item of sseItems) {
      const staticIdKey = item?.static_id ? String(item.static_id) : "";
      const matchIdKey = item?.match_id ? String(item.match_id) : "";
      const fixtureIdKey = item?.fixture_id ? String(item.fixture_id) : "";
      if (
        (staticIdKey && existingStaticIds.has(staticIdKey)) ||
        (matchIdKey && existingMatchIds.has(matchIdKey)) ||
        (fixtureIdKey && existingFixtureIds.has(fixtureIdKey))
      ) {
        continue;
      }

      const leagueIdNum = Number(item?.league_id);
      if (!Number.isFinite(leagueIdNum)) continue;
      const prev = grouped.get(leagueIdNum) || [];
      prev.push(item);
      grouped.set(leagueIdNum, prev);
    }

    return Array.from(grouped.entries())
      .map(([leagueId, fx]) => ({ leagueId, fixtures: sortFixturesLiveFirst(fx) }))
      .sort((a, b) => a.leagueId - b.leagueId);
  }, [fixtures, fixturesMode, loadingLeagueIds, sseRevision]);

  useEffect(() => {
    try {
      localStorage.setItem("dashboard_fixtures_mode", fixturesMode);
    } catch {
      // ignore storage errors
    }
  }, [fixturesMode]);

  useEffect(() => {
    try {
      if (selectedDate) {
        localStorage.setItem("dashboard_selected_date", selectedDate.toISOString());
      }
    } catch {
      // ignore storage errors
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        setFixtures([]); // Clear previous fixtures immediately when date/mode changes
        leagueFixturesMapRef.current = new Map();
        // Reset infinite-scroll pagination for the new date/mode
        dateNextPageRef.current = 2;
        dateHasMoreRef.current = true;
        dateLoadingMoreRef.current = false;
        setDateLoadingMore(false);
        if (flushFixturesTimeoutRef.current !== null) {
          window.clearTimeout(flushFixturesTimeoutRef.current);
          flushFixturesTimeoutRef.current = null;
        }
        if (fixturesMode === "date") {
          setLoadingLeagueIds(new Set(topLeagueIds));
        } else {
          setLoadingLeagueIds(new Set());
        }
        const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'); // Use selectedDate, default to today if null

        // patchWithLatestSse / flushFixturesToState / scheduleFlushFixtures /
        // upsertLeagueFixtures are defined at component level above.

        const markLeagueDone = (leagueId: number) => {
          setLoadingLeagueIds((prev) => {
            const next = new Set(prev);
            next.delete(leagueId);
            return next;
          });
        };

        closeLiveStream(liveEventSourceRef.current);
        liveEventSourceRef.current = subscribeDashboardLiveFixtures({
          onUpdate: (rawLiveItems: DashboardLiveFixture[]) => {
            if (!Array.isArray(rawLiveItems)) return;
            
            const liveItems = rawLiveItems.map((item: any) => {
              if (!item) return item;
              const nextItem = { ...item };
              if (item.localteam?.teamImageUrl) {
                nextItem.homeTeam = {
                  ...nextItem.homeTeam,
                  image_url: item.localteam.teamImageUrl,
                };
              }
              if (item.visitorteam?.teamImageUrl) {
                nextItem.awayTeam = {
                  ...nextItem.awayTeam,
                  image_url: item.visitorteam.teamImageUrl,
                };
              }
              return nextItem;
            });

            setSseRevision((v) => v + 1);
            if (fixturesMode === "live") {
              const nextByStaticId = new Map<string, any>();
              const nextByMatchId = new Map<string, any>();
              const nextByFixtureId = new Map<string, any>();
              const grouped = new Map<number, any[]>();
              for (const item of liveItems) {
                const leagueIdNum = Number((item as any)?.league_id);
                if (!Number.isFinite(leagueIdNum)) continue;
                const staticId = (item as any)?.static_id;
                const matchId = (item as any)?.match_id;
                const fixtureId = (item as any)?.fixture_id;
                if (staticId) nextByStaticId.set(String(staticId), item);
                if (matchId) nextByMatchId.set(String(matchId), item);
                if (fixtureId) nextByFixtureId.set(String(fixtureId), item);
                const prev = grouped.get(leagueIdNum) || [];
                prev.push(item);
                grouped.set(leagueIdNum, prev);
              }

              latestSseUpdatesRef.current = { byStaticId: nextByStaticId, byMatchId: nextByMatchId, byFixtureId: nextByFixtureId };

              const next = Array.from(grouped.entries())
                .map(([leagueId, fixtures]) => ({ leagueId, fixtures }))
                .sort((a, b) => a.leagueId - b.leagueId);

              setFixtures(next);
              setLoading(false);
              setLoadingLeagueIds(new Set());
              return;
            }

            // fixturesMode === "date": merge SSE updates into existing date fixtures
            const updatesByStaticId = new Map<string, any>();
            const updatesByFixtureId = new Map<string, any>();
            const updatesByMatchId = new Map<string, any>();
            for (const item of liveItems) {
              const staticId = (item as any)?.static_id;
              const fixtureId = (item as any)?.fixture_id;
              const matchId = (item as any)?.match_id;
              if (staticId) updatesByStaticId.set(String(staticId), item);
              if (fixtureId) updatesByFixtureId.set(String(fixtureId), item);
              if (matchId) updatesByMatchId.set(String(matchId), item);
            }

            latestSseUpdatesRef.current = { byStaticId: updatesByStaticId, byMatchId: updatesByMatchId, byFixtureId: updatesByFixtureId };

            setFixtures((prev) => {
              if (!prev || prev.length === 0) return prev;

              let changed = false;

              const next = prev.map((leagueBlock: any) => {
                const currentFixtures = Array.isArray(leagueBlock?.fixtures)
                  ? leagueBlock.fixtures
                  : [];

                const mergedFixtures = currentFixtures.map((game: any) => {
                  const staticIdKey = game?.static_id ? String(game.static_id) : "";
                  const fixtureIdKey = game?.fixture_id ? String(game.fixture_id) : "";
                  const matchIdKey = game?.match_id ? String(game.match_id) : "";

                  const update =
                    (staticIdKey && updatesByStaticId.get(staticIdKey)) ||
                    (matchIdKey && updatesByMatchId.get(matchIdKey)) ||
                    (fixtureIdKey && updatesByFixtureId.get(fixtureIdKey));

                  if (!update) return game;
                  changed = true;

                  // Shallow-merge is enough since update contains latest localteam/visitorteam/events/status/timer/etc.
                  return { ...game, ...update };
                });

                return { ...leagueBlock, fixtures: sortFixturesLiveFirst(mergedFixtures) };
              });

              return changed ? next : prev;
            });
          },
        });

        if (fixturesMode === "live") {
          // Live mode is SSE-driven; skip REST fetching
          setLoadingLeagueIds(new Set());
          return;
        }

        if (fixturesMode === "date") {
          try {
            // 1. Stale-while-revalidate: Load from cache immediately if available
            const cachedResponse = queryClient.getQueryData<any>(["footballFixturesByDate", formattedDate]);
            if (cachedResponse?.success && cachedResponse?.responseObject?.leagues) {
              const leagues = cachedResponse.responseObject.leagues;
              leagues.forEach((leagueBlock: any) => {
                const leagueId = Number(leagueBlock.id || leagueBlock.league_id);
                if (Number.isFinite(leagueId) && leagueBlock.fixtures?.length > 0) {
                  upsertLeagueFixtures(leagueId, leagueBlock.fixtures);
                }
              });
            }

            // 2. Fetch fresh data in the background and update UI seamlessly
            const response = await queryClient.fetchQuery<any>({
              queryKey: ["footballFixturesByDate", formattedDate],
              queryFn: () =>
                getFootballFixturesByDate(
                  formattedDate,
                  1,
                  DATE_FIXTURES_PAGE_SIZE
                ),
              staleTime: 0, // Always fetch to ensure we check for updates
            });

            if (response?.success && response?.responseObject?.leagues) {
              const leagues = response.responseObject.leagues;
              leagues.forEach((leagueBlock: any) => {
                const leagueId = Number(leagueBlock.id || leagueBlock.league_id);
                if (Number.isFinite(leagueId) && leagueBlock.fixtures?.length > 0) {
                  upsertLeagueFixtures(leagueId, leagueBlock.fixtures);
                }
              });
            }
          } catch (error) {
            console.error("Error fetching grouped date fixtures:", error);
          } finally {
            topLeagueIds.forEach((id) => markLeagueDone(id));
          }
        }

        // ensure last partial batch is flushed
        if (flushFixturesTimeoutRef.current !== null) {
          window.clearTimeout(flushFixturesTimeoutRef.current);
          flushFixturesTimeoutRef.current = null;
        }
        flushFixturesToState();
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();

    return () => {
      closeLiveStream(liveEventSourceRef.current);
      liveEventSourceRef.current = null;
    };
  }, [fixturesMode, selectedDate]);

  // Infinite scroll: fetch the next page of league groups for the selected date
  // and append any new leagues to the bottom of the list.
  const loadNextDatePage = useCallback(async () => {
    if (fixturesMode !== "date") return;
    if (loading || dateLoadingMoreRef.current || !dateHasMoreRef.current) return;

    const page = dateNextPageRef.current;
    const formattedDate = selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd");

    dateLoadingMoreRef.current = true;
    setDateLoadingMore(true);
    try {
      const response = await getFootballFixturesByDate(
        formattedDate,
        page,
        DATE_FIXTURES_PAGE_SIZE
      );
      const leagues = response?.responseObject?.leagues;
      if (response?.success && Array.isArray(leagues)) {
        let addedAny = false;
        for (const leagueBlock of leagues) {
          const leagueId = Number(leagueBlock?.id ?? leagueBlock?.league_id);
          if (!Number.isFinite(leagueId)) continue;
          if (leagueFixturesMapRef.current.has(leagueId)) continue;
          const leagueFixtures = Array.isArray(leagueBlock?.fixtures)
            ? leagueBlock.fixtures
            : [];
          if (leagueFixtures.length === 0) continue;
          leagueFixturesMapRef.current.set(
            leagueId,
            sortFixturesLiveFirst(patchWithLatestSse(leagueFixtures))
          );
          addedAny = true;
        }
        if (addedAny) flushFixturesToState();
        // The API returns at most `limit` groups per page; a full page means
        // more pages may exist. Stop when a page is not full or adds nothing new.
        dateHasMoreRef.current =
          leagues.length >= DATE_FIXTURES_PAGE_SIZE && addedAny;
        dateNextPageRef.current = page + 1;
      } else {
        dateHasMoreRef.current = false;
      }
    } catch (error) {
      console.error("Error fetching next page of date fixtures:", error);
      dateHasMoreRef.current = false;
    } finally {
      dateLoadingMoreRef.current = false;
      setDateLoadingMore(false);
    }
  }, [fixturesMode, loading, selectedDate, patchWithLatestSse, flushFixturesToState]);

  // Trigger the next page fetch when the user scrolls near the bottom of the page.
  useEffect(() => {
    if (fixturesMode !== "date") return;

    const handleScroll = () => {
      if (dateLoadingMoreRef.current || !dateHasMoreRef.current) return;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && scrollTop / maxScroll >= 0.8) {
        loadNextDatePage();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fixturesMode, loadNextDatePage]);

  return (
      <SportLayout 
        leftBar={<Leftbar />}
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

          {/* Date and Filter Controls */}
            <FixturesDateToggle
              fixturesMode={fixturesMode}
              onModeChange={setFixturesMode}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />



          {/* Main Content Games Loop */}
          <div className="flex flex-col gap-y-3 md:gap-y-6">
            {(fixturesMode === "date") && pinnedFixtureIds.length > 0 && (
              <div className="block-style">
                <button
                  type="button"
                  onClick={() => setPinnedOpen((v) => !v)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-[500] text-[#23272A] dark:text-neutral-m6 text-[14px] md:text-base">
                      Pinned Fixtures
                    </p>
                    <span className="text-xs text-neutral-n5 dark:text-snow-200/70">
                      ({pinnedFixtureIds.length})
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={`h-5 w-5 theme-text transition-transform ${pinnedOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {pinnedOpen && (
                  <div className="mt-4">
                    {pinnedLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: Math.min(3, Math.max(1, pinnedFixtureIds.length)) }).map((_, idx) => (
                          <div
                            key={`pinned-skel-${idx}`}
                            className="flex justify-around items-center gap-4 border-b-1 px-5 py-3 border-snow-200 last:border-b-0"
                          >
                            <Skeleton className="w-10 h-4" />
                            <Skeleton className="w-64 h-4" />
                          </div>
                        ))}
                      </div>
                    ) : pinnedFixturesWithLive.length === 0 ? (
                      <p className="text-sm text-neutral-n5 dark:text-snow-200/70">
                        No pinned fixtures for this date.
                      </p>
                    ) : (
                      <div className="flex flex-col">
                        {pinnedFixturesWithLive.map((game: any, idx: number) => {
                          const ui = getMatchUiInfo({ status: game?.status, timer: game?.timer });
                          const events = Array.isArray(game?.events) ? game.events : [];
                          const pen = getPenaltyInfo(game);
                          const normalizeTeamKey = (raw: unknown) => {
                            const t = String(raw ?? "").trim().toLowerCase();
                            if (!t) return "";
                            if (t.includes("local") || t.includes("home")) return "localteam";
                            if (t.includes("visitor") || t.includes("away")) return "visitorteam";
                            return t;
                          };
                          const countEventType = (teamKey: "localteam" | "visitorteam", types: string[]) => {
                            const set = new Set(types.map((x) => String(x).toLowerCase()));
                            return events.reduce((acc: number, ev: any) => {
                              const evType = String(ev?.type ?? "").trim().toLowerCase();
                              const evTeam = normalizeTeamKey(ev?.team);
                              if (evTeam === teamKey && set.has(evType)) return acc + 1;
                              return acc;
                            }, 0);
                          };
                          const homeRedCards = countEventType("localteam", ["redcard"]);
                          const awayRedCards = countEventType("visitorteam", ["redcard"]);
                          const homeStreams = countEventType("localteam", ["sream", "stream"]);
                          const awayStreams = countEventType("visitorteam", ["sream", "stream"]);

                          const IndicatorCard = ({
                            count,
                            variant,
                          }: {
                            count: number;
                            variant: "red" | "stream";
                          }) => {
                            if (!count) return null;
                            const base = variant === "red" ? "bg-red-600 text-white" : "bg-sky-600 text-white";
                            const size =
                              variant === "red"
                                ? "h-4 w-3"
                                : "h-4 min-w-4 px-1 rounded-sm";
                            return (
                              <span
                                className={`inline-flex items-center justify-center ${size} text-[10px] font-bold leading-none ${base}`}
                              >
                                {variant === "red" ? (count > 1 ? count : null) : count > 1 ? count : "S"}
                              </span>
                            );
                          };

                          const statusLabel = getStatusLabel(game, ui);

                          const fixtureIdForPin = game?.fixture_id;

                          return (
                            <div
                              key={`pinned-${idx}`}
                            >
                              <div
                                className={`hidden md:flex relative hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors items-center gap-2 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 ${idx === pinnedFixturesWithLive.length - 1 ? "last:border-b-0  border-b-0" : ""
                                  }`}
                              >
                                <Link
                                  to={`/football/gameinfo/${game.static_id ?? game.fixture_id}?fixtureId=${encodeURIComponent(String(game.fixture_id ?? ""))}`}
                                  className="flex flex-1 items-center gap-2 pr-12"
                                >
                                  <>
                                    {/* Time */}
                                    <div className="w-12 text-center flex-shrink-0">
                                      <p className={`text-xs font-bold ${ui.state !== "upcoming" ? "text-brand-secondary" : "theme-text opacity-70"} ${ui.state === "timer" || ui.state === "ht" ? "animate-pulse" : ""}`}>
                                        {ui.state === "ht" ? "HT" : statusLabel}
                                      </p>
                                    </div>
                                    {/* Home team */}
                                    <div className="flex-1 flex items-center justify-end gap-2 dark:text-white">
                                      <IndicatorCard count={homeRedCards} variant="red" />
                                      <span className="text-sm font-medium theme-text">
                                        {pen.show && pen.winner === "localteam" ? (
                                          <span className="mr-1 inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                            PEN
                                            <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                          </span>
                                        ) : null}
                                        {game.localteam?.name ?? game?.localteam_name ?? "Home"}
                                      </span>
                                      <IndicatorCard count={homeStreams} variant="stream" />
                                      {game?.localteam?.id && game?.localteam?.name && (
                                        <Image src={game.homeTeam?.image_url} alt={game.localteam.name} className="w-5 h-5 object-contain" />
                                      )}
                                    </div>
                                    {/* Scores */}
                                    <div className="flex justify-center gap-2 flex-shrink-0 min-w-[60px]">
                                      {ui.state === "upcoming" ? (
                                        <>
                                          <span className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">-</span>
                                          <span className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">-</span>
                                        </>
                                      ) : (
                                        <>
                                          <AnimatedScore className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded" value={game.localteam?.goals ?? game.localteam?.ft_score ?? game.localteam?.score ?? 0} />
                                          <AnimatedScore className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded" value={game.visitorteam?.goals ?? game.visitorteam?.ft_score ?? game.visitorteam?.score ?? 0} />
                                        </>
                                      )}
                                    </div>
                                    {/* Away team */}
                                    <div className="flex-1 flex items-center justify-start gap-2 dark:text-white">
                                      {game?.visitorteam?.id && game?.visitorteam?.name && (
                                        <Image src={game.awayTeam?.image_url} alt={game.visitorteam.name} className="w-5 h-5 object-contain" />
                                      )}
                                      <IndicatorCard count={awayStreams} variant="stream" />
                                      <span className="text-sm font-medium theme-text">
                                        {game.visitorteam?.name ?? game?.visitorteam_name ?? "Away"}
                                        {pen.show && pen.winner === "visitorteam" ? (
                                          <span className="ml-1 inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                            <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                            PEN
                                          </span>
                                        ) : null}
                                      </span>
                                      <IndicatorCard count={awayRedCards} variant="red" />
                                    </div>
                                  </>
                                </Link>
                                <button
                                  type="button"
                                  className="absolute right-4 p-2 rounded hover:bg-snow-200 dark:hover:bg-neutral-n3 bg-brand-secondary text-white"
                                  onClick={() => togglePinnedFixture(fixtureIdForPin)}
                                  aria-label="Unpin fixture"
                                >
                                  <StarIcon className="w-5 h-5 text-white fill-current" />
                                </button>
                              </div>

                              <div
                                className={`flex md:hidden relative items-center justify-between dark:border-[#1F2937] border-b-1 border-snow-200 px-2 py-1.5 bg-neutral-n9 ${idx === pinnedFixturesWithLive.length - 1 ? "last:border-b-0" : ""
                                  }`}
                              >
                                <Link
                                  to={`/football/gameinfo/${game.static_id ?? game.fixture_id}?fixtureId=${encodeURIComponent(String(game.fixture_id ?? ""))}`}
                                  className="flex flex-1 items-center justify-between pr-10"
                                >
                                  <p
                                    className={`text-xs text-center w-15 px-2 font-bold ${ui.state === "timer" || ui.state === "ht"
                                      ? "text-brand-secondary animate-pulse"
                                      : "text-neutral-n4 dark:text-snow-200 font-medium"
                                      }`}
                                  >
                                    {statusLabel}
                                  </p>
                                  <div className="flex flex-col flex-1 mx-1 gap-0.5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1">
                                        {game?.localteam?.id && game?.localteam?.name && (
                                          <Image src={game.homeTeam?.image_url} alt={game.localteam.name} className="w-5 h-5" />
                                        )}
                                        <span className="text-sm font-medium dark:text-white text-neutral-n4">
                                          {game?.localteam?.name ?? game?.localteam_name ?? "Home"}
                                          {pen.show && pen.winner === "localteam" ? (
                                            <span className="inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                              <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                              PEN
                                            </span>
                                          ) : null}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                          <IndicatorCard count={homeRedCards} variant="red" />
                                          <IndicatorCard count={homeStreams} variant="stream" />
                                        </span>
                                      </div>
                                      <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                                        <span className="text-xs font-bold dark:text-white text-neutral-n4">
                                          {ui.state === "upcoming" ? (
                                            "-"
                                          ) : (
                                            <AnimatedScore value={game.localteam?.goals ?? game.localteam?.ft_score ?? game.localteam?.score ?? 0} />
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1">
                                        {game?.visitorteam?.id && game?.visitorteam?.name && (
                                          <Image src={game.awayTeam?.image_url} alt={game.visitorteam.name} className="w-5 h-5" />
                                        )}
                                        <span className="text-sm font-medium dark:text-white text-neutral-n4">
                                          {game?.visitorteam?.name ?? game?.visitorteam_name ?? "Away"}
                                          {pen.show && pen.winner === "visitorteam" ? (
                                            <span className="inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                              <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                              PEN
                                            </span>
                                          ) : null}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                          <IndicatorCard count={awayRedCards} variant="red" />
                                          <IndicatorCard count={awayStreams} variant="stream" />
                                        </span>
                                      </div>
                                      <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                                        <span className="text-xs font-bold dark:text-white text-neutral-n4">
                                          {ui.state === "upcoming" ? (
                                            "-"
                                          ) : (
                                            <AnimatedScore value={game.visitorteam?.goals ?? game.visitorteam?.ft_score ?? game.visitorteam?.score ?? 0} />
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                                <button
                                  type="button"
                                  className="absolute right-2 p-1 rounded hover:bg-snow-200 dark:hover:bg-neutral-n3 bg-brand-secondary text-white"
                                  onClick={() => togglePinnedFixture(fixtureIdForPin)}
                                  aria-label="Unpin fixture"
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M14 9V4.5a1.5 1.5 0 0 0-3 0V9"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      fill="none"
                                    />
                                    <path
                                      d="M8 9h8l-1 9H9L8 9Z"
                                      fill="currentColor"
                                      opacity="1"
                                    />
                                    <path
                                      d="M8 9h8l-1 9H9L8 9Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinejoin="round"
                                      fill="none"
                                    />
                                    <path
                                      d="M12 18v3"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      fill="none"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Desktop Section */}
            <div className="hidden md:block space-y-6">
              {(fixturesMode === "live"
                ? fixtures.map((x) => x.leagueId)
                : dateRenderLeagueIds
              ).map((leagueId, leagueIdx) => {
                const leagueFixture = fixturesByLeagueId.get(leagueId);

                if (!leagueFixture) {
                  if (!loadingLeagueIds.has(leagueId)) return null;

                  return (
                    <div key={leagueId + "-" + leagueIdx} className="block-style">
                      <div className="flex gap-3 border-b-1 px-5 py-3 border-snow-200 dark:border-[#1F2937]">
                        <Skeleton className="w-10 h-10" />
                        <Skeleton className="w-32 h-6" />
                      </div>
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex justify-around items-center gap-4 border-b-1 px-5 py-2 border-snow-200 dark:border-[#1F2937] last:border-b-0"
                        >
                          <Skeleton className="w-8 h-4" />
                          <div className="flex flex-3/9 justify-end items-center gap-3">
                            <Skeleton className="w-20 h-4" />
                            <Skeleton className="w-8 h-8" />
                            <Skeleton className="w-8 h-4" />
                          </div>
                          <div className="flex flex-4/9 justify-start items-center gap-3">
                            <Skeleton className="w-8 h-4" />
                            <Skeleton className="w-8 h-8" />
                            <Skeleton className="w-20 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                const fixtureCount = leagueFixture.fixtures.length;
                const collapsed = isLeagueCollapsed(leagueId, fixtureCount);

                return (
                  <div key={leagueFixture.leagueId + "-" + leagueIdx} className="block-style !p-0">
                    <div 
                      className="flex gap-3 border-b-1 px-5 py-3 border-snow-200 dark:border-[#1F2937] bg-gradient-to-r from-brand-primary/0 via-transparent to-orange-500/10 dark:from-brand-priary/20 dark:to-orange-500/20 cursor-pointer select-none"
                      onClick={() => toggleLeagueCollapse(leagueId, fixtureCount)}
                    >
                      {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                        <GetLeagueLogo
                          leagueId={leagueFixture.leagueId}
                          alt={leagueFixture.fixtures[0].league_name}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <p className="font-[500] text-[#23272A] dark:text-neutral-m6  text-[14px] md:text-base">
                          {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name ? leagueFixture.fixtures[0].league_name : `League ${leagueFixture.leagueId}`}
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
                          navigate(`/league/profile/${encodeURIComponent(String(leagueFixture.leagueId))}`);
                        }}
                        aria-label="Open league profile"
                      >
                        <ArrowRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                    {!collapsed && leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                      (() => {
                        const ui = getMatchUiInfo({ status: game?.status, timer: game?.timer });
                        const events = Array.isArray(game?.events) ? game.events : [];
                        const pen = getPenaltyInfo(game);
                        const normalizeTeamKey = (raw: unknown) => {
                          const t = String(raw ?? "").trim().toLowerCase();
                          if (!t) return "";
                          if (t.includes("local") || t.includes("home")) return "localteam";
                          if (t.includes("visitor") || t.includes("away")) return "visitorteam";
                          return t;
                        };
                        const countEventType = (teamKey: "localteam" | "visitorteam", types: string[]) => {
                          const set = new Set(types.map((x) => String(x).toLowerCase()));
                          return events.reduce((acc: number, ev: any) => {
                            const evType = String(ev?.type ?? "").trim().toLowerCase();
                            const evTeam = normalizeTeamKey(ev?.team);
                            if (evTeam === teamKey && set.has(evType)) return acc + 1;
                            return acc;
                          }, 0);
                        };
                        const homeRedCards = countEventType("localteam", ["redcard"]);
                        const awayRedCards = countEventType("visitorteam", ["redcard"]);
                        const homeStreams = countEventType("localteam", ["sream", "stream"]);
                        const awayStreams = countEventType("visitorteam", ["sream", "stream"]);

                        const IndicatorCard = ({
                          count,
                          variant,
                        }: {
                          count: number;
                          variant: "red" | "stream";
                        }) => {
                          if (!count) return null;
                          const base = variant === "red" ? "bg-red-600 text-white" : "bg-sky-600 text-white";
                          const size =
                            variant === "red"
                              ? "h-4 w-3"
                              : "h-4 min-w-4 px-1 rounded-sm";
                          return (
                            <span
                              className={`inline-flex items-center justify-center ${size} text-[10px] font-bold leading-none ${base}`}
                            >
                              {variant === "red" ? (count > 1 ? count : null) : count > 1 ? count : "S"}
                            </span>
                          );
                        };
                        const statusLabel = getStatusLabel(game, ui);

                        const fixtureIdForPin = game?.fixture_id;
                        const pinned = isPinnedFixtureId(fixtureIdForPin);

                        return (
                          <div
                            key={gameIdx}
                            className={`flex hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors items-center gap-2 border-b-1 px-5 py-1 dark:border-[#1F2937] border-snow-200/70 ${gameIdx === leagueFixture.fixtures.length - 1
                              ? "last:border-b-0  border-b-0"
                              : ""
                              }`}
                          >
                            <Link
                              to={`/football/gameinfo/${game.static_id ?? game.fixture_id}?fixtureId=${encodeURIComponent(String(game.fixture_id ?? ""))}`}
                              className="flex flex-1 rounded items-center gap-2"
                            >
                              <>
                                {/* Time */}
                                <div className="w-12 text-center flex-shrink-0">
                                      <p className={`text-xs font-bold ${ui.state !== "upcoming" ? "text-brand-secondary" : "theme-text opacity-70"} ${ui.state === "timer" || ui.state === "ht" ? "animate-pulse" : ""}`}>
                                    {ui.state === "ht" ? "HT" : statusLabel}
                                  </p>
                                </div>
                                {/* Home team */}
                                <div className="flex-1 flex items-center justify-end gap-2 dark:text-white">
                                  <IndicatorCard count={homeRedCards} variant="red" />
                                  <span className="text-sm font-medium theme-text">
                                    {pen.show && pen.winner === "localteam" ? (
                                      <span className="mr-1 inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                        PEN
                                        <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                      </span>
                                    ) : null}
                                    {game.localteam.name}
                                  </span>
                                  <IndicatorCard count={homeStreams} variant="stream" />
                                  <Image src={game.homeTeam?.image_url} alt={game.localteam.name} className="w-5 h-5 object-contain" />
                                </div>
                                {/* Scores */}
                                <div className="flex justify-center gap-2 flex-shrink-0 min-w-[60px]">
                                  {ui.state === "upcoming" ? (
                                    <>
                                      <span className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">-</span>
                                      <span className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">-</span>
                                    </>
                                  ) : (
                                    <>
                                      <AnimatedScore className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded" value={game.localteam?.goals ?? game.localteam?.ft_score ?? game.localteam?.score ?? 0} />
                                      <AnimatedScore className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded" value={game.visitorteam?.goals ?? game.visitorteam?.ft_score ?? game.visitorteam?.score ?? 0} />
                                    </>
                                  )}
                                </div>
                                {/* Away team */}
                                <div className="flex-1 flex items-center justify-start gap-2 dark:text-white">
                                  <Image src={game.awayTeam?.image_url} alt={game.visitorteam.name} className="w-5 h-5 object-contain" />
                                  <IndicatorCard count={awayStreams} variant="stream" />
                                  <span className="text-sm font-medium theme-text">
                                    {game.visitorteam.name}
                                    {pen.show && pen.winner === "visitorteam" ? (
                                      <span className="ml-1 inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                        <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                        PEN
                                      </span>
                                    ) : null}
                                  </span>
                                  <IndicatorCard count={awayRedCards} variant="red" />
                                </div>
                              </>
                            </Link>

                            <button
                              type="button"
                              className={`ml-2 p-2 rounded hover:bg-snow-200 dark:hover:bg-neutral-n3 ${fixtureIdForPin ? "" : "opacity-40 cursor-not-allowed"
                                }`}
                              onClick={() => {
                                if (!fixtureIdForPin) return;
                                togglePinnedFixture(fixtureIdForPin);
                              }}
                              aria-label={pinned ? "Unpin fixture" : "Pin fixture"}
                            >
                              <span
                                className={`inline-flex items-center justify-center rounded-md p-1 ${pinned ? "bg-brand-secondary" : ""
                                  }`}
                              >
                                <StarIcon
                                  className={`w-5 h-5 ${pinned ? "text-white fill-current" : "text-neutral-n4 dark:text-snow-200"}`}
                                />
                              </span>
                            </button>
                          </div>
                        );
                      })()
                    ))}
                  </div>
                );
              })}

              {fixturesMode === "date" && loadingLeagueIds.size === 0 && extraLiveLeagueBlocks.map((leagueFixture, leagueIdx) => (
                <div key={`extra-live-${leagueFixture.leagueId}-${leagueIdx}`} className="block-style">
                  <div 
                    className="flex gap-3 border-b-1 px-5 py-3 border-snow-200 dark:border-[#1F2937] cursor-pointer select-none"
                    onClick={() => toggleLeagueCollapse(leagueFixture.leagueId, leagueFixture.fixtures.length)}
                  >
                    {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                      <GetLeagueLogo
                        leagueId={leagueFixture.leagueId}
                        alt={leagueFixture.fixtures[0].league_name}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <p className="font-[500] text-[#23272A] dark:text-neutral-m6  text-[14px] md:text-base">
                        {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name
                          ? leagueFixture.fixtures[0].league_name
                          : `League ${leagueFixture.leagueId}`}
                      </p>
                      {leagueFixture.fixtures.length >= 10 ? (
                        <div className="flex items-center gap-1 bg-brand-secondary text-white px-2 py-0.5 rounded-full ml-1">
                          <span className="text-xs font-medium">{leagueFixture.fixtures.length}</span>
                          <ChevronDownIcon className={`h-3 w-3 transition-transform ${isLeagueCollapsed(leagueFixture.leagueId, leagueFixture.fixtures.length) ? "" : "rotate-180"}`} />
                        </div>
                      ) : (
                        <ChevronDownIcon
                          className={`h-4 w-4 text-neutral-n5 dark:text-snow-200/70 transition-transform ml-1 ${isLeagueCollapsed(leagueFixture.leagueId, leagueFixture.fixtures.length) ? "" : "rotate-180"}`}
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      className="ml-auto text-brand-secondary hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/league/profile/${encodeURIComponent(String(leagueFixture.leagueId))}`);
                      }}
                      aria-label="Open league profile"
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                  {!isLeagueCollapsed(leagueFixture.leagueId, leagueFixture.fixtures.length) && leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                    (() => {
                      const ui = getMatchUiInfo({ status: game?.status, timer: game?.timer });
                      const events = Array.isArray(game?.events) ? game.events : [];
                      const pen = getPenaltyInfo(game);
                      const normalizeTeamKey = (raw: unknown) => {
                        const t = String(raw ?? "").trim().toLowerCase();
                        if (!t) return "";
                        if (t.includes("local") || t.includes("home")) return "localteam";
                        if (t.includes("visitor") || t.includes("away")) return "visitorteam";
                        return t;
                      };
                      const countEventType = (teamKey: "localteam" | "visitorteam", types: string[]) => {
                        const set = new Set(types.map((x) => String(x).toLowerCase()));
                        return events.reduce((acc: number, ev: any) => {
                          const evType = String(ev?.type ?? "").trim().toLowerCase();
                          const evTeam = normalizeTeamKey(ev?.team);
                          if (evTeam === teamKey && set.has(evType)) return acc + 1;
                          return acc;
                        }, 0);
                      };
                      const homeRedCards = countEventType("localteam", ["redcard"]);
                      const awayRedCards = countEventType("visitorteam", ["redcard"]);
                      const homeStreams = countEventType("localteam", ["sream", "stream"]);
                      const awayStreams = countEventType("visitorteam", ["sream", "stream"]);

                      const IndicatorCard = ({
                        count,
                        variant,
                      }: {
                        count: number;
                        variant: "red" | "stream";
                      }) => {
                        if (!count) return null;
                        const base = variant === "red" ? "bg-red-600 text-white" : "bg-sky-600 text-white";
                        const size =
                          variant === "red"
                            ? "h-3 w-2"
                            : "h-4 min-w-4 px-1 rounded-sm";
                        return (
                          <span
                            className={`inline-flex items-center justify-center ${size} text-[10px] font-bold leading-none ${base}`}
                          >
                            {variant === "red" ? (count > 1 ? count : null) : count > 1 ? count : "S"}
                          </span>
                        );
                      };
                      const statusLabel = getStatusLabel(game, ui);

                      return (
                        <Link
                          to={`/football/gameinfo/${game.static_id ?? game.fixture_id}?fixtureId=${encodeURIComponent(String(game.fixture_id ?? ""))}`}
                          key={gameIdx}
                          className={`flex hover:bg-snow-100 dark:hover:bg-neutral-n2 cursor-pointer transition-colors items-center gap-2 border-b-1 px-5 py-2 dark:border-[#1F2937] border-snow-200 ${gameIdx === leagueFixture.fixtures.length - 1 ? "last:border-b-0  border-b-0" : ""
                            }`}
                        >
                          <>
                            {/* Time */}
                            <div className="w-12 text-center flex-shrink-0">
                              <p className={`text-xs font-bold ${ui.state !== "upcoming" ? "text-brand-secondary" : "theme-text opacity-70"} ${ui.state === "timer" || ui.state === "ht" ? "animate-pulse" : ""}`}>
                                {ui.state === "ht" ? "HT" : statusLabel}
                              </p>
                            </div>
                            {/* Home team */}
                            <div className="flex-1 flex items-center justify-end gap-2 dark:text-white">
                              <IndicatorCard count={homeRedCards} variant="red" />
                              <span className="text-sm font-medium theme-text">
                                {pen.show && pen.winner === "localteam" ? (
                                  <span className="mr-1 inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                    PEN
                                    <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                  </span>
                                ) : null}
                                {game.localteam.name}
                              </span>
                              <IndicatorCard count={homeStreams} variant="stream" />
                              <Image src={game.homeTeam?.image_url} alt={game.localteam.name} className="w-5 h-5 object-contain" />
                            </div>
                            {/* Scores */}
                            <div className="flex justify-center gap-2 flex-shrink-0 min-w-[60px]">
                              {ui.state === "upcoming" ? (
                                <>
                                  <span className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">-</span>
                                  <span className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded">-</span>
                                </>
                              ) : (
                                <>
                                  <AnimatedScore className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded" value={game.localteam?.goals ?? game.localteam?.score ?? 0} />
                                  <AnimatedScore className="font-bold text-xs whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200 rounded" value={game.visitorteam?.goals ?? game.visitorteam?.score ?? 0} />
                                </>
                              )}
                            </div>
                            {/* Away team */}
                            <div className="flex-1 flex items-center justify-start gap-2 dark:text-white">
                              <Image src={game.awayTeam?.image_url} alt={game.visitorteam.name} className="w-5 h-5 object-contain" />
                              <IndicatorCard count={awayStreams} variant="stream" />
                              <span className="text-sm font-medium theme-text">
                                {game.visitorteam.name}
                                {pen.show && pen.winner === "visitorteam" ? (
                                  <span className="ml-1 inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                    <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                    PEN
                                  </span>
                                ) : null}
                              </span>
                              <IndicatorCard count={awayRedCards} variant="red" />
                            </div>
                          </>
                        </Link>
                      );
                    })()
                  ))}
                </div>
              ))}
            </div>


            {/* Mobile Section */}
            {(fixturesMode === "live"
              ? fixtures.map((x) => x.leagueId)
              : dateRenderLeagueIds
            ).map((leagueId, leagueIdx) => {
              const leagueFixture = fixtures.find((x) => x.leagueId === leagueId);

              if (!leagueFixture) {
                if (!loadingLeagueIds.has(leagueId)) return null;

                return (
                  <div
                    key={leagueId + "-" + leagueIdx}
                    className="bg-white dark:bg-[#161B22] border-1 block md:hidden h-fit flex-col border-snow-200 dark:border-[#1F2937] rounded"
                  >
                    <div className="flex gap-3 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 items-center">
                      <Skeleton className="w-8 h-8" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border-b-1 border-snow-200 dark:border-[#1F2937] px-2 py-1.5 last:border-b-0 bg-neutral-n9"
                      >
                        <Skeleton className="w-10 h-3" />
                        <div className="flex flex-col flex-1 mx-1 gap-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Skeleton className="w-5 h-5" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-4 w-6" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Skeleton className="w-5 h-5" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-4 w-6" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              const fixtureCount = leagueFixture.fixtures.length;
              const collapsed = isLeagueCollapsed(leagueId, fixtureCount);

              return (
                <div
                  key={leagueFixture.leagueId + "-" + leagueIdx}
                  className="bg-white text-sm dark:bg-[#161B22] dark:border-[#1F2937] border-1 block md:hidden h-fit flex-col border-snow-200 rounded overflow-hidden"
                >
                  <div 
                    className="flex gap-3 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 bg-gradient-to-r from-brand-primary/0 via-transparent to-orange-500/10 dark:from-brand-primary/0 dark:to-orange-500/20 cursor-pointer select-none"
                    onClick={() => toggleLeagueCollapse(leagueId, fixtureCount)}
                  >
                    {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                      <GetLeagueLogo
                        leagueId={leagueFixture.leagueId}
                        alt={leagueFixture.fixtures[0].league_name}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <p className="font-[500] text-[#23272A] dark:text-snow-200 text-[14px] md:text-base">
                        {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name ? leagueFixture.fixtures[0].league_name : `League ${leagueFixture.leagueId}`}
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
                        navigate(`/league/profile/${encodeURIComponent(String(leagueFixture.leagueId))}`);
                      }}
                      aria-label="Open league profile"
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                  {!collapsed && leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                    (() => {
                      const ui = getMatchUiInfo({ status: game?.status, timer: game?.timer });
                      const events = Array.isArray(game?.events) ? game.events : [];
                      const pen = getPenaltyInfo(game);
                      const normalizeTeamKey = (raw: unknown) => {
                        const t = String(raw ?? "").trim().toLowerCase();
                        if (!t) return "";
                        if (t.includes("local") || t.includes("home")) return "localteam";
                        if (t.includes("visitor") || t.includes("away")) return "visitorteam";
                        return t;
                      };
                      const countEventType = (teamKey: "localteam" | "visitorteam", types: string[]) => {
                        const set = new Set(types.map((x) => String(x).toLowerCase()));
                        return events.reduce((acc: number, ev: any) => {
                          const evType = String(ev?.type ?? "").trim().toLowerCase();
                          const evTeam = normalizeTeamKey(ev?.team);
                          if (evTeam === teamKey && set.has(evType)) return acc + 1;
                          return acc;
                        }, 0);
                      };
                      const homeRedCards = countEventType("localteam", ["redcard"]);
                      const awayRedCards = countEventType("visitorteam", ["redcard"]);
                      const homeStreams = countEventType("localteam", ["sream", "stream"]);
                      const awayStreams = countEventType("visitorteam", ["sream", "stream"]);

                      const IndicatorCard = ({
                        count,
                        variant,
                      }: {
                        count: number;
                        variant: "red" | "stream";
                      }) => {
                        if (!count) return null;
                        const base = variant === "red" ? "bg-red-600 text-white" : "bg-sky-600 text-white";
                        const size = variant === "red" ? "h-3 w-2" : "";
                        return (
                          <span
                            className={`inline-flex items-center justify-center ${size} text-[10px] font-bold leading-none ${base}`}
                          >
                            {variant === "red" ? (count > 1 ? count : null) : count > 1 ? count : "S"}
                          </span>
                        );
                      };
                      const statusLabel = getStatusLabel(game, ui);

                      const fixtureIdForPin = game?.fixture_id;
                      const pinned = isPinnedFixtureId(fixtureIdForPin);

                      return (
                        <div
                          key={gameIdx}
                          className="flex items-center justify-between dark:border-[#1F2937] border-b-1 border-snow-200 px-2 py-1.5 last:border-b-0 bg-neutral-n9"
                        >
                          <Link
                            to={`/football/gameinfo/${game.static_id ?? game.fixture_id}?fixtureId=${encodeURIComponent(String(game.fixture_id ?? ""))}`}
                            className="flex flex-1 items-center justify-between"
                          >
                            <p
                              className={`text-xs text-center w-15 px-2 font-bold ${ui.state === "timer" || ui.state === "ht"
                                ? "text-brand-secondary animate-pulse"
                                : "text-neutral-n4 dark:text-snow-200 font-medium"
                                }`}
                            >
                              {statusLabel}
                            </p>
                            <div className="flex flex-col flex-1 mx-1 gap-0.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Image src={game.homeTeam?.image_url} alt={game.localteam.name} className="w-5 h-5" />
                                  <span className={`text-sm font-medium dark:text-white text-neutral-n4 ${pen.show && pen.winner === "localteam" ? "font-bold text-brand-secondary" : ""
                                    }`}>
                                    {game.localteam.name}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <IndicatorCard count={homeRedCards} variant="red" />
                                    <IndicatorCard count={homeStreams} variant="stream" />
                                  </span>
                                </div>
                                <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                                  <span className="text-xs font-bold dark:text-white text-neutral-n4">
                                    {ui.state === "upcoming" ? (
                                      "-"
                                    ) : (
                                      <AnimatedScore value={game.localteam?.goals ?? game.localteam?.ft_score ?? game.localteam?.score ?? 0} />
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Image src={game.awayTeam?.image_url} alt={game.visitorteam.name} className="w-5 h-5" />
                                  <span className="text-sm font-medium dark:text-white text-neutral-n4 inline-flex items-center gap-1">
                                    {game.visitorteam.name}
                                    {pen.show && pen.winner === "visitorteam" ? (
                                      <span className="inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                        <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                        PEN
                                      </span>
                                    ) : null}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <IndicatorCard count={awayRedCards} variant="red" />
                                    <IndicatorCard count={awayStreams} variant="stream" />
                                  </span>
                                </div>
                                <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                                  <span className="text-xs font-bold dark:text-white text-neutral-n4">
                                    {ui.state === "upcoming" ? (
                                      "-"
                                    ) : (
                                      <AnimatedScore value={game.visitorteam?.goals ?? game.visitorteam?.ft_score ?? game.visitorteam?.score ?? 0} />
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>

                          <button
                            type="button"
                            className={`ml-1 p-1 rounded hover:bg-snow-200 dark:hover:bg-neutral-n3 ${fixtureIdForPin ? "" : "opacity-40 cursor-not-allowed"
                              }`}
                            onClick={() => {
                              if (!fixtureIdForPin) return;
                              togglePinnedFixture(fixtureIdForPin);
                            }}
                            aria-label={pinned ? "Unpin fixture" : "Pin fixture"}
                          >
                            <span
                              className={`inline-flex items-center justify-center rounded-md p-1 ${pinned ? "bg-brand-secondary" : ""
                                }`}
                            >
                              <StarIcon
                                className={`w-4 h-4 ${pinned ? "text-white fill-current" : "text-neutral-n4 dark:text-snow-200"}`}
                              />
                            </span>
                          </button>
                        </div>
                      );
                    })()
                  ))}
                </div>
              );
            })}

            {fixturesMode === "date" && loadingLeagueIds.size === 0 && extraLiveLeagueBlocks.map((leagueFixture, leagueIdx) => (
              <div
                key={`extra-live-mobile-${leagueFixture.leagueId}-${leagueIdx}`}
                className="bg-white text-sm dark:bg-[#161B22] dark:border-[#1F2937] border-1 block md:hidden h-fit flex-col border-snow-200 rounded"
              >
                <div 
                  className="flex gap-3 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 cursor-pointer select-none"
                  onClick={() => toggleLeagueCollapse(leagueFixture.leagueId, leagueFixture.fixtures.length)}
                >
                  {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                    <GetLeagueLogo
                      leagueId={leagueFixture.leagueId}
                      alt={leagueFixture.fixtures[0].league_name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <p className="font-[500] text-[#23272A] dark:text-snow-200 text-[14px] md:text-base">
                      {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name
                        ? leagueFixture.fixtures[0].league_name
                        : `League ${leagueFixture.leagueId}`}
                    </p>
                    {leagueFixture.fixtures.length >= 10 ? (
                      <div className="flex items-center gap-1 bg-brand-secondary text-white px-2 py-0.5 rounded-full ml-1">
                        <span className="text-xs font-medium">{leagueFixture.fixtures.length}</span>
                        <ChevronDownIcon className={`h-3 w-3 transition-transform ${isLeagueCollapsed(leagueFixture.leagueId, leagueFixture.fixtures.length) ? "" : "rotate-180"}`} />
                      </div>
                    ) : (
                      <ChevronDownIcon
                        className={`h-4 w-4 text-neutral-n5 dark:text-snow-200/70 transition-transform ml-1 ${isLeagueCollapsed(leagueFixture.leagueId, leagueFixture.fixtures.length) ? "" : "rotate-180"}`}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className="ml-auto text-brand-secondary hover:opacity-80"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/league/profile/${encodeURIComponent(String(leagueFixture.leagueId))}`);
                    }}
                    aria-label="Open league profile"
                  >
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
                {!isLeagueCollapsed(leagueFixture.leagueId, leagueFixture.fixtures.length) && leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                  (() => {
                    const ui = getMatchUiInfo({ status: game?.status, timer: game?.timer });
                    const events = Array.isArray(game?.events) ? game.events : [];
                    const pen = getPenaltyInfo(game);
                    const normalizeTeamKey = (raw: unknown) => {
                      const t = String(raw ?? "").trim().toLowerCase();
                      if (!t) return "";
                      if (t.includes("local") || t.includes("home")) return "localteam";
                      if (t.includes("visitor") || t.includes("away")) return "visitorteam";
                      return t;
                    };
                    const countEventType = (teamKey: "localteam" | "visitorteam", types: string[]) => {
                      const set = new Set(types.map((x) => String(x).toLowerCase()));
                      return events.reduce((acc: number, ev: any) => {
                        const evType = String(ev?.type ?? "").trim().toLowerCase();
                        const evTeam = normalizeTeamKey(ev?.team);
                        if (evTeam === teamKey && set.has(evType)) return acc + 1;
                        return acc;
                      }, 0);
                    };
                    const homeRedCards = countEventType("localteam", ["redcard"]);
                    const awayRedCards = countEventType("visitorteam", ["redcard"]);
                    const homeStreams = countEventType("localteam", ["sream", "stream"]);
                    const awayStreams = countEventType("visitorteam", ["sream", "stream"]);

                    const IndicatorCard = ({
                      count,
                      variant,
                    }: {
                      count: number;
                      variant: "red" | "stream";
                    }) => {
                      if (!count) return null;
                      const base = variant === "red" ? "bg-red-600 text-white" : "bg-sky-600 text-white";
                      const size =
                        variant === "red"
                          ? "h-4 w-3"
                          : "h-4 min-w-4 px-1 rounded-sm";
                      return (
                        <span
                          className={`inline-flex items-center justify-center ${size} text-[10px] font-bold leading-none ${base}`}
                        >
                          {variant === "red" ? (count > 1 ? count : null) : count > 1 ? count : "S"}
                        </span>
                      );
                    };
                    const statusLabel = getStatusLabel(game, ui);

                    const fixtureIdForPin = game?.fixture_id;
                    const pinned = isPinnedFixtureId(fixtureIdForPin);

                    return (
                      <Link
                        to={`/football/gameinfo/${game.static_id ?? game.fixture_id}?fixtureId=${encodeURIComponent(String(game.fixture_id ?? ""))}`}
                        key={gameIdx}
                        className="flex items-center justify-between dark:border-[#1F2937] border-b-1 border-snow-200 px-2 py-1.5 last:border-b-0 bg-neutral-n9"
                      >
                        <p
                          className={`text-xs text-center w-15 px-2 font-bold ${ui.state === "timer" || ui.state === "ht"
                            ? "text-brand-secondary animate-pulse"
                            : "text-neutral-n4 dark:text-snow-200 font-medium"
                            }`}
                        >
                          {statusLabel}
                        </p>
                        <div className="flex flex-col flex-1 mx-1 gap-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Image src={game.homeTeam?.image_url} alt={game.localteam.name} className="w-5 h-5" />
                              <span className="text-sm font-medium dark:text-white text-neutral-n4 inline-flex items-center gap-1">
                                {game.localteam.name}
                                {pen.show && pen.winner === "localteam" ? (
                                  <span className="inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                    <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                    PEN
                                  </span>
                                ) : null}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <IndicatorCard count={homeRedCards} variant="red" />
                                <IndicatorCard count={homeStreams} variant="stream" />
                              </span>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                              <span className="text-xs font-bold dark:text-white text-neutral-n4">
                                <AnimatedScore value={game.localteam?.goals ?? game.localteam?.ft_score ?? game.localteam?.score ?? 0} />
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Image src={game.awayTeam?.image_url} alt={game.visitorteam.name} className="w-5 h-5" />
                              <span className="text-sm font-medium dark:text-white text-neutral-n4 inline-flex items-center gap-1">
                                {game.visitorteam.name}
                                {pen.show && pen.winner === "visitorteam" ? (
                                  <span className="inline-flex items-center gap-1 rounded bg-snow-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold theme-text whitespace-nowrap">
                                    <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                                    PEN
                                  </span>
                                ) : null}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <IndicatorCard count={awayRedCards} variant="red" />
                                <IndicatorCard count={awayStreams} variant="stream" />
                              </span>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                              <span className="text-xs font-bold dark:text-white text-neutral-n4">
                                <AnimatedScore value={game.visitorteam?.goals ?? game.visitorteam?.ft_score ?? game.visitorteam?.score ?? 0} />
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`ml-1 p-1 rounded hover:bg-snow-200 dark:hover:bg-neutral-n3 ${fixtureIdForPin ? "" : "opacity-40 cursor-not-allowed"
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!fixtureIdForPin) return;
                            togglePinnedFixture(fixtureIdForPin);
                          }}
                          aria-label={pinned ? "Unpin fixture" : "Pin fixture"}
                        >
                          <span
                            className={`inline-flex items-center justify-center rounded-md p-1 ${pinned ? "bg-brand-secondary" : ""
                              }`}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={pinned ? "currentColor" : "none"}
                              className={pinned ? "text-white" : "text-neutral-n4 dark:text-snow-200"}
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14 9V4.5a1.5 1.5 0 0 0-3 0V9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                fill="none"
                              />
                              <path
                                d="M8 9h8l-1 9H9L8 9Z"
                                fill={pinned ? "currentColor" : "none"}
                                opacity="1"
                              />
                              <path
                                d="M8 9h8l-1 9H9L8 9Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                                fill="none"
                              />
                              <path
                                d="M12 18v3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                fill="none"
                              />
                            </svg>
                          </span>
                        </button>
                      </Link>
                    );
                  })()
                ))}
              </div>
            ))}

            {fixturesMode === "date" && dateLoadingMore && (
              <div className="flex items-center justify-center gap-2 py-6">
                <span className="h-4 w-4 rounded-full border-2 border-snow-200 dark:border-[#1F2937] border-t-brand-secondary animate-spin" />
                <p className="text-sm text-neutral-n5 dark:text-snow-200/70">
                  Loading more leagues…
                </p>
              </div>
            )}

            {!loading && fixtures.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[55vh] w-full">
                <InboxIcon className="w-10 h-10 text-neutral-n4 dark:text-neutral-m6" />
                <p className="mt-2 text-center dark:text-neutral-m6 text-neutral-n4">Nothing to show here.</p>
              </div>
            )}
          </div>
      </SportLayout>
  );
};

export default dashboard;
