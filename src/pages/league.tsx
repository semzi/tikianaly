import { useState } from "react";
import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import Navigation from "../components/dasboardelements/Navigation";
import popularLeagues from "../data/popularLeagues";
import allLeagues from "../data/allLeagues";
import { ChevronUpDownIcon, HeartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Hearted } from "@heroicons/react/24/solid";

export const League = () => {
  const [activeTab, setActiveTab] = useState("suggestions"); // "suggestions" or "all"
  // const touchStartX = useRef(null);

  // const handleTouchStart = (e: { touches: { clientX: null; }[]; }) => {
  //   touchStartX.current = e.touches[0].clientX;
  // };

  // const handleTouchEnd = (e) => {
  //   if (touchStartX.current === null) return;
  //   const touchEndX = e.changedTouches[0].clientX;
  //   const diff = touchStartX.current - touchEndX;

  //   // Set a minimum swipe distance to avoid accidental triggers
  //   if (Math.abs(diff) > 50) {
  //     if (diff > 0 && activeTab === "suggestions") {
  //       setActiveTab("all"); // swipe left → go to All Leagues
  //     } else if (diff < 0 && activeTab === "all") {
  //       setActiveTab("suggestions"); // swipe right → go to Suggestions
  //     }
  //   }
  //   touchStartX.current = null;
  // };

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />
      <Navigation />

      {/* Toggle Header */}
      <div className="flex border-b cursor-pointer transition-all sticky top-0 z-10 backdrop-blur-2xl dark:text-snow-100 theme-border">
        <div
          className={`flex-1 transition-all py-3 text-center ${
            activeTab === "suggestions" ? "border-b-4 border-brand-secondary" : ""
          }`}
          onClick={() => setActiveTab("suggestions")}
        >
          Suggestions
        </div>
        <div
          className={`flex-1 transition-all py-3 text-center ${
            activeTab === "all" ? "border-b-4 border-brand-secondary" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Leagues
        </div>
      </div>

      {/* Sliding content */}
      <div
        className="overflow-hidden page-padding-x"
        // onTouchStart={handleTouchStart}
        // onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex transition-transform duration-500`}
          style={{
            transform: activeTab === "suggestions" ? "translateX(0%)" : "translateX(-100%)",
          }}
        >
          {/* Suggestions Column */}
          <div className="flex-shrink-0 w-full pt-5">
            <div className="grid grid-cols-3 gap-4 text-center items-stretch">
              {popularLeagues.map((league, idx) => (
                <div
                  key={league.name + idx}
                  className="game-block flex flex-col text-center gap-3 theme-text text-sm"
                >
                  <img src={league.icon} alt={league.name} className="mx-auto w-8" />
                  <span className="text-center">{league.name}</span>
                </div>
              ))}
            </div>

            <ul className="block-style my-8">
              <div className="flex items-center my-auto">
                <p className="font-[500] dark:text-white text-[#23272A]">All Countries</p>
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
          </div>

          {/* All Leagues Column */}
          <div className="flex-shrink-0 w-full pt-5">
            <ul className="block-style mt-6">
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
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default League;
