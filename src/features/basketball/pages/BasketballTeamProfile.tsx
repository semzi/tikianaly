import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import {
  ArrowLeftIcon,
  TrophyIcon,
  UserGroupIcon,
  MapPinIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  getBasketballTeamDetail,
  getBasketballStandings,
} from "@/lib/api/endpoints";
import { AnimatePresence, motion } from "framer-motion";

interface TeamInfo {
  id: number;
  name: string;
  country?: string;
  logo?: string;
  venue?: string;
}

const BasketballTeamProfile = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [teamStats, setTeamStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamId) return;
      setLoading(true);
      try {
        // Fetch both team details and standings (stats) concurrently
        const [detailsRes, statsRes] = await Promise.all([
          getBasketballTeamDetail(teamId).catch(() => ({ success: false })),
          getBasketballStandings(teamId).catch(() => ({ success: false })),
        ]);

        let combinedInfo: TeamInfo | null = null;

        // Process details response
        if (detailsRes?.success && detailsRes?.responseObject) {
          const found =
            detailsRes.responseObject.item || detailsRes.responseObject;
          if (found) {
            combinedInfo = {
              id: found.team_id || found.id,
              name: found.name,
              country: found.country_name || found.country,
              logo: found.logo || found.image_path,
              venue: found.venue_name || found.venue,
            };
          }
        }

        // Process standings response (stats)
        if (statsRes?.success && statsRes?.responseObject) {
          const item = statsRes.responseObject.item;
          if (item) {
            setTeamStats(item);

            // Merge into info if info is missing or incomplete
            if (!combinedInfo || !combinedInfo.name) {
              combinedInfo = {
                id: item.team_id || combinedInfo?.id || Number(teamId),
                name: item.team_name || combinedInfo?.name || "Unknown Team",
                country: combinedInfo?.country,
                logo: combinedInfo?.logo,
                venue: combinedInfo?.venue,
              };
            }
          }
        }

        if (combinedInfo) {
          setTeamInfo(combinedInfo);
        }
      } catch (error) {
        console.error("Error fetching team info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-[#0D1117]">
        <PageHeader />
        <div className="page-padding-x py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-snow-200 dark:bg-white/10 rounded-2xl" />
            <div className="h-96 bg-snow-200 dark:bg-white/10 rounded-2xl" />
          </div>
        </div>
        <FooterComp />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />

      {/* Team Header Banner */}
      <div className="secondary-gradient relative z-0 overflow-hidden">
        {/* Abstract shapes for visual interest */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="page-padding-x py-12 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110 flex items-center justify-center w-10 h-10 border border-white/10"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 dark:bg-[#161B22]/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/5"
            >
              <img
                src={teamInfo?.logo || "/loading-state/shield.svg"}
                alt={teamInfo?.name}
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
            </motion.div>

            <div className="flex-1 text-center md:text-left text-white pb-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap justify-center md:justify-start gap-2 mb-4"
              >
                <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
                  Basketball
                </span>
                <span className="bg-orange-500/20 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md text-orange-100">
                  {teamInfo?.country || "International"}
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-sm"
              >
                {teamInfo?.name || "Team Profile"}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center md:justify-start gap-8 text-snow-100/80 text-sm font-medium"
              >
                <div className="flex items-center gap-2 group transition-colors hover:text-white">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                    <MapPinIcon className="w-4 h-4 text-orange-400" />
                  </div>
                  <span>{teamInfo?.venue || "Main Arena"}</span>
                </div>
                <div className="flex items-center gap-2 group transition-colors hover:text-white">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                    <UserGroupIcon className="w-4 h-4 text-orange-400" />
                  </div>
                  <span>Roster: Active</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-padding-x mb-12">
        {/* Navigation */}
        <div className="flex gap-8 border-b border-snow-200 dark:border-white/10 mt-12 mb-10 overflow-x-auto hide-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: ChartBarIcon },
            { id: "matches", label: "Matches", icon: TrophyIcon },
            { id: "roster", label: "Roster", icon: UserGroupIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-5 px-1 font-medium text-sm transition-all flex items-center gap-2.5 relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-orange-500"
                  : "text-neutral-n4 dark:text-snow-300 hover:text-orange-400 opacity-60 hover:opacity-100"
              }`}
            >
              <tab.icon
                className={`w-4 h-4 transition-transform ${activeTab === tab.id ? "scale-110" : ""}`}
              />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* League Standing Stats */}
              <div className="lg:col-span-2 space-y-8">
                <div className="block-style overflow-hidden">
                  <div className="p-6 border-b border-snow-200 dark:border-white/5 bg-snow-100/30 dark:bg-white/[0.02] flex justify-between items-center">
                    <h3 className="font-semibold text-lg theme-text flex items-center gap-2.5">
                      <ChartBarIcon className="w-5 h-5 text-orange-500" />
                      Season Performance
                    </h3>
                    {teamStats?.position && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/20">
                        Rank #{teamStats.position}
                      </span>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {[
                        {
                          label: "Played",
                          value: teamStats?.played || 0,
                          icon: "🏀",
                        },
                        {
                          label: "Wins",
                          value: teamStats?.wins || 0,
                          color: "text-emerald-500",
                          icon: "📈",
                        },
                        {
                          label: "Losses",
                          value: teamStats?.losses || 0,
                          color: "text-red-500",
                          icon: "📉",
                        },
                        {
                          label: "Points",
                          value: teamStats?.points || 0,
                          color: "text-blue-500",
                          icon: "⭐",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="text-center group p-4 rounded-2xl hover:bg-snow-100 dark:hover:bg-white/5 transition-all"
                        >
                          <div className="text-2xl mb-2 transition-transform group-hover:scale-125">
                            {stat.icon}
                          </div>
                          <div
                            className={`text-3xl font-bold mb-1 ${stat.color || "theme-text"}`}
                          >
                            {stat.value}
                          </div>
                          <div className="text-[10px] font-bold text-neutral-n4 dark:text-snow-400 uppercase tracking-widest opacity-60">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 grid md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-n4 dark:text-snow-400 opacity-80 mb-6">
                            Scoring Analysis
                          </h4>
                          <div className="space-y-6">
                            {[
                              {
                                label: "Points For",
                                value: teamStats?.points_for || 0,
                                color: "bg-orange-500",
                              },
                              {
                                label: "Points Against",
                                value: teamStats?.points_against || 0,
                                color: "bg-blue-500",
                              },
                            ].map((bar) => (
                              <div key={bar.label} className="space-y-2.5">
                                <div className="flex justify-between text-[11px] font-bold theme-text uppercase tracking-wider">
                                  <span>{bar.label}</span>
                                  <span className="text-sm">{bar.value}</span>
                                </div>
                                <div className="h-2 w-full bg-snow-200 dark:bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${Math.min(100, (bar.value / 150) * 100)}%`,
                                    }}
                                    transition={{
                                      duration: 1,
                                      ease: "circOut",
                                    }}
                                    className={`h-full ${bar.color} rounded-full`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex flex-col justify-center items-center p-8 bg-snow-100/50 dark:bg-white/[0.03] rounded-[2.5rem] border border-snow-200 dark:border-white/5 backdrop-blur-sm">
                          <div className="text-[10px] font-bold theme-text mb-4 opacity-70 uppercase tracking-[0.2em]">
                            Net Differential
                          </div>
                          <div
                            className={`text-5xl font-black tracking-tighter ${Number(teamStats?.points_diff) >= 0 ? "text-emerald-500" : "text-red-500"}`}
                          >
                            {teamStats?.points_diff > 0
                              ? `+${teamStats.points_diff}`
                              : teamStats?.points_diff || 0}
                          </div>
                          {teamStats?.recent_form && (
                            <div className="mt-6 flex gap-1.5 p-2 bg-white/50 dark:bg-white/5 rounded-full px-4">
                              {teamStats.recent_form
                                .split("")
                                .map((c: string, i: number) => (
                                  <div
                                    key={i}
                                    className={`w-2.5 h-2.5 rounded-full ${c === "W" ? "bg-emerald-500" : "bg-red-500"} shadow-sm`}
                                    title={c === "W" ? "Win" : "Loss"}
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Next Match Cards */}
              <div className="space-y-8">
                <div className="block-style overflow-hidden">
                  <div className="p-6 border-b border-snow-200 dark:border-white/5 bg-snow-100/30 dark:bg-white/[0.02]">
                    <h3 className="font-semibold text-lg theme-text flex items-center gap-2.5">
                      <TrophyIcon className="w-5 h-5 text-orange-500" />
                      Season Goal
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl mb-6">
                      <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2 opacity-80">
                        Competition Objective
                      </div>
                      <div className="font-bold theme-text text-sm leading-relaxed">
                        {teamStats?.description ||
                          "Compete for top-tier placement and championship qualification."}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-neutral-n4 uppercase tracking-widest px-1">
                        Notable achievements
                      </h4>
                      {[
                        "Conference Finals Participant (2024)",
                        "Elite Defensive Consistency Citation",
                      ].map((ach, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 p-4 items-center bg-snow-50 dark:bg-white/[0.01] rounded-2xl border border-snow-100 dark:border-white/5 hover:border-orange-500/20 transition-all"
                        >
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center flex-shrink-0">
                            <TrophyIcon className="w-4 h-4 text-orange-500" />
                          </div>
                          <p className="font-medium theme-text text-xs opacity-80">
                            {ach}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="block-style p-8 bg-gradient-to-br from-neutral-900 to-black dark:from-[#161B22] dark:to-black text-white border-none shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
                        <UserGroupIcon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold tracking-tight">
                        Roster Status
                      </h4>
                    </div>
                    <p className="text-xs text-snow-200/70 mb-8 leading-relaxed">
                      Detailed player performance and availability data will be
                      synchronized in the next update.
                    </p>
                    <button className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                      Notify Me
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "overview" && (
            <div className="block-style py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
              <p className="text-neutral-n4 dark:text-snow-200 font-medium italic text-lg opacity-40">
                Detailed {activeTab} data for {teamInfo?.name || "this team"}{" "}
                will be synchronized shortly.
              </p>
            </div>
          )}
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default BasketballTeamProfile;
