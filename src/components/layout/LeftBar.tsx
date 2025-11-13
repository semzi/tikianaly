import React, { useState } from "react";
import popularLeagues from "@/data/popularLeagues";
import allLeagues from "@/data/allLeagues";
import { ChevronUpDownIcon, HeartIcon } from "@heroicons/react/24/outline";

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

export const Leftbar = () => {
  return (
    <div>
  <div className="flex flex-col gap-y-10">
    <div className="flex flex-col gap-y-10">
      {/* Popular Leagues Section */}
      <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200  rounded p-5">
        <p className="font-[500] text-[#23272A] dark:text-white">
          Popular Leagues
        </p>
        {popularLeagues.map((league, idx) => (
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
        <LeagueList allLeagues={allLeagues} />
      </ul>
    </div>
    </div>
    </div>
  );
};
export default Leftbar;
