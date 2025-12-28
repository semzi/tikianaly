import React, { useMemo, useState, useEffect, useRef } from "react";
import { ChevronUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getAllLeagues } from "@/lib/api/endpoints";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";

// Pulsating skeleton loader component
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-snow-200 rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
);

interface LeagueItem {
  name: string;
  icon: string;
  id: number;
  category?: string;
}

interface LeagueListProps {
  allLeagues: LeagueItem[];
  loading?: boolean;
  searchQuery?: string;
}

const LeagueList: React.FC<LeagueListProps> = ({
  allLeagues,
  loading,
  searchQuery,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getLeagueLogoId = (league: LeagueItem): string | null => {
    const anyLeague = league as unknown as { leagueId?: unknown; id?: unknown };
    const raw = anyLeague.leagueId ?? anyLeague.id;
    if (raw === null || raw === undefined) return null;
    return String(raw);
  };

  const toggleExpand = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const grouped = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    const filtered = q
      ? allLeagues.filter((l) => (l.name ?? "").toLowerCase().includes(q))
      : allLeagues;

    const map = new Map<string, LeagueItem[]>();
    for (const league of filtered) {
      const key = (league.category || "Other").trim() || "Other";
      const prev = map.get(key) || [];
      prev.push(league);
      map.set(key, prev);
    }

    const entries = Array.from(map.entries()).map(([category, leagues]) => {
      leagues.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      return { category, leagues };
    });

    entries.sort((a, b) => a.category.localeCompare(b.category));
    return entries;
  }, [allLeagues, searchQuery]);

  if (loading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <li key={idx} className="flex mt-4 items-center gap-2 mb-2">
            <Skeleton className="w-6 h-6" />
            <Skeleton className="w-24 h-4 flex-1" />
            <Skeleton className="w-4 h-4" />
          </li>
        ))}
      </>
    );
  }

  return (
    <>
      {grouped.map(({ category, leagues }) => (
        <div key={category} className="flex flex-col">
          <li
            className="flex mt-4 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-2 cursor-pointer"
            onClick={() => toggleExpand(category)}
          >
            <span className="flex-1 font-medium">{category}</span>
            <ChevronUpDownIcon
              className={`ml-auto w-6 transition-transform ${
                expandedCategory === category ? "rotate-180" : ""
              }`}
            />
          </li>

          {expandedCategory === category ? (
            <div className="flex flex-col pl-4">
              {leagues.map((league, idx) => (
                <li
                  key={(() => {
                    const logoId = getLeagueLogoId(league);
                    return logoId ? `${category}-${logoId}-${idx}` : `${category}-league-${idx}`;
                  })()}
                  className="flex mt-3 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-1"
                >
                  <GetLeagueLogo
                    leagueId={league.id}
                    alt={league.name}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="flex-1">{league.name}</span>
                </li>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
};

export const Leftbar = () => {
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState<LeagueItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchRunIdRef = useRef(0);

  useEffect(() => {
    fetchRunIdRef.current += 1;
    const runId = fetchRunIdRef.current;
    let cancelled = false;

    const mapLeague = (league: any): LeagueItem | null => {
      const id = league?.leagueId ?? league?.id;
      if (!id || !league?.name) return null;
      return {
        name: league.name,
        icon: league.logo || league.image_path || "/assets/icons/league-placeholder.png",
        id,
        category: league.category,
      };
    };

    const upsertLeagues = (items: LeagueItem[]) => {
      setLeagues((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        const next = [...prev];
        for (const l of items) {
          if (!seen.has(l.id)) {
            seen.add(l.id);
            next.push(l);
          }
        }
        return next;
      });
    };

    const fetchAllPages = async () => {
      const limit = 100;

      try {
        setLoading(true);

        const first = await getAllLeagues(1, limit);
        const firstItemsRaw = first?.responseObject?.items;
        const firstMapped = Array.isArray(firstItemsRaw)
          ? (firstItemsRaw.map(mapLeague).filter(Boolean) as LeagueItem[])
          : [];

        if (cancelled || fetchRunIdRef.current !== runId) return;

        setLeagues(firstMapped);
        setLoading(false);

        const totalPages = first?.responseObject?.totalPages;
        let page = 1;
        let hasMore =
          typeof totalPages === "number" ? page < totalPages : firstMapped.length === limit;

        while (!cancelled && hasMore) {
          page += 1;
          const res = await getAllLeagues(page, limit);
          const raw = res?.responseObject?.items;
          const mapped = Array.isArray(raw)
            ? (raw.map(mapLeague).filter(Boolean) as LeagueItem[])
            : [];

          if (cancelled || fetchRunIdRef.current !== runId) return;
          if (mapped.length > 0) upsertLeagues(mapped);

          const pages = res?.responseObject?.totalPages;
          hasMore = typeof pages === "number" ? page < pages : mapped.length === limit;

          await new Promise((r) => setTimeout(r, 75));
        }
      } catch (error) {
        console.error("Error fetching leagues:", error);
        if (!cancelled && fetchRunIdRef.current === runId) setLoading(false);
      }
    };

    fetchAllPages();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-10">
          {/* Popular Leagues Section */}
          <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200  rounded p-5">
            <p className="font-[500] text-[#23272A] dark:text-white">
              Popular Leagues
            </p>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <li
                    key={idx}
                    className="flex mt-5 items-center gap-2 mb-4"
                  >
                    <Skeleton className="w-6 h-6" />
                    <Skeleton className="w-24 h-4" />
                  </li>
                ))
              : leagues.slice(0, 10).map((league, idx) => (
                  <li
                    key={league.id ? `${league.id}-${idx}` : `league-${idx}`}
                    className="flex mt-5 items-center gap-2 dark:text-snow-200 text-[#586069] text-sm mb-4"
                  >
                    <GetLeagueLogo
                      leagueId={league.id}
                      alt={league.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span>{league.name}</span>
                  </li>
                ))}
          </ul>

          {/* All Leagues Section */}
          <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200 rounded p-5">
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
                <MagnifyingGlassIcon className="w-5 h-5 theme-text" />
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
            <LeagueList allLeagues={leagues} loading={loading} searchQuery={searchQuery} />
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Leftbar;
