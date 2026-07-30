export interface CricketMatchDetailResponse {
  success: boolean;
  message: string;
  responseObject: {
    items: null | any;
    item: {
      fixture: Fixture;
      live: LiveData;
    };
  };
  statusCode: number;
}

export interface Fixture {
  match_id: string;
  series_id: string;
  status: string;
  match_format: string;
  match_date: string;
  match_time: string;
  venue: string;
  localteam: TeamShortInfo;
  visitorteam: TeamShortInfo;
  result: string | null;
  raw: {
    comment: {
      post: string;
    };
    lineups: {
      localteam: any;
      visitorteam: any;
    };
    matchinfo?: {
      info: any[];
    };
  };
  comment: {
    post: string;
  };
  series_image_url: string;
  toss_winner_team_id?: string;
  man_of_match?: {
    name: string;
    image_url?: string | null;
  };
}

export interface TeamShortInfo {
  id: string;
  name: string;
  winner: string;
  image_url: string;
  totalscore: string;
}

export interface LiveData {
  innings: Inning[];
  commentaries: Commentary[];
  wickets: Wicket[];
  lineups: {
    localteam: { player: Player[] };
    visitorteam: { player: Player[] };
  };
}

export interface Inning {
  name: string;
  team: string; // 'localteam' | 'visitorteam'
  total: {
    tot: string; // e.g. "176 ( 18 )"
    wickets: string;
    rr: string;
  };
  bowlers: {
    player: BowlerStat[];
  };
  inningnum: string;
  batsmanstats: {
    player: BatsmanStat[];
  };
  partnerships?: any[];
}

export interface BowlerStat {
  bowler: string;
  o: string; // overs
  m: string; // maidens
  r: string; // runs
  w: string; // wickets
  er: string; // econ rate
}

export interface BatsmanStat {
  batsman: string;
  r: string; // runs
  b: string; // balls
  s4: string; // fours
  s6: string; // sixes
  sr: string; // strike rate
  status: string; // dismissal status
}

export interface Commentary {
  over: string;
  runs: string;
  post: string;
}

export interface Wicket {
  runs: string;
  wickets: string;
  player: string;
  overs: string;
  inning: string;
}

export interface Player {
  name: string;
  image_url: string | null;
  profileid?: string;
  jerseyNo?: string;
  role?: string;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
  isImpactPlayer?: boolean;
}
