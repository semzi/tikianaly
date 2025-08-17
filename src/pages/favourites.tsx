import { useEffect, useState } from "react";
import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import { Category } from "../components/dasboardelements/Category";
import popularLeagues from "../data/favouriteSelect";
import allLeagues from "../data/allLeagues";
import StaggerChildren from "../animations/staggerChilderen";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Button from "../components/formelements/FormButton";

// Pulsating skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-snow-200 rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
);

export const favourite = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after 2.5 seconds
    const timer = setTimeout(() => setLoading(false), 2);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="transition-all  dark:bg-[#0D1117]">
      {/* Page Header (always visible, no skeleton) */}
      <PageHeader />
      {/* Category Navigation */}
      {loading ? (
        <div className="w-full page-padding-x pb-3">
          <Skeleton className="h-10 w-2/3 mb-4" />
        </div>
      ) : (
        <Category />
      )}

            {/* Toggle Header */}
      <div className="flex lg:hidden border-b cursor-pointer sticky top-0 backdrop-blur-2xl theme-text theme-border">
        <div
          className={`flex-1 py-3 text-center border-b-4 border-brand-secondary`}
        >
          All
        </div>
        <div
          className={`flex-1 py-3 text-center`}
        >
          Team
        </div>
        <div
          className={`flex-1 py-3 text-center`}
        >
          Players
        </div>
        <div
          className={`flex-1 py-3 text-center`}
        >
          Leagues
        </div>
      </div>
      <div className="flex page-padding-x dark:bg-[#0D1117] gap-5 py-5 justify-around">
        {/* Left Sidebar */}
        <div className="w-1/5 hidden lg:block">
          <div className="sticky top-5 h-screen flex flex-col gap-y-10 ">
            <div className="flex flex-col gap-y-10">
              {/* Popular Leagues Section */}
              <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200  rounded p-5">
                <p className="font-[500] text-[#23272A] dark:text-white">
                  Popular Leagues
                </p>
                {loading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <li
                        key={idx}
                        className="flex mt-5 items-center gap-2 mb-4"
                      >
                        <Skeleton className="w-6 h-6" />
                        <Skeleton className="w-24 h-4" />
                      </li>
                    ))
                  : popularLeagues.map((league, idx) => (
                      <li
                        key={league.name + idx}
                        className="flex mt-5 items-center gap-2 dark:text-snow-200 text-[#586069] text-sm mb-4"
                      >
                        <img src={league.icon} alt={league.name} />
                        <span>{league.name}</span>
                      </li>
                    ))}
              </ul>

              {/* All Leagues Section */}
              <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200 rounded p-5">
                <div className="flex items-center my-auto">
                  <p className="font-[500] dark:text-white text-[#23272A]">
                    All Leagues
                  </p>
                  <img
                    src="/assets/icons/search-black.png"
                    className="w-[17px] h-[17px] ml-auto align-basel"
                    alt=""
                  />
                </div>
                {loading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <li
                        key={idx}
                        className="flex mt-5 items-center gap-2 mb-4"
                      >
                        <Skeleton className="w-6 h-6" />
                        <Skeleton className="w-24 h-4 flex-1" />
                        <Skeleton className="w-4 h-4" />
                      </li>
                    ))
                  : allLeagues.map((league, idx) => (
                      <li
                        key={league.name + idx}
                        className="flex mt-5 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-4"
                      >
                        <img src={league.icon} alt={league.name} />
                        <span className="flex-1">{league.name}</span>
                        <img
                          src="/assets/icons/expand-up-down-line 1.png"
                          className="cursor-pointer ml-auto align-basel "
                          alt={league.name}
                        />
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full flex flex-col gap-y-5 lg:w-3/5">
          <div className="hidden md:block block-style ">
            {loading ? (
              <div>
                <Skeleton className="h-6 w-1/3 mb-3" />
                <div className="flex gap-3">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="flex dark:text-snow-200 justify-center flex-col">
                {" "}
                {/* Filter Buttons */}
                <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
                  <div className=" dark:text-snow-200 overflow-x-hidden flex gap-3 w-full hide-scrollbar">
                    <button className="filter-btn bg-brand-secondary border-none text-white dark:border-[#1F2937]">
                      All
                    </button>
                    <button className="filter-btn  dark:border-[#1F2937]">
                      Leagues
                    </button>
                    <button className="filter-btn  dark:border-[#1F2937]">
                      Teams
                    </button>
                    <button className="filter-btn  dark:border-[#1F2937]">
                      Players
                    </button>
                    <button className="filter-btn  dark:border-[#1F2937]">
                      Nation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>



          {/* Main Content Games Loop */}
          <div className="flex flex-col gap-6">
            {/* Desktop Section */}
            <div className="bg-white border-1 dark:bg-[#161B22] dark:border-[#1F2937] border-snow-200 rounded">
              <StaggerChildren
                className="grid max-h-[280px] hide-scrollbar overflow-y-auto grid-cols-3 p-5 gap-4 text-center items-stretch"
                stagger={0.15}
              >
                {popularLeagues.map((league, idx) => (
                  <div
                    key={league.name + idx}
                    className="game-block flex flex-col text-center gap-3 theme-text text-sm"
                  >
                    <img
                      src={league.icon}
                      alt={league.name}
                      className="mx-auto w-8"
                    />
                    <span className="text-center">{league.name}</span>
                  </div>
                ))}
              </StaggerChildren>

              <div className="border-t drop-shadow-[0_-4px_6px_rgba(0,0,0,0.02)] h-fit w-full bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-snow-200 rounded-b p-5 pt-2 pb-0">
                <div className="flex pt-3 overflow-x-auto hide-scrollbar gap-6 ">
                  <div className="hover:translate-y-[-6px] transition-transform">
                    <div className="w-10 h-10 shadow-lg bg-body border-dotted border border-snow-200">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="w-full  h-full"
                      />
                    </div>
                    <XCircleIcon className="h-5 w-5 cursor-pointer bg-white text-brand-primary rounded-full relative bottom-12 left-7" />
                  </div>

                  <div>
                    <div className="w-10 h-10 shadow-lg bg-body border-dotted border border-snow-200">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="w-full  h-full"
                      />
                    </div>
                    <XCircleIcon className="h-5 w-5 cursor-pointer bg-white text-brand-primary rounded-full relative bottom-12 left-7" />
                  </div>

                  <div>
                    <div className="w-10 h-10 shadow-lg bg-body border-dotted border border-snow-200">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="w-full  h-full"
                      />
                    </div>
                    <XCircleIcon className="h-5 w-5 cursor-pointer bg-white text-brand-primary rounded-full relative bottom-12 left-7" />
                  </div>

                  <div>
                    <div className="w-10 h-10 shadow-lg bg-body border-dotted border border-snow-200">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="w-full  h-full"
                      />
                    </div>
                    <XCircleIcon className="h-5 w-5 cursor-pointer bg-white text-brand-primary rounded-full relative bottom-12 left-7" />
                  </div>

                  <div>
                    <div className="w-10 h-10 shadow-lg bg-body border-dotted border border-snow-200">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="w-full  h-full"
                      />
                    </div>
                    <XCircleIcon className="h-5 w-5 cursor-pointer bg-white text-brand-primary rounded-full relative bottom-12 left-7" />
                  </div>

                  <div>
                    <div className="w-10 h-10 shadow-lg bg-body border-dotted border border-snow-200">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="w-full  h-full"
                      />
                    </div>
                    <XCircleIcon className="h-5 w-5 cursor-pointer bg-white text-brand-primary rounded-full relative bottom-12 left-7" />
                  </div>

                  <div>
                    <div className="w-10 h-10 shadow-lg bg-body border-dotted border border-snow-200">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="w-full  h-full"
                      />
                    </div>
                    <XCircleIcon className="h-5 w-5 cursor-pointer bg-white text-brand-primary rounded-full relative bottom-12 left-7" />
                  </div>

                  <div>
                    <div className="w-10 h-10 shadow-lg bg-body border-dotted border border-snow-200">
                      <img
                        src="/players/Sasha Vezenkov.png"
                        alt=""
                        className="w-full  h-full"
                      />
                    </div>
                    <XCircleIcon className="h-5 w-5 cursor-pointer bg-white text-brand-primary rounded-full relative bottom-12 left-7" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-5 mb-5">
                <Button  label="Skip" className="btn-outline bg-transparent text-brand-primary border-brand-primary" />
                <Button  label="Next" className="btn-primary text-white border-brand-primary" />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 hidden lg:block">
          <div className="flex flex-col gap-y-10">
            {/* News Section */}
            <ul className="block-style ">
              {loading ? (
                <>
                  <Skeleton className="h-5 w-32 mb-4" />
                  <div className="flex flex-col gap-y-3 mb-5">
                    <Skeleton className="mt-4 w-full h-32 rounded" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="flex-col flex gap-5">
                    {/* single news column skeleton */}
                    <div className="flex border-y-1 border-snow-200 py-5 items-center gap-3">
                      <Skeleton className="w-24 h-20 rounded" />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                    {/* single news column skeleton */}
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-24 h-20 rounded" />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-[500] dark:text-snow-200 text-[#23272A]">
                    Latest News
                  </p>
                  <div className="flex text-neutral-n4 flex-col gap-y-3 mb-5">
                    <div className='image mt-4 w-full bg-[url("/assets/icons/mbape.png")] bg-cover bg-top h-32 rounded'></div>
                    <p className="sz-6 dark:text-white font-[500]">
                      Kylian Mbappe Scores third goal in UCL win
                    </p>
                    <div className="flex dark:text-snow-200 gap-2 sz-8 ">
                      <span>6 hours ago</span>
                      <span>|</span>
                      <span>6 mins read</span>
                    </div>
                  </div>
                  <div className="flex-col flex gap-5">
                    {/* single news column */}
                    <div className="flex border-y-1 dark:border-[#1F2937] border-snow-200 py-5 items-center gap-3 text-neutral-n4">
                      <div className='image w-50 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div className="">
                        <p className="sz-8 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">
                          6 hours ago
                        </span>
                      </div>
                    </div>
                    {/* end of news col */}
                    {/* single news column */}
                    <div className="flex  items-center gap-3 text-neutral-n4">
                      <div className='image w-50 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div>
                        <p className="sz-8 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">
                          6 hours ago
                        </span>
                      </div>
                    </div>
                    {/* end of news col */}
                  </div>
                </>
              )}
            </ul>

            {/* Download  Section */}
            <div className="h-screen ">
              <ul className="block-style ">
                <p className="font-[500] dark:text-snow-200  mb-3 text-[#23272A]">
                  Download our Mobile App
                </p>
                <div className="flex flex-col gap-3">
                  <img src="\assets\icons\Group 1261157024.png" alt="" />
                  <img
                    src="\assets\icons\Frame 1261157588.png"
                    className="cursor-pointer"
                    alt=""
                  />
                  <img
                    src="\assets\icons\Frame 1261157587.png"
                    className="cursor-pointer"
                    alt=""
                  />
                </div>
              </ul>
              <div className="h-[180ch]">
                <ul className="block-style sticky top-5 mt-7  h-fit">
                  <p className="font-[500] dark:text-snow-200  mb-3 text-[#23272A]">
                    Chat with our AI Buddy
                  </p>
                  <div className="flex flex-col gap-3">
                    <img src="\assets\icons\Chat bot-bro 1.png" alt="" />
                    <img
                      src="\assets\icons\Secondary.png"
                      className="cursor-pointer"
                      alt=""
                    />
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {loading ? (
        <div className="page-padding-x py-10">
          <Skeleton className="h-8 w-1/3 mb-3" />
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ) : (
        <FooterComp />
      )}
    </div>
  );
};

export default favourite;
