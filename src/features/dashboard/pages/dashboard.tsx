import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { Category } from "@/features/dashboard/components/Category";
import { getFixturesByLeague } from "@/lib/api/endpoints";
import { closeLiveStream, subscribeDashboardLiveFixtures } from "@/lib/api/livestream";
import { useToast } from "@/context/ToastContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subDays, isToday, format } from "date-fns";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import Leftbar from "@/components/layout/LeftBar";
import { RightBar } from "@/components/layout/RightBar";
import { Link } from "react-router-dom";
// import { AfconBanner } from "@/features/dashboard/components/AfconBanner";
import GetTeamLogo from "@/components/common/GetTeamLogo";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";

// Pulsating skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-snow-200 dark:bg-[#1F2937] rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
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
  const [loading, setLoading] = useState(true);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [sseRevision, setSseRevision] = useState(0);
  const liveEventSourceRef = useRef<EventSource | null>(null);
  const latestSseUpdatesRef = useRef<{
    byMatchId: Map<string, any>;
    byFixtureId: Map<string, any>;
  }>({ byMatchId: new Map(), byFixtureId: new Map() });

  const isInSseStream = (game: any) => {
    const matchIdKey = game?.match_id ? String(game.match_id) : "";
    const fixtureIdKey = game?.fixture_id ? String(game.fixture_id) : "";
    const { byMatchId, byFixtureId } = latestSseUpdatesRef.current;
    return (matchIdKey && byMatchId.has(matchIdKey)) || (fixtureIdKey && byFixtureId.has(fixtureIdKey));
  };

  const getDateModeTimeLabel = (game: any) => {
    const useTimer = isInSseStream(game);
    return useTimer ? game?.timer : (game?.time ?? game?.timer);
  };
  const [loadingLeagueIds, setLoadingLeagueIds] = useState<Set<number>>(
    () => new Set()
  );
  const [fixturesMode, setFixturesMode] = useState<"all" | "live" | "date">(() => {
    try {
      const stored = localStorage.getItem("dashboard_fixtures_mode");
      if (stored === "all" || stored === "live" || stored === "date") return stored;
    } catch {
      // ignore storage errors
    }
    return "date";
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        durationMs: 2500,
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

  const topLeagueIds = [1204, 1399, 1326, 1229, 1269, 1368, 1221, 1141, 1322, 1352, 1368, 1081, 1308, 1457, 1271, 1282, 1370, 1169, 1191, 1338, 1342, 1441, 1447, 1258, 1193, 1082, 1194, 1253, 1276, 1284, 2457, 1097, 2453, 1171, 1306, 2476, 2030];
  // const topLeagueIds = [1399, 1204, 1269 1352];

  const extraLiveLeagueBlocks = (() => {
    void sseRevision;
    if (fixturesMode !== "all") return [] as Array<{ leagueId: number; fixtures: any[] }>;
    if (loadingLeagueIds.size > 0) return [] as Array<{ leagueId: number; fixtures: any[] }>;

    const existingMatchIds = new Set<string>();
    const existingFixtureIds = new Set<string>();
    for (const leagueBlock of fixtures) {
      const games = Array.isArray(leagueBlock?.fixtures) ? leagueBlock.fixtures : [];
      for (const g of games) {
        if (g?.match_id) existingMatchIds.add(String(g.match_id));
        if (g?.fixture_id) existingFixtureIds.add(String(g.fixture_id));
      }
    }

    const sseItems = Array.from(latestSseUpdatesRef.current.byMatchId.values());
    const grouped = new Map<number, any[]>();
    for (const item of sseItems) {
      const matchIdKey = item?.match_id ? String(item.match_id) : "";
      const fixtureIdKey = item?.fixture_id ? String(item.fixture_id) : "";
      if ((matchIdKey && existingMatchIds.has(matchIdKey)) || (fixtureIdKey && existingFixtureIds.has(fixtureIdKey))) {
        continue;
      }

      const leagueIdNum = Number(item?.league_id);
      if (!Number.isFinite(leagueIdNum)) continue;
      const prev = grouped.get(leagueIdNum) || [];
      prev.push(item);
      grouped.set(leagueIdNum, prev);
    }

    return Array.from(grouped.entries())
      .map(([leagueId, fx]) => ({ leagueId, fixtures: fx }))
      .sort((a, b) => a.leagueId - b.leagueId);
  })();

  useEffect(() => {
    try {
      localStorage.setItem("dashboard_fixtures_mode", fixturesMode);
    } catch {
      // ignore storage errors
    }
  }, [fixturesMode]);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        setFixtures([]); // Clear previous fixtures immediately
        if (fixturesMode === "date" || fixturesMode === "all") {
          setLoadingLeagueIds(new Set(topLeagueIds));
        } else {
          setLoadingLeagueIds(new Set());
        }
        const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'); // Use selectedDate, default to today if null

        const upsertLeagueFixtures = (leagueId: number, leagueFixtures: any[]) => {
          const patchWithLatestSse = (games: any[]) => {
            const { byMatchId, byFixtureId } = latestSseUpdatesRef.current;
            if (!byMatchId.size && !byFixtureId.size) return games;
            return games.map((game: any) => {
              const matchIdKey = game?.match_id ? String(game.match_id) : "";
              const fixtureIdKey = game?.fixture_id ? String(game.fixture_id) : "";
              const update =
                (matchIdKey && byMatchId.get(matchIdKey)) ||
                (fixtureIdKey && byFixtureId.get(fixtureIdKey));
              return update ? { ...game, ...update } : game;
            });
          };

          setFixtures((prev) => {
            const next = prev.filter((x) => x.leagueId !== leagueId);
            const fixturesToInsert =
              fixturesMode === "date" || fixturesMode === "all" ? patchWithLatestSse(leagueFixtures) : leagueFixtures;
            next.push({ leagueId, fixtures: fixturesToInsert });
            if (fixturesMode === "date" || fixturesMode === "all") {
              next.sort(
                (a, b) =>
                  topLeagueIds.indexOf(a.leagueId) - topLeagueIds.indexOf(b.leagueId)
              );
            } else {
              next.sort((a, b) => a.leagueId - b.leagueId);
            }
            return next;
          });
        };

        const markLeagueDone = (leagueId: number) => {
          setLoadingLeagueIds((prev) => {
            const next = new Set(prev);
            next.delete(leagueId);
            return next;
          });
        };

        closeLiveStream(liveEventSourceRef.current);
        liveEventSourceRef.current = subscribeDashboardLiveFixtures({
          onUpdate: (liveItems) => {
            setSseRevision((x) => x + 1);
            if (fixturesMode === "live") {
              const nextByMatchId = new Map<string, any>();
              const nextByFixtureId = new Map<string, any>();
              const grouped = new Map<number, any[]>();
              for (const item of liveItems) {
                const leagueIdNum = Number((item as any)?.league_id);
                if (!Number.isFinite(leagueIdNum)) continue;
                const matchId = (item as any)?.match_id;
                const fixtureId = (item as any)?.fixture_id;
                if (matchId) nextByMatchId.set(String(matchId), item);
                if (fixtureId) nextByFixtureId.set(String(fixtureId), item);
                const prev = grouped.get(leagueIdNum) || [];
                prev.push(item);
                grouped.set(leagueIdNum, prev);
              }

              latestSseUpdatesRef.current = { byMatchId: nextByMatchId, byFixtureId: nextByFixtureId };

              const next = Array.from(grouped.entries())
                .map(([leagueId, fixtures]) => ({ leagueId, fixtures }))
                .sort((a, b) => a.leagueId - b.leagueId);

              setFixtures(next);
              setLoading(false);
              setLoadingLeagueIds(new Set());
              return;
            }

            // fixturesMode === "date" | "all": merge SSE updates into existing date fixtures
            const updatesByFixtureId = new Map<string, any>();
            const updatesByMatchId = new Map<string, any>();
            for (const item of liveItems) {
              const fixtureId = (item as any)?.fixture_id;
              const matchId = (item as any)?.match_id;
              if (fixtureId) updatesByFixtureId.set(String(fixtureId), item);
              if (matchId) updatesByMatchId.set(String(matchId), item);
            }

            latestSseUpdatesRef.current = { byMatchId: updatesByMatchId, byFixtureId: updatesByFixtureId };

            setFixtures((prev) => {
              if (!prev || prev.length === 0) return prev;

              let changed = false;

              const next = prev.map((leagueBlock: any) => {
                const currentFixtures = Array.isArray(leagueBlock?.fixtures)
                  ? leagueBlock.fixtures
                  : [];

                const mergedFixtures = currentFixtures.map((game: any) => {
                  const fixtureIdKey = game?.fixture_id ? String(game.fixture_id) : "";
                  const matchIdKey = game?.match_id ? String(game.match_id) : "";

                  const update =
                    (matchIdKey && updatesByMatchId.get(matchIdKey)) ||
                    (fixtureIdKey && updatesByFixtureId.get(fixtureIdKey));

                  if (!update) return game;
                  changed = true;

                  // Shallow-merge is enough since update contains latest localteam/visitorteam/events/status/timer/etc.
                  return { ...game, ...update };
                });

                return { ...leagueBlock, fixtures: mergedFixtures };
              });

              return changed ? next : prev;
            });
          },
          onError: (err) => {
            console.warn("Live fixtures SSE error:", err);
          },
        });

        if (fixturesMode === "live") {
          // Live mode is SSE-driven; skip REST fetching
          setLoading(false);
          setLoadingLeagueIds(new Set());
          return;
        }

        const fetchLeague = async (leagueId: number) => {
          try {
            const response = await getFixturesByLeague(leagueId, formattedDate, 1, 100);
            if (
              response?.success &&
              response?.responseObject?.items &&
              Array.isArray(response.responseObject.items) &&
              response.responseObject.items.length > 0
            ) {
              upsertLeagueFixtures(leagueId, response.responseObject.items);
            } else if (
              response?.message === "Error fetching fixtures By LeagueId" &&
              response?.error === "Fixture list is empty."
            ) {
              // Silently ignore empty fixture lists for specific league IDs
            } else {
              console.warn(
                `No fixtures or unexpected response for leagueId ${leagueId}. Full response:`,
                response
              );
            }
          } catch (leagueError) {
            console.warn(
              `Failed to fetch fixtures for leagueId ${leagueId} (continuing with others):`,
              leagueError
            );
          } finally {
            markLeagueDone(leagueId);
          }
        };

        // Limited concurrency to keep the page responsive.
        const concurrency = 2;
        let idx = 0;
        const workers = Array.from({ length: concurrency }).map(async () => {
          while (idx < topLeagueIds.length) {
            const current = topLeagueIds[idx];
            idx += 1;
            await fetchLeague(current);
          }
        });

        await Promise.all(workers);
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

  return (
    <div className="transition-al">
      {/* Page Header (always visible, no skeleton) */}
      <PageHeader />
      {/* Category Navigation */}
      <Category />

      <div className="flex page-padding-x dark:bg-[#0D1117] gap-5 py-5 justify-around" style={{ height: 'calc(100vh - 20px)' }}>
        {/* Left Sidebar */}
        <section className="h-full pb-30 overflow-y-auto hide-scrollbar w-1/5 hidden lg:block pr-2">
          <Leftbar />
        </section>

        {/* Main Content Area */}
        <div className="w-full pb-30 flex flex-col gap-y-3 md:gap-y-5 lg:w-3/5 h-full overflow-y-auto hide-scrollbar pr-2">
          
          {/* Date and Filter Controls */}
          <div className="flex-col">
          {/* <AfconBanner /> */}
          <div className="block-style ">
            <div className="flex dark:text-snow-200 justify-center flex-col">
              {/* Date Navigation */}
              <div className="relative flex items-center mb-3 justify-between">
                <ArrowLeftIcon className="text-neutral-n4 h-5 cursor-pointer" onClick={() => setSelectedDate(prevDate => subDays(prevDate || new Date(), 1))} />
                <div className="flex gap-3  items-center cursor-pointer" onClick={() => setShowDatePicker(!showDatePicker)}>
                  <p>{selectedDate && isToday(selectedDate) ? "Today" : (selectedDate ? selectedDate.toDateString() : new Date().toDateString())}</p>
                  <CalendarIcon className="text-neutral-n4 h-5" />
                </div>
                <ArrowRightIcon className="text-neutral-n4 h-5 cursor-pointer" onClick={() => setSelectedDate(prevDate => addDays(prevDate || new Date(), 1))} />
                {showDatePicker && (
                  <div className="absolute z-10 top-full right-0 mt-2">
                    <DatePicker
                      selected={selectedDate}
                      calendarClassName="bg-black"
                      onChange={(date: Date | null) => {
                        setSelectedDate(date);
                        setFixturesMode("date");
                        setShowDatePicker(false); // Close date picker after selection
                      }}
                      dateFormat="yyyy-MM-dd"
                      inline
                    />
                  </div>
                )}
              </div>
              {/* Filter Buttons */}
              <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
                <div
                  className=" dark:text-snow-200 overflow-x-hidden flex gap-3 w-full hide-scrollbar"
                >
                  <button
                    className={`filter-btn dark:border-[#1F2937] ${fixturesMode === "all" ? "text-brand-secondary hover:text-white" : "hover:text-white"}`}
                    onClick={() => setFixturesMode("all")}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn dark:border-[#1F2937] ${fixturesMode === "live" ? "text-brand-secondary hover:text-white" : "hover:text-white"}`}
                    onClick={() => setFixturesMode("live")}
                  >
                    Live Games
                  </button>
                  <button
                    className={`filter-btn dark:border-[#1F2937] ${fixturesMode === "date" ? "text-brand-secondary hover:text-white" : "hover:text-white"}`}
                    onClick={() => setFixturesMode("date")}
                  >
                    By Date
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>



          {/* Main Content Games Loop */}
          <div className="flex flex-col gap-y-3 md:gap-y-6">
            {/* Desktop Section */}
            <div className="hidden md:block">
              {(fixturesMode === "live"
                ? fixtures.map((x) => x.leagueId)
                : topLeagueIds
              ).map((leagueId, leagueIdx) => {
                const leagueFixture = fixtures.find((x) => x.leagueId === leagueId);

                if (!leagueFixture) {
                  if (!loadingLeagueIds.has(leagueId)) return null;

                  return (
                    <div key={leagueId + "-" + leagueIdx} className="block-style">
                      <div className="flex gap-3 border-b-1 px-5 py-3 border-snow-200">
                        <Skeleton className="w-10 h-10" />
                        <Skeleton className="w-32 h-6" />
                      </div>
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex justify-around items-center gap-4 border-b-1 px-5 py-3 border-snow-200 last:border-b-0"
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

                return (
                  <div key={leagueFixture.leagueId + "-" + leagueIdx} className="block-style">
                    <div className="flex gap-3 border-b-1 px-5 py-3  border-snow-200 dark:border-[#1F2937]">
                      {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                        <GetLeagueLogo
                          leagueId={leagueFixture.leagueId}
                          alt={leagueFixture.fixtures[0].league_name}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <p className="font-[500] text-[#23272A] dark:text-neutral-m6  text-[14px] md:text-base">
                        {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name ? leagueFixture.fixtures[0].league_name : `League ${leagueFixture.leagueId}`}
                      </p>
                    </div>
                    {leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                      <Link
                        to={`/football/gameinfo/${game.fixture_id}`}
                        key={gameIdx}
                        className={`flex hover:bg-snow-100 dark:hover:bg-neutral-n2 cursor-pointer transition-colors items-center gap-2 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 ${
                          gameIdx === leagueFixture.fixtures.length - 1
                            ? "last:border-b-0  border-b-0"
                            : ""
                        }`}
                      >
                        {game.status === "FT" ? (
                          <>
                            <p className="text-brand-secondary flex-1/11 font-bold">FT</p>
                            <div className="flex dark:text-white flex-4/11 justify-end items-center gap-3">
                              <p>{game.localteam.name}</p>
                              <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-fit h-5 mr-1" />
                            </div>
                            <div className="flex-2/11 flex  justify-between">
                              <p className="score">{game.localteam?.goals ?? game.localteam?.ft_score ?? game.localteam?.score ?? '-'}</p>
                              <p className="score">{game.visitorteam?.goals ?? game.visitorteam?.ft_score ?? game.visitorteam?.score ?? '-'}</p>
                            </div>
                            <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                              <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                              <p>{game.visitorteam.name}</p>
                            </div>
                          </>
                        ) : game.status === "HT" ? (
                          <>
                            <p className="text-brand-secondary animate-pulse flex-1/11 font-bold">HT</p>
                            <div className="flex dark:text-white flex-4/11 justify-end items-center gap-3">
                              <p>{game.localteam.name}</p>
                              <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-fit h-5 mr-1" />
                            </div>
                            <div className="flex-2/11 flex  justify-between">
                              <AnimatedScore className="score" value={game.localteam?.goals ?? game.localteam?.score ?? 0} />
                              <AnimatedScore className="score" value={game.visitorteam?.goals ?? game.visitorteam?.score ?? 0} />
                            </div>
                            <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                              <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                              <p>{game.visitorteam.name}</p>
                            </div>
                          </>
                        ) : Number(game.timer) > 1 ? (
                          <>
                            <p className="text-brand-secondary animate-pulse flex-1/11 font-bold">{game.timer}"</p>
                            <div className="flex dark:text-white flex-4/11 justify-end items-center gap-3">
                              <p>{game.localteam.name}</p>
                              <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-fit h-5 mr-1" />
                            </div>
                            <div className="flex-2/11 flex  justify-between">
                              <AnimatedScore className="score" value={game.localteam?.goals ?? game.localteam?.score ?? 0} />
                              <AnimatedScore className="score" value={game.visitorteam?.goals ?? game.visitorteam?.score ?? 0} />
                            </div>
                            <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                              <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                              <p>{game.visitorteam.name}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex dark:text-white flex-5/11 justify-end items-center gap-3">
                              <p>{game.localteam.name}</p>
                              <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-fit h-5 mr-1" />
                            </div>
                            <p className="neutral-n1 flex-2/11 items-center whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200">
                              {game.status === "HT" ? "HT" : game.status === "live" ? "LIVE" : getDateModeTimeLabel(game)}
                            </p>
                            <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                              <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                              <p>{game.visitorteam.name}</p>
                            </div>
                          </>
                        )}
                      </Link>
                    ))}
                  </div>
                );
              })}

              {fixturesMode === "all" && loadingLeagueIds.size === 0 && extraLiveLeagueBlocks.map((leagueFixture, leagueIdx) => (
                <div key={`extra-live-${leagueFixture.leagueId}-${leagueIdx}`} className="block-style">
                  <div className="flex gap-3 border-b-1 px-5 py-3  border-snow-200 dark:border-[#1F2937]">
                    {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                      <GetLeagueLogo
                        leagueId={leagueFixture.leagueId}
                        alt={leagueFixture.fixtures[0].league_name}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <p className="font-[500] text-[#23272A] dark:text-neutral-m6  text-[14px] md:text-base">
                      {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name
                        ? leagueFixture.fixtures[0].league_name
                        : `League ${leagueFixture.leagueId}`}
                    </p>
                  </div>
                  {leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                    <Link
                      to={`/football/gameinfo/${game.fixture_id}`}
                      key={gameIdx}
                      className={`flex hover:bg-snow-100 dark:hover:bg-neutral-n2 cursor-pointer transition-colors items-center gap-2 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 ${
                        gameIdx === leagueFixture.fixtures.length - 1 ? "last:border-b-0  border-b-0" : ""
                      }`}
                    >
                      {game.status === "HT" ? (
                        <>
                          <p className="text-brand-secondary animate-pulse flex-1/11 font-bold">HT</p>
                          <div className="flex dark:text-white flex-4/11 justify-end items-center gap-3">
                            <p>{game.localteam.name}</p>
                            <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-fit h-5 mr-1" />
                          </div>
                          <div className="flex-2/11 flex  justify-between">
                            <AnimatedScore className="score" value={game.localteam?.goals ?? game.localteam?.score ?? 0} />
                            <AnimatedScore className="score" value={game.visitorteam?.goals ?? game.visitorteam?.score ?? 0} />
                          </div>
                          <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                            <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                            <p>{game.visitorteam.name}</p>
                          </div>
                        </>
                      ) : Number(game.timer) > 1 ? (
                        <>
                          <p className="text-brand-secondary animate-pulse flex-1/11 font-bold">{game.timer}"</p>
                          <div className="flex dark:text-white flex-4/11 justify-end items-center gap-3">
                            <p>{game.localteam.name}</p>
                            <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-fit h-5 mr-1" />
                          </div>
                          <div className="flex-2/11 flex  justify-between">
                            <AnimatedScore className="score" value={game.localteam?.goals ?? game.localteam?.score ?? 0} />
                            <AnimatedScore className="score" value={game.visitorteam?.goals ?? game.visitorteam?.score ?? 0} />
                          </div>
                          <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                            <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                            <p>{game.visitorteam.name}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex dark:text-white flex-5/11 justify-end items-center gap-3">
                            <p>{game.localteam.name}</p>
                            <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-fit h-5 mr-1" />
                          </div>
                          <p className="neutral-n1 flex-2/11 items-center whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200">
                            LIVE
                          </p>
                          <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                            <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                            <p>{game.visitorteam.name}</p>
                          </div>
                        </>
                      )}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            

            {/* Mobile Section */}
            {(fixturesMode === "live"
              ? fixtures.map((x) => x.leagueId)
              : topLeagueIds
            ).map((leagueId, leagueIdx) => {
              const leagueFixture = fixtures.find((x) => x.leagueId === leagueId);

              if (!leagueFixture) {
                if (!loadingLeagueIds.has(leagueId)) return null;

                return (
                  <div
                    key={leagueId + "-" + leagueIdx}
                    className="bg-white dark:bg-[#161B2[] border-1 block md:hidden h-fit flex-col border-snow-200 rounded"
                  >
                    <div className="flex gap-3 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 items-center">
                      <Skeleton className="w-8 h-8" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border-b-1 border-snow-200 px-2 py-1.5 last:border-b-0 bg-neutral-n9"
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

              return (
                <div
                  key={leagueFixture.leagueId + "-" + leagueIdx}
                  className="bg-white text-sm dark:bg-[#161B22] dark:border-[#1F2937] border-1 block md:hidden h-fit flex-col border-snow-200 rounded"
                >
                  <div className="flex gap-3 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200">
                    {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                      <GetLeagueLogo
                        leagueId={leagueFixture.leagueId}
                        alt={leagueFixture.fixtures[0].league_name}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <p className="font-[500] text-[#23272A] dark:text-snow-200 text-[14px] md:text-base">
                      {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name ? leagueFixture.fixtures[0].league_name : `League ${leagueFixture.leagueId}`}
                    </p>
                  </div>
                  {leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                    <Link
                      to={`/football/gameinfo/${game.fixture_id}`}
                      key={gameIdx}
                      className="flex items-center justify-between dark:border-[#1F2937] border-b-1 border-snow-200 px-2 py-1.5 last:border-b-0 bg-neutral-n9"
                    >
                      {fixturesMode === "live" ? (
                        <p className="text-xs text-brand-secondary animate-pulse text-center w-15 px-2 font-bold">
                          {game.status === "HT" ? "HT" : Number(game.timer) > 1 ? `${game.timer}"` : "LIVE"}
                        </p>
                      ) : game.status === "FT" ? (
                        <p className="text-xs text-brand-secondary text-center w-15 px-2 font-medium">FT</p>
                      ) : game.status === "1st Half" || game.status === "2nd Half" ? (
                        <p className="text-xs text-brand-secondary animate-pulse text-center w-15 px-2 font-bold">{game.timer}"</p>
                      ) : game.status === "HT" ? (
                        <p className="text-xs text-brand-secondary animate-pulse text-center w-15 px-2 font-bold">HT</p>
                      ) : game.status === "live" ? (
                        <p className="text-xs text-brand-secondary animate-pulse text-center w-15 px-2 font-bold">
                          {Number(game.timer) > 1 ? `${game.timer}"` : "LIVE"}
                        </p>
                      ) : (
                        <p className="text-xs dark:text-snow-200 text-neutral-n4 text-center w-15 px-2 font-medium">{getDateModeTimeLabel(game)}</p>
                      )}
                      <div className="flex flex-col flex-1 mx-1 gap-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-5 h-5" />
                            <span className="text-sm font-medium dark:text-white text-neutral-n4">
                              {game.localteam.name}
                            </span>
                          </div>
                          <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                            <span className="text-xs font-bold dark:text-white text-neutral-n4">
                              {fixturesMode === "live" ? (
                                <AnimatedScore value={game.localteam?.goals ?? game.localteam?.score ?? 0} />
                              ) : game.status === "FT" ? (
                                game.localteam?.ft_score ?? game.localteam?.goals ?? game.localteam?.score ?? "-"
                              ) : game.status === "1st Half" || game.status === "2nd Half" ? (
                                <AnimatedScore value={game.localteam?.score ?? 0} />
                              ) : game.status === "HT" ? (
                                <AnimatedScore value={game.localteam?.goals ?? game.localteam?.score ?? 0} />
                              ) : game.status === "live" ? (
                                <AnimatedScore value={game.localteam?.goals ?? game.localteam?.score ?? 0} />
                              ) : (
                                "-"
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-5 h-5" />
                            <span className="text-sm font-medium dark:text-white text-neutral-n4">
                              {game.visitorteam.name}
                            </span>
                          </div>
                          <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                            <span className="text-xs font-bold dark:text-white text-neutral-n4">
                              {fixturesMode === "live" ? (
                                <AnimatedScore value={game.visitorteam?.goals ?? game.visitorteam?.score ?? 0} />
                              ) : game.status === "FT" ? (
                                game.visitorteam?.ft_score ?? game.visitorteam?.goals ?? game.visitorteam?.score ?? "-"
                              ) : game.status === "1st Half" || game.status === "2nd Half" ? (
                                <AnimatedScore value={game.visitorteam?.score ?? 0} />
                              ) : game.status === "HT" ? (
                                <AnimatedScore value={game.visitorteam?.goals ?? game.visitorteam?.score ?? 0} />
                              ) : game.status === "live" ? (
                                <AnimatedScore value={game.visitorteam?.goals ?? game.visitorteam?.score ?? 0} />
                              ) : (
                                "-"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}

            {fixturesMode === "all" && loadingLeagueIds.size === 0 && extraLiveLeagueBlocks.map((leagueFixture, leagueIdx) => (
              <div
                key={`extra-live-mobile-${leagueFixture.leagueId}-${leagueIdx}`}
                className="bg-white text-sm dark:bg-[#161B22] dark:border-[#1F2937] border-1 block md:hidden h-fit flex-col border-snow-200 rounded"
              >
                <div className="flex gap-3 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200">
                  {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                    <GetLeagueLogo
                      leagueId={leagueFixture.leagueId}
                      alt={leagueFixture.fixtures[0].league_name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <p className="font-[500] text-[#23272A] dark:text-snow-200 text-[14px] md:text-base">
                    {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name
                      ? leagueFixture.fixtures[0].league_name
                      : `League ${leagueFixture.leagueId}`}
                  </p>
                </div>
                {leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                  <Link
                    to={`/football/gameinfo/${game.fixture_id}`}
                    key={gameIdx}
                    className="flex items-center justify-between dark:border-[#1F2937] border-b-1 border-snow-200 px-2 py-1.5 last:border-b-0 bg-neutral-n9"
                  >
                    <p className="text-xs text-brand-secondary animate-pulse text-center w-15 px-2 font-bold">
                      {game.status === "HT" ? "HT" : Number(game.timer) > 1 ? `${game.timer}"` : "LIVE"}
                    </p>
                    <div className="flex flex-col flex-1 mx-1 gap-0.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-5 h-5" />
                          <span className="text-sm font-medium dark:text-white text-neutral-n4">
                            {game.localteam.name}
                          </span>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                          <span className="text-xs font-bold dark:text-white text-neutral-n4">
                            <AnimatedScore value={game.localteam?.goals ?? game.localteam?.score ?? 0} />
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-5 h-5" />
                          <span className="text-sm font-medium dark:text-white text-neutral-n4">
                            {game.visitorteam.name}
                          </span>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                          <span className="text-xs font-bold dark:text-white text-neutral-n4">
                            <AnimatedScore value={game.visitorteam?.goals ?? game.visitorteam?.score ?? 0} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}

            {!loading && fixtures.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[55vh] w-full">
                <InboxIcon className="w-10 h-10 text-neutral-n4 dark:text-neutral-m6" />
                <p className="mt-2 text-center dark:text-neutral-m6 text-neutral-n4">Nothing to show here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 pb-30 hidden lg:block h-full overflow-y-auto hide-scrollbar">
          <RightBar />
        </div>
        
      </div>

      {/* Footer */}
      <FooterComp />
    </div>
  );
};

export default dashboard;
