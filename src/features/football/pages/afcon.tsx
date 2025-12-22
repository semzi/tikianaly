import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import { ArrowLeftIcon, StarIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { EliminationBracket } from "@/components/football/EliminationBracket";
interface Team {
  name: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface Group {
  name: string;
  teams: Team[];
}

const afcon = () => {
  const tabs = [
    { id: "standing", label: "Standing" },
    { id: "fixtures", label: "Fixtures" },
    { id: "bracket", label: "Bracket" }, // New tab for the bracket
    { id: "information", label: "Information" },
  ];

  const [bracketLoading, setBracketLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for the bracket data
    const timer = setTimeout(() => setBracketLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Dummy data for a 32-team elimination bracket (Round of 32 to Final)
  const dummyBracketData = {
    rounds: [
      {
        name: "Round 1",
        matches: [
          { id: "r32-1", round: "Round of 32", homeTeam: { id: "t1", name: "The Leons", flag: "/assets/icons/flag/a.png" }, awayTeam: { id: "t2", name: "Kitties", flag: "/assets/icons/flag/b.png" }, winner: { id: "t1", name: "The Leons", flag: "/assets/icons/flag/a.png" }, score: "2-1", date: "Wed Jul 05 2023" },
          { id: "r32-2", round: "Round of 32", homeTeam: { id: "t3", name: "Team C", flag: "/assets/icons/flag/c.png" }, awayTeam: { id: "t4", name: "Team D", flag: "/assets/icons/flag/d.png" }, winner: { id: "t3", name: "Team C", flag: "/assets/icons/flag/c.png" }, score: "3-0", date: "Wed Jul 05 2023" },
          { id: "r32-3", round: "Round of 32", homeTeam: { id: "t5", name: "Team E", flag: "/assets/icons/flag/e.png" }, awayTeam: { id: "t6", name: "Team F", flag: "/assets/icons/flag/f.png" }, winner: { id: "t5", name: "Team E", flag: "/assets/icons/flag/e.png" }, score: "1-1", date: "Wed Jul 05 2023", isDraw: true, isPenaltyShootout: true },
          { id: "r32-4", round: "Round of 32", homeTeam: { id: "t7", name: "Team G", flag: "/assets/icons/flag/g.png" }, awayTeam: { id: "t8", name: "Team H", flag: "/assets/icons/flag/h.png" }, winner: null, score: "-", date: "Wed Jul 05 2023" },
        ],
      },
      {
        name: "Round 2",
        matches: [
          { id: "r16-1", round: "Round of 16", homeTeam: { id: "t1", name: "The Leons", flag: "/assets/icons/flag/a.png" }, awayTeam: { id: "t2", name: "Kitties", flag: "/assets/icons/flag/b.png" }, winner: { id: "t1", name: "The Leons", flag: "/assets/icons/flag/a.png" }, score: "1-0", date: "Wed Jul 05 2023" },
          { id: "r16-2", round: "Round of 16", homeTeam: { id: "t3", name: "The Leons", flag: "/assets/icons/flag/c.png" }, awayTeam: { id: "t4", name: "Kitties", flag: "/assets/icons/flag/d.png" }, winner: null, score: "-", date: "Wed Jul 05 2023" },
        ],
      },
      {
        name: "Round 3",
        matches: [
          { id: "qf-1", round: "Quarter-finals", homeTeam: { id: "t1", name: "The Leons", flag: "/assets/icons/flag/a.png" }, awayTeam: { id: "t2", name: "Kitties", flag: "/assets/icons/flag/b.png" }, winner: null, score: "-", date: "Wed Jul 05 2023" },
        ],
      },
      {
        name: "Final",
        matches: [
          { id: "final-1", round: "Final", homeTeam: null, awayTeam: null, winner: null, score: "-", date: "Wed Jul 05 2023" },
        ],
      },
    ],
  };



  // Get initial tab from URL hash (fallback to "standing")
  const getTabFromHash = () => {
    if (typeof window === "undefined") return "standing";
    const hash = window.location.hash.replace("#", "");
    return tabs.find((tab) => tab.id === hash) ? hash : "standing";
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);

  // Update tab when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const foundTab = tabs.find((tab) => tab.id === hash);
      setActiveTab(foundTab ? hash : "standing");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [tabs]);

  // Update URL hash when tab changes
  const handleTabClick = (tabId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(tabId);
    const newUrl = `${window.location.pathname}${window.location.search}#${tabId}`;
    window.history.replaceState(null, "", newUrl);
  };

  // Demo data for groups A-D with 5 teams each
  const groups: Group[] = [
    {
      name: "Group A",
      teams: [
        { name: "Nigeria", flag: "/assets/icons/flag/a.png", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 2, goalDifference: 3, points: 7 },
        { name: "Egypt", flag: "/assets/icons/flag/a.png", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 6 },
        { name: "Ghana", flag: "/assets/icons/flag/a.png", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
        { name: "Cameroon", flag: "/assets/icons/flag/a.png", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
        { name: "Mali", flag: "/assets/icons/flag/a.png", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 0 },
      ],
    },
    {
      name: "Group B",
      teams: [
        { name: "Senegal", flag: "/assets/icons/flag/a.png", played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 7, goalsAgainst: 1, goalDifference: 6, points: 9 },
        { name: "Morocco", flag: "/assets/icons/flag/a.png", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 6 },
        { name: "Tunisia", flag: "/assets/icons/flag/a.png", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
        { name: "Algeria", flag: "/assets/icons/flag/a.png", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
        { name: "Ivory Coast", flag: "/assets/icons/flag/a.png", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 6, goalDifference: -5, points: 1 },
      ],
    },
    {
      name: "Group C",
      teams: [
        { name: "South Africa", flag: "/assets/icons/flag/a.png", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 2, goalDifference: 4, points: 7 },
        { name: "Kenya", flag: "/assets/icons/flag/a.png", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 6 },
        { name: "Tanzania", flag: "/assets/icons/flag/a.png", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
        { name: "Zambia", flag: "/assets/icons/flag/a.png", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
        { name: "Zimbabwe", flag: "/assets/icons/flag/a.png", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 6, goalDifference: -5, points: 0 },
      ],
    },
    {
      name: "Group D",
      teams: [
        { name: "DR Congo", flag: "/assets/icons/flag/a.png", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 2, goalDifference: 3, points: 7 },
        { name: "Angola", flag: "/assets/icons/flag/a.png", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 6 },
        { name: "Guinea", flag: "/assets/icons/flag/a.png", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
        { name: "Burkina Faso", flag: "/assets/icons/flag/a.png", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
        { name: "Mauritania", flag: "/assets/icons/flag/a.png", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 0 },
      ],
    },
  ];

  // Example fixtures grouped by stage (for left sidebar list)
  const fixturesGroups = [
    {
      group: "Group A",
      matches: [
        {
          date: "21 Dec",
          time: "20:00",
          home: { name: "Morocco", flag: "/assets/icons/flag/a.png" },
          away: { name: "Comoros", flag: "/assets/icons/flag/a.png" },
        },
        {
          date: "22 Dec",
          time: "15:00",
          home: { name: "Mali", flag: "/assets/icons/flag/a.png" },
          away: { name: "Zambia", flag: "/assets/icons/flag/a.png" },
        },
      ],
    },
    {
      group: "Group B",
      matches: [
        {
          date: "22 Dec",
          time: "18:00",
          home: { name: "South Africa", flag: "/assets/icons/flag/a.png" },
          away: { name: "Angola", flag: "/assets/icons/flag/a.png" },
        },
        {
          date: "22 Dec",
          time: "21:00",
          home: { name: "Egypt", flag: "/assets/icons/flag/a.png" },
          away: { name: "Zimbabwe", flag: "/assets/icons/flag/a.png" },
        },
      ],
    },
  ];

  // UI state for fixtures filter and favorites
  const [selectedStage, setSelectedStage] = useState<string>("All Stages");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />
      
      {/* AFCON Header Banner - Mobile */}
      <div
        className="relative w-full overflow-hidden h-fit md:hidden"
        style={{
          backgroundImage: "url('/afcon-backdrop.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-start px-4 py-4 text-center">
          <div
            onClick={() => navigate(-1)}
            className="relative cursor-pointer z-10 flex items-center gap-2 mb-2 mr-auto"
          >
            <ArrowLeftIcon className="text-white h-5" />
            {/* <p className="text-white hidden md:block">Back</p> */}
          </div>
          
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex flex-col items-center gap-2 justify-center w-full">
              <img 
                src="/afcon-logo.png" 
                alt="AFCON Logo" 
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col gap-0 text-white text-center">
                <span className="font-semibold text-base">
                  Africa Cup of Nations
                </span>
                <span className="text-xs opacity-90">
                  2024 Tournament
                </span>
              </div>
            </div>
            
            {/* Countdown block (mobile: stacked) */}
            <div className="relative z-10 flex flex-col items-center gap-0 text-white mt-2 w-full">
              <span className="font-semibold text-sm">AFCON FINAL Countdown</span>
              <span className="font-mono tracking-widest text-lg font-bold">01&nbsp;:&nbsp;12&nbsp;:&nbsp;47&nbsp;:&nbsp;23</span>
              <span className="text-xs font-medium opacity-80">Days&nbsp;&nbsp;Hrs&nbsp;&nbsp;Min&nbsp;&nbsp;Sec</span>
            </div>
          </div>
        </div>
      </div>

      {/* AFCON Header Banner - Desktop */}
      <div
        className="relative w-full overflow-hidden h-[200px] hidden md:block"
        style={{
          backgroundImage: "url('/afcon-backdrop.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="relative z-10 h-full flex items-center justify-between px-6 md:px-12 py-6">
          <div
            onClick={() => navigate(-1)}
            className="relative cursor-pointer z-10 flex items-center gap-2"
          >
            <ArrowLeftIcon className="text-white h-5" />
            <p className="text-white">Back</p>
          </div>
          
          
          <div className="flex items-center gap-4">
            <img 
              src="/afcon-logo.png" 
              alt="AFCON Logo" 
              className="w-16 h-16 md:w-24 md:h-24 object-contain"
            />
            <div className="flex flex-col gap-1 text-white">
              <span className="font-semibold text-lg md:text-2xl">
                Africa Cup of Nations
              </span>
              <span className="text-sm md:text-base opacity-90">
                2024 Tournament
              </span>
            </div>
          </div>
          
          {/* Countdown block */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex items-center gap-3 text-white">
              <div className="flex flex-col gap-1 text-white text-right">
                <span className="font-semibold text-base">AFCON FINAL Countdown</span>
                <span className="font-mono tracking-widest text-2xl font-bold">01&nbsp;:&nbsp;12&nbsp;:&nbsp;47&nbsp;:&nbsp;23</span>
                <span className="text-xs font-medium opacity-80">Days&nbsp;&nbsp;Hrs&nbsp;&nbsp;Min&nbsp;&nbsp;Sec</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex z-10 h-12 w-full overflow-y-hidden overflow-x-auto bg-brand-p3/30 dark:bg-brand-p2 backdrop-blur-2xl cursor-pointer sticky top-0 hide-scrollbar">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => handleTabClick(tab.id, e)}
              className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-orange-500 font-medium border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="page-padding-x">
        <div className="flex-col-reverse flex gap-y-7 md:flex-row my-8 md:gap-7">
          {/* Left Sidebar - Upcoming Match */}
          <div className="flex-flex-col">
          <div className="flex flex-2 gap-3 flex-col">
            <div className="block-style">
              <p className="font-[500] mb-4 flex items-center sz-4 theme-text">
                Upcoming Match
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="text-center py-2 px-4 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                  <p className="text-xs text-neutral-n4 dark:text-snow-200 mb-2">Group A - Matchday 4</p>
                  <p className="text-sm font-semibold theme-text">Tomorrow, 8:00 PM</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src="/assets/icons/Football/Team/Arsenal.png" 
                        alt="Nigeria" 
                        className="w-8 h-8"
                      />
                      <span className="font-medium theme-text">Nigeria</span>
                    </div>
                    <span className="text-neutral-n4 dark:text-snow-200">vs</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-snow-100 dark:bg-[#1F2937] rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src="/assets/icons/Football/Team/Chelsea.png" 
                        alt="Egypt" 
                        className="w-8 h-8"
                      />
                      <span className="font-medium theme-text">Egypt</span>
                    </div>
                    <span className="text-neutral-n4 dark:text-snow-200">vs</span>
                  </div>
                </div>
                
                <button className="w-full py-2 px-4 bg-brand-primary text-white rounded-lg font-semibold text-sm hover:bg-brand-primary/90 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
          
            {/* Fixtures list under leftbar */}
            <div className="block-style">
                <div className="flex items-center justify-between mb-4">
                <p className="font-[500] sz-4 theme-text">Stage</p>
                <div className="relative">
                  <select
                    className="appearance-none bg-[#0B1115] dark:bg-[#0B1115] text-sm text-white px-3 py-1.5 rounded-full border border-transparent hover:border-neutral-n5 transition-shadow shadow-sm pr-8"
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                  >
                    <option>All Stages</option>
                    {fixturesGroups.map((fg) => (
                      <option key={fg.group} value={fg.group}>{fg.group}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-neutral-n4 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-4">
                {fixturesGroups
                  .filter((fg) => selectedStage === 'All Stages' ? true : fg.group === selectedStage)
                  .map((fg) => (
                  <div key={fg.group}>
                    <p className="text-sm text-neutral-n4 dark:text-snow-200 mb-2">{fg.group}</p>
                    <div className="space-y-3">
                      {fg.matches.map((m) => {
                        const id = `${m.home.name}-${m.away.name}-${m.time}`;
                        const isFav = !!favorites[id];
                        return (
                        <div key={id} className="flex items-center bg-snow-100 dark:bg-[#121417] rounded-lg p-3">
                          <div className="w-20 flex-shrink-0 text-center">
                            <div className="text-xs text-neutral-n4 dark:text-snow-200">{m.date}</div>
                            <div className="font-semibold mt-1">{m.time}</div>
                          </div>

                          <div className="flex-1 flex items-center gap-4 border-l border-snow-200 dark:border-[#1F2937] pl-4">
                            <div className="flex items-center gap-3">
                              <img src={m.home.flag} alt={m.home.name} className="w-6 h-6 rounded-full" />
                              <div className="font-medium theme-text">{m.home.name}</div>
                            </div>

                            <div className="h-8 border-l border-snow-200 dark:border-[#1F2937]" />

                            <div className="flex items-center gap-3">
                              <img src={m.away.flag} alt={m.away.name} className="w-6 h-6 rounded-full" />
                              <div className="font-medium theme-text">{m.away.name}</div>
                            </div>
                          </div>

                          <div className="w-10 flex justify-end pl-3">
                            <button
                              onClick={() => toggleFavorite(id)}
                              className={`p-2 rounded-full transition flex items-center justify-center ${isFav ? 'bg-orange-500' : 'bg-transparent border border-neutral-n4'}`}
                              aria-pressed={isFav}
                              aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                            >
                              <StarIcon className={`w-4 h-4 ${isFav ? 'text-white' : 'text-neutral-n4 dark:text-snow-200'}`} />
                            </button>
                          </div>
                        </div>
                        )})}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>

          {/* Main Content */}
          <div className="flex flex-col gap-5 flex-5">
            {/* Standing Tab */}
            {activeTab === "standing" && (
              <div className="space-y-6">
                {groups.map((group) => (
                  <div key={group.name} className="block-style">
                    <div className="flex items-center gap-3 border-b border-snow-200 dark:border-[#1F2937] px-5 py-3 mb-4">
                      <h3 className="font-bold text-lg theme-text">{group.name}</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-snow-200 dark:border-[#1F2937]">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">Pos</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">Team</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">P</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">W</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">D</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">L</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">GF</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">GA</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">GD</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-n4 dark:text-snow-200">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.teams.map((team, index) => (
                            <tr 
                              key={team.name}
                              className={`border-b border-snow-200 dark:border-[#1F2937] hover:bg-snow-100 dark:hover:bg-[#1F2937] transition-colors ${
                                index < 2 ? "bg-green-50/50 dark:bg-green-900/10" : ""
                              }`}
                            >
                              <td className="px-4 py-3 text-sm font-medium theme-text">{index + 1}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={team.flag} 
                                    alt={team.name} 
                                    className="w-6 h-6 rounded"
                                  />
                                  <span className="text-sm font-medium theme-text">{team.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-sm theme-text">{team.played}</td>
                              <td className="px-4 py-3 text-center text-sm theme-text">{team.won}</td>
                              <td className="px-4 py-3 text-center text-sm theme-text">{team.drawn}</td>
                              <td className="px-4 py-3 text-center text-sm theme-text">{team.lost}</td>
                              <td className="px-4 py-3 text-center text-sm theme-text">{team.goalsFor}</td>
                              <td className="px-4 py-3 text-center text-sm theme-text">{team.goalsAgainst}</td>
                              <td className={`px-4 py-3 text-center text-sm font-medium ${
                                team.goalDifference > 0 ? "text-green-600 dark:text-green-400" : 
                                team.goalDifference < 0 ? "text-red-600 dark:text-red-400" : 
                                "theme-text"
                              }`}>
                                {team.goalDifference > 0 ? "+" : ""}{team.goalDifference}
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-bold theme-text">{team.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fixtures Tab */}
            {activeTab === "fixtures" && (
              <div className="block-style">
                <p className="font-bold text-lg mb-4 theme-text">Fixtures</p>
                <p className="text-neutral-n4 dark:text-snow-200">Fixtures will be displayed here...</p>
              </div>
            )}

            {/* Bracket Tab */}
            {activeTab === "bracket" && (
              <div className=" block-style w-full overflow-x-hidden">
              <EliminationBracket data={dummyBracketData} loading={bracketLoading} />
              </div>
            )}

            {/* Information Tab */}
            {activeTab === "information" && (
              <div className="block-style">
                <p className="font-bold text-lg mb-4 theme-text">Information</p>
                <div className="space-y-4 theme-text">
                  <div>
                    <h4 className="font-semibold mb-2">About AFCON 2024</h4>
                    <p className="text-sm text-neutral-n4 dark:text-snow-200">
                      The Africa Cup of Nations (AFCON) is the main international men's association football competition in Africa. 
                      The 2024 edition features teams from across the continent competing for the prestigious trophy.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tournament Format</h4>
                    <p className="text-sm text-neutral-n4 dark:text-snow-200">
                      The tournament consists of group stages followed by knockout rounds. Teams are divided into groups 
                      and compete to advance to the next stage.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default afcon;
