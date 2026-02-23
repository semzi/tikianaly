import { useEffect, useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import { FooterComp } from "../../../components/layout/Footer";
import { navigate } from "../../../lib/router/navigate";
import { ChartBarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  getBasketballMatchPlayByPlay,
  getBasketballMatchDetail,
} from "@/lib/api/endpoints";
import { useParams } from "react-router-dom";

interface Team {
  id: number;
  name: string;
  totalscore: string | number;
  q1: string | number;
  q2: string | number;
  q3: string | number;
  q4: string | number;
  ot: string | number;
  logo?: string;
  image_path?: string;
  possession?: boolean;
  team_fouls?: number;
  timeouts_left?: number;
}

interface PlayEvent {
  _id: string;
  number: number;
  team_scored: "home" | "away";
  home_score: number;
  away_score: number;
  leader_team: "home" | "away" | "draw";
  points_difference: number;
}

interface PlayByPlayData {
  _id: string;
  match_id: number;
  quarter_name: string;
  plays: PlayEvent[];
  createdAt: string;
  updatedAt: string;
}

interface MatchDetail {
  _id: string;
  match_id: number;
  localteam: Team;
  awayteam: Team;
  status: string;
  period?: string;
  timer?: string;
  league_name: string;
  league_id?: number;
  venue?: string;
  date?: string;
  time?: string;
  season?: string;
  stage?: string;
}

const BasketballMatchDetail = () => {
  const tabs = [{ id: "info", label: "Info", icon: ChartBarIcon }];

  const [activeTab, setActiveTab] = useState("info");
  const [matchData, setMatchData] = useState<MatchDetail | null>(null);
  const [playByPlayData, setPlayByPlayData] = useState<PlayByPlayData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const { matchId } = useParams<{ matchId: string }>();

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!matchId) return;

      setLoading(true);
      try {
        const [pbpResponse, detailResponse] = await Promise.all([
          getBasketballMatchPlayByPlay(matchId),
          getBasketballMatchDetail(matchId),
        ]);

        if (pbpResponse.success && pbpResponse.responseObject) {
          setPlayByPlayData(pbpResponse.responseObject.item);
        }

        if (detailResponse.success && detailResponse.responseObject) {
          setMatchData(detailResponse.responseObject.item);
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();

    // Auto-refresh for live matches every 15 seconds
    const isLive =
      matchData?.status?.toLowerCase().includes("quarter") ||
      matchData?.period?.toLowerCase().includes("quarter");
    const interval = isLive ? setInterval(fetchMatchData, 15000) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [matchId]);

  // Helper to calculate quarter scores from PBP data
  const calculateScores = () => {
    const scores = {
      home: { q1: 0, q2: 0, q3: 0, q4: 0, ot: 0, total: 0 },
      away: { q1: 0, q2: 0, q3: 0, q4: 0, ot: 0, total: 0 },
    };

    if (!playByPlayData || !playByPlayData.plays.length) {
      // Fallback to matchData if PBP is missing
      return {
        home: {
          q1: Number(matchData?.localteam.q1) || 0,
          q2: Number(matchData?.localteam.q2) || 0,
          q3: Number(matchData?.localteam.q3) || 0,
          q4: Number(matchData?.localteam.q4) || 0,
          ot: Number(matchData?.localteam.ot) || 0,
          total: Number(matchData?.localteam.totalscore) || 0,
        },
        away: {
          q1: Number(matchData?.awayteam.q1) || 0,
          q2: Number(matchData?.awayteam.q2) || 0,
          q3: Number(matchData?.awayteam.q3) || 0,
          q4: Number(matchData?.awayteam.q4) || 0,
          ot: Number(matchData?.awayteam.ot) || 0,
          total: Number(matchData?.awayteam.totalscore) || 0,
        },
      };
    }

    const plays = playByPlayData.plays;
    const quarters: { home: number; away: number }[] = [];
    let currentHome = 0;
    let currentAway = 0;

    for (let i = 0; i < plays.length; i++) {
      const play = plays[i];
      const nextPlay = plays[i + 1];

      // Check for quarter reset (e.g., number 26 -> 2)
      if (nextPlay && nextPlay.number < play.number) {
        quarters.push({
          home: play.home_score - currentHome,
          away: play.away_score - currentAway,
        });
        currentHome = play.home_score;
        currentAway = play.away_score;
      }

      // Last play of the data
      if (i === plays.length - 1) {
        quarters.push({
          home: play.home_score - currentHome,
          away: play.away_score - currentAway,
        });
        scores.home.total = play.home_score;
        scores.away.total = play.away_score;
      }
    }

    // Map calculated quarters to q1, q2, q3, q4, ot
    if (quarters[0]) {
      scores.home.q1 = quarters[0].home;
      scores.away.q1 = quarters[0].away;
    }
    if (quarters[1]) {
      scores.home.q2 = quarters[1].home;
      scores.away.q2 = quarters[1].away;
    }
    if (quarters[2]) {
      scores.home.q3 = quarters[2].home;
      scores.away.q3 = quarters[2].away;
    }
    if (quarters[3]) {
      scores.home.q4 = quarters[3].home;
      scores.away.q4 = quarters[3].away;
    }
    if (quarters[4]) {
      scores.home.ot = quarters[4].home;
      scores.away.ot = quarters[4].away;
    }

    return scores;
  };

  const calculatedScores = calculateScores();
  const homeScore =
    calculatedScores.home.total || matchData?.localteam.totalscore || 0;
  const awayScore =
    calculatedScores.away.total || matchData?.awayteam.totalscore || 0;

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-[#0D1117]">
        <PageHeader />
        <div className="page-padding-x py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-snow-200 dark:bg-[#1F2937] rounded-lg" />
            <div className="h-64 bg-snow-200 dark:bg-[#1F2937] rounded-lg" />
          </div>
        </div>
        <FooterComp />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />

      {/* Match Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="page-padding-x py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* League Info */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">
              {matchData?.league_name || "Basketball Match"}
            </span>
            {matchData?.venue && (
              <>
                <span className="text-sm opacity-70">•</span>
                <span className="text-sm opacity-90">{matchData.venue}</span>
              </>
            )}
          </div>

          {/* Score Display */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center mb-3 overflow-hidden border border-white/20">
                <img
                  src={
                    matchData?.localteam.logo ||
                    matchData?.localteam.image_path ||
                    "/loading-state/shield.svg"
                  }
                  alt={matchData?.localteam.name}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
              </div>
              <p className="font-semibold text-lg md:text-xl mb-1">
                {matchData?.localteam.name || "Home Team"}
              </p>
              <p className="text-3xl md:text-4xl font-bold">{homeScore}</p>
            </div>

            <div className="flex flex-col items-center px-6">
              <span className="text-xs mb-1 font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                Vs
              </span>
              {matchData?.timer && (
                <span className="text-sm font-bold mt-2">
                  {matchData.timer}'
                </span>
              )}
            </div>

            <div className="flex-1 text-center flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center mb-3 overflow-hidden border border-white/20">
                <img
                  src={
                    matchData?.awayteam.logo ||
                    matchData?.awayteam.image_path ||
                    "/loading-state/shield.svg"
                  }
                  alt={matchData?.awayteam.name}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
              </div>
              <p className="font-semibold text-lg md:text-xl mb-1">
                {matchData?.awayteam.name || "Away Team"}
              </p>
              <p className="text-3xl md:text-4xl font-bold">{awayScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex z-10 h-12 w-full overflow-y-hidden overflow-x-auto bg-brand-p3/30 dark:bg-brand-p2 backdrop-blur-2xl sticky top-0 hide-scrollbar">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex items-center gap-2 flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-orange-500 font-medium border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="page-padding-x my-8">
        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* Score Summary Table */}
            <div className="block-style !p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
                <h3 className="font-bold theme-text uppercase text-xs tracking-wider">
                  Score Summary
                </h3>
              </div>
              <div className="overflow-x-auto">
                {(playByPlayData?.plays && playByPlayData.plays.length > 0) ||
                (matchData?.localteam.totalscore !== undefined &&
                  matchData?.localteam.totalscore !== "") ? (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs theme-text uppercase opacity-70 border-b border-snow-200 dark:border-[#1F2937]">
                      <tr>
                        <th className="px-6 py-3 font-medium">Team</th>
                        <th className="px-4 py-3 text-center">Q1</th>
                        <th className="px-4 py-3 text-center">Q2</th>
                        <th className="px-4 py-3 text-center">Q3</th>
                        <th className="px-4 py-3 text-center">Q4</th>
                        <th className="px-4 py-3 text-center font-bold text-brand-primary">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                      <tr className="theme-text">
                        <td className="px-6 py-4 font-semibold">
                          {matchData?.localteam.name || "Home Team"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {calculatedScores.home.q1}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {calculatedScores.home.q2}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {calculatedScores.home.q3}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {calculatedScores.home.q4}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-brand-primary">
                          {calculatedScores.home.total}
                        </td>
                      </tr>
                      <tr className="theme-text">
                        <td className="px-6 py-4 font-semibold">
                          {matchData?.awayteam.name || "Away Team"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {calculatedScores.away.q1}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {calculatedScores.away.q2}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {calculatedScores.away.q3}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {calculatedScores.away.q4}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-brand-primary">
                          {calculatedScores.away.total}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-neutral-n4 dark:text-snow-200 font-medium italic">
                      Match not started so no match details
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stadium Info */}
            {matchData?.venue && (
              <div className="block-style">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-brand-primary/10 text-brand-primary">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs theme-text opacity-70 uppercase font-semibold">
                      Stadium
                    </p>
                    <p className="text-sm font-bold theme-text">
                      {matchData.venue}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <FooterComp />
    </div>
  );
};

export default BasketballMatchDetail;
