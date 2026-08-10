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
  limit: number = 100,
) => {
  const endpoint = `/api/v1/basketball/fixtures/date`;
  const params = { date, page, limit };
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
 * Fetch a basketball player by ID
 * @param filter - Player ID
 */
export const getBasketballPlayerDetail = async (filter: string | number) => {
  const endpoint = `/api/v1/basketball/players/${filter}`;
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * Search basketball players by name.
 * Tries the exact-name/ID detail endpoint first, then falls back to a
 * bounded client-side substring search over the paginated players list.
 * @param query - Player name search term
 * @param maxPages - Max pages of the players list to scan in the fallback
 */
export const searchBasketballPlayers = async (
  query: string,
  maxPages: number = 8
) => {
  const q = String(query).trim();
  if (!q) return [];

  const normalize = (p: any) => ({
    player_id: p?.player_id,
    player_name: p?.player_name,
    image_url: p?.image_url,
  });

  const seen = new Set<string>();

  try {
    const res: any = await getBasketballPlayerDetail(q);
    const raw = res?.responseObject?.item ?? res?.responseObject?.items;
    const items = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const exact = items
      .map(normalize)
      .filter((p: any) => p.player_id && p.player_name);
    if (exact.length) {
      return exact.slice(0, 10);
    }
  } catch {
    // not a valid ID / no exact match -> fall back to paginated search
  }

  const lower = q.toLowerCase();
  const results: Array<{ player_id?: number; player_name?: string; image_url?: string | null }> =
    [];
  let scanned = 0;

  for (let page = 1; page <= maxPages; page++) {
    let res: any;
    try {
      res = await getBasketballPlayers(page);
    } catch {
      break;
    }
    const items: any[] = res?.responseObject?.items ?? [];
    const totalPages = res?.responseObject?.totalPages ?? page;

    for (const p of items) {
      const name = String(p?.player_name ?? "");
      if (!name.toLowerCase().includes(lower)) continue;
      const id = String(p?.player_id ?? "");
      if (!id || seen.has(id)) continue;
      seen.add(id);
      results.push(normalize(p));
      if (results.length >= 10) return results;
    }

    scanned += items.length;
    if (scanned >= totalPages * res?.responseObject?.limit || page >= totalPages) {
      break;
    }
  }

  return results;
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