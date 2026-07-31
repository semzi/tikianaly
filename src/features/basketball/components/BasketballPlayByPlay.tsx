interface PlayEvent {
  id: string;
  number: number;
  team_scored: "home" | "away";
  home_score: number;
  away_score: number;
  leader_team: "home" | "away" | "draw";
  points_difference: number;
}

interface BasketballPlayByPlayProps {
  plays: PlayEvent[];
  homeTeam: string;
  awayTeam: string;
}

const TeamDot = ({ team }: { team: "home" | "away" }) => (
  <div
    className={`w-2 h-2 rounded-full shrink-0 ${
      team === "home" ? "bg-orange-500" : "bg-blue-500"
    }`}
  />
);

const BasketballPlayByPlay = ({ plays, homeTeam, awayTeam }: BasketballPlayByPlayProps) => {
  const homeAbbr = homeTeam.length > 12 ? homeTeam.split(" ").pop() || homeTeam : homeTeam;
  const awayAbbr = awayTeam.length > 12 ? awayTeam.split(" ").pop() || awayTeam : awayTeam;

  if (plays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
        <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs font-medium">No play-by-play data available</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
      {plays.map((play) => {
        const isHome = play.team_scored === "home";
        const isDraw = play.leader_team === "draw";

        return (
          <div
            key={play.id}
            className={`flex items-center py-1.5 px-3 text-xs ${
              isHome ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className={`flex items-center gap-1.5 flex-1 min-w-0 ${isHome ? "" : "flex-row-reverse"}`}>
              <TeamDot team={play.team_scored} />
              <span className={`font-semibold truncate ${
                isHome ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
              }`}>
                {isHome ? homeAbbr : awayAbbr}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2 shrink-0">
              <span className={`font-bold tabular-nums ${
                isDraw ? "text-gray-400" : isHome ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
              }`}>
                {play.home_score}-{play.away_score}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium min-w-[2rem] text-right">
                {isDraw ? "Tie" : `${play.points_difference > 0 ? "+" : ""}${play.points_difference}`}
              </span>
            </div>

            <div className="flex-1 min-w-0" />
          </div>
        );
      })}
    </div>
  );
};

export default BasketballPlayByPlay;
