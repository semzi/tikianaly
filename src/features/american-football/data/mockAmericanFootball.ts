export type AmericanFootballMatch = {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  status: string;
  period: string;
  clock: string;
  kickoff: string;
  venue: string;
  score: string;
  highlight: string;
  stats?: AmericanFootballStat[];
  timeline?: AmericanFootballTimelineEvent[];
  // NEW — quarter-by-quarter breakdown, optional until backend ships it
  quarters?: {
    home: [string | number, string | number, string | number, string | number];
    away: [string | number, string | number, string | number, string | number];
  };
  // NEW — extra match-day info for the Info tab, optional until backend ships it
  matchInfo?: AmericanFootballMatchInfo;
};

export type AmericanFootballStat = {
  label: string;
  home: string | number;
  away: string | number;
};

export type AmericanFootballTimelineEvent = {
  time: string;
  event: string;
  side: "home" | "away" | "neutral";
};

export type AmericanFootballMatchInfo = {
  referee: string;
  attendance: string;
  weather: string;
  surface: string;
};

export type AmericanFootballLeague = {
  id: string;
  name: string;
  region: string;
  season: string;
  teams: string;
  tier: string;
  description: string;
};

export type AmericanFootballNewsItem = {
  id: string;
  title: string;
  summary: string;
  timeAgo: string;
  readTime: string;
  tag: string;
};

export const mockAmericanFootballLiveMatches: AmericanFootballMatch[] = [
  {
    id: "af-101",
    league: "NFL",
    homeTeam: "Chiefs",
    awayTeam: "Bills",
    status: "Live",
    period: "2nd Quarter",
    clock: "08:14",
    kickoff: "8:00 PM",
    venue: "Arrowhead Stadium",
    score: "14 - 17",
    highlight: "High pace game with a late interception swing.",
    quarters: {
      home: [7, 7, "-", "-"],
      away: [3, 14, "-", "-"],
    },
    stats: [
      { label: "Total Yards", home: 238, away: 261 },
      { label: "Passing Yards", home: 156, away: 184 },
      { label: "Rushing Yards", home: 82, away: 77 },
      { label: "First Downs", home: 14, away: 16 },
      { label: "3rd Down Efficiency", home: "4/9", away: "6/10" },
      { label: "4th Down Efficiency", home: "0/0", away: "1/1" },
      { label: "Penalties", home: "3-25", away: "5-40" },
      { label: "Time of Possession", home: "14:02", away: "15:58" },
    ],
    timeline: [
      {
        time: "Q1 · 8:41",
        event: "Chiefs — 12 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q1 · 2:03",
        event: "Bills — 3 Yd TD rush, extra point good.",
        side: "away",
      },
      {
        time: "Q2 · 11:20",
        event: "Bills — 35 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q2 · 8:14",
        event: "Bills — 18 Yd TD pass, extra point good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "B. Allen",
      attendance: "76,203",
      weather: "68°F, Partly Cloudy",
      surface: "Grass",
    },
  },
  {
    id: "af-102",
    league: "NCAA FBS",
    homeTeam: "Georgia",
    awayTeam: "Alabama",
    status: "Live",
    period: "3rd Quarter",
    clock: "03:22",
    kickoff: "7:30 PM",
    venue: "Bryant-Denny",
    score: "21 - 24",
    highlight: "Momentum shifts after a long touchdown drive.",
    quarters: {
      home: [7, 7, 7, "-"],
      away: [10, 7, 7, "-"],
    },
    stats: [
      { label: "Total Yards", home: 301, away: 329 },
      { label: "Passing Yards", home: 190, away: 205 },
      { label: "Rushing Yards", home: 111, away: 124 },
      { label: "First Downs", home: 17, away: 19 },
      { label: "3rd Down Efficiency", home: "5/11", away: "6/12" },
      { label: "4th Down Efficiency", home: "1/2", away: "0/0" },
      { label: "Penalties", home: "4-35", away: "6-52" },
      { label: "Time of Possession", home: "21:10", away: "23:50" },
    ],
    timeline: [
      {
        time: "Q1 · 9:15",
        event: "Alabama — 22 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q1 · 4:02",
        event: "Georgia — 8 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q2 · 6:48",
        event: "Alabama — 31 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q2 · 1:12",
        event: "Georgia — 14 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q3 · 9:57",
        event: "Alabama — 19 Yd TD rush, extra point good.",
        side: "away",
      },
      {
        time: "Q3 · 3:22",
        event: "Georgia — 6 Yd TD pass, extra point good.",
        side: "home",
      },
    ],
    matchInfo: {
      referee: "J. Coleman",
      attendance: "101,821",
      weather: "79°F, Clear",
      surface: "Grass",
    },
  },
  {
    id: "af-103",
    league: "CFL",
    homeTeam: "Montreal Alouettes",
    awayTeam: "Toronto Argonauts",
    status: "Live",
    period: "3rd Quarter",
    clock: "10:48",
    kickoff: "7:30 PM",
    venue: "Percival Molson Memorial Stadium",
    score: "18 - 13",
    highlight: "A defensive touchdown has changed the rhythm of the game.",
    quarters: {
      home: [3, 8, 7, "-"],
      away: [0, 10, 3, "-"],
    },
    stats: [
      { label: "Total Yards", home: 244, away: 219 },
      { label: "Passing Yards", home: 168, away: 150 },
      { label: "Rushing Yards", home: 76, away: 69 },
      { label: "First Downs", home: 13, away: 12 },
      { label: "3rd Down Efficiency", home: "3/8", away: "4/10" },
      { label: "4th Down Efficiency", home: "0/1", away: "0/0" },
      { label: "Penalties", home: "5-42", away: "3-28" },
      { label: "Time of Possession", home: "17:30", away: "16:18" },
    ],
    timeline: [
      {
        time: "Q1 · 5:10",
        event: "Montreal — 41 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q2 · 10:03",
        event: "Montreal — Defensive TD, extra point good.",
        side: "home",
      },
      {
        time: "Q2 · 4:44",
        event: "Toronto — 38 Yd field goal good x2.",
        side: "away",
      },
      {
        time: "Q3 · 10:48",
        event: "Montreal — 9 Yd TD rush, extra point missed.",
        side: "home",
      },
    ],
    matchInfo: {
      referee: "D. Foster",
      attendance: "22,140",
      weather: "64°F, Light Rain",
      surface: "Turf",
    },
  },
  {
    id: "af-104",
    league: "UFL",
    homeTeam: "Birmingham Stallions",
    awayTeam: "DC Defenders",
    status: "Live",
    period: "4th Quarter",
    clock: "04:06",
    kickoff: "3:00 PM",
    venue: "Protective Stadium",
    score: "27 - 24",
    highlight: "The visitors are driving for a game-tying field goal.",
    quarters: {
      home: [7, 10, 7, 3],
      away: [3, 7, 7, 7],
    },
    stats: [
      { label: "Total Yards", home: 355, away: 341 },
      { label: "Passing Yards", home: 220, away: 238 },
      { label: "Rushing Yards", home: 135, away: 103 },
      { label: "First Downs", home: 20, away: 19 },
      { label: "3rd Down Efficiency", home: "6/13", away: "5/12" },
      { label: "4th Down Efficiency", home: "1/1", away: "1/2" },
      { label: "Penalties", home: "7-58", away: "4-33" },
      { label: "Time of Possession", home: "29:40", away: "30:20" },
    ],
    timeline: [
      {
        time: "Q1 · 11:02",
        event: "Birmingham — 6 Yd TD pass, extra point good.",
        side: "home",
      },
      { time: "Q1 · 3:40", event: "DC — 44 Yd field goal good.", side: "away" },
      {
        time: "Q2 · 9:15",
        event: "Birmingham — 27 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q2 · 2:08",
        event: "Birmingham — 15 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q2 · 0:22",
        event: "DC — 9 Yd TD rush, extra point good.",
        side: "away",
      },
      {
        time: "Q3 · 7:55",
        event: "Birmingham — 4 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q3 · 1:30",
        event: "DC — 33 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q4 · 12:10",
        event: "Birmingham — 30 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q4 · 4:06",
        event: "DC — 19 Yd TD pass, extra point good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "M. Osei",
      attendance: "18,760",
      weather: "84°F, Clear",
      surface: "Turf",
    },
  },
  {
    id: "af-105",
    league: "European League of Football",
    homeTeam: "Vienna Vikings",
    awayTeam: "Rhein Fire",
    status: "Live",
    period: "2nd Quarter",
    clock: "01:37",
    kickoff: "4:25 PM",
    venue: "Hohe Warte Stadium",
    score: "10 - 10",
    highlight: "An evenly matched first half in a major European rivalry.",
    quarters: {
      home: [3, 7, "-", "-"],
      away: [7, 3, "-", "-"],
    },
    stats: [
      { label: "Total Yards", home: 178, away: 182 },
      { label: "Passing Yards", home: 110, away: 121 },
      { label: "Rushing Yards", home: 68, away: 61 },
      { label: "First Downs", home: 9, away: 10 },
      { label: "3rd Down Efficiency", home: "2/6", away: "3/7" },
      { label: "4th Down Efficiency", home: "0/0", away: "0/1" },
      { label: "Penalties", home: "2-15", away: "3-20" },
      { label: "Time of Possession", home: "12:04", away: "12:56" },
    ],
    timeline: [
      {
        time: "Q1 · 10:05",
        event: "Rhein Fire — 21 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q1 · 3:50",
        event: "Vienna — 24 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q2 · 8:12",
        event: "Vienna — 7 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q2 · 1:37",
        event: "Rhein Fire — 36 Yd field goal good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "T. Lindqvist",
      attendance: "6,340",
      weather: "59°F, Overcast",
      surface: "Grass",
    },
  },
];

export const mockAmericanFootballUpcomingMatches: AmericanFootballMatch[] = [
  {
    id: "af-201",
    league: "NFL",
    homeTeam: "49ers",
    awayTeam: "Packers",
    status: "Scheduled",
    period: "Preview",
    clock: "--",
    kickoff: "1:00 PM",
    venue: "Levi's Stadium",
    score: "17 - 20",
    highlight: "A marquee matchup with playoff implications.",
    quarters: {
      home: [7, 3, 7, "-"],
      away: [3, 10, 7, "-"],
    },
    stats: [
      { label: "Total Yards", home: 312, away: 358 },
      { label: "Passing Yards", home: 210, away: 245 },
      { label: "Rushing Yards", home: 102, away: 113 },
      { label: "First Downs", home: 18, away: 21 },
      { label: "3rd Down Efficiency", home: "5/12", away: "7/13" },
      { label: "4th Down Efficiency", home: "1/1", away: "0/1" },
      { label: "Penalties", home: "6-45", away: "4-30" },
      { label: "Time of Possession", home: "28:14", away: "31:46" },
    ],
    timeline: [
      {
        time: "Q1 · 9:58",
        event: "49ers — 7 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q1 · 3:12",
        event: "Packers — 42 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q2 · 11:41",
        event: "Packers — 11 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q2 · 4:05",
        event: "49ers — 3 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q2 · 0:47",
        event: "Packers — 28 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q3 · 8:22",
        event: "49ers — 22 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q3 · 2:15",
        event: "Packers — 6 Yd TD rush, extra point good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "C. Reynolds",
      attendance: "68,412",
      weather: "72°F, Clear",
      surface: "Grass",
    },
  },
  {
    id: "af-202",
    league: "NFL",
    homeTeam: "Cowboys",
    awayTeam: "Eagles",
    status: "Scheduled",
    period: "Preview",
    clock: "--",
    kickoff: "4:25 PM",
    venue: "AT&T Stadium",
    score: "20 - 23",
    highlight: "A high-stakes divisional clash for the conference lead.",
    quarters: {
      home: [3, 7, 7, 3],
      away: [7, 3, 10, 3],
    },
    stats: [
      { label: "Total Yards", home: 298, away: 315 },
      { label: "Passing Yards", home: 205, away: 218 },
      { label: "Rushing Yards", home: 93, away: 97 },
      { label: "First Downs", home: 17, away: 18 },
      { label: "3rd Down Efficiency", home: "4/11", away: "5/12" },
      { label: "4th Down Efficiency", home: "0/1", away: "1/1" },
      { label: "Penalties", home: "5-38", away: "6-50" },
      { label: "Time of Possession", home: "27:02", away: "32:58" },
    ],
    timeline: [
      {
        time: "Q1 · 10:20",
        event: "Eagles — 9 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q1 · 2:44",
        event: "Cowboys — 31 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q2 · 12:00",
        event: "Eagles — 26 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q2 · 3:15",
        event: "Cowboys — 5 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q3 · 9:40",
        event: "Eagles — 14 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q3 · 4:10",
        event: "Cowboys — 18 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q3 · 0:55",
        event: "Eagles — 40 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q4 · 6:30",
        event: "Cowboys — 29 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q4 · 1:05",
        event: "Eagles — 33 Yd field goal good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "S. Whitfield",
      attendance: "92,318",
      weather: "70°F, Clear (Dome)",
      surface: "Turf",
    },
  },
  {
    id: "af-203",
    league: "NFL",
    homeTeam: "Ravens",
    awayTeam: "Bengals",
    status: "Scheduled",
    period: "Preview",
    clock: "--",
    kickoff: "8:20 PM",
    venue: "M&T Bank Stadium",
    score: "24 - 21",
    highlight: "A primetime divisional game between familiar contenders.",
    quarters: {
      home: [10, 0, 7, 7],
      away: [3, 7, 7, 4],
    },
    stats: [
      { label: "Total Yards", home: 330, away: 302 },
      { label: "Passing Yards", home: 215, away: 200 },
      { label: "Rushing Yards", home: 115, away: 102 },
      { label: "First Downs", home: 19, away: 17 },
      { label: "3rd Down Efficiency", home: "6/12", away: "4/11" },
      { label: "4th Down Efficiency", home: "1/1", away: "0/0" },
      { label: "Penalties", home: "4-30", away: "5-42" },
      { label: "Time of Possession", home: "30:12", away: "29:48" },
    ],
    timeline: [
      {
        time: "Q1 · 10:45",
        event: "Ravens — 24 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q1 · 4:02",
        event: "Ravens — 8 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q1 · 0:38",
        event: "Bengals — 39 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q2 · 6:20",
        event: "Bengals — 12 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q3 · 9:10",
        event: "Ravens — 16 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q3 · 2:55",
        event: "Bengals — 21 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q4 · 8:00",
        event: "Ravens — 3 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q4 · 1:20",
        event: "Bengals — 7 Yd TD pass, 2pt conversion good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "R. Villanueva",
      attendance: "70,745",
      weather: "66°F, Clear",
      surface: "Grass",
    },
  },
  {
    id: "af-204",
    league: "NCAA FBS",
    homeTeam: "Ohio State",
    awayTeam: "Oregon",
    status: "Scheduled",
    period: "Preview",
    clock: "--",
    kickoff: "12:00 PM",
    venue: "Ohio Stadium",
    score: "31 - 17",
    highlight: "Two playoff hopefuls open the day in Columbus.",
    quarters: {
      home: [7, 14, 3, 7],
      away: [3, 7, 0, 7],
    },
    stats: [
      { label: "Total Yards", home: 412, away: 336 },
      { label: "Passing Yards", home: 260, away: 210 },
      { label: "Rushing Yards", home: 152, away: 126 },
      { label: "First Downs", home: 23, away: 18 },
      { label: "3rd Down Efficiency", home: "7/12", away: "5/13" },
      { label: "4th Down Efficiency", home: "2/2", away: "0/1" },
      { label: "Penalties", home: "3-25", away: "6-55" },
      { label: "Time of Possession", home: "33:10", away: "26:50" },
    ],
    timeline: [
      {
        time: "Q1 · 9:30",
        event: "Ohio State — 11 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q1 · 2:15",
        event: "Oregon — 29 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q2 · 10:40",
        event: "Ohio State — 6 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q2 · 5:12",
        event: "Oregon — 19 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q2 · 0:50",
        event: "Ohio State — 24 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q3 · 6:00",
        event: "Ohio State — 33 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q4 · 7:45",
        event: "Ohio State — 8 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q4 · 2:10",
        event: "Oregon — 15 Yd TD pass, extra point good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "K. Marsh",
      attendance: "104,592",
      weather: "75°F, Clear",
      surface: "Grass",
    },
  },
  {
    id: "af-205",
    league: "NCAA FBS",
    homeTeam: "Texas",
    awayTeam: "LSU",
    status: "Scheduled",
    period: "Preview",
    clock: "--",
    kickoff: "7:30 PM",
    venue: "Darrell K Royal–Texas Memorial Stadium",
    score: "27 - 24",
    highlight: "A heavyweight non-conference matchup under the lights.",
    quarters: {
      home: [7, 3, 10, 7],
      away: [10, 7, 0, 7],
    },
    stats: [
      { label: "Total Yards", home: 368, away: 351 },
      { label: "Passing Yards", home: 230, away: 240 },
      { label: "Rushing Yards", home: 138, away: 111 },
      { label: "First Downs", home: 20, away: 19 },
      { label: "3rd Down Efficiency", home: "6/13", away: "5/12" },
      { label: "4th Down Efficiency", home: "1/2", away: "1/1" },
      { label: "Penalties", home: "5-40", away: "4-35" },
      { label: "Time of Possession", home: "29:30", away: "30:30" },
    ],
    timeline: [
      {
        time: "Q1 · 11:15",
        event: "LSU — 34 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q1 · 4:20",
        event: "LSU — 20 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q1 · 0:40",
        event: "Texas — 9 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q2 · 8:50",
        event: "LSU — 17 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q2 · 3:10",
        event: "Texas — 27 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q3 · 9:00",
        event: "Texas — 41 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q3 · 2:30",
        event: "Texas — 12 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q4 · 6:15",
        event: "Texas — 5 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q4 · 1:00",
        event: "LSU — 22 Yd TD pass, extra point good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "A. Duplantis",
      attendance: "100,119",
      weather: "81°F, Humid",
      surface: "Grass",
    },
  },
  {
    id: "af-206",
    league: "CFL",
    homeTeam: "Winnipeg Blue Bombers",
    awayTeam: "BC Lions",
    status: "Scheduled",
    period: "Preview",
    clock: "--",
    kickoff: "8:00 PM",
    venue: "Princess Auto Stadium",
    score: "22 - 19",
    highlight: "Two West Division rivals meet in a key early-season game.",
    quarters: {
      home: [3, 10, 6, 3],
      away: [7, 3, 6, 3],
    },
    stats: [
      { label: "Total Yards", home: 275, away: 260 },
      { label: "Passing Yards", home: 185, away: 172 },
      { label: "Rushing Yards", home: 90, away: 88 },
      { label: "First Downs", home: 15, away: 14 },
      { label: "3rd Down Efficiency", home: "4/9", away: "3/10" },
      { label: "4th Down Efficiency", home: "0/0", away: "1/1" },
      { label: "Penalties", home: "3-24", away: "4-32" },
      { label: "Time of Possession", home: "16:40", away: "16:20" },
    ],
    timeline: [
      {
        time: "Q1 · 8:30",
        event: "BC Lions — 8 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q2 · 10:12",
        event: "Winnipeg — 26 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q2 · 5:44",
        event: "Winnipeg — 14 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q2 · 1:20",
        event: "BC Lions — 30 Yd field goal good.",
        side: "away",
      },
      { time: "Q3 · 9:05", event: "Winnipeg — Safety.", side: "home" },
      {
        time: "Q3 · 4:50",
        event: "BC Lions — 19 Yd TD rush, extra point missed.",
        side: "away",
      },
      {
        time: "Q3 · 0:30",
        event: "Winnipeg — 22 Yd field goal good x2.",
        side: "home",
      },
      {
        time: "Q4 · 5:15",
        event: "Winnipeg — 35 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q4 · 1:40",
        event: "BC Lions — 28 Yd field goal good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "P. Nowak",
      attendance: "24,980",
      weather: "61°F, Windy",
      surface: "Turf",
    },
  },
  {
    id: "af-207",
    league: "UFL",
    homeTeam: "St. Louis Battlehawks",
    awayTeam: "San Antonio Brahmas",
    status: "Scheduled",
    period: "Preview",
    clock: "--",
    kickoff: "4:00 PM",
    venue: "The Dome at America's Center",
    score: "17 - 13",
    highlight: "A matchup of two spring-football playoff contenders.",
    quarters: {
      home: [7, 3, 0, 7],
      away: [3, 3, 7, 0],
    },
    stats: [
      { label: "Total Yards", home: 265, away: 231 },
      { label: "Passing Yards", home: 170, away: 150 },
      { label: "Rushing Yards", home: 95, away: 81 },
      { label: "First Downs", home: 14, away: 12 },
      { label: "3rd Down Efficiency", home: "3/9", away: "4/11" },
      { label: "4th Down Efficiency", home: "1/1", away: "0/1" },
      { label: "Penalties", home: "4-33", away: "3-22" },
      { label: "Time of Possession", home: "15:50", away: "15:10" },
    ],
    timeline: [
      {
        time: "Q1 · 9:40",
        event: "St. Louis — 4 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q1 · 2:20",
        event: "San Antonio — 33 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q2 · 11:10",
        event: "St. Louis — 29 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q2 · 3:00",
        event: "San Antonio — 25 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q3 · 7:30",
        event: "San Antonio — 11 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q4 · 6:45",
        event: "St. Louis — 18 Yd TD pass, extra point good.",
        side: "home",
      },
    ],
    matchInfo: {
      referee: "L. Ferreira",
      attendance: "27,455",
      weather: "73°F, Clear (Dome)",
      surface: "Turf",
    },
  },
  {
    id: "af-208",
    league: "European League of Football",
    homeTeam: "Paris Musketeers",
    awayTeam: "Stuttgart Surge",
    status: "Scheduled",
    period: "Preview",
    clock: "--",
    kickoff: "2:00 PM",
    venue: "Stade Jean-Bouin",
    score: "20 - 20",
    highlight: "A cross-border showdown between two rising ELF clubs.",
    quarters: {
      home: [7, 3, 7, 3],
      away: [3, 7, 3, 7],
    },
    stats: [
      { label: "Total Yards", home: 240, away: 245 },
      { label: "Passing Yards", home: 150, away: 160 },
      { label: "Rushing Yards", home: 90, away: 85 },
      { label: "First Downs", home: 13, away: 13 },
      { label: "3rd Down Efficiency", home: "3/8", away: "4/9" },
      { label: "4th Down Efficiency", home: "0/1", away: "0/0" },
      { label: "Penalties", home: "2-18", away: "3-24" },
      { label: "Time of Possession", home: "14:20", away: "14:40" },
    ],
    timeline: [
      {
        time: "Q1 · 10:15",
        event: "Paris — 9 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q1 · 3:30",
        event: "Stuttgart — 27 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q2 · 9:00",
        event: "Stuttgart — 13 Yd TD rush, extra point good.",
        side: "away",
      },
      {
        time: "Q2 · 2:45",
        event: "Paris — 31 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q3 · 8:10",
        event: "Paris — 16 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q3 · 1:55",
        event: "Stuttgart — 24 Yd field goal good.",
        side: "away",
      },
      {
        time: "Q4 · 5:40",
        event: "Paris — 22 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q4 · 0:50",
        event: "Stuttgart — 7 Yd TD pass, extra point good.",
        side: "away",
      },
    ],
    matchInfo: {
      referee: "H. Novak",
      attendance: "8,120",
      weather: "63°F, Overcast",
      surface: "Grass",
    },
  },
  {
    id: "af-209",
    league: "LFA",
    homeTeam: "Dinos de Saltillo",
    awayTeam: "Caudillos de Chihuahua",
    status: "Scheduled",
    period: "Preview",
    clock: "--",
    kickoff: "6:00 PM",
    venue: "Estadio Olímpico Francisco I. Madero",
    score: "24 - 14",
    highlight: "A marquee Mexican league matchup with a fast-paced attack.",
    quarters: {
      home: [7, 7, 3, 7],
      away: [0, 7, 7, 0],
    },
    stats: [
      { label: "Total Yards", home: 310, away: 254 },
      { label: "Passing Yards", home: 195, away: 160 },
      { label: "Rushing Yards", home: 115, away: 94 },
      { label: "First Downs", home: 17, away: 13 },
      { label: "3rd Down Efficiency", home: "5/10", away: "3/9" },
      { label: "4th Down Efficiency", home: "1/1", away: "0/1" },
      { label: "Penalties", home: "3-22", away: "5-45" },
      { label: "Time of Possession", home: "31:00", away: "29:00" },
    ],
    timeline: [
      {
        time: "Q1 · 9:00",
        event: "Saltillo — 6 Yd TD rush, extra point good.",
        side: "home",
      },
      {
        time: "Q2 · 10:30",
        event: "Chihuahua — 14 Yd TD pass, extra point good.",
        side: "away",
      },
      {
        time: "Q2 · 4:15",
        event: "Saltillo — 20 Yd TD pass, extra point good.",
        side: "home",
      },
      {
        time: "Q3 · 8:20",
        event: "Chihuahua — 9 Yd TD rush, extra point good.",
        side: "away",
      },
      {
        time: "Q3 · 2:10",
        event: "Saltillo — 28 Yd field goal good.",
        side: "home",
      },
      {
        time: "Q4 · 6:00",
        event: "Saltillo — 11 Yd TD pass, extra point good.",
        side: "home",
      },
    ],
    matchInfo: {
      referee: "E. Villareal",
      attendance: "14,300",
      weather: "77°F, Clear",
      surface: "Grass",
    },
  },
];

export const mockAmericanFootballPopularLeagues: AmericanFootballLeague[] = [
  {
    id: "nfl",
    name: "NFL",
    region: "United States",
    season: "2026 Preseason",
    teams: "32 teams",
    tier: "Premier",
    description:
      "The top professional league with the biggest weekly audience.",
  },
  {
    id: "div3",
    name: "AmFtbl DIV3",
    region: "United States",
    season: "2025",
    teams: "",
    tier: "College",
    description: "NCAA Division II/III American football.",
  },
  {
    id: "ncaa-fbs",
    name: "NCAA FBS",
    region: "United States",
    season: "2026 Season",
    teams: "134 programs",
    tier: "College",
    description: "Power-conference football with huge Saturday rivalries.",
  },
  {
    id: "cfl",
    name: "CFL",
    region: "Canada",
    season: "2026 Season",
    teams: "9 teams",
    tier: "Pro",
    description:
      "A fast-paced professional league with a unique Canadian rule set.",
  },
  {
    id: "ufl",
    name: "UFL",
    region: "United States",
    season: "2026 Spring",
    teams: "8 teams",
    tier: "Spring Pro",
    description:
      "A developing spring league built for year-round football coverage.",
  },
  {
    id: "elf",
    name: "European League of Football",
    region: "Europe",
    season: "2026 Season",
    teams: "16 teams",
    tier: "International",
    description: "Europe's leading professional American football competition.",
  },
  {
    id: "lfa",
    name: "LFA",
    region: "Mexico",
    season: "2026 Season",
    teams: "10 teams",
    tier: "International",
    description: "Mexico's top domestic American football league.",
  },
];

export const mockAmericanFootballAllLeagues: AmericanFootballLeague[] = [
  ...mockAmericanFootballPopularLeagues,
  {
    id: "ncaa-fcs",
    name: "NCAA FCS",
    region: "United States",
    season: "2026 Season",
    teams: "128 programs",
    tier: "College",
    description:
      "A deep college football landscape with playoff drama every fall.",
  },
  {
    id: "ifl",
    name: "Indoor Football League",
    region: "United States",
    season: "2026 Season",
    teams: "16 teams",
    tier: "Indoor",
    description: "Indoor football with higher scoring and a compact game flow.",
  },
  {
    id: "af1",
    name: "Arena Football One",
    region: "United States",
    season: "2026 Season",
    teams: "8 teams",
    tier: "Arena",
    description:
      "A revival format built for quick, high-scoring arena football.",
  },
  {
    id: "cif",
    name: "Champion Indoor Football",
    region: "United States",
    season: "2026 Season",
    teams: "12 teams",
    tier: "Indoor",
    description:
      "Indoor football focused on regional competition and fast tempo.",
  },
  {
    id: "gfl",
    name: "German Football League",
    region: "Europe",
    season: "2026 Season",
    teams: "16 teams",
    tier: "National",
    description: "Germany's top-tier national American football competition.",
  },
  {
    id: "austrian-afl",
    name: "Austrian Football League",
    region: "Europe",
    season: "2026 Season",
    teams: "10 teams",
    tier: "National",
    description: "Austria's long-running premier domestic league.",
  },
  {
    id: "x-league",
    name: "XLeague",
    region: "Japan",
    season: "2026 Season",
    teams: "12 teams",
    tier: "National",
    description: "Japan's elite corporate-club American football league.",
  },
  {
    id: "vaahteraliiga",
    name: "Vaahteraliiga",
    region: "Finland",
    season: "2026 Season",
    teams: "8 teams",
    tier: "National",
    description: "Finland's top American football competition.",
  },
  {
    id: "italian-football-league",
    name: "Italian Football League",
    region: "Italy",
    season: "2026 Season",
    teams: "12 teams",
    tier: "National",
    description: "Italy's premier competition for American football clubs.",
  },
  {
    id: "bfa",
    name: "BFA",
    region: "Brazil",
    season: "2026 Season",
    teams: "32 teams",
    tier: "National",
    description: "Brazil's nationwide American football championship.",
  },
];

export const mockAmericanFootballLatestNews: AmericanFootballNewsItem[] = [
  {
    id: "news-101",
    title: "Quarterback battles are defining the early NFL preseason storyline",
    summary:
      "Several teams are still sorting out the depth chart, and the competition at quarterback is shaping the first round of preseason projections.",
    timeAgo: "12 min ago",
    readTime: "3 min read",
    tag: "NFL",
  },
  {
    id: "news-102",
    title:
      "College football ranking previews are already shifting after fall camp reports",
    summary:
      "High-end programs are getting a fresh look as practice reports, returning starters, and transfer moves begin to reshape expectations.",
    timeAgo: "38 min ago",
    readTime: "4 min read",
    tag: "NCAA",
  },
  {
    id: "news-103",
    title:
      "Spring football leagues are leaning into local rivalries to grow their audience",
    summary:
      "The UFL and other spring properties are using regional matchups and more accessible kickoff windows to build momentum.",
    timeAgo: "1 hr ago",
    readTime: "2 min read",
    tag: "Spring",
  },
  {
    id: "news-104",
    title: "Canada's CFL race tightens as teams separate early on defense",
    summary:
      "Defensive efficiency is becoming the separator in the first month, with a handful of clubs trending upward.",
    timeAgo: "2 hrs ago",
    readTime: "3 min read",
    tag: "CFL",
  },
];
