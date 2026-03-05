import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StaggerChildren from "../../../animations/staggerChildren";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Button from "../../../components/ui/Form/FormButton";

// Pulsating skeleton loader component
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-snow-200 rounded ${className}`}
    style={{ minHeight: "1em" }}
  />
);

interface FavouriteItem {
  name: string;
  icon: string;
  id?: number;
  player_id?: number;
  type?: 'team' | 'league' | 'player';
  fav?: boolean;
}

interface FavouriteSelectionProps {
  loading: boolean;
  items: FavouriteItem[];
  selectedItems: Set<string>;
  toggleItemSelection: (itemIdentifier: string) => void;
}

export const FavouriteSelectionOnboard = ({
  loading,
  items,
  selectedItems,
  toggleItemSelection,
}: FavouriteSelectionProps) => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSport, setSelectedSport] = useState("Football");
  
  const sports = ["Football", "Basketball", "Cricket", "E-Sport"];

  const getEffectiveItemId = (item: FavouriteItem): number | undefined => {
    if (item.id !== undefined) return item.id;
    if (item.type === "player" && item.player_id !== undefined) return item.player_id;
    return undefined;
  };

  const getItemIdentifier = (item: FavouriteItem): string => {
    const effectiveId = getEffectiveItemId(item);
    return effectiveId !== undefined ? effectiveId.toString() : item.name;
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedFilter === "All") return true;
      if (!item.type) return true;
      if (selectedFilter === "Teams") return item.type === 'team';
      if (selectedFilter === "Leagues") return item.type === 'league';
      if (selectedFilter === "Players") return item.type === 'player';
      return true;
    });
  }, [items, selectedFilter]);

  return (
    <div className="w-full flex flex-col gap-y-5">
      <div className="block-style">
        {loading ? (
          <div>
            <Skeleton className="h-6 w-1/3 mb-3" />
            <div className="flex gap-3">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="flex dark:text-snow-200 justify-center flex-col gap-4">
            {/* Header with Title and Search Icon */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold dark:text-white text-[#23272A]">
                Select your favourites
              </h2>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <img
                  src="/icons/search-line-1.svg"
                  alt="Search"
                  className="w-5 h-5 dark:invert"
                />
              </button>
            </div>

            {/* Sport Category Tabs */}
            <div className="flex gap-4 border-b border-snow-200 dark:border-[#1F2937]">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`pb-3 px-1 text-sm font-medium transition-all relative ${
                    selectedSport === sport
                      ? "text-brand-primary dark:text-brand-primary"
                      : "text-neutral-n5 dark:text-snow-200"
                  }`}
                >
                  {sport}
                  {selectedSport === sport && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Filter Buttons - Matching Mobile Style */}
            <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
              <div className="dark:text-snow-200 overflow-x-hidden flex gap-3 w-full hide-scrollbar">
                <button
                  onClick={() => setSelectedFilter("All")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedFilter === "All"
                      ? "bg-brand-primary text-white border-none"
                      : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#161B22] dark:text-snow-200 dark:border-[#1F2937]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter("Leagues")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedFilter === "Leagues"
                      ? "bg-brand-primary text-white border-none"
                      : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#161B22] dark:text-snow-200 dark:border-[#1F2937]"
                  }`}
                >
                  Leagues
                </button>
                <button
                  onClick={() => setSelectedFilter("Teams")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedFilter === "Teams"
                      ? "bg-brand-primary text-white border-none"
                      : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#161B22] dark:text-snow-200 dark:border-[#1F2937]"
                  }`}
                >
                  Teams
                </button>
                <button
                  onClick={() => setSelectedFilter("Players")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedFilter === "Players"
                      ? "bg-brand-primary text-white border-none"
                      : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#161B22] dark:text-snow-200 dark:border-[#1F2937]"
                  }`}
                >
                  Players
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Games Loop */}
      <div className="flex flex-col gap-6">
        {/* Desktop Section */}
        <div className="bg-white border-1 dark:bg-[#161B22] dark:border-[#1F2937] border-snow-200 rounded">
          <StaggerChildren
            className="grid max-h-[280px] hide-scrollbar overflow-y-auto grid-cols-3 p-5 gap-4 text-center items-stretch"
            stagger={0.15}
          >
            {filteredItems.map((item, idx) => {
              const itemIdentifier = getItemIdentifier(item);
              const isSelected = selectedItems.has(itemIdentifier);
              return (
                <div
                  key={itemIdentifier + idx}
                  onClick={() => toggleItemSelection(itemIdentifier)}
                  className={`flex flex-col items-center justify-center gap-3 text-center cursor-pointer rounded-lg p-4 transition-all min-h-[120px] ${
                    isSelected
                      ? "bg-blue-50 border-2 border-brand-primary dark:bg-blue-900/20 dark:border-brand-primary"
                      : "bg-white border border-gray-200 dark:bg-[#161B22] dark:border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-center h-16 w-16">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span
                    className={`text-center text-sm font-medium ${
                      isSelected
                        ? "text-brand-primary dark:text-brand-primary"
                        : "text-gray-700 dark:text-snow-200"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              );
            })}
          </StaggerChildren>

          <div className="border-t drop-shadow-[0_-4px_6px_rgba(0,0,0,0.02)] h-fit w-full bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-snow-200 rounded-b p-5 pt-2 pb-0">
            <div className="flex pt-3 overflow-x-auto hide-scrollbar gap-6">
              {Array.from(selectedItems).map((selectedIdentifier, idx) => {
                const selectedItem = filteredItems.find((item) => getItemIdentifier(item) === selectedIdentifier) ??
                  items.find((item) => getItemIdentifier(item) === selectedIdentifier);
                if (!selectedItem) return null;
                
                return (
                  <div key={selectedIdentifier + idx} className="hover:translate-y-[-6px] transition-transform">
                    <div className="w-10 h-10 shadow-lg bg-body border-dotted border border-snow-200 rounded-full overflow-hidden">
                      <img
                        src={selectedItem.icon}
                        alt={selectedItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <XCircleIcon
                      className="h-5 w-5 cursor-pointer bg-white text-brand-primary rounded-full relative bottom-12 left-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemSelection(selectedIdentifier);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-5 mb-5">
          <Button
            label="Skip"
            className="btn-outline bg-transparent text-brand-primary border-brand-primary"
            onClick={() => navigate("/")}
          />
          <Button
            label="Next"
            className="btn-primary text-white border-brand-primary"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    </div>
  );
};

export default FavouriteSelectionOnboard;

