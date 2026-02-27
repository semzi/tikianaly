import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import {
  ChevronUpDownIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import StaggerChildren from "@/animations/staggerChildren";
import { getBasketballLeagues } from "@/lib/api/endpoints";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import { navigate } from "@/lib/router/navigate";

interface League {
  name: string;
  icon?: string;
  id: number;
  category?: string;
}

type ApiLeague = {
  id?: number;
  leagueId?: number;
  league_id?: number;
  name?: string;
  logo?: string;
  image_path?: string;
  category?: string;
  continent?: string;
  continent_name?: string;
  country?: string;
  country_name?: string;
  season_name?: string;
};

type ApiResponse = {
  success?: boolean;
  responseObject?: {
    items?: ApiLeague[];
  };
};

const mapLeague = (league: ApiLeague): League | null => {
  const id = league.league_id ?? league.leagueId ?? league.id;
  if (!id || !league.name) return null;
  return {
    id,
    name: league.name,
    icon: league.logo || league.image_path,
    category:
      league.continent_name ||
      league.continent ||
      league.country_name ||
      league.country ||
      league.category ||
      "General",
  };
};

export const BasketballLeagues = () => {
  const [activeTab, setActiveTab] = useState<"suggestions" | "all">(
    "suggestions",
  );

  const openLeagueProfile = (leagueId: number) => {
    const id = String(leagueId ?? "").trim();
    if (!id) return;
    navigate(`/basketball/league/${encodeURIComponent(id)}`);
  };

  const [countrySearchOpen, setCountrySearchOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const { data: leagues = [], isLoading: loading } = useQuery({
    queryKey: ["basketball", "leagues", "all"],
    queryFn: async () => {
      const res = (await getBasketballLeagues()) as ApiResponse;
      const items = res?.responseObject?.items ?? [];
      return items.map(mapLeague).filter(Boolean) as League[];
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - basketball leagues don't change often
    gcTime: 7 * 24 * 60 * 60 * 1000, // Keep in garbage collection for 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const suggestions = useMemo(() => leagues.slice(0, 6), [leagues]);

  const groupedContinents = useMemo(() => {
    const q = countrySearchQuery.trim().toLowerCase();
    const filtered = q
      ? leagues.filter((l) => l.name.toLowerCase().includes(q))
      : leagues;

    const map = new Map<string, League[]>();
    for (const league of filtered) {
      const key = (league.category || "Other").trim() || "Other";
      const prev = map.get(key) || [];
      prev.push(league);
      map.set(key, prev);
    }

    const entries = Array.from(map.entries()).map(([continent, leagues]) => {
      leagues.sort((a, b) => a.name.localeCompare(b.name));
      return { continent, leagues };
    });

    entries.sort((a, b) => a.continent.localeCompare(b.continent));
    return entries;
  }, [leagues, countrySearchQuery]);

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />

      {/* Toggle Header */}
      <div className="flex border-b cursor-pointer sticky top-0 z-10 backdrop-blur-2xl dark:text-snow-100 theme-border">
        <div
          className={`flex-1 py-3 text-center transition-all ${
            activeTab === "suggestions"
              ? "border-b-4 border-brand-secondary"
              : ""
          }`}
          onClick={() => setActiveTab("suggestions")}
        >
          Suggestions
        </div>
        <div
          className={`flex-1 py-3 text-center transition-all ${
            activeTab === "all" ? "border-b-4 border-brand-secondary" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Leagues
        </div>
      </div>

      {/* Animated Content */}
      <div className="page-padding-x overflow-hidden min-h-[70vh]">
        <AnimatePresence mode="wait">
          {activeTab === "suggestions" && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
              className=" w-full pt-5"
            >
              {/* Suggestions content */}
              <StaggerChildren
                className="grid grid-cols-3 gap-4 text-center items-stretch"
                stagger={0.15}
              >
                {suggestions.map((league, idx) => (
                  <div
                    key={league.name + idx}
                    className="game-block flex flex-col text-center gap-3 theme-text text-sm cursor-pointer hover:border-brand-secondary transition-all"
                    onClick={() => openLeagueProfile(league.id)}
                  >
                    <div className="mx-auto w-12 h-12 bg-snow-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                      <GetLeagueLogo
                        leagueId={league.id}
                        alt={league.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <span className="text-center font-medium line-clamp-1">
                      {league.name}
                    </span>
                  </div>
                ))}
              </StaggerChildren>

              <ul className="block-style my-8">
                <div className="flex items-center">
                  <p className="font-semibold dark:text-white text-[#23272A]">
                    Leagues by Country
                  </p>
                  <MagnifyingGlassIcon
                    className="cursor-pointer theme-text ml-auto w-5"
                    onClick={() => setCountrySearchOpen((v) => !v)}
                  />
                </div>
                {countrySearchOpen ? (
                  <input
                    value={countrySearchQuery}
                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                    className="mt-3 w-full rounded-xl border border-snow-200 bg-white px-4 py-2 text-sm text-[#23272A] outline-none focus:border-brand-primary dark:border-[#1F2937] dark:bg-[#0D1117] dark:text-snow-200"
                    placeholder="Search basketball leagues..."
                    autoFocus
                  />
                ) : null}

                {loading ? (
                  <div className="mt-4 text-sm text-neutral-n5 dark:text-snow-200">
                    Loading…
                  </div>
                ) : (
                  <>
                    {groupedContinents.map(({ continent, leagues }) => (
                      <div key={continent} className="flex flex-col">
                        <li
                          className="flex mt-4 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-2 cursor-pointer group"
                          onClick={() =>
                            setExpandedCountry((prev) =>
                              prev === continent ? null : continent,
                            )
                          }
                        >
                          <span className="flex-1  group-hover:text-brand-secondary transition-colors">
                            {continent}
                          </span>
                          <ChevronUpDownIcon
                            className={`ml-auto w-6 transition-transform ${
                              expandedCountry === continent
                                ? "rotate-180 text-brand-secondary"
                                : ""
                            }`}
                          />
                        </li>

                        {expandedCountry === continent ? (
                          <div className="flex flex-col pl-4 animate-in slide-in-from-top-2 duration-200">
                            {leagues.map((league, idx) => (
                              <li
                                key={`${continent}-${league.id}-${idx}`}
                                className="flex mt-3 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-1 cursor-pointer hover:text-brand-secondary transition-colors"
                                onClick={() => openLeagueProfile(league.id)}
                              >
                                <GetLeagueLogo
                                  leagueId={league.id}
                                  alt={league.name}
                                  className="w-6 h-6 object-contain"
                                />
                                <span className="flex-1 font-medium">
                                  {league.name}
                                </span>
                              </li>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </>
                )}
              </ul>
            </motion.div>
          )}

          {activeTab === "all" && (
            <motion.div
              key="all"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full pt-5"
            >
              {/* All Leagues content */}
              <ul className="block-style mt-6 mb-12">
                <p className="font-semibold text-[#23272A] dark:text-white mb-6">
                  All Basketball Leagues
                </p>
                {loading && leagues.length === 0 ? (
                  <div className="mt-4 text-sm text-neutral-n5 dark:text-snow-200">
                    Loading…
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                    {leagues.map((league, idx) => (
                      <li
                        key={`${league.id}-${idx}`}
                        className="flex items-center gap-3 dark:text-snow-200 text-[#586069] text-sm cursor-pointer hover:text-brand-secondary transition-all"
                        onClick={() => openLeagueProfile(league.id)}
                      >
                        <div className="w-8 h-8 bg-snow-100 dark:bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GetLeagueLogo
                            leagueId={league.id}
                            alt={league.name}
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                        <span className="font-medium truncate">
                          {league.name}
                        </span>
                        <HeartIcon className="cursor-pointer ml-auto w-4 opacity-40 hover:opacity-100 hover:text-brand-negative transition-all" />
                      </li>
                    ))}
                  </div>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterComp />
    </div>
  );
};

export default BasketballLeagues;
