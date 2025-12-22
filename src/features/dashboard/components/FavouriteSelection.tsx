import { useState, useMemo } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Button from "@/components/ui/Form/FormButton";
import { useNavigate } from "react-router-dom";
import { addFavorite } from "@/lib/api/endpoints";

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
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onSaved?: () => void;
}

export const FavouriteSelection = ({
  loading,
  items,
  selectedItems,
  toggleItemSelection,
  isLoggedIn = true,
  onLogin,
  onSaved,
}: FavouriteSelectionProps) => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getEffectiveItemId = (item: FavouriteItem): number | undefined => {
    if (item.id !== undefined) return item.id;
    if (item.type === "player" && item.player_id !== undefined) return item.player_id;
    return undefined;
  };

  // Helper function to get identifier (id if available, otherwise name)
  const getItemIdentifier = (item: FavouriteItem): string => {
    const effectiveId = getEffectiveItemId(item);
    return effectiveId !== undefined ? effectiveId.toString() : item.name;
  };

  // Shuffle function to randomize array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filter and shuffle items based on selected filter
  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) => {
      if (selectedFilter === "All") return true;
      if (selectedFilter === "Teams") return item.type === 'team';
      if (selectedFilter === "Leagues") return item.type === 'league';
      if (selectedFilter === "Players") return item.type === 'player';
      return true;
    });
    
    // Shuffle items when "All" is selected to mix teams, leagues, and players randomly
    if (selectedFilter === "All") {
      filtered = shuffleArray(filtered);
    }
    
    return filtered;
  }, [items, selectedFilter]);

  const handleNext = async () => {
    if (!isLoggedIn) return;
    if (submitting) return;
    setSubmitError(null);
    setToastMessage(null);

    const payloads = Array.from(selectedItems)
      .map((selectedIdentifier) => {
        const selectedItem = items.find(
          (item) => getItemIdentifier(item) === selectedIdentifier
        );

        const effectiveId = selectedItem ? getEffectiveItemId(selectedItem) : undefined;
        if (!selectedItem?.type || effectiveId === undefined) return null;

        return {
          type: selectedItem.type,
          itemId: String(effectiveId),
        };
      })
      .filter(Boolean) as Array<{ type: string; itemId: string }>;

    if (payloads.length === 0) {
      setSubmitError("Please select at least one item.");
      return;
    }

    try {
      setSubmitting(true);
      console.log("Saving favourites payloads:", payloads);

      const results = await Promise.allSettled(payloads.map((payload) => addFavorite(payload)));

      const rejected = results.filter((r) => r.status === "rejected");
      if (rejected.length > 0) {
        setSubmitError("Some favourites could not be saved. Please try again.");
        return;
      }

      const fulfilledValues = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map((r) => r.value);

      console.log("addFavorite responses:", fulfilledValues);

      const unsuccessful = fulfilledValues.filter((v) => v?.success === false);
      if (unsuccessful.length > 0) {
        setSubmitError(
          unsuccessful[0]?.message || "Failed to save favourites. Please try again."
        );
        return;
      }

      onSaved?.();
      setToastMessage("Favourites added");
      window.setTimeout(() => setToastMessage(null), 2500);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save favourites");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-5">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-brand-primary px-4 py-2 text-white shadow-lg">
          {toastMessage}
        </div>
      )}
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

            {/* Filter Buttons - Matching Mobile Style */}
            <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
              <div className="dark:text-snow-200 overflow-x-hidden flex gap-3 w-full hide-scrollbar">
                <button
                  onClick={() => setSelectedFilter("All")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFilter === "All"
                      ? "bg-brand-secondary text-white border-none"
                      : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#161B22] dark:text-snow-200 dark:border-[#1F2937]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter("Leagues")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFilter === "Leagues"
                      ? "bg-brand-secondary text-white border-none"
                      : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#161B22] dark:text-snow-200 dark:border-[#1F2937]"
                  }`}
                >
                  Leagues
                </button>
                <button
                  onClick={() => setSelectedFilter("Teams")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFilter === "Teams"
                      ? "bg-brand-secondary text-white border-none"
                      : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#161B22] dark:text-snow-200 dark:border-[#1F2937]"
                  }`}
                >
                  Teams
                </button>
                <button
                  onClick={() => setSelectedFilter("Players")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFilter === "Players"
                      ? "bg-brand-secondary text-white border-none"
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
          <div className="grid max-h-[280px] hide-scrollbar overflow-y-auto grid-cols-3 p-5 gap-4 text-center items-stretch">
            {filteredItems.map((item, idx) => {
              const itemIdentifier = getItemIdentifier(item);
              const isSelected = selectedItems.has(itemIdentifier);
              return (
                <div
                  key={itemIdentifier + idx}
                  onClick={() => {
                    if (!isLoggedIn) return;
                    console.log("FavouriteSelection item click:", {
                      identifier: itemIdentifier,
                      id: item.id,
                      player_id: item.player_id,
                      effectiveId: getEffectiveItemId(item),
                      type: item.type,
                      name: item.name,
                      wasSelected: isSelected,
                    });
                    toggleItemSelection(itemIdentifier);
                  }}
                  className={`flex flex-col items-center justify-center gap-3 text-center rounded-lg p-4 transition-all min-h-[120px] ${
                    isLoggedIn ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                  } ${
                    isSelected
                      ? "bg-blue-50 border-2 border-brand-secondary dark:bg-blue-900/20 dark:border-brand-secondary"
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
                        ? "text-brand-secondary dark:text-brand-secondary"
                        : "text-gray-700 dark:text-snow-200"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t drop-shadow-[0_-4px_6px_rgba(0,0,0,0.02)] h-fit w-full bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-snow-200 rounded-b p-5 pt-2 pb-0">
            <div className="flex pt-3 overflow-x-auto hide-scrollbar gap-6">
              {Array.from(selectedItems).map((selectedIdentifier, idx) => {
                const selectedItem = items.find((item) => getItemIdentifier(item) === selectedIdentifier);
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
                      className={`h-5 w-5 bg-white text-brand-primary rounded-full relative bottom-12 left-7 ${
                        isLoggedIn ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLoggedIn) return;
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
          {isLoggedIn ? (
            <>
              <Button
                label="Skip"
                className="btn-outline bg-transparent text-brand-primary border-brand-primary"
                onClick={() => navigate("/")}
              />
              <Button
                label={submitting ? "Saving..." : "Next"}
                className="btn-primary text-white border-brand-primary"
                onClick={handleNext}
                disabled={submitting}
              />
            </>
          ) : (
            <Button
              label="Login to add favourites"
              className="btn-primary text-white border-brand-primary"
              onClick={() => (onLogin ? onLogin() : navigate("/login"))}
            />
          )}
        </div>

        {submitError && (
          <p className="text-sm text-red-500">{submitError}</p>
        )}
      </div>
    </div>
  );
};

export default FavouriteSelection;

