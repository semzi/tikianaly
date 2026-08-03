export type AmericanFootballStandingsTeam = {
  id: string;
  position: number;
  name: string;
  won: number;
  lost: number;
  ties: number;
  winPct: string;
  pointsFor: number;
  pointsAgainst: number;
  streak: string;
};

export type AmericanFootballStandingsGroup = {
  conference?: string;
  division?: string;
  teams: AmericanFootballStandingsTeam[];
};

export const mockLeagueStandings: Record<string, AmericanFootballStandingsGroup[]> = {
  nfl: [
    {
      conference: "AFC",
      division: "East",
      teams: [
        { id: "1", position: 1, name: "Buffalo Bills", won: 11, lost: 3, ties: 0, winPct: ".786", pointsFor: 389, pointsAgainst: 271, streak: "W3" },
        { id: "2", position: 2, name: "Miami Dolphins", won: 8, lost: 6, ties: 0, winPct: ".571", pointsFor: 320, pointsAgainst: 298, streak: "L1" },
        { id: "3", position: 3, name: "New York Jets", won: 5, lost: 9, ties: 0, winPct: ".357", pointsFor: 260, pointsAgainst: 310, streak: "L2" },
        { id: "4", position: 4, name: "New England Patriots", won: 4, lost: 10, ties: 0, winPct: ".286", pointsFor: 240, pointsAgainst: 330, streak: "L4" },
      ],
    },
    {
      conference: "AFC",
      division: "North",
      teams: [
        { id: "5", position: 1, name: "Baltimore Ravens", won: 10, lost: 4, ties: 0, winPct: ".714", pointsFor: 370, pointsAgainst: 280, streak: "W2" },
        { id: "6", position: 2, name: "Cincinnati Bengals", won: 9, lost: 5, ties: 0, winPct: ".643", pointsFor: 350, pointsAgainst: 290, streak: "W1" },
        { id: "7", position: 3, name: "Pittsburgh Steelers", won: 7, lost: 7, ties: 0, winPct: ".500", pointsFor: 300, pointsAgainst: 300, streak: "L1" },
        { id: "8", position: 4, name: "Cleveland Browns", won: 4, lost: 10, ties: 0, winPct: ".286", pointsFor: 250, pointsAgainst: 340, streak: "L3" },
      ],
    },
    {
      conference: "NFC",
      division: "East",
      teams: [
        { id: "9", position: 1, name: "Philadelphia Eagles", won: 11, lost: 3, ties: 0, winPct: ".786", pointsFor: 400, pointsAgainst: 265, streak: "W5" },
        { id: "10", position: 2, name: "Dallas Cowboys", won: 9, lost: 5, ties: 0, winPct: ".643", pointsFor: 360, pointsAgainst: 300, streak: "W1" },
        { id: "11", position: 3, name: "Washington Commanders", won: 6, lost: 8, ties: 0, winPct: ".429", pointsFor: 290, pointsAgainst: 320, streak: "L2" },
        { id: "12", position: 4, name: "New York Giants", won: 3, lost: 11, ties: 0, winPct: ".214", pointsFor: 230, pointsAgainst: 360, streak: "L6" },
      ],
    },
    {
      conference: "NFC",
      division: "North",
      teams: [
        { id: "13", position: 1, name: "Detroit Lions", won: 12, lost: 2, ties: 0, winPct: ".857", pointsFor: 420, pointsAgainst: 250, streak: "W7" },
        { id: "14", position: 2, name: "Green Bay Packers", won: 9, lost: 5, ties: 0, winPct: ".643", pointsFor: 355, pointsAgainst: 295, streak: "W2" },
        { id: "15", position: 3, name: "Minnesota Vikings", won: 8, lost: 6, ties: 0, winPct: ".571", pointsFor: 330, pointsAgainst: 310, streak: "L1" },
        { id: "16", position: 4, name: "Chicago Bears", won: 5, lost: 9, ties: 0, winPct: ".357", pointsFor: 270, pointsAgainst: 335, streak: "L2" },
      ],
    },
  ],
  "ncaa-fbs": [
    {
      teams: [
        { id: "101", position: 1, name: "Ohio State", won: 12, lost: 1, ties: 0, winPct: ".923", pointsFor: 480, pointsAgainst: 210, streak: "W9" },
        { id: "102", position: 2, name: "Georgia", won: 11, lost: 2, ties: 0, winPct: ".846", pointsFor: 450, pointsAgainst: 230, streak: "W4" },
        { id: "103", position: 3, name: "Texas", won: 10, lost: 2, ties: 0, winPct: ".833", pointsFor: 420, pointsAgainst: 250, streak: "L1" },
      ],
    },
  ],
  cfl: [
    {
      teams: [
        { id: "201", position: 1, name: "Winnipeg Blue Bombers", won: 12, lost: 6, ties: 0, winPct: ".667", pointsFor: 480, pointsAgainst: 400, streak: "W2" },
        { id: "202", position: 2, name: "Montreal Alouettes", won: 10, lost: 8, ties: 0, winPct: ".556", pointsFor: 440, pointsAgainst: 420, streak: "L1" },
      ],
    },
  ],
};
