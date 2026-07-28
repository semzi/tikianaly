import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import Category from "@/features/dashboard/components/Category";
import { CricketLeftBar } from "../components/CricketLeftBar";
import { mockCricketLeagues } from "../data/mockCricket";
import { navigate } from "@/lib/router/navigate";

type CricketLeagueItem = (typeof mockCricketLeagues)[number];

const badgeText = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const CricketLeagues = () => {
  const [activeTab, setActiveTab] = useState<"suggestions" | "all">("suggestions");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  const suggestions = mockCricketLeagues.slice(0, 4);

  const groupedRegions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? mockCricketLeagues.filter((league) =>
          league.name.toLowerCase().includes(q),
        )
      : mockCricketLeagues;

    const map = new Map<string, CricketLeagueItem[]>();
    for (const league of filtered) {
      const key = league.region || "Other";
      const current = map.get(key) ?? [];
      current.push(league);
      map.set(key, current);
    }

    return Array.from(map.entries())
      .map(([region, leagues]) => ({
        region,
        leagues: leagues.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.region.localeCompare(b.region));
  }, [searchQuery]);

  const openLeagueProfile = (leagueId: number) => {
    navigate(`/cricket/league/${encodeURIComponent(String(leagueId))}`);
  };

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />
      <Category />

      <div className="page-padding-x py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
          <aside className="hidden lg:block">
            <CricketLeftBar />
          </aside>

          <main className="min-w-0">
            <section className="rounded-3xl border border-snow-200 bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#312e81] p-6 text-white shadow-lg dark:border-white/10">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Cricket leagues
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
                Demo leagues with the same bold card language as the rest of the app.
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">
                Browse featured competitions, drill into regions, and open a league
                profile packed with standings and fixtures.
              </p>
            </section>

            <div className="mt-6 flex border-b border-snow-200 dark:border-[#1F2937]">
              <button
                type="button"
                className={`px-5 py-3 text-sm font-semibold ${
                  activeTab === "suggestions"
                    ? "border-b-2 border-brand-secondary text-brand-secondary"
                    : "text-[#586069] dark:text-snow-200"
                }`}
                onClick={() => setActiveTab("suggestions")}
              >
                Suggestions
              </button>
              <button
                type="button"
                className={`px-5 py-3 text-sm font-semibold ${
                  activeTab === "all"
                    ? "border-b-2 border-brand-secondary text-brand-secondary"
                    : "text-[#586069] dark:text-snow-200"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All leagues
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "suggestions" ? (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.25 }}
                  className="pt-5"
                >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {suggestions.map((league) => (
                      <button
                        key={league.id}
                        type="button"
                        onClick={() => openLeagueProfile(league.id)}
                        className="game-block flex flex-col items-start gap-3 text-left transition hover:border-brand-secondary"
                      >
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white"
                          style={{ backgroundColor: league.accent }}
                        >
                          {badgeText(league.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#23272A] dark:text-white">
                            {league.name}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-snow-200">
                            {league.region} · {league.season}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="block-style mt-6">
                    <div className="flex items-center">
                      <p className="font-semibold text-[#23272A] dark:text-white">
                        Leagues by Region
                      </p>
                      <MagnifyingGlassIcon
                        className="ml-auto h-5 w-5 cursor-pointer text-[#586069] dark:text-snow-200"
                        onClick={() => setSearchOpen((value) => !value)}
                      />
                    </div>
                    {searchOpen ? (
                      <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="mt-3 w-full rounded-xl border border-snow-200 bg-white px-4 py-2 text-sm text-[#23272A] outline-none focus:border-brand-primary dark:border-[#1F2937] dark:bg-[#0D1117] dark:text-snow-200"
                        placeholder="Search cricket leagues..."
                      />
                    ) : null}

                    <div className="mt-4 space-y-3">
                      {groupedRegions.map(({ region, leagues }) => (
                        <div key={region}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 text-left text-sm font-medium text-[#586069] dark:text-snow-200"
                            onClick={() =>
                              setExpandedRegion((current) =>
                                current === region ? null : region,
                              )
                            }
                          >
                            <span className="flex-1">{region}</span>
                            <ChevronUpDownIcon
                              className={`h-5 w-5 transition-transform ${
                                expandedRegion === region ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {expandedRegion === region ? (
                            <div className="mt-3 space-y-2 pl-4">
                              {leagues.map((league) => (
                                <button
                                  key={league.id}
                                  type="button"
                                  className="flex w-full items-center gap-3 rounded-xl bg-snow-100 px-4 py-3 text-left dark:bg-white/5"
                                  onClick={() => openLeagueProfile(league.id)}
                                >
                                  <div
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
                                    style={{ backgroundColor: league.accent }}
                                  >
                                    {badgeText(league.name)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-[#23272A] dark:text-white">
                                      {league.name}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-snow-200">
                                      {league.format} · {league.teams}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="all"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                  className="pt-5"
                >
                  <div className="block-style">
                    <p className="font-semibold text-[#23272A] dark:text-white">
                      All leagues
                    </p>
                    <div className="mt-4 space-y-3">
                      {mockCricketLeagues.map((league) => (
                        <button
                          key={league.id}
                          type="button"
                          className="flex w-full items-center gap-3 rounded-2xl bg-snow-100 px-4 py-3 text-left dark:bg-white/5"
                          onClick={() => openLeagueProfile(league.id)}
                        >
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold text-white"
                            style={{ backgroundColor: league.accent }}
                          >
                            {badgeText(league.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#23272A] dark:text-white">
                              {league.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-snow-200">
                              {league.region} · {league.season} · {league.format}
                            </p>
                          </div>
                          <span className="ml-auto text-xs text-neutral-500 dark:text-snow-200">
                            Open
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <aside className="hidden xl:block">
            <CricketLeftBar />
          </aside>
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default CricketLeagues;
