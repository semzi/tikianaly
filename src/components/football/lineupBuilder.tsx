export default function LineupBuilder() {
  const demoData = {
    lineups: {
      home: {
        team_id: "102",
        team_name: "Arsenal",
        formation: "4-2-3-1",
        starting: [
          {
            player_id: "1",
            name: "David Raya",
            position: "Goalkeeper",
            shirt_number: 22
          },
          {
            player_id: "2",
            name: "Ben White",
            position: "Defender",
            shirt_number: 4
          },
          {
            player_id: "3",
            name: "William Saliba",
            position: "Defender",
            shirt_number: 2
          },
          {
            player_id: "4",
            name: "Gabriel Magalhaes",
            position: "Defender",
            shirt_number: 6
          },
          {
            player_id: "5",
            name: "Oleksandr Zinchenko",
            position: "Defender",
            shirt_number: 35
          },
          {
            player_id: "6",
            name: "Declan Rice",
            position: "Midfielder",
            shirt_number: 41
          },
          {
            player_id: "7",
            name: "Jorginho",
            position: "Midfielder",
            shirt_number: 20
          },
          {
            player_id: "8",
            name: "Bukayo Saka",
            position: "Forward",
            shirt_number: 7
          },
          {
            player_id: "9",
            name: "Martin Odegaard",
            position: "Midfielder",
            shirt_number: 8
          },
          {
            player_id: "10",
            name: "Gabriel Martinelli",
            position: "Forward",
            shirt_number: 11
          },
          {
            player_id: "11",
            name: "Kai Havertz",
            position: "Forward",
            shirt_number: 29
          }
        ],
        substitutes: [
          {
            player_id: "12",
            name: "Aaron Ramsdale",
            position: "Goalkeeper"
          },
          {
            player_id: "13",
            name: "Emile Smith Rowe",
            position: "Midfielder"
          }
        ]
      }
      ,
      away: {
        team_id: "103",
        team_name: "Manchester City",
        formation: "4-3-3",
        starting: [
          { player_id: "21", name: "Ederson", position: "Goalkeeper", shirt_number: 31 },
          { player_id: "22", name: "Kyle Walker", position: "Defender", shirt_number: 2 },
          { player_id: "23", name: "Ruben Dias", position: "Defender", shirt_number: 3 },
          { player_id: "24", name: "John Stones", position: "Defender", shirt_number: 5 },
          { player_id: "25", name: "Joao Cancelo", position: "Defender", shirt_number: 27 },
          { player_id: "26", name: "Rodri", position: "Midfielder", shirt_number: 16 },
          { player_id: "27", name: "Kevin De Bruyne", position: "Midfielder", shirt_number: 17 },
          { player_id: "28", name: "Bernardo Silva", position: "Midfielder", shirt_number: 20 },
          { player_id: "29", name: "Phil Foden", position: "Forward", shirt_number: 47 },
          { player_id: "30", name: "Erling Haaland", position: "Forward", shirt_number: 9 },
          { player_id: "31", name: "Riyad Mahrez", position: "Forward", shirt_number: 26 }
        ],
        substitutes: [
          { player_id: "32", name: "Stefan Ortega", position: "Goalkeeper" },
          { player_id: "33", name: "Ilkay Gundogan", position: "Midfielder" }
        ]
      }
    }
  };

  const homeStartingPlayers = demoData.lineups.home.starting;

  const goalkeepers = homeStartingPlayers.filter(p => p.position === "Goalkeeper");
  const defenders = homeStartingPlayers.filter(p => p.position === "Defender");
  const midfielders = homeStartingPlayers.filter(p => p.position === "Midfielder");
  const forwards = homeStartingPlayers.filter(p => p.position === "Forward");

  // Away players (demo)
  const awayStartingPlayers = demoData.lineups.away.starting;
  const goalkeepersAway = awayStartingPlayers.filter(p => p.position === "Goalkeeper");
  const defendersAway = awayStartingPlayers.filter(p => p.position === "Defender");
  const midfieldersAway = awayStartingPlayers.filter(p => p.position === "Midfielder");
  const forwardsAway = awayStartingPlayers.filter(p => p.position === "Forward");

    return (
        <div className="flex gap-5">
            <div className="flex-3"></div>
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
  <div className="home-half absolute inset-y-0 left-0 w-1/2 bg-black/30 pointer-events-none" />
  <div className="away-half absolute inset-y-0 right-0 w-1/2 bg-white/30 pointer-events-none" />

        {/* Home Team Players */}
        {/* Goalkeepers */}
        {goalkeepers.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `10%`,
              top: `calc(${(index + 0.5) / goalkeepers.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}

        {/* Defenders */}
        {defenders.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `25%`,
              top: `calc(${(index + 0.5) / defenders.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}

        {/* Midfielders */}
        {midfielders.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `40%`,
              top: `calc(${(index + 0.5) / midfielders.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}

        {/* Forwards */}
        {forwards.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `48%`,
              top: `calc(${(index + 0.5) / forwards.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}

        {/* Away Team Players (mirrored on the right half) */}
        {/* Goalkeepers (away) */}
        {goalkeepersAway.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
            style={{
              left: `90%`,
              top: `calc(${(index + 0.5) / goalkeepersAway.length * 100}% - 24px)`,
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}

        {/* Defenders (away) */}
        {defendersAway.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
              style={{
                left: `75%`,
                top: `calc(${(index + 0.5) / defendersAway.length * 100}% - 24px)`,
              }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}

        {/* Midfielders (away) */}
        {midfieldersAway.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
              style={{
                left: `60%`,
                top: `calc(${(index + 0.5) / midfieldersAway.length * 100}% - 24px)`,
              }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}

        {/* Forwards (away) */}
        {forwardsAway.map((player, index) => (
          <div
            key={player.player_id}
            className="absolute"
              style={{
                left: `55%`,
                top: `calc(${(index + 0.5) / forwardsAway.length * 100}% - 24px)`,
              }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                {player.shirt_number}
              </div>
              <span className="text-xs text-white font-medium text-center bg-black/50 px-1 rounded whitespace-nowrap">
                {player.name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}
            </div>
        </div>
    );
}
