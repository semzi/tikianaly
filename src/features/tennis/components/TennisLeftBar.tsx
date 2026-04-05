import React, { useMemo, useState } from "react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getTennisLeagues } from "@/lib/api/tennis";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-snow-200 dark:bg-[#1F2937] rounded ${className}`}
    style={{ minHeight: "1em" }}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
  </div>
);

type LeagueItem = {
  id: string;
  name: string;
  category: string;
};

const normalizeLeagueItems = (items: any[]): LeagueItem[] => {
  return items
    .map((league: any) => ({
      id: String(
        league?.league_id ??
          league?.id ??
          league?.tournament_id ??
          league?.name ??
          "",
      ),
      name: String(
        league?.name ?? league?.league_name ?? league?.tournament_name ?? "",
      ),
      category: String(
        league?.category ??
          league?.continent_name ??
          league?.country_name ??
          league?.tour ??
          "General",
      ),
    }))
    .filter((league: LeagueItem) => league.id && league.name);
};

const uniqueLeagues = (items: LeagueItem[]) => {
  const seen = new Set<string>();
  return items.filter((league) => {
    const key = `${league.id}::${league.name.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

type TennisLeftBarProps = {
  selectedLeagueName?: string | null;
  onSelectLeagueName?: (name: string | null) => void;
};

const LeagueList: React.FC<{
  allLeagues: LeagueItem[];
  loading?: boolean;
  searchQuery?: string;
  selectedLeagueName: string | null;
  onSelectLeagueName?: (name: string | null) => void;
}> = ({
  allLeagues,
  loading,
  searchQuery,
  selectedLeagueName,
  onSelectLeagueName,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    const filtered = q
      ? allLeagues.filter((l) => l.name.toLowerCase().includes(q))
      : allLeagues;

    const map = new Map<string, LeagueItem[]>();
    for (const league of filtered) {
      const key = (league.category || "General").trim() || "General";
      const prev = map.get(key) || [];
      prev.push(league);
      map.set(key, prev);
    }

    const entries = Array.from(map.entries()).map(([category, leagues]) => ({
      category,
      leagues: [...leagues].sort((a, b) => a.name.localeCompare(b.name)),
    }));

    return entries.sort((a, b) => a.category.localeCompare(b.category));
  }, [allLeagues, searchQuery]);

  if (loading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <li key={idx} className="flex mt-4 items-center gap-2 mb-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-24 h-4 flex-1" />
            <Skeleton className="w-4 h-4" />
          </li>
        ))}
      </>
    );
  }

  return (
    <>
      <li
        className={`flex mt-4 items-center gap-2 text-sm mb-2 cursor-pointer transition-colors ${
          selectedLeagueName === null
            ? "text-brand-secondary font-bold"
            : "dark:text-snow-200 text-[#586069]"
        }`}
        onClick={() => onSelectLeagueName?.(null)}
      >
        All Leagues
      </li>

      {grouped.map(({ category, leagues }) => (
        <div key={category} className="flex flex-col">
          <li
            className="flex mt-4 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-2 cursor-pointer"
            onClick={() =>
              setExpandedCategory((prev) =>
                prev === category ? null : category,
              )
            }
          >
            <span className="flex-1 font-medium">{category}</span>
            <ChevronUpDownIcon
              className={`ml-auto w-6 transition-transform ${
                expandedCategory === category ? "rotate-180" : ""
              }`}
            />
          </li>

          {expandedCategory === category && (
            <div className="flex flex-col pl-4">
              {leagues.map((league) => (
                <li
                  key={league.id}
                  className={`flex mt-3 items-center gap-2 text-sm mb-1 cursor-pointer transition-colors ${
                    selectedLeagueName === league.name
                      ? "text-brand-primary font-bold"
                      : "dark:text-snow-200 text-[#586069]"
                  }`}
                  onClick={() => onSelectLeagueName?.(league.name)}
                >
                  <span className="w-2 h-2 rounded-full bg-neutral-n4" />
                  <span className="flex-1">{league.name}</span>
                </li>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export const TennisLeftBar: React.FC<TennisLeftBarProps> = ({
  selectedLeagueName = null,
  onSelectLeagueName,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadDemoLeaguesPayload = async () => {
    const response = await fetch("/data/tennis-demo-leagues.json");
    if (!response.ok) {
      throw new Error("Failed to load demo tennis leagues");
    }
    return response.json();
  };

  const { data, isLoading: loading } = useQuery({
    queryKey: ["tennis", "leagues", "all"],
    queryFn: async () => {
      let payload: any = {};

      try {
        const res = await getTennisLeagues();
        payload = res?.responseObject ?? res ?? {};
      } catch {
        payload = await loadDemoLeaguesPayload();
      }

      const hasBackendLeagueArrays =
        Array.isArray(payload?.items) ||
        Array.isArray(payload?.tournaments) ||
        Array.isArray(payload?.leagues) ||
        Array.isArray(payload?.popular_leagues) ||
        Array.isArray(payload?.popularLeagues) ||
        Array.isArray(payload?.popular) ||
        Array.isArray(payload?.small_leagues) ||
        Array.isArray(payload?.smallLeagues) ||
        Array.isArray(payload?.dropped_leagues) ||
        Array.isArray(payload?.other_leagues);

      if (!hasBackendLeagueArrays) {
        payload = await loadDemoLeaguesPayload();
      }

      const mainLeaguesRaw =
        payload?.items ?? payload?.tournaments ?? payload?.leagues ?? [];
      const smallLeaguesRaw =
        payload?.small_leagues ??
        payload?.smallLeagues ??
        payload?.dropped_leagues ??
        payload?.other_leagues ??
        [];
      const popularLeaguesRaw =
        payload?.popular_leagues ??
        payload?.popularLeagues ??
        payload?.popular ??
        [];

      const allLeagues = uniqueLeagues([
        ...normalizeLeagueItems(mainLeaguesRaw),
        ...normalizeLeagueItems(smallLeaguesRaw),
      ]);

      const popularLeagues = uniqueLeagues(
        normalizeLeagueItems(popularLeaguesRaw),
      );

      return {
        allLeagues,
        popularLeagues,
      };
    },
    staleTime: 7 * 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const leagues = data?.allLeagues ?? [];
  const backendPopularLeagues = data?.popularLeagues ?? [];
  const popularLeagues =
    backendPopularLeagues.length > 0
      ? backendPopularLeagues
      : leagues.slice(0, 8);

  return (
    <div className="flex flex-col gap-y-10">
      <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200 rounded p-5 shadow-sm">
        <p className="font-[500] text-[#23272A] dark:text-white mb-2">
          Popular Leagues
        </p>
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <li key={idx} className="flex mt-5 items-center gap-2 mb-4">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-24 h-4" />
              </li>
            ))
          : popularLeagues.map((league) => (
              <li
                key={league.id}
                className={`flex mt-5 items-center gap-2 text-sm mb-4 cursor-pointer transition-colors hover:text-brand-primary ${
                  selectedLeagueName === league.name
                    ? "text-brand-primary font-bold"
                    : "dark:text-snow-200 text-[#586069]"
                }`}
                onClick={() => onSelectLeagueName?.(league.name)}
              >
                <span className="w-2 h-2 rounded-full bg-neutral-n4" />
                <span>{league.name}</span>
              </li>
            ))}
      </ul>

      <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200 rounded p-5 shadow-sm">
        <div className="flex items-center my-auto">
          <p className="font-[500] dark:text-white text-[#23272A]">
            All Leagues
          </p>
          <button
            type="button"
            className="ml-auto"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search leagues"
          >
            <MagnifyingGlassIcon className="w-5 h-5 theme-text hover:text-brand-primary transition-colors" />
          </button>
        </div>

        {searchOpen ? (
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-3 w-full rounded border border-snow-200 bg-white px-3 py-2 text-sm text-[#23272A] outline-none focus:border-brand-primary dark:border-[#1F2937] dark:bg-[#0D1117] dark:text-snow-200"
            placeholder="Search leagues..."
          />
        ) : null}

        <LeagueList
          allLeagues={leagues}
          loading={loading}
          searchQuery={searchQuery}
          selectedLeagueName={selectedLeagueName}
          onSelectLeagueName={onSelectLeagueName}
        />
      </ul>
    </div>
  );
};
