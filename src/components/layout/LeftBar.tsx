import React, { useState, useEffect, useRef } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { getAllLeagues } from "@/lib/api/endpoints";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";

// Pulsating skeleton loader component
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-snow-200 rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
);

interface LeagueItem {
  name: string;
  icon: string;
  id: number;
}

interface LeagueListProps {
  allLeagues: LeagueItem[];
  loading?: boolean;
}

const LeagueList: React.FC<LeagueListProps> = ({ allLeagues, loading }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const getLeagueLogoId = (league: LeagueItem): string | null => {
    const anyLeague = league as unknown as { leagueId?: unknown; id?: unknown };
    const raw = anyLeague.leagueId ?? anyLeague.id;
    if (raw === null || raw === undefined) return null;
    return String(raw);
  };

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  if (loading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <li key={idx} className="flex mt-4 items-center gap-2 mb-2">
            <Skeleton className="w-6 h-6" />
            <Skeleton className="w-24 h-4 flex-1" />
            <Skeleton className="w-4 h-4" />
          </li>
        ))}
      </>
    );
  }

  return (
    <>
      {allLeagues.map((league, idx) => (
        <div
          key={(() => {
            const logoId = getLeagueLogoId(league);
            return logoId ? `${logoId}-${idx}` : `league-${idx}`;
          })()}
          className="flex flex-col"
        >
          {/* League Row */}
          <li className="flex mt-4 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-2">
            {(() => {
              const logoId = getLeagueLogoId(league);
              if (!logoId) {
                return <img src={"/loading-state/shield.svg"} alt={`${league.name} - No Logo`} className="w-6 h-6 object-contain" />;
              }
              return <GetLeagueLogo leagueId={logoId} alt={league.name} className="w-6 h-6 object-contain" />;
            })()}
            <span className="flex-1">{league.name}</span>
            <ChevronUpDownIcon
              className={`ml-auto w-6 transition-transform ${
                expandedIdx === idx ? "rotate-180" : ""
              }`}
              onClick={() => toggleExpand(idx)}
            />
          </li>
        </div>
      ))}
    </>
  );
};

export const Leftbar = () => {
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState<LeagueItem[]>([]);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent double calls (especially in React StrictMode)
    if (hasFetchedRef.current) return;
    
    const fetchLeagues = async () => {
      hasFetchedRef.current = true;
      try {
        setLoading(true);
        const response = await getAllLeagues(1, 50);
        
        if (response?.success && response?.responseObject?.items) {
          // Transform API response to match component structure
          const transformedLeagues: LeagueItem[] = response.responseObject.items.map((league: any) => ({
            name: league.name,
            icon: league.logo || league.image_path || '/assets/icons/league-placeholder.png',
            id: league.leagueId ?? league.id,
          }));
          setLeagues(transformedLeagues);
        }
      } catch (error) {
        console.error("Error fetching leagues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-y-10">
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
              : leagues.slice(0, 10).map((league, idx) => (
                  <li
                    key={league.id ? `${league.id}-${idx}` : `league-${idx}`}
                    className="flex mt-5 items-center gap-2 dark:text-snow-200 text-[#586069] text-sm mb-4"
                  >
                    <img src={league.icon} alt={league.name} className="w-6 h-6 object-contain" />
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
            <LeagueList allLeagues={leagues} loading={loading} />
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Leftbar;
