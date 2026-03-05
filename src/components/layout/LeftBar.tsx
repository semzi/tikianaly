import React, { useMemo, useState } from "react";
import { ChevronUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getAllLeagues } from "@/lib/api/endpoints";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import { navigate } from "@/lib/router/navigate";

// Shimmer skeleton loader component
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-snow-200 dark:bg-[#1F2937] rounded ${className}`}
    style={{ minHeight: "1em" }}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
  </div>
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

  const openLeagueProfile = (leagueId: number) => {
    const id = String(leagueId ?? "").trim();
    if (!id) return;
    navigate(`/league/profile/${encodeURIComponent(id)}`);
  };

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
                  className="flex mt-3 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-1 cursor-pointer"
                  onClick={() => openLeagueProfile(league.id)}
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

// Fetch all leagues by making concurrent requests for all pages
const fetchAllLeagues = async (): Promise<LeagueItem[]> => {
  const limit = 100;
  
  // First request to get total pages
  const first = await getAllLeagues(1, limit);
  const firstItemsRaw = first?.responseObject?.items;
  const firstMapped = Array.isArray(firstItemsRaw)
    ? (firstItemsRaw.map(mapLeague).filter(Boolean) as LeagueItem[])
    : [];
  
  const totalPages = first?.responseObject?.totalPages;
  
  // If there's only one page or no totalPages info, return what we have
  if (!totalPages || totalPages <= 1) {
    return firstMapped;
  }
  
  // Fetch all remaining pages concurrently
  const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
  const pagePromises = remainingPages.map(page => getAllLeagues(page, limit));
  
  const responses = await Promise.all(pagePromises);
  
  // Combine all results
  const allLeagues = [...firstMapped];
  const seen = new Set(firstMapped.map(l => l.id));
  
  for (const res of responses) {
    const raw = res?.responseObject?.items;
    const mapped = Array.isArray(raw)
      ? (raw.map(mapLeague).filter(Boolean) as LeagueItem[])
      : [];
    
    for (const league of mapped) {
      if (!seen.has(league.id)) {
        seen.add(league.id);
        allLeagues.push(league);
      }
    }
  }
  
  return allLeagues;
};

export const Leftbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: leagues = [], isLoading: loading } = useQuery({
    queryKey: ["football", "leagues", "all"],
    queryFn: fetchAllLeagues,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - leagues don't change often
    gcTime: 7 * 24 * 60 * 60 * 1000, // Keep in garbage collection for 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const popularLeagueIds = useMemo(
    () => [
      1204, 1399, 1005, 1007, 1205, 1229, 1269, 1368, 1221,
      1141,
    ],
    [],
  );

  const popularLeagues = useMemo(() => {
    const byId = new Map<number, LeagueItem>();
    for (const l of leagues) byId.set(l.id, l);
    return popularLeagueIds.map((id) => {
      const found = byId.get(id);
      return {
        id,
        name: found?.name ?? "",
        resolved: Boolean(found?.name),
      };
    });
  }, [leagues, popularLeagueIds]);

  const openLeagueProfile = (leagueId: number) => {
    const id = String(leagueId ?? "").trim();
    if (!id) return;
    navigate(`/league/profile/${encodeURIComponent(id)}`);
  };

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
              : popularLeagues.map((league, idx) => (
                  <li
                    key={league.id ? `${league.id}-${idx}` : `league-${idx}`}
                    className="flex mt-5 items-center gap-2 dark:text-snow-200 text-[#586069] text-sm mb-4 cursor-pointer"
                    onClick={() => openLeagueProfile(league.id)}
                  >
                    <GetLeagueLogo
                      leagueId={league.id}
                      alt={league.name || "League"}
                      className="w-6 h-6 object-contain"
                    />
                    {league.resolved ? (
                      <span>{league.name}</span>
                    ) : (
                      <Skeleton className="w-24 h-4" />
                    )}
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
