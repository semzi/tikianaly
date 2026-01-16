import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { getPlayerById, getPlayerByName, getPlayersStats } from "@/lib/api/endpoints";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PlayerRadarChart from "@/visualization/PlayerRadarChart";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import { Link } from "react-router-dom";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  expected_goals?: string;
  xg?: string;
};

type PlayerApiItem = {
  player_id?: number;
  id?: number;
  firstname?: string;
  lastname?: string;
  common_name?: string;
  nationality?: string;
  team?: string;
  team_id?: number;
  marketValueEUR?: number;
  position?: string;
  image?: string;
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
  statistics?: {
    clubs?: PlayerSeasonRow[];
    cups?: PlayerSeasonRow[];
    cups_intl?: PlayerSeasonRow[];
    intl?: PlayerSeasonRow[];
  };
};

type PlayerApiResponse = {
  responseObject?: {
    item?: PlayerApiItem | PlayerApiItem[];
  };
};

type PlayerSearchItem = {
  id?: string | number;
  name: string;
  country: string;
  image?: string;
};

type PlayerSlot = {
  playerId?: string;
  player?: PlayerApiItem | null;
  loading: boolean;
  error?: string | null;
  filterSeason?: string;
  filterLeagueId?: string;
  filterLeagueName?: string;
};

const toNumber = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v).trim();
  if (!s || s === "-" || s.toLowerCase() === "null") return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

const normalizeItem = (item: any): PlayerApiItem | null => {
  if (!item) return null;
  if (Array.isArray(item)) return (item[0] as PlayerApiItem) ?? null;
  return item as PlayerApiItem;
};

const playerDisplayName = (p?: PlayerApiItem | null) => {
  if (!p) return "";
  return (
    String(p.common_name ?? "").trim() ||
    [p.firstname, p.lastname].filter(Boolean).join(" ").trim() ||
    "Unknown"
  );
};

const playerImageUrl = (p?: PlayerApiItem | null) => {
  const raw = p?.image;
  if (typeof raw === "string" && raw.length) {
    return raw.startsWith("data:image") ? raw : `data:image/png;base64,${raw}`;
  }
  return "/loading-state/player.svg";
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

const countClubsPlayed = (p?: PlayerApiItem | null): number => {
  if (!p) return 0;
  const ids = new Set<string>();
  if (typeof p.team_id === "number") ids.add(String(p.team_id));
  (p.transfers ?? []).forEach((t) => {
    if (typeof t?.to_id === "number") ids.add(String(t.to_id));
    if (typeof t?.from_id === "number") ids.add(String(t.from_id));
  });
  return ids.size;
};

const countTrophies = (p?: PlayerApiItem | null): number => {
  if (!p) return 0;
  return (p.trophies ?? []).reduce((acc, t) => {
    if (typeof t?.count === "number") return acc + (t.count ?? 0);
    if (Array.isArray(t?.seasons)) return acc + t.seasons.length;
    return acc + 1;
  }, 0);
};

const seasonStartYear = (season?: string): number => {
  const s = String(season ?? "");
  const m = s.match(/(\d{4})/);
  return m ? Number(m[1]) : 0;
};

const uniqSeasonsFromPlayer = (p?: PlayerApiItem | null) => {
  const rows = [
    ...(p?.statistics?.clubs ?? []),
    ...(p?.statistics?.cups ?? []),
    ...(p?.statistics?.cups_intl ?? []),
    ...(p?.statistics?.intl ?? []),
  ];
  const seasons = Array.from(new Set(rows.map((r) => String(r?.season ?? "").trim()).filter(Boolean)));
  seasons.sort((a, b) => seasonStartYear(b) - seasonStartYear(a));
  return seasons;
};

const getFilteredSeasonRows = (p: PlayerApiItem | null, season: string, leagueId?: string) => {
  if (!p || !season) return [] as PlayerSeasonRow[];
  const rows = [
    ...(p.statistics?.clubs ?? []),
    ...(p.statistics?.cups ?? []),
    ...(p.statistics?.cups_intl ?? []),
    ...(p.statistics?.intl ?? []),
  ].filter((r) => String(r?.season ?? "") === season);

  const lid = String(leagueId ?? "").trim();
  if (!lid) return rows;
  return rows.filter((r) => String((r as any)?.league_id ?? "") === lid);
};

const getLeagueOptionsForSeason = (p: PlayerApiItem | null, season: string) => {
  const rows = getFilteredSeasonRows(p, season);
  const map = new Map<string, { leagueId: string; name: string }>();
  rows.forEach((r) => {
    const lid = String((r as any)?.league_id ?? "").trim();
    const name = String((r as any)?.league ?? "").trim();
    if (!lid || !name) return;
    if (!map.has(lid)) map.set(lid, { leagueId: lid, name });
  });
  return Array.from(map.values());
};

const sumSeasonTotals = (p: PlayerApiItem | null, season: string, leagueId?: string) => {
  if (!p || !season) return { goals: 0, assists: 0, xg: 0 };
  const rows = getFilteredSeasonRows(p, season, leagueId);

  let goals = 0;
  let assists = 0;
  let xg = 0;

  rows.forEach((r) => {
    goals += toNumber(r?.goals);
    assists += toNumber(r?.assists);

    const rowXg =
      (r as any)?.expected_goals ??
      (r as any)?.xg ??
      (r as any)?.expectedGoals ??
      (r as any)?.xGoals;
    xg += toNumber(rowXg);
  });

  return { goals, assists, xg };
};

const sumSeasonExtended = (p: PlayerApiItem | null, season: string, leagueId?: string) => {
  if (!p || !season) return { apps: 0, minutes: 0, passes: 0, ratingAvg: 0 };

  const rows = getFilteredSeasonRows(p, season, leagueId);

  let apps = 0;
  let minutes = 0;
  let passes = 0;
  let ratingSum = 0;
  let ratingCount = 0;

  rows.forEach((r) => {
    apps += toNumber(r?.lineups);
    minutes += toNumber(r?.minutes);
    passes += toNumber(r?.passes);
    const rating = toNumber(r?.rating);
    if (rating > 0) {
      ratingSum += rating;
      ratingCount += 1;
    }
  });

  const ratingAvg = ratingCount ? ratingSum / ratingCount : 0;
  return { apps, minutes, passes, ratingAvg };
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const toPct = (v01: number) => Math.round(clamp01(v01) * 100);

const extractXgFromPlayersStatsResponse = (statsRes: any, playerId: string, season: string): number | null => {
  if (!statsRes || !playerId || !season) return null;

  const root = statsRes?.responseObject?.item ?? statsRes?.responseObject ?? statsRes?.item ?? statsRes;
  const items = Array.isArray(root) ? root : root ? [root] : [];

  const matchById = (obj: any) => {
    const pid = obj?.player_id ?? obj?.id ?? obj?.pid ?? obj?.playerId;
    return String(pid ?? "") === String(playerId);
  };

  const cand = items.find(matchById);
  if (!cand) return null;

  const seasonRows =
    cand?.statistics?.clubs ??
    cand?.clubs ??
    cand?.statistics ??
    cand?.seasons ??
    [];

  const rows = Array.isArray(seasonRows) ? seasonRows : [];
  const row = rows.find((r: any) => String(r?.season ?? r?.year ?? "") === String(season));
  if (!row) return null;

  const raw =
    row?.expected_goals ??
    row?.xg ??
    row?.expectedGoals ??
    row?.xGoals ??
    row?.xG;

  const xg = toNumber(raw);
  return xg > 0 ? xg : 0;
};

export default function PlayerComparison() {
  const [slots, setSlots] = useState<PlayerSlot[]>([
    { loading: false, error: null, player: null },
    { loading: false, error: null, player: null },
  ]);

  const [openFilter, setOpenFilter] = useState<{ slotIndex: number; kind: "season" | "league" } | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PlayerSearchItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const searchRequestIdRef = useRef(0);

  const shouldShowSearchPanel = searchValue.trim().length > 0;

  const normalizeItemsToArray = (items: unknown): any[] => {
    if (Array.isArray(items)) return items;
    if (items && typeof items === "object") return [items];
    return [];
  };

  const selectedIds = useMemo(() => slots.map((s) => s.playerId).filter(Boolean) as string[], [slots]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-compare-filter-popover='true']")) return;
      setOpenFilter(null);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    const q = searchValue.trim();
    if (!q) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    if (q.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    const requestId = ++searchRequestIdRef.current;

    const timeoutId = window.setTimeout(() => {
      getPlayerByName(q)
        .then((data) => {
          if (requestId !== searchRequestIdRef.current) return;
          const items = normalizeItemsToArray(data?.responseObject?.item);
          const normalized: PlayerSearchItem[] = items.slice(0, 10).map((p: any) => {
            const rawImage = p?.image;
            const image =
              typeof rawImage === "string" && rawImage.length
                ? rawImage.startsWith("data:image")
                  ? rawImage
                  : `data:image/png;base64,${rawImage}`
                : undefined;
            const name = [p?.firstname, p?.lastname].filter(Boolean).join(" ") || "Unknown";
            return {
              id: p?.id ?? p?.player_id ?? p?.pid,
              name: String(name),
              country: String(p?.nationality ?? ""),
              image,
            };
          });
          setSearchResults(normalized);
          setSearchLoading(false);
        })
        .catch(() => {
          if (requestId !== searchRequestIdRef.current) return;
          setSearchError("Search failed. Please try again.");
          setSearchLoading(false);
        });
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  const loadPlayer = async (slotIndex: number, id: string) => {
    setSlots((prev) =>
      prev.map((s, idx) =>
        idx === slotIndex
          ? { ...s, playerId: id, loading: true, error: null, player: null }
          : s
      )
    );

    try {
      const res = (await getPlayerById(id)) as PlayerApiResponse;
      const item = normalizeItem(res?.responseObject?.item);

      const defaultSeason = uniqSeasonsFromPlayer(item)[0] ?? "";
      const leagues = defaultSeason ? getLeagueOptionsForSeason(item, defaultSeason) : [];
      const defaultLeague = leagues[0];

      setSlots((prev) =>
        prev.map((s, idx) =>
          idx === slotIndex
            ? { ...s, playerId: id, loading: false, error: null, player: item }
            : s
        )
      );

      if (defaultSeason) {
        setSlots((prev) =>
          prev.map((s, idx) =>
            idx === slotIndex
              ? {
                  ...s,
                  filterSeason: defaultSeason,
                  filterLeagueId: defaultLeague?.leagueId,
                  filterLeagueName: defaultLeague?.name,
                }
              : s
          )
        );
      }
    } catch (e: any) {
      setSlots((prev) =>
        prev.map((s, idx) =>
          idx === slotIndex
            ? { ...s, loading: false, error: String(e?.message ?? "Failed to load player"), player: null }
            : s
        )
      );
    }
  };

  const removeSlotPlayer = (slotIndex: number) => {
    setSlots((prev) =>
      prev.map((s, idx) =>
        idx === slotIndex ? { ...s, playerId: undefined, player: null, error: null, loading: false, filterSeason: undefined, filterLeagueId: undefined, filterLeagueName: undefined } : s
      )
    );
  };

  const addThirdSlot = () => {
    setSlots((prev) => {
      if (prev.length >= 3) return prev;
      return [...prev, { loading: false, error: null, player: null }];
    });
  };

  const removeThirdSlot = () => {
    setSlots((prev) => {
      if (prev.length <= 2) return prev;
      return prev.slice(0, 2);
    });
  };

  const [playersStatsApi, setPlayersStatsApi] = useState<any>(null);
  useEffect(() => {
    const ids = selectedIds;
    if (ids.length < 2) {
      setPlayersStatsApi(null);
      return;
    }

    const run = async () => {
      try {
        const res = await getPlayersStats({ playerIds: ids });
        setPlayersStatsApi(res);
      } catch {
        setPlayersStatsApi(null);
      }
    };

    run();
  }, [selectedIds]);

  const seasonTotalsBySlot = useMemo(() => {
    return slots.map((s) => {
      const season = String(s.filterSeason ?? "");
      const leagueId = String(s.filterLeagueId ?? "");
      const base = sumSeasonTotals(s.player ?? null, season, leagueId);

      if (s.playerId && playersStatsApi && season) {
        const fromApi = extractXgFromPlayersStatsResponse(playersStatsApi, s.playerId, season);
        if (fromApi != null) {
          return { ...base, xg: fromApi };
        }
      }

      return base;
    });
  }, [slots, playersStatsApi]);

  const differencesBySlot = useMemo(() => {
    const base = seasonTotalsBySlot[0] ?? { goals: 0, assists: 0, xg: 0 };
    return seasonTotalsBySlot.map((t) => ({
      goals: (t?.goals ?? 0) - (base.goals ?? 0),
      assists: (t?.assists ?? 0) - (base.assists ?? 0),
      xg: (t?.xg ?? 0) - (base.xg ?? 0),
    }));
  }, [seasonTotalsBySlot]);

  const keyAttributesBySlot = useMemo(() => {
    return slots.map((s) => {
      const p = s.player ?? null;
      return {
        marketValueEUR: p?.marketValueEUR,
        clubsPlayed: countClubsPlayed(p),
        trophies: countTrophies(p),
      };
    });
  }, [slots]);

  const radarDataBySlot = useMemo(() => {
    return slots.map((s, idx) => {
      const p = s.player ?? null;
      const season = String(s.filterSeason ?? "");
      const leagueId = String(s.filterLeagueId ?? "");
      if (!p || !season) return null;

      const totals = sumSeasonTotals(p, season, leagueId);
      const ext = sumSeasonExtended(p, season, leagueId);

      const minutes = ext.minutes;
      const passesPer90 = minutes > 0 ? (ext.passes / minutes) * 90 : 0;

      // Heuristic normalization to 0-100 for visualization (not an official rating)
      const passing = toPct(passesPer90 / 80); // 80 passes/90 => 100
      const scoring = toPct((totals.goals + totals.xg) / 30); // ~30 combined => 100
      const creating = toPct(totals.assists / 15); // 15 assists => 100
      const rating = toPct((ext.ratingAvg - 5) / 3.5); // 5.0..8.5 => 0..100
      const minutesScore = toPct(ext.minutes / 3000); // 3000 mins => 100
      const appsScore = toPct(ext.apps / 38); // 38 apps => 100

      return {
        key: `radar-${idx}`,
        data: [
          { skill: "Passing", value: passing },
          { skill: "Scoring", value: scoring },
          { skill: "Creating", value: creating },
          { skill: "Rating", value: rating },
          { skill: "Minutes", value: minutesScore },
          { skill: "Apps", value: appsScore },
        ],
      };
    });
  }, [slots]);

  type TransferFeePoint = { label: string; ts: number; fee: number };
  const transferFeeSeriesBySlot = useMemo(() => {
    return slots.map((s) => {
      const p = s.player ?? null;
      const points: TransferFeePoint[] = (p?.transfers ?? [])
        .map((t) => {
          const ts = parseTransferDate(t?.date);
          const fee = parseFeeToNumber(t?.price);
          const label = String(t?.date ?? "");
          return { label, ts, fee };
        })
        .filter((x) => !!x.ts)
        .sort((a, b) => a.ts - b.ts);
      return points;
    });
  }, [slots]);

  const chartData = useMemo(() => {
    const names = slots.map((s) => playerDisplayName(s.player) || "-");

    const row = (metric: "Goals" | "Assists" | "xG", values: number[]) => {
      const data: any = { metric };
      values.forEach((v, idx) => {
        data[`p${idx}`] = v;
        data[`p${idx}Name`] = names[idx] ?? "-";
      });
      return data;
    };

    return [
      row(
        "Goals",
        seasonTotalsBySlot.map((t) => t.goals)
      ),
      row(
        "Assists",
        seasonTotalsBySlot.map((t) => t.assists)
      ),
      row(
        "xG",
        seasonTotalsBySlot.map((t) => t.xg)
      ),
    ];
  }, [seasonTotalsBySlot, slots]);

  const canCompare = selectedIds.length >= 2;

  return (
    <>
      <PageHeader />
      <main className="m-page-padding-x my-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold theme-text">Player Comparison</h1>
            <p className="text-sm text-neutral-n5">Pick 2 players (optionally 3) and compare their season output.</p>
          </div>
          <Link
            to="/"
            className="text-sm font-semibold text-brand-secondary hover:underline"
          >
            Back
          </Link>
        </div>

        <div className="block-style my-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-lg font-semibold theme-text">Selected players</p>
            <div className="flex items-center gap-2">
              {slots.length < 3 ? (
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg bg-brand-secondary text-white text-sm font-semibold"
                  onClick={addThirdSlot}
                  disabled={slots.length >= 3}
                >
                  Add player
                </button>
              ) : (
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg bg-snow-200/60 dark:bg-white/10 theme-text text-sm font-semibold"
                  onClick={removeThirdSlot}
                >
                  Remove 3rd slot
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {slots.map((slot, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlotIndex(idx)}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  activeSlotIndex === idx
                    ? "border-brand-secondary bg-brand-secondary/10"
                    : "border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={playerImageUrl(slot.player)}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={playerDisplayName(slot.player) || "Player"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/loading-state/player.svg";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold theme-text truncate">
                      {playerDisplayName(slot.player) || `Slot ${idx + 1}`}
                    </p>
                    <p className="text-xs text-neutral-n5 truncate">
                      {slot.player?.position ? String(slot.player.position) : "Select a player"}
                    </p>
                  </div>
                  {slot.playerId ? (
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full bg-snow-200/60 dark:bg-white/10 theme-text flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSlotPlayer(idx);
                      }}
                      aria-label="Remove"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  ) : null}
                </div>

                {slot.loading ? <p className="mt-2 text-xs text-neutral-n5">Loading…</p> : null}
                {slot.error ? <p className="mt-2 text-xs text-ui-negative">{slot.error}</p> : null}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold theme-text">Search player (fills selected slot)</label>
            <div className="mt-2 relative">
              <input
                value={searchValue}
                onChange={(e) => {
                  const next = e.target.value;
                  setSearchValue(next);
                  if (next.trim().length >= 2) {
                    setSearchLoading(true);
                    setSearchError(null);
                  } else {
                    setSearchLoading(false);
                    setSearchError(null);
                  }
                }}
                placeholder="Type player name…"
                className="w-full rounded-lg border border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22] px-4 py-2 outline-none theme-text"
              />

              {shouldShowSearchPanel ? (
                <div className="absolute left-0 right-0 z-50 mt-2">
                  <div className="rounded-xl border border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22] shadow-lg overflow-hidden">
                    {searchValue.trim().length < 2 ? (
                      <div className="p-4">
                        <p className="text-sm text-neutral-n5">Type at least 2 characters…</p>
                      </div>
                    ) : searchError ? (
                      <div className="p-4">
                        <p className="text-sm text-ui-negative">{searchError}</p>
                      </div>
                    ) : searchLoading && searchResults.length === 0 ? (
                      <div className="p-4">
                        <p className="text-sm text-neutral-n5">Searching…</p>
                      </div>
                    ) : searchResults.length ? (
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((r) => (
                          <button
                            key={String(r.id ?? r.name)}
                            type="button"
                            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-snow-100 dark:hover:bg-white/5"
                            onClick={() => {
                              const id = String(r.id ?? "");
                              if (!id) return;
                              loadPlayer(activeSlotIndex, id);
                              setSearchValue("");
                              setSearchResults([]);
                            }}
                          >
                            <img
                              src={r.image || "/loading-state/player.svg"}
                              className="w-10 h-10 rounded-full object-cover"
                              alt={r.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/loading-state/player.svg";
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="theme-text font-semibold truncate">{r.name}</p>
                              <p className="text-xs text-neutral-n5 truncate">{r.country}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4">
                        <p className="text-sm text-neutral-n5">No results</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <p className="mt-2 text-xs text-neutral-n5">
              Tip: pick 2 players first. You can add a 3rd using “Add player”.
            </p>
          </div>
        </div>

        <div className="block-style my-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-lg font-semibold theme-text">Comparison</p>
          </div>

          {!canCompare ? (
            <p className="mt-3 text-sm text-neutral-n5">Select at least 2 players to compare.</p>
          ) : (
            <>
              <div className="mt-6">
                <p className="text-lg font-semibold theme-text">Performance radar</p>
                <p className="text-sm text-neutral-n5">Derived from season stats (passing, scoring, creating, rating, minutes, apps).</p>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {slots.map((s, idx) => (
                    <div
                      key={`radar-wrap-${idx}`}
                      className="rounded-xl border border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-4"
                    >
                      <p className="font-semibold theme-text truncate">{playerDisplayName(s.player) || "-"}</p>
                      {radarDataBySlot[idx]?.data ? (
                        <PlayerRadarChart data={radarDataBySlot[idx]?.data as any} />
                      ) : (
                        <p className="mt-2 text-sm text-neutral-n5">Select a player to see radar.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-lg font-semibold theme-text">Key attributes</p>
                <p className="text-sm text-neutral-n5">Market value, clubs played, trophies.</p>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {slots.map((s, idx) => (
                    <div
                      key={`ka-${idx}`}
                      className="rounded-xl border border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={playerImageUrl(s.player)}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={playerDisplayName(s.player) || "Player"}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/loading-state/player.svg";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold theme-text truncate">{playerDisplayName(s.player) || "-"}</p>
                          <p className="text-xs text-neutral-n5 truncate">{s.player?.team ? String(s.player.team) : ""}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-snow-100/10 px-3 py-2">
                          <p className="text-[11px] text-neutral-n5">Value</p>
                          <p className="font-semibold theme-text tabular-nums">
                            {formatCurrencyEUR(keyAttributesBySlot[idx]?.marketValueEUR)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-snow-100/10 px-3 py-2">
                          <p className="text-[11px] text-neutral-n5">Clubs</p>
                          <p className="font-semibold theme-text tabular-nums">{keyAttributesBySlot[idx]?.clubsPlayed ?? 0}</p>
                        </div>
                        <div className="rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-snow-100/10 px-3 py-2">
                          <p className="text-[11px] text-neutral-n5">Trophies</p>
                          <p className="font-semibold theme-text tabular-nums">{keyAttributesBySlot[idx]?.trophies ?? 0}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {slots.map((s, idx) => (
                  <div
                    key={`tot-${idx}`}
                    className="rounded-xl border border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={playerImageUrl(s.player)}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={playerDisplayName(s.player) || "Player"}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/loading-state/player.svg";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold theme-text truncate">{playerDisplayName(s.player) || "-"}</p>
                        {s.playerId ? (
                          <Link
                            to={`/player/profile/${s.playerId}`}
                            className="text-xs text-brand-secondary hover:underline"
                            onClick={() => window.scrollTo(0, 0)}
                          >
                            View profile
                          </Link>
                        ) : (
                          <p className="text-xs text-neutral-n5">No player</p>
                        )}
                      </div>
                    </div>

                    {s.player ? (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="relative" data-compare-filter-popover="true">
                          <button
                            type="button"
                            className="w-full h-10 rounded-lg border border-snow-200 dark:border-snow-100/10 bg-snow-100 dark:bg-white/5 px-3 flex items-center justify-between gap-2"
                            onClick={() =>
                              setOpenFilter((cur) =>
                                cur && cur.slotIndex === idx && cur.kind === "league" ? null : { slotIndex: idx, kind: "league" }
                              )
                            }
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              {s.filterLeagueId ? (
                                <GetLeagueLogo leagueId={s.filterLeagueId} alt={s.filterLeagueName || "League"} className="h-5 w-5" />
                              ) : (
                                <img src="/loading-state/shield.svg" className="h-5 w-5" alt="League" />
                              )}
                              <span className="text-sm theme-text truncate">{s.filterLeagueName || "Select league"}</span>
                            </span>
                            <ChevronDownIcon className="h-4 w-4 theme-text opacity-70" />
                          </button>

                          {openFilter?.slotIndex === idx && openFilter.kind === "league" ? (
                            <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22] shadow-lg overflow-hidden">
                              {(getLeagueOptionsForSeason(s.player, String(s.filterSeason ?? "")) || []).length ? (
                                <div className="max-h-64 overflow-y-auto">
                                  {getLeagueOptionsForSeason(s.player, String(s.filterSeason ?? "")).map((opt) => (
                                    <button
                                      key={opt.leagueId}
                                      type="button"
                                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-snow-100 dark:hover:bg-white/5"
                                      onClick={() => {
                                        setSlots((prev) =>
                                          prev.map((ss, sidx) =>
                                            sidx === idx ? { ...ss, filterLeagueId: opt.leagueId, filterLeagueName: opt.name } : ss
                                          )
                                        );
                                        setOpenFilter(null);
                                      }}
                                    >
                                      <GetLeagueLogo leagueId={opt.leagueId} alt={opt.name} className="h-5 w-5" />
                                      <span className="text-sm theme-text truncate">{opt.name}</span>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-3 text-sm text-neutral-n5">No leagues available</div>
                              )}
                            </div>
                          ) : null}
                        </div>

                        <div className="relative" data-compare-filter-popover="true">
                          <button
                            type="button"
                            className="w-full h-10 rounded-lg border border-snow-200 dark:border-snow-100/10 bg-snow-100 dark:bg-white/5 px-3 flex items-center justify-between gap-2"
                            onClick={() =>
                              setOpenFilter((cur) =>
                                cur && cur.slotIndex === idx && cur.kind === "season" ? null : { slotIndex: idx, kind: "season" }
                              )
                            }
                          >
                            <span className="text-sm theme-text truncate">{s.filterSeason || "Select season"}</span>
                            <ChevronDownIcon className="h-4 w-4 theme-text opacity-70" />
                          </button>

                          {openFilter?.slotIndex === idx && openFilter.kind === "season" ? (
                            <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22] shadow-lg overflow-hidden">
                              {uniqSeasonsFromPlayer(s.player).length ? (
                                <div className="max-h-64 overflow-y-auto">
                                  {uniqSeasonsFromPlayer(s.player).map((seasonOpt) => (
                                    <button
                                      key={seasonOpt}
                                      type="button"
                                      className="w-full px-3 py-2 text-left hover:bg-snow-100 dark:hover:bg-white/5"
                                      onClick={() => {
                                        const leagues = getLeagueOptionsForSeason(s.player ?? null, seasonOpt);
                                        const first = leagues[0];
                                        setSlots((prev) =>
                                          prev.map((ss, sidx) =>
                                            sidx === idx
                                              ? {
                                                  ...ss,
                                                  filterSeason: seasonOpt,
                                                  filterLeagueId: first?.leagueId,
                                                  filterLeagueName: first?.name,
                                                }
                                              : ss
                                          )
                                        );
                                        setOpenFilter(null);
                                      }}
                                    >
                                      <span className="text-sm theme-text">{seasonOpt}</span>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-3 text-sm text-neutral-n5">No seasons available</div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-snow-100/10 px-3 py-2">
                        <p className="text-[11px] text-neutral-n5">Goals</p>
                        <p className="font-semibold theme-text tabular-nums">{seasonTotalsBySlot[idx]?.goals ?? 0}</p>
                      </div>
                      <div className="rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-snow-100/10 px-3 py-2">
                        <p className="text-[11px] text-neutral-n5">Assists</p>
                        <p className="font-semibold theme-text tabular-nums">{seasonTotalsBySlot[idx]?.assists ?? 0}</p>
                      </div>
                      <div className="rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-snow-100/10 px-3 py-2">
                        <p className="text-[11px] text-neutral-n5">xG</p>
                        <p className="font-semibold theme-text tabular-nums">{(seasonTotalsBySlot[idx]?.xg ?? 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {slots.length >= 2 ? (
                <div className="mt-6">
                  <p className="text-sm font-semibold theme-text mb-3">Differences (vs Player 1)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {slots.map((s, idx) => {
                      const diff = differencesBySlot[idx] ?? { goals: 0, assists: 0, xg: 0 };
                      const name = playerDisplayName(s.player) || `Player ${idx + 1}`;
                      const isBase = idx === 0;
                      const fmt = (v: number, decimals = 0) => {
                        const sign = v > 0 ? "+" : "";
                        return `${sign}${v.toFixed(decimals)}`;
                      };

                      return (
                        <div
                          key={`diff-${idx}`}
                          className="rounded-xl border border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-4"
                        >
                          <p className="font-semibold theme-text truncate">{name}</p>
                          <p className="text-xs text-neutral-n5">{isBase ? "Baseline" : `Compared to ${playerDisplayName(slots[0]?.player) || "Player 1"}`}</p>
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-snow-100/10 px-3 py-2">
                              <p className="text-[11px] text-neutral-n5">Goals</p>
                              <p className="font-semibold theme-text tabular-nums">{isBase ? "0" : fmt(diff.goals)}</p>
                            </div>
                            <div className="rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-snow-100/10 px-3 py-2">
                              <p className="text-[11px] text-neutral-n5">Assists</p>
                              <p className="font-semibold theme-text tabular-nums">{isBase ? "0" : fmt(diff.assists)}</p>
                            </div>
                            <div className="rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-snow-100/10 px-3 py-2">
                              <p className="text-[11px] text-neutral-n5">xG</p>
                              <p className="font-semibold theme-text tabular-nums">{isBase ? "0" : fmt(diff.xg, 2)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="mt-6">
                <p className="text-sm font-semibold theme-text mb-3">Goals / Assists / xG (season totals)</p>
                <div className="w-full h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {slots.map((s, idx) => (
                        <Bar
                          key={`bar-${idx}`}
                          dataKey={`p${idx}`}
                          name={playerDisplayName(s.player) || `Player ${idx + 1}`}
                          fill={idx === 0 ? "#2563eb" : idx === 1 ? "#f97316" : "#22c55e"}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-lg font-semibold theme-text">Transfer fee / price history</p>
                <p className="text-sm text-neutral-n5">Based on player transfer records.</p>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {slots.map((s, idx) => {
                    const series = transferFeeSeriesBySlot[idx] ?? [];
                    const hasData = series.length > 0;

                    return (
                      <div
                        key={`tf-${idx}`}
                        className="rounded-xl border border-snow-200 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-4"
                      >
                        <p className="font-semibold theme-text truncate">{playerDisplayName(s.player) || "-"}</p>
                        {hasData ? (
                          <div className="mt-3 w-full h-56">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={series} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" hide />
                                <YAxis tickFormatter={(v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : String(v))} />
                                <Tooltip
                                  formatter={(v: any) => {
                                    const n = toNumber(v);
                                    return [`€ ${n.toLocaleString()}`, "Fee"];
                                  }}
                                  labelFormatter={(label) => String(label)}
                                />
                                <Line type="monotone" dataKey="fee" stroke={idx === 0 ? "#2563eb" : idx === 1 ? "#f97316" : "#22c55e"} strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-neutral-n5">No transfer fee history available.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <FooterComp />
    </>
  );
}
