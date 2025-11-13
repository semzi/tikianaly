import StaggerChildren from "@/animations/staggerChildren";
import FooterComp from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import {
  ArrowLeftIcon,
  BellAlertIcon,
  CheckBadgeIcon,
  InformationCircleIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Form/FormButton";
import { ArrowUp } from "lucide-react";
import { navigate } from "@/lib/router/navigate";

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

export const gameInfo = () => {
  const tabs = [
    { id: "timeline", label: "Timeline" },
    { id: "overview", label: "Overview" },
    { id: "commentary", label: "Commentary" },
    { id: "lineup", label: "Line up" },
    { id: "statistics", label: "Statistics" },
    { id: "headtohead", label: "Head To Head" },
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
          <div className="flexitems-center md:items-end flex-col">
            <div className="flex-col-reverse  flex sz-7 md:flex-row md:mr-2 mdtext-[20px] md:font-light md:justify-end items-center font-semibold  md:gap-3">
              <p className="text-center">Manchester City</p>
              <img
                src="/assets/icons/Football/Team/Manchester City.png"
                alt=""
                className="h-[65px]"
              />
            </div>
            <div className="md:flex gap-3 hidden items-start justify-end mt-1">
              <StaggerChildren className="flex font-light text-[12px] flex-col text-right">
                <p>T. Reijders 2', 7'</p>
                <p>E. Haaland 14', 25'</p>
                <p>Silva 15' (P)</p>
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
            <p className="text-center block md:hidden bg-brand-secondary/70 w-fit mx-auto px-2">15:45</p>
          <div className="flex sz-2  justify-center items-start gap-3">
            <p>5</p>
            <p>-</p>
            <p>2</p>
          </div>
            <p className="text-center block md:hidden">First Half</p>
          </div>

          {/* Away team (left aligned) */}
          <div className="flex items-center md:items-start flex-col">
            <div className="flex-col-reverse flex sz-7 md:flex-row md:mr-2 mdtext-[20px] md:font-light md:justify-start items-center font-semibold  md:gap-3">
              <p className="text-center">Arsenal</p>
              <img
                src="/assets/icons/Football/Team/Arsenal.png"
                alt=""
                className="h-[65px]"
              />
            </div>

            <div className="md:flex hidden gap-3 justify-start mt-1">
              <img
                src="./icons/football-line-1.svg"
                className=" w-4 invert sepia"
                alt=""
              />
              <StaggerChildren className="flex font-light sz-8 flex-col text-left">
                <p>Gabriel 2', 7'</p>
              </StaggerChildren>
            </div>
          </div>
        </div>


        <div className="flex text-white md:hidden mb-7 gap-5">
          <div className="flex flex-1 gap-3 items-start justify-end mt-1">
            <StaggerChildren className="flex font-light text-[12px] flex-col text-right">
              <p>T. Reijders 2', 7'</p>
              <p>E. Haaland 14', 25'</p>
              <p>Silva 15' (P)</p>
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
              <p>T. Reijders 2', 7'</p>
            </StaggerChildren>
          </div>
        </div>

        <div className="md:flex-row flex flex-col mt-4 md:mt-0 sz-8 items-center  text-white mb-3 justify-center  md:gap-10">
          <div className="flex gap-2 items-center">
            <img
              src="/assets/icons/Football/League/Rectangle 6.png"
              className="w-4 invert sepia"
              alt=""
            />
            <p>Premier League, Matchday 16</p>
          </div>
          <div className="flex gap-2 items-center">
            <img
              src="./icons/soccer-field-1.svg"
              className=" w-4 invert sepia"
              alt=""
            />
            <p>Football, Germany, Bundesliga, Round 24</p>
          </div>
          <div className="flex gap-2 items-center">
            <img
              src="./icons/Whistle.svg"
              className=" w-4 invert sepia"
              alt=""
            />
            <p>Ranjan Madugalle</p>
          </div>
        </div>
      </div>

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

      <div className="page-padding-x">
        {/* --------------------------- overview -------------------------------------- */}
        {activeTab === "overview" && (
          <div className="flex  mt-6 mb-20 flex-col gap-10">
            <div className="sz-8 flex flex-col md:flex-row gap-7">
              <div className="grid grid-cols-1 md:grid-cols-2 justify-between flex-5 gap-4 block-style">
                <img src="./icons/stadium.png" className="" alt="" />

                <StaggerChildren className="flex gap-1 flex-col">
                  <div className="flex items-center gap-2">
                    <img
                      src="./icons/calendar-line-1.svg"
                      className=" w-4 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Date:</p>
                      <p className="theme-text">Feb 27, 2025 - 9:35PM</p>
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
                        Football, Germany, Bundesliga, Round 24
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="./icons/Whistle.svg"
                      className=" w-4 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Refree:</p>
                      <p className="theme-text">Ranjan Madugalle</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="./icons/team-line-1.svg"
                      className="w-5 h-5 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Attendance:</p>
                      <p className="theme-text">33,675</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="./icons/soccer-field-1.svg"
                      className="w-5 h-5 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Stadium:</p>
                      <p className="theme-text">
                        National Stadium, Stuttgart, Germany
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="./icons/soccer-field-1.svg"
                      className="w-5 h-5 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Surface:</p>
                      <p className="theme-text">Grass</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      src="./icons/location.svg"
                      className="w-5 h-5 theme-icon"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <p className="text-neutral-m6">Location:</p>
                      <p className="theme-text">Kaj Zartows Vej 5, Herning</p>
                    </div>
                  </div>
                </StaggerChildren>
              </div>

              <div className="flex flex-2 gap-2 flex-col block-style">
                <div className="flex items-center gap-2">
                  <img
                    src="./icons/calendar-line-1.svg"
                    className=" w-4 theme-icon"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-m6">Date:</p>
                    <p className="theme-text">Feb 27, 2025 - 9:35PM</p>
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
                      Football, Germany, Bundesliga, Round 24
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src="./icons/Whistle.svg"
                    className=" w-4 theme-icon"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-m6">Refree:</p>
                    <p className="theme-text">Ranjan Madugalle</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src="./icons/team-line-1.svg"
                    className="w-5 h-5 theme-icon"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-m6">Attendance:</p>
                    <p className="theme-text">33,675</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src="./icons/team-line-1.svg"
                    className="w-5 h-5 theme-icon"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-m6">Attendance:</p>
                    <p className="theme-text">33,675</p>
                  </div>
                </div>
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

              <div className="flex flex-col gap-2 block-style">
                {/* -------------------------------------- */}
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
          <div className="flex mb-8 mt-3 flex-col gap-8">
            <div className="block">
              <div className="flex gap-x-5 mb-5">
                <Button
                  label="Manchester City"
                  className="btn-primary text-white border-brand-primary"
                />

                <Button
                  label="Arsenal"
                  className="btn-outline bg-transparent text-neutral-m6 border-neutral-m6 hover:bg-brand-secondary hover:text-white hover:border-brand-secondary"
                />
              </div>
              <div className="w-full flex bg-brand-p4 py-2 px-5 justify-between">
                <div className="flex gap-3">
                  <CheckBadgeIcon className="w-5 text-ui-success" />
                  <p className="text-neutral-n4">Confirmed Line-Up</p>
                </div>
                <p className="text-neutral-n4">4-3-2-1</p>
              </div>
            </div>

            <div
              className="relative overflow-hidden h-auto bg-cover bg-center w-full"
              style={{
                aspectRatio: "612/389", // Adjust to your field.jpeg's aspect ratio
                backgroundImage: "url('./pitch.jpg')",
                minHeight: "300px", // fallback for small screens
              }}
            >
              <div className="flex flex-col w-16 text-center gap-1 absolute font-bold items-center right-50 top-9 text-white">
                <div className="rounded-full py-2 px-5 text-neutral-n2 w-fit  sz-4 bg-white border-4 border-neutral-n4">
                  1
                </div>
                <p className="whitespace-break-spaces">Michael Owen</p>
              </div>
              <div className="flex flex-col w-16 text-center gap-1 absolute font-bold items-center right-80 top-50 text-white">
                <div className="rounded-full py-2 px-5 text-neutral-n2 w-fit  sz-4 bg-white border-4 border-neutral-n4">
                  1
                </div>
                <p className="whitespace-break-spaces">Michael Owen</p>
              </div>
              <div className="flex flex-col w-16 text-center gap-1 absolute font-bold items-center right-120 top-90 text-white">
                <div className="rounded-full py-2 px-5 text-neutral-n2 w-fit  sz-4 bg-white border-4 border-neutral-n4">
                  1
                </div>
                <p className="whitespace-break-spaces">Michael Owen</p>
              </div>

              <div className="flex flex-col w-16 text-center gap-1 absolute font-bold items-center left-50 top-9 text-white">
                <div className="rounded-full py-2 px-5 text-neutral-n2 w-fit  sz-4 bg-ui-pending border-4 border-snow-200">
                  1
                </div>
                <p className="whitespace-break-spaces">Michael Owen</p>
              </div>
              <div className="flex flex-col w-16 text-center gap-1 absolute font-bold items-center left-100 top-50 text-white">
                <div className="rounded-full py-2 px-5 text-neutral-n2 w-fit  sz-4 bg-ui-pending border-4 border-snow-200">
                  1
                </div>
                <p className="whitespace-break-spaces">Michael Owen</p>
              </div>
              <div className="flex flex-col w-16 text-center gap-1 absolute font-bold items-center left-120 top-90 text-white">
                <div className="rounded-full py-2 px-5 text-neutral-n2 w-fit  sz-4 bg-ui-pending border-4 border-snow-200">
                  1
                </div>
                <p className="whitespace-break-spaces">Michael Owen</p>
              </div>
            </div>

            <div className="block-style">
              <div className="flex gap-2 mb-1">
                <p className="theme-text">Coach</p>
                <InformationCircleIcon className="w-4 theme-text opacity-45 cursor-pointer" />
              </div>
              <div className="flex gap-1 flex-col">
                <div className="flex gap-3 items-center">
                  <img
                    src="/assets/icons/Football/Team/Manchester City.png"
                    alt=""
                    className="h-10"
                  />
                  <p className="theme-text sz-6">Pep Guardiola</p>
                </div>
                <div className="w-full border-1 border-snow-200/50"></div>

                <div className="flex gap-1 mt-5 mb-4">
                  <p className="theme-text">Line-Up</p>
                  <InformationCircleIcon className="w-4 theme-text opacity-45 cursor-pointer" />
                </div>

                {/* ----------------------p1------ */}

                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="grid grid-cols-2">
                      <p className="w-10 px-2 justify-end text-neutral-m6">
                        11
                      </p>
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                    </div>
                    <p className="theme-text sz-6">Rico Lewis</p>
                  </div>

                  <div className="flex gap-2">
                    <div className="h-6 w-6 bg-ui-pending"></div>
                    <ArrowUp className="text-ui-success " />
                  </div>
                </div>
                {/* ----------------------p1------ */}

                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="grid grid-cols-2">
                      <p className="w-10 px-2 justify-end text-neutral-m6">
                        11
                      </p>
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                    </div>
                    <p className="theme-text sz-6">Rico Lewis</p>
                  </div>

                  <div className="flex gap-2">
                    {/* <div className="h-6 w-6 bg-ui-pending"></div>
                  <ArrowDown className="text-ui-negative "/> */}
                  </div>
                </div>
                {/* ----------------------p1------ */}

                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="grid grid-cols-2">
                      <p className="w-10 px-2 justify-end text-neutral-m6">
                        45
                      </p>
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                    </div>
                    <p className="theme-text sz-6">Rico Lewis</p>
                  </div>

                  <div className="flex gap-2">
                    <div className="h-6 w-6 bg-ui-negative"></div>
                    {/* <ArrowUp className="text-ui-success "/> */}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-5 flex-col">
                <div className="flex gap-1 mt-5 mb-4">
                  <p className="theme-text">Substitute</p>
                  <InformationCircleIcon className="w-4 theme-text opacity-45 cursor-pointer" />
                </div>

                {/* ----------------------p1------ */}

                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="grid grid-cols-2">
                      <p className="w-10 px-2 justify-end text-neutral-m6">
                        11
                      </p>
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                    </div>
                    <p className="theme-text sz-6">Rico Lewis</p>
                  </div>

                  <div className="flex gap-2">
                    {/* <div className="h-6 w-6 bg-ui-pending"></div>
                  <ArrowUp className="text-ui-success "/> */}
                  </div>
                </div>
                {/* ----------------------p1------ */}

                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="grid grid-cols-2">
                      <p className="w-10 px-2 justify-end text-neutral-m6">
                        11
                      </p>
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                    </div>
                    <p className="theme-text sz-6">Rico Lewis</p>
                  </div>

                  <div className="flex gap-2">
                    {/* <div className="h-6 w-6 bg-ui-pending"></div> */}
                    <ArrowUp className="text-ui-success " />
                  </div>
                </div>
                {/* ----------------------p1------ */}

                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="grid grid-cols-2">
                      <p className="w-10 px-2 justify-end text-neutral-m6">
                        11
                      </p>
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="h-7 rounded-full"
                      />
                    </div>
                    <p className="theme-text sz-6">Rico Lewis</p>
                  </div>

                  <div className="flex gap-2">
                    {/* <div className="h-6 w-6 bg-ui-negative"></div>
                  <ArrowUp className="text-ui-success "/> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
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

        {activeTab === "headtohead" && <p>Head to Head content goes here...</p>}

        {/* -------------------------------------------------------headtohead end-------------------------------------------------------- */}

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
                    <div className="flex text-right flex-col">
                      <p className="theme-text">E. Haaland</p>
                      <p className="text-neutral-m6">Silva</p>
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
                      <p className="text-neutral-m6">Silva</p>
                    </div>
                    <div className="block">
                      <p className="text-[8px] font-semibold theme-text">PEN</p>
                      <img
                        src="./icons/football-line-1.svg"
                        className="w-4 red-icon"
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
                    <div className="flex text-right flex-col">
                      <p className="theme-text">E. Haaland</p>
                      <p className="text-neutral-m6">Silva</p>
                    </div>
                    <div className="block">
                      <img
                        src="./icons/football-line-1.svg"
                        className="w-4 theme-icon"
                        alt=""
                      />
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
