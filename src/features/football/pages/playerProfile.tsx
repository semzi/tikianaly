import StaggerChildren from "@/animations/staggerChildren";
import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import PlayerRadarChart from "@/visualization/PlayerRadarChart";
import MonthlyRatingChart from "@/visualization/MonthlyRatingChart";
import PlayerMatchesWidget from "@/components/player/PlayerMatchesWidget";
import {
  ArrowLeftIcon,
  BellAlertIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  CheckBadgeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

const playerProfile = () => {
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "matches", label: "Matches" },
    { id: "career", label: "Career" },
  ];
  
  // Get initial tab from URL hash (fallback to "profile")
  const getTabFromHash = () => {
    if (typeof window === "undefined") return "profile";
    const hash = window.location.hash.replace("#", "");
    return tabs.find((tab) => tab.id === hash) ? hash : "profile";
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);

  // Update tab when hash changes (e.g., browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const foundTab = tabs.find((tab) => tab.id === hash);
      setActiveTab(foundTab ? hash : "profile");
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
      <div className="bg-brand-secondary relative z-0">
        <div
          className="overflow-hidden h-auto md:h-80 bg-cover bg-center w-full relative z-0"
          style={{
            backgroundImage: "url('./players/Picture.png')",
          }}
        >
          <div className="w-full bg-black/30 backdrop-blur-3xl h-full min-h-[280px] md:min-h-0 page-padding-x pb-4 md:pb-0 relative z-0">
            <div className="justify-between flex py-3 md:py-5">
              <div
                onClick={() => navigate(-1)}
                className="relative cursor-pointer px-3 z-10 grid grid-cols-3 items-center"
              >
                <div className="flex gap-4">
                  <ArrowLeftIcon className="text-white h-5" />
                  <p className="text-white hidden md:block">Back</p>
                </div>
              </div>

              <div className="flex gap-4">
                <BellAlertIcon className="text-white h-5" />
                <ShareIcon className="text-white h-5" />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex justify-between">
              {/* ---------------------------- */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-4">
                  <div
                    className="overflow-hidden h-40 bg-cover bg-center w-40 rounded-2xl bg-brand-p1"
                    style={{
                      backgroundImage: "url('./players/dembele.png')",
                    }}
                  ></div>
                  <div className="self-end flex items-center gap-2">
                    <img
                      src="/assets/icons/Football/Team/Manchester City.png"
                      alt=""
                      className="w-15"
                    />
                    <span className="block gap-2 items-center">
                      <p className="text-white font-semibold">
                        Machester City FC
                      </p>
                      <p className="sz-8 text-snow-200">
                        Contract ends 13 June 2027
                      </p>
                    </span>
                  </div>
                </div>
                <p className="font-extrabold sz-2 flex gap-3 items-center text-white">
                  Ousmane Dembélé
                  <CheckBadgeIcon className="w-7 text-ui-pending " />
                </p>
              </div>

              {/* ----------------------------- */}

              <div className="flex-col flex items-end justify-between">
                <div className="py-2 animate-bounce px-9 h-fit w-fit align-end rounded bg-neutral-n2 flex gap-3 items-center cursor-pointer hover:bg-neutral-n4 hover:scale-110 transition-all">
                  <p className="text-white ">Follow</p>
                  <StarIcon className="w-5 text-ui-pending" />
                </div>

                <StaggerChildren className="grid grid-cols-4 gap-x-2 gap-y-4 justify-end">
                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Nationality</p>
                    <span className="flex gap-2">
                      <img
                        src="/assets/icons/United Kingdom.png"
                        alt=""
                        className="w-5 h-5"
                      />
                      <p className="text-white font-bold">England</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Born 17 Feb, 1992</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">29 Yrs</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Primary Foot</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">Right</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Shirt Number</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">11</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Position</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">Forward</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Clubs Played</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">2</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Height</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">179 cm</p>
                    </span>
                  </div>

                  <div className="bg-snow-200/20 py-1 px-4">
                    <p className="sz-8 text-snow-200">Market Value</p>
                    <span className="flex gap-2">
                      <p className="text-white font-bold">£ 96M</p>
                    </span>
                  </div>
                </StaggerChildren>
              </div>
              {/* ------------------------------ */}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col gap-3 pt-2 pb-4">
              {/* Player Image and Name Section - Vertically Centered */}
              <div className="flex items-center gap-4">
                {/* Small Image on Left */}
                <div
                  className="overflow-hidden h-20 bg-cover bg-center w-20 rounded-xl bg-brand-p1 flex-shrink-0"
                  style={{
                    backgroundImage: "url('./players/dembele.png')",
                  }}
                ></div>
                {/* Name in Middle */}
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="font-extrabold text-2xl leading-tight text-white">
                    Ousmane
                  </p>
                  <p className="font-extrabold text-2xl leading-tight text-white flex items-center gap-1">
                    Dembélé
                    <CheckBadgeIcon className="w-4 text-ui-pending flex-shrink-0" />
                  </p>
                </div>
                {/* Follow Icon Button on Right */}
                <div className="px-4 py-1.5 rounded bg-neutral-n1 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-n4 transition-all flex-shrink-0">
                  <StarIcon className="w-4 text-ui-pending" />
                  <span className="text-[9px] text-white font-medium mt-0.5">17.5k</span>
                </div>
              </div>

              {/* Club below - Left Aligned */}
              <div className="flex mt-2 items-center gap-2 pl-0">
                <img
                  src="/assets/icons/Football/Team/Manchester City.png"
                  alt=""
                  className="w-8 h-8 flex-shrink-0"
                />
                <div className="flex flex-col">
                  <p className="text-white font-semibold text-xs">
                    Machester City FC
                  </p>
                  <p className="text-[10px] text-snow-200">
                    Contract ends 13 June 2027
                  </p>
                </div>
              </div>

              {/* Key Stats - Mobile Horizontal Scroll */}
              <div className="relative -mx-4 px-4">
                <div className="overflow-x-auto hide-scrollbar">
                  <div className="flex gap-2 min-w-max">
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Position</p>
                      <p className="text-white font-bold text-xs">Forward</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Age</p>
                      <p className="text-white font-bold text-xs">29 Yrs</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Number</p>
                      <p className="text-white font-bold text-xs">11</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Nationality</p>
                      <div className="flex items-center gap-1">
                        <img
                          src="/assets/icons/United Kingdom.png"
                          alt=""
                          className="w-3 h-3"
                        />
                        <p className="text-white font-bold text-xs">England</p>
                      </div>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Primary Foot</p>
                      <p className="text-white font-bold text-xs">Right</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Clubs Played</p>
                      <p className="text-white font-bold text-xs">2</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Height</p>
                      <p className="text-white font-bold text-xs">179 cm</p>
                    </div>
                    <div className="bg-snow-200/20 py-2 px-3 rounded flex-shrink-0">
                      <p className="text-[10px] text-snow-200 mb-1">Market Value</p>
                      <p className="text-white font-bold text-xs">£ 96M</p>
                    </div>
                  </div>
                </div>
                {/* Scroll Hint Overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none flex items-center justify-end pr-2"
                  style={{
                    background: 'linear-gradient(to left, rgba(0, 0, 0, 0.4) 0%, transparent 100%)'
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-white text-[10px] font-medium">Scroll</span>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- navigation content--------------- */}
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
      {/* ----------------- navigation content end --------------- */}

      <div className="page-padding-x">
        {/* Banter Section - Common for all tabs */}
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

          {/* Content Section - Different for each tab */}
          <div className="flex flex-col gap-5 flex-5 ">
            {/* ---------------Matches Tab---------------- */}
            {activeTab === 'matches' && (
              <PlayerMatchesWidget />
            )}

            {/* ---------------profile---------------- */}
            {activeTab === 'profile' && (
              <>
            <StaggerChildren className="flex block-style divide-snow-200 dark:divide-snow-100/10  space-y-10 flex-col">
              <div className="block space-y-2">
                <div className="flex items-center text-neutral-n4 dark:text-snow-100 gap-2">
                  <InformationCircleIcon className="h-5" />
                  <p className=" sz-5 font-bold">Sport Biography</p>
                </div>
                <p className="theme-text">
                  Ousmane Dembélé is 28 years old (May 15, 1997), 178 cm tall
                  and plays for <span className="cursor-pointer hover:underline transition-all text-brand-primary italic">Paris Saint-Germain.</span>  Ousmane Dembélé prefers to
                  play with both feet. His jersey number is 10. Paris
                  Saint-Germain is playing their next match on Sep 22, 2025,
                  6:00:00 PM UTC against Olympique de Marseille - Paris
                  Saint-Germain in Ligue 1. If Ousmane Dembélé is going to be in
                  Paris Saint-Germain lineup, it will be confirmed on Sofascore
                  one hour before the match starts. If Ousmane Dembélé plays you
                  will also be able to follow his live Sofascore rating,
                  statistics and heatmap. Ousmane Dembélé football player
                  profile displays all matches and competitions with statistics
                  for all the matches Ousmane Dembélé played in. Most important
                  stats for each competition, including average Sofascore
                  rating, matches played, goals, assists, cards and other
                  relevant data are also displayed.
                </p>
              </div>

            <MonthlyRatingChart />
            <div className="block-style">
              <p className="font-bold text-lg mb-3 theme-text">Dembélé Attributes</p>
              <PlayerRadarChart />
              
            </div>
              <div className="grid md:grid-cols-2 gap-7">
                <img src="heatmap.jpg" alt="" />
                <div className="space-">
                  <p className="font-bold text-lg mb-3 theme-text">Transfer History</p>
                    <StaggerChildren className="space-y-2">
                      <div className="justify-between flex items-center">
                      <div className="flex items-center gap-4"> <img src="\assets\icons\Football\Team\Chelsea.png" className="w-10 h-10" alt="" />
                      <div className="flex theme-text flex-col">
                          <p className="font-semibold">Chelsea</p>
                          <p>20 Aug 2022</p>
                        </div>
                        </div>
                        <p className="text-ui-success font-bold text-lg">£100M</p>
                      </div>


                      <div className="justify-between flex items-center">
                      <div className="flex items-center gap-4"> <img src="\assets\icons\Football\Team\Chelsea.png" className="w-10 h-10" alt="" />
                      <div className="flex theme-text flex-col">
                          <p className="font-semibold">Chelsea</p>
                          <p>20 Aug 2022</p>
                        </div>
                        </div>
                        <p className="text-ui-success font-bold text-lg">£100M</p>
                      </div>

                      <div className="justify-between flex items-center">
                      <div className="flex items-center gap-4"> <img src="\assets\icons\Football\Team\Chelsea.png" className="w-10 h-10" alt="" />
                      <div className="flex theme-text flex-col">
                          <p className="font-semibold">Chelsea</p>
                          <p>20 Aug 2022</p>
                        </div>
                        </div>
                        <p className="text-ui-success font-bold text-lg">£100M</p>
                      </div>
                    </StaggerChildren>
                </div>
              </div>
            </StaggerChildren>
            
            <div className="flex flex-col md:flex-row gap-5 block-style">
              <div className="flex bg-ui-success/10 rounded px-3 py-4 flex-1 flex-col gap-2">
                <p className="font-bold text-lg text-ui-success">Strength</p>
                <ul className="grid grid-cols-2 font-medium theme-text list-inside">
                  <li>Anchor Play</li>
                  <li>Finishing</li>
                  <li>Set-Pieces</li>
                  <li>Long Shots</li>
                  <li>Crossing</li>
                  <li>Long Balls</li>
                  <li>Tackling</li>
                  <li>Heading</li>
                  <li>Tackling</li>
                  </ul>
              </div>
              <div className="flex bg-ui-negative/10 rounded px-3 py-4 flex-1 flex-col gap-2">
                <p className="font-bold text-lg text-ui-negative">Weakness</p>
                <ul className="grid grid-cols-2 font-medium theme-text list-inside">
                  <li>Defensive Work</li>
                  <li>Aerial Duels</li>
                  <li>Physical Strength</li>
                  <li>Consistency</li>
                  <li>Injury Prone</li>
                  <li>Decision Making</li>
                  <li>Defensive Positioning</li>
                  <li>Stamina</li>
                  <li>Leadership</li>
                  </ul>
              </div>
            </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterComp />
    </div>
  );
};

export default playerProfile;
