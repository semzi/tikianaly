import { useEffect, useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import { FooterComp } from "../../../components/layout/Footer";
import { navigate } from "../../../lib/router/navigate";
import {
  ArrowLeftIcon,
  ChartBarIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { getBasketballMatchPlayByPlay } from "@/lib/api/endpoints";
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
  const tabs = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "playbyplay", label: "Play-by-Play", icon: ListBulletIcon },
    { id: "stats", label: "Quarter Stats", icon: ChartBarIcon },
  ];

  const [activeTab, setActiveTab] = useState("overview");
  const [matchData] = useState<MatchDetail | null>(null);
  const [playByPlayData, setPlayByPlayData] = useState<PlayByPlayData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const { matchId } = useParams<{ matchId: string }>();

  console.log("Match ID from params:", matchId);

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!matchId) return;

      setLoading(true);
      try {
        const response = await getBasketballMatchPlayByPlay(matchId);

        if (response.success && response.responseObject) {
          // The API returns play-by-play data
          const pbpData = response.responseObject.item;
          setPlayByPlayData(pbpData);

          // We need to fetch match details separately or construct from available data
          // For now, we'll use the play-by-play match_id to show we have data
          console.log("Play-by-play data:", pbpData);
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

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Get points scored from each play
  const getPointsScored = (
    currentPlay: PlayEvent,
    previousPlay?: PlayEvent,
  ): number => {
    if (!previousPlay) return currentPlay.home_score + currentPlay.away_score;

    if (currentPlay.team_scored === "home") {
      return currentPlay.home_score - previousPlay.home_score;
    } else {
      return currentPlay.away_score - previousPlay.away_score;
    }
  };

  const StatBar = ({
    label,
    homeValue,
    awayValue,
  }: {
    label: string;
    homeValue: number;
    awayValue: number;
  }) => {
    const total = homeValue + awayValue;
    const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium theme-text">{homeValue}</span>
          <span className="text-xs text-neutral-n4 dark:text-snow-200">
            {label}
          </span>
          <span className="font-medium theme-text">{awayValue}</span>
        </div>
        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-snow-200 dark:bg-[#1F2937]">
          <div
            className="bg-orange-500 transition-all duration-300"
            style={{ width: `${homePercentage}%` }}
          />
          <div
            className="bg-blue-500 transition-all duration-300"
            style={{ width: `${100 - homePercentage}%` }}
          />
        </div>
      </div>
    );
  };

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

  if (!playByPlayData && !matchData) {
    return (
      <div className="min-h-screen dark:bg-[#0D1117]">
        <PageHeader />
        <div className="page-padding-x py-12 text-center">
          <p className="text-lg theme-text">Match data not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
          >
            Go Back
          </button>
        </div>
        <FooterComp />
      </div>
    );
  }

  // Get final scores from play-by-play data
  const plays = playByPlayData?.plays || [];
  const lastPlay = plays[plays.length - 1];
  const homeScore =
    lastPlay?.home_score || matchData?.localteam.totalscore || 0;
  const awayScore = lastPlay?.away_score || matchData?.awayteam.totalscore || 0;

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
            <div className="flex-1 text-center">
              <p className="font-semibold text-lg md:text-xl mb-1">
                {matchData?.localteam.name || "Home Team"}
              </p>
              <p className="text-3xl md:text-4xl font-bold">{homeScore}</p>
            </div>

            <div className="flex flex-col items-center px-6">
              <span className="text-xs mb-1">
                {playByPlayData?.quarter_name || matchData?.period || "Match"}
              </span>
              {matchData?.timer && (
                <span className="text-xs opacity-90">{matchData.timer}'</span>
              )}
            </div>

            <div className="flex-1 text-center">
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
                onClick={() => handleTabClick(tab.id)}
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
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Score Progress */}
            {playByPlayData && (
              <div className="block-style">
                <h3 className="font-bold text-lg mb-4 theme-text">
                  Score Progress
                </h3>
                <StatBar
                  label="Final Score"
                  homeValue={Number(homeScore)}
                  awayValue={Number(awayScore)}
                />
              </div>
            )}

            {/* Quarter Stats */}
            {matchData && (
              <div className="block-style">
                <h3 className="font-bold text-lg mb-4 theme-text">
                  Quarter Breakdown
                </h3>
                <div className="space-y-4">
                  <StatBar
                    label="Q1"
                    homeValue={Number(matchData.localteam.q1) || 0}
                    awayValue={Number(matchData.awayteam.q1) || 0}
                  />
                  <StatBar
                    label="Q2"
                    homeValue={Number(matchData.localteam.q2) || 0}
                    awayValue={Number(matchData.awayteam.q2) || 0}
                  />
                  <StatBar
                    label="Q3"
                    homeValue={Number(matchData.localteam.q3) || 0}
                    awayValue={Number(matchData.awayteam.q3) || 0}
                  />
                  <StatBar
                    label="Q4"
                    homeValue={Number(matchData.localteam.q4) || 0}
                    awayValue={Number(matchData.awayteam.q4) || 0}
                  />
                  {(Number(matchData.localteam.ot) > 0 ||
                    Number(matchData.awayteam.ot) > 0) && (
                    <StatBar
                      label="Overtime"
                      homeValue={Number(matchData.localteam.ot) || 0}
                      awayValue={Number(matchData.awayteam.ot) || 0}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Match Info */}
            {matchData && (
              <div className="block-style">
                <h3 className="font-bold text-lg mb-4 theme-text">
                  Match Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                    <span className="text-sm text-neutral-n4 dark:text-snow-200">
                      League
                    </span>
                    <span className="font-semibold theme-text">
                      {matchData.league_name}
                    </span>
                  </div>
                  {matchData.season && (
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        Season
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.season}
                      </span>
                    </div>
                  )}
                  {matchData.venue && (
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        Venue
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.venue}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Play-by-Play Tab */}
        {activeTab === "playbyplay" && (
          <div className="block-style">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg theme-text">Play-by-Play</h3>
              {playByPlayData && (
                <span className="text-sm theme-text">
                  {playByPlayData.quarter_name}
                </span>
              )}
            </div>

            {playByPlayData && plays.length > 0 ? (
              <div className="space-y-2">
                {plays.map((play, index) => {
                  const previousPlay = index > 0 ? plays[index - 1] : undefined;
                  const pointsScored = getPointsScored(play, previousPlay);
                  const isHomeScoring = play.team_scored === "home";

                  return (
                    <div
                      key={play._id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        pointsScored > 0
                          ? "bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500"
                          : "bg-snow-100 dark:bg-[#1F2937]"
                      }`}
                    >
                      <div className="text-xs text-neutral-n4 dark:text-snow-200 min-w-[60px]">
                        Play #{play.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              isHomeScoring
                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            }`}
                          >
                            {isHomeScoring
                              ? matchData?.localteam.name || "Home"
                              : matchData?.awayteam.name || "Away"}
                          </span>
                          {pointsScored > 0 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold">
                              +{pointsScored}{" "}
                              {pointsScored === 1 ? "PT" : "PTS"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium theme-text">
                          {isHomeScoring ? "Home team" : "Away team"} scores{" "}
                          {pointsScored}{" "}
                          {pointsScored === 1 ? "point" : "points"}
                        </p>
                        {play.leader_team !== "draw" && (
                          <p className="text-xs text-neutral-n4 dark:text-snow-200 mt-1">
                            {play.leader_team === "home"
                              ? matchData?.localteam.name || "Home"
                              : matchData?.awayteam.name || "Away"}{" "}
                            leads by {play.points_difference}
                          </p>
                        )}
                        {play.leader_team === "draw" && (
                          <p className="text-xs text-neutral-n4 dark:text-snow-200 mt-1">
                            Score tied
                          </p>
                        )}
                      </div>
                      <div className="text-sm font-bold theme-text min-w-[60px] text-right">
                        {play.home_score} - {play.away_score}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-n4 dark:text-snow-200">
                  Play-by-play data not available for this match
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quarter Stats Tab */}
        {activeTab === "stats" && matchData && (
          <div className="space-y-6">
            <div className="block-style">
              <h3 className="font-bold text-lg mb-4 theme-text">
                Quarter Breakdown
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold mb-3 theme-text">
                    {matchData.localteam.name}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        1st Quarter
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.localteam.q1 || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        2nd Quarter
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.localteam.q2 || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        3rd Quarter
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.localteam.q3 || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        4th Quarter
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.localteam.q4 || 0}
                      </span>
                    </div>
                    {Number(matchData.localteam.ot) > 0 && (
                      <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                        <span className="text-sm text-neutral-n4 dark:text-snow-200">
                          Overtime
                        </span>
                        <span className="font-semibold theme-text">
                          {matchData.localteam.ot}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <span className="text-sm font-bold theme-text">
                        Total
                      </span>
                      <span className="font-bold text-lg theme-text">
                        {matchData.localteam.totalscore}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3 theme-text">
                    {matchData.awayteam.name}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        1st Quarter
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.awayteam.q1 || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        2nd Quarter
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.awayteam.q2 || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        3rd Quarter
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.awayteam.q3 || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                      <span className="text-sm text-neutral-n4 dark:text-snow-200">
                        4th Quarter
                      </span>
                      <span className="font-semibold theme-text">
                        {matchData.awayteam.q4 || 0}
                      </span>
                    </div>
                    {Number(matchData.awayteam.ot) > 0 && (
                      <div className="flex justify-between items-center p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                        <span className="text-sm text-neutral-n4 dark:text-snow-200">
                          Overtime
                        </span>
                        <span className="font-semibold theme-text">
                          {matchData.awayteam.ot}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <span className="text-sm font-bold theme-text">
                        Total
                      </span>
                      <span className="font-bold text-lg theme-text">
                        {matchData.awayteam.totalscore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <FooterComp />
    </div>
  );
};

export default BasketballMatchDetail;
