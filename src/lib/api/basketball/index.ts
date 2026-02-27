import apiClient from "../axios";

/**
 * Fetch all basketball leagues
 */
export const getBasketballLeagues = async () => {
  const endpoint = "/api/v1/basketball/leagues/all-leagues";
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetch a basketball league by ID
 * @param leagueId - The ID of the league to fetch
 */
export const getBasketballLeagueById = async (leagueId: string | number) => {
  const endpoint = `/api/v1/basketball/leagues/id/${leagueId}`;
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetch live basketball matches
 * @param page - Page number for pagination
 */
export const getLiveBasketballMatches = async (page: number = 1) => {
  const endpoint = "/api/v1/basketball/live";
  const params = { page };
  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

/**
 * Fetch basketball fixtures
 * @param page - Page number for pagination
 */
export const getBasketballFixtures = async (page: number = 1) => {
  const endpoint = "/api/v1/basketball/fixtures";
  const params = { page };
  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

/**
 * Search basketball fixtures by status
 * @param status - Match status (e.g., 'finished', 'not started')
 * @param page - Page number
 */
export const searchBasketballFixturesByStatus = async (
  status: string,
  page: number = 1,
) => {
  const endpoint = `/api/v1/basketball/fixtures/search/${status}`;
  const params = { page };
  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

/**
 * Fetch basketball fixtures by date
 * @param date - Date in YYYY-MM-DD format
 */
export const getBasketballFixturesByDate = async (
  date: string,
  page: number = 1,
) => {
  const endpoint = `/api/v1/basketball/fixtures/date`;
  const params = { date, page };
  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

/**
 * Fetch detailed match info (fixture details)
 * @param matchId - The ID of the match
 */
export const getBasketballMatchDetail = async (matchId: string | number) => {
  const endpoint = `/api/v1/basketball/fixtures/${matchId}`;
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetch Play-by-Play data for a basketball match
 * @param matchId - The ID of the match
 */
export const getBasketballMatchPlayByPlay = async (
  matchId: string | number,
) => {
  const endpoint = `/api/v1/basketball/match/${matchId}/pbp`;
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetch basketball standings by league ID and season
 * @param leagueId - The ID of the league
 * @param season - The season (e.g., '2025/2026')
 */
export const getBasketballStandingsByLeagueId = async (
  leagueId: string | number,
  season: string,
) => {
  const endpoint = "/api/v1/basketball/standings/league";
  const params = { leagueId, season };
  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

/**
 * Fetch basketball standings
 * @param filter - League or team ID filter
 */
export const getBasketballStandings = async (
  filterOrParams?:
    | string
    | number
    | { league_id?: string | number; team_id?: string | number },
) => {
  let endpoint = "/api/v1/basketball/standings";
  let params = {};

  if (
    typeof filterOrParams === "string" ||
    typeof filterOrParams === "number"
  ) {
    endpoint = `${endpoint}/${filterOrParams}`;
  } else if (typeof filterOrParams === "object") {
    params = filterOrParams;
  }

  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

/**
 * Fetch all basketball teams
 */
export const getBasketballTeams = async (page: number = 1) => {
  const endpoint = "/api/v1/basketball/teams";
  const params = { page };
  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

/**
 * Fetch a basketball team by ID or name
 * @param filter - Team ID or name
 */
export const getBasketballTeamDetail = async (filter: string | number) => {
  const endpoint = `/api/v1/basketball/teams/${filter}`;
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Fetch all basketball players
 */
export const getBasketballPlayers = async (page: number = 1) => {
  const endpoint = "/api/v1/basketball/players";
  const params = { page };
  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

/**
 * Fetch a basketball player by ID or name
 * @param filter - Player ID or name
 */
export const getBasketballPlayerDetail = async (filter: string | number) => {
  const endpoint = `/api/v1/basketball/players/${filter}`;
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Compare two basketball teams
 * @param data - Comparison data containing team IDs
 */
export const compareBasketballTeams = async (data: {
  teamA: string | number;
  teamB: string | number;
}) => {
  const endpoint = "/api/v1/basketball/comparison/teams";
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

/**
 * Compare two basketball players
 * @param data - Comparison data containing player IDs
 */
export const compareBasketballPlayers = async (data: {
  playerA: string | number;
  playerB: string | number;
}) => {
  const endpoint = "/api/v1/basketball/comparison/players";
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

// Image/Logo Endpoints

/**
 * Fetch basketball league logo by ID
 * @param leagueId - The ID of the league
 */
export const getBasketballLeagueLogoById = async (leagueId: string | number) => {
  const response = await apiClient.get(
    `/api/v1/basketball/leagues/id/${leagueId}`,
  );
  return response.data;
};

/**
 * Fetch basketball team logo by ID
 * @param teamId - The ID of the team
 */
export const getBasketballTeamLogoById = async (teamId: string | number) => {
  const response = await apiClient.get(
    `/api/v1/basketball/teams/${teamId}`,
  );
  return response.data;
};

/**
 * Fetch basketball player image by ID
 * @param playerId - The ID of the player
 */
export const getBasketballPlayerImageById = async (playerId: string | number) => {
  const response = await apiClient.get(
    `/api/v1/basketball/players/${playerId}`,
  );
  return response.data;
};