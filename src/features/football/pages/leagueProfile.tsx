import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import Image from "@/components/common/Image";
import {
  getFootballLeagueLeaders,
  getLeagueById,
  getStandingSeasonsByLeagueId,
  getLeagueFixtures,
  type FootballLeagueLeadersResponse,
} from "@/lib/api/endpoints";
import { DropdownSelector } from "@/components/ui/DropdownSelector";
import { navigate } from "@/lib/router/navigate";
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import StandingsTable from "@/features/football/components/standings/StandingsTable";
import { Helmet } from "react-helmet";
import { useToast } from "@/context/ToastContext";
import { useQuery } from "@tanstack/react-query";

type LeagueApiItem = {
  id?: number;
  league_id?: number;
  leagueId?: number;
  name?: string;
  category?: string;
  country?: string;
  image?: string;
  logo?: string;
  image_path?: string;
};

type LeagueApiResponse = {
  success?: boolean;
  message?: string;
  responseObject?: {
    item?: LeagueApiItem | LeagueApiItem[];
  };
  statusCode?: number;
};

type LeaderboardPlayer = {
  playerId: number;
  name: string;
  value: number;
  extra?: string;
  playerImageUrl?: string;
  teamImageUrl?: string;
  teamName?: string;
};

type LeagueLeadersState = {
  season?: string;
  goals: LeaderboardPlayer[];
  assists: LeaderboardPlayer[];
  duels: LeaderboardPlayer[];
};

const Leaderboard = ({
  title,
  metricLabel,
  items,
}: {
  title: string;
  metricLabel: string;
  items: LeaderboardPlayer[];
}) => {
  return (
    <div className="my-8">
      <div className="rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-brand-primary/10 via-transparent to-orange-500/10 dark:from-brand-primary/20 dark:to-orange-500/20">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="theme-text font-bold text-base md:text-lg truncate">{title}</p>
            </div>
            <div className="shrink-0 rounded-xl border border-snow-200 dark:border-snow-100/10 bg-white/70 dark:bg-white/5 px-3 py-2">
              <p className="theme-text text-xs font-semibold">{metricLabel}</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-snow-200 dark:divide-snow-100/10">
          {items.map((p, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            return (
              <div
                key={`${p.name}-${p.playerId}-${rank}`}
                className={`flex items-center gap-4 px-5 py-3 hover:bg-snow-100/60 dark:hover:bg-white/5 transition-colors ${
                  isTop3 ? "bg-gradient-to-r from-orange-500/5 via-transparent to-transparent dark:from-orange-500/10" : ""
                }`}
              >
                <div className="w-9 shrink-0">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                      isTop3
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "bg-snow-100 dark:bg-white/10 theme-text"
                    }`}
                  >
                    {rank}
                  </div>
                </div>

                <div className="h-10 w-10 rounded-2xl overflow-hidden bg-snow-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                  <Image
                    src={p.playerImageUrl}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover"
                    fallback="/loading-state/player.svg"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/player/profile/${encodeURIComponent(String(p.playerId))}`)}
                    className="theme-text font-semibold text-base truncate text-left hover:underline"
                    aria-label={`Open ${p.name} profile`}
                  >
                    {p.name}
                  </button>
                  <div className="text-neutral-m6 text-xs mt-1 min-w-0 truncate">
                    <span className="flex items-center gap-2 min-w-0">
                      {p.teamImageUrl ? (
                        <Image src={p.teamImageUrl} alt={p.teamName ?? ""} className="w-4 h-4 rounded-full object-contain" fallback="/loading-state/shield.svg" />
                      ) : (
                        <img src="/loading-state/shield.svg" alt="" className="w-4 h-4" />
                      )}
                      <span className="truncate">{p.teamName ?? "-"}</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="theme-text font-bold text-base leading-none">{p.value}</p>
                  <p className="text-neutral-m6 text-[11px] mt-1">{metricLabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LeagueProfile = () => {
  const toast = useToast();
  const tabs = useMemo(
    () => [
      { id: "standings", label: "Standings" },
      { id: "matches", label: "Matches" },
      { id: "top-scorers", label: "Top Scorers" },
      { id: "top-assists", label: "Top Assists" },
      { id: "top-duels", label: "Top Duels" },
    ],
    []
  );

  const getTabFromHash = () => {
    if (typeof window === "undefined") return "standings";
    const hash = window.location.hash.replace("#", "");
    return tabs.find((t) => t.id === hash) ? hash : "standings";
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);

  const { leagueId: leagueIdParam } = useParams<{ leagueId?: string }>();
  const [searchParams] = useSearchParams();
  const leagueIdFromQuery = searchParams.get("id") ?? undefined;
  const leagueId = leagueIdParam ?? leagueIdFromQuery;

  const [season, setSeason] = useState<string>("");

  const {
    data: seasonsData,
  } = useQuery({
    queryKey: ["standingSeasons", leagueId],
    queryFn: async () => await getStandingSeasonsByLeagueId(String(leagueId ?? "")),
    enabled: !!leagueId,
    staleTime: 60_000,
  });

  const availableSeasons = useMemo(() => {
    const items = seasonsData?.responseObject?.item;
    if (Array.isArray(items)) {
      return items.map((s: string) => ({ value: s, label: s }));
    }
    return [];
  }, [seasonsData]);

  useEffect(() => {
    if (!season && availableSeasons.length > 0) {
      setSeason(availableSeasons[0].value);
    }
  }, [availableSeasons, season]);

  const {
    data: leagueResponse,
    isLoading: isLeagueLoading,
    error: leagueError,
  } = useQuery<LeagueApiResponse>({
    queryKey: ["league", leagueId],
    queryFn: async () =>
      (await getLeagueById(String(leagueId ?? ""))) as LeagueApiResponse,
    enabled: !!leagueId,
  });

  const league: LeagueApiItem | null = useMemo(() => {
    const item = leagueResponse?.responseObject?.item;
    const resolved = Array.isArray(item) ? item[0] : item;
    return resolved ?? null;
  }, [leagueResponse]);

  const leagueErrorMessage =
    leagueError instanceof Error ? leagueError.message : leagueError ? "Failed to load league" : null;

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const foundTab = tabs.find((t) => t.id === hash);
      setActiveTab(foundTab ? hash : "standings");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [tabs]);

  const handleTabClick = (tabId: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(tabId);
    const newUrl = `${window.location.pathname}${window.location.search}#${tabId}`;
    window.history.replaceState(null, "", newUrl);
  };

  const resolvedLeagueId = useMemo(() => {
    const fromItem = league?.league_id ?? league?.leagueId ?? league?.id;
    const fromUrl = Number.isFinite(Number(leagueId)) ? Number(leagueId) : leagueId;
    return fromItem ?? fromUrl;
  }, [league, leagueId]);

  const leagueName = useMemo(() => {
    const name = String(league?.name ?? "").trim();
    return name || "League";
  }, [league]);

  const leagueCategory = useMemo(() => {
    const s = String(league?.category ?? "").trim();
    return s || "-";
  }, [league]);

  const leagueCountry = useMemo(() => {
    const s = String(league?.country ?? "").trim();
    return s || "-";
  }, [league]);

  const [leadersLoading, setLeadersLoading] = useState(false);
  const [leadersError, setLeadersError] = useState<string | null>(null);
  const [leaders, setLeaders] = useState<LeagueLeadersState | null>(null);

  const mapLeaders = (
    res: FootballLeagueLeadersResponse,
  ): LeagueLeadersState => {
    const ro = res?.responseObject;
    const season = ro?.season;

    const mapItem = (
      item: any,
      valueKey: "goals" | "assists" | "duels",
    ): LeaderboardPlayer => {
      const name =
        String(item?.common_name ?? "").trim() ||
        String(`${item?.firstname ?? ""} ${item?.lastname ?? ""}`).trim() ||
        "-";

      return {
        playerId: Number(item?.player_id ?? 0),
        name,
        value: Number(item?.[valueKey] ?? 0),
        extra: undefined,
        playerImageUrl: item?.playerImageUrl,
        teamImageUrl: item?.teamImageUrl,
        teamName: item?.teamName,
      };
    };

    return {
      season,
      goals: Array.isArray(ro?.goals) ? ro!.goals!.map((x) => mapItem(x, "goals")) : [],
      assists: Array.isArray(ro?.assists) ? ro!.assists!.map((x) => mapItem(x, "assists")) : [],
      duels: Array.isArray(ro?.duels) ? ro!.duels!.map((x) => mapItem(x, "duels")) : [],
    };
  };

  useEffect(() => {
    const id = resolvedLeagueId;
    if (id == null || String(id).trim() === "") {
      setLeaders(null);
      setLeadersError(null);
      setLeadersLoading(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLeadersLoading(true);
      setLeadersError(null);
      try {
        const res = await getFootballLeagueLeaders(id, season);
        if (cancelled) return;
        setLeaders(mapLeaders(res));
      } catch (e: any) {
        if (cancelled) return;
        setLeaders(null);
        setLeadersError(String(e?.message ?? "Failed to load league leaders"));
      } finally {
        if (!cancelled) setLeadersLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [resolvedLeagueId, season]);

  const [matchesMode, setMatchesMode] = useState<"played" | "upcoming" | "all">("all");

  const [fixturesData, setFixturesData] = useState<any>(null);
  const [fixturesLoading, setFixturesLoading] = useState(false);
  const [fixturesError, setFixturesError] = useState<string | null>(null);

  useEffect(() => {
    const id = resolvedLeagueId;
    if (id == null || String(id).trim() === "" || !season) {
      setFixturesData(null);
      setFixturesError(null);
      setFixturesLoading(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setFixturesLoading(true);
      setFixturesError(null);
      try {
        const data = await getLeagueFixtures(id, season);
        if (cancelled) return;
        setFixturesData(data);
      } catch (e: any) {
        if (cancelled) return;
        setFixturesData(null);
        setFixturesError(String(e?.message ?? "Failed to load matches"));
      } finally {
        if (!cancelled) setFixturesLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [resolvedLeagueId, season]);

  const allItems = useMemo(() => {
    const items = (fixturesData as any)?.responseObject?.items;
    if (!Array.isArray(items)) return [];
    return items;
  }, [fixturesData]);

  const getDate = (m: any) => new Date(String(m?.date ?? "")).getTime();

  const playedMatches = useMemo(() => {
    return allItems
      .filter((m: any) => String(m?.status ?? "").toUpperCase() === "FT")
      .sort((a: any, b: any) => getDate(b) - getDate(a));
  }, [allItems]);

  const upcomingMatches = useMemo(() => {
    return allItems
      .filter((m: any) => String(m?.status ?? "").toUpperCase() !== "FT")
      .sort((a: any, b: any) => getDate(a) - getDate(b));
  }, [allItems]);

  const displayedMatches = useMemo(() => {
    if (matchesMode === "played") return playedMatches;
    if (matchesMode === "upcoming") return upcomingMatches;
    return [...upcomingMatches, ...playedMatches];
  }, [playedMatches, upcomingMatches, allItems, matchesMode]);

  const upcomingFixtureIdSet = useMemo(() => {
    const set = new Set<string>();
    for (const m of upcomingMatches) {
      const id = m?.fixture_id ?? m?.id;
      const key = String(id ?? "").trim();
      if (key) set.add(key);
    }
    return set;
  }, [upcomingMatches]);

  const matchesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchesMode !== "all") return;
    const el = matchesContainerRef.current;
    if (!el) return;
    const firstUpcoming = el.querySelector("[data-upcoming='true']") as HTMLElement | null;
    if (firstUpcoming) {
      firstUpcoming.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [matchesMode, displayedMatches]);

  const getRedCount = (fx: any, side: "localteam" | "visitorteam") => {
    const direct = Number((fx?.[side]?.redcards ?? fx?.[side]?.red_cards ?? fx?.[side]?.redCards) ?? 0);
    if (Number.isFinite(direct) && direct > 0) return direct;
    const events = Array.isArray(fx?.events) ? fx.events : [];
    if (!events.length) return 0;
    return events.reduce((acc: number, e: any) => {
      const t = String(e?.type ?? e?.event ?? "").toLowerCase();
      const teamKey = String(e?.team ?? e?.team_type ?? e?.side ?? "").toLowerCase();
      const matchesSide = teamKey === side || (side === "localteam" && teamKey === "home") || (side === "visitorteam" && teamKey === "away");
      if (matchesSide && t.includes("red")) return acc + 1;
      return acc;
    }, 0);
  };

  const canonicalUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}${window.location.search}`
    : "";

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [hasCopiedShareUrl, setHasCopiedShareUrl] = useState(false);

  const copyShareUrl = async () => {
    try {
      if (!canonicalUrl) throw new Error("Missing URL");

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(canonicalUrl);
      } else if (typeof document !== "undefined") {
        const el = document.createElement("textarea");
        el.value = canonicalUrl;
        el.setAttribute("readonly", "true");
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }

      setHasCopiedShareUrl(true);
      toast.show({ variant: "success", message: "Link copied to clipboard" });
    } catch {
      toast.show({ variant: "error", message: "Could not copy link. Please copy it manually." });
    }
  };

  const isSpecialLeague = Number(resolvedLeagueId) === 1005 || Number(resolvedLeagueId) === 1056;

  const specialLeagueBg = useMemo(() => {
    const id = Number(resolvedLeagueId);
    if (id === 1005) {
      return {
        backgroundImage: `url("/tournament/ucl.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (id === 1056) {
      return {
        backgroundImage: `url("/tournament/worldcup.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return undefined;
  }, [resolvedLeagueId]);

  const pageTitle = useMemo(() => `${leagueName} | League Profile | TikiAnaly`, [leagueName]);
  const pageDescription = useMemo(() => `Standings and league details for ${leagueName}.`, [leagueName]);

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      {isShareOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Share link"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setIsShareOpen(false);
              setHasCopiedShareUrl(false);
            }}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0D1117] border border-snow-200 dark:border-snow-100/10 shadow-2xl">
            <div className="flex items-start justify-between gap-4 px-5 pt-5">
              <div className="min-w-0">
                <p className="theme-text font-bold text-base">Share this profile</p>
                <p className="text-neutral-m6 text-sm mt-1">
                  Copy the link below to share this page with friends or on social media.
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg p-2 hover:bg-snow-100 dark:hover:bg-white/5"
                onClick={() => {
                  setIsShareOpen(false);
                  setHasCopiedShareUrl(false);
                }}
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5 theme-text" />
              </button>
            </div>

            <div className="px-5 pb-5 pt-4">
              <div className="flex items-center gap-3 rounded-xl border border-snow-200 dark:border-snow-100/10 bg-snow-100/50 dark:bg-white/5 px-3 py-2">
                <input
                  value={canonicalUrl}
                  readOnly
                  className="w-full bg-transparent text-sm theme-text outline-none"
                />
                <button
                  type="button"
                  onClick={copyShareUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3 py-2 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                  {hasCopiedShareUrl ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <PageHeader />

      <div className="grid">
        {/* Background Layer */}
        <div className="col-start-1 row-start-1 w-full h-full secondary-gradient z-0" style={specialLeagueBg}>
          <div className="h-full w-full bg-cover bg-center relative">
            {isSpecialLeague && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px] z-[1] pointer-events-none" />
            )}
            {!isSpecialLeague && <div className="absolute left-0 top-0 h-full w-2 bg-brand-primary z-[2]" />}
          </div>
        </div>

        {/* Content Layer */}
        <div className="col-start-1 row-start-1 w-full h-auto md:h-80 relative z-20 pointer-events-none">
          <div className={`flex flex-col w-full h-full min-h-[280px] md:min-h-0 page-padding-x pb-16 md:pb-12 ${isSpecialLeague ? "" : "backdrop-blur-3xl"}`}>
            <div className="justify-between flex py-3 md:py-5 pointer-events-auto">
              <div
                onClick={() => navigate(-1)}
                className="relative cursor-pointer px-3 z-10 grid grid-cols-3 items-center"
              >
                <div className="flex gap-4">
                  <ArrowLeftIcon className="text-white h-5" />
                  <p className="text-white hidden md:block">Back</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setIsShareOpen(true);
                    setHasCopiedShareUrl(false);
                  }}
                  aria-label="Share"
                >
                  <ShareIcon className="text-white h-5" />
                </button>
              </div>
            </div>

            <div className="my-auto flex items-center gap-4 md:gap-5 z-[100] pointer-events-auto">
              {resolvedLeagueId ? (
                <div className="bg-white p-4 rounded-3xl shadow-xl shrink-0">
                  <GetLeagueLogo
                    leagueId={resolvedLeagueId}
                    alt={leagueName}
                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                  />
                </div>
              ) : (
                <div className="bg-white p-2 rounded-3xl shadow-xl shrink-0">
                  <img
                    src="/loading-state/shield.svg"
                    alt=""
                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                  />
                </div>
              )}

              <div className="min-w-0 flex flex-col justify-center gap-1.5">
                <p className="font-semibold text-[22px] md:text-3xl text-white whitespace-normal break-words leading-tight">{leagueName}</p>
                <p className="text-snow-100 text-[13px] md:text-sm whitespace-normal break-words font-medium opacity-90">
                  {leagueCategory}{leagueCountry !== "-" ? ` / ${leagueCountry}` : ""}
                </p>
                <div className="mt-1 w-[160px] md:w-[180px] [&>button]:!bg-transparent [&>button]:!border-white/30 [&>button]:!text-white dark:[&>button]:!bg-transparent dark:[&>button]:!border-white/30 dark:[&>button]:!text-white [&>button]:rounded-[24px] [&>button]:backdrop-blur-sm [&>button]:py-1.5 [&>button]:!h-auto [&>button]:text-sm">
                  <DropdownSelector
                    value={season}
                    onChange={setSeason}
                    options={availableSeasons}
                    placeholder="Current Season"
                  />
                </div>
                {isLeagueLoading ? <span className="text-white text-xs mt-1">Loading…</span> : null}
                {leagueErrorMessage ? <span className="text-ui-negative text-xs mt-1">{leagueErrorMessage}</span> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex z-30 h-12 w-full -mt-12 overflow-y-hidden overflow-x-auto bg-brand-p3 dark:bg-gray-800 backdrop-blur-2xl cursor-pointer sticky top-0 hide-scrollbar justify-start md:justify-center rounded-t-xl relative">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0 md:mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => handleTabClick(tab.id, e)}
              className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-orange-500 font-medium"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="page-padding-x">
        {!leagueId && (
          <div className="my-4 block-style p-3 rounded theme-text">
            Open this page with a league id, e.g. <span className="font-semibold">/league/profile/1204</span> or{" "}
            <span className="font-semibold">/league/profile?id=1204</span>.
          </div>
        )}

        {activeTab === "standings" ? (
          <div className="my-8">
            <StandingsTable leagueId={resolvedLeagueId} season={season} />
          </div>
        ) : null}

        {activeTab === "matches" ? (
          <div className="my-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="font-bold text-base theme-text">Matches</p>
              <DropdownSelector
                value={matchesMode}
                onChange={setMatchesMode}
                size="lg"
                className="max-w-[180px]"
                options={[
                  { value: "played", label: "Played" },
                  { value: "upcoming", label: "Upcoming" },
                  { value: "all", label: "All" },
                ]}
              />
            </div>

            {fixturesLoading ? (
              <div className="block-style p-4 rounded theme-text text-sm">Loading matches…</div>
            ) : fixturesError ? (
              <div className="block-style p-4 rounded text-ui-negative text-sm">{fixturesError}</div>
            ) : displayedMatches.length === 0 ? (
              <div className="block-style p-4 rounded theme-text text-sm">
                {matchesMode === "played" ? "No played matches" : matchesMode === "upcoming" ? "No upcoming matches" : "No matches"}
              </div>
            ) : (
              <div className="block-style overflow-hidden">
                <div className="divide-y divide-snow-200/60 dark:divide-snow-100/10" ref={matchesContainerRef}>
                  {displayedMatches.map((m: any, idx: number) => {
                    const fixtureId = m?.fixture_id ?? m?.id;
                    const isUpcoming = upcomingFixtureIdSet.has(String(fixtureId ?? "").trim());
                    const homeName = m?.localteam?.name ?? "Home";
                    const awayName = m?.visitorteam?.name ?? "Away";
                    const homeScore = isUpcoming ? "-" : (m?.localteam?.score ?? "-");
                    const awayScore = isUpcoming ? "-" : (m?.visitorteam?.score ?? "-");
                    const leagueName = m?.league_name ?? "";
                    const dateLabel = (() => {
                      const d = String(m?.date ?? "");
                      if (!d) return "";
                      const dt = new Date(d);
                      return Number.isFinite(dt.getTime())
                        ? dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "";
                    })();

                    const homeRed = getRedCount(m, "localteam");
                    const awayRed = getRedCount(m, "visitorteam");

                    return (
                      <Link
                        key={String(fixtureId ?? idx)}
                        data-upcoming={isUpcoming ? "true" : undefined}
                        to={`/football/gameinfo/${fixtureId}?fixtureId=${encodeURIComponent(String(fixtureId ?? ""))}`}
                        className="block px-2 py-1.5 hover:bg-snow-100 dark:hover:bg-neutral-n2 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-[11px] text-neutral-n5 dark:text-snow-200 truncate leading-tight">
                            {dateLabel}{dateLabel && leagueName ? " • " : ""}{leagueName}
                          </p>

                          <div className="flex flex-col gap-0.5 mt-0.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Image src={m?.homeTeam?.image_url ?? null} alt={homeName} className="w-4 h-4 object-contain shrink-0" fallback="/loading-state/shield.svg" />
                                <span className="text-xs font-medium dark:text-white text-neutral-n4 truncate">{homeName}</span>
                                {homeRed > 0 ? (
                                  <span
                                    className="inline-flex items-center justify-center h-2.5 w-2 bg-red-600 text-white text-[9px] font-bold leading-none"
                                    title="Red cards"
                                  >
                                    {homeRed > 1 ? homeRed : null}
                                  </span>
                                ) : null}
                              </div>
                              <div className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 min-w-[20px] text-center shrink-0">
                                <span className="text-xs font-bold dark:text-white text-neutral-n4">{homeScore}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Image src={m?.awayTeam?.image_url ?? null} alt={awayName} className="w-4 h-4 object-contain shrink-0" fallback="/loading-state/shield.svg" />
                                <span className="text-xs font-medium dark:text-white text-neutral-n4 truncate">{awayName}</span>
                                {awayRed > 0 ? (
                                  <span
                                    className="inline-flex items-center justify-center h-2.5 w-2 bg-red-600 text-white text-[9px] font-bold leading-none"
                                    title="Red cards"
                                  >
                                    {awayRed > 1 ? awayRed : null}
                                  </span>
                                ) : null}
                              </div>
                              <div className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 min-w-[20px] text-center shrink-0">
                                <span className="text-xs font-bold dark:text-white text-neutral-n4">{awayScore}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "top-scorers" ? (
          leadersLoading ? (
            <div className="my-8 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 p-5 theme-text">
              Loading leaders…
            </div>
          ) : leadersError ? (
            <div className="my-8 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 p-5 text-ui-negative">
              {leadersError}
            </div>
          ) : (leaders?.goals?.length ?? 0) === 0 ? (
            <div className="my-8 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 p-5 theme-text">
              No leader data available.
            </div>
          ) : (
            <Leaderboard
              title={`${leagueName} · Highest Goal Scorers`}
              metricLabel="Goals"
              items={leaders?.goals ?? []}
            />
          )
        ) : null}

        {activeTab === "top-assists" ? (
          leadersLoading ? (
            <div className="my-8 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 p-5 theme-text">
              Loading leaders…
            </div>
          ) : leadersError ? (
            <div className="my-8 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 p-5 text-ui-negative">
              {leadersError}
            </div>
          ) : (leaders?.assists?.length ?? 0) === 0 ? (
            <div className="my-8 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 p-5 theme-text">
              No leader data available.
            </div>
          ) : (
            <Leaderboard
              title={`${leagueName} · Highest Assists`}
              metricLabel="Assists"
              items={leaders?.assists ?? []}
            />
          )
        ) : null}

        {activeTab === "top-duels" ? (
          leadersLoading ? (
            <div className="my-8 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 p-5 theme-text">
              Loading leaders…
            </div>
          ) : leadersError ? (
            <div className="my-8 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 p-5 text-ui-negative">
              {leadersError}
            </div>
          ) : (leaders?.duels?.length ?? 0) === 0 ? (
            <div className="my-8 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 p-5 theme-text">
              No leader data available.
            </div>
          ) : (
            <Leaderboard
              title={`${leagueName} · Duel Monsters`}
              metricLabel="Duels"
              items={leaders?.duels ?? []}
            />
          )
        ) : null}
      </div>

      <FooterComp />
    </div>
  );
};

export default LeagueProfile;
