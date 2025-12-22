import StaggerChildren from "@/animations/staggerChildren";
import FooterComp from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import {
  ArrowLeftIcon,
  BellAlertIcon,
  InformationCircleIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Form/FormButton";
import { navigate } from "@/lib/router/navigate";
import { getFixtureDetails } from "@/lib/api/endpoints";
import { useParams } from "react-router-dom";
import GetTeamLogo from "@/components/common/GetTeamLogo";
import LineupBuilder from "@/features/football/components/lineupBuilder";
import FeatureComingSoon from "@/components/common/FeatureComingSoon";

const events = [
  {
    minute: 1,
    title: "Feature Coming Soon",
    text: "This feature is under development and will be available soon.",
    icon: "",
  }
];


const HeadToHeadSection = ({
  homeTeam,
  awayTeam,
}: {
  homeTeam?: any;
  awayTeam?: any;
}) => {
  const homeTeamName = homeTeam?.name ?? "";
  const awayTeamName = awayTeam?.name ?? "";
  const homeTeamId = homeTeam?.id;
  const awayTeamId = awayTeam?.id;

  const [selectedTeamSide, setSelectedTeamSide] = useState<"home" | "away">("home");
  const selectedTeamName = selectedTeamSide === "home" ? homeTeamName : awayTeamName;

  const recentMatches = [
    { date: "Aug 4, 2025", league: "Premier League", team1: homeTeamName, team1Id: homeTeamId, score: "1-3", team2: awayTeamName, team2Id: awayTeamId },
    { date: "Jun 20, 2025", league: "Premier League", team1: awayTeamName, team1Id: awayTeamId, score: "1-3", team2: homeTeamName, team2Id: homeTeamId },
    { date: "Mar 14, 2025", league: "Premier League", team1: homeTeamName, team1Id: homeTeamId, score: "1-1", team2: awayTeamName, team2Id: awayTeamId },
    { date: "Jan 24, 2025", league: "Premier League", team1: homeTeamName, team1Id: homeTeamId, score: "1-3", team2: awayTeamName, team2Id: awayTeamId },
    { date: "Nov 10, 2024", league: "Premier League", team1: awayTeamName, team1Id: awayTeamId, score: "1-3", team2: homeTeamName, team2Id: homeTeamId },
  ];

  return (
    <div className="my-8 space-y-8">
      {/* Last 5 Matches */}
      <div className="block-style">
        <h3 className="text-lg font-semibold text-neutral-n4 dark:text-snow-200 mb-6">Last 5 matches</h3>
        <div className="space-y-4">
          {recentMatches.map((match, index) => (
            <div key={index} className="flex flex-col gap-2 pb-4 dark:border-[#1F2937] last:border-0 last:pb-0">
              <div className="text-sm text-neutral-n5 dark:text-snow-200">
                {match.league} • {match.date}
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {match.team1Id ? (
                    <GetTeamLogo teamId={match.team1Id} alt={match.team1} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <img src={'/loading-state/shield.svg'} alt={match.team1} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  )}
                  <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">{match.team1}</span>
                </div>
                <div className="px-4 py-1.5 bg-snow-100 dark:bg-[#161B22] rounded-lg border border-snow-200 dark:border-[#1F2937]">
                  <span className="font-semibold text-sm text-neutral-n4 dark:text-snow-200">{match.score}</span>
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                  <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate text-right">{match.team2}</span>
                  {match.team2Id ? (
                    <GetTeamLogo teamId={match.team2Id} alt={match.team2} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <img src={'/loading-state/shield.svg'} alt={match.team2} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Results */}
      <div className="block-style">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-n4 dark:text-snow-200">Total Results</h3>
          <span className="text-sm text-neutral-n5 dark:text-snow-200">18 Matches</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Manchester City Stats */}
          <div className="flex flex-col items-center">
            {homeTeamId ? (
              <GetTeamLogo teamId={homeTeamId} alt={homeTeamName} className="w-16 h-16 rounded-full object-cover mb-3" />
            ) : (
              <img src={'/loading-state/shield.svg'} alt={homeTeamName} className="w-16 h-16 rounded-full object-cover mb-3" />
            )}
            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 mb-4">{homeTeamName}</span>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              <div className="px-3 py-1.5 bg-snow-100 dark:bg-[#161B22] rounded-lg border border-snow-200 dark:border-[#1F2937]">
                <span className="text-sm font-medium text-neutral-n4 dark:text-snow-200">12 Wins</span>
              </div>
              <div className="px-3 py-1.5 bg-snow-100 dark:bg-[#161B22] rounded-lg border border-snow-200 dark:border-[#1F2937]">
                <span className="text-sm font-medium text-neutral-n4 dark:text-snow-200">3 Draws</span>
              </div>
              <div className="px-3 py-1.5 bg-snow-100 dark:bg-[#161B22] rounded-lg border border-snow-200 dark:border-[#1F2937]">
                <span className="text-sm font-medium text-neutral-n4 dark:text-snow-200">3 Losses</span>
              </div>
            </div>
            <span className="text-sm text-neutral-n5 dark:text-snow-200">12 wins (67%)</span>
          </div>

          {/* Arsenal Stats */}
          <div className="flex flex-col items-center">
            {awayTeamId ? (
              <GetTeamLogo teamId={awayTeamId} alt={awayTeamName} className="w-16 h-16 rounded-full object-cover mb-3" />
            ) : (
              <img src={'/loading-state/shield.svg'} alt={awayTeamName} className="w-16 h-16 rounded-full object-cover mb-3" />
            )}
            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 mb-4">{awayTeamName}</span>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-sm text-neutral-n5 dark:text-snow-200">3 draws (17%)</span>
              <span className="text-sm text-neutral-n5 dark:text-snow-200">3 wins (17%)</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="w-full h-5 bg-snow-100 dark:bg-[#161B22] rounded-lg overflow-hidden flex">
          <div className="h-full bg-brand-primary flex items-center justify-center" style={{ width: "67%" }}>
            <span className="text-xs font-semibold text-white">67%</span>
          </div>
          <div className="h-full bg-neutral-n4 dark:bg-snow-200 flex items-center justify-center" style={{ width: "17%" }}>
            <span className="text-xs font-semibold text-neutral-n4 dark:text-snow-200">17%</span>
          </div>
          <div className="h-full bg-orange-500 flex items-center justify-center" style={{ width: "17%" }}>
            <span className="text-xs font-semibold text-white">17%</span>
          </div>
        </div>
      </div>

      {/* Recent Form */}
      <div className="block-style">
        <h3 className="text-lg font-semibold text-neutral-n4 dark:text-snow-200 mb-4">Recent form</h3>
        
        {/* Team Selection Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedTeamSide("home")}
            className={`px-3 sm:px-4 flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedTeamSide === "home"
                ? "bg-brand-primary text-white"
                : "bg-white dark:bg-[#161B22] text-neutral-n5 dark:text-snow-200 border border-snow-200 dark:border-[#1F2937]"
            }`}
          >
            {homeTeamName}
          </button>
          <button
            onClick={() => setSelectedTeamSide("away")}
            className={`px-3 sm:px-4 flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedTeamSide === "away"
                ? "bg-brand-primary text-white"
                : "bg-white dark:bg-[#161B22] text-neutral-n5 dark:text-snow-200 border border-snow-200 dark:border-[#1F2937]"
            }`}
          >
            {awayTeamName}
          </button>
        </div>

        {/* Match List */}
        <div className="space-y-6 sm:space-y-8">
          {recentMatches.map((match, index) => {
            const selectedTeamIsTeam1 = match.team1 === selectedTeamName;
            const [team1Score, team2Score] = match.score.split("-").map(Number);
            
            // Determine result from selected team's perspective
            let resultFromSelectedTeam: "win" | "loss" | "draw";
            if (team1Score === team2Score) {
              resultFromSelectedTeam = "draw";
            } else if (selectedTeamIsTeam1) {
              resultFromSelectedTeam = team1Score > team2Score ? "win" : "loss";
            } else {
              resultFromSelectedTeam = team2Score > team1Score ? "win" : "loss";
            }
            
            let resultColor = "";
            if (resultFromSelectedTeam === "draw") {
              resultColor = "bg-snow-100 dark:bg-[#161B22] border-snow-200 dark:border-[#1F2937] text-neutral-n4 dark:text-snow-200";
            } else if (resultFromSelectedTeam === "win") {
              resultColor = "bg-ui-success text-white border-ui-success";
            } else {
              resultColor = "bg-ui-negative text-white border-ui-negative";
            }

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
              >
                <div className="text-sm text-neutral-n5 dark:text-snow-200 sm:min-w-[160px]">
                  <span className="font-medium text-sm text-black dark:text-snow-200">{match.league}</span>
                  <span className="sm:hidden"> · </span>
                  <span className="sm:hidden">{match.date}</span>
                  <div className="hidden sm:block">{match.date}</div>
                </div>

                <div className="flex w-full sm:flex-1 sm:items-center">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {selectedTeamIsTeam1 ? (
                    <>
                      {match.team1Id ? (
                        <GetTeamLogo teamId={match.team1Id} alt={match.team1} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <img src={'/loading-state/shield.svg'} alt={match.team1} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                      )}
                      <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">{match.team1}</span>
                    </>
                  ) : (
                    <>
                      {match.team2Id ? (
                        <GetTeamLogo teamId={match.team2Id} alt={match.team2} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <img src={'/loading-state/shield.svg'} alt={match.team2} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                      )}
                      <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">{match.team2}</span>
                    </>
                  )}

                  </div>

                  <div className="mx-2 sm:mx-4 flex-shrink-0">
                    <div className={`px-3 sm:px-4 py-1.5 rounded-lg border font-semibold text-sm ${resultColor}`}>
                      {match.score}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 justify-end">
                  {selectedTeamIsTeam1 ? (
                    <>
                      <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate text-right">{match.team2}</span>
                      {match.team2Id ? (
                        <GetTeamLogo teamId={match.team2Id} alt={match.team2} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <img src={'/loading-state/shield.svg'} alt={match.team2} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                      )}
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate text-right">{match.team1}</span>
                      {match.team1Id ? (
                        <GetTeamLogo teamId={match.team1Id} alt={match.team1} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <img src={'/loading-state/shield.svg'} alt={match.team1} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                      )}
                    </>
                  )}
                </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics over 8 matches */}
      <div className="block-style">
        <h3 className="text-lg font-semibold text-neutral-n4 dark:text-snow-200 mb-4">Statistics over 8 matches</h3>
        <div className="w-full h-12 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-lg flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {homeTeamId ? (
              <GetTeamLogo teamId={homeTeamId} alt={homeTeamName} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <img src={'/loading-state/shield.svg'} alt={homeTeamName} className="w-8 h-8 rounded-full object-cover" />
            )}
            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200">{homeTeamName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200">{awayTeamName}</span>
            {awayTeamId ? (
              <GetTeamLogo teamId={awayTeamId} alt={awayTeamName} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <img src={'/loading-state/shield.svg'} alt={awayTeamName} className="w-8 h-8 rounded-full object-cover" />
            )}
          </div>
        </div>
        <div className="flex flex-col mt-5 gap-4">
              <p className="flex-1 md:hidden text-center theme-text flex items-center justify-center">
                  Ball Possession
                </p>
              <div className="flex w-full h-9 overflow-hidden rounded-3xl">
                <p className="flex-64 md:flex-2 h-full pl-6 text-left text-white bg-brand-primary flex items-center">
                  64%
                </p>
                <p className="flex-1 hidden md:flex h-full text-center theme-text  items-center justify-center">
                  Ball Possession
                </p>
                <p className="flex-36 md:flex-2 h-full pr-6 text-right bg-brand-secondary flex items-center justify-end">
                  36%
                </p>
              </div>

              {[
                {
                  label: "Total Shots",
                  home: "64%",
                  away: "36%",
                  homeClass: "theme-text",
                  awayClass: "bg-brand-secondary",
                },
                {
                  label: "Shots On Goal",
                  home: "64%",
                  away: "36%",
                  homeClass: "text-white bg-brand-primary",
                  awayClass: "",
                },
                {
                  label: "Total Passes",
                  home: "64%",
                  away: "36%",
                  homeClass: "",
                  awayClass: "bg-brand-secondary",
                },
                {
                  label: "Pass Accuracy",
                  home: "64%",
                  away: "36%",
                  homeClass: "",
                  awayClass: "bg-brand-secondary",
                },
                {
                  label: "Yellow Cards",
                  home: "64%",
                  away: "36%",
                  homeClass: "text-white bg-brand-primary",
                  awayClass: "",
                },
                {
                  label: "Red Cards",
                  home: "64%",
                  away: "36%",
                  homeClass: "",
                  awayClass: "",
                },
                {
                  label: "Corners",
                  home: "64%",
                  away: "36%",
                  homeClass: "text-white bg-brand-primary",
                  awayClass: "bg-brand-secondary",
                },
                {
                  label: "Fouls",
                  home: "64%",
                  away: "36%",
                  homeClass: "text-white bg-brand-primary",
                  awayClass: "",
                },
                {
                  label: "Offsides",
                  home: "64%",
                  away: "36%",
                  homeClass: "",
                  awayClass: "bg-brand-secondary",
                },
                {
                  label: "Saves",
                  home: "64%",
                  away: "36%",
                  homeClass: "",
                  awayClass: "bg-brand-secondary",
                },
              ].map((stat, idx) => (
                <div
                  key={`${stat.label}-${idx}`}
                  className="flex h-9 justify-between"
                >
                  <p
                    className={`h-full px-3 rounded text-center flex items-center ${stat.homeClass}`}
                  >
                    {stat.home}
                  </p>
                  <p className="h-full text-center theme-text flex items-center justify-center">
                    {stat.label}
                  </p>
                  <p
                    className={`h-full px-3 rounded text-center flex items-center justify-end ${stat.awayClass}`}
                  >
                    {stat.away}
                  </p>
                </div>
              ))}
            </div>
      </div>
    </div>
  );
};

export const gameInfo = () => {
  const tabs = [
    { id: "timeline", label: "Timeline" },
    { id: "overview", label: "Overview" },
    { id: "commentary", label: "Commentary" },
    { id: "lineup", label: "Line up" },
    { id: "statistics", label: "Statistics" },
    { id: "headtohead", label: "Head To Head" },
    { id: "standings", label: "Standings" },
  ];
  
  // Get initial tab from URL hash (fallback to "overview")
  const getTabFromHash = () => {
    if (typeof window === "undefined") return "overview";
    const hash = window.location.hash.replace("#", "");
    return tabs.find((tab) => tab.id === hash) ? hash : "overview";
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [fixtureDetails, setFixtureDetails] = useState<any>(null);
  const { fixtureId } = useParams<{ fixtureId: string }>();

  const getGroupedGoalsByTeam = (teamKey: "localteam" | "visitorteam") => {
    const goals = (fixtureDetails?.goals ?? []) as Array<{ team?: string; player?: string; minute?: string | number }>;
    const byPlayer = new Map<string, { player: string; minutes: Array<string | number> }>();

    goals
      .filter((g) => g?.team === teamKey)
      .forEach((g) => {
        const player = (g.player ?? "").trim();
        if (!player) return;
        const current = byPlayer.get(player);
        if (current) {
          current.minutes.push(g.minute ?? "");
        } else {
          byPlayer.set(player, { player, minutes: [g.minute ?? ""] });
        }
      });

    const toMinuteNumber = (m: string | number) => {
      const n = Number(String(m).replace(/\D+/g, ""));
      return Number.isFinite(n) ? n : 0;
    };

    return Array.from(byPlayer.values())
      .map((item) => ({
        player: item.player,
        minutes: item.minutes
          .map((m) => String(m).trim())
          .filter(Boolean)
          .sort((a, b) => toMinuteNumber(a) - toMinuteNumber(b)),
      }))
      .sort((a, b) => toMinuteNumber(a.minutes[0] ?? 0) - toMinuteNumber(b.minutes[0] ?? 0));
  };

  useEffect(() => {
    const fetchFixtureDetails = async () => {
      if (fixtureId) {
        try {
          const response = await getFixtureDetails(fixtureId);
          setFixtureDetails(response.responseObject.item[0]);
        } catch (error) {
          console.error("Error fetching fixture details:", error);
        }
      }
    };

    fetchFixtureDetails();
  }, [fixtureId]);

  // Update tab when hash changes (e.g., browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const foundTab = tabs.find((tab) => tab.id === hash);
      setActiveTab(foundTab ? hash : "overview");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [tabs]);

  // Update URL hash when tab changes (without navigation)
  const handleTabClick = (tabId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(tabId);
    // Update hash without triggering navigation, preserving current pathname
    const newUrl = `${window.location.pathname}${window.location.search}#${tabId}`;
    window.history.replaceState(null, "", newUrl);
  };

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />
      <div className="relative isolate overflow-hidden page-padding-x bg-brand-primary py-1 w-full">
        <div
          className="absolute blur-sm inset-0 pointer-events-none z-0 opacity-99"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--gameinfo-stripe-color) 0px, var(--gameinfo-stripe-color) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px)",
          }}
        />
        {/* Floating SVG background */}
        <img
          src="./icons/football-line-1.svg"
          className="absolute w-60 md:w-150 invert sepia opacity-8 pointer-events-none z-[1] float-edges"
          alt=""
          style={{ animation: "float-around-edges 12s linear infinite" }}
        />
        {/* Foreground content */}
        <div  onClick={() => navigate(-1)} className="relative cursor-pointer px-3 z-[2] grid grid-cols-3 items-center">
          <div className="flex gap-4">
            <ArrowLeftIcon className="text-white h-5" />
            <p className="text-white hidden md:block">Back</p>
          </div>

          <div className="bg-brand-secondary md:opacity-100 opacity-0 font-semibold mb-2 text items-center text-white py-1.5 px-4 rounded w-fit mx-auto">
            55:21'
          </div>

          <div className="flex gap-4 justify-end">
            {/* <Icons.Notification2Line className="text-white h-5" /> */}
            <BellAlertIcon className="text-white h-5" />
            <ShareIcon className="text-white h-5" />
          </div>
        </div>

        {fixtureDetails && (
          <div className="md:hidden px-3 mt-2 text-white">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1 flex items-center gap-2">
                <GetTeamLogo
                  teamId={fixtureDetails.localteam.id}
                  alt={fixtureDetails.localteam.name}
                  className="h-9 w-fit shrink-0"
                />
                <p className="min-w-0 truncate text-[13px] font-semibold">
                  {fixtureDetails.localteam.name}
                </p>
              </div>

              <p className="shrink-0 text-[11px] bg-brand-secondary px-2 py-0.5 rounded">
                {fixtureDetails.time}
              </p>

              <div className="min-w-0 flex-1 flex items-center justify-end gap-2">
                <p className="min-w-0 truncate text-[13px] font-semibold text-right">
                  {fixtureDetails.visitorteam.name}
                </p>
                <GetTeamLogo
                  teamId={fixtureDetails.visitorteam.id}
                  alt={fixtureDetails.visitorteam.name}
                  className="h-9 w-fit shrink-0"
                />
              </div>
            </div>

            <div className="mt-2 flex flex-col items-center">
              <div className="flex justify-center items-center gap-3 leading-none tabular-nums tall-font text-[56px]">
                <p className="leading-none">{fixtureDetails.localteam.score}</p>
                <p className="text-[32px] leading-none">-</p>
                <p className="leading-none">{fixtureDetails.visitorteam.score}</p>
              </div>
              <p className="mt-1 text-[11px] opacity-90">{fixtureDetails.status}</p>
            </div>
          </div>
        )}

        <div className="hidden md:grid md:mt-5 mb-5 px-3 grid-cols-3 items-start text-white">
          {/* Home team (right aligned) */}
          {fixtureDetails && (
            <>
              <div className="flex items-center md:items-end flex-col">
                <div className="flex flex-col-reverse sz-7 md:flex-row md:mr-2 md:text-[20px] md:font-light md:justify-end items-center font-semibold md:gap-3">
                  <p className="text-center sz-4 font-bold">{fixtureDetails.localteam.name}</p>
                  <GetTeamLogo teamId={fixtureDetails.localteam.id} alt={fixtureDetails.localteam.name} className="w-fit h-12" />
                </div>
                <div className="md:flex gap-3 hidden items-start justify-end mt-1">
                  <StaggerChildren className="flex font-light text-[12px] flex-col text-right">
                    {getGroupedGoalsByTeam("localteam").map((goal, index: number) => (
                      <p key={`${goal.player}-${index}`}>
                        {goal.player} {goal.minutes.map((m) => `${m}'`).join(", ")}
                      </p>
                    ))}
                  </StaggerChildren>
                  <img
                    src="./icons/football-line-1.svg"
                    className=" w-3 md:w-4 invert sepia"
                    alt=""
                  />
                </div>
              </div>

              {/* Score line (always centered) */}
              <div className="flex-col flex">
                <p className="text-center block md:hidden bg-brand-secondary/70 w-fit mx-auto px-2">{fixtureDetails.time}</p>
                <div className="flex text-[56px] md:text-[80px] tall-font justify-center items-center gap-3 leading-none tabular-nums">
                  <p className="leading-none">{fixtureDetails.localteam.score}</p>
                  <p>-</p>
                  <p className="leading-none">{fixtureDetails.visitorteam.score}</p>
                </div>
                <p className="text-center block md:hidden">{fixtureDetails.status}</p>
              </div>

              {/* Away team (left aligned) */}
              <div className="flex items-center md:items-start flex-col">
                <div className="flex flex-col sz-7 md:flex-row md:ml-2 md:text-[20px] md:font-light md:justify-start items-center font-semibold md:gap-3">
                  <GetTeamLogo teamId={fixtureDetails.visitorteam.id} alt={fixtureDetails.visitorteam.name} className="w-fit h-12" />
                  <p className="text-center sz-4 font-bold">{fixtureDetails.visitorteam.name}</p>
                </div>

            <div className="md:flex hidden gap-3 justify-start mt-1">
              <img
                src="./icons/football-line-1.svg"
                className=" w-4 invert sepia"
                alt=""
              />
              <StaggerChildren className="flex font-light sz-8 flex-col text-left">
                {getGroupedGoalsByTeam("visitorteam").map((goal, index: number) => (
                  <p key={`${goal.player}-${index}`}>
                    {goal.player} {goal.minutes.map((m) => `${m}'`).join(", ")}
                  </p>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </>
          )}
        </div>


        {fixtureDetails && (
          <div className="flex text-white md:hidden mb-7 gap-5">
            <div className="flex flex-1 gap-3 items-start justify-end mt-1">
              <StaggerChildren className="flex font-light text-[12px] flex-col text-right">
                {getGroupedGoalsByTeam("localteam").map((goal, index: number) => (
                  <p key={`${goal.player}-${index}`}>
                    {goal.player} {goal.minutes.map((m) => `${m}'`).join(", ")}
                  </p>
                ))}
              </StaggerChildren>
              <img
                src="./icons/football-line-1.svg"
                className=" w-3 md:w-4 invert sepia"
                alt=""
              />
            </div>
            <div className="flex gap-3 flex-1 items-start justify-start mt-1">
              <img
                src="./icons/football-line-1.svg"
                className=" w-3 md:w-4 invert sepia"
                alt=""
              />
              <StaggerChildren className="flex font-light text-[12px] flex-col text-left">
                {getGroupedGoalsByTeam("visitorteam").map((goal, index: number) => (
                  <p key={`${goal.player}-${index}`}>
                    {goal.player} {goal.minutes.map((m) => `${m}'`).join(", ")}
                  </p>
                ))}
              </StaggerChildren>
            </div>
          </div>
        )}

        {fixtureDetails && (
          <div className="md:flex-row flex flex-col mt-4 md:mt-0 sz-8 items-center  text-white mb-3 justify-center  md:gap-10">
            <div className="flex gap-2 items-center">
              <img
                src="/assets/icons/Football/League/Rectangle 6.png"
                className="w-4 invert sepia"
                alt=""
              />
              <p>{fixtureDetails.league_name}, Week {fixtureDetails.week}</p>
            </div>
            {fixtureDetails.referee.name && (
              <div className="flex gap-2 items-center">
                <img
                  src="./icons/Whistle.svg"
                  className=" w-4 invert sepia"
                  alt=""
                />
                <p>{fixtureDetails.referee.name}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex z-10 h-12 w-full overflow-y-hidden overflow-x-auto bg-brand-p3/30 dark:bg-snow-200 backdrop-blur-2xl cursor-pointer sticky top-0 hide-scrollbar justify-start md:justify-center">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0 md:mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => handleTabClick(tab.id, e)}
              className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-orange-500 font-medium"
                  : "text-gray-600 dark:text-neutral-n3 hover:text-gray-800 dark:text-gray-400 dark:hover:text-brand-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="page-padding-x">
        {/* --------------------------- overview -------------------------------------- */}
        {activeTab === "overview" && (
          <div className="flex  mt-6 mb-20 flex-col gap-10">
            <div className="sz-8 flex flex-col md:flex-row gap-7">
              <div className="grid grid-cols-1 md:grid-cols-2 justify-between flex-5 gap-4 block-style">
                <img src="/icons/stadium.png" className="" alt="" />

                <StaggerChildren className="flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/calendar-line-1.svg"
                      className=" w-4 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Date:</p>
                      <p className="theme-text">
                        {/* Try to use a formatted date if available */}
                        {fixtureDetails?.date 
                          ? new Date(fixtureDetails.date).toLocaleString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/icons/Football/League/Rectangle 6.png"
                      className="w-5 h-5 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Competition:</p>
                      <p className="theme-text">
                        {fixtureDetails?.league_name 
                          ? `${fixtureDetails.league_name}${fixtureDetails?.country ? `, ${fixtureDetails.country}` : ""}${fixtureDetails?.round ? `, ${fixtureDetails.round}` : ""}`
                          : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/Whistle.svg"
                      className=" w-4 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Referee:</p>
                      <p className="theme-text">
                        {fixtureDetails?.referee?.name ?? "--"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/team-line-1.svg"
                      className="w-5 h-5 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Attendance:</p>
                      <p className="theme-text">
                        {fixtureDetails?.attendance 
                          ? fixtureDetails.attendance.toLocaleString()
                          : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/soccer-field-1.svg"
                      className="w-5 h-5 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Stadium:</p>
                      <p className="theme-text">
                        {fixtureDetails?.venue 
                          ? `${fixtureDetails.venue}${fixtureDetails?.venue_city ? `, ${fixtureDetails.venue_city}` : ""}${fixtureDetails?.country ? `, ${fixtureDetails.country}` : ""}`
                          : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/soccer-field-1.svg"
                      className="w-5 h-5 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Surface:</p>
                      <p className="theme-text">
                        {fixtureDetails?.surface ?? "Grass"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/location.svg"
                      className="w-5 h-5 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Location:</p>
                      <p className="theme-text">
                        {fixtureDetails?.venue_address 
                          ? fixtureDetails.venue_address
                          : fixtureDetails?.venue_city || "--"}
                      </p>
                    </div>
                  </div>
                </StaggerChildren>
              </div>

              <div className="flex flex-2 gap-2 flex-col block-style">
                <div className="flex items-center gap-2">
                  <img
                    src="/icons/calendar-line-1.svg"
                    className=" w-4 theme-icon"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-m6">Date:</p>
                    <p className="theme-text">
                      {fixtureDetails?.date 
                        ? new Date(fixtureDetails.date).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : "--"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src="/loading-state/shield.svg"
                    className="w-5 h-5 theme-icon"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-m6">Competition:</p>
                    <p className="theme-text">
                      {fixtureDetails?.league_name 
                        ? `${fixtureDetails.league_name}${fixtureDetails?.country ? `, ${fixtureDetails.country}` : ""}${fixtureDetails?.round ? `, ${fixtureDetails.round}` : ""}`
                        : "--"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src="/icons/Whistle.svg"
                    className=" w-4 theme-icon"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-m6">Referee:</p>
                    <p className="theme-text">
                      {fixtureDetails?.referee?.name ?? "--"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src="/icons/team-line-1.svg"
                    className="w-5 h-5 theme-icon"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-m6">Attendance:</p>
                    <p className="theme-text">
                      {fixtureDetails?.attendance 
                        ? fixtureDetails.attendance.toLocaleString()
                        : "--"}
                    </p>
                  </div>
                </div>

                {/* If you want to show Attendance twice, keep this, or remove if redundant */}
              </div>
            </div>

            {/* -------------------------------------------------------------------------------- */}

            {/* -------------------------------------------------------------------------------------------------- */}

            <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
              <div className="flex relative flex-col gap-2 block-style min-h-[200px] items-center justify-center">
                <div className="flex gap-1 mb-1">
                  <p className="theme-text">Team Comparison</p>
                  <InformationCircleIcon className="w-4 theme-text opacity-45 cursor-pointer" />
                </div>
                <div className="flex flex-col items-center justify-center flex-1">
                  <span className="text-neutral-m6 font-medium text-center">
                    Feature coming soon..
                  </span>
                </div>
              </div>

              <div className="flex relative flex-col gap-2 block-style min-h-[200px] items-center justify-center">
                <div className="flex gap-1 mb-1">
                  <p className="theme-text">Sidelined</p>
                  <InformationCircleIcon className="w-4 theme-text opacity-45 cursor-pointer" />
                </div>
                <div className="flex flex-col items-center justify-center flex-1">
                  <span className="text-neutral-m6 font-medium text-center">
                    Feature coming soon..
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------overview end------------------------------------------------------- */}

        {/* -------------------------------------------commentary---------------------------------------------------------------- */}

        {activeTab === "commentary" && (
          <div className=" my-4 flex flex-col">
            <div className="flex gap-5 mb-5">
              <Button
                label={fixtureDetails?.localteam?.name ?? ""}
                className="btn-primary text-sm text-white border-brand-primary"
              />

              <Button
                label={fixtureDetails?.visitorteam?.name ?? ""}
                className="btn-outline text-sm bg-transparent text-neutral-m6 border-neutral-m6 hover:bg-brand-secondary hover:text-white hover:border-brand-secondary"
              />
            </div>
            <div className="flex flex-col">
              {events.map((event, idx) => (
                <div key={idx} className="flex gap-5 md:gap-12">
                  {/* Left: Minute + dotted line */}
                  <div className="flex flex-col items-center">
                    <div className="bg-snow-200 p-2">
                      <span className="text-sm font-medium">
                        {event.minute}'
                      </span>
                    </div>
                    {/* line continues only if not last item */}
                    {idx !== events.length - 1 && (
                      <div className="flex-1 border-l-2 border-dashed border-snow-200"></div>
                    )}
                  </div>

                  {/* Right: Event card */}
                  <div className="flex-1 block-style mb-12 w-full">
                    <p className="font-semibold theme-text mb-3">
                      {event.title}
                    </p>
                    <p className="text-xs md:text-sm dark:text-snow-200 text-neutral-n3 mb-2">
                      {event.text}
                    </p>
                    <div className="py-4 block-style items-center flex justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src="/loading-state/player.svg"
                          alt=""
                          className="h-5 rounded-full"
                        />
                        <p className="theme-text sz-7">Tikianaly</p>
                      </div>
                      <div className="">{event.icon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------comentary end------------------------------------------------------------------- */}

        {/* -----------------------------------------------line up------------------------------------------------------- */}

        {activeTab === "lineup" && (
          <LineupBuilder
            localteam={fixtureDetails?.lineups?.localteam}
            visitorteam={fixtureDetails?.lineups?.visitorteam}
            homeTeamName={fixtureDetails?.localteam?.name}
            awayTeamName={fixtureDetails?.visitorteam?.name}
          />
        )}

        {/* ----------------------------------------------------line up end------------------------------------------------------- */}

        {/* -------------------------------------------------------statistics-------------------------------------------------- */}

        {activeTab === "statistics" && (
        <div className="my-8">
        <FeatureComingSoon />
        </div>
        //   <div className="block my-8">
        //     <p className="sz-3">Match Statistics</p>
        //     <div className="w-full flex text-sm bg-brand-p4 mb-7 py-2 px-5 justify-between">
        //       <div className="flex gap-3 items-center">
        //         <p className="sz-6">Manchester City</p>
        //         <img
        //           src="/assets/icons/Football/Team/Manchester City.png"
        //           alt=""
        //           className="h-10"
        //         />
        //       </div>

        //       <div className="flex gap-3 items-center">
        //         <img
        //           src="/assets/icons/Football/Team/Arsenal.png"
        //           alt=""
        //           className="h-10"
        //         />
        //         <p className="sz-6">Arsenal</p>
        //       </div>
        //     </div>

        //     <div className="flex flex-col gap-4">
        //       <p className="flex-1 md:hidden text-center theme-text flex items-center justify-center">
        //           Ball Possession
        //         </p>
        //       <div className="flex w-full h-9 overflow-hidden rounded-3xl">
        //         <p className="flex-64 md:flex-2 h-full pl-6 text-left text-white bg-brand-primary flex items-center">
        //           64%
        //         </p>
        //         <p className="flex-1 hidden md:flex h-full text-center theme-text  items-center justify-center">
        //           Ball Possession
        //         </p>
        //         <p className="flex-36 md:flex-2 h-full pr-6 text-right bg-brand-secondary flex items-center justify-end">
        //           36%
        //         </p>
        //       </div>

        //       {[
        //         {
        //           label: "Total Shots",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "theme-text",
        //           awayClass: "bg-brand-secondary",
        //         },
        //         {
        //           label: "Shots On Goal",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "text-white bg-brand-primary",
        //           awayClass: "",
        //         },
        //         {
        //           label: "Total Passes",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "",
        //           awayClass: "bg-brand-secondary",
        //         },
        //         {
        //           label: "Pass Accuracy",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "",
        //           awayClass: "bg-brand-secondary",
        //         },
        //         {
        //           label: "Yellow Cards",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "text-white bg-brand-primary",
        //           awayClass: "",
        //         },
        //         {
        //           label: "Red Cards",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "",
        //           awayClass: "",
        //         },
        //         {
        //           label: "Corners",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "text-white bg-brand-primary",
        //           awayClass: "bg-brand-secondary",
        //         },
        //         {
        //           label: "Fouls",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "text-white bg-brand-primary",
        //           awayClass: "",
        //         },
        //         {
        //           label: "Offsides",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "",
        //           awayClass: "bg-brand-secondary",
        //         },
        //         {
        //           label: "Saves",
        //           home: "64%",
        //           away: "36%",
        //           homeClass: "",
        //           awayClass: "bg-brand-secondary",
        //         },
        //       ].map((stat, idx) => (
        //         <div
        //           key={`${stat.label}-${idx}`}
        //           className="flex h-9 justify-between"
        //         >
        //           <p
        //             className={`h-full px-3 rounded text-center flex items-center ${stat.homeClass}`}
        //           >
        //             {stat.home}
        //           </p>
        //           <p className="h-full text-center theme-text flex items-center justify-center">
        //             {stat.label}
        //           </p>
        //           <p
        //             className={`h-full px-3 rounded text-center flex items-center justify-end ${stat.awayClass}`}
        //           >
        //             {stat.away}
        //           </p>
        //         </div>
        //       ))}
        //     </div>
        //   </div>
        )}

        {/* -------------------------------------------------------statistics emd-------------------------------------------------- */}

        {/* -------------------------------------------------------headtohead-------------------------------------------------------- */}

        {activeTab === "headtohead" && (
          <HeadToHeadSection homeTeam={fixtureDetails?.localteam} awayTeam={fixtureDetails?.visitorteam} />
        )}

        {/* -------------------------------------------------------headtohead end-------------------------------------------------------- */}

        {/* -------------------------------------------------------standings-------------------------------------------------------- */}
        {activeTab === "standings" && (
          <div className="my-8">
            <FeatureComingSoon />
          </div>
        )}
        {/* -------------------------------------------------------standings end-------------------------------------------------------- */}

        {/* --------------------------------------------------------timeline--------------------------------------------------------------- */}

        {activeTab === "timeline" && (
          <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
            <div className="flex flex-2 gap-3 flex-col edge-lighting block-style relative">
              <FeatureComingSoon title="Sidelined" />
            </div>

            {/* ----------------- */}

            <div className="block p-0 flex-5 block-style">
              <StaggerChildren className="flex divide-snow-200 dark:divide-snow-100/10 divide-y flex-col">
                <div className="flex px-4 py-3 items-center">
                  <p className="flex-1/11 text-neutral-m6">21'</p>
                  <span className="flex-4/11"></span>
                  <p className="theme-text font-bold text-center flex-2/11">
                    1 - 0
                  </p>
                  <div className="flex items-center flex-4/11 justify-start  gap-4">
                    <div className="w-4 h-5 bg-ui-pending"></div>
                    <div className="flex flex-col">
                      <p className="theme-text">E. Haaland</p>
                      <p className="text-neutral-m6">Silva</p>
                    </div>
                  </div>
                </div>

                <div className="flex px-4 py-3 items-center">
                  <p className="flex-1/11 text-neutral-m6">21'</p>
                  <div className="flex items-center flex-4/11 justify-end  gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                      <p className="theme-text text-right">E. Haaland</p>
                      </div>
                       
                    </div>
                    <div className="w-4 h-5 bg-ui-pending"></div>
                  </div>
                  <p className="theme-text font-bold text-center flex-2/11">
                    1 - 0
                  </p>
                  <span className="flex-4/11"></span>
                </div>
                

                <div className="flex px-4 py-3 items-center">
                  <p className="flex-1/11 text-neutral-m6">21'</p>
                  <div className="flex items-center flex-4/11 justify-end  gap-4">
                    <div className="flex text-right flex-col">
                      <p className="theme-text">E. Haaland</p>
                    </div>
                    <div className="block">
                      {/* <p className="text-[8px] font-semibold theme-text">PEN</p> */}
                      <img
                        src="/icons/goal-missed.svg"
                        className="w-5 theme-icon"
                        alt=""
                      />
                    </div>
                  </div>
                  <p className="theme-text font-bold text-center flex-2/11">
                    1 - 0
                  </p>
                  <span className="flex-4/11"></span>
                </div>

                <div className="relative flex px-4 py-3 items-center">
                  {/* Goal effect text */}
                  <div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center z-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    <span className="text-[64px] md:text-[120px] font-extrabold uppercase tracking-widest text-snow-200 opacity-8  animate-goal-scroll whitespace-nowrap">
                      GOOOAAAALLL!!!
                    </span>
                  </div>
                  {/* Content above the effect */}
                  <p className="flex-1/11 text-neutral-m6 z-10">41'</p>
                  <div className="flex items-center flex-4/11 justify-end gap-4 z-10">
                  <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <img
                        src="/icons/football-line-1.svg"
                        className="w-4 theme-icon"
                        alt=""
                      />
                      <p className="theme-text text-right">E. Haaland</p>
                      </div>
                       <div className="flex flex-col">
                      <div className="flex items-center gap-2 justify-end"><img
                        src="/icons/assist.svg"
                        className="w-3 text-neutral-m6 theme-icon"
                        alt=""
                      />
                      <p className="text-neutral-m6">Silva</p>
                      </div>
                      </div>
                    </div>
                    
                  </div>
                  <p className="theme-text font-bold text-center flex-2/11 z-10">
                    2 - 0
                  </p>
                  <span className="flex-4/11 z-10"></span>
                </div>

                <div className="flex px-4 py-3 bg-snow-100 dark:bg-neutral-n4 items-center">
                  <p className="flex-1/11 text-neutral-m6">45+5'</p>
                  <div className="flex items-center flex-4/11 justify-end  gap-4">
                    <div className="flex text-right flex-col">
                      <p className="theme-text">Half Time</p>
                    </div>
                    <div className="block">
                      <img
                        src="./icons/Whistle.svg"
                        className="w-4 theme-icon"
                        alt=""
                      />
                    </div>
                  </div>
                  <p className="theme-text font-bold text-center flex-2/11">
                    1 - 0
                  </p>
                  <span className="flex-4/11"></span>
                </div>
              </StaggerChildren>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------timeline end--------------------------------------------------------------- */}
      </div>
      <FooterComp />
    </div>
  );
};
export default gameInfo;
