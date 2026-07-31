import React, { useMemo, useState } from "react";
import { ChevronUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getCricketSeriesList } from "@/lib/api/cricket";
import { navigate } from "@/lib/router/navigate";

// Shimmer skeleton loader
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-snow-200 dark:bg-[#1F2937] rounded ${className}`}
    style={{ minHeight: "1em" }}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
  </div>
);

interface SeriesItem {
  series_id: string;
  name: string;
  category: string;
  season: string;
  image_url: string | null;
  raw: {
    file_path: string;
  };
}

interface CompetitionListProps {
  series: SeriesItem[];
  searchQuery?: string;
}

const CompetitionList: React.FC<CompetitionListProps> = ({ series, searchQuery }) => {
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    const filtered = q
      ? series.filter((c) => c.name.toLowerCase().includes(q) || c.season.toLowerCase().includes(q))
      : series;

    const map = new Map<string, SeriesItem[]>();
    for (const comp of filtered) {
      const season = comp.season || "Other";
      const prev = map.get(season) || [];
      prev.push(comp);
      map.set(season, prev);
    }

    return Array.from(map.entries())
      .map(([season, items]) => ({ season, items }))
      .sort((a, b) => b.season.localeCompare(a.season)); // Descending so newer seasons are on top
  }, [series, searchQuery]);

  return (
    <>
      {grouped.map(({ season, items }) => (
        <div key={season} className="flex flex-col">
          <li
            className="flex mt-4 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-2 cursor-pointer"
            onClick={() => setExpandedSeason((prev) => (prev === season ? null : season))}
          >
            <span className="flex-1 font-medium">{season}</span>
            <ChevronUpDownIcon
              className={`ml-auto w-6 transition-transform ${
                expandedSeason === season ? "rotate-180" : ""
              }`}
            />
          </li>

          {expandedSeason === season ? (
            <div className="flex flex-col pl-4">
              {items.map((comp) => (
                <li
                  key={comp.series_id}
                  className="flex mt-3 dark:text-snow-200 items-center gap-2 text-[#586069] text-sm mb-1 cursor-pointer hover:text-brand-secondary dark:hover:text-brand-secondary transition-colors"
                  onClick={() => navigate(`/cricket/series/${comp.series_id}`)}
                >
                  {comp.image_url ? (
                    <img src={comp.image_url} alt={comp.name} className="w-5 h-5 object-contain shrink-0" />
                  ) : (
                    <span className="text-base shrink-0">🏏</span>
                  )}
                  <span className="flex-1 line-clamp-1">{comp.name}</span>
                </li>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
};

export const CricketLeftBar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["cricketSeries"],
    queryFn: getCricketSeriesList,
  });

  const seriesItems: SeriesItem[] = data?.responseObject?.items || [];

  const popularSeries = useMemo(() => {
    // Just pick the first 5 or so for popular if available, or base it on something
    return seriesItems.slice(0, 5);
  }, [seriesItems]);

  return (
    <div>
      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-10">
          {/* Popular Competitions Section */}
          <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200 rounded p-5">
            <p className="font-[500] text-[#23272A] dark:text-white mb-2">
              Popular Series
            </p>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full mt-4" />
              ))
            ) : (
              popularSeries.map((comp) => (
                <li
                  key={`pop-${comp.series_id}`}
                  className="flex mt-4 items-center gap-2 dark:text-snow-200 text-[#586069] text-sm cursor-pointer hover:text-brand-secondary dark:hover:text-brand-secondary transition-colors"
                  onClick={() => navigate(`/cricket/series/${comp.series_id}`)}
                >
                  {comp.image_url ? (
                    <img src={comp.image_url} alt={comp.name} className="w-5 h-5 object-contain shrink-0" />
                  ) : (
                    <span className="text-base shrink-0">🏏</span>
                  )}
                  <span className="line-clamp-1">{comp.name}</span>
                </li>
              ))
            )}
          </ul>

          {/* All Competitions Section */}
          <ul className="bg-white dark:bg-[#161B22] dark:border-[#1F2937] border-1 h-fit border-snow-200 rounded p-5">
            <div className="flex items-center my-auto">
              <p className="font-[500] dark:text-white text-[#23272A]">
                All Series
              </p>
              <button
                type="button"
                className="ml-auto"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search competitions"
              >
                <MagnifyingGlassIcon className="w-5 h-5 theme-text" />
              </button>
            </div>
            {searchOpen ? (
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-3 w-full rounded border border-snow-200 bg-white px-3 py-2 text-sm text-[#23272A] outline-none focus:border-brand-primary dark:border-[#1F2937] dark:bg-[#0D1117] dark:text-snow-200"
                placeholder="Search series..."
              />
            ) : null}
            
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={`all-${i}`} className="h-6 w-full mt-4" />
              ))
            ) : (
              <CompetitionList
                series={seriesItems}
                searchQuery={searchQuery}
              />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CricketLeftBar;
