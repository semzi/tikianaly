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
import LineupBuilder from "@/components/football/lineupBuilder";

const events = [
  {
    minute: 26,
    title: "Yellow card",
    text: "Do you want me to also set it so only the top border is dotted (like a timeline divider), or should the whole card be dotted like in your screenshot? Do you want me to also set it so only the top border is dotted (like a timeline divider), or should the whole card be dotted like in your screenshot?",
    icon: "🟨",
  },
  {
    minute: 27,
    title: "Goal",
    text: "Malmö 3, Sigma Olomouc 0. Lasse Berg Johnsen (Malmö) converts the penalty with a right footed shot to the centre of the goal.",
    icon: "⚽",
  },
  {
    minute: 28,
    title: "Substitution",
    text: "Malmö, Arnór Sigurdsson replaces Taha Ali.",
    icon: "🔻",
  },
];


const HeadToHeadSection = () => {
  const [selectedTeam, setSelectedTeam] = useState<"Manchester City" | "Arsenal">("Manchester City");

  const recentMatches = [
    { date: "Aug 4, 2025", league: "Premier League", team1: "Manchester City", team1Logo: "/assets/icons/Football/Team/Manchester City.png", score: "1-3", team2: "Arsenal", team2Logo: "/assets/icons/Football/Team/Arsenal.png" },
    { date: "Jun 20, 2025", league: "Premier League", team1: "Arsenal", team1Logo: "/assets/icons/Football/Team/Arsenal.png", score: "1-3", team2: "Manchester City", team2Logo: "/assets/icons/Football/Team/Manchester City.png" },
    { date: "Mar 14, 2025", league: "Premier League", team1: "Manchester City", team1Logo: "/assets/icons/Football/Team/Manchester City.png", score: "1-1", team2: "Arsenal", team2Logo: "/assets/icons/Football/Team/Arsenal.png" },
    { date: "Jan 24, 2025", league: "Premier League", team1: "Manchester City", team1Logo: "/assets/icons/Football/Team/Manchester City.png", score: "1-3", team2: "Arsenal", team2Logo: "/assets/icons/Football/Team/Arsenal.png" },
    { date: "Nov 10, 2024", league: "Premier League", team1: "Arsenal", team1Logo: "/assets/icons/Football/Team/Arsenal.png", score: "1-3", team2: "Manchester City", team2Logo: "/assets/icons/Football/Team/Manchester City.png" },
  ];

  return (
    <div className="my-8 space-y-8">
      {/* Last 5 Matches */}
      <div className="block-style">
        <h3 className="text-lg font-semibold text-neutral-n4 dark:text-snow-200 mb-6">Last 5 matches</h3>
        <div className="space-y-4">
          {[
            { date: "Aug 4, 2025", league: "Premier League", team1: "Manchester City", team1Logo: "/assets/icons/Football/Team/Manchester City.png", score: "1-3", team2: "Arsenal", team2Logo: "/assets/icons/Football/Team/Arsenal.png" },
            { date: "Jun 20, 2025", league: "Premier League", team1: "Arsenal", team1Logo: "/assets/icons/Football/Team/Arsenal.png", score: "1-3", team2: "Manchester City", team2Logo: "/assets/icons/Football/Team/Manchester City.png" },
            { date: "Mar 14, 2025", league: "Premier League", team1: "Manchester City", team1Logo: "/assets/icons/Football/Team/Manchester City.png", score: "1-3", team2: "Arsenal", team2Logo: "/assets/icons/Football/Team/Arsenal.png" },
            { date: "Jan 24, 2025", league: "Premier League", team1: "Manchester City", team1Logo: "/assets/icons/Football/Team/Manchester City.png", score: "1-3", team2: "Arsenal", team2Logo: "/assets/icons/Football/Team/Arsenal.png" },
            { date: "Nov 10, 2024", league: "Premier League", team1: "Arsenal", team1Logo: "/assets/icons/Football/Team/Arsenal.png", score: "1-3", team2: "Manchester City", team2Logo: "/assets/icons/Football/Team/Manchester City.png" },
          ].map((match, index) => (
            <div key={index} className="flex flex-col gap-2 pb-4 dark:border-[#1F2937] last:border-0 last:pb-0">
              <div className="text-sm text-neutral-n5 dark:text-snow-200">
                {match.league} • {match.date}
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={match.team1Logo}
                    alt={match.team1}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Manchester City.png";
                    }}
                  />
                  <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">{match.team1}</span>
                </div>
                <div className="px-4 py-1.5 bg-snow-100 dark:bg-[#161B22] rounded-lg border border-snow-200 dark:border-[#1F2937]">
                  <span className="font-semibold text-sm text-neutral-n4 dark:text-snow-200">{match.score}</span>
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                  <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate text-right">{match.team2}</span>
                  <img
                    src={match.team2Logo}
                    alt={match.team2}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Arsenal.png";
                    }}
                  />
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
            <img
              src="/assets/icons/Football/Team/Manchester City.png"
              alt="Manchester City"
              className="w-16 h-16 rounded-full object-cover mb-3"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Manchester City.png";
              }}
            />
            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 mb-4">Man. City</span>
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
            <img
              src="/assets/icons/Football/Team/Arsenal.png"
              alt="Arsenal"
              className="w-16 h-16 rounded-full object-cover mb-3"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Arsenal.png";
              }}
            />
            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 mb-4">Arsenal</span>
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
        <div className="flex mb-2 gap-2 mb-6">
          <button
            onClick={() => setSelectedTeam("Manchester City")}
            className={`px-4 flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedTeam === "Manchester City"
                ? "bg-brand-primary text-white"
                : "bg-white dark:bg-[#161B22] text-neutral-n5 dark:text-snow-200 border border-snow-200 dark:border-[#1F2937]"
            }`}
          >
            Manchester City
          </button>
          <button
            onClick={() => setSelectedTeam("Arsenal")}
            className={`px-4 flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedTeam === "Arsenal"
                ? "bg-brand-primary text-white"
                : "bg-white dark:bg-[#161B22] text-neutral-n5 dark:text-snow-200 border border-snow-200 dark:border-[#1F2937]"
            }`}
          >
            Arsenal
          </button>
        </div>

        {/* Match List */}
        <div className="space-y-8">
          {recentMatches.map((match, index) => {
            const selectedTeamIsTeam1 = match.team1 === selectedTeam;
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
              <div key={index} className="flex items-center gap-4">
                <div className="text-sm flex-2 text-neutral-n5 dark:text-snow-200 min-w-[140px]">
                  <span className="font-medium text-sm text-black dark:text-snow-200">{match.league}</span>
                  <br />
                  {match.date}
                </div>
                <div className="flex-3 flex">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {selectedTeamIsTeam1 ? (
                    <>
                      <img
                        src={match.team1Logo}
                        alt={match.team1}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Manchester City.png";
                        }}
                      />
                      <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">{match.team1}</span>
                    </>
                  ) : (
                    <>
                      <img
                        src={match.team2Logo}
                        alt={match.team2}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Arsenal.png";
                        }}
                      />
                      <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">{match.team2}</span>
                    </>
                  )}
                </div>
                <div className={`px-4 py-1.5 rounded-lg border font-semibold text-sm ${resultColor}`}>
                  {match.score}
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                  {selectedTeamIsTeam1 ? (
                    <>
                      <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate text-right">{match.team2}</span>
                      <img
                        src={match.team2Logo}
                        alt={match.team2}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Arsenal.png";
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate text-right">{match.team1}</span>
                      <img
                        src={match.team1Logo}
                        alt={match.team1}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Manchester City.png";
                        }}
                      />
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
            <img
              src="/assets/icons/Football/Team/Manchester City.png"
              alt="Manchester City"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Manchester City.png";
              }}
            />
            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200">Manchester City</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200">Arsenal</span>
            <img
              src="/assets/icons/Football/Team/Arsenal.png"
              alt="Arsenal"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Arsenal.png";
              }}
            />
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
      <div className="relative overflow-hidden page-padding-x bg-brand-primary py-1 w-full">
        {/* Floating SVG background */}
        <img
          src="./icons/football-line-1.svg"
          className="absolute w-60 md:w-150 invert sepia opacity-8 pointer-events-none z-0 float-edges"
          alt=""
          style={{ animation: "float-around-edges 12s linear infinite" }}
        />
        {/* Foreground content */}
        <div  onClick={() => navigate(-1)} className="relative cursor-pointer px-3 z-10 grid grid-cols-3 items-center">
          <div className="flex gap-4">
            <ArrowLeftIcon className="text-white h-5" />
            <p className="text-white hidden md:block">Back</p>
          </div>

          <div className="bg-brand-secondary/70 backdrop-blur-3xl md:opacity-100 opacity-0 font-semibold mb-2 sz-7 items-center text-white py-1 px-4 rounded w-fit mx-auto">
            1st Half - 55:56
          </div>

          <div className="flex gap-4 justify-end">
            {/* <Icons.Notification2Line className="text-white h-5" /> */}
            <BellAlertIcon className="text-white h-5" />
            <ShareIcon className="text-white h-5" />
          </div>
        </div>

        <div className=" md:mt-5 mb-5 px-3 grid grid-cols-3 items-start text-white">
          {/* Home team (right aligned) */}
          {fixtureDetails && (
            <>
              <div className="flexitems-center md:items-end flex-col">
                <div className="flex-col-reverse  flex sz-7 md:flex-row md:mr-2 mdtext-[20px] md:font-light md:justify-end items-center font-semibold  md:gap-3">
                  <p className="text-center">{fixtureDetails.localteam.name}</p>
                  <GetTeamLogo teamId={fixtureDetails.localteam.id} alt={fixtureDetails.localteam.name} className="w-fit h-10" />
                </div>
                <div className="md:flex gap-3 hidden items-start justify-end mt-1">
                  <StaggerChildren className="flex font-light text-[12px] flex-col text-right">
                    {fixtureDetails.goals.filter((goal: any) => goal.team === "localteam").map((goal: any, index: number) => (
                      <p key={index}>{goal.player} {goal.minute}'</p>
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
                <div className="flex sz-2  justify-center items-start gap-3">
                  <p>{fixtureDetails.localteam.score}</p>
                  <p>-</p>
                  <p>{fixtureDetails.visitorteam.score}</p>
                </div>
                <p className="text-center block md:hidden">{fixtureDetails.status}</p>
              </div>

              {/* Away team (left aligned) */}
              <div className="flex items-center md:items-start flex-col">
                <div className="flex-col-reverse flex sz-7 md:flex-row md:mr-2 mdtext-[20px] md:font-light md:justify-start items-center font-semibold  md:gap-3">
                  <p className="text-center">{fixtureDetails.visitorteam.name}</p>
                  <GetTeamLogo teamId={fixtureDetails.visitorteam.id} alt={fixtureDetails.visitorteam.name} className="w-fit h-10" />
            </div>

            <div className="md:flex hidden gap-3 justify-start mt-1">
              <img
                src="./icons/football-line-1.svg"
                className=" w-4 invert sepia"
                alt=""
              />
              <StaggerChildren className="flex font-light sz-8 flex-col text-left">
                {fixtureDetails.goals.filter((goal: any) => goal.team === "visitorteam").map((goal: any, index: number) => (
                  <p key={index}>{goal.player} {goal.minute}'</p>
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
                {fixtureDetails.goals.filter((goal: any) => goal.team === "localteam").map((goal: any, index: number) => (
                  <p key={index}>{goal.player} {goal.minute}'</p>
                ))}
              </StaggerChildren>
              <img
                src="./icons/football-line-1.svg"
                className=" w-3 md:w-4 invert sepia"
                alt=""
              />
              <GetTeamLogo teamId={fixtureDetails.localteam.id} alt={fixtureDetails.localteam.name} className="w-8 h-8 object-cover" />
            </div>
            <div className="flex gap-3 flex-1 items-start justify-start mt-1">
              <img
                src="./icons/football-line-1.svg"
                className=" w-3 md:w-4 invert sepia"
                alt=""
              />
              <StaggerChildren className="flex font-light text-[12px] flex-col text-left">
                {fixtureDetails.goals.filter((goal: any) => goal.team === "visitorteam").map((goal: any, index: number) => (
                  <p key={index}>{goal.player} {goal.minute}'</p>
                ))}
              </StaggerChildren>
              <GetTeamLogo teamId={fixtureDetails.visitorteam.id} alt={fixtureDetails.visitorteam.name} className="w-8 h-8 rounded-full object-cover" />
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
            <div className="flex gap-2 items-center">
              <img
                src="./icons/soccer-field-1.svg"
                className=" w-4 invert sepia"
                alt=""
              />
              <p>{fixtureDetails.venue}, {fixtureDetails.venue_city}</p>
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

      <div className="flex z-10 h-12 w-full overflow-y-hidden overflow-x-auto bg-brand-p3/30 dark:bg-brand-p2 backdrop-blur-2xl cursor-pointer sticky top-0 hide-scrollbar">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => handleTabClick(tab.id, e)}
              className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-orange-500 font-medium"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
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
              <div className="flex flex-col gap-2 block-style">
                <div className="flex gap-1 mb-1">
                  <p className="theme-text">Team Comparison</p>
                  <InformationCircleIcon className="w-4 cursor-pointer theme-text opacity-45" />
                </div>

                <div className="flex gap-3 md:gap-0 transition-colors justify-between mb-2">
                  <div className="flex flex-col  items-center  bg-snow-200 px-3 rounded border-dotted border-2 border-neutral-m6">
                    <img
                      src="/assets/icons/Football/Team/Manchester City.png"
                      alt=""
                      className="h-10 md:h-20"
                    />
                    <p className="sz-7 text-center">Man. City</p>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex items-center my-auto px-3 py-1 flex-col bg-snow-200">
                      <p className=" text-xl md:text-3xl">3</p>
                      <p className=" sz-7">Win</p>
                    </div>

                    <div className="flex items-center my-auto py-1 px-3 flex-col bg-snow-200">
                      <p className="text-xl md:text-3xl">1</p>
                      <p className=" sz-7">Draw</p>
                    </div>

                    <div className="flex items-center my-auto py-1 px-3 flex-col bg-snow-200">
                      <p className="text-xl md:text-3xl">1</p>
                      <p className=" sz-7">Win</p>
                    </div>
                  </div>

                  <div className="flex h-full hover:bg-snow-200 px-3 rounded justify-between mb-2">
                    <div className="flex flex-col h-full items-center">
                      <img
                        src="/assets/icons/Football/Team/Arsenal.png"
                        alt=""
                        className="h-10 md:h-20"
                      />
                      <p className="theme-text dark:hover:text-black sz-7">
                        Arsenal
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex text-neutral-m6 justify-between">
                  <p className="sz-8 flex-3 ">3 Wins</p>
                  <p className="sz-8 flex-1">1 Draw</p>
                  <p className="sz-8 flex-1">1 Loss</p>
                </div>

                <div className="flex w-full h-3 overflow-hidden rounded-full">
                  <div className="flex-3 h-full bg-ui-success"></div>
                  <div className="flex-1 h-full bg-ui-pending"></div>
                  <div className="flex-1 h-full bg-ui-negative"></div>
                </div>
              </div>

              <div className="flex relative flex-col gap-2 block-style">
                {/* -------------------------------------- */}
                 {/* Overlay gradient with text */}
              <div className="pointer-events-none absolute theme-fade left-0 right-0 bottom-0 h-40 w-full flex items-end justify-center z-2">
                <span className="mb-4 text-neutral-m6 font-medium text-center w-full">
                  Feature coming soon
                </span>
              </div>
                <div className="flex gap-1 mb-1">
                  <p className="theme-text">Sidelined</p>
                  <InformationCircleIcon className="w-4 theme-text opacity-45 cursor-pointer" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
                  <div className="flex gap-1 flex-col">
                    <div className="flex gap-3 items-center">
                      <img
                        src="/assets/icons/Football/Team/Manchester City.png"
                        alt=""
                        className="h-10"
                      />
                      <p className="theme-text sz-6">Manchester City</p>
                    </div>

                    <div className="flex gap-3 items-center">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                      <p className="theme-text sz-6">Rico Lewis</p>
                      <p className="bg-snow-100 w-fit px-2 sz-7 text-neutral-m6 dark:text-neutral-n4">
                        Suspended
                      </p>
                    </div>

                    <div className="flex gap-3 items-center">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                      <p className="theme-text sz-6">Rico Lewis</p>
                      <p className="bg-snow-100 w-fit px-2 sz-7 dark:text-neutral-n4 text-neutral-m6">
                        Knee Injury
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                      <p className="theme-text sz-6">Rico Lewis</p>
                      <p className="bg-snow-100 w-fit px-2 sz-7 dark:text-neutral-n4 text-neutral-m6">
                        ACL Tear
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 items-end flex-col">
                    <div className="flex gap-3 items-center">
                      <p className="theme-text sz-6">Arsenal</p>
                      <img
                        src="/assets/icons/Football/Team/Arsenal.png"
                        alt=""
                        className="h-10"
                      />
                    </div>

                    <div className="flex gap-3 items-center">
                      <p className="bg-snow-100 w-fit px-2 sz-7 dark:text-neutral-n4 text-neutral-m6">
                        Suspended
                      </p>
                      <p className="theme-text sz-6">Rico Lewis</p>
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                    </div>

                    <div className="flex gap-3 items-center">
                      <p className="bg-snow-100 w-fit px-2 sz-7 dark:text-neutral-n4 text-neutral-m6">
                        Suspended
                      </p>
                      <p className="theme-text sz-6">Rico Lewis</p>
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                    </div>

                    <div className="flex gap-3 items-center">
                      <p className="bg-snow-100 w-fit px-2 sz-7 dark:text-neutral-n4 text-neutral-m6">
                        Suspended
                      </p>
                      <p className="theme-text sz-6">Rico Lewis</p>
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                    </div>
                  </div>
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
                label="Manchester City"
                className="btn-primary text-sm text-white border-brand-primary"
              />

              <Button
                label="Arsenal"
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
                          src="/players/Sasha Vezenkov.png"
                          alt=""
                          className="h-5 rounded-full"
                        />
                        <p className="theme-text sz-7">Rico Lewis</p>
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
          <LineupBuilder localteam={fixtureDetails?.lineups?.localteam} visitorteam={fixtureDetails?.lineups?.visitorteam} />
        )}

        {/* ----------------------------------------------------line up end------------------------------------------------------- */}

        {/* -------------------------------------------------------statistics-------------------------------------------------- */}

        {activeTab === "statistics" && (
          <div className="bloc my-8">
            <p className="sz-3">Match Statistics</p>
            <div className="w-full flex text-sm bg-brand-p4 mb-7 py-2 px-5 justify-between">
              <div className="flex gap-3 items-center">
                <p className="sz-6">Manchester City</p>
                <img
                  src="/assets/icons/Football/Team/Manchester City.png"
                  alt=""
                  className="h-10"
                />
              </div>

              <div className="flex gap-3 items-center">
                <img
                  src="/assets/icons/Football/Team/Arsenal.png"
                  alt=""
                  className="h-10"
                />
                <p className="sz-6">Arsenal</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
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
        )}

        {/* -------------------------------------------------------statistics emd-------------------------------------------------- */}

        {/* -------------------------------------------------------headtohead-------------------------------------------------------- */}

        {activeTab === "headtohead" && (
          <HeadToHeadSection />
        )}

        {/* -------------------------------------------------------headtohead end-------------------------------------------------------- */}

        {/* -------------------------------------------------------standings-------------------------------------------------------- */}
        {activeTab === "standings" && (
          <div className="my-8">
            {/* Desktop Version */}
            <div className="hidden lg:block block-style overflow-x-auto">
              <div className="min-w-full">
                {/* Table Header */}
                <div className="grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px] gap-3 px-6 py-4  mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
                  <div className="text-center">#</div>
                  <div>Team</div>
                  <div className="text-center">P</div>
                  <div className="text-center">W</div>
                  <div className="text-center">D</div>
                  <div className="text-center">L</div>
                  <div className="text-center">GF</div>
                  <div className="text-center">GA</div>
                  <div className="text-center">GD</div>
                  <div className="text-center">PTS</div>
                </div>

                {/* Table Rows */}
                <div className="flex flex-col gap-2">
                  {[
                    { position: 1, team: "Manchester City", logo: "/assets/icons/Football/Team/Manchester City.png", played: 23, wins: 19, draws: 2, losses: 2, goalsFor: 58, goalsAgainst: 34, goalDiff: 23, points: 58 },
                    { position: 2, team: "Arsenal", logo: "/assets/icons/Football/Team/Arsenal.png", played: 23, wins: 19, draws: 2, losses: 2, goalsFor: 58, goalsAgainst: 34, goalDiff: 23, points: 58 },
                    { position: 3, team: "Liverpool", logo: "/assets/icons/Football/Team/Liverpool.png", played: 23, wins: 18, draws: 3, losses: 2, goalsFor: 55, goalsAgainst: 32, goalDiff: 23, points: 57 },
                    { position: 4, team: "Chelsea", logo: "/assets/icons/Football/Team/Chelsea.png", played: 23, wins: 17, draws: 4, losses: 2, goalsFor: 52, goalsAgainst: 30, goalDiff: 22, points: 55 },
                    { position: 5, team: "Tottenham", logo: "/assets/icons/Football/Team/Tottenham.png", played: 23, wins: 16, draws: 3, losses: 4, goalsFor: 50, goalsAgainst: 28, goalDiff: 22, points: 51 },
                    { position: 6, team: "Manchester United", logo: "/assets/icons/Football/Team/Manchester United.png", played: 23, wins: 15, draws: 4, losses: 4, goalsFor: 48, goalsAgainst: 26, goalDiff: 22, points: 49 },
                    { position: 7, team: "Newcastle", logo: "/assets/icons/Football/Team/Newcastle.png", played: 23, wins: 14, draws: 5, losses: 4, goalsFor: 46, goalsAgainst: 24, goalDiff: 22, points: 47 },
                    { position: 8, team: "Brighton", logo: "/assets/icons/Football/Team/Brighton.png", played: 23, wins: 13, draws: 5, losses: 5, goalsFor: 44, goalsAgainst: 22, goalDiff: 22, points: 44 },
                    { position: 9, team: "West Ham", logo: "/assets/icons/Football/Team/West Ham.png", played: 23, wins: 12, draws: 6, losses: 5, goalsFor: 42, goalsAgainst: 20, goalDiff: 22, points: 42 },
                    { position: 10, team: "Aston Villa", logo: "/assets/icons/Football/Team/Aston Villa.png", played: 23, wins: 11, draws: 6, losses: 6, goalsFor: 40, goalsAgainst: 18, goalDiff: 22, points: 39 },
                    { position: 11, team: "Crystal Palace", logo: "/assets/icons/Football/Team/Crystal Palace.png", played: 23, wins: 10, draws: 7, losses: 6, goalsFor: 38, goalsAgainst: 16, goalDiff: 22, points: 37 },
                    { position: 12, team: "Fulham", logo: "/assets/icons/Football/Team/Fulham.png", played: 23, wins: 9, draws: 7, losses: 7, goalsFor: 36, goalsAgainst: 14, goalDiff: 22, points: 34 },
                    { position: 13, team: "Wolves", logo: "/assets/icons/Football/Team/Wolves.png", played: 23, wins: 8, draws: 8, losses: 7, goalsFor: 34, goalsAgainst: 12, goalDiff: 22, points: 32 },
                    { position: 14, team: "Everton", logo: "/assets/icons/Football/Team/Everton.png", played: 23, wins: 7, draws: 8, losses: 8, goalsFor: 32, goalsAgainst: 10, goalDiff: 22, points: 29 },
                    { position: 15, team: "Brentford", logo: "/assets/icons/Football/Team/Brentford.png", played: 23, wins: 6, draws: 9, losses: 8, goalsFor: 30, goalsAgainst: 8, goalDiff: 22, points: 27 },
                    { position: 16, team: "Nottingham Forest", logo: "/assets/icons/Football/Team/Nottingham Forest.png", played: 23, wins: 5, draws: 9, losses: 9, goalsFor: 28, goalsAgainst: 6, goalDiff: 22, points: 24 },
                    { position: 17, team: "Leicester", logo: "/assets/icons/Football/Team/Leicester.png", played: 23, wins: 4, draws: 10, losses: 9, goalsFor: 26, goalsAgainst: 4, goalDiff: 22, points: 22 },
                    { position: 18, team: "Leeds", logo: "/assets/icons/Football/Team/Leeds.png", played: 23, wins: 3, draws: 10, losses: 10, goalsFor: 24, goalsAgainst: 2, goalDiff: 22, points: 19 },
                    { position: 19, team: "Southampton", logo: "/assets/icons/Football/Team/Southampton.png", played: 23, wins: 2, draws: 11, losses: 10, goalsFor: 22, goalsAgainst: 0, goalDiff: 22, points: 17 },
                    { position: 20, team: "Bournemouth", logo: "/assets/icons/Football/Team/Bournemouth.png", played: 23, wins: 1, draws: 11, losses: 11, goalsFor: 20, goalsAgainst: -2, goalDiff: 22, points: 14 },
                  ].map((team) => {
                    const isTopFour = team.position <= 4;
                    const isFifth = team.position === 5;
                    const isRelegation = team.position >= 18;
                    return (
                      <div
                        key={team.position}
                        className={`grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px] gap-3 px-6 items-center relative whitespace-nowrap ${
                          isTopFour ? "border-l-[3px] border-ui-success" : isFifth ? "border-l-[3px] border-yellow-500" : isRelegation ? "border-l-[3px] border-ui-negative" : ""
                        }`}
                      >
                        <div className="text-center font-medium text-sm text-neutral-n4 dark:text-snow-200">
                          {team.position}
                        </div>
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={team.logo}
                            alt={team.team}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Manchester City.png";
                            }}
                          />
                          <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">{team.team}</span>
                          {team.team === "Manchester City" && (
                            <div className="px-2 py-0.5 rounded-full bg-ui-success text-white text-xs font-semibold flex-shrink-0 whitespace-nowrap">5-2</div>
                          )}
                          {team.team === "Arsenal" && (
                            <div className="px-2 py-0.5 rounded-full bg-ui-negative text-white text-xs font-semibold flex-shrink-0 whitespace-nowrap">2-5</div>
                          )}
                        </div>
                        <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.played}</div>
                        <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.wins}</div>
                        <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.draws}</div>
                        <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.losses}</div>
                        <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.goalsFor}</div>
                        <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.goalsAgainst}</div>
                        <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}</div>
                        <div className="text-center font-semibold text-sm text-neutral-n4 dark:text-snow-200">{team.points}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Version - Horizontal Scroll */}
            <div className="block lg:hidden">
              <div className="block-style overflow-x-auto hide-scrollbar">
                <div className="min-w-[800px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px] gap-3 px-4 py-3 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
                    <div className="text-center">#</div>
                    <div>Team</div>
                    <div className="text-center">P</div>
                    <div className="text-center">W</div>
                    <div className="text-center">D</div>
                    <div className="text-center">L</div>
                    <div className="text-center">GF</div>
                    <div className="text-center">GA</div>
                    <div className="text-center">GD</div>
                    <div className="text-center">PTS</div>
                  </div>

                  {/* Table Rows */}
                  <div className="flex hide-scrollbar flex-col gap-2">
                    {[
                      { position: 1, team: "Manchester City", logo: "/assets/icons/Football/Team/Manchester City.png", played: 23, wins: 19, draws: 2, losses: 2, goalsFor: 58, goalsAgainst: 34, goalDiff: 23, points: 58 },
                      { position: 2, team: "Arsenal", logo: "/assets/icons/Football/Team/Arsenal.png", played: 23, wins: 19, draws: 2, losses: 2, goalsFor: 58, goalsAgainst: 34, goalDiff: 23, points: 58 },
                      { position: 3, team: "Liverpool", logo: "/assets/icons/Football/Team/Liverpool.png", played: 23, wins: 18, draws: 3, losses: 2, goalsFor: 55, goalsAgainst: 32, goalDiff: 23, points: 57 },
                      { position: 4, team: "Chelsea", logo: "/assets/icons/Football/Team/Chelsea.png", played: 23, wins: 17, draws: 4, losses: 2, goalsFor: 52, goalsAgainst: 30, goalDiff: 22, points: 55 },
                      { position: 5, team: "Tottenham", logo: "/assets/icons/Football/Team/Tottenham.png", played: 23, wins: 16, draws: 3, losses: 4, goalsFor: 50, goalsAgainst: 28, goalDiff: 22, points: 51 },
                      { position: 6, team: "Manchester United", logo: "/assets/icons/Football/Team/Manchester United.png", played: 23, wins: 15, draws: 4, losses: 4, goalsFor: 48, goalsAgainst: 26, goalDiff: 22, points: 49 },
                      { position: 7, team: "Newcastle", logo: "/assets/icons/Football/Team/Newcastle.png", played: 23, wins: 14, draws: 5, losses: 4, goalsFor: 46, goalsAgainst: 24, goalDiff: 22, points: 47 },
                      { position: 8, team: "Brighton", logo: "/assets/icons/Football/Team/Brighton.png", played: 23, wins: 13, draws: 5, losses: 5, goalsFor: 44, goalsAgainst: 22, goalDiff: 22, points: 44 },
                      { position: 9, team: "West Ham", logo: "/assets/icons/Football/Team/West Ham.png", played: 23, wins: 12, draws: 6, losses: 5, goalsFor: 42, goalsAgainst: 20, goalDiff: 22, points: 42 },
                      { position: 10, team: "Aston Villa", logo: "/assets/icons/Football/Team/Aston Villa.png", played: 23, wins: 11, draws: 6, losses: 6, goalsFor: 40, goalsAgainst: 18, goalDiff: 22, points: 39 },
                      { position: 11, team: "Crystal Palace", logo: "/assets/icons/Football/Team/Crystal Palace.png", played: 23, wins: 10, draws: 7, losses: 6, goalsFor: 38, goalsAgainst: 16, goalDiff: 22, points: 37 },
                      { position: 12, team: "Fulham", logo: "/assets/icons/Football/Team/Fulham.png", played: 23, wins: 9, draws: 7, losses: 7, goalsFor: 36, goalsAgainst: 14, goalDiff: 22, points: 34 },
                      { position: 13, team: "Wolves", logo: "/assets/icons/Football/Team/Wolves.png", played: 23, wins: 8, draws: 8, losses: 7, goalsFor: 34, goalsAgainst: 12, goalDiff: 22, points: 32 },
                      { position: 14, team: "Everton", logo: "/assets/icons/Football/Team/Everton.png", played: 23, wins: 7, draws: 8, losses: 8, goalsFor: 32, goalsAgainst: 10, goalDiff: 22, points: 29 },
                      { position: 15, team: "Brentford", logo: "/assets/icons/Football/Team/Brentford.png", played: 23, wins: 6, draws: 9, losses: 8, goalsFor: 30, goalsAgainst: 8, goalDiff: 22, points: 27 },
                      { position: 16, team: "Nottingham Forest", logo: "/assets/icons/Football/Team/Nottingham Forest.png", played: 23, wins: 5, draws: 9, losses: 9, goalsFor: 28, goalsAgainst: 6, goalDiff: 22, points: 24 },
                      { position: 17, team: "Leicester", logo: "/assets/icons/Football/Team/Leicester.png", played: 23, wins: 4, draws: 10, losses: 9, goalsFor: 26, goalsAgainst: 4, goalDiff: 22, points: 22 },
                      { position: 18, team: "Leeds", logo: "/assets/icons/Football/Team/Leeds.png", played: 23, wins: 3, draws: 10, losses: 10, goalsFor: 24, goalsAgainst: 2, goalDiff: 22, points: 19 },
                      { position: 19, team: "Southampton", logo: "/assets/icons/Football/Team/Southampton.png", played: 23, wins: 2, draws: 11, losses: 10, goalsFor: 22, goalsAgainst: 0, goalDiff: 22, points: 17 },
                      { position: 20, team: "Bournemouth", logo: "/assets/icons/Football/Team/Bournemouth.png", played: 23, wins: 1, draws: 11, losses: 11, goalsFor: 20, goalsAgainst: -2, goalDiff: 22, points: 14 },
                    ].map((team) => {
                      const isTopFour = team.position <= 4;
                      const isFifth = team.position === 5;
                      const isRelegation = team.position >= 18;
                      return (
                        <div
                          key={team.position}
                          className={`grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px_50px] gap-3 px-4 items-center relative whitespace-nowrap ${
                            isTopFour ? "border-l-[3px] border-ui-success" : isFifth ? "border-l-[3px] border-yellow-500" : isRelegation ? "border-l-[3px] border-ui-negative" : ""
                          }`}
                        >
                          <div className="text-center font-medium text-sm text-neutral-n4 dark:text-snow-200">
                            {team.position}
                          </div>
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={team.logo}
                              alt={team.team}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/assets/icons/Football/Team/Manchester City.png";
                              }}
                            />
                            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">{team.team}</span>
                            {team.team === "Manchester City" && (
                              <div className="px-2 py-0.5 rounded-full bg-ui-success text-white text-xs font-semibold flex-shrink-0 whitespace-nowrap">5-2</div>
                            )}
                            {team.team === "Arsenal" && (
                              <div className="px-2 py-0.5 rounded-full bg-ui-negative text-white text-xs font-semibold flex-shrink-0 whitespace-nowrap">2-5</div>
                            )}
                          </div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.played}</div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.wins}</div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.draws}</div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.losses}</div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.goalsFor}</div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.goalsAgainst}</div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}</div>
                          <div className="text-center font-semibold text-sm text-neutral-n4 dark:text-snow-200">{team.points}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 block-style p-4 md:p-6">
              {/* Abbreviations Section */}
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-brand-primary">#:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Position</span>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-primary">Team:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Team</span>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-primary">P:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Played</span>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-primary">W:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Wins</span>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-primary">D:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Draws</span>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-primary">L:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Losses</span>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-primary">GF:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Goals For</span>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-primary">GA:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Goals Against</span>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-primary">GD:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Goal Difference</span>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-primary">PTS:</span>{" "}
                    <span className="text-neutral-n4 dark:text-snow-200">Points</span>
                  </div>
                </div>
              </div>

              {/* League/Relegation Zone Indicators */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-[3px] h-6 bg-ui-success"></div>
                  <span className="text-sm text-neutral-n4 dark:text-snow-200">UEFA Champions League</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-[3px] h-6 bg-yellow-500"></div>
                  <span className="text-sm text-neutral-n4 dark:text-snow-200">UEFA Europa League</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-[3px] h-6 bg-ui-negative"></div>
                  <span className="text-sm text-neutral-n4 dark:text-snow-200">Relegation</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* -------------------------------------------------------standings end-------------------------------------------------------- */}

        {/* --------------------------------------------------------timeline--------------------------------------------------------------- */}

        {activeTab === "timeline" && (
          <div className="sz-8 flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
            <div className="flex flex-2 gap-3 flex-col edge-lighting block-style relative">
              {/* Overlay gradient with text */}
              <div className="pointer-events-none absolute theme-fade left-0 right-0 bottom-0 h-40 w-full flex items-end justify-center z-2">
                <span className="mb-4 text-neutral-m6 font-medium text-center w-full">
                  Download the app to Bant Better
                </span>
              </div>

              <p className="font-[500] mb-1 flex items-center sz-4 theme-text">
                Banter <img src="/fire.gif" className="w-5 ml-auto" alt="" />
              </p>
              <div className="flex sz-8 items-center bg-snow-100 px-4 py-1 rounded-full border border-dashed border-neutral-n4 gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/players/Sasha Vezenkov.png"
                    alt=""
                    className="h-5 rounded-full"
                  />
                  <div className="block">
                    <p className="text-neutral-m6">Johnny Williams 777</p>
                    <p className="">
                      City wasted a lot on Signings this season...{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex sz-8 items-center opacity-80 bg-snow-100 px-4 py-1 rounded-full border border-dashed border-neutral-n4 gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/players/Sasha Vezenkov.png"
                    alt=""
                    className="h-5 rounded-full"
                  />
                  <div className="block">
                    <p className="text-neutral-m6">Johnny Williams 777</p>
                    <p className="">
                      City wasted a lot on Signings this season...{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex sz-8 items-center opacity-60 bg-snow-100 px-4 py-1 rounded-full border border-dashed border-neutral-n4 gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/players/Sasha Vezenkov.png"
                    alt=""
                    className="h-5 rounded-full"
                  />
                  <div className="block">
                    <p className="text-neutral-m6">Johnny Williams 777</p>
                    <p className="">
                      City wasted a lot on Signings this season...{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex sz-8 items-center opacity-40 bg-snow-100 px-4 py-1 rounded-full border border-dashed border-neutral-n4 gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/players/Sasha Vezenkov.png"
                    alt=""
                    className="h-5 rounded-full"
                  />
                  <div className="block">
                    <p className="text-neutral-m6">Johnny Williams 777</p>
                    <p className="">
                      City wasted a lot on Signings this season...{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex sz-8 items-center opacity-20 bg-snow-100 px-4 py-1 rounded-full border border-dashed border-neutral-n4 gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/players/Sasha Vezenkov.png"
                    alt=""
                    className="h-5 rounded-full"
                  />
                  <div className="block">
                    <p className="text-neutral-m6">Johnny Williams 777</p>
                    <p className="">
                      City wasted a lot on Signings this season...{" "}
                    </p>
                  </div>
                </div>
              </div>
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
