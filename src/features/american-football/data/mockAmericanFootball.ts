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
    score: "- - -",
    highlight: "A marquee matchup with playoff implications.",
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
    score: "- - -",
    highlight: "A high-stakes divisional clash for the conference lead.",
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
    score: "- -",
    highlight: "A primetime divisional game between familiar contenders.",
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
    score: "- -",
    highlight: "Two playoff hopefuls open the day in Columbus.",
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
    score: "- -",
    highlight: "A heavyweight non-conference matchup under the lights.",
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
    score: "- -",
    highlight: "Two West Division rivals meet in a key early-season game.",
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
    score: "- -",
    highlight: "A matchup of two spring-football playoff contenders.",
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
    score: "- -",
    highlight: "A cross-border showdown between two rising ELF clubs.",
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
    score: "- -",
    highlight: "A marquee Mexican league matchup with a fast-paced attack.",
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
