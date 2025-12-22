import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { Category } from "@/components/dashboard/Category";
import { FavouriteSelection } from "@/components/dashboard/FavouriteSelection";
import Leftbar from "@/components/layout/LeftBar";
import popularLeagues from "@/data/favouriteSelect";
import { getAllTeams, getAllLeagues, getAllPlayers } from "@/lib/api/endpoints";
import { usePaginatedApi } from "@/hooks/usePaginatedApi";
import { useNavigate } from "react-router-dom";
import RightBar from "@/components/layout/RightBar";
import { getAuthToken } from "@/lib/api/axios";

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

const normalizeImageSrc = (value: unknown, fallback: string) => {
  if (!value || typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("data:image/")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) return trimmed;
  if (/^[A-Za-z0-9+/\r\n]+={0,2}$/.test(trimmed)) return `data:image/png;base64,${trimmed}`;
  return fallback;
};

export const favourite = () => {
  const navigate = useNavigate();
  const limit = 21;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize selected items using IDs
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncLoginState = () => {
      try {
        const stored = localStorage.getItem("tikianaly_user");
        const token = getAuthToken();
        setIsLoggedIn(Boolean(stored) && Boolean(token));
      } catch {
        setIsLoggedIn(false);
      }
    };

    syncLoginState();
    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

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
        icon: normalizeImageSrc(team.image, '/loading-state/shield.svg'),
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
        icon: normalizeImageSrc(league.logo ?? league.image_path ?? league.image, '/loading-state/shield.svg'),
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
        icon: normalizeImageSrc(player.image, '/loading-state/player.svg'),
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
    if (!isLoggedIn) return;
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
              isLoggedIn={isLoggedIn}
              onLogin={() => navigate("/login")}
              onSaved={() => setSelectedItems(new Set())}
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
          <RightBar />
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
