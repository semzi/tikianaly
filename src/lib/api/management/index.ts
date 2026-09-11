/**
 * Management API – Public endpoints
 * Base URL: https://cmgmtapi.tikianaly.com
 * Base path: /api/v1
 *
 * Live-probed 2026-09-03 against cmgmtapi.tikianaly.com.
 * All endpoints are GET, no request body. Query/path params only.
 */

import { managementApi } from "../axios";

// ---------------------------------------------------------------------------
// Generic wrappers
// ---------------------------------------------------------------------------
export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export type PaginatedData<T> = {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
};

export type PaginationParams = {
  page?: number;
  per_page?: number;
};

// ---------------------------------------------------------------------------
// Shared domain types (inferred from live responses)
// ---------------------------------------------------------------------------
export type CompetitionType = "DOUBLE_ROUND_ROBIN" | string;
export type LeagueStatus = "REGISTRATION_OPEN" | string;
export type TeamStatus = "APPROVED" | "PENDING" | string;
export type PlayerStatus = "PENDING" | string;
export type FixtureStatus = "SCHEDULED" | "COMPLETED" | "LIVE" | string;
export type FixtureEventType =
  | "GOAL"
  | "SUBSTITUTION"
  | "PENALTY_SHOOTOUT_GOAL"
  | string;

// League
export type PublicLeagueSummary = {
  id: string;
  name: string;
  season: string;
  description: string | null;
  competitionType: CompetitionType;
  numberOfTeams: number;
  startDate: string; // ISO
  endDate: string; // ISO
  status: LeagueStatus;
  imageUrl: string | null;
  inviteCodePrefix: string;
  approvedTeamCount: number;
};

export type PublicLeagueDetail = PublicLeagueSummary & {
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  promotionSlots: number;
  relegationSlots: number;
  matchDuration: number;
};

// Team
export type PublicTeam = {
  id: string;
  name: string;
  city: string | null;
  stadium: string | null;
  imageUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  foundedYear: number | null;
  description: string | null;
  status: TeamStatus;
  leagueId: string;
};

export type PublicTeamDetail = PublicTeam & {
  league: Pick<PublicLeagueDetail, "id" | "name" | "season">;
  players: unknown[]; // empty in live, may contain players
  staffMembers: unknown[];
};

export type LeagueTeamsResponse = {
  league: Pick<PublicLeagueDetail, "id" | "name" | "season" | "status">;
  teams: PublicTeam[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
};

// Player
export type PublicPlayerBrief = {
  id: string;
  firstName: string;
  lastName: string;
  position: string; // e.g. RB, ST, GK
  jerseyNumber: number | null;
  imageUrl: string | null;
  nationality: string | null;
  dob: string | null; // ISO
  status: PlayerStatus;
  teamId: string;
  team: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

export type PublicPlayerDetail = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber: number | null;
  imageUrl: string | null;
  nationality: string | null;
  heightCm: number | null;
  weightKg: string | number | null;
  dob: string | null;
  status: PlayerStatus;
  isInjured: boolean;
  teamId: string;
  team: {
    id: string;
    name: string;
    imageUrl: string | null;
    leagueId: string;
    league: Pick<PublicLeagueDetail, "id" | "name" | "season">;
  };
  stats: PublicPlayerStats;
};

export type PublicPlayerStats = {
  player_id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  team_name: string;
  team_image_url: string | null;
  appearances: number;
  minutes_played: number;
  goals: number;
  assists: number;
  fouls: number;
  yellow_cards: number;
  red_cards: number;
  clean_sheets: number;
};

// Standings
export type PublicStandingEntry = {
  team_id: string;
  team_name: string;
  team_image_url: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  form: string;
};

export type PublicStandingsResponse = {
  league: Pick<PublicLeagueDetail, "id" | "name" | "season" | "status">;
  standings: PublicStandingEntry[];
};

// Statistics (top scorers etc – empty in seed, shape inferred)
export type PublicStatisticsResponse = {
  league: Pick<PublicLeagueDetail, "id" | "name" | "season">;
  top_scorers: PublicPlayerStats[];
  top_assists: PublicPlayerStats[];
  top_cards: PublicPlayerStats[];
};

// Fixture
export type PublicFixtureTeamRef = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export type PublicFixtureLeagueRef = Pick<PublicLeagueDetail, "id" | "name" | "season">;

export type PublicFixtureMatchdayRef = {
  id: string;
  roundNumber: number;
  date: string; // ISO
};

export type PublicFixtureEvent = {
  id: string;
  type: FixtureEventType;
  subtype: string | null;
  minute: number | null;
  injuryTimeMinute: number | null;
  description: string | null;
  teamId: string;
  playerId: string | null;
  relatedPlayerId: string | null;
  team: PublicFixtureTeamRef;
  player: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  } | null;
  relatedPlayer: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  } | null;
};

export type PublicFixture = {
  id: string;
  leagueId: string;
  matchdayId: string;
  homeTeamId: string;
  awayTeamId: string;
  venue: string | null;
  matchDate: string; // ISO
  kickoffTime: string | null; // "14:11"
  status: FixtureStatus;
  homeConfirmedAt: string | null;
  awayConfirmedAt: string | null;
  disputeReason: string | null;
  lineupsConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  league: PublicFixtureLeagueRef;
  homeTeam: PublicFixtureTeamRef;
  awayTeam: PublicFixtureTeamRef;
  matchday: PublicFixtureMatchdayRef;
  events: PublicFixtureEvent[];
  score: {
    home: number;
    away: number;
  };
  // present on single-fixture fetch
  lineups?: unknown[];
};

export type PublicFixturesPaginated = PaginatedData<PublicFixture> & {
  league?: PublicFixtureLeagueRef;
};

export type PublicFixtureLineupsResponse = {
  fixture: {
    id: string;
    leagueId: string;
    homeTeamId: string;
    awayTeamId: string;
    homeTeam: PublicFixtureTeamRef;
    awayTeam: PublicFixtureTeamRef;
  };
  lineups: unknown[]; // array of lineup entries (empty in seed)
};

// Search
export type PublicSearchLeaguesResult = Pick<
  PublicLeagueSummary,
  "id" | "name" | "season" | "imageUrl" | "status"
>;
export type PublicSearchTeamsResult = {
  id: string;
  name: string;
  city: string | null;
  imageUrl: string | null;
  league: Pick<PublicLeagueDetail, "id" | "name" | "season">;
};
export type PublicSearchPlayersResult = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber: number | null;
  imageUrl: string | null;
  team: {
    id: string;
    name: string;
    imageUrl: string | null;
    league: Pick<PublicLeagueDetail, "id" | "name" | "season">;
  };
};

export type PublicSearchResponse = {
  query: string;
  leagues: PublicSearchLeaguesResult[];
  teams: PublicSearchTeamsResult[];
  players: PublicSearchPlayersResult[];
};

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

// Public Search
// GET /api/v1/public/search?q=...
// Query: q (string, min 2 chars) — no body
export const searchPublic = async (q: string) => {
  const response = await managementApi.get<ApiSuccess<PublicSearchResponse>>(
    "/api/v1/public/search",
    { params: { q } }
  );
  return response.data;
};

// Public Leagues
// GET /api/v1/public/leagues
export const getPublicLeagues = async (params?: PaginationParams) => {
  const response = await managementApi.get<ApiSuccess<PaginatedData<PublicLeagueSummary>>>(
    "/api/v1/public/leagues",
    { params }
  );
  return response.data;
};

// GET /api/v1/public/leagues/:leagueId
export const getPublicLeagueById = async (leagueId: string) => {
  const response = await managementApi.get<ApiSuccess<PublicLeagueDetail>>(
    `/api/v1/public/leagues/${encodeURIComponent(leagueId)}`
  );
  return response.data;
};

// GET /api/v1/public/leagues/:leagueId/teams
export const getPublicLeagueTeams = async (
  leagueId: string,
  params?: PaginationParams
) => {
  const response = await managementApi.get<ApiSuccess<LeagueTeamsResponse>>(
    `/api/v1/public/leagues/${encodeURIComponent(leagueId)}/teams`,
    { params }
  );
  return response.data;
};

// GET /api/v1/public/leagues/:leagueId/players
export const getPublicLeaguePlayers = async (
  leagueId: string,
  params?: PaginationParams
) => {
  const response = await managementApi.get<ApiSuccess<PaginatedData<PublicPlayerBrief>>>(
    `/api/v1/public/leagues/${encodeURIComponent(leagueId)}/players`,
    { params }
  );
  return response.data;
};

// GET /api/v1/public/leagues/:leagueId/standings
export const getPublicLeagueStandings = async (leagueId: string) => {
  const response = await managementApi.get<ApiSuccess<PublicStandingsResponse>>(
    `/api/v1/public/leagues/${encodeURIComponent(leagueId)}/standings`
  );
  return response.data;
};

// GET /api/v1/public/leagues/:leagueId/statistics
export const getPublicLeagueStatistics = async (leagueId: string) => {
  const response = await managementApi.get<ApiSuccess<PublicStatisticsResponse>>(
    `/api/v1/public/leagues/${encodeURIComponent(leagueId)}/statistics`
  );
  return response.data;
};

// GET /api/v1/public/leagues/:leagueId/fixtures
export const getPublicLeagueFixtures = async (
  leagueId: string,
  params?: PaginationParams
) => {
  const response = await managementApi.get<
    ApiSuccess<PublicFixturesPaginated & { league: PublicFixtureLeagueRef }>
  >(`/api/v1/public/leagues/${encodeURIComponent(leagueId)}/fixtures`, { params });
  return response.data;
};

// Public Teams
// GET /api/v1/public/teams/:teamId
export const getPublicTeamById = async (teamId: string) => {
  const response = await managementApi.get<ApiSuccess<PublicTeamDetail>>(
    `/api/v1/public/teams/${encodeURIComponent(teamId)}`
  );
  return response.data;
};

// Public Players
// GET /api/v1/public/players/:playerId
export const getPublicPlayerById = async (playerId: string) => {
  const response = await managementApi.get<ApiSuccess<PublicPlayerDetail>>(
    `/api/v1/public/players/${encodeURIComponent(playerId)}`
  );
  return response.data;
};

// GET /api/v1/public/players/:playerId/stats
export const getPublicPlayerStats = async (playerId: string) => {
  const response = await managementApi.get<ApiSuccess<PublicPlayerStats>>(
    `/api/v1/public/players/${encodeURIComponent(playerId)}/stats`
  );
  return response.data;
};

// Public Fixtures
// GET /api/v1/public/fixtures?leagueId=&page=&per_page=
export type GetPublicFixturesParams = PaginationParams & {
  leagueId?: string;
};

export const getPublicFixtures = async (params?: GetPublicFixturesParams) => {
  const response = await managementApi.get<ApiSuccess<PaginatedData<PublicFixture>>>(
    "/api/v1/public/fixtures",
    { params }
  );
  return response.data;
};

// GET /api/v1/public/fixtures/:fixtureId
export const getPublicFixtureById = async (fixtureId: string) => {
  const response = await managementApi.get<ApiSuccess<PublicFixture>>(
    `/api/v1/public/fixtures/${encodeURIComponent(fixtureId)}`
  );
  return response.data;
};

// GET /api/v1/public/fixtures/:fixtureId/lineups
export const getPublicFixtureLineups = async (fixtureId: string) => {
  const response = await managementApi.get<ApiSuccess<PublicFixtureLineupsResponse>>(
    `/api/v1/public/fixtures/${encodeURIComponent(fixtureId)}/lineups`
  );
  return response.data;
};
