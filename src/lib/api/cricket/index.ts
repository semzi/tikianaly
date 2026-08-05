import apiClient from "../axios";


export const CRICKET_SCOREBOARD_SSE_URL = "https://api.tikianaly.com/api/v1/cricket/sse/scoreboard";
export const getCricketMatchSseUrl = (matchId: string | number) => `https://api.tikianaly.com/api/v1/cricket/sse/match/${encodeURIComponent(String(matchId))}`;

// ─── HOME & LIVE ─────────────────────────────────────────────────────────────

export const getCricketHome = async () => {
  const response = await apiClient.get("/api/v1/cricket/home");
  return response.data;
};

export const getCricketLive = async () => {
  const response = await apiClient.get("/api/v1/cricket/live");
  return response.data;
};

export const getLiveCricketFixtures = async (page?: string, limit?: string) => {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  
  const response = await apiClient.post("/api/v1/cricket/live", null, { params });
  return response.data;
};

export const getUpcomingCricketFixtures = async (page?: string | number, limit?: string | number, date?: string) => {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (date) params.date = date;
  
  const response = await apiClient.post("/api/v1/cricket/upcoming", null, { params });
  return response.data;
};

// ─── SERIES ──────────────────────────────────────────────────────────────────

export const getCricketSeriesList = async () => {
  const response = await apiClient.get("/api/v1/cricket/series");
  return response.data;
};

export const getCricketSeriesById = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/series/${encodeURIComponent(String(id))}`);
  return response.data;
};

export const getCricketFixturesBySeriesId = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/series/${encodeURIComponent(String(id))}/fixtures`);
  return response.data;
};

export const getCricketStandingsBySeriesId = async (id: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/series/${encodeURIComponent(String(id))}/standings`);
  return response.data;
};

// ─── MATCHES ─────────────────────────────────────────────────────────────────

export const getCricketMatchById = async (matchId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/matches/${encodeURIComponent(String(matchId))}`);
  return response.data;
};

export const getCricketMatchCenter = async (matchId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/matches/${encodeURIComponent(String(matchId))}/center`);
  return response.data;
};

// ─── FIXTURE DETAILS ─────────────────────────────────────────────────────────

export const getCricketVenue = async (fixtureId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/venue/${encodeURIComponent(String(fixtureId))}`);
  return response.data;
};

export const getCricketInnings = async (fixtureId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/innings/${encodeURIComponent(String(fixtureId))}`);
  return response.data;
};

export const getCricketManOfMatch = async (fixtureId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/manOfMatch/${encodeURIComponent(String(fixtureId))}`);
  return response.data;
};

export const getCricketLineups = async (fixtureId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/lineups/${encodeURIComponent(String(fixtureId))}`);
  return response.data;
};

export const getCricketCommentary = async (fixtureId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/comment/${encodeURIComponent(String(fixtureId))}`);
  return response.data;
};

export const getCricketWickets = async (fixtureId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/wickets/${encodeURIComponent(String(fixtureId))}`);
  return response.data;
};

export const getCricketLocalTeam = async (fixtureId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/localTeam/${encodeURIComponent(String(fixtureId))}`);
  return response.data;
};

export const getCricketVisitorTeam = async (fixtureId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/visitorTeam/${encodeURIComponent(String(fixtureId))}`);
  return response.data;
};

// ─── PLAYERS ─────────────────────────────────────────────────────────────────

export const getCricketPlayerById = async (playerId: string | number) => {
  const response = await apiClient.get(`/api/v1/cricket/players/${encodeURIComponent(String(playerId))}`);
  return response.data;
};
