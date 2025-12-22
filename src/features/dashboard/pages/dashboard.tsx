import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { Category } from "@/components/dashboard/Category";
import { getFixturesByLeague } from "@/lib/api/endpoints";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subDays, isToday, format } from "date-fns";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Leftbar from "@/components/layout/LeftBar";
import { RightBar } from "@/components/layout/RightBar";
import { Link } from "react-router-dom";
import { AfconBanner } from "@/components/dashboard/AfconBanner";
import GetTeamLogo from "@/components/common/GetTeamLogo";

// Pulsating skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-snow-200 rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
);

export const dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // const topLeagueIds = [1204, 1269, 1221, 1229,  1322, 1141];
  const topLeagueIds = [1204, 1269];

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        setFixtures([]); // Clear previous fixtures immediately
        console.log("Fetching fixtures for selectedDate:", selectedDate); // Added log
        const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'); // Use selectedDate, default to today if null
        console.log("Formatted date for API call:", formattedDate); // Added log
        const fetchedFixtures: any[] = [];

        for (const leagueId of topLeagueIds) {
          const response = await getFixturesByLeague(leagueId, formattedDate, 1, 100);
          console.log(`Response for leagueId ${leagueId} and date ${formattedDate}:`, response); // Added log
            if (response?.success && response?.responseObject?.items && response.responseObject.items.length > 0) {
              fetchedFixtures.push({ leagueId, fixtures: response.responseObject.items });
            } else if (response?.message === "Error fetching fixtures By LeagueId" && response?.error === "Fixture list is empty.") {
              // Silently ignore empty fixture lists for specific league IDs
            } else {
              console.warn(`No fixtures or unexpected response for leagueId ${leagueId}. Full response:`, response);
            }
        }
        setFixtures(fetchedFixtures);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [selectedDate]);

  return (
    <div className="transition-al">
      {/* Page Header (always visible, no skeleton) */}
      <PageHeader />
      {/* Category Navigation */}
      <Category />

      <div className="flex page-padding-x dark:bg-[#0D1117] gap-5 py-5 justify-around" style={{ height: 'calc(100vh - 20px)' }}>
        {/* Left Sidebar */}
        <section className="h-full pb-30 overflow-y-auto hide-scrollbar w-1/5 hidden lg:block pr-2">
          <Leftbar />
        </section>

        {/* Main Content Area */}
        <div className="w-full pb-30 flex flex-col gap-y-3 md:gap-y-5 lg:w-3/5 h-full overflow-y-auto hide-scrollbar pr-2">
          
          {/* Date and Filter Controls */}
          <div className="flex-col">
          <AfconBanner />
          <div className="block-style ">
            <div className="flex dark:text-snow-200 justify-center flex-col">
              {/* Date Navigation */}
              <div className="relative flex items-center mb-3 justify-between">
                <ArrowLeftIcon className="text-neutral-n4 h-5 cursor-pointer" onClick={() => setSelectedDate(prevDate => subDays(prevDate || new Date(), 1))} />
                <div className="flex gap-3  items-center cursor-pointer" onClick={() => setShowDatePicker(!showDatePicker)}>
                  <p>{selectedDate && isToday(selectedDate) ? "Today" : (selectedDate ? selectedDate.toDateString() : new Date().toDateString())}</p>
                  <CalendarIcon className="text-neutral-n4 h-5" />
                </div>
                <ArrowRightIcon className="text-neutral-n4 h-5 cursor-pointer" onClick={() => setSelectedDate(prevDate => addDays(prevDate || new Date(), 1))} />
                {showDatePicker && (
                  <div className="absolute z-10 top-full right-0 mt-2">
                    <DatePicker
                      selected={selectedDate}
                      calendarClassName="bg-black"
                      onChange={(date: Date | null) => {
                        setSelectedDate(date);
                        setShowDatePicker(false); // Close date picker after selection
                      }}
                      dateFormat="yyyy-MM-dd"
                      inline
                    />
                  </div>
                )}
              </div>
              {/* Filter Buttons */}
              <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
                <div
                  className=" dark:text-snow-200 overflow-x-hidden flex gap-3 w-full hide-scrollbar"
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
          </div>



          {/* Main Content Games Loop */}
          <div className="flex flex-col gap-y-3 md:gap-y-6">
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
                      className="flex justify-around items-center gap-4 border-b-1 px-5 py-3 border-snow-200 last:border-b-0"
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
                fixtures.length > 0 ? ( 
                  fixtures.map((leagueFixture, leagueIdx) => (
                    <div
                      key={leagueFixture.leagueId + "-" + leagueIdx}
                      className="block-style"
                    >
                      {/* League Title */}
                      <div className="flex gap-3 border-b-1 px-5 py-3  border-snow-200 dark:border-[#1F2937]">
                        {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                          <img src={'/loading-state/shield.svg'} className="w-fit" alt="" /> // Placeholder as icon is not in response
                        )}
                        <p className="font-[500] text-[#23272A] dark:text-neutral-m6  text-[14px] md:text-base">
                          {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name ? leagueFixture.fixtures[0].league_name : `League ${leagueFixture.leagueId}`}
                        </p>
                      </div>
                      {/* Games */}
                      {leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                        <Link
                          to={`/football/gameinfo/${game.fixture_id}`}
                          key={gameIdx}
                          className={`flex hover:bg-snow-100 dark:hover:bg-neutral-n2 cursor-pointer transition-colors items-center gap-2 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200 ${
                            gameIdx === leagueFixture.fixtures.length - 1
                              ? "last:border-b-0  border-b-0"
                              : ""
                          }`}
                        >
                          {/* If live, show time and scores; if upcoming, show time at center */}
                          {game.status === "FT" ? (
                            <>
                              <p className="text-brand-secondary flex-1/11 font-bold">
                                FT
                              </p>
                              <div className="flex dark:text-white flex-4/11 justify-end items-center gap-3">
                                <p>{game.localteam.name}</p>
                                <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-fit h-5 mr-1" />
                              </div>
                              <div className="flex-2/11 flex  justify-between">
                                <p className="score">{game.localteam.ft_score}</p>
                                <p className="score">{game.visitorteam.ft_score}</p>
                              </div>
                              <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                                <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                                <p>{game.visitorteam.name}</p>
                              </div>
                            </>
                          ) : game.status === "live" ? (
                            <>
                              <p className="text-brand-secondary animate-pulse flex-1/11 font-bold">
                                {game.time}
                              </p>
                              <div className="flex dark:text-white flex-4/11 justify-end items-center gap-3">
                                <p>{game.localteam.name}</p>
                                <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-fit h-5 mr-1" />
                              </div>
                              <div className="flex-2/11 flex  justify-between">
                                <p className="score">{game.localteam.score}</p>
                                <p className="score">{game.visitorteam.score}</p>
                              </div>
                              <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                                <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                                <p>{game.visitorteam.name}</p>
                              </div>
                            </>
                          ) : (
                            // Upcoming game: show time at center, no scores
                            <>
                              <div className="flex dark:text-white flex-5/11 justify-end items-center gap-3">
                                <p>{game.localteam.name}</p>
                                <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                              </div>
                              <p className="neutral-n1 flex-2/11 items-center whitespace-nowrap text-center py-0.5 px-2 dark:bg-neutral-500 dark:text-white bg-snow-200">
                                {game.time}
                              </p>
                              <div className="flex dark:text-white flex-4/11 justify-start items-center gap-3">
                                <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-fit h-5 mr-1" />
                                <p>{game.visitorteam.name}</p>
                              </div>
                            </>
                          )}
                        </Link>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className="text-center dark:text-neutral-m6">Nothing to show here.</p>
                )
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
                    className="flex items-center justify-between border-b-1 border-snow-200 px-2 py-1.5 last:border-b-0 bg-neutral-n9"
                  >
                    {/* Time Skeleton */}
                    <Skeleton className="w-10 h-3" />
                    {/* Teams Skeleton */}
                    <div className="flex flex-col flex-1 mx-1 gap-0.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Skeleton className="w-5 h-5" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-4 w-6" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Skeleton className="w-5 h-5" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-4 w-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              fixtures.length > 0 ? (
                fixtures.map((leagueFixture, leagueIdx) => (
                  <div
                    key={leagueFixture.leagueId + "-" + leagueIdx}
                    className="bg-white text-sm dark:bg-[#161B22] dark:border-[#1F2937] border-1 block md:hidden h-fit flex-col border-snow-200 rounded"
                  >
                    {/* League Title */}
                    <div className="flex gap-3 border-b-1 px-5 py-3 dark:border-[#1F2937] border-snow-200">
                      {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name && (
                        <img src={'/loading-state/shield.svg'} className="w-fit" alt="" />
                      )}
                      <p className="font-[500] text-[#23272A] dark:text-snow-200 text-[14px] md:text-base">
                        {leagueFixture.fixtures.length > 0 && leagueFixture.fixtures[0].league_name ? leagueFixture.fixtures[0].league_name : `League ${leagueFixture.leagueId}`}
                      </p>
                    </div>
                    {/* Games */}
                    {leagueFixture.fixtures.map((game: any, gameIdx: number) => (
                      <Link
                          to={`/overview`}
                          key={gameIdx}
                        className="flex items-center justify-between dark:border-[#1F2937] border-b-1 border-snow-200 px-2 py-1.5 last:border-b-0 bg-neutral-n9"
                      >
                        {/* Time */}
                        {game.status === "FT" ? (
                          <p className="text-xs text-brand-secondary text-center w-15 px-2 font-medium">
                            FT
                          </p>
                        ) : game.status === "live" ? (
                          <p className="text-xs text-brand-secondary animate-pulse text-center w-15 px-2 font-bold">
                            {game.time}
                          </p>
                        ) : (
                          <p className="text-xs dark:text-snow-200 text-neutral-n4 text-center w-15 px-2 font-medium">
                            {game.time}
                          </p>
                        )}
                        {/* Teams */}
                        <div className="flex flex-col flex-1 mx-1 gap-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <GetTeamLogo teamId={game.localteam.id} alt={game.localteam.name} className="w-5 h-5" />
                              <span className="text-sm font-medium dark:text-white text-neutral-n4">
                                {game.localteam.name}
                              </span>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                              <span className="text-xs font-bold dark:text-white text-neutral-n4">
                                {game.status === "FT" ? game.localteam.ft_score : game.status === "live" ? game.localteam.score : '-'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <GetTeamLogo teamId={game.visitorteam.id} alt={game.visitorteam.name} className="w-5 h-5" />
                              <span className="text-sm font-medium dark:text-white text-neutral-n4">
                                {game.visitorteam.name}
                              </span>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                              <span className="text-xs font-bold dark:text-white text-neutral-n4">
                                {game.status === "FT" ? game.visitorteam.ft_score : game.status === "live" ? game.visitorteam.score : '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-center dark:text-neutral-m6">Nothing to show here.</p>
              )
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 pb-30 hidden lg:block h-full overflow-y-auto hide-scrollbar">
          <RightBar />
        </div>
        
      </div>

      {/* Footer */}
      <FooterComp />
    </div>
  );
};

export default dashboard;
