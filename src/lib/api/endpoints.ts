// Re-export all API endpoints from organized folders
// This file maintains backward compatibility with existing imports

// Auth exports
export {
  requestOTP,
  verifyUser,
  forgotPasswordRequestOtp,
  forgotPasswordVerifyOtp,
  forgotPasswordResetPassword,
  addUser,
  login,
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
  // Image/Logo endpoints
  getLeagueLogoById,
  getTeamLogoById,
  getPlayerImageById,
  // Types
  type FootballLeagueLeadersResponse,
  type FootballHeadToHeadItem,
  type FootballLiveFixture,
} from "./football";

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
