import { useState } from "react";
import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import popularLeagues from "../data/popularLeagues";
import allLeagues from "../data/allLeagues";
import { ChevronUpDownIcon, HeartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Hearted } from "@heroicons/react/24/solid";
import StaggerFadeIn from "../animations/StaggerFadeIn";
import { AnimatePresence, motion } from "framer-motion";

export const League = () => {
  const [activeTab, setActiveTab] = useState<"suggestions" | "all">("suggestions");

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />

      {/* Toggle Header */}
      <div className="flex border-b cursor-pointer sticky top-0 z-10 backdrop-blur-2xl dark:text-snow-100 theme-border">
        <div
          className={`flex-1 py-3 text-center ${
            activeTab === "suggestions" ? "border-b-4 border-brand-secondary" : ""
          }`}
          onClick={() => setActiveTab("suggestions")}
        >
          Suggestions
        </div>
        <div
          className={`flex-1 py-3 text-center ${
            activeTab === "all" ? "border-b-4 border-brand-secondary" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Leagues
        </div>
      </div>

      {/* Animated Content */}
      <div className="page-padding-x overflow-hidden  min-h-[70vh]">
        <AnimatePresence mode="wait">
          {activeTab === "suggestions" && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
              className=" w-full pt-5"
            >
              {/* Suggestions content */}
              <div className="grid grid-cols-3 gap-4 text-center items-stretch">
                {popularLeagues.map((league, idx) => (
                  <StaggerFadeIn key={league.name + idx} delay={0.2} stagger={0.1}>
                    <div className="game-block flex flex-col text-center gap-3 theme-text text-sm">
                      <img src={league.icon} alt={league.name} className="mx-auto w-8" />
                      <span className="text-center">{league.name}</span>
                    </div>
                  </StaggerFadeIn>
                ))}
              </div>

              <ul className="block-style my-8">
                <div className="flex items-center">
                  <p className="font-[500] dark:text-white text-[#23272A]">All Countries</p>
                  <MagnifyingGlassIcon className="cursor-pointer ml-auto w-6" />
                </div>
                {allLeagues.map((league, idx) => (
                  <li
                    key={league.name + idx}
                    className="flex mt-5 items-center gap-3 dark:text-snow-200 text-[#586069] text-sm mb-4"
                  >
                    <img src={league.icon} alt={league.name} className="w-6" />
                    <span className="flex-1">{league.name}</span>
                    <ChevronUpDownIcon className="cursor-pointer w-5 ml-auto" />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {activeTab === "all" && (
            <motion.div
              key="all"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full pt-5"
            >
              {/* All Leagues content */}
              <ul className="block-style mt-6">
                <p className="font-[500] text-[#23272A] dark:text-white">All Leagues</p>
                {popularLeagues.map((league, idx) => (
                  <li
                    key={league.name + idx}
                    className="flex mt-5 items-center gap-2 dark:text-snow-200 text-[#586069] text-sm mb-4"
                  >
                    <img src={league.icon} alt={league.name} />
                    <span>{league.name}</span>
                    {league.fav ? (
                      <Hearted className="cursor-pointer text-brand-secondary ml-auto w-5" />
                    ) : (
                      <HeartIcon className="cursor-pointer ml-auto w-5" />
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterComp />
    </div>
  );
};

export default League;
