import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { Category } from "@/components/dashboard/Category";
import { FavouriteSelection } from "@/components/dashboard/FavouriteSelection";
import Leftbar from "@/components/layout/LeftBar";
import popularLeagues from "@/data/favouriteSelect";
import { getAllTeams, getAllLeagues, getAllPlayers } from "@/lib/api/endpoints";
import { usePaginatedApi } from "@/hooks/usePaginatedApi";

// Pulsating skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-snow-200 rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
);

interface FavouriteItem {
  name: string;
  icon: string;
  id: number;
  type: 'team' | 'league' | 'player';
  fav?: boolean;
}

export const favourite = () => {
  const limit = 21;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize selected items using IDs
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Use pagination hook for teams
  const teamsHook = usePaginatedApi<FavouriteItem>({
    apiFunction: getAllTeams,
    limit,
    enableInfiniteScroll: true,
    scrollThreshold: 0.8,
    transformResponse: (response: any) => {
      if (!response?.success || !response?.responseObject?.items) return [];
      return response.responseObject.items.map((team: any) => ({
        name: team.name,
        icon: team.image_path || team.logo || '/assets/icons/team-placeholder.png',
        id: team.id,
        type: 'team' as const,
      }));
    },
  });

  // Use pagination hook for leagues
  const leaguesHook = usePaginatedApi<FavouriteItem>({
    apiFunction: getAllLeagues,
    limit,
    enableInfiniteScroll: true,
    scrollThreshold: 0.8,
    transformResponse: (response: any) => {
      if (!response?.success || !response?.responseObject?.items) return [];
      return response.responseObject.items.map((league: any) => ({
        name: league.name,
        icon: league.logo || league.image_path || '/assets/icons/league-placeholder.png',
        id: league.id,
        type: 'league' as const,
      }));
    },
  });

  // Use pagination hook for players
  const playersHook = usePaginatedApi<FavouriteItem>({
    apiFunction: getAllPlayers,
    limit,
    enableInfiniteScroll: true,
    scrollThreshold: 0.8,
    transformResponse: (response: any) => {
      if (!response?.success || !response?.responseObject?.items) return [];
      return response.responseObject.items.map((player: any) => ({
        name: player.name || `${player.firstname || ''} ${player.lastname || ''}`.trim(),
        icon: player.image_path || player.photo || '/assets/icons/player-placeholder.png',
        id: player.id,
        type: 'player' as const,
      }));
    },
  });

  // Set scroll container for all hooks
  useEffect(() => {
    if (scrollContainerRef.current) {
      teamsHook.setScrollContainer(scrollContainerRef.current);
      leaguesHook.setScrollContainer(scrollContainerRef.current);
      playersHook.setScrollContainer(scrollContainerRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Combine all items
  const allItems = [...teamsHook.items, ...leaguesHook.items, ...playersHook.items];
  const loading = teamsHook.initialLoading || leaguesHook.initialLoading || playersHook.initialLoading;
  const error = teamsHook.error || leaguesHook.error || playersHook.error;

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="transition-all  dark:bg-[#0D1117]">
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

      <div className="flex page-padding-x dark:bg-[#0D1117] gap-5 py-5 justify-around" style={{ height: 'calc(100vh - 20px)' }}>
        {/* Left Sidebar */}
        <section className="h-full pb-30 overflow-y-auto hide-scrollbar w-1/5 hidden lg:block pr-2">
          <Leftbar />
        </section>

        {/* Main Content Area */}
        <div 
          ref={scrollContainerRef}
          className="w-full pb-30 flex flex-col gap-y-3 md:gap-y-5 lg:w-3/5 h-full overflow-y-auto hide-scrollbar pr-2"
        >
          {error && !loading ? (
            <div className="w-full flex flex-col gap-y-5">
              <div className="block-style">
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <p className="text-lg font-semibold text-neutral-n4 dark:text-snow-200 mb-2">
                    {error}
                  </p>
                  <p className="text-sm text-neutral-n5 dark:text-snow-200/70">
                    Please try again later
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <FavouriteSelection
              loading={loading}
              items={allItems.length > 0 ? allItems : popularLeagues} 
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
            />
          )}
          {/* Loading indicator for pagination */}
          {(teamsHook.loading || leaguesHook.loading || playersHook.loading) && !loading && (
            <div className="flex justify-center py-4">
              <div className="text-sm text-neutral-n5">Loading more...</div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 pb-30 hidden lg:block h-full overflow-y-auto hide-scrollbar">
          <div className="flex flex-col gap-y-10">
            {/* News Section */}
            <ul className="block-style ">
              {loading ? (
                <>
                  <Skeleton className="h-5 w-32 mb-4" />
                  <div className="flex flex-col gap-y-3 mb-5">
                    <Skeleton className="mt-4 w-full h-32 rounded" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="flex-col flex gap-5">
                    {/* single news column skeleton */}
                    <div className="flex border-y-1 border-snow-200 py-5 items-center gap-3">
                      <Skeleton className="w-24 h-20 rounded" />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                    {/* single news column skeleton */}
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-24 h-20 rounded" />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-[500] dark:text-snow-200 text-[#23272A]">
                    Latest News
                  </p>
                  <div className="flex text-neutral-n4 flex-col gap-y-3 mb-5">
                    <div className='image mt-4 w-full bg-[url("/assets/icons/mbape.png")] bg-cover bg-top h-32 rounded'></div>
                    <p className="sz-6 dark:text-white font-[500]">
                      Kylian Mbappe Scores third goal in UCL win
                    </p>
                    <div className="flex dark:text-snow-200 gap-2 sz-8 ">
                      <span>6 hours ago</span>
                      <span>|</span>
                      <span>6 mins read</span>
                    </div>
                  </div>
                  <div className="flex-col flex gap-5">
                    {/* single news column */}
                    <div className="flex border-y-1 dark:border-[#1F2937] border-snow-200 py-5 items-center gap-3 text-neutral-n4">
                      <div className='image w-50 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div className="">
                        <p className="sz-8 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">
                          6 hours ago
                        </span>
                      </div>
                    </div>
                    {/* end of news col */}
                    {/* single news column */}
                    <div className="flex  items-center gap-3 text-neutral-n4">
                      <div className='image w-50 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div>
                        <p className="sz-8 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">
                          6 hours ago
                        </span>
                      </div>
                    </div>
                    {/* end of news col */}
                  </div>
                </>
              )}
            </ul>

            {/* Download  Section */}
            <div className="h-screen ">
              <ul className="block-style ">
                <p className="font-[500] dark:text-snow-200  mb-3 text-[#23272A]">
                  Download our Mobile App
                </p>
                <div className="flex flex-col gap-3">
                  <img src="\assets\icons\Group 1261157024.png" alt="" />
                  <img
                    src="\assets\icons\Frame 1261157588.png"
                    className="cursor-pointer"
                    alt=""
                  />
                  <img
                    src="\assets\icons\Frame 1261157587.png"
                    className="cursor-pointer"
                    alt=""
                  />
                </div>
              </ul>
              <div className="h-[180ch]">
                <ul className="block-style sticky top-5 mt-7  h-fit">
                  <p className="font-[500] dark:text-snow-200  mb-3 text-[#23272A]">
                    Chat with our AI Buddy
                  </p>
                  <div className="flex flex-col gap-3">
                    <img src="\assets\icons\Chat bot-bro 1.png" alt="" />
                    <img
                      src="\assets\icons\Secondary.png"
                      className="cursor-pointer"
                      alt=""
                    />
                  </div>
                </ul>
              </div>
            </div>
          </div>
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

export default favourite;
