import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import GetTeamLogo from "@/components/common/GetTeamLogo";
import FeedbackPanel from "@/components/common/FeedbackPanel";
import { getPlayerById, getTeamById } from "@/lib/api/endpoints";
import { navigate } from "@/lib/router/navigate";
import {
  ArrowLeftIcon,
  BellAlertIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Helmet } from "react-helmet";

type TeamTransferRow = {
  id?: string;
  name?: string;
  date?: string;
  from?: string;
  to?: string;
  team_id?: string | number;
  type?: string;
  price?: string;
};

type TeamTrophyRow = {
  country?: string;
  league?: string;
  status?: string;
  count?: string | number;
  seasons?: string;
};

type TeamVenue = {
  venue_name?: string;
  venue_id?: number;
  venue_surface?: string;
  venue_address?: string;
  venue_city?: string;
  venue_capacity?: number;
  venue_image?: string;
};

type TeamCoach = {
  name?: string;
  id?: string;
};

type TeamSquadRow = {
  id?: string;
  name?: string;
  number?: string;
  age?: string;
  position?: string;
  injured?: string;
  minutes?: string;
  appearences?: string;
  lineups?: string;
  goals?: string;
  assists?: string;
  yellowcards?: string;
  redcards?: string;
  passes?: string;
  keyPasses?: string;
  rating?: string;
};

type TeamDetailedStatsRow = {
  name?: string;
  season?: string;
  id?: string;
  fulltime?: {
    win?: { total?: string; home?: string; away?: string };
    draw?: { total?: string; home?: string; away?: string };
    lost?: { total?: string; home?: string; away?: string };
    goals_for?: { total?: string; home?: string; away?: string };
    goals_against?: { total?: string; home?: string; away?: string };
    clean_sheet?: { total?: string; home?: string; away?: string };
    shotsTotal?: { total?: string; home?: string; away?: string };
    shotsOnGoal?: { total?: string; home?: string; away?: string };
    corners?: { total?: string; home?: string; away?: string };
    possession?: { total?: string; home?: string; away?: string };
  };
};

type TeamApiItem = {
  team_id?: number;
  name?: string;
  country?: string;
  founded?: number;
  image?: string;
  coach?: TeamCoach;
  venue?: TeamVenue;
  trophies?: TeamTrophyRow[];
  transfers?: {
    in?: TeamTransferRow[];
    out?: TeamTransferRow[];
  };
  squad?: TeamSquadRow[];
  detailed_stats?: TeamDetailedStatsRow[];
  updatedAt?: string;
};

type TeamApiResponse = {
  success?: boolean;
  message?: string;
  responseObject?: {
    item?: TeamApiItem | TeamApiItem[];
  };
  statusCode?: number;
};

type PlayerApiResponse = {
  responseObject?: {
    item?: {
      image?: string;
    };
  };
};

const toNumber = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  const s = String(v).trim();
  if (!s) return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

const parseTransferDate = (value?: string): number => {
  const s = String(value ?? "").trim();
  if (!s) return 0;
  const iso = Date.parse(s);
  if (Number.isFinite(iso)) return iso;

  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (m) {
    const d = Number(m[1]);
    const mo = Number(m[2]);
    const y = Number(m[3]);
    const dt = Date.UTC(y, mo - 1, d);
    return Number.isFinite(dt) ? dt : 0;
  }

  return 0;
};

const parseFeeToNumber = (value?: string): number => {
  const s = String(value ?? "").trim();
  if (!s) return 0;
  const lower = s.toLowerCase();
  if (lower === "-" || lower.includes("loan") || lower.includes("free")) return 0;

  // supports "EUR 577000000" or "€ 50M" or "50m"
  const cleaned = s
    .replace(/eur/gi, "")
    .replace(/usd/gi, "")
    .replace(/gbp/gi, "")
    .replace(/[,]/g, "")
    .replace(/€/g, "")
    .replace(/£/g, "")
    .replace(/\$/g, "")
    .trim();

  const suffix = cleaned.match(/([0-9]*\.?[0-9]+)\s*([mkb])$/i);
  if (suffix) {
    const num = Number(suffix[1]);
    if (!Number.isFinite(num)) return 0;
    const unit = String(suffix[2]).toLowerCase();
    if (unit === "b") return num * 1_000_000_000;
    if (unit === "m") return num * 1_000_000;
    if (unit === "k") return num * 1_000;
    return num;
  }

  const digits = cleaned.replace(/[^0-9.]/g, "").trim();
  const n0 = Number(digits);
  if (!Number.isFinite(n0)) return 0;

  // Heuristic: some data sources provide EUR fees with an extra trailing zero (e.g. "EUR 850000000" intended as 85M).
  // Only apply when the raw string looks like an integer EUR amount without separators.
  const compactDigits = String(value ?? "").replace(/\D/g, "");
  const looksLikeCompactEur = /eur/i.test(s) && compactDigits.length >= 9 && compactDigits.length <= 12;
  if (looksLikeCompactEur && n0 >= 100_000_000 && n0 <= 999_999_999 && n0 % 10 === 0) {
    return n0 / 10;
  }

  return n0;
};

const formatFeeShort = (fee: number): string => {
  if (!fee) return "€ 0";
  const sign = fee < 0 ? "-" : "";
  const abs = Math.abs(fee);
  if (abs >= 1_000_000_000) return `${sign}€ ${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}€ ${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}€ ${(abs / 1_000).toFixed(0)}K`;
  return `${sign}€ ${Math.round(abs)}`;
};

const playerAvatarStorageKey = (id: string) => `player_avatar_base64_${id}`;

const getCachedPlayerAvatar = (playerId?: string): string | null => {
  const id = String(playerId ?? "").trim();
  if (!id) return null;
  try {
    const cached = sessionStorage.getItem(playerAvatarStorageKey(id));
    return cached || null;
  } catch {
    return null;
  }
};

const cachePlayerAvatar = (playerId: string, dataUrl: string) => {
  const id = String(playerId ?? "").trim();
  if (!id || !dataUrl) return;
  try {
    sessionStorage.setItem(playerAvatarStorageKey(id), dataUrl);
  } catch {
    // ignore
  }
};

// const formatRating1dp = (value?: string): string => {
//   const n = toNumber(value);
//   if (!n) return "-";
//   return n.toFixed(1);
// };

const displayTransferFee = (price?: string): string => {
  const fee = parseFeeToNumber(price);
  if (fee > 0) return formatFeeShort(fee);
  const p = String(price ?? "").trim();
  return p || "-";
};

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-snow-200 dark:bg-[#1F2937] rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
);

const TeamProfileSkeleton = ({ tab }: { tab: string }) => {
  const StatCard = () => (
    <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-5 w-12" />
    </div>
  );

  return (
    <div className="my-8 sz-8 flex-col-reverse flex gap-y-7 md:flex-row md:gap-7">
      <div className="flex flex-2 gap-3 flex-col edge-lighting block-style">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="flex flex-col gap-5 flex-5">
        <div className="block-style">
          <Skeleton className="h-5 w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard />
            <StatCard />
            <StatCard />
            <StatCard />
          </div>
        </div>

        {tab === "squad" ? (
          <div className="block-style">
            <Skeleton className="h-5 w-28 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-10 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="block-style">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="block-style">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-40 w-full" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const positionRank = (pos?: string): number => {
  const p = String(pos ?? "").toUpperCase();
  if (p === "G" || p === "GK") return 1;
  if (p === "D" || p === "DEF") return 2;
  if (p === "M" || p === "MID") return 3;
  if (p === "F" || p === "FW" || p === "ST") return 4;
  return 99;
};

const TeamProfile = () => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "squad", label: "Squad" },
    { id: "transfers", label: "Transfers" },
    { id: "trophies", label: "Trophies" },
    { id: "venue", label: "Venue" },
    { id: "stats", label: "Stats" },
  ];

  const getTabFromHash = () => {
    if (typeof window === "undefined") return "overview";
    const hash = window.location.hash.replace("#", "");
    return tabs.find((t) => t.id === hash) ? hash : "overview";
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);

  const { teamId: teamIdParam } = useParams<{ teamId?: string }>();
  const [searchParams] = useSearchParams();
  const teamIdFromQuery = searchParams.get("id") ?? undefined;
  const teamId = teamIdParam ?? teamIdFromQuery;

  const [team, setTeam] = useState<TeamApiItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerImages, setPlayerImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const foundTab = tabs.find((t) => t.id === hash);
      setActiveTab(foundTab ? hash : "overview");
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
        const res = (await getTeamById(id)) as TeamApiResponse;
        const item = res?.responseObject?.item;
        const normalized = Array.isArray(item) ? item[0] : item;
        setTeam(normalized ?? null);
      } catch (e: any) {
        setError(String(e?.message ?? "Failed to load team"));
        setTeam(null);
      } finally {
        setLoading(false);
      }
    };

    if (!teamId) {
      setTeam(null);
      setError(null);
      setLoading(false);
      return;
    }

    run(teamId);
  }, [teamId]);

  const teamName = String(team?.name ?? "Team");

  const canonicalUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}${window.location.search}`
    : "";
  const shareImage = "/logo.webp";
  const shareImageUrl = typeof window !== "undefined" ? `${window.location.origin}${shareImage}` : shareImage;
  const pageTitle = `${teamName} | Team Profile | TikiAnaly`;
  const pageDescription = `Squad, transfers, venue and stats for ${teamName}.`;

  // const teamImageUrl = useMemo(() => {
  //   if (!team?.image) return undefined;
  //   const raw = String(team.image);
  //   if (raw.startsWith("data:image")) return raw;
  //   return `data:image/png;base64,${raw}`;
  // }, [team]);

  const venueImageUrl = useMemo(() => {
    const raw = team?.venue?.venue_image;
    if (!raw) return undefined;
    const s = String(raw);
    if (s.startsWith("data:image")) return s;
    return `data:image/jpeg;base64,${s}`;
  }, [team]);

  const squad = useMemo(() => (Array.isArray(team?.squad) ? team?.squad ?? [] : []), [team]);

  const squadMeta = useMemo(() => {
    const total = squad.length;
    const avgAge = total ? squad.reduce((a, p) => a + toNumber(p.age), 0) / total : 0;
    const injured = squad.filter((p) => String(p.injured ?? "").toLowerCase() === "true").length;
    return {
      total,
      avgAge,
      injured,
      gk: squad.filter((p) => String(p.position) === "G").length,
      def: squad.filter((p) => String(p.position) === "D").length,
      mid: squad.filter((p) => String(p.position) === "M").length,
      fwd: squad.filter((p) => String(p.position) === "F").length,
    };
  }, [squad]);

  const transfersIn = useMemo(() => team?.transfers?.in ?? [], [team]);
  const transfersOut = useMemo(() => team?.transfers?.out ?? [], [team]);

  useEffect(() => {
    const ids = Array.from(
      new Set(
        [...(squad ?? []), ...(transfersIn ?? []), ...(transfersOut ?? [])]
          .map((r: any) => String(r?.id ?? "").trim())
          .filter(Boolean)
      )
    ).slice(0, 60);

    if (ids.length === 0) return;

    const missing = ids.filter((id) => !playerImages[id] && !getCachedPlayerAvatar(id));
    if (missing.length === 0) {
      const cachedToHydrate = ids.filter((id) => !playerImages[id]).map((id) => ({ id, img: getCachedPlayerAvatar(id) }));
      const valid = cachedToHydrate.filter((x) => Boolean(x.img)) as Array<{ id: string; img: string }>;
      if (valid.length > 0) {
        setPlayerImages((prev) => {
          const next = { ...prev };
          valid.forEach((x) => {
            if (!next[x.id]) next[x.id] = x.img;
          });
          return next;
        });
      }
      return;
    }

    let cancelled = false;

    const run = async () => {
      const results = await Promise.all(
        missing.map(async (id) => {
          try {
            const res = (await getPlayerById(id)) as PlayerApiResponse;
            const raw = res?.responseObject?.item?.image;
            if (!raw) return null;
            const s = String(raw);
            const dataUrl = s.startsWith("data:image") ? s : `data:image/png;base64,${s}`;
            cachePlayerAvatar(id, dataUrl);
            return { id, dataUrl };
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;

      const valid = results.filter(Boolean) as Array<{ id: string; dataUrl: string }>;
      if (valid.length === 0) return;

      setPlayerImages((prev) => {
        const next = { ...prev };
        valid.forEach(({ id, dataUrl }) => {
          next[id] = dataUrl;
        });
        return next;
      });
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [squad, transfersIn, transfersOut, playerImages]);

  type TransferChartPoint = {
    label: string;
    ts: number;
    feeIn: number;
    feeOut: number;
  };

  const transferChartData = useMemo<TransferChartPoint[]>(() => {
    const points: Array<{ label: string; ts: number; fee: number; dir: "in" | "out" }> = [];

    transfersIn.forEach((t) => {
      const ts = parseTransferDate(t?.date);
      if (!ts) return;
      points.push({ label: String(t?.date ?? ""), ts, fee: parseFeeToNumber(t?.price), dir: "in" });
    });
    transfersOut.forEach((t) => {
      const ts = parseTransferDate(t?.date);
      if (!ts) return;
      points.push({ label: String(t?.date ?? ""), ts, fee: parseFeeToNumber(t?.price), dir: "out" });
    });

    points.sort((a, b) => a.ts - b.ts);

    // Merge same-date points
    const merged = new Map<number, TransferChartPoint>();
    points.forEach((p) => {
      const prev = merged.get(p.ts) ?? { label: p.label, ts: p.ts, feeIn: 0, feeOut: 0 };
      if (p.dir === "in") prev.feeIn += p.fee;
      else prev.feeOut += p.fee;
      merged.set(p.ts, prev);
    });

    return Array.from(merged.values()).sort((a, b) => a.ts - b.ts);
  }, [transfersIn, transfersOut]);

  const transferTotals = useMemo(() => {
    const totalIn = transfersIn.reduce((a, t) => a + parseFeeToNumber(t?.price), 0);
    const totalOut = transfersOut.reduce((a, t) => a + parseFeeToNumber(t?.price), 0);
    return {
      totalIn,
      totalOut,
      countIn: transfersIn.length,
      countOut: transfersOut.length,
    };
  }, [transfersIn, transfersOut]);

  const inOutCountChartData = useMemo(() => {
    return [
      { name: "Transfers", In: transferTotals.countIn, Out: transferTotals.countOut },
    ];
  }, [transferTotals]);

  const seasonOptions = useMemo(() => {
    const seasons = Array.from(
      new Set((team?.detailed_stats ?? []).map((r) => String(r?.season ?? "")).filter(Boolean))
    );
    seasons.sort((a, b) => b.localeCompare(a));
    return seasons;
  }, [team]);

  const [selectedSeason, setSelectedSeason] = useState<string>("");

  useEffect(() => {
    if (selectedSeason) return;
    if (seasonOptions.length > 0) setSelectedSeason(seasonOptions[0]);
  }, [seasonOptions, selectedSeason]);

  const seasonRows = useMemo(() => {
    if (!selectedSeason) return [];
    return (team?.detailed_stats ?? []).filter((r) => String(r?.season ?? "") === selectedSeason);
  }, [team, selectedSeason]);

  const seasonSummary = useMemo(() => {
    const acc = {
      win: 0,
      draw: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      cs: 0,
      shots: 0,
      shotsOn: 0,
      corners: 0,
      possession: 0,
      possessionCount: 0,
    };

    seasonRows.forEach((r) => {
      const ft = r?.fulltime;
      acc.win += toNumber(ft?.win?.total);
      acc.draw += toNumber(ft?.draw?.total);
      acc.lost += toNumber(ft?.lost?.total);
      acc.gf += toNumber(ft?.goals_for?.total);
      acc.ga += toNumber(ft?.goals_against?.total);
      acc.cs += toNumber(ft?.clean_sheet?.total);
      acc.shots += toNumber(ft?.shotsTotal?.total);
      acc.shotsOn += toNumber(ft?.shotsOnGoal?.total);
      acc.corners += toNumber(ft?.corners?.total);
      const poss = toNumber(ft?.possession?.total);
      if (poss) {
        acc.possession += poss;
        acc.possessionCount += 1;
      }
    });

    const played = acc.win + acc.draw + acc.lost;
    const gd = acc.gf - acc.ga;
    const points = acc.win * 3 + acc.draw;
    const avgPoss = acc.possessionCount ? acc.possession / acc.possessionCount : 0;

    return { ...acc, played, gd, points, avgPoss };
  }, [seasonRows]);

  const venue = team?.venue;

  const hasTeamId = Boolean(teamId);

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
        {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={shareImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={shareImageUrl} />
      </Helmet>
      <PageHeader />

      {/* Header */}
      <div className="bg-brand-secondary relative z-0">
        <div className="overflow-hidden h-auto md:h-80 bg-cover bg-center w-full relative z-0 bg-[#0B0F14]">
          {/* subtle stripe overlay like PageHeader */}
          <div
            className="absolute blur-sm inset-0 pointer-events-none z-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--gameinfo-stripe-color) 0px, var(--gameinfo-stripe-color) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px)",
            }}
          />

          <div className="absolute left-0 top-0 h-full w-2 bg-brand-primary" />

          <div className="w-full bg-black/40 backdrop-blur-2xl h-full min-h-[260px] md:min-h-0 page-padding-x pb-4 md:pb-0 relative z-[1]">
            <div className="justify-between flex py-3 md:py-5">
              <div onClick={() => navigate(-1)} className="relative cursor-pointer px-3 z-10 grid grid-cols-3 items-center">
                <div className="flex gap-4">
                  <ArrowLeftIcon className="text-white h-5" />
                  <p className="text-white hidden md:block">Back</p>
                </div>
              </div>

              <div className="flex z-10 gap-5 items-center">
                <div className="cursor-pointer hover:scale-105 transition-all">
                  <BellAlertIcon className="w-5 text-white" />
                </div>
                <div className="cursor-pointer hover:scale-105 transition-all">
                  <ShareIcon className="w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Header content */}
            <div className="hidden md:flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  {team?.team_id ? (
                    <GetTeamLogo teamId={team.team_id} alt={teamName} className="w-20 h-20 object-contain" />
                  ) : (
                    <img src="/loading-state/shield.svg" alt="" className="w-20 h-20" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <p className="font-extrabold sz-2 gradient-text leading-tight truncate">{teamName}</p>
                    <p className="text-sm text-snow-200 truncate">{team?.country ?? "-"}</p>
                  </div>
                </div>
              </div>

              <div className="flex-col flex items-end justify-between">
                <div className="py-2 px-9 h-fit w-fit align-end rounded bg-neutral-n2 flex gap-3 items-center cursor-pointer hover:bg-neutral-n4 hover:scale-110 transition-all">
                  <p className="text-white ">Follow</p>
                  <StarIcon className="w-5 text-ui-pending" />
                </div>

                <div className="grid grid-cols-4 gap-x-2 gap-y-4 justify-end">
                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Founded</p>
                    <p className="text-white font-bold">{team?.founded ?? "-"}</p>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Coach</p>
                    <p className="text-white font-bold">{team?.coach?.name ?? "-"}</p>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Squad size</p>
                    <p className="text-white font-bold">{squadMeta.total || "-"}</p>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Squad value</p>
                    <p className="text-white font-bold">-</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile header */}
            <div className="md:hidden flex flex-col gap-3 pt-2 pb-4">
              <div className="flex items-center gap-4">
                {team?.team_id ? (
                  <GetTeamLogo teamId={team.team_id} alt={teamName} className="w-14 h-14 flex-shrink-0 object-contain" />
                ) : (
                  <img src="/loading-state/shield.svg" alt="" className="w-14 h-14 flex-shrink-0" />
                )}

                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="font-extrabold text-2xl leading-tight text-white truncate">{teamName}</p>
                  <p className="text-[11px] text-snow-200 truncate">{team?.country ?? "-"}</p>
                </div>

                <div className="px-4 py-1.5 rounded bg-neutral-n1 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-n4 transition-all flex-shrink-0">
                  <StarIcon className="w-4 text-ui-pending" />
                  <span className="text-[9px] text-white font-medium mt-0.5">Follow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
        {loading && !team && !error && <TeamProfileSkeleton tab={activeTab} />}

        {error && (
          <div className="my-4 block-style border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        {!hasTeamId && (
          <div className="my-4 block-style p-3 rounded theme-text">
            Open this page with a team id, e.g. <span className="font-semibold">/team/profile/9287</span> or <span className="font-semibold">/team/profile?id=9287</span>.
          </div>
        )}

        {!loading && (
          <>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
            <FeedbackPanel className="flex flex-2 gap-3 flex-col edge-lighting block-style" />

            <div className="flex flex-col gap-5 flex-5">
              <div className="space-y-8">
                <div className="block-style">
                  <div className="flex items-center text-neutral-n4 dark:text-snow-100 gap-2 mb-2">
                    <InformationCircleIcon className="h-5" />
                    <p className="sz-5 font-bold">Club Overview</p>
                  </div>
                  <p className="theme-text">
                    {teamName}
                    {team?.founded ? ` was founded in ${team.founded}.` : "."} {team?.country ? `Country: ${team.country}.` : ""}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-brand-primary/10 dark:bg-brand-primary/20 border border-brand-primary/20 rounded p-3">
                    <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Squad size</p>
                    <p className="font-bold theme-text">{squadMeta.total || "-"}</p>
                  </div>
                  <div className="bg-ui-success/10 border border-ui-success/20 rounded p-3">
                    <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Avg age</p>
                    <p className="font-bold theme-text">{squadMeta.avgAge ? squadMeta.avgAge.toFixed(1) : "-"}</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
                    <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Transfers in</p>
                    <p className="font-bold theme-text">{transferTotals.countIn}</p>
                  </div>
                  <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                    <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Transfers out</p>
                    <p className="font-bold theme-text">{transferTotals.countOut}</p>
                  </div>
                </div>

                <div className="block-style">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="font-bold text-lg theme-text">Transfer fees (In vs Out)</p>
                    <p className="text-xs text-neutral-n5 dark:text-snow-200">total</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-ui-success/10 border border-ui-success/20 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Spend</p>
                      <p className="font-bold theme-text">{formatFeeShort(transferTotals.totalIn)}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Income</p>
                      <p className="font-bold theme-text">{formatFeeShort(transferTotals.totalOut)}</p>
                    </div>
                    <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Net</p>
                      <p className="font-bold theme-text">{formatFeeShort(transferTotals.totalOut - transferTotals.totalIn)}</p>
                    </div>
                    <div className="bg-brand-primary/10 border border-brand-primary/20 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Trophies</p>
                      <p className="font-bold theme-text">{(team?.trophies ?? []).length || "-"}</p>
                    </div>
                  </div>

                  <div className="w-full h-64">
                    {transferChartData.length === 0 ? (
                      <div className="theme-text">No fee data</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={transferChartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                          <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatFeeShort(Number(v))} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="feeIn" name="Spend" stroke="#10B981" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="feeOut" name="Income" stroke="#FF4500" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="mt-6 w-full h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inOutCountChartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="In" fill="#10B981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Out" fill="#FF4500" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SQUAD */}
        {activeTab === "squad" && (
          <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
            <FeedbackPanel className="flex flex-2 gap-3 flex-col edge-lighting block-style" />

            <div className="flex flex-col gap-5 flex-5">
              <div className="space-y-6">
                <div className="block-style">
                  <p className="font-bold text-lg theme-text mb-3">Squad</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">GK</p>
                      <p className="font-bold theme-text">{squadMeta.gk}</p>
                    </div>
                    <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">DEF</p>
                      <p className="font-bold theme-text">{squadMeta.def}</p>
                    </div>
                    <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">MID</p>
                      <p className="font-bold theme-text">{squadMeta.mid}</p>
                    </div>
                    <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">FWD</p>
                      <p className="font-bold theme-text">{squadMeta.fwd}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Injured</p>
                      <p className="font-bold theme-text">{squadMeta.injured}</p>
                    </div>
                  </div>
                </div>

                <div className="block-style overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-neutral-n5 dark:text-snow-200">
                        <th className="py-2 pr-4 font-medium">#</th>
                        <th className="py-2 pr-4 font-medium">Player</th>
                        <th className="py-2 pr-4 font-medium">Pos</th>
                        <th className="py-2 pr-4 font-medium">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {squad.length === 0 ? (
                        <tr>
                          <td className="py-2 theme-text" colSpan={4}>
                            No squad data
                          </td>
                        </tr>
                      ) : (
                        [...squad]
                          .sort((a, b) => positionRank(String(a?.position ?? "")) - positionRank(String(b?.position ?? "")))
                          .map((p: any, idx: number) => (
                            <tr key={`${String(p?.id ?? "p")}-${idx}`} className="border-t border-snow-200/60 dark:border-snow-100/10">
                              <td className="py-2 pr-4 theme-text">{idx + 1}</td>
                              <td className="py-2 pr-4">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={playerImages[String(p?.id ?? "")] ?? getCachedPlayerAvatar(String(p?.id ?? "")) ?? "/loading-state/player.svg"}
                                    alt={String(p?.name ?? "Player")}
                                    className="w-7 h-7 rounded-full object-cover"
                                  />
                                  <span className="theme-text truncate max-w-[220px]">{p?.name ?? "-"}</span>
                                </div>
                              </td>
                              <td className="py-2 pr-4 theme-text">{p?.position ?? "-"}</td>
                              <td className="py-2 pr-4 theme-text">{p?.age ?? "-"}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRANSFERS */}
        {activeTab === "transfers" && (
          <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
            <FeedbackPanel className="flex flex-2 gap-3 flex-col edge-lighting block-style" />
            <div className="flex flex-col gap-5 flex-5">
              <div className="space-y-8">
                <div className="block-style">
                  <p className="font-bold text-lg theme-text mb-3">Transfers In</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {transfersIn.length === 0 ? (
                      <div className="theme-text">No transfers</div>
                    ) : (
                      [...transfersIn]
                        .sort((a, b) => parseTransferDate(b?.date) - parseTransferDate(a?.date))
                        .map((t, idx) => (
                          <div key={`${t?.id ?? idx}`} className="rounded-lg border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold theme-text truncate">{t?.name ?? "-"}</p>
                                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">
                                  {t?.date ?? "-"}
                                  {t?.type ? ` • ${t.type}` : ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Fee</p>
                                <p className="font-bold theme-text">{displayTransferFee(t?.price)}</p>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                              {t?.team_id ? (
                                <GetTeamLogo teamId={t.team_id} alt={t?.from ?? "From"} className="w-7 h-7 rounded-full object-contain flex-shrink-0" />
                              ) : (
                                <img src="/loading-state/shield.svg" alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                              )}
                              <span className="text-xs theme-text truncate">{t?.from ?? "-"}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div className="block-style">
                  <p className="font-bold text-lg theme-text mb-3">Transfers Out</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {transfersOut.length === 0 ? (
                      <div className="theme-text">No transfers</div>
                    ) : (
                      [...transfersOut]
                        .sort((a, b) => parseTransferDate(b?.date) - parseTransferDate(a?.date))
                        .map((t, idx) => (
                          <div key={`${t?.id ?? idx}`} className="rounded-lg border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold theme-text truncate">{t?.name ?? "-"}</p>
                                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">
                                  {t?.date ?? "-"}
                                  {t?.type ? ` • ${t.type}` : ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Fee</p>
                                <p className="font-bold theme-text">{displayTransferFee(t?.price)}</p>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                              {t?.team_id ? (
                                <GetTeamLogo teamId={t.team_id} alt={t?.to ?? "To"} className="w-7 h-7 rounded-full object-contain flex-shrink-0" />
                              ) : (
                                <img src="/loading-state/shield.svg" alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                              )}
                              <span className="text-xs theme-text truncate">{t?.to ?? "-"}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TROPHIES */}
        {activeTab === "trophies" && (
          <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
            <FeedbackPanel className="flex flex-2 gap-3 flex-col edge-lighting block-style" />
            <div className="flex flex-col gap-5 flex-5">
              <div className="block-style">
                <p className="font-bold text-lg mb-3 theme-text">Trophies</p>
                {(team?.trophies ?? []).length === 0 ? (
                  <div className="theme-text">No trophy data</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...(team?.trophies ?? [])].map((t, idx) => (
                      <div key={`${t?.league ?? "trophy"}-${idx}`} className="rounded-lg border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold theme-text truncate">{t?.league ?? "-"}</p>
                            <p className="text-[10px] text-neutral-n5 dark:text-snow-200">
                              {t?.country ?? "-"}
                              {t?.status ? ` • ${t.status}` : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Count</p>
                            <p className="font-bold theme-text">{t?.count ?? "-"}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Seasons</p>
                          <p className="text-xs theme-text break-words">{t?.seasons ?? "-"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VENUE */}
        {activeTab === "venue" && (
          <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
            <FeedbackPanel className="flex flex-2 gap-3 flex-col edge-lighting block-style" />
            <div className="flex flex-col gap-5 flex-5">
              <div className="block-style">
                <p className="font-bold text-lg theme-text mb-3">Venue</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="theme-text font-semibold">{venue?.venue_name ?? "-"}</p>
                    <p className="text-sm text-neutral-n5 dark:text-snow-200 mt-1">{venue?.venue_city ?? ""}</p>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                        <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Capacity</p>
                        <p className="font-bold theme-text">{venue?.venue_capacity ?? "-"}</p>
                      </div>
                      <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                        <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Surface</p>
                        <p className="font-bold theme-text">{venue?.venue_surface ?? "-"}</p>
                      </div>
                      <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3 col-span-2">
                        <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Address</p>
                        <p className="font-bold theme-text">{venue?.venue_address ?? "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    {venueImageUrl ? (
                      <img src={venueImageUrl} alt={venue?.venue_name ?? "Venue"} className="w-full rounded-lg object-cover" />
                    ) : (
                      <div className="w-full h-64 rounded-lg bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 flex items-center justify-center theme-text">
                        No venue image
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        {activeTab === "stats" && (
          <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
            <FeedbackPanel className="flex flex-2 gap-3 flex-col edge-lighting block-style" />
            <div className="flex flex-col gap-5 flex-5">
              <div className="space-y-6">
                <div className="block-style">
                  <p className="font-bold text-lg theme-text mb-3">Season stats</p>

                  <div className="flex items-center gap-2 mb-4 theme-text">
                    <span className="font-semibold">Season</span>
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(e.target.value)}
                      className="bg-white dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded px-3 py-2 text-sm"
                    >
                      {seasonOptions.length === 0 ? (
                        <option value="">No seasons</option>
                      ) : (
                        seasonOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-ui-success/10 border border-ui-success/20 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Played</p>
                      <p className="font-bold theme-text">{seasonSummary.played || "-"}</p>
                    </div>
                    <div className="bg-brand-primary/10 border border-brand-primary/20 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Points</p>
                      <p className="font-bold theme-text">{seasonSummary.points || "-"}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Goal diff</p>
                      <p className="font-bold theme-text">{seasonSummary.played ? seasonSummary.gd : "-"}</p>
                    </div>
                    <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                      <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Avg poss</p>
                      <p className="font-bold theme-text">{seasonSummary.avgPoss ? `${seasonSummary.avgPoss.toFixed(0)}%` : "-"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-4">
                      <p className="font-semibold theme-text mb-3">Results breakdown</p>
                      <div className="w-full h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: "W", value: seasonSummary.win },
                              { name: "D", value: seasonSummary.draw },
                              { name: "L", value: seasonSummary.lost },
                            ]}
                          >
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#0056d2" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-4">
                      <p className="font-semibold theme-text mb-3">Goals</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">For</p>
                          <p className="font-bold theme-text">{seasonSummary.gf || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Against</p>
                          <p className="font-bold theme-text">{seasonSummary.ga || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Clean sheets</p>
                          <p className="font-bold theme-text">{seasonSummary.cs || "-"}</p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Shots</p>
                          <p className="font-bold theme-text">{seasonSummary.shots || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">On target</p>
                          <p className="font-bold theme-text">{seasonSummary.shotsOn || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Corners</p>
                          <p className="font-bold theme-text">{seasonSummary.corners || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="block-style">
                  <p className="font-bold text-lg theme-text mb-3">Competition rows</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-neutral-n5 dark:text-snow-200">
                          <th className="py-2 pr-4 font-medium">Competition</th>
                          <th className="py-2 pr-4 font-medium">W</th>
                          <th className="py-2 pr-4 font-medium">D</th>
                          <th className="py-2 pr-4 font-medium">L</th>
                          <th className="py-2 pr-4 font-medium">GF</th>
                          <th className="py-2 pr-4 font-medium">GA</th>
                          <th className="py-2 pr-4 font-medium">Poss</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seasonRows.length === 0 ? (
                          <tr>
                            <td className="py-2 theme-text" colSpan={7}>
                              No detailed stats
                            </td>
                          </tr>
                        ) : (
                          seasonRows.map((r, idx) => (
                            <tr key={`${r.id ?? idx}`} className="border-t border-snow-200/60 dark:border-snow-100/10">
                              <td className="py-2 pr-4 theme-text">{r.name ?? "-"}</td>
                              <td className="py-2 pr-4 theme-text">{r.fulltime?.win?.total ?? "-"}</td>
                              <td className="py-2 pr-4 theme-text">{r.fulltime?.draw?.total ?? "-"}</td>
                              <td className="py-2 pr-4 theme-text">{r.fulltime?.lost?.total ?? "-"}</td>
                              <td className="py-2 pr-4 theme-text">{r.fulltime?.goals_for?.total ?? "-"}</td>
                              <td className="py-2 pr-4 theme-text">{r.fulltime?.goals_against?.total ?? "-"}</td>
                              <td className="py-2 pr-4 theme-text">{r.fulltime?.possession?.total ? `${r.fulltime.possession.total}%` : "-"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

          </>
        )}
      </div>

      <FooterComp />
    </div>
  );
};

export default TeamProfile;
