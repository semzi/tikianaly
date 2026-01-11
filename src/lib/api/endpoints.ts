import apiClient from './axios';
import { apiCache } from './cache';

// Authentication Endpoints

/**
 * Request OTP for a user
 * @param data - Request data containing email or phone
 */
export const requestOTP = async (data: any) => {
  const response = await apiClient.post('/api/v1/user/request-otp', data);
  return response.data;
};

/**
 * Verify a user with OTP
 * @param data - Request data containing email/phone and OTP
 */
export const verifyUser = async (data: any) => {
  const response = await apiClient.post('/api/v1/user/verify-user', data);
  return response.data;
};

/**
 * Register a new user
 * @param data - User registration data
 */
export const addUser = async (data: any) => {
  const response = await apiClient.post('/api/v1/user/add-user', data);
  return response.data;
};

/**
 * Login a user
 * @param data - Login credentials (email/phone and password)
 */
export const login = async (data: any) => {
  const response = await apiClient.post('/api/v1/user/login', data);
  return response.data;
};

// Football Players Endpoints

/**
 * Fetch all players (paginated)
 * @param page - Page number for pagination
 * @param limit - Number of items per page
 */
export const getAllPlayers = async (page: number = 1, limit: number = 50) => {
  const endpoint = '/api/v1/football/players/all-players';
  const params = { page, limit };

  // Check cache first
  const cached = apiCache.get(endpoint, params);
  if (cached !== null) {
    return cached;
  }

  // Fetch from API
  const response = await apiClient.get(endpoint, { params });
  const data = response.data;

  // Store in cache (5 minutes TTL)
  apiCache.set(endpoint, data, params, 5 * 60 * 1000);

  return data;
};

/**
 * Fetch a player by name
 * @param playerName - The name of the player to fetch
 */
export const getPlayerByName = async (playerName: string) => {
  const response = await apiClient.get(
    `/api/v1/football/players/name/${encodeURIComponent(playerName)}`
  );
  return response.data;
};

/**
 * Fetch a player by ID
 * @param playerId - The ID of the player to fetch
 */
export const getPlayerById = async (playerId: string | number) => {
  const response = await apiClient.get(`/api/v1/football/players/id/${playerId}`);
  return response.data;
};

/**
 * Get stats for multiple players by their IDs
 * @param data - Request data containing player IDs
 */
export const getPlayersStats = async (data: any) => {
  const response = await apiClient.post('/api/v1/football/players/stats', data);
  return response.data;
};

// Football Teams Endpoints

/**
 * Fetch all teams (paginated)
 * @param page - Page number for pagination
 * @param limit - Number of items per page
 */
export const getAllTeams = async (page: number = 1, limit: number = 50) => {
  const endpoint = '/api/v1/football/teams/all-teams';
  const params = { page, limit };

  // Check cache first
  const cached = apiCache.get(endpoint, params);
  if (cached !== null) {
    return cached;
  }

  // Fetch from API
  const response = await apiClient.get(endpoint, { params });
  const data = response.data;

  // Store in cache (5 minutes TTL)
  apiCache.set(endpoint, data, params, 5 * 60 * 1000);

  return data;
};

/**
 * Fetch a team by its name
 * @param teamName - The name of the team to fetch
 */
export const getTeamByName = async (teamName: string) => {
  const response = await apiClient.get(
    `/api/v1/football/teams/name/${encodeURIComponent(teamName)}`
  );
  return response.data;
};

/**
 * Fetch a team by its ID
 * @param teamId - The ID of the team to fetch
 */
export const getTeamById = async (teamId: string | number) => {
  const response = await apiClient.get(`/api/v1/football/teams/id/${teamId}`);
  return response.data;
};

// Football Leagues Endpoints

/**
 * Fetch all leagues (paginated)
 * @param page - Page number for pagination
 * @param limit - Number of items per page
 */
export const getAllLeagues = async (page: number = 1, limit: number = 50) => {
  const endpoint = '/api/v1/football/leagues/all-leagues';
  const params = { page, limit };

  // Check cache first
  const cached = apiCache.get(endpoint, params);
  if (cached !== null) {
    return cached;
  }

  // Fetch from API
  const response = await apiClient.get(endpoint, { params });
  const data = response.data;

  // Store in cache (5 minutes TTL)
  apiCache.set(endpoint, data, params, 5 * 60 * 1000);

  return data;
};

/**
 * Fetch a league by name
 * @param leagueName - The name of the league to fetch
 */
export const getLeagueByName = async (leagueName: string) => {
  const response = await apiClient.get(
    `/api/v1/football/leagues/name/${encodeURIComponent(leagueName)}`
  );
  return response.data;
};

/**
 * Fetch a league by ID
 * @param leagueId - The ID of the league to fetch
 */
export const getLeagueById = async (leagueId: string | number) => {
  const response = await apiClient.get(`/api/v1/football/leagues/id/${leagueId}`);
  return response.data;
};
export const getStandingsByLeagueId = async (leagueId: string | number) => {
  const response = await apiClient.get(`/api/v1/football/standing/league?leagueId=${leagueId}`);
  return response.data;
};

// Football Fixtures Endpoints

/**
 * Fetch fixtures by league, date, page, and limit
 * @param leagueId - The ID of the league to fetch fixtures for
 * @param date - The date for which to fetch fixtures (format: YYYY-MM-DD)
 * @param page - Page number for pagination
 * @param limit - Number of items per page
 */
export const getFixturesByLeague = async (
  leagueId: string | number,
  date: string,
  page: number = 1,
  limit: number = 100
) => {
  const endpoint = '/api/v1/football/fixture/league';
  const params = { leagueId, date, page, limit };

  // Fetch from API (cache removed)
  const response = await apiClient.get(endpoint, { params });
  const data = response.data;

  return data;
};

/**
 * Fetch fixture details by fixture ID
 * @param fixtureId - The ID of the fixture to fetch details for
 */
export const getFixtureDetails = async (fixtureId: string | number) => {
  const response = await apiClient.get(
    `/api/v1/football/fixture/get-fixture?fixtureId=${fixtureId}`
  );
  return response.data;
};

export const getMatchInfo = async (matchId: string | number) => {
  const response = await apiClient.get(
    `/api/v1/football/match/match-info?matchId=${encodeURIComponent(String(matchId))}`
  );
  return response.data;
};

 type FootballLiveFixtureEvent = {
  eventid: string;
  type: string;
  extra_min: string;
  minute: string;
  team: string;
  player: string;
  playerId: string;
  assist: string;
  assistid: string;
  result: string;
 };

 type FootballLiveFixtureTeam = {
  id: string;
  name: string;
  goals: string;
 };

 export type FootballLiveFixture = {
  _id: string;
  match_id: string;
  __v: number;
  commentary_available: boolean;
  covered_live: boolean;
  createdAt: string;
  date: string;
  events: FootballLiveFixtureEvent[];
  extraTimeScore: string;
  file_group: string;
  fixture_id: string;
  fullTimeScore: string;
  halfTimeScore: string;
  injury_minute: number;
  injury_time: number;
  is_cup: boolean;
  lastUpdatedAt: string;
  league_id: string;
  league_name: string;
  localteam: FootballLiveFixtureTeam;
  source: string;
  static_id: string;
  status: string;
  time: number;
  timer: number;
  updatedAt: string;
  venue: unknown;
  visitorteam: FootballLiveFixtureTeam;
 };

 type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  responseObject?: T;
  error?: any;
 };

 export const getLiveFixtures = async (): Promise<
  ApiResponse<FootballLiveFixture | FootballLiveFixture[]>
 > => {
  const response = await apiClient.get('/api/v1/football/fixture/live');
  return response.data;
 };

// Football Favorites Endpoints

/**
 * Filter favorites
 * @param data - Filter criteria for favorites
 */
export const filterFavorites = async (data: any) => {
  const response = await apiClient.post('/api/v1/football/filter-favorites', data);
  return response.data;
};

/**
 * Add a favorite
 * @param data - Favorite item data to add
 */
export const addFavorite = async (data: any) => {
  const response = await apiClient.post('/api/v1/football/add-favorites', data);
  return response.data;
};

/**
 * Get all favorites
 * @param params - Optional query parameters
 */
export const getFavorites = async (params?: any) => {
  const response = await apiClient.get('/api/v1/football/get-favorites', { params });
  return response.data;
};

/**
 * Delete a favorite by ID
 * @param id - The ID of the favorite to delete
 */
export const deleteFavorite = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/football/delete-favorites/${id}`);
  return response.data;
};

// Cache Management Utilities

/**
 * Clear cache for all teams
 * @param page - Optional page number to clear specific page cache
 * @param limit - Optional limit to clear specific limit cache
 */
export const clearTeamsCache = (page?: number, limit?: number) => {
  const endpoint = '/api/v1/football/teams/all-teams';
  if (page !== undefined && limit !== undefined) {
    apiCache.clear(endpoint, { page, limit });
  } else {
    // Clear all variations of this endpoint
    apiCache.clear(endpoint);
  }
};

/**
 * Clear cache for all leagues
 * @param page - Optional page number to clear specific page cache
 * @param limit - Optional limit to clear specific limit cache
 */
export const clearLeaguesCache = (page?: number, limit?: number) => {
  const endpoint = '/api/v1/football/leagues/all-leagues';
  if (page !== undefined && limit !== undefined) {
    apiCache.clear(endpoint, { page, limit });
  } else {
    // Clear all variations of this endpoint
    apiCache.clear(endpoint);
  }
};

/**
 * Clear cache for all players
 * @param page - Optional page number to clear specific page cache
 * @param limit - Optional limit to clear specific limit cache
 */
export const clearPlayersCache = (page?: number, limit?: number) => {
  const endpoint = '/api/v1/football/players/all-players';
  if (page !== undefined && limit !== undefined) {
    apiCache.clear(endpoint, { page, limit });
  } else {
    // Clear all variations of this endpoint
    apiCache.clear(endpoint);
  }
};

/**
 * Clear all API cache
 */
export const clearAllCache = () => {
  apiCache.clearAll();
};

