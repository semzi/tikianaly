import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import PlayerRadarChart from "@/visualization/PlayerRadarChart";
import MonthlyRatingChart from "@/visualization/MonthlyRatingChart";
import PlayerMatchesWidget from "@/features/football/components/player/PlayerMatchesWidget";
import HeatMap from "@/features/football/components/player/HeatMap";
import FeedbackPanel from "@/components/common/FeedbackPanel";
import {
  ArrowLeftIcon,
  BellAlertIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  CheckBadgeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState, type MouseEvent } from "react";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPlayerById } from "@/lib/api/endpoints";
import GetTeamLogo from "@/components/common/GetTeamLogo";
import { Helmet } from "react-helmet";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-snow-200 dark:bg-[#1F2937] rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
);

 const PlayerProfileSkeleton = ({ tab }: { tab: string }) => {
   return (
     <>
       <div className="my-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
         <div className="flex items-center gap-2">
           <Skeleton className="h-4 w-16" />
           <Skeleton className="h-10 w-36" />
         </div>
         <div className="flex gap-2 flex-wrap">
           <div className="bg-brand-primary/10 dark:bg-brand-primary/20 border border-brand-primary/20 rounded px-3 py-2">
             <Skeleton className="h-3 w-16 mb-2" />
             <Skeleton className="h-5 w-14" />
           </div>
           <div className="bg-ui-success/10 border border-ui-success/20 rounded px-3 py-2">
             <Skeleton className="h-3 w-12 mb-2" />
             <Skeleton className="h-5 w-10" />
           </div>
           <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded px-3 py-2">
             <Skeleton className="h-3 w-14 mb-2" />
             <Skeleton className="h-5 w-12" />
           </div>
           <div className="bg-orange-500/10 border border-orange-500/20 rounded px-3 py-2">
             <Skeleton className="h-3 w-10 mb-2" />
             <Skeleton className="h-5 w-10" />
           </div>
         </div>
       </div>

       <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
         <div className="flex flex-2 gap-3 flex-col edge-lighting block-style">
           <Skeleton className="h-4 w-28" />
           <Skeleton className="h-20 w-full" />
           <Skeleton className="h-20 w-full" />
         </div>

         <div className="flex flex-col gap-5 flex-5">
           {tab === "matches" ? (
             <div className="block-style">
               <Skeleton className="h-5 w-40 mb-4" />
               <div className="space-y-3">
                 {Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <Skeleton className="h-10 w-10 rounded-full" />
                     <div className="flex-1">
                       <Skeleton className="h-4 w-48 mb-2" />
                       <Skeleton className="h-3 w-32" />
                     </div>
                     <Skeleton className="h-6 w-16" />
                   </div>
                 ))}
               </div>
             </div>
           ) : (
             <>
               <div className="block-style space-y-3">
                 <Skeleton className="h-5 w-48" />
                 <Skeleton className="h-14 w-full" />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                   <Skeleton className="h-3 w-20 mb-2" />
                   <Skeleton className="h-5 w-12" />
                 </div>
                 <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                   <Skeleton className="h-3 w-20 mb-2" />
                   <Skeleton className="h-5 w-12" />
                 </div>
                 <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                   <Skeleton className="h-3 w-20 mb-2" />
                   <Skeleton className="h-5 w-12" />
                 </div>
                 <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                   <Skeleton className="h-3 w-20 mb-2" />
                   <Skeleton className="h-5 w-12" />
                 </div>
               </div>

               <div className="block-style">
                 <Skeleton className="h-5 w-44 mb-4" />
                 <Skeleton className="h-64 w-full" />
               </div>
             </>
           )}
         </div>
       </div>

       <div className="h-8" />
     </>
   );
 };

const playerProfile = () => {
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "matches", label: "Matches" },
    { id: "career", label: "Career" },
  ];
  
  // Get initial tab from URL hash (fallback to "profile")
  const getTabFromHash = () => {
    if (typeof window === "undefined") return "profile";
    const hash = window.location.hash.replace("#", "");
    return tabs.find((tab) => tab.id === hash) ? hash : "profile";
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);

  const { playerId: playerIdParam } = useParams<{ playerId?: string }>();
  const [searchParams] = useSearchParams();
  const playerIdFromQuery = searchParams.get("id") ?? undefined;
  const playerId = playerIdParam ?? playerIdFromQuery;

  type PlayerSeasonRow = {
    league?: string;
    league_id?: string;
    season?: string;
    lineups?: string;
    minutes?: string;
    goals?: string;
    assists?: string;
    yellowcards?: string;
    redcards?: string;
    passes?: string;
    rating?: string;
  };

  type PlayerApiItem = {
    player_id?: number;
    firstname?: string;
    lastname?: string;
    common_name?: string;
    nationality?: string;
    birthdate?: string;
    age?: number;
    height?: number;
    weight?: number;
    team?: string;
    team_id?: number;
    marketValueEUR?: number;
    preferredFoot?: string;
    position?: string;
    image?: string;
    sidelined?: any[];
    transfers?: Array<{
      date?: string;
      from?: string;
      from_id?: number;
      to?: string;
      to_id?: number;
      type?: string;
      price?: string;
    }>;
    trophies?: Array<{
      country?: string;
      league?: string;
      status?: string;
      count?: number;
      seasons?: string[];
    }>;
    overall_clubs?: {
      lineups?: number;
      substitute_in?: number;
      goalsConceded?: number;
      assists?: number;
      saves?: number | null;
      insideBoxSaves?: number | null;
      passes?: number;
      minutesPlayed?: number;
      rating?: number;
    };
    statistics?: {
      clubs?: PlayerSeasonRow[];
      cups?: PlayerSeasonRow[];
      cups_intl?: PlayerSeasonRow[];
      intl?: PlayerSeasonRow[];
    };
  };

  type PlayerApiResponse = {
    success?: boolean;
    message?: string;
    responseObject?: {
      item?: PlayerApiItem;
    };
    statusCode?: number;
  };

  const [player, setPlayer] = useState<PlayerApiItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);

  useEffect(() => {
    const run = async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = (await getPlayerById(id)) as PlayerApiResponse;
        const item = res?.responseObject?.item ?? null;
        setPlayer(item);
      } catch (e: any) {
        setError(String(e?.message ?? "Failed to load player"));
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    if (!playerId) {
      setPlayer(null);
      setError(null);
      setLoading(false);
      return;
    }

    run(playerId);
  }, [playerId]);

  const toNumber = (v: unknown): number => {
    if (v === null || v === undefined) return 0;
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    const s = String(v).trim();
    if (!s || s === "-" || s.toLowerCase() === "null") return 0;
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  const formatCurrencyEUR = (value?: number): string => {
    if (!value || !Number.isFinite(value)) return "-";
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `€ ${(value / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `€ ${(value / 1_000).toFixed(1)}K`;
    return `€ ${value}`;
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
    if (!s || s === "-" || s.toLowerCase() === "loan" || s.toLowerCase() === "free") return 0;

    const cleaned = s
      .replace(/[,]/g, "")
      .replace(/€/g, "")
      .replace(/£/g, "")
      .replace(/\$/g, "")
      .trim();

    const m = cleaned.match(/([0-9]*\.?[0-9]+)\s*([mkb])?/i);
    if (!m) {
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    }
    const num = Number(m[1]);
    if (!Number.isFinite(num)) return 0;
    const unit = String(m[2] ?? "").toLowerCase();
    if (unit === "b") return num * 1_000_000_000;
    if (unit === "m") return num * 1_000_000;
    if (unit === "k") return num * 1_000;
    return num;
  };

  const teamLogoStorageKey = (id: string) => `team_logo_base64_${id}`;
  const getCachedTeamLogo = (teamId?: number): string | null => {
    const id = String(teamId ?? "").trim();
    if (!id) return null;
    try {
      const cached = sessionStorage.getItem(teamLogoStorageKey(id));
      return cached || null;
    } catch {
      return null;
    }
  };

  const seasonStartYear = (season?: string): number => {
    const s = String(season ?? "");
    const m = s.match(/(\d{4})/);
    return m ? Number(m[1]) : 0;
  };

  const getTeamForSeason = (season: string): { teamId?: number; name?: string } => {
    const startYear = seasonStartYear(season);
    if (!startYear) return { teamId: player?.team_id, name: player?.team };

    const seasonStart = Date.UTC(startYear, 6, 1); // Jul 1
    const seasonEnd = Date.UTC(startYear + 1, 5, 30, 23, 59, 59); // Jun 30

    const transfers = [...(player?.transfers ?? [])]
      .map((t) => ({
        ...t,
        ts: parseTransferDate(t?.date),
      }))
      .filter((t) => !!t.ts)
      .sort((a, b) => a.ts - b.ts);

    // Prefer a transfer that happened within the season (player moved to a club that season)
    const within = transfers.filter((t) => t.ts >= seasonStart && t.ts <= seasonEnd);
    if (within.length > 0) {
      const last = within[within.length - 1];
      return { teamId: last?.to_id, name: last?.to };
    }

    // Otherwise: take the last transfer before season start (team entering season)
    const before = transfers.filter((t) => t.ts < seasonStart);
    if (before.length > 0) {
      const last = before[before.length - 1];
      return { teamId: last?.to_id, name: last?.to };
    }

    return { teamId: player?.team_id, name: player?.team };
  };

  type TransferChartPoint = {
    label: string;
    ts: number;
    fee: number;
    toId?: number;
    toName?: string;
    fromId?: number;
    fromName?: string;
    priceText?: string;
  };

  const transferChartData = useMemo<TransferChartPoint[]>(() => {
    const transfers = [...(player?.transfers ?? [])]
      .map((t) => {
        const ts = parseTransferDate(t?.date);
        const fee = parseFeeToNumber(t?.price);
        const label = t?.date ? String(t.date) : "";
        return {
          label,
          ts,
          fee,
          toId: t?.to_id,
          toName: t?.to,
          fromId: t?.from_id,
          fromName: t?.from,
          priceText: t?.price,
        };
      })
      .filter((p) => !!p.ts)
      .sort((a, b) => a.ts - b.ts);

    return transfers;
  }, [player]);

  const uniqueTransferTeamIds = useMemo(() => {
    const ids = new Set<number>();
    transferChartData.forEach((p) => {
      if (typeof p.toId === "number") ids.add(p.toId);
      if (typeof p.fromId === "number") ids.add(p.fromId);
    });
    return Array.from(ids);
  }, [transferChartData]);

  const transferFeeDomain = useMemo(() => {
    const max = Math.max(0, ...transferChartData.map((p) => p.fee || 0));
    if (!max) return [0, 1] as const;
    return [0, max * 1.15] as const;
  }, [transferChartData]);

  const formatFeeShort = (fee: number): string => {
    if (!fee) return "0";
    if (fee >= 1_000_000_000) return `${(fee / 1_000_000_000).toFixed(1)}B`;
    if (fee >= 1_000_000) return `${(fee / 1_000_000).toFixed(1)}M`;
    if (fee >= 1_000) return `${(fee / 1_000).toFixed(0)}K`;
    return String(Math.round(fee));
  };

  const TransferDot = (props: any) => {
    const { cx, cy, payload } = props;
    const logo = getCachedTeamLogo(payload?.toId);
    const size = 18;
    if (!cx || !cy) return null;

    return (
      <g>
        <circle cx={cx} cy={cy} r={10} fill="rgba(255,69,0,0.15)" stroke="#FF4500" strokeWidth={2} />
        <image
          href={logo || "/loading-state/shield.svg"}
          x={cx - size / 2}
          y={cy - size / 2}
          width={size}
          height={size}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    );
  };

  const allSeasonRows = useMemo(() => {
    const rows = [
      ...(player?.statistics?.clubs ?? []),
      ...(player?.statistics?.cups ?? []),
      ...(player?.statistics?.cups_intl ?? []),
      ...(player?.statistics?.intl ?? []),
    ];
    return rows.filter((r) => Boolean(r?.season));
  }, [player]);

  const categoryTotals = useMemo(() => {
    const mkTotals = () => ({ apps: 0, minutes: 0, goals: 0, assists: 0, passes: 0, ratingSum: 0, ratingCount: 0 });

    const buckets = {
      clubs: mkTotals(),
      cups: mkTotals(),
      cups_intl: mkTotals(),
      intl: mkTotals(),
    };

    const add = (target: typeof buckets.clubs, row: PlayerSeasonRow) => {
      target.apps += toNumber(row.lineups);
      target.minutes += toNumber(row.minutes);
      target.goals += toNumber(row.goals);
      target.assists += toNumber(row.assists);
      target.passes += toNumber(row.passes);
      const r = toNumber(row.rating);
      if (r > 0) {
        target.ratingSum += r;
        target.ratingCount += 1;
      }
    };

    const season = selectedSeason;
    if (!season) return buckets;

    (player?.statistics?.clubs ?? []).filter((r) => String(r.season) === season).forEach((r) => add(buckets.clubs, r));
    (player?.statistics?.cups ?? []).filter((r) => String(r.season) === season).forEach((r) => add(buckets.cups, r));
    (player?.statistics?.cups_intl ?? []).filter((r) => String(r.season) === season).forEach((r) => add(buckets.cups_intl, r));
    (player?.statistics?.intl ?? []).filter((r) => String(r.season) === season).forEach((r) => add(buckets.intl, r));

    return buckets;
  }, [player, selectedSeason]);

  const seasonOptions = useMemo(() => {
    const seasons = Array.from(new Set(allSeasonRows.map((r) => String(r.season))));
    const numericKey = (s: string) => {
      const match = s.match(/(\d{4})/);
      return match ? Number(match[1]) : 0;
    };
    seasons.sort((a, b) => numericKey(b) - numericKey(a));
    return seasons;
  }, [allSeasonRows]);

  useEffect(() => {
    if (selectedSeason) return;
    if (seasonOptions.length > 0) setSelectedSeason(seasonOptions[0]);
  }, [seasonOptions, selectedSeason]);

  const seasonRows = useMemo(() => {
    if (!selectedSeason) return [];
    return allSeasonRows.filter((r) => String(r.season) === selectedSeason);
  }, [allSeasonRows, selectedSeason]);

  const seasonTotals = useMemo(() => {
    const totals = {
      lineups: 0,
      minutes: 0,
      goals: 0,
      assists: 0,
      yellow: 0,
      red: 0,
      passes: 0,
      ratingSum: 0,
      ratingCount: 0,
      leagues: new Set<string>(),
    };

    for (const r of seasonRows) {
      totals.lineups += toNumber(r.lineups);
      totals.minutes += toNumber(r.minutes);
      totals.goals += toNumber(r.goals);
      totals.assists += toNumber(r.assists);
      totals.yellow += toNumber(r.yellowcards);
      totals.red += toNumber(r.redcards);
      totals.passes += toNumber(r.passes);
      const rating = toNumber(r.rating);
      if (rating > 0) {
        totals.ratingSum += rating;
        totals.ratingCount += 1;
      }
      if (r.league) totals.leagues.add(r.league);
    }

    const avgRating = totals.ratingCount ? totals.ratingSum / totals.ratingCount : 0;
    const minsPer90 = totals.minutes > 0 ? (totals.lineups > 0 ? totals.minutes / totals.lineups : totals.minutes / 1) : 0;
    const goalsPer90 = totals.minutes > 0 ? (totals.goals / totals.minutes) * 90 : 0;
    const assistsPer90 = totals.minutes > 0 ? (totals.assists / totals.minutes) * 90 : 0;
    const gPlusA90 = totals.minutes > 0 ? ((totals.goals + totals.assists) / totals.minutes) * 90 : 0;
    const passPer90 = totals.minutes > 0 ? (totals.passes / totals.minutes) * 90 : 0;
    const cardsPer90 = totals.minutes > 0 ? ((totals.yellow + totals.red) / totals.minutes) * 90 : 0;

    return {
      ...totals,
      leagues: Array.from(totals.leagues),
      avgRating,
      minsPerMatch: minsPer90,
      goalsPer90,
      assistsPer90,
      gPlusA90,
      passPer90,
      cardsPer90,
    };
  }, [seasonRows]);

  const playerDisplayName = useMemo(() => {
    if (player?.common_name) return player.common_name;
    const first = player?.firstname ?? "";
    const last = player?.lastname ?? "";
    const full = `${first} ${last}`.trim();
    return full || "Player";
  }, [player]);

  const canonicalUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}${window.location.search}`
    : "";
  const shareImage = "/logo.webp";
  const shareImageUrl = typeof window !== "undefined" ? `${window.location.origin}${shareImage}` : shareImage;
  const pageTitle = `${playerDisplayName} | Player Profile | TikiAnaly`;
  const pageDescription = `Stats, matches and career details for ${playerDisplayName}.`;

  const playerImageUrl = useMemo(() => {
    if (!player?.image) return undefined;
    const raw = String(player.image);
    if (raw.startsWith("data:image")) return raw;
    return `data:image/png;base64,${raw}`;
  }, [player]);

  const radarData = useMemo(() => {
    const clamp = (n: number) => Math.max(0, Math.min(100, n));

    const goals90 = seasonTotals.goalsPer90;
    const assists90 = seasonTotals.assistsPer90;
    const passes90 = seasonTotals.passPer90;
    const avgRating = seasonTotals.avgRating;
    const minsPerMatch = seasonTotals.minsPerMatch;
    const discipline = seasonTotals.cardsPer90;

    return [
      { skill: "Impact", value: clamp((goals90 + assists90) * 35) },
      { skill: "Scoring", value: clamp(goals90 * 60) },
      { skill: "Creating", value: clamp(assists90 * 80) },
      { skill: "Passing", value: clamp(passes90 / 1.2) },
      { skill: "Fitness", value: clamp((minsPerMatch / 90) * 100) },
      { skill: "Discipline", value: clamp(100 - discipline * 120) },
      { skill: "Rating", value: clamp((avgRating / 10) * 100) },
    ];
  }, [seasonTotals]);

  // Update tab when hash changes (e.g., browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const foundTab = tabs.find((tab) => tab.id === hash);
      setActiveTab(foundTab ? hash : "profile");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [tabs]);

  // Update URL hash when tab changes (without navigation)
  const handleTabClick = (tabId: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(tabId);
    // Update hash without triggering navigation, preserving current pathname
    const newUrl = `${window.location.pathname}${window.location.search}#${tabId}`;
    window.history.replaceState(null, "", newUrl);
  };

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
      <div className="secondary-gradient relative z-0">
        <div
          className="overflow-hidden h-auto md:h-80 bg-cover bg-center w-full relative z-0"
          style={{
            backgroundImage: "url('/logos.whitelogo.png')",
          }}
        >
          {/* Stripe accent (keep original background) */}
          <div className="absolute left-0 top-0 h-full w-2 bg-brand-primary" />
          <div className="w-full backdrop-blur-3xl h-full min-h-[280px] md:min-h-0 page-padding-x pb-4 md:pb-0 relative z-0">
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
                <BellAlertIcon className="text-white h-5" />
                <ShareIcon className="text-white h-5" />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex justify-between">
              {/* ---------------------------- */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-4">
                  <div
                    className="overflow-hidden h-40 bg-cover bg-center w-40 rounded-2xl bg-brand-p1"
                    style={{
                      backgroundImage: playerImageUrl ? `url('${playerImageUrl}')` : "url('./loading-state/player.svg')",
                    }}
                  ></div>
                  <div className="self-end flex items-center gap-2">
                    {player?.team_id ? (
                      <GetTeamLogo teamId={player.team_id} alt={player?.team ?? "Team"} className="w-12 h-12 rounded-full object-contain" />
                    ) : (
                      <img src="/loading-state/shield.svg" alt="" className="w-12 h-12" />
                    )}
                    <span className="block gap-2 items-center">
                      <p className="text-white font-semibold">
                        {player?.team ?? "-"}
                      </p>
                      <p className="sz-8 text-snow-200">
                        {selectedSeason ? `Season ${selectedSeason}` : ""}
                      </p>
                    </span>
                  </div>
                </div>
                <p className="font-extrabold sz-2 flex gap-3 items-center text-white">
                  {playerDisplayName}
                  <CheckBadgeIcon className="w-7 text-ui-pending " />
                </p>
              </div>

              {/* ----------------------------- */}

              <div className="flex-col flex items-end justify-between">
                <div className="py-2 animate-bounce px-9 h-fit w-fit align-end rounded bg-neutral-n2 flex gap-3 items-center cursor-pointer hover:bg-neutral-n4 hover:scale-110 transition-all">
                  <p className="text-white ">Follow</p>
                  <StarIcon className="w-5 text-ui-pending" />
                </div>

                <div className="grid grid-cols-4 gap-x-2 gap-y-4 justify-end">
                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Nationality</p>
                      <p className="text-white font-bold">{player?.nationality ?? "-"}</p>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Born {player?.birthdate ?? "-"}</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">{player?.age ? `${player.age} Yrs` : "-"}</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Primary Foot</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">{player?.preferredFoot ?? "-"}</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Shirt Number</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">-</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Position</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">{player?.position ?? "-"}</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Clubs Played</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">{(player?.statistics?.clubs ?? []).length || "-"}</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Height</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">{player?.height ? `${player.height} cm` : "-"}</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Market Value</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">{formatCurrencyEUR(player?.marketValueEUR)}</p>
                    </span>
                  </div>
                </div>
              </div>
              {/* ------------------------------ */}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col gap-3 pt-2 pb-4">
              {/* Player Image and Name Section - Vertically Centered */}
              <div className="flex items-center gap-4">
                {/* Small Image on Left */}
                <div
                  className="overflow-hidden h-20 bg-cover bg-center w-20 rounded-xl bg-brand-p1 flex-shrink-0"
                  style={{
                    backgroundImage: playerImageUrl ? `url('${playerImageUrl}')` : "url('./players/dembele.png')",
                  }}
                ></div>
                {/* Name in Middle */}
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="font-extrabold text-2xl leading-tight text-white">
                    {player?.firstname ?? playerDisplayName.split(" ")[0] ?? "Player"}
                  </p>
                  <p className="font-extrabold text-2xl leading-tight text-white flex items-center gap-1">
                    {player?.lastname ?? playerDisplayName.split(" ").slice(1).join(" ") ?? ""}
                    <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                  </p>
                </div>
                {/* Follow Icon Button on Right */}
                <div className="px-4 py-1.5 rounded bg-neutral-n1 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-n4 transition-all flex-shrink-0">
                  <StarIcon className="w-4 text-ui-pending" />
                  <span className="text-[9px] text-white font-medium mt-0.5">17.5k</span>
                </div>
              </div>

              {/* Club below - Left Aligned */}
              <div className="flex mt-2 items-center gap-2 pl-0">
                {player?.team_id ? (
                  <GetTeamLogo teamId={player.team_id} alt={player?.team ?? "Team"} className="w-8 h-8 flex-shrink-0" />
                ) : (
                  <img src="/loading-state/shield.svg" alt="" className="w-8 h-8 flex-shrink-0" />
                )}
                <div className="flex flex-col">
                  <p className="text-white font-semibold text-xs">
                    {player?.team ?? "-"}
                  </p>
                  <p className="text-[10px] text-snow-200">
                    {selectedSeason ? `Season ${selectedSeason}` : ""}
                  </p>
                </div>
              </div>

              {/* Key Stats - Mobile Horizontal Scroll */}
              <div className="relative -mx-4 px-4">
                <div className="overflow-x-auto hide-scrollbar">
                  <div className="flex gap-2 min-w-max">
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Position</p>
                      <p className="text-white font-bold text-xs">{player?.position ?? "-"}</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Age</p>
                      <p className="text-white font-bold text-xs">{player?.age ? `${player.age} Yrs` : "-"}</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Number</p>
                      <p className="text-white font-bold text-xs">11</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Nationality</p>
                      <div className="flex items-center gap-1">
                        <img
                          src="/assets/icons/United Kingdom.png"
                          alt=""
                          className="w-3 h-3"
                        />
                        <p className="text-white font-bold text-xs">{player?.nationality ?? "-"}</p>
                      </div>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Primary Foot</p>
                      <p className="text-white font-bold text-xs">{player?.preferredFoot ?? "-"}</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Clubs Played</p>
                      <p className="text-white font-bold text-xs">{(player?.statistics?.clubs ?? []).length || "-"}</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Height</p>
                      <p className="text-white font-bold text-xs">{player?.height ? `${player.height} cm` : "-"}</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Market Value</p>
                      <p className="text-white font-bold text-xs">{formatCurrencyEUR(player?.marketValueEUR)}</p>
                    </div>
                  </div>
                </div>
                {/* Scroll Hint Overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none flex items-center justify-end pr-2"
                  style={{
                    background: 'linear-gradient(to left, rgba(0, 0, 0, 0.4) 0%, transparent 100%)'
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-white text-[10px] font-medium">Scroll</span>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- navigation content--------------- */}
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
      {/* ----------------- navigation content end --------------- */}

      <div className="page-padding-x">
        {loading && !player && !error && <PlayerProfileSkeleton tab={activeTab} />}

        {error && (
          <div className="my-4 block-style border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        {!playerId && (
          <div className="my-4 block-style p-3 rounded theme-text">
            Open this page with a player id, e.g. <span className="font-semibold">/player/profile/323402</span> or <span className="font-semibold">/player/profile?id=323402</span>.
          </div>
        )}

        {!loading && playerId && (
          <div className="my-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="relative">
              <div className="flex items-center gap-2 theme-text">
                <span className="font-semibold">Season</span>
                <button
                  type="button"
                  onClick={() => setIsSeasonOpen((v) => !v)}
                  className="bg-white dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded px-3 py-2 text-sm flex items-center gap-2"
                >
                  {(() => {
                    const { teamId, name } = selectedSeason ? getTeamForSeason(selectedSeason) : {};
                    return (
                      <>
                        {teamId ? (
                          <GetTeamLogo teamId={teamId} alt={name ?? "Team"} className="w-5 h-5 rounded-full" />
                        ) : (
                          <img src="/loading-state/shield.svg" alt="" className="w-5 h-5" />
                        )}
                        <span>{selectedSeason || "Select"}</span>
                        <span className="text-neutral-n5 dark:text-snow-200">▾</span>
                      </>
                    );
                  })()}
                </button>
              </div>

              {isSeasonOpen && (
                <div
                  className="absolute mt-2 z-50 w-[260px] max-h-[320px] overflow-auto rounded-lg border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] shadow-lg"
                  onMouseLeave={() => setIsSeasonOpen(false)}
                >
                  {seasonOptions.length === 0 ? (
                    <div className="p-3 text-sm theme-text">No seasons</div>
                  ) : (
                    seasonOptions.map((s) => {
                      const { teamId, name } = getTeamForSeason(s);
                      const active = s === selectedSeason;
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => {
                            setSelectedSeason(s);
                            setIsSeasonOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-snow-100 dark:hover:bg-[#1F2937] ${active ? "bg-snow-100 dark:bg-[#1F2937]" : ""}`}
                        >
                          {teamId ? (
                            <GetTeamLogo teamId={teamId} alt={name ?? "Team"} className="w-7 h-7 rounded-full object-contain" />
                          ) : (
                            <img src="/loading-state/shield.svg" alt="" className="w-7 h-7" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold theme-text">{s}</p>
                            <p className="text-[10px] text-neutral-n5 dark:text-snow-200 truncate">{name ?? "-"}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="bg-brand-primary/10 dark:bg-brand-primary/20 border border-brand-primary/20 rounded px-3 py-2">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Avg Rating</p>
                <p className="font-bold theme-text">{seasonTotals.avgRating ? seasonTotals.avgRating.toFixed(2) : "-"}</p>
              </div>
              <div className="bg-ui-success/10 border border-ui-success/20 rounded px-3 py-2">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Apps</p>
                <p className="font-bold theme-text">{seasonTotals.lineups || "-"}</p>
              </div>
              <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded px-3 py-2">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Minutes</p>
                <p className="font-bold theme-text">{seasonTotals.minutes || "-"}</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded px-3 py-2">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">G+A</p>
                <p className="font-bold theme-text">{seasonTotals.goals + seasonTotals.assists || "-"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Banter Section - Common for all tabs */}
        <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
          <FeedbackPanel className="flex flex-2 gap-3 flex-col edge-lighting block-style" />

          {/* Content Section - Different for each tab */}
          <div className="flex flex-col gap-5 flex-5 ">
            {/* ---------------Matches Tab---------------- */}
            {activeTab === 'matches' && (
              <PlayerMatchesWidget />
            )}

            {/* ---------------profile---------------- */}
            {activeTab === 'profile' && (
              <>
              <div className="block-style block space-y-2">
                <div className="flex items-center text-neutral-n4 dark:text-snow-100 gap-2">
                  <InformationCircleIcon className="h-5" />
                  <p className="sz-5 font-bold">Sport Biography</p>
                </div>
                <p className="theme-text">
                  {playerDisplayName} {player?.age ? `is ${player.age} years old` : ""}{player?.birthdate ? ` (born ${player.birthdate})` : ""}{player?.height ? `, ${player.height} cm tall` : ""}
                  {player?.team ? (
                    <>
                      {" "}and plays for <span className="cursor-pointer hover:underline transition-all text-brand-primary italic">{player.team}.</span>
                    </>
                  ) : null}{" "}
                  {player?.preferredFoot ? `Preferred foot: ${player.preferredFoot}.` : ""}{" "}
                  {selectedSeason ? `This view is filtered to ${selectedSeason}.` : ""}
                </p>
              </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Goals / 90</p>
                <p className="font-bold theme-text">{seasonTotals.goalsPer90 ? seasonTotals.goalsPer90.toFixed(2) : "-"}</p>
              </div>
              <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Assists / 90</p>
                <p className="font-bold theme-text">{seasonTotals.assistsPer90 ? seasonTotals.assistsPer90.toFixed(2) : "-"}</p>
              </div>
              <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">G+A / 90</p>
                <p className="font-bold theme-text">{seasonTotals.gPlusA90 ? seasonTotals.gPlusA90.toFixed(2) : "-"}</p>
              </div>
              <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Passes / 90</p>
                <p className="font-bold theme-text">{seasonTotals.passPer90 ? seasonTotals.passPer90.toFixed(0) : "-"}</p>
              </div>
            </div>

            <div className="block-style">
              <p className="font-bold text-lg mb-3 theme-text">Career totals</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                  <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Apps</p>
                  <p className="font-bold theme-text">{player?.overall_clubs?.lineups ?? "-"}</p>
                </div>
                <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                  <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Minutes</p>
                  <p className="font-bold theme-text">{player?.overall_clubs?.minutesPlayed ?? "-"}</p>
                </div>
                <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                  <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Assists</p>
                  <p className="font-bold theme-text">{player?.overall_clubs?.assists ?? "-"}</p>
                </div>
                <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                  <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Avg rating</p>
                  <p className="font-bold theme-text">{player?.overall_clubs?.rating ? Number(player.overall_clubs.rating).toFixed(2) : "-"}</p>
                </div>
              </div>
            </div>

            <div className="block-style">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-bold text-lg theme-text">Season split</p>
                <p className="text-xs text-neutral-n5 dark:text-snow-200">{selectedSeason || ""}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {([
                  { key: "clubs", label: "League (clubs)" },
                  { key: "cups", label: "Domestic cups" },
                  { key: "cups_intl", label: "International cups" },
                  { key: "intl", label: "National team" },
                ] as const).map(({ key, label }) => {
                  const t = categoryTotals[key];
                  const avg = t.ratingCount ? t.ratingSum / t.ratingCount : 0;
                  return (
                    <div key={key} className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold theme-text truncate">{label}</p>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Apps {t.apps} • Min {t.minutes}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Avg</p>
                          <p className="font-bold theme-text">{avg ? avg.toFixed(2) : "-"}</p>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">G</p>
                          <p className="font-semibold theme-text">{t.goals || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">A</p>
                          <p className="font-semibold theme-text">{t.assists || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Pass</p>
                          <p className="font-semibold theme-text">{t.passes || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">G+A</p>
                          <p className="font-semibold theme-text">{t.goals + t.assists || "-"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Minutes / match</p>
                <p className="font-bold theme-text">{seasonTotals.minsPerMatch ? seasonTotals.minsPerMatch.toFixed(0) : "-"}</p>
              </div>
              <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Cards / 90</p>
                <p className="font-bold theme-text">{seasonTotals.cardsPer90 ? seasonTotals.cardsPer90.toFixed(2) : "-"}</p>
              </div>
              <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Competitions</p>
                <p className="font-bold theme-text">{seasonTotals.leagues.length ? seasonTotals.leagues.length : "-"}</p>
              </div>
              <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
                <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Passes total</p>
                <p className="font-bold theme-text">{seasonTotals.passes || "-"}</p>
              </div>
            </div>

            <MonthlyRatingChart />
            <div className="block-style">
              <p className="font-bold text-lg mb-3 theme-text">{player?.lastname ?? playerDisplayName} Attributes</p>
              <PlayerRadarChart data={radarData} />
              
            </div>

            <div className="block-style">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-bold text-lg theme-text">Season breakdown</p>
                <p className="text-xs text-neutral-n5 dark:text-snow-200">
                  {selectedSeason ? selectedSeason : ""}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-n5 dark:text-snow-200">
                      <th className="py-2 pr-4 font-medium">League</th>
                      <th className="py-2 pr-4 font-medium">Apps</th>
                      <th className="py-2 pr-4 font-medium">Min</th>
                      <th className="py-2 pr-4 font-medium">G</th>
                      <th className="py-2 pr-4 font-medium">A</th>
                      <th className="py-2 pr-4 font-medium">Pass</th>
                      <th className="py-2 pr-4 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(seasonRows ?? []).length === 0 ? (
                      <tr>
                        <td className="py-2 theme-text" colSpan={7}>
                          No season rows
                        </td>
                      </tr>
                    ) : (
                      [...seasonRows]
                        .sort((a, b) => String(a.league ?? "").localeCompare(String(b.league ?? "")))
                        .map((r, idx) => (
                          <tr key={`${r.league ?? "row"}-${idx}`} className="border-t border-snow-200/60 dark:border-snow-100/10">
                            <td className="py-2 pr-4 theme-text whitespace-nowrap">{r.league ?? "-"}</td>
                            <td className="py-2 pr-4 theme-text">{toNumber(r.lineups) || "-"}</td>
                            <td className="py-2 pr-4 theme-text">{toNumber(r.minutes) || "-"}</td>
                            <td className="py-2 pr-4 theme-text">{toNumber(r.goals) || "-"}</td>
                            <td className="py-2 pr-4 theme-text">{toNumber(r.assists) || "-"}</td>
                            <td className="py-2 pr-4 theme-text">{toNumber(r.passes) || "-"}</td>
                            <td className="py-2 pr-4 theme-text">{toNumber(r.rating) ? toNumber(r.rating).toFixed(2) : "-"}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
              {/* Prefetch logos so transfer chart can render them on dots */}
              <div className="hidden">
                {uniqueTransferTeamIds.map((id) => (
                  <GetTeamLogo key={id} teamId={id} alt="Team" className="w-1 h-1" />
                ))}
              </div>

              <div className="block-style">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="font-bold text-lg theme-text">Transfer fees history</p>
                  <p className="text-xs text-neutral-n5 dark:text-snow-200">(fees parsed from transfer price)</p>
                </div>
                <div className="w-full h-64">
                  {transferChartData.length === 0 ? (
                    <div className="theme-text">No transfer fee data</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={transferChartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                        <YAxis domain={transferFeeDomain as any} tickFormatter={(v) => formatFeeShort(Number(v))} tick={{ fontSize: 10 }} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload || payload.length === 0) return null;
                            const p: any = payload[0]?.payload;
                            const logo = getCachedTeamLogo(p?.toId);
                            return (
                              <div className="rounded-lg border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-3 shadow-lg">
                                <div className="flex items-center gap-2">
                                  <img src={logo || "/loading-state/shield.svg"} alt="" className="w-7 h-7 rounded-full" />
                                  <div>
                                    <p className="text-sm font-semibold theme-text">{p?.toName ?? "-"}</p>
                                    <p className="text-[10px] text-neutral-n5 dark:text-snow-200">{p?.label ?? ""}</p>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-xs text-neutral-n5 dark:text-snow-200">Fee</span>
                                  <span className="text-sm font-bold theme-text">{p?.priceText ?? formatFeeShort(Number(p?.fee ?? 0))}</span>
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Line type="monotone" dataKey="fee" stroke="#FF4500" strokeWidth={2} dot={<TransferDot />} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="block-style">
                <p className="font-bold text-lg mb-3 theme-text">Transfer History</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(player?.transfers ?? []).length === 0 ? (
                    <div className="theme-text">No transfer data</div>
                  ) : (
                    [...(player?.transfers ?? [])]
                      .sort((a, b) => parseTransferDate(b?.date) - parseTransferDate(a?.date))
                      .map((t, idx) => (
                        <div
                          key={`${t?.date ?? idx}-${t?.from_id ?? "x"}-${t?.to_id ?? "y"}`}
                          className="rounded-lg border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold theme-text">
                                {t?.from ?? "-"}
                                <span className="mx-2 text-neutral-n5 dark:text-snow-200">→</span>
                                {t?.to ?? "-"}
                              </p>
                              <p className="text-[10px] text-neutral-n5 dark:text-snow-200">
                                {t?.date ?? "-"}
                                {t?.type ? ` • ${t.type}` : ""}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Fee</p>
                              <p className="font-bold theme-text">{t?.price ? t.price : "-"}</p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              {t?.from_id ? (
                                <GetTeamLogo teamId={t.from_id} alt={t?.from ?? "From"} className="w-7 h-7 rounded-full object-contain" />
                              ) : (
                                <img src="/loading-state/shield.svg" alt="" className="w-7 h-7" />
                              )}
                              <span className="text-xs theme-text truncate">{t?.from ?? "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0 justify-end">
                              <span className="text-xs theme-text truncate text-right">{t?.to ?? "-"}</span>
                              {t?.to_id ? (
                                <GetTeamLogo teamId={t.to_id} alt={t?.to ?? "To"} className="w-7 h-7 rounded-full object-contain" />
                              ) : (
                                <img src="/loading-state/shield.svg" alt="" className="w-7 h-7" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <HeatMap />

            <div className="block-style">
              <p className="font-bold text-lg mb-3 theme-text">Trophies</p>
              {(player?.trophies ?? []).length === 0 ? (
                <div className="theme-text">No trophy data</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...(player?.trophies ?? [])].map((t, idx) => (
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
                        <p className="text-xs theme-text break-words">
                          {Array.isArray(t?.seasons) && t.seasons.length ? t.seasons.join(" ") : "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="block-style flex bg-ui-success/10 rounded px-3 py-4 flex-col gap-2">
              <p className="font-bold text-lg text-ui-success">Strength</p>
              <ul className="grid grid-cols-2 font-medium theme-text list-inside">
                <li>Anchor Play</li>
                <li>Finishing</li>
                <li>Set-Pieces</li>
                <li>Long Shots</li>
                <li>Crossing</li>
                <li>Long Balls</li>
                <li>Tackling</li>
                <li>Heading</li>
                <li>Tackling</li>
                </ul>
            </div>
            <div className="block-style flex bg-ui-negative/10 rounded px-3 py-4 flex-col gap-2">
              <p className="font-bold text-lg text-ui-negative">Weakness</p>
              <ul className="grid grid-cols-2 font-medium theme-text list-inside">
                <li>Defensive Work</li>
                <li>Aerial Duels</li>
                <li>Physical Strength</li>
                <li>Consistency</li>
                <li>Injury Prone</li>
                <li>Decision Making</li>
                <li>Defensive Positioning</li>
                <li>Stamina</li>
                <li>Leadership</li>
                </ul>
            </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterComp />
    </div>
  );
};

export default playerProfile;
