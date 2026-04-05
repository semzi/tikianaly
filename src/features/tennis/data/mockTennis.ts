export type TennisMatchStatus =
  | "Not Started"
  | "Live"
  | "Finished"
  | "Postponed"
  | "Cancelled";

export type TennisMatch = {
  id: string;
  tournament: string;
  round?: string;
  court?: string;
  status: TennisMatchStatus | string;
  startTime: string;
  player1: { id?: string; name: string; score?: string | number };
  player2: { id?: string; name: string; score?: string | number };
  setScores?: Array<{ p1: string | number; p2: string | number }>;
  isLive?: boolean;
};

export const mockTennisLiveMatches: TennisMatch[] = [
  {
    id: "t-live-1",
    tournament: "ATP Miami",
    round: "Quarter-final",
    court: "Center Court",
    status: "Live",
    startTime: "13:00",
    player1: { id: "1945", name: "N. Djokovic", score: 1 },
    player2: { id: "2010", name: "C. Alcaraz", score: 1 },
    setScores: [
      { p1: 6, p2: 4 },
      { p1: 3, p2: 6 },
      { p1: 2, p2: 1 },
    ],
    isLive: true,
  },
  {
    id: "t-live-2",
    tournament: "WTA Miami",
    round: "Round of 16",
    court: "Grandstand",
    status: "Live",
    startTime: "14:20",
    player1: { id: "3001", name: "I. Swiatek", score: 1 },
    player2: { id: "3002", name: "C. Gauff", score: 0 },
    setScores: [
      { p1: 7, p2: 5 },
      { p1: 2, p2: 1 },
    ],
    isLive: true,
  },
];

export const mockTennisTodayMatches: TennisMatch[] = [
  ...mockTennisLiveMatches,
  {
    id: "t-today-3",
    tournament: "ATP Miami",
    round: "Round of 16",
    court: "Court 1",
    status: "Finished",
    startTime: "10:30",
    player1: { name: "D. Medvedev", score: 2 },
    player2: { name: "H. Rune", score: 0 },
    setScores: [
      { p1: 6, p2: 4 },
      { p1: 6, p2: 3 },
    ],
  },
  {
    id: "t-today-4",
    tournament: "WTA Miami",
    round: "Quarter-final",
    court: "Center Court",
    status: "Not Started",
    startTime: "18:00",
    player1: { name: "A. Sabalenka", score: "-" },
    player2: { name: "E. Rybakina", score: "-" },
  },
];

export const mockTennisUpcomingMatches: TennisMatch[] = [
  {
    id: "t-up-1",
    tournament: "ATP Miami",
    round: "Semi-final",
    court: "Center Court",
    status: "Not Started",
    startTime: "Tomorrow 16:00",
    player1: { name: "Winner QF 1", score: "-" },
    player2: { name: "Winner QF 2", score: "-" },
  },
  {
    id: "t-up-2",
    tournament: "WTA Miami",
    round: "Semi-final",
    court: "Center Court",
    status: "Not Started",
    startTime: "Tomorrow 18:30",
    player1: { name: "Winner QF 1", score: "-" },
    player2: { name: "Winner QF 2", score: "-" },
  },
];
