import { useEffect, useState } from "react";
import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import { Category } from "../components/dasboardelements/Category";
import gamesData from "../data/games";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Leftbar from "../components/dasboardelements/leftBar";
import { RightBar } from "../components/dasboardelements/rightBar";
import { Link } from "react-router-dom";

// Pulsating skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-snow-200 rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
);

export const dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after 2.5 seconds
    const timer = setTimeout(() => setLoading(false), 2);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="transition-al">
      {/* Page Header (always visible, no skeleton) */}
      <PageHeader />
      {/* Category Navigation */}
      <Category />

      <div className="flex page-padding-x dark:bg-[#0D1117] gap-5 py-5 justify-around">
        {/* Left Sidebar */}
        <Leftbar />

        {/* Main Content Area */}
        <div className="w-full flex flex-col gap-y-5 lg:w-3/5">
          {/* Date and Filter Controls */}
          <div className="block-style ">
            <div className="flex dark:text-snow-200 justify-center flex-col">
              {/* Date Navigation */}
              <div className="flex items-center mb-3 justify-between">
                <ArrowLeftIcon className="text-neutral-n4 h-5" />
                <div className="flex gap-3  items-center">
                  <p>Today</p>
                  <CalendarIcon className="text-neutral-n4 h-5" />
                </div>
                <ArrowRightIcon className="text-neutral-n4 h-5" />
              </div>
              {/* Filter Buttons */}
              <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
                <div
                  className=" dark:text-snow-200 overflow-x-hidden flex gap-3 w-full"
                  style={{
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE 10+
                  }}
                >
                  <button className="filter-btn dark:border-[#1F2937]">
                    Live Games
                  </button>
                  <button className="filter-btn  dark:border-[#1F2937]">
                    By Date
                  </button>
                  <button className="filter-btn  dark:border-[#1F2937]">
                    Other Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Games Loop */}
          <div className="flex flex-col gap-6">
            {/* Desktop Section */}
            <div className="hidden md:block">
              {loading ? (
                <div className="block-style">
                  {/* Skeleton for league title */}
                  <div className="flex gap-3 border-b-1 px-5 py-3 border-snow-200">
                    <Skeleton className="w-10 h-10" />
                    <Skeleton className="w-32 h-6" />
                  </div>
                  {/* Skeleton for games */}
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex justify-around items-center gap-10 border-b-1 px-5 py-3 border-snow-200 last:border-b-0"
                    >
                      <Skeleton className="w-8 h-4" />
                      <div className="flex flex-3/9 justify-end items-center gap-3">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-8 h-8" />
                        <Skeleton className="w-8 h-4" />
                      </div>
                      <div className="flex flex-4/9 justify-start items-center gap-3">
                        <Skeleton className="w-8 h-4" />
                        <Skeleton className="w-8 h-8" />
                        <Skeleton className="w-20 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                gamesData.map((league, leagueIdx) => (
                  <div
                    key={league.league.name + leagueIdx}
                    className="block-style"
                  >
                    {/* League Title */}
                    <div className="flex gap-3 border-b-1 px-5 py-3  border-snow-200 dark:border-[#1F2937]">
                      <img src={league.league.icon} className="w-fit" alt="" />
                      <p className="font-[500] text-[#23272A] dark:text-neutral-m6  text-[14px] md:text-base">
                        {league.league.name}
                      </p>
                    </div>
                    {/* Games */}
                    {league.games.map((game, gameIdx) => (
                      <Link
                        to={`/overview`}
                        key={gameIdx}
                        className={`flex hover:bg-snow-100 dark:hover:bg-neutral-n2 cursor-pointer transition-colors items-center gap-2 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 ${
                          gameIdx === league.games.length - 1
                            ? "last:border-b-0  border-b-0"
                            : ""
                        }`}
                      >
                        {/* If live, show time and scores; if upcoming, show time at center */}
                        {game.status === "live" ? (
                          <>
                            <p className="text-brand-secondary animate-pulse flex-1/11 font-bold">
                              {game.time}
                            </p>
                            <div className="flex dark:text-white flex-4/11 justify-end items-center gap-3">
                              <p>{game.home.name}</p>
                              <img
                                src={game.home.icon}
                                alt=""
                                className="w-fit mr-1"
                              />
                            </div>
                            <div className="flex-2/11 flex  justify-between">
                              <p className="score">{game.home.score}</p>
                              <p className="score">{game.away.score}</p>
                            </div>
                            <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                              <img
                                src={game.away.icon}
                                alt=""
                                className="w-fit"
                              />
                              <p>{game.away.name}</p>
                            </div>
                          </>
                        ) : (
                          // Upcoming game: show time at center, no scores
                          <>
                            {/* <p className="text-brand-secondary flex-1/11 font-bold"></p> */}
                            <div className="flex dark:text-white flex-5/11 justify-end items-center gap-3">
                              <p>{game.home.name}</p>
                              <img
                                src={game.home.icon}
                                alt=""
                                className="w-fit"
                              />
                            </div>
                            <p className="neutral-n1 flex-2/11 items-center whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200">
                              {game.time}
                            </p>
                            <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                              <img
                                src={game.away.icon}
                                alt=""
                                className="w-fit"
                              />
                              <p>{game.away.name}</p>
                            </div>
                          </>
                        )}
                      </Link>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Mobile Section */}
            {loading ? (
              // --- Mobile Games Skeleton ---
              <div className="bg-white dark:bg-[#161B2[] border-1 block md:hidden h-fit flex-col border-snow-200 rounded">
                {/* League Title Skeleton */}
                <div className="flex gap-3 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 items-center">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="h-4 w-24" />
                </div>
                {/* Games Skeleton */}
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b-1 border-snow-200 px-3 py-2 last:border-b-0 bg-neutral-n9"
                  >
                    {/* Time Skeleton */}
                    <Skeleton className="w-12 h-4" />
                    {/* Teams Skeleton */}
                    <div className="flex flex-col flex-1 mx-2 gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-9 h-9" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-5 w-8" />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-9 h-9" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-5 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              gamesData.map((league, leagueIdx) => (
                <div
                  key={league.league.name + leagueIdx}
                  className="bg-white text-sm dark:bg-[#161B22] dark:border-[#1F2937] border-1 block md:hidden h-fit flex-col border-snow-200 rounded"
                >
                  {/* League Title */}
                  <div className="flex gap-3 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200">
                    <img src={league.league.icon} className="w-fit" alt="" />
                    <p className="font-[500] text-[#23272A] dark:text-snow-200 text-[14px] md:text-base">
                      {league.league.name}
                    </p>
                  </div>
                  {/* Games */}
                  {league.games.map((game, gameIdx) => (
                    <Link
                        to={`/overview`}
                        key={gameIdx}
                      className="flex items-center justify-between dark:border-[#1F2937] border-b-1 border-snow-200 px-3 py-2 last:border-b-0 bg-neutral-n9"
                    >
                      {/* Time */}
                      {game.status === "live" ? (
                        <p className="text-xs text-brand-secondary animate-pulse text-center w-10 font-semibold">
                          {game.time}
                        </p>
                      ) : (
                        <p className="text-xs dark:text-snow-200 text-neutral-n4 text-center w-10 font-semibold">
                          {game.time}
                        </p>
                      )}
                      {/* Teams */}
                      <div className="flex  flex-col flex-1 mx-2">
                        <div className="flex  items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={game.home.icon}
                              alt={game.home.name}
                              className="w-9 h-9"
                            />
                            <span className="font-[500] h  dark:text-white text-neutral-n4">
                              {game.home.name}
                            </span>
                          </div>
                          {game.status === "live" ? (
                            <p className="score">{game.home.score}</p>
                          ) : (
                            <p className="score">-</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={game.away.icon}
                              alt={game.away.name}
                              className="w-9 h-9"
                            />
                            <span className="font-[500] dark:text-white text-neutral-n4">
                              {game.away.name}
                            </span>
                          </div>
                          {game.status === "live" ? (
                            <p className="score">{game.away.score}</p>
                          ) : (
                            <p className="score">-</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <RightBar />
      </div>

      {/* Footer */}
      <FooterComp />
    </div>
  );
};

export default dashboard;
