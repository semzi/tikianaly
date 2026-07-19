import { useMemo, useState } from "react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  mockAmericanFootballAllLeagues,
  mockAmericanFootballPopularLeagues,
} from "../data/mockAmericanFootball";

type AmericanFootballLeftBarProps = {
  selectedLeagueName?: string | null;
  onSelectLeagueName?: (name: string | null) => void;
};

export const AmericanFootballLeftBar = ({
  selectedLeagueName = null,
  onSelectLeagueName,
}: AmericanFootballLeftBarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  const leaguesByRegion = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? mockAmericanFootballAllLeagues.filter((league) =>
          [league.name, league.region, league.tier, league.season]
            .join(" ")
            .toLowerCase()
            .includes(query),
        )
      : mockAmericanFootballAllLeagues;

    return Object.entries(
      filtered.reduce<Record<string, typeof filtered>>((groups, league) => {
        const region = league.region || "Other";
        groups[region] ??= [];
        groups[region].push(league);
        return groups;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-y-10">
      <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200 rounded p-5 shadow-sm">
        <p className="font-[500] text-[#23272A] dark:text-white mb-2">
          Popular Leagues
        </p>
        {mockAmericanFootballPopularLeagues.map((league) => (
          <li
            key={league.id}
            className={`flex mt-5 items-center gap-2 text-sm mb-4 cursor-pointer transition-colors hover:text-brand-primary ${
              selectedLeagueName === league.name
                ? "text-brand-primary font-bold"
                : "dark:text-snow-200 text-[#586069]"
            }`}
            onClick={() => onSelectLeagueName?.(league.name)}
          >
            <span className="w-2 h-2 rounded-full bg-neutral-n4" />
            <span>{league.name}</span>
          </li>
        ))}
      </ul>

      <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200 rounded p-5 shadow-sm">
        <div className="flex items-center my-auto">
          <p className="font-[500] dark:text-white text-[#23272A]">
            All Leagues
          </p>
          <button
            type="button"
            className="ml-auto"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label="Search leagues"
          >
            <MagnifyingGlassIcon className="w-5 h-5 theme-text hover:text-brand-primary transition-colors" />
          </button>
        </div>

        {searchOpen ? (
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="mt-3 w-full rounded border border-snow-200 bg-white px-3 py-2 text-sm text-[#23272A] outline-none focus:border-brand-primary dark:border-[#1F2937] dark:bg-[#0D1117] dark:text-snow-200"
            placeholder="Search leagues..."
          />
        ) : null}

        <li
          className={`flex mt-4 items-center gap-2 text-sm mb-2 cursor-pointer transition-colors ${
            selectedLeagueName === null
              ? "text-brand-secondary font-bold"
              : "dark:text-snow-200 text-[#586069]"
          }`}
          onClick={() => onSelectLeagueName?.(null)}
        >
          All Leagues
        </li>

        {leaguesByRegion.map(([region, leagues]) => (
          <div key={region} className="flex flex-col">
            <li
              className="flex mt-4 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-2 cursor-pointer"
              onClick={() =>
                setExpandedRegion((current) =>
                  current === region ? null : region,
                )
              }
            >
              <span className="flex-1 font-medium">{region}</span>
              <ChevronUpDownIcon
                className={`ml-auto w-6 transition-transform ${
                  expandedRegion === region ? "rotate-180" : ""
                }`}
              />
            </li>
            {expandedRegion === region ? (
              <div className="flex flex-col pl-4">
                {leagues.map((league) => (
                  <li
                    key={league.id}
                    className={`flex mt-3 items-center gap-2 text-sm mb-1 cursor-pointer transition-colors ${
                      selectedLeagueName === league.name
                        ? "text-brand-primary font-bold"
                        : "dark:text-snow-200 text-[#586069]"
                    }`}
                    onClick={() => onSelectLeagueName?.(league.name)}
                  >
                    <span className="w-2 h-2 rounded-full bg-neutral-n4" />
                    <span className="flex-1">{league.name}</span>
                  </li>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </ul>
    </div>
  );
};
