import { useEffect, useState } from "react";
import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import { Category } from "../components/dasboardelements/Category";
import popularLeagues from "../data/popularLeagues";
import allLeagues from "../data/allLeagues";
import gamesData from "../data/games";

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
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-x-hidden">
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

      <div className="flex page-padding-x gap-5 py-5 justify-around">
        {/* Left Sidebar */}
        <div className="w-1/5 hidden lg:block">
          <div className="flex flex-col gap-y-10">
            {/* Popular Leagues Section */}
            <ul className="bg-white border-1 h-fit border-snow-200 rounded p-5">
              <p className="font-[500] text-[#23272A]">Popular Leagues</p>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <li key={idx} className="flex mt-5 items-center gap-2 mb-4">
                      <Skeleton className="w-6 h-6" />
                      <Skeleton className="w-24 h-4" />
                    </li>
                  ))
                : popularLeagues.map((league, idx) => (
                    <li
                      key={league.name + idx}
                      className="flex mt-5 items-center gap-2 text-[#586069] text-sm mb-4"
                    >
                      <img src={league.icon} alt={league.name} />
                      <span>{league.name}</span>
                    </li>
                  ))}
            </ul>

            {/* All Leagues Section */}
            <ul className="bg-white border-1 h-fit border-snow-200 rounded p-5">
              <div className="flex items-center my-auto">
                <p className="font-[500] text-[#23272A]">All Leagues</p>
                <img
                  src="/assets/icons/search-black.png"
                  className="w-[17px] h-[17px] ml-auto align-basel"
                  alt=""
                />
              </div>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <li key={idx} className="flex mt-5 items-center gap-2 mb-4">
                      <Skeleton className="w-6 h-6" />
                      <Skeleton className="w-24 h-4 flex-1" />
                      <Skeleton className="w-4 h-4" />
                    </li>
                  ))
                : allLeagues.map((league, idx) => (
                    <li
                      key={league.name + idx}
                      className="flex mt-5 items-center gap-2 text-[#586069] text-sm mb-4"
                    >
                      <img src={league.icon} alt={league.name} />
                      <span className="flex-1">{league.name}</span>
                      <img
                        src="/assets/icons/expand-up-down-line 1.png"
                        className="cursor-pointer ml-auto align-basel"
                        alt={league.name}
                      />
                    </li>
                  ))}
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full flex flex-col gap-y-5 lg:w-3/5">
          {/* Date and Filter Controls */}
          <div className="bg-white border-1 h-fit border-snow-200 rounded p-5">
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
              <div className="flex justify-center flex-col">
                {/* Date Navigation */}
                <div className="flex items-center mb-3 justify-between">
                  <img src="\assets\icons\left.png" alt="" />
                  <div className="flex gap-3 text-neutral-n5 items-center">
                    <p>Today</p>
                    <img src="\assets\icons\calender.png" alt="" />
                  </div>
                  <img src="\assets\icons\right.png" alt="" />
                </div>
                {/* Filter Buttons */}
                <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
                  <div
                    className="overflow-x-hidden flex gap-3 w-full"
                    style={{
                      scrollbarWidth: "none", // Firefox
                      msOverflowStyle: "none", // IE 10+
                    }}
                  >
                    <button className="filter-btn">Live Games</button>
                    <button className="filter-btn">By Date</button>
                    <button className="filter-btn">Other Filters</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Games Loop */}
          <div className="flex flex-col gap-6">
            {/* Desktop Section */}
            {loading ? (
              <div className="bg-white hidden md:block border-1 h-fit flex-col border-snow-200 rounded">
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
                  className="bg-white hidden md:block border-1 h-fit flex-col border-snow-200 rounded"
                >
                  {/* League Title */}
                  <div className="flex gap-3 border-b-1 px-5 py-3 border-snow-200">
                    <img src={league.league.icon} className="w-fit" alt="" />
                    <p className="font-[500] text-[#23272A] text-[14px] md:text-base">
                      {league.league.name}
                    </p>
                  </div>
                  {/* Games */}
                  {league.games.map((game, gameIdx) => (
                    <div
                      key={gameIdx}
                      className={`flex justify-around items-center gap-10 border-b-1 px-5 py-3 border-snow-200 ${
                        gameIdx === league.games.length - 1
                          ? "last:border-b-0 border-b-0"
                          : ""
                      }`}
                    >
                      {/* If live, show time and scores; if upcoming, show time at center */}
                      {game.status === "live" ? (
                        <>
                          <p className="text-brand-secondary flex-1/9 font-bold">
                            {game.time}
                          </p>
                          <div className="flex flex-3/9 justify-end items-center gap-3">
                            <p>{game.home.name}</p>
                            <img
                              src={game.home.icon}
                              alt=""
                              className="w-fit mr-1"
                            />
                            <p className="neutral-n1 font-bold py-0.5 px-2 bg-snow-200">
                              {game.home.score}
                            </p>
                          </div>
                          <div className="flex flex-4/9 justify-start items-center gap-3">
                            <p className="neutral-n1 font-bold py-0.5 mr-1 px-2 bg-snow-200">
                              {game.away.score}
                            </p>
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
                          <p className="text-brand-secondary flex-1/9 font-bold"></p>
                          <div className="flex flex-3/9 justify-end items-center gap-3">
                            <p>{game.home.name}</p>
                            <img
                              src={game.home.icon}
                              alt=""
                              className="w-fit"
                            />
                          </div>
                          <p className="neutral-n1 items-center whitespace-nowrap text-center py-0.5 px-2 bg-snow-200">
                            {game.time}
                          </p>
                          <div className="flex flex-4/9 justify-start items-center gap-3">
                            <img
                              src={game.away.icon}
                              alt=""
                              className="w-fit"
                            />
                            <p>{game.away.name}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}

            {/* Mobile Section */}
            {loading ? (
              // --- Mobile Games Skeleton ---
              <div className="bg-white border-1 block md:hidden h-fit flex-col border-snow-200 rounded">
                {/* League Title Skeleton */}
                <div className="flex gap-3 border-b-1 px-5 py-3 border-snow-200 items-center">
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
                  className="bg-white border-1 block md:hidden h-fit flex-col border-snow-200 rounded"
                >
                  {/* League Title */}
                  <div className="flex gap-3 border-b-1 px-5 py-3 border-snow-200">
                    <img
                      src={league.league.icon}
                      className="w-fit"
                      alt=""
                    />
                    <p className="font-[500] text-[#23272A] text-[14px] md:text-base">
                      {league.league.name}
                    </p>
                  </div>
                  {/* Games */}
                  {league.games.map((game, gameIdx) => (
                    <div
                      key={gameIdx}
                      className="flex items-center justify-between border-b-1 border-snow-200 px-3 py-2 last:border-b-0 bg-neutral-n9"
                    >
                      {/* Time */}
                      {game.status === "live" ? (
                        <p className="text-xs text-brand-secondary text-center w-12 font-semibold">
                          {game.time}
                        </p>
                      ) : (
                        <p className="text-xs text-neutral-n4 text-center w-12 font-semibold">
                          {game.time}
                        </p>
                      )}
                      {/* Teams */}
                      <div className="flex flex-col flex-1 mx-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={game.home.icon}
                              alt={game.home.name}
                              className="w-9 h-9"
                            />
                            <span className="font-[500] text-neutral-n4">
                              {game.home.name}
                            </span>
                          </div>
                          {game.status === "live" ? (
                            <p className="neutral-n1 font-bold py-0.5 mr-1 px-2 bg-snow-200">
                              {game.home.score}
                            </p>
                          ) : (
                            <p className="neutral-n1 font-bold py-0.5 mr-1 px-2 bg-snow-200">
                              -
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={game.away.icon}
                              alt={game.away.name}
                              className="w-9 h-9"
                            />
                            <span className="font-[500] text-neutral-n4">
                              {game.away.name}
                            </span>
                          </div>
                          {game.status === "live" ? (
                            <p className="neutral-n1 font-bold py-0.5 mr-1 px-2 bg-snow-200">
                              {game.away.score}
                            </p>
                          ) : (
                            <p className="neutral-n1 font-bold py-0.5 mr-1 px-2 bg-snow-200">
                              -
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 bg-ui-negative hidden lg:block md:w-1/5">
          {loading ? (
            <div className="flex flex-col gap-5 p-5">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-10 w-2/3 mb-2" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          ) : (
            <>3</>
          )}
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

export default dashboard;
