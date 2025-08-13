import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import Navigation from "../components/dasboardelements/Navigation";
import popularLeagues from "../data/popularLeagues";
import allLeagues from "../data/allLeagues";
// import Category from "../components/dasboardelements/Category";
import {
  ChevronUpDownIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as Hearted } from "@heroicons/react/24/solid";

export const league = () => {
  return (
    <div className="dark:bg-[#0D1117] min-h-100">
      <PageHeader />
      <Navigation />
      {/* <Category /> */}
      <div className="flex border-b cursor-pointer sticky top-0 z-10 backdrop-blur-2xl dark:text-snow-100 theme-border ">
        <div className="flex-1/2 border-b-3 py-3 border-brand-secondary text-center">
          Suggestions
        </div>
        <div className="flex-1/2 py-3 text-center">All Leagues</div>
      </div>
      <div className="flex pt-5 flex-col gap-y-8 page-padding-x">
        {/* Popular Leagues Section */}

          <div className="grid grid-cols-3 gap-4 text-center items-stretch">
          {popularLeagues.map((league, idx) => (
            <div
              key={league.name + idx}
              className="game-block flex flex-col text-center gap-3 theme-text text-sm"
            >
              <img src={league.icon} alt={league.name} className="mx-auto w-8" />
              <span className="text-center">{league.name}</span>
              {/* {league.fav ? (
                <Hearted className="cursor-pointer text-brand-secondary ml-auto align-basel w-5" />
              ) : (
                <HeartIcon className="cursor-pointer ml-auto align-basel w-5" />
              )} */}
            </div>
          ))}
          </div>
        

        {/* All Leagues Section */}
        <ul className="block-style">
          <div className="flex items-center my-auto">
            <p className="font-[500] dark:text-white text-[#23272A]">
              All Countries
            </p>
            <MagnifyingGlassIcon className="cursor-pointer ml-auto align-basel w-6" />
          </div>
          {allLeagues.map((league, idx) => (
            <li
              key={league.name + idx}
              className="flex mt-5 dark:text-snow-200 items-center gap-3 text-[#586069] text-sm mb-4"
            >
              <img src={league.icon} alt={league.name} className="w-6" />
              <span className="flex-1">{league.name}</span>
              <ChevronUpDownIcon className="cursor-pointer ml-auto align-basel w-5" />
            </li>
          ))}
        </ul>

        <ul className="block-style">
          <p className="font-[500] text-[#23272A] dark:text-white">
            All Leagues
          </p>
          {popularLeagues.map((league, idx) => (
            <li
              key={league.name + idx}
              className="flex mt-5 items-center gap-2 dark:text-snow-200 text-[#586069] text-sm mb-4"
            >
              <img src={league.icon} alt={league.name} />
              <span>{league.name}</span>
              {league.fav ? (
                <Hearted className="cursor-pointer text-brand-secondary ml-auto align-basel w-5" />
              ) : (
                <HeartIcon className="cursor-pointer ml-auto align-basel w-5" />
              )}
            </li>
          ))}
        </ul>
      </div>
      <FooterComp />
    </div>
  );
};

export default league;
