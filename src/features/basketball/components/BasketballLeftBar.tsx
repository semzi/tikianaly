import React, { useMemo, useState } from "react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getBasketballLeagues } from "@/lib/api/endpoints";
import { navigate } from "@/lib/router/navigate";
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
  selectedLeagueId: number | null;
  onSelectLeague?: (id: number | null) => void;
}

const LeagueList: React.FC<LeagueListProps> = ({
  allLeagues,
  loading,
  searchQuery,
  selectedLeagueId,
  onSelectLeague,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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
      <li
        className={`flex mt-4 items-center gap-2 text-sm mb-2 cursor-pointer transition-colors ${
          selectedLeagueId === null
            ? "text-brand-primary font-bold"
            : "dark:text-snow-200 text-[#586069]"
        }`}
        onClick={() => {
          if (onSelectLeague) {
            onSelectLeague(null);
          } else {
            navigate("/basketball");
          }
        }}
      >
        <button
          className=" cursor-pointer"
          onClick={() => {
            navigate(`/basketball/leagues`);
          }}
        >
          All Leagues
        </button>
      </li>
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
              {leagues.map((league) => (
                <li
                  key={league.id}
                  className={`flex mt-3 items-center gap-2 text-sm mb-1 cursor-pointer transition-colors ${
                    selectedLeagueId === league.id
                      ? "text-brand-primary font-bold"
                      : "dark:text-snow-200 text-[#586069]"
                  }`}
                  onClick={() => {
                    navigate(`/basketball/league/${league.id}`);
                  }}
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

interface BasketballLeftBarProps {
  selectedLeagueId?: number | null;
  onSelectLeague?: (id: number | null) => void;
}

export const BasketballLeftBar: React.FC<BasketballLeftBarProps> = ({
  selectedLeagueId = null,
  onSelectLeague,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: leagues = [], isLoading: loading } = useQuery({
    queryKey: ["basketball", "leagues", "all"],
    queryFn: async () => {
      const res = await getBasketballLeagues();
      const rawItems = res?.responseObject?.items || [];
      return rawItems
        .map((l: any) => ({
          name: l.name,
          icon:
            l.logo || l.image_path || "/assets/icons/league-placeholder.png",
          id: l.league_id || l.leagueId || l.id,
          category:
            l.continent_name ||
            l.continent ||
            l.country_name ||
            l.country ||
            l.category ||
            "General",
        }))
        .filter((l: any) => l.id && l.name) as LeagueItem[];
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - basketball leagues don't change often
    gcTime: 7 * 24 * 60 * 60 * 1000, // Keep in garbage collection for 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <div>
      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-10">
          {/* Popular Leagues Section */}
          <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200 rounded p-5 shadow-sm">
            <p className="font-[500] text-[#23272A] dark:text-white mb-2">
              Popular Leagues
            </p>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <li key={idx} className="flex mt-5 items-center gap-2 mb-4">
                    <Skeleton className="w-6 h-6" />
                    <Skeleton className="w-24 h-4" />
                  </li>
                ))
              : leagues.slice(0, 5).map((league) => (
                  <li
                    key={league.id}
                    className={`flex mt-5 items-center gap-2 text-sm mb-4 cursor-pointer transition-colors hover:text-brand-primary ${
                      selectedLeagueId === league.id
                        ? "text-brand-primary font-bold"
                        : "dark:text-snow-200 text-[#586069]"
                    }`}
                    onClick={() => {
                      navigate(`/basketball/league/${league.id}`);
                    }}
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
                autoFocus
              />
            ) : null}
            <LeagueList
              allLeagues={leagues}
              loading={loading}
              searchQuery={searchQuery}
              selectedLeagueId={selectedLeagueId}
              onSelectLeague={onSelectLeague}
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BasketballLeftBar;
