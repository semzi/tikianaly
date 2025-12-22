import { useState } from "react";

type TeamApi = {
  player: Array<{ id: string; name: string; number: string; booking?: string }>;
  formation?: string;
};

export default function LineupBuilder({
  // Accept either `home`/`away` or `localteam`/`visitorteam` prop names for flexibility
  home,
  away,
  localteam,
  visitorteam,
}: {
  home?: TeamApi;
  away?: TeamApi;
  localteam?: TeamApi;
  visitorteam?: TeamApi;
}) {
  // prefer explicit home/away props, fall back to localteam/visitorteam
  const propHome = home ?? localteam;
  const propAway = away ?? visitorteam;
  const [showHome, setShowHome] = useState(true);
  const [showAway, setShowAway] = useState(true);
  

  // Convert API shape into internal lineup structure.
  const parseFormation = (formation = "4-4-2") => {
    // convert "4-2-3-1" -> [4,2,3,1]
    const parts = formation.split("-").map((p) => parseInt(p, 10)).filter(Boolean);
    return parts.length ? parts : [4, 4, 2];
  };

  const buildTeamFromApi = (team?: TeamApi) => {
    if (!team || !Array.isArray(team.player) || team.player.length === 0) return null;
  const players = team.player;
  const formationParts = parseFormation(team.formation ?? "4-4-2");

    // GK is first
    const starting: Array<any> = [];
    const first = players[0];
    starting.push({ player_id: first.id, name: first.name, position: "Goalkeeper", shirt_number: Number(first.number || 0) });

    // remaining players
    const rest = players.slice(1);

    // defenders = first formation part
    const defendersCount = formationParts[0] ?? 4;
    const forwardsCount = formationParts[formationParts.length - 1] ?? 1;
    const midfieldCounts = formationParts.slice(1, -1);
    const midfieldersCount = midfieldCounts.reduce((s, v) => s + v, 0) || 0;

    let cursor = 0;
    const take = (n: number, position: string) => {
      const slice = rest.slice(cursor, cursor + n);
      cursor += n;
      slice.forEach((p) => starting.push({ player_id: p.id, name: p.name, position, shirt_number: Number(p.number || 0) }));
    };

    take(defendersCount, "Defender");
    if (midfieldersCount > 0) take(midfieldersCount, "Midfielder");
    // remaining -> forwards (if forwardsCount doesn't match remainder, use forwardsCount)
    const remaining = rest.length - cursor;
    const takeForwards = Math.max(forwardsCount, remaining);
    take(takeForwards, "Forward");

    return {
      team_id: "api-team",
      team_name: "API Team",
      formation: team.formation ?? "4-4-2",
      starting,
      substitutes: [],
    };
  };
  // Build lineups from provided props only (no demo data)
  const homeLineup = propHome ? buildTeamFromApi(propHome) : null;
  const awayLineup = propAway ? buildTeamFromApi(propAway) : null;

  const homeStartingPlayers = homeLineup?.starting ?? [];

  const goalkeepers = homeStartingPlayers.filter(p => p.position === "Goalkeeper");
  const defenders = homeStartingPlayers.filter(p => p.position === "Defender");
  const midfielders = homeStartingPlayers.filter(p => p.position === "Midfielder");
  const forwards = homeStartingPlayers.filter(p => p.position === "Forward");

  // Away players
  const awayStartingPlayers = awayLineup?.starting ?? [];

  // If neither lineup is provided, show a friendly message
  if (!homeLineup && !awayLineup) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <p className="theme-text">Lineup not available</p>
      </div>
    );
  }
  const goalkeepersAway = awayStartingPlayers.filter(p => p.position === "Goalkeeper");
  const defendersAway = awayStartingPlayers.filter(p => p.position === "Defender");
  const midfieldersAway = awayStartingPlayers.filter(p => p.position === "Midfielder");
  const forwardsAway = awayStartingPlayers.filter(p => p.position === "Forward");

    return (
        <div className="flex gap-5">
            
            <div
                className="
            flex-7
            grid grid-cols-2
        w-full
        bg-[url('/pitch/light.svg')]
        dark:bg-[url('/pitch/dark.svg')]
        bg-center
        bg-no-repeat
        bg-cover
        [aspect-ratio:4/3]
        relative
      "
      >
  <div className="home-half absolute inset-y-0 left-0 w-1/2 pointer-events-none" />
  <div className="away-half absolute inset-y-0 right-0 w-1/2  pointer-events-none" />

        {/* Toggle controls */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <button
            type="button"
            onClick={() => setShowHome((s) => !s)}
            className={`px-3 py-1 rounded ${showHome ? 'bg-blue-600 text-white' : 'bg-white/40 text-black'}`}
          >
            {showHome ? 'Hide Home' : 'Show Home'}
          </button>
          <button
            type="button"
            onClick={() => setShowAway((s) => !s)}
            className={`px-3 py-1 rounded ${showAway ? 'bg-brand-secondary text-white' : 'bg-white/40 text-black'}`}
          >
            {showAway ? 'Hide Away' : 'Show Away'}
          </button>
        </div>

        {/* Home Team Players */}
        {/* Goalkeepers */}
        {showHome && goalkeepers.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `5%`,
              top: `calc(${(index + 0.5) / goalkeepers.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name}
              </span>
            </div>
          </div>
        ))}

        {/* Defenders */}
        {showHome && defenders.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `14%`,
              top: `calc(${(index + 0.5) / defenders.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name}
              </span>
            </div>
          </div>
        ))}

        {/* Midfielders */}
        {showHome && midfielders.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `28%`,
              top: `calc(${(index + 0.5) / midfielders.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name}
              </span>
            </div>
          </div>
        ))}

        {/* Forwards */}
        {showHome && forwards.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `40%`,
              top: `calc(${(index + 0.5) / forwards.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name}
              </span>
            </div>
          </div>
        ))}

        {/* Away Team Players (mirrored on the right half) */}
        {/* Goalkeepers (away) */}
        {showAway && goalkeepersAway.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `90%`,
              top: `calc(${(index + 0.5) / goalkeepersAway.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name}
              </span>
            </div>
          </div>
        ))}

        {/* Defenders (away) */}
        {showAway && defendersAway.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
              style={{
              left: `80%`,
                top: `calc(${(index + 0.5) / defendersAway.length * 100}% - 24px)`,
              }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name}
              </span>
            </div>
          </div>
        ))}

        {/* Midfielders (away) */}
        {showAway && midfieldersAway.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
              style={{
              left: `65%`,
                top: `calc(${(index + 0.5) / midfieldersAway.length * 100}% - 24px)`,
              }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name}
              </span>
            </div>
          </div>
        ))}

        {/* Forwards (away) */}
        {showAway && forwardsAway.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
              style={{
              left: `55%`,
                top: `calc(${(index + 0.5) / forwardsAway.length * 100}% - 24px)`,
              }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name}
              </span>
            </div>
          </div>
        ))}
            </div>
        </div>
    );
}
