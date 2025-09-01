import { useState } from "react";
import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import popularLeagues from "../data/popularLeagues";
import allLeagues from "../data/allLeagues";
import {
  ChevronUpDownIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as Hearted } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import StaggerChildren from "../animations/staggerChilderen";


interface Team {
  name: string;
  logo?: string;
}

interface League {
  name: string;
  icon: string;
  teams: Team[];
}

interface LeagueListProps {
  allLeagues: League[];
}

const LeagueList: React.FC<LeagueListProps> = ({ allLeagues }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  return (
    <>
      {allLeagues.map((league, idx) => (
        <div key={league.name + idx} className="flex flex-col">
          {/* League Row */}
          <li className="flex mt-4 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-2">
            <img src={league.icon} alt={league.name} />
            <span className="flex-1">{league.name}</span>
            <ChevronUpDownIcon
              className={`ml-auto w-6 transition-transform ${
                expandedIdx === idx ? "rotate-180" : ""
              }`}
              onClick={() => toggleExpand(idx)}
            />
          </li>

          {/* Teams - only show when expanded */}
          {expandedIdx === idx && (
            <div className="divide-y divide-snow-200/50">
              {league.teams.map((team, tIdx) => (
                <div
                  key={team.name + tIdx}
                  className="flex py-2 text-neutral-m6 pl-5"
                >
                  <p className="sz-8">{team.name}</p>
                  <HeartIcon className="cursor-pointer ml-auto w-3" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export const League = () => {
  const [activeTab, setActiveTab] = useState<"suggestions" | "all">(
    "suggestions"
  );

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />

      {/* Toggle Header */}
      <div className="flex border-b cursor-pointer sticky top-0 z-10 backdrop-blur-2xl dark:text-snow-100 theme-border">
        <div
          className={`flex-1 py-3 text-center ${
            activeTab === "suggestions"
              ? "border-b-4 border-brand-secondary"
              : ""
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
              <StaggerChildren
                className="grid grid-cols-3 gap-4 text-center items-stretch"
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

              <ul className="block-style my-8">
                <div className="flex items-center">
                  <p className="font-[500] dark:text-white text-[#23272A]">
                    All Countries
                  </p>
                  <MagnifyingGlassIcon className="cursor-pointer ml-auto w-6" />
                </div>
                <LeagueList allLeagues={allLeagues} />
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
