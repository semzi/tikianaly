import apiClient from "../axios";
import type {
  AmericanFootballLeague,
  AmericanFootballMatch,
  AmericanFootballStat,
  AmericanFootballTimelineEvent,
} from "@/features/american-football/data/mockAmericanFootball";

/**
 * The backend is not available yet. Set this to true only after its
 * `/api/v1/american-football` routes have been deployed.
 */
export const isAmericanFootballApiEnabled =
  import.meta.env.VITE_ENABLE_AMERICAN_FOOTBALL_API === "true";

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const value = (...values: unknown[]) =>
  values.find((item) => item !== undefined && item !== null && item !== "");

const stringValue = (...values: unknown[]) => String(value(...values) ?? "").trim();

const getItems = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  const root = asRecord(payload);
  const response = asRecord(root.responseObject ?? root.data ?? root.response);

  return asArray(
    value(
      root.items,
      root.matches,
      root.fixtures,
      root.match,
      response.items,
      response.matches,
      response.fixtures,
      response.match,
    ),
  );
};

const teamName = (team: unknown) => {
  const record = asRecord(team);
  return stringValue(record.name, record.team_name, record.display_name, team);
};

const teamScore = (team: unknown) => {
  const record = asRecord(team);
  return stringValue(record.score, record.goals, record.total, record.points);
};

export const normalizeAmericanFootballMatch = (raw: unknown): AmericanFootballMatch => {
  const item = asRecord(raw);
  const home = value(item.homeTeam, item.home_team, item.localteam, item.home);
  const away = value(item.awayTeam, item.away_team, item.visitorteam, item.away);
  const homeScore = stringValue(item.home_score, item.homeScore, teamScore(home));
  const awayScore = stringValue(item.away_score, item.awayScore, teamScore(away));
  const status = stringValue(item.status, item.state, "Scheduled");

  return {
    id: stringValue(item.id, item.match_id, item.contestID, item.contest_id, item.fixture_id, `af-${crypto.randomUUID?.() ?? Date.now()}`),
    league: stringValue(item.league_name, item.league, item.tournament, item.category, "American Football"),
    homeTeam: teamName(home) || "Home Team",
    awayTeam: teamName(away) || "Away Team",
    status,
    period: stringValue(item.period, item.quarter, item.status_detail, status),
    clock: stringValue(item.clock, item.timer, item.time_remaining, "--"),
    kickoff: stringValue(item.kickoff, item.time, item.start_time, "TBD"),
    venue: stringValue(item.venue, item.stadium, item.location, "Venue TBC"),
    score: `${homeScore || "-"} - ${awayScore || "-"}`,
    highlight: stringValue(item.highlight, item.summary, item.note, "Match information will be available soon."),
  };
};

export const normalizeAmericanFootballMatches = (payload: unknown) =>
  getItems(payload).map(normalizeAmericanFootballMatch);

export const normalizeAmericanFootballMatchDetail = (payload: unknown): AmericanFootballMatch => {
  const root = asRecord(payload);
  const detail = value(root.responseObject, root.data, root.match, payload);
  return {
    ...normalizeAmericanFootballMatch(detail),
    stats: normalizeAmericanFootballStats(detail),
    timeline: normalizeAmericanFootballTimeline(detail),
  };
};

export const normalizeAmericanFootballStats = (payload: unknown): AmericanFootballStat[] => {
  const root = asRecord(payload);
  const stats = asArray(value(root.stats, asRecord(root.responseObject).stats, asRecord(root.data).stats));
  return stats
    .map((raw) => {
      const item = asRecord(raw);
      return {
        label: stringValue(item.label, item.name, item.stat, "Statistic"),
        home: stringValue(item.home, item.home_value, item.localteam, "-"),
        away: stringValue(item.away, item.away_value, item.visitorteam, "-"),
      };
    })
    .filter((item) => item.label !== "Statistic" || item.home !== "-");
};

export const normalizeAmericanFootballTimeline = (payload: unknown): AmericanFootballTimelineEvent[] =>
  getItems(payload).map((raw) => {
    const item = asRecord(raw);
    const team = stringValue(item.team, item.side).toLowerCase();
    return {
      time: stringValue(item.time, item.clock, item.period, "Game"),
      event: stringValue(item.event, item.description, item.comment, item.text, "Game update"),
      side: team.includes("home") || team.includes("local") ? "home" : team.includes("away") || team.includes("visitor") ? "away" : "neutral",
    };
  });

export const normalizeAmericanFootballLeagues = (payload: unknown): AmericanFootballLeague[] =>
  getItems(payload).map((raw) => {
    const item = asRecord(raw);
    return {
      id: stringValue(item.id, item.league_id, item.tournament_id, item.name),
      name: stringValue(item.name, item.league_name, item.tournament_name),
      region: stringValue(item.region, item.country, item.country_name, "Other"),
      season: stringValue(item.season, item.season_name, "Current season"),
      teams: stringValue(item.teams, item.team_count, ""),
      tier: stringValue(item.tier, item.level, "League"),
      description: stringValue(item.description, ""),
    };
  }).filter((league) => league.id && league.name);

export const getAmericanFootballCoverage = async () => {
  const response = await apiClient.get("/api/v1/american-football/leagues/coverage");
  return response.data;
};

export const getAmericanFootballLiveMatches = async () => {
  const response = await apiClient.get("/api/v1/american-football/live");
  return response.data;
};

export const getAmericanFootballFixturesByDate = async (date: string) => {
  const response = await apiClient.get("/api/v1/american-football/fixtures/date", {
    params: { date },
  });
  return response.data;
};

export const getAmericanFootballMatchDetail = async (matchId: string) => {
  const response = await apiClient.get(`/api/v1/american-football/matches/${encodeURIComponent(matchId)}`);
  return response.data;
};

export const getAmericanFootballPlayByPlay = async (matchId: string) => {
  const response = await apiClient.get(`/api/v1/american-football/matches/${encodeURIComponent(matchId)}/play-by-play`);
  return response.data;
};
