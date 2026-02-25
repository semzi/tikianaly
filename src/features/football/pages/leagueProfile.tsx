import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import GetPlayerImage from "@/components/common/GetPlayerImage";
import GetTeamLogo from "@/components/common/GetTeamLogo";
import {
  getFootballLeagueLeaders,
  getLeagueById,
  getPlayerById,
  type FootballLeagueLeadersResponse,
} from "@/lib/api/endpoints";
import { navigate } from "@/lib/router/navigate";
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import StandingsTable from "@/features/football/components/standings/StandingsTable";
import { Helmet } from "react-helmet";
import { useToast } from "@/context/ToastContext";

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
};

type LeagueLeadersState = {
  season?: string;
  goals: LeaderboardPlayer[];
  assists: LeaderboardPlayer[];
  duels: LeaderboardPlayer[];
};

type PlayerTeamInfo = { teamId?: number; teamName?: string };
const playerTeamInfoCache = new Map<string, PlayerTeamInfo>();

const PlayerTeamLine = ({ playerId }: { playerId: number }) => {
  const [info, setInfo] = useState<PlayerTeamInfo | null>(null);

  useEffect(() => {
    const id = String(playerId);
    const cached = playerTeamInfoCache.get(id);
    if (cached) {
      setInfo(cached);
      return;
    }

    let cancelled = false;
    const run = async () => {
      try {
        const res: any = await getPlayerById(id);
        const item = res?.responseObject?.item;
        const player = Array.isArray(item) ? item[0] : item;
        const teamId = typeof player?.team_id === "number" ? player.team_id : undefined;
        const teamName = String(player?.team ?? "").trim() || undefined;
        const next: PlayerTeamInfo = { teamId, teamName };
        playerTeamInfoCache.set(id, next);
        if (!cancelled) setInfo(next);
      } catch {
        const next: PlayerTeamInfo = {};
        playerTeamInfoCache.set(id, next);
        if (!cancelled) setInfo(next);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [playerId]);

  const teamName = info?.teamName ?? "-";
  return (
    <span className="flex items-center gap-2 min-w-0">
      {info?.teamId ? (
        <GetTeamLogo teamId={info.teamId} alt={teamName} className="w-4 h-4 rounded-full object-contain" />
      ) : (
        <img src="/loading-state/shield.svg" alt="" className="w-4 h-4" />
      )}
      <span className="truncate">{teamName}</span>
    </span>
  );
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
                  <GetPlayerImage
                    playerId={p.playerId}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover"
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
                    <PlayerTeamLine playerId={p.playerId} />
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

  const [league, setLeague] = useState<LeagueApiItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const run = async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = (await getLeagueById(id)) as LeagueApiResponse;
        const item = res?.responseObject?.item;
        const resolved = Array.isArray(item) ? item[0] : item;
        setLeague(resolved ?? null);
      } catch (e: any) {
        setError(String(e?.message ?? "Failed to load league"));
        setLeague(null);
      } finally {
        setLoading(false);
      }
    };

    const id = String(leagueId ?? "").trim();
    if (!id) {
      setLeague(null);
      setError(null);
      setLoading(false);
      return;
    }

    run(id);
  }, [leagueId]);

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
        const res = await getFootballLeagueLeaders(id);
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
  }, [resolvedLeagueId]);

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

      <div className="secondary-gradient relative z-0">
        <div className="overflow-hidden h-auto md:h-80 bg-cover bg-center w-full relative z-0">
          <div className="absolute left-0 top-0 h-full w-2 bg-brand-primary" />
          <div className="w-full backdrop-blur-3xl h-full min-h-[220px] md:min-h-0 page-padding-x pb-4 md:pb-0 relative z-0">
            <div className="justify-between flex py-3 md:py-5">
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

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2">
              <div className="flex items-center gap-4">
                {resolvedLeagueId ? (
                  <div className="bg-white p-4   rounded-2xl">
                    <GetLeagueLogo
                      leagueId={resolvedLeagueId}
                      alt={leagueName}
                      className="w-20 h-20 md:w-28 md:h-28"
                    />
                  </div>
                ) : (
                  <div className="bg-white p-2 rounded-2xl">
                    <img
                      src="/loading-state/shield.svg"
                      alt=""
                      className="w-20 h-20 md:w-28 md:h-28"
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-extrabold text-2xl md:text-3xl text-white whitespace-normal break-words">{leagueName}</p>
                  <p className="text-snow-200 text-sm md:text-base whitespace-normal break-words">
                    {leagueCategory}{leagueCountry !== "-" ? ` / ${leagueCountry}` : ""}
                  </p>
                </div>
              </div>

              <div className="text-white text-sm">
                {loading ? "Loading…" : null}
                {error ? <span className="text-ui-negative">{error}</span> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex z-3 h-12 w-full overflow-y-hidden overflow-x-auto bg-brand-p3/30 dark:bg-snow-200 backdrop-blur-2xl cursor-pointer sticky top-0 hide-scrollbar justify-start md:justify-center">
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
            <StandingsTable leagueId={resolvedLeagueId} />
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
