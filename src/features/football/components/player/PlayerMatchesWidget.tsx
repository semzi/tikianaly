import { Link } from 'react-router-dom';

interface Match {
  id: string;
  date: string;
  status: 'live' | 'upcoming' | 'finished';
  minute?: number; // For live matches
  kickoffTime?: string; // For upcoming matches (e.g., "08:30 PM")
  league: string;
  leagueLogo?: string;
  homeTeam: {
    name: string;
    logo: string;
    score?: number;
  };
  awayTeam: {
    name: string;
    logo: string;
    score?: number;
  };
  playerRating?: number; // Player's rating for this match (0-10)
}

interface PlayerMatchesWidgetProps {
  matches?: Match[];
}

const PlayerMatchesWidget: React.FC<PlayerMatchesWidgetProps> = ({
  matches = [
    {
      id: '1',
      date: '2024-01-15',
      status: 'live',
      minute: 34,
      league: 'Ligue 1',
      leagueLogo: '/assets/icons/champions-league.png',
      homeTeam: {
        name: 'Barcelona',
        logo: '/assets/icons/Football/Team/Manchester City.png',
        score: 8,
      },
      awayTeam: {
        name: 'Real Madrid CF',
        logo: '/assets/icons/Football/Team/Arsenal.png',
        score: 3,
      },
      playerRating: 7.8,
    },
    {
      id: '2',
      date: '2024-01-20',
      status: 'live',
      minute: 41,
      league: 'Ligue 1',
      leagueLogo: '/assets/icons/champions-league.png',
      homeTeam: {
        name: 'Marseille',
        logo: '/assets/icons/Football/Team/Manchester City.png',
        score: 1,
      },
      awayTeam: {
        name: 'Monaco',
        logo: '/assets/icons/Football/Team/Arsenal.png',
        score: 2,
      },
      playerRating: 6.5,
    },
    {
      id: '3',
      date: '2024-01-25',
      status: 'upcoming',
      kickoffTime: '08:30 PM',
      league: 'Ligue 1',
      leagueLogo: '/assets/icons/champions-league.png',
      homeTeam: {
        name: 'Nice',
        logo: '/assets/icons/Football/Team/Manchester City.png',
      },
      awayTeam: {
        name: 'Rennes',
        logo: '/assets/icons/Football/Team/Arsenal.png',
      },
    },
    {
      id: '4',
      date: '2024-01-30',
      status: 'upcoming',
      kickoffTime: '09:45 PM',
      league: 'Ligue 1',
      leagueLogo: '/assets/icons/champions-league.png',
      homeTeam: {
        name: 'Lille',
        logo: '/assets/icons/Football/Team/Manchester City.png',
      },
      awayTeam: {
        name: 'Nantes',
        logo: '/assets/icons/Football/Team/Arsenal.png',
      },
    },
    {
      id: '5',
      date: '2024-02-05',
      status: 'finished',
      league: 'Premier League',
      leagueLogo: '/assets/icons/champions-league.png',
      homeTeam: {
        name: 'Manchester City',
        logo: '/assets/icons/Football/Team/Manchester City.png',
        score: 2,
      },
      awayTeam: {
        name: 'Arsenal',
        logo: '/assets/icons/Football/Team/Arsenal.png',
        score: 1,
      },
      playerRating: 8.2,
    },
    {
      id: '6',
      date: '2024-02-10',
      status: 'upcoming',
      kickoffTime: '03:00 PM',
      league: 'Premier League',
      leagueLogo: '/assets/icons/champions-league.png',
      homeTeam: {
        name: 'Liverpool',
        logo: '/assets/icons/Football/Team/Manchester City.png',
      },
      awayTeam: {
        name: 'Chelsea',
        logo: '/assets/icons/Football/Team/Arsenal.png',
      },
    },
    {
      id: '7',
      date: '2024-02-15',
      status: 'finished',
      league: 'La Liga',
      leagueLogo: '/assets/icons/champions-league.png',
      homeTeam: {
        name: 'Real Madrid',
        logo: '/assets/icons/Football/Team/Arsenal.png',
        score: 3,
      },
      awayTeam: {
        name: 'Barcelona',
        logo: '/assets/icons/Football/Team/Manchester City.png',
        score: 2,
      },
      playerRating: 7.5,
    },
    {
      id: '8',
      date: '2024-02-20',
      status: 'upcoming',
      kickoffTime: '07:00 PM',
      league: 'Serie A',
      leagueLogo: '/assets/icons/champions-league.png',
      homeTeam: {
        name: 'AC Milan',
        logo: '/assets/icons/Football/Team/Manchester City.png',
      },
      awayTeam: {
        name: 'Inter Milan',
        logo: '/assets/icons/Football/Team/Arsenal.png',
      },
    },
    {
      id: '9',
      date: '2024-02-25',
      status: 'finished',
      league: 'Bundesliga',
      leagueLogo: '/assets/icons/champions-league.png',
      homeTeam: {
        name: 'Bayern Munich',
        logo: '/assets/icons/Football/Team/Manchester City.png',
        score: 4,
      },
      awayTeam: {
        name: 'Borussia Dortmund',
        logo: '/assets/icons/Football/Team/Arsenal.png',
        score: 1,
      },
      playerRating: 9.1,
    },
  ],
}) => {
  // Get color based on rating
  const getRatingColor = (rating?: number): string => {
    if (!rating) return '#6b7280'; // Gray for no rating
    if (rating < 6) return '#ef4444'; // Red
    if (rating < 7) return '#f97316'; // Orange
    if (rating < 8) return '#22c55e'; // Green
    return '#3b82f6'; // Blue
  };

  // Group matches by league
  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.league]) {
      acc[match.league] = [];
    }
    acc[match.league].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedMatches).map(([league, leagueMatches]) => (
        <div key={league} className="block-style">
          {/* League Header */}
          <div className="flex items-center gap-2 mb-4">
            {leagueMatches[0]?.leagueLogo && (
              <img
                src={leagueMatches[0].leagueLogo}
                alt={league}
                className="w-5 h-5"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <h3 className="text-lg font-semibold theme-text">{league}</h3>
          </div>

          {/* Matches List */}
          <div className="space-y-3">
            {leagueMatches.map((match) => (
              <Link
                key={match.id}
                to={`/game/${match.id}`}
                className="block hover:bg-snow-100 dark:hover:bg-[#1F2937] rounded-lg p-3 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Status/Time */}
                  <div className="flex-shrink-0 w-10 flex items-center justify-center">
                    {match.status === 'live' && match.minute !== undefined ? (
                      <span className="text-orange-500 font-medium text-xs">
                        {match.minute}'
                      </span>
                    ) : match.status === 'upcoming' && match.kickoffTime ? (
                      <span className="text-neutral-n5 dark:text-snow-200 text-[10px]">
                        {match.kickoffTime}
                      </span>
                    ) : (
                      <span className="text-neutral-n5 dark:text-snow-200 text-[10px]">
                        {new Date(match.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Center: Teams and Scores - Stacked Vertically */}
                  <div className="flex-1 flex flex-col gap-0.5">
                    {/* Home Team */}
                    <div className="flex items-center gap-1 justify-between">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <img
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.name}
                          className="w-5 h-5 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/icons/Football/Team/Manchester City.png';
                          }}
                        />
                        <span className="text-sm font-medium theme-text truncate">
                          {match.homeTeam.name}
                        </span>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                        <span className="text-xs font-normal theme-text">
                          {match.homeTeam.score !== undefined
                            ? match.homeTeam.score
                            : '-'}
                        </span>
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-1 justify-between">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <img
                          src={match.awayTeam.logo}
                          alt={match.awayTeam.name}
                          className="w-5 h-5 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/icons/Football/Team/Arsenal.png';
                          }}
                        />
                        <span className="text-sm font-medium theme-text truncate">
                          {match.awayTeam.name}
                        </span>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                        <span className="text-xs font-normal theme-text">
                          {match.awayTeam.score !== undefined
                            ? match.awayTeam.score
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Player Rating Circle */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white dark:border-[#161B22] shadow-lg"
                      style={{
                        backgroundColor: match.status === 'upcoming' || match.playerRating === undefined
                          ? '#6b7280' // Gray for upcoming or no rating
                          : getRatingColor(match.playerRating),
                      }}
                    >
                      {match.status === 'upcoming' || match.playerRating === undefined
                        ? '-'
                        : match.playerRating.toFixed(1)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerMatchesWidget;

