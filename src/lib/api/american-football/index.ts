import apiClient from "../axios";
import type {
  AmericanFootballLeague,
  AmericanFootballMatch,
  AmericanFootballStat,
  AmericanFootballTimelineEvent,
} from "@/features/american-football/data/mockAmericanFootball";
import type {
  AmericanFootballStandingsGroup,
  AmericanFootballStandingsTeam,
} from "@/features/american-football/data/mockAmericanFootballStandings";

export const isAmericanFootballApiEnabled =
  import.meta.env.VITE_ENABLE_AMERICAN_FOOTBALL_API === "true";

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const value = (...values: unknown[]) =>
  values.find((item) => item !== undefined && item !== null && item !== "");

const stringValue = (...values: unknown[]) =>
  String(value(...values) ?? "").trim();

const numValue = (...values: unknown[]): number => {
  const n = Number(value(...values));
  return Number.isFinite(n) ? n : 0;
};

const unwrap = (payload: unknown): unknown => {
  const root = asRecord(payload);
  if ("responseObject" in root) return root.responseObject;
  return payload;
};

const getItems = (payload: unknown): unknown[] => {
  const body = unwrap(payload);
  if (Array.isArray(body)) return body;
  const root = asRecord(body);
  return asArray(
    value(root.items, root.matches, root.fixtures, root.match, root.data),
  );
};

export const normalizeAmericanFootballLeagues = (
  payload: unknown,
): AmericanFootballLeague[] =>
  getItems(payload)
    .map((raw) => {
      const item = asRecord(raw);
      return {
        id: stringValue(item.code, item.league_id, item.name),
        name: stringValue(item.name),
        region: stringValue(item.country, "USA"),
        season: stringValue(item.season, "Current season"),
        teams: stringValue(item.teams, ""),
        tier: stringValue(item.code, "League"),
        description: stringValue(item.description, ""),
      };
    })
    .filter((league) => league.id && league.name);

export const getAmericanFootballLeagues = async () => {
  const response = await apiClient.get("/api/v1/american-football/leagues/all");
  return response.data;
};

export const getAmericanFootballLeagueByCode = async (leagueCode: string) => {
  const response = await apiClient.get(
    `/api/v1/american-football/leagues/${encodeURIComponent(leagueCode)}`,
  );
  return response.data;
};

const normalizeStandingsTeam = (
  raw: unknown,
): AmericanFootballStandingsTeam => {
  const t = asRecord(raw);
  return {
    id: stringValue(t.id, t.name),
    position: numValue(t.position),
    name: stringValue(t.name),
    won: numValue(t.won, t.overall_won),
    lost: numValue(t.lost, t.overall_lost),
    ties: numValue(t.ties),
    winPct: stringValue(t.win_percentage, ""),
    pointsFor: numValue(t.points_for, t.overall_points_for),
    pointsAgainst: numValue(t.points_against, t.overall_points_against),
    streak: stringValue(t.streak, "-"),
  };
};

const normalizeDivisionEntries = (
  divisionRaw: unknown,
  conferenceName: string,
): AmericanFootballStandingsGroup[] => {
  const divisions = Array.isArray(divisionRaw) ? divisionRaw : [divisionRaw];
  return divisions
    .map((divRaw) => {
      const div = asRecord(divRaw);
      const teams = asArray(div.team).map(normalizeStandingsTeam);
      const divisionName = stringValue(div.name);
      return {
        conference: conferenceName || undefined,
        division:
          divisionName && divisionName !== "Main" ? divisionName : undefined,
        teams,
      };
    })
    .filter((group) => group.teams.length > 0);
};

export const normalizeAmericanFootballStandings = (
  leagueEntry: unknown,
): AmericanFootballStandingsGroup[] => {
  const entry = asRecord(leagueEntry);
  const standings = asRecord(entry.standings);
  const category = asRecord(standings.category);
  const leagueBlocks = asArray(category.league);

  const groups: AmericanFootballStandingsGroup[] = [];
  for (const raw of leagueBlocks) {
    const block = asRecord(raw);
    if (block.division === undefined) continue;
    groups.push(
      ...normalizeDivisionEntries(block.division, stringValue(block.name)),
    );
  }
  return groups;
};

export const AF_LEAGUE_CODE_TO_MOCK_ID: Record<string, string> = {
  NFL: "nfl",
  FBS: "ncaa-fbs",
  FCS: "ncaa-fcs",
  DIV3: "div3",
};

export const getAmericanFootballAllStandings = async () => {
  const response = await apiClient.get(
    "/api/v1/american-football/standings/all",
  );
  return response.data;
};

export const getAmericanFootballStandingsByCode = async (
  leagueCode: string,
) => {
  const response = await apiClient.get(
    `/api/v1/american-football/standings/${encodeURIComponent(leagueCode)}`,
  );
  return response.data;
};

export const getAllStandingsAsMockShape = async (): Promise<
  Record<string, AmericanFootballStandingsGroup[]>
> => {
  const raw = await getAmericanFootballAllStandings();
  const entries = getItems(raw);
  const result: Record<string, AmericanFootballStandingsGroup[]> = {};
  for (const entry of entries) {
    const record = asRecord(entry);
    const code = stringValue(record.code);
    const mockId = AF_LEAGUE_CODE_TO_MOCK_ID[code] ?? code.toLowerCase();
    result[mockId] = normalizeAmericanFootballStandings(entry);
  }
  return result;
};

const teamName = (team: unknown) => {
  const record = asRecord(team);
  return stringValue(record.name, record.team_name, record.display_name, team);
};

const teamScore = (team: unknown) => {
  const record = asRecord(team);
  return stringValue(record.score, record.goals, record.total, record.points);
};

export const normalizeAmericanFootballMatch = (
  raw: unknown,
): AmericanFootballMatch => {
  const item = asRecord(raw);
  const home = value(item.homeTeam, item.home_team, item.home);
  const away = value(item.awayTeam, item.away_team, item.away);
  const homeScore = stringValue(
    item.home_score,
    item.homeScore,
    teamScore(home),
  );
  const awayScore = stringValue(
    item.away_score,
    item.awayScore,
    teamScore(away),
  );
  const status = stringValue(item.status, item.state, "Scheduled");

  return {
    id: stringValue(
      item.id,
      item.contest_id,
      item.contestId,
      `af-${crypto.randomUUID?.() ?? Date.now()}`,
    ),
    league: stringValue(
      item.league_name,
      item.league,
      item.tournament,
      "American Football",
    ),
    homeTeam: teamName(home) || "Home Team",
    awayTeam: teamName(away) || "Away Team",
    status,
    period: stringValue(item.period, item.quarter, status),
    clock: stringValue(item.clock, item.timer, "--"),
    kickoff: stringValue(item.kickoff, item.time, item.start_time, "TBD"),
    venue: stringValue(item.venue, item.stadium, "Venue TBC"),
    score: `${homeScore || "-"} - ${awayScore || "-"}`,
    highlight: stringValue(
      item.highlight,
      item.summary,
      "Match information will be available soon.",
    ),
  };
};

export const normalizeAmericanFootballMatches = (payload: unknown) =>
  getItems(payload).map(normalizeAmericanFootballMatch);

export const normalizeAmericanFootballMatchDetail = (
  payload: unknown,
): AmericanFootballMatch => {
  const detail = unwrap(payload);
  return {
    ...normalizeAmericanFootballMatch(detail),
    stats: normalizeAmericanFootballStats(detail),
    timeline: normalizeAmericanFootballTimeline(detail),
  };
};

export const normalizeAmericanFootballStats = (
  payload: unknown,
): AmericanFootballStat[] => {
  const root = asRecord(payload);
  const stats = asArray(root.stats);
  return stats
    .map((raw) => {
      const item = asRecord(raw);
      return {
        label: stringValue(item.label, item.name, "Statistic"),
        home: stringValue(item.home, item.home_value, "-"),
        away: stringValue(item.away, item.away_value, "-"),
      };
    })
    .filter((item) => item.label !== "Statistic" || item.home !== "-");
};

export const normalizeAmericanFootballTimeline = (
  payload: unknown,
): AmericanFootballTimelineEvent[] =>
  getItems(payload).map((raw) => {
    const item = asRecord(raw);
    const team = stringValue(item.team, item.side).toLowerCase();
    return {
      time: stringValue(item.time, item.clock, "Game"),
      event: stringValue(
        item.event,
        item.description,
        item.text,
        "Game update",
      ),
      side: team.includes("home")
        ? "home"
        : team.includes("away")
          ? "away"
          : "neutral",
    };
  });

export const getAmericanFootballUpcomingFixtures = async () => {
  const response = await apiClient.get(
    "/api/v1/american-football/fixture/upcoming",
  );
  return response.data;
};

export const getAmericanFootballFixturesByDate = async (date: string) => {
  const response = await apiClient.get(
    "/api/v1/american-football/fixture/date",
    { params: { date } },
  );
  return response.data;
};

export const getAmericanFootballFixtureById = async (contestId: string) => {
  const response = await apiClient.get(
    `/api/v1/american-football/fixture/${encodeURIComponent(contestId)}`,
  );
  return response.data;
};

export const getAmericanFootballLiveMatches = async () => {
  const response = await apiClient.get("/api/v1/american-football/live/now");
  return response.data;
};

export const getAmericanFootballLiveMatchDetail = async (contestId: string) => {
  const response = await apiClient.get(
    `/api/v1/american-football/live/${encodeURIComponent(contestId)}`,
  );
  return response.data;
};

export const getAmericanFootballPlayByPlay = async (contestId: string) => {
  const response = await apiClient.get(
    `/api/v1/american-football/live/${encodeURIComponent(contestId)}/pbp`,
  );
  return response.data;
};
