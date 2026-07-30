// Re-export all API endpoints from organized folders
// This file maintains backward compatibility with existing imports

// Auth exports
export {
  forgotPasswordRequestOtp,
  forgotPasswordVerifyOtp,
  addUser,
  login,
  getCurrentUser,
  changePassword,
  logout,
  refreshTokens,
} from "./auth";

// Football exports
export {
  FOOTBALL_COMMENTARY_SSE_URL,
  getAllPlayers,
  getPlayerByName,
  getPlayerById,
  getFootballLeagueLeaders,
  getPlayersStats,
  getAllTeams,
  getTeamByName,
  getTeamById,
  getAllLeagues,
  getLeagueByName,
  getLeagueById,
  getStandingsByLeagueId,
  getStandingSeasonsByLeagueId,
  getFixturesByLeague,
  getFixtureDetails,
  getMatchInfo,
  postTeamHeadToHead,
  getMatchCommentary,
  getLiveFixtures,
  filterFavorites,
  addFavorite,
  getFavorites,
  deleteFavorite,
  clearTeamsCache,
  clearLeaguesCache,
  clearPlayersCache,
  clearAllCache,
  getTeamFixtures,
  getLeagueFixtures,
  getPlayerRatings,
  // Image/Logo endpoints
  getLeagueLogoById,
  getTeamLogoById,
  getPlayerImageById,
  // Types
  type FootballLeagueLeadersResponse,
  type FootballHeadToHeadItem,
  type FootballLiveFixture,
} from "./football";

// Cricket exports
export {
  CRICKET_SCOREBOARD_SSE_URL,
  getCricketMatchSseUrl,
  getCricketHome,
  getCricketLive,
  getLiveCricketFixtures,
  getUpcomingCricketFixtures,
  getCricketSeriesList,
  getCricketSeriesById,
  getCricketFixturesBySeriesId,
  getCricketStandingsBySeriesId,
  getCricketMatchById,
  getCricketMatchCenter,
  getCricketVenue,
  getCricketInnings,
  getCricketManOfMatch,
  getCricketLineups,
  getCricketCommentary,
  getCricketWickets,
  getCricketLocalTeam,
  getCricketVisitorTeam,
  getCricketPlayerById,
} from "./cricket";

// Basketball exports
export {
  getBasketballLeagues,
  getBasketballLeagueById,
  getLiveBasketballMatches,
  getBasketballFixtures,
  searchBasketballFixturesByStatus,
  getBasketballFixturesByDate,
  getBasketballMatchDetail,
  getBasketballMatchPlayByPlay,
  getBasketballStandingsByLeagueId,
  getBasketballStandings,
  getBasketballTeams,
  getBasketballTeamDetail,
  getBasketballPlayers,
  getBasketballPlayerDetail,
  compareBasketballTeams,
  compareBasketballPlayers,
  // Image/Logo endpoints
  getBasketballLeagueLogoById,
  getBasketballTeamLogoById,
  getBasketballPlayerImageById,
} from "./basketball";

// Tennis exports
export {
  getTennisLiveMatches,
  getTennisMatchesByDayOffset,
  getTennisLeagues,
} from "./tennis";
