export type CricketFormat = "T20" | "ODI" | "Test" | "The Hundred";

export type CricketTeam = {
  name: string;
  short: string;
  score: string;
  wickets?: string;
  overs?: string;
};

export type CricketMatchStatus = "Live" | "Scheduled" | "Finished";

export type CricketMatch = {
  id: string;
  leagueId: number;
  league: string;
  format: CricketFormat;
  status: CricketMatchStatus;
  startTime: string;
  venue: string;
  over: string;
  result: string;
  highlight: string;
  homeTeam: CricketTeam;
  awayTeam: CricketTeam;
};

export type CricketLeague = {
  id: number;
  name: string;
  region: string;
  season: string;
  teams: string;
  format: CricketFormat;
  description: string;
  accent: string;
};

export type CricketStanding = {
  position: number;
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  nrr: string;
  form: string;
};

export const mockCricketLeagues: CricketLeague[] = [
  {
    id: 501,
    name: "Indian Premier League",
    region: "India",
    season: "2026",
    teams: "10 teams",
    format: "T20",
    description:
      "Prime-time T20 cricket with packed stadiums, powerplay drama, and elite overseas talent.",
    accent: "#f59e0b",
  },
  {
    id: 502,
    name: "Big Bash League",
    region: "Australia",
    season: "2025/26",
    teams: "8 teams",
    format: "T20",
    description:
      "Fast-moving summer cricket with high-scoring chases and aggressive white-ball strategies.",
    accent: "#1d4ed8",
  },
  {
    id: 503,
    name: "The Hundred",
    region: "England",
    season: "2026",
    teams: "8 teams",
    format: "The Hundred",
    description:
      "A condensed, spectacle-driven format that keeps batting pace and tactical fielding front and centre.",
    accent: "#7c3aed",
  },
  {
    id: 504,
    name: "SA20",
    region: "South Africa",
    season: "2025/26",
    teams: "6 teams",
    format: "T20",
    description:
      "South Africa's marquee franchise competition with explosive batting and sharp seam attacks.",
    accent: "#0f766e",
  },
  {
    id: 505,
    name: "Caribbean Premier League",
    region: "Caribbean",
    season: "2026",
    teams: "6 teams",
    format: "T20",
    description:
      "Colourful night cricket powered by spin-friendly pitches and crowd-pleasing finishes.",
    accent: "#e11d48",
  },
  {
    id: 506,
    name: "ICC World Cup",
    region: "International",
    season: "2027",
    teams: "10 teams",
    format: "ODI",
    description:
      "The global one-day showpiece bringing together the best national sides on one stage.",
    accent: "#0284c7",
  },
];

export const mockCricketMatches: CricketMatch[] = [
  {
    id: "cr-1001",
    leagueId: 501,
    league: "Indian Premier League",
    format: "T20",
    status: "Live",
    startTime: "19:30",
    venue: "Wankhede Stadium",
    over: "19.2 overs",
    result: "Mumbai Indians need 13 off 4 balls",
    highlight: "A late boundary swung the chase back into contention.",
    homeTeam: {
      name: "Mumbai Indians",
      short: "MI",
      score: "184/5",
      wickets: "5 wickets",
      overs: "20.0",
    },
    awayTeam: {
      name: "Chennai Super Kings",
      short: "CSK",
      score: "172/8",
      wickets: "8 wickets",
      overs: "20.0",
    },
  },
  {
    id: "cr-1002",
    leagueId: 502,
    league: "Big Bash League",
    format: "T20",
    status: "Live",
    startTime: "18:15",
    venue: "SCG, Sydney",
    over: "15.4 overs",
    result: "Thunder 14 runs ahead on DLS",
    highlight: "A breakout opener set the tone with a blistering powerplay.",
    homeTeam: {
      name: "Sydney Sixers",
      short: "SS",
      score: "141/3",
      wickets: "3 wickets",
      overs: "15.4",
    },
    awayTeam: {
      name: "Sydney Thunder",
      short: "ST",
      score: "129/6",
      wickets: "6 wickets",
      overs: "20.0",
    },
  },
  {
    id: "cr-1003",
    leagueId: 503,
    league: "The Hundred",
    format: "The Hundred",
    status: "Live",
    startTime: "20:00",
    venue: "Lord's, London",
    over: "79 balls",
    result: "Invincibles are pushing for a late surge",
    highlight: "Strike rotation has been the difference in a tight chase.",
    homeTeam: {
      name: "Oval Invincibles",
      short: "OVI",
      score: "112/4",
      wickets: "4 wickets",
      overs: "79",
    },
    awayTeam: {
      name: "Southern Brave",
      short: "SOB",
      score: "108/7",
      wickets: "7 wickets",
      overs: "100",
    },
  },
  {
    id: "cr-2001",
    leagueId: 506,
    league: "ICC World Cup",
    format: "ODI",
    status: "Scheduled",
    startTime: "14:00",
    venue: "Narendra Modi Stadium",
    over: "50 overs",
    result: "Starts in 2 hours",
    highlight: "A heavyweight ODI meeting with tournament implications.",
    homeTeam: {
      name: "India",
      short: "IND",
      score: "-",
      wickets: "-",
      overs: "-",
    },
    awayTeam: {
      name: "Australia",
      short: "AUS",
      score: "-",
      wickets: "-",
      overs: "-",
    },
  },
  {
    id: "cr-2002",
    leagueId: 504,
    league: "SA20",
    format: "T20",
    status: "Scheduled",
    startTime: "18:30",
    venue: "Newlands, Cape Town",
    over: "20 overs",
    result: "Pre-match build-up is underway",
    highlight: "A compact ground and a spicy pitch make this one worth watching.",
    homeTeam: {
      name: "Cape Town Spurs",
      short: "CTS",
      score: "-",
      wickets: "-",
      overs: "-",
    },
    awayTeam: {
      name: "Joburg Super Kings",
      short: "JSK",
      score: "-",
      wickets: "-",
      overs: "-",
    },
  },
  {
    id: "cr-2003",
    leagueId: 505,
    league: "Caribbean Premier League",
    format: "T20",
    status: "Scheduled",
    startTime: "20:00",
    venue: "Queen's Park Oval",
    over: "20 overs",
    result: "First ball at sunset",
    highlight: "Expect spin, bounce, and a crowd leaning into every boundary.",
    homeTeam: {
      name: "Trinbago Knight Riders",
      short: "TKR",
      score: "-",
      wickets: "-",
      overs: "-",
    },
    awayTeam: {
      name: "Barbados Royals",
      short: "BR",
      score: "-",
      wickets: "-",
      overs: "-",
    },
  },
  {
    id: "cr-3001",
    leagueId: 501,
    league: "Indian Premier League",
    format: "T20",
    status: "Finished",
    startTime: "15:30",
    venue: "M. Chinnaswamy Stadium",
    over: "20 overs",
    result: "Royal Challengers Bengaluru won by 18 runs",
    highlight: "Two late wickets sealed a dramatic home victory.",
    homeTeam: {
      name: "Royal Challengers Bengaluru",
      short: "RCB",
      score: "201/6",
      wickets: "6 wickets",
      overs: "20.0",
    },
    awayTeam: {
      name: "Kolkata Knight Riders",
      short: "KKR",
      score: "183/9",
      wickets: "9 wickets",
      overs: "20.0",
    },
  },
  {
    id: "cr-3002",
    leagueId: 502,
    league: "Big Bash League",
    format: "T20",
    status: "Finished",
    startTime: "13:45",
    venue: "Optus Stadium",
    over: "20 overs",
    result: "Perth Scorchers chased it down with 2 balls to spare",
    highlight: "A controlled chase finished with a clipped single through mid-wicket.",
    homeTeam: {
      name: "Perth Scorchers",
      short: "PS",
      score: "167/4",
      wickets: "4 wickets",
      overs: "19.4",
    },
    awayTeam: {
      name: "Melbourne Renegades",
      short: "MR",
      score: "166/7",
      wickets: "7 wickets",
      overs: "20.0",
    },
  },
];

export const mockCricketStandings: Record<number, CricketStanding[]> = {
  501: [
    { position: 1, team: "Mumbai Indians", played: 11, won: 8, lost: 3, points: 16, nrr: "+1.184", form: "WWLWW" },
    { position: 2, team: "Chennai Super Kings", played: 11, won: 7, lost: 4, points: 14, nrr: "+0.918", form: "WLWWW" },
    { position: 3, team: "Royal Challengers Bengaluru", played: 11, won: 6, lost: 5, points: 12, nrr: "+0.341", form: "LWWLW" },
    { position: 4, team: "Kolkata Knight Riders", played: 11, won: 5, lost: 6, points: 10, nrr: "-0.102", form: "WWLLL" },
  ],
  502: [
    { position: 1, team: "Sydney Sixers", played: 10, won: 7, lost: 3, points: 14, nrr: "+1.027", form: "WWWLW" },
    { position: 2, team: "Perth Scorchers", played: 10, won: 6, lost: 4, points: 12, nrr: "+0.610", form: "WLWWW" },
    { position: 3, team: "Sydney Thunder", played: 10, won: 5, lost: 5, points: 10, nrr: "+0.118", form: "LLWWW" },
    { position: 4, team: "Melbourne Renegades", played: 10, won: 4, lost: 6, points: 8, nrr: "-0.288", form: "LWLWL" },
  ],
  503: [
    { position: 1, team: "Oval Invincibles", played: 8, won: 6, lost: 2, points: 12, nrr: "+0.784", form: "WWWLW" },
    { position: 2, team: "Southern Brave", played: 8, won: 5, lost: 3, points: 10, nrr: "+0.421", form: "WLWWW" },
    { position: 3, team: "Trent Rockets", played: 8, won: 4, lost: 4, points: 8, nrr: "+0.102", form: "LLWWW" },
    { position: 4, team: "London Spirit", played: 8, won: 3, lost: 5, points: 6, nrr: "-0.355", form: "LWLLW" },
  ],
  504: [
    { position: 1, team: "Joburg Super Kings", played: 9, won: 6, lost: 3, points: 12, nrr: "+0.673", form: "WWWLL" },
    { position: 2, team: "Cape Town Spurs", played: 9, won: 5, lost: 4, points: 10, nrr: "+0.301", form: "WLWWL" },
    { position: 3, team: "Paarl Royals", played: 9, won: 4, lost: 5, points: 8, nrr: "-0.184", form: "LLWLW" },
    { position: 4, team: "Durban Super Giants", played: 9, won: 3, lost: 6, points: 6, nrr: "-0.512", form: "LWLWL" },
  ],
  505: [
    { position: 1, team: "Trinbago Knight Riders", played: 8, won: 6, lost: 2, points: 12, nrr: "+0.934", form: "WWLWW" },
    { position: 2, team: "Barbados Royals", played: 8, won: 5, lost: 3, points: 10, nrr: "+0.524", form: "WLWWW" },
    { position: 3, team: "St Kitts and Nevis Patriots", played: 8, won: 4, lost: 4, points: 8, nrr: "-0.021", form: "LLWWW" },
    { position: 4, team: "Guyana Amazon Warriors", played: 8, won: 3, lost: 5, points: 6, nrr: "-0.401", form: "LWWLL" },
  ],
  506: [
    { position: 1, team: "India", played: 7, won: 6, lost: 1, points: 12, nrr: "+1.234", form: "WWWLW" },
    { position: 2, team: "Australia", played: 7, won: 5, lost: 2, points: 10, nrr: "+0.712", form: "WLWWW" },
    { position: 3, team: "England", played: 7, won: 4, lost: 3, points: 8, nrr: "+0.206", form: "LLWWW" },
    { position: 4, team: "Pakistan", played: 7, won: 3, lost: 4, points: 6, nrr: "-0.255", form: "LWWLL" },
  ],
};

export const cricketSummaryCards = [
  {
    label: "Live Matches",
    value: "3",
    detail: "Active across T20 and The Hundred",
  },
  {
    label: "50+ Scores",
    value: "8",
    detail: "Batting units in top form",
  },
  {
    label: "Wickets Today",
    value: "31",
    detail: "Bowling attacks making an impact",
  },
  {
    label: "Featured Leagues",
    value: "6",
    detail: "Domestic and international competitions",
  },
];

export const getCricketMatchesForDate = (date: Date) => {
  const today = new Date();
  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = Math.round((selected.getTime() - today.getTime()) / 86400000);
  if (diff <= 0) {
    return mockCricketMatches;
  }

  if (diff === 1) {
    return mockCricketMatches.filter((match) => match.status !== "Finished");
  }

  return mockCricketMatches.filter((match) => match.status === "Scheduled");
};
