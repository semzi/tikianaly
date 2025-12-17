import { useState } from 'react';

interface RatingData {
  month: string;
  ratings: number[];
  gamesPlayed?: number[]; // Number of games played for each rating
  hasInjury?: boolean;
}

interface MonthlyRatingChartProps {
  data?: RatingData[];
  averageRating?: number;
}

const MonthlyRatingChart: React.FC<MonthlyRatingChartProps> = ({
  data = [
    { month: 'Jan', ratings: [6.4, 6.7], gamesPlayed: [2, 3] },
    { month: 'Mar', ratings: [], gamesPlayed: [], hasInjury: true },
    { month: 'May', ratings: [], gamesPlayed: [] },
    { month: 'Jul', ratings: [], gamesPlayed: [], hasInjury: true },
    { month: 'Sep', ratings: [6.5, 7.4], gamesPlayed: [1, 2, 1] },
    { month: 'Nov', ratings: [6.6, 8.0, 5.8], gamesPlayed: [2, 1, 1] },
  ],
  // averageRating = 6.7,
}) => {
  // Track which bars are showing games played (using "monthIndex-ratingIndex" as key)
  const [showGamesPlayed, setShowGamesPlayed] = useState<Set<string>>(new Set());
  const maxRating = 10
  const chartHeight = 150; // Reduced from 220 for mobile

  // Get color based on rating
  const getBarColor = (rating: number): string => {
    if (rating < 6) return '#ef4444'; // Red
    if (rating < 7) return '#f97316'; // Orange
    if (rating < 8) return '#22c55e'; // Green
    return '#3b82f6'; // Blue
  };

  // Calculate bar height as percentage of max rating
  const getBarHeight = (rating: number): number => {
    return (rating / maxRating) * chartHeight;
  };

  return (
    <div className="block-style bg-white dark:bg-[#161B22] dark:border-[#1F2937] border border-snow-200 rounded-lg p-3 md:p-6">
      <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 theme-text">TikiAnaly Ratings (last 12 months)</h3>
      
      <div className="relative">
        {/* Chart Container */}
        <div className="relative" style={{ height: `${chartHeight + 60}px` }}>
          {/* Y-axis labels */}
          {/* <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between items-end pr-3" style={{ width: '40px' }}>
            <div className="flex flex-col items-end gap-2 text-xs text-neutral-n5 dark:text-snow-200">
              <span>10</span>
              <span>8</span>
              <span>7</span>
              <span>6</span>
              <span>0</span>
            </div>
          </div> */}

          {/* Chart Area */}
          <div className="pr-2 md:pr-4" style={{ height: `${chartHeight}px` }}>
            {/* Average line */}
            {/* <div
              className="absolute left-0 border-t border-dashed md:border-t-2"
              style={{
                bottom: `${(averageRating / maxRating) * chartHeight}px`,
                right: '16px',
                borderColor: '#eab308',
                zIndex: 1,
              }}
            ></div> */}

            {/* Bars */}
            <div className="flex items-end justify-between h-full px-2 md:px-4">
              {data.map((monthData, monthIndex) => (
                <div
                  key={monthData.month}
                  className="flex flex-col items-center"
                  style={{ flex: 1, gap: '4px' }}
                >
                  {/* Injury Icon */}
                  {monthData.hasInjury && (
                    <div className="mb-1 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-end justify-center gap-3 md:gap-1.5">
                    {monthData.ratings.length > 0 ? (
                      monthData.ratings.map((rating, ratingIndex) => {
                        const height = getBarHeight(rating);
                        const color = getBarColor(rating);
                        const barKey = `${monthIndex}-${ratingIndex}`;
                        const isShowingGames = showGamesPlayed.has(barKey);
                        const gamesPlayed = monthData.gamesPlayed?.[ratingIndex] || 0;
                        
                        return (
                          <div
                            key={barKey}
                            className="relative flex flex-col items-center"
                          >
                            {/* Bar */}
                            <div
                              className="rounded-t transition-all hover:opacity-80 cursor-pointer w-4.5 md:w-7"
                              style={{
                                height: `${height}px`,
                                backgroundColor: color,
                                minHeight: '3px',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowGamesPlayed((prev) => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(barKey)) {
                                    newSet.delete(barKey);
                                  } else {
                                    newSet.add(barKey);
                                  }
                                  return newSet;
                                });
                              }}
                            ></div>
                            {/* Value label - shows rating or games played */}
                            <span
                              className="text-[10px] md:text-xs font-semibold mt-1"
                              style={{ color }}
                            >
                              {isShowingGames ? gamesPlayed : rating.toFixed(1)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-neutral-n5 dark:text-snow-200 text-xs">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between px-2 md:px-4 mt-3 md:mt-4">
            {data.map((monthData) => (
              <span
                key={monthData.month}
                className="text-xs md:text-sm text-neutral-n5 dark:text-snow-200"
              >
                {monthData.month}
              </span>
            ))}
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-neutral-n5 dark:text-snow-200">
              Monthly average rating
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-green-600 dark:text-green-400">
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">Tap bar to show games played</span>
            <span className="sm:hidden">Tap bar for games</span>
          </div>
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-4 md:mt-5">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-xs md:text-sm text-neutral-n5 dark:text-snow-200">8+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
            <span className="text-xs md:text-sm text-neutral-n5 dark:text-snow-200">7-8</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span className="text-xs md:text-sm text-neutral-n5 dark:text-snow-200">6-7</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-xs md:text-sm text-neutral-n5 dark:text-snow-200">&lt;6</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRatingChart;

