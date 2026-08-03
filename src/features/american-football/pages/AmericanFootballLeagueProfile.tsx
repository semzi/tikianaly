import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import { mockAmericanFootballAllLeagues } from "../data/mockAmericanFootball";
import { mockLeagueStandings } from "../data/mockAmericanFootballStandings";
import {
  getAmericanFootballAllStandings,
  isAmericanFootballApiEnabled,
  normalizeAmericanFootballStandings,
  AF_LEAGUE_CODE_TO_MOCK_ID,
} from "@/lib/api/american-football";

type LeagueTab = "overview" | "standings";

// Add this mapping - reverse of what's in index.ts
const AF_CODE_TO_MOCK_ID: Record<string, string> = {
  NFL: "nfl",
  FBS: "ncaa-fbs",
  FCS: "ncaa-fcs",
  DIV3: "div3",
};

const leagueInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

const AmericanFootballLeagueProfile = () => {
  const { leagueId } = useParams();
  const [activeTab, setActiveTab] = useState<LeagueTab>("standings");

  // Replace this line with the new logic
  const normalizedLeagueId = leagueId
    ? (AF_CODE_TO_MOCK_ID[leagueId.toUpperCase()] ?? leagueId.toLowerCase())
    : undefined;

  const league = useMemo(
    () =>
      mockAmericanFootballAllLeagues.find(
        (item) => item.id.toLowerCase() === normalizedLeagueId,
      ),
    [normalizedLeagueId],
  );

  const standingsQuery = useQuery({
    queryKey: ["american-football", "standings", "all"],
    enabled: isAmericanFootballApiEnabled,
    queryFn: async () => {
      const raw = await getAmericanFootballAllStandings();
      const entries = Array.isArray(
        (raw as { responseObject?: unknown[] })?.responseObject,
      )
        ? (raw as { responseObject: unknown[] }).responseObject
        : [];
      const result: Record<
        string,
        ReturnType<typeof normalizeAmericanFootballStandings>
      > = {};
      for (const entry of entries) {
        const record = entry as { code?: string };
        const code = String(record.code ?? "").toUpperCase();
        const mockId = AF_LEAGUE_CODE_TO_MOCK_ID[code] ?? code.toLowerCase();
        result[mockId] = normalizeAmericanFootballStandings(entry);
      }
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });

  const standingsGroups = normalizedLeagueId
    ? standingsQuery.data?.[normalizedLeagueId]?.length
      ? standingsQuery.data[normalizedLeagueId]
      : mockLeagueStandings[normalizedLeagueId]
    : undefined;

  const tabs = [
    { id: "overview" as LeagueTab, label: "Overview" },
    { id: "standings" as LeagueTab, label: "Standings" },
  ];

  if (!league) {
    return (
      <div className="min-h-screen dark:bg-[#0D1117]">
        <PageHeader />
        <div className="page-padding-x py-12 text-center">
          <p className="text-lg font-semibold theme-text">League not found.</p>
        </div>
        <FooterComp />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />

      <div className="flex page-padding-x gap-5 py-5 justify-around">
        <div className="w-full flex flex-col gap-y-5 h-full pr-2">
          <div className="secondary-gradient relative z-0 rounded-[10px] overflow-hidden shadow-lg">
            <div className="w-full px-6 py-8 relative z-0 flex items-center">
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors flex-shrink-0"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>

                <div className="bg-white p-3 rounded-xl shadow-lg flex-shrink-0 w-20 h-20 flex items-center justify-center">
                  <span className="text-lg font-black text-brand-primary">
                    {leagueInitials(league.name)}
                  </span>
                </div>

                <div className="text-center md:text-left text-white min-w-0">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md border border-white/10">
                      American Football
                    </span>
                    <span className="bg-orange-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md border border-orange-500/20 text-orange-200">
                      {league.tier}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight truncate">
                    {league.name}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-snow-100 opacity-90 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{league.region}</span>
                    </div>
                    <span>{league.season}</span>
                    <span>{league.teams}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="block-style">
              <div className="flex gap-4 border-b border-snow-200 dark:border-[#1F2937]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? "text-brand-primary"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary" />
                    )}
                  </button>
                ))}
              </div>

              {activeTab === "standings" && (
                <div className="mt-4 flex items-center justify-between">
                  <h2 className="text-base font-bold theme-text">
                    League Standings
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-snow-100 dark:bg-white/5 border border-snow-200 dark:border-white/10 text-sm theme-text">
                    <span>Season: {league.season}</span>
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>

            {activeTab === "overview" ? (
              <div className="block-style">
                <p className="text-sm theme-text">{league.description}</p>
              </div>
            ) : null}

            {activeTab === "standings" ? (
              <div className="space-y-6">
                {standingsGroups?.length ? (
                  standingsGroups.map((group, idx) => (
                    <div
                      key={`${group.conference ?? "flat"}-${group.division ?? idx}`}
                      className="block-style !p-0 overflow-hidden"
                    >
                      {group.conference || group.division ? (
                        <div className="px-5 py-3 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
                          <p className="font-bold uppercase text-sm theme-text tracking-wide">
                            {[group.conference, group.division]
                              .filter(Boolean)
                              .join(" — ")}
                          </p>
                        </div>
                      ) : null}
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-neutral-n4 uppercase bg-snow-100 dark:bg-white/5 border-b border-snow-200 dark:border-[#1F2937]">
                            <th className="text-left px-5 py-2">#</th>
                            <th className="text-left px-2 py-2">Team</th>
                            <th className="px-2 py-2">W</th>
                            <th className="px-2 py-2">L</th>
                            <th className="px-2 py-2">T</th>
                            <th className="px-2 py-2">PF</th>
                            <th className="px-2 py-2">PA</th>
                            <th className="px-2 py-2">Strk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.teams.map((team, rowIdx) => (
                            <tr
                              key={team.id}
                              className={`border-b border-snow-200 dark:border-[#1F2937] last:border-b-0 ${
                                rowIdx % 2 === 1
                                  ? "bg-snow-50 dark:bg-white/[0.02]"
                                  : ""
                              }`}
                            >
                              <td className="px-5 py-2 text-neutral-n4">
                                {team.position}
                              </td>
                              <td className="px-2 py-2 font-medium theme-text">
                                {team.name}
                              </td>
                              <td className="text-center px-2 py-2 theme-text">
                                {team.won}
                              </td>
                              <td className="text-center px-2 py-2 theme-text">
                                {team.lost}
                              </td>
                              <td className="text-center px-2 py-2 theme-text">
                                {team.ties}
                              </td>
                              <td className="text-center px-2 py-2 theme-text">
                                {team.pointsFor}
                              </td>
                              <td className="text-center px-2 py-2 theme-text">
                                {team.pointsAgainst}
                              </td>
                              <td className="text-center px-2 py-2 font-semibold text-brand-secondary">
                                {team.streak}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))
                ) : (
                  <div className="block-style text-center py-10">
                    <p className="text-sm text-neutral-n4">
                      Standings for {league.name} aren't in yet.
                    </p>
                  </div>
                )}

                <div className="block-style flex flex-wrap gap-x-8 gap-y-2 text-xs text-neutral-n4">
                  <span>
                    <strong className="theme-text">W:</strong> Wins
                  </span>
                  <span>
                    <strong className="theme-text">L:</strong> Losses
                  </span>
                  <span>
                    <strong className="theme-text">T:</strong> Ties
                  </span>
                  <span>
                    <strong className="theme-text">PF:</strong> Points For
                  </span>
                  <span>
                    <strong className="theme-text">PA:</strong> Points Against
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default AmericanFootballLeagueProfile;
