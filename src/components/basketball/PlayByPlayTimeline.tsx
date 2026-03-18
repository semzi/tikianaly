import React, { useState, useEffect } from "react";

// Type Definitions
interface PlayByPlayEvent {
  _id: string;
  match_id: number;
  period: number;
  time: string;
  team_id: number;
  player_name?: string;
  event_type: string;
  event_description: string;
  points_scored?: number;
  assist_player?: string;
  home_score: number;
  away_score: number;
}

interface QuarterGroup {
  period: number;
  events: PlayByPlayEvent[];
  homeScore: number;
  awayScore: number;
}

interface PlayByPlayTimelineProps {
  events: PlayByPlayEvent[];
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId: string | number;
  awayTeamId: string | number;
  currentQuarter?: number;
  onEventClick?: (event: PlayByPlayEvent) => void;
}

/**
 * PlayByPlayTimeline Component
 * 
 * A reusable, mobile-first basketball play-by-play timeline component.
 * Displays chronological game events grouped by quarters with collapsible sections.
 */
const PlayByPlayTimeline: React.FC<PlayByPlayTimelineProps> = ({
  events,
  homeTeamName,
  awayTeamName,
  homeTeamId,
  awayTeamId,
  currentQuarter,
  onEventClick,
}) => {
  const [expandedQuarters, setExpandedQuarters] = useState<Record<number, boolean>>({});

  // Initialize expanded quarters - current quarter expanded, others collapsed
  useEffect(() => {
    if (events.length === 0) return;

    const quarters = [...new Set(events.map((e) => e.period))];
    const initialExpansion: Record<number, boolean> = {};

    quarters.forEach((quarter) => {
      // If currentQuarter is provided, expand only that one
      // Otherwise, expand the last quarter (most recent)
      if (currentQuarter !== undefined) {
        initialExpansion[quarter] = quarter === currentQuarter;
      } else {
        initialExpansion[quarter] = quarter === Math.max(...quarters);
      }
    });

    setExpandedQuarters(initialExpansion);
  }, [events, currentQuarter]);

  // Toggle quarter expansion
  const toggleQuarter = (period: number) => {
    setExpandedQuarters((prev) => ({
      ...prev,
      [period]: !prev[period],
    }));
  };

  // Group events by quarter
  const groupEventsByQuarter = (): QuarterGroup[] => {
    const quarters: Record<number, QuarterGroup> = {};

    events.forEach((event) => {
      const period = event.period;
      if (!quarters[period]) {
        quarters[period] = {
          period,
          events: [],
          homeScore: 0,
          awayScore: 0,
        };
      }
      quarters[period].events.push(event);
      
      // Track final scores for each quarter
      if (quarters[period].events.length > 0) {
        const lastEvent = quarters[period].events[quarters[period].events.length - 1];
        quarters[period].homeScore = lastEvent.home_score;
        quarters[period].awayScore = lastEvent.away_score;
      }
    });

    return Object.values(quarters).sort((a, b) => a.period - b.period);
  };

  const groupedEvents = groupEventsByQuarter();

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No play-by-play data available yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Events will appear here as the game progresses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0D1117] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      {groupedEvents.map((quarter) => (
        <QuarterSection
          key={quarter.period}
          period={quarter.period}
          homeScore={quarter.homeScore}
          awayScore={quarter.awayScore}
          events={quarter.events}
          isExpanded={expandedQuarters[quarter.period] || false}
          onToggle={() => toggleQuarter(quarter.period)}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
};

// Quarter Section Sub-Component
interface QuarterSectionProps {
  period: number;
  homeScore: number;
  awayScore: number;
  events: PlayByPlayEvent[];
  isExpanded: boolean;
  onToggle: () => void;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId: string | number;
  awayTeamId: string | number;
  onEventClick?: (event: PlayByPlayEvent) => void;
}

const QuarterSection: React.FC<QuarterSectionProps> = ({
  period,
  homeScore,
  awayScore,
  events,
  isExpanded,
  onToggle,
  homeTeamId,
  onEventClick,
}) => {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      {/* Quarter Header - Collapsible */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            Q{period}
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {homeScore} - {awayScore}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Events List */}
      {isExpanded && (
        <div className="px-4 pb-3 space-y-1 animate-fadeIn">
          {events.map((event) => {
            // Determine which team the event belongs to
            const isHomeEvent = event.team_id.toString() === homeTeamId.toString();

            return (
              <div
                key={event._id}
                onClick={() => onEventClick?.(event)}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all cursor-pointer ${
                  isHomeEvent ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Left Side (Home Team Events) */}
                <div
                  className={`flex-1 ${
                    isHomeEvent ? "text-right" : "text-left"
                  }`}
                >
                  {isHomeEvent ? (
                    <>
                      {/* Time */}
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-mono">
                        {event.time}
                      </span>
                      {/* Player Name */}
                      {event.player_name && (
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight mb-0.5">
                          {event.player_name}
                        </p>
                      )}
                      {/* Action Description */}
                      <p className="text-xs text-gray-600 dark:text-gray-400 opacity-80 leading-tight">
                        {event.event_description}
                      </p>
                    </>
                  ) : (
                    <div className="h-full" />
                  )}
                </div>

                {/* Center - Score */}
                <div className="flex flex-col items-center px-3 min-w-[100px]">
                  {/* Points Indicator */}
                  {event.points_scored && (
                    <span
                      className={`text-[10px] font-black mb-0.5 px-1.5 py-0.5 rounded-full ${
                        isHomeEvent
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      +{event.points_scored}
                    </span>
                  )}
                  {/* Score */}
                  <span className="text-base font-black text-gray-900 dark:text-gray-100 tabular-nums">
                    {event.home_score} - {event.away_score}
                  </span>
                </div>

                {/* Right Side (Away Team Events) */}
                <div
                  className={`flex-1 ${
                    !isHomeEvent ? "text-right" : "text-left"
                  }`}
                >
                  {!isHomeEvent ? (
                    <>
                      {/* Time */}
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-mono">
                        {event.time}
                      </span>
                      {/* Player Name */}
                      {event.player_name && (
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight mb-0.5">
                          {event.player_name}
                        </p>
                      )}
                      {/* Action Description */}
                      <p className="text-xs text-gray-600 dark:text-gray-400 opacity-80 leading-tight">
                        {event.event_description}
                      </p>
                    </>
                  ) : (
                    <div className="h-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlayByPlayTimeline;
