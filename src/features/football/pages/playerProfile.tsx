import StaggerChildren from "@/animations/staggerChildren";
import PageHeader from "@/components/layout/PageHeader";
import { navigate } from "@/lib/router/navigate";
import PlayerRadarChart from "@/visualization/PlayerRadarChart";
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
    { id: "season", label: "Season" },
  ];
  // Load from localStorage (fallback to "commentary")
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("activeTab") || "overview"
  );

  // Save whenever activeTab changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />
      <div className="bg-brand-secondary">
        <div
          className="overflow-hidden h-80 bg-cover bg-center w-full"
          style={{
            backgroundImage: "url('./players/Picture.png')",
          }}
        >
          <div className="w-full bg-black/30 backdrop-blur-3xl h-full  page-padding-x">
            <div className="justify-between flex py-5">
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

            <div className="flex justify-between">
              {/* ---------------------------- */}
              <div className="flex flex-col  gap-1">
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
          </div>
        </div>
      </div>

      {/* ----------------- navigation content--------------- */}
      <div className="flex z-10 h-12 w-full overflow-y-hidden md:gap-5 md:items-center md:justify-center overflow-x-auto bg-brand-p3/30 dark:bg-brand-p2 backdrop-blur-2xl cursor-pointer sticky top-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm  transition-colors ${
              activeTab === tab.id
                ? "text-orange-500 font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}
            style={{ flexShrink: 0 }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* ----------------- navigation content end --------------- */}

      <div className="page-padding-x">
        {/* ---------------profile---------------- */}
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
          <div className="flex flex-col gap-5 flex-5 ">
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

              <div className="grid grid-cols-2 gap-7">
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
            <div className="block-style">
              <p className="font-bold text-lg mb-3 theme-text">Dembélé Attributes</p>
              <PlayerRadarChart />
            </div>
            <div className="flex gap-5 block-style">
              <div className="flex bg-ui-success/10 rounded px-3 py-4 flex-1 flex-col gap-2">
                <p className="font-bold text-lg text-ui-success">Strenght</p>
                <ul className="grid grid-cols-2 font-semibold theme-text list-inside">
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
                <ul className="grid grid-cols-2 font-semibold theme-text list-inside">
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
            
          </div>
        </div>
        {/* --------------profile end ---------------------- */}
      </div>
    </div>
  );
};

export default playerProfile;
