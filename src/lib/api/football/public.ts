/**
 * Football – Public endpoints (mirror of management API)
 * Uses managementApi (https://cmgmtapi.tikianaly.com) so football features
 * can import from "@/lib/api/football" without knowing about management.
 *
 * Re-exports typed functions/types from management for convenience.
 */

export {
  // search
  searchPublic,
  // leagues
  getPublicLeagues,
  getPublicLeagueById,
  getPublicLeagueTeams,
  getPublicLeaguePlayers,
  getPublicLeagueStandings,
  getPublicLeagueStatistics,
  getPublicLeagueFixtures,
  // teams
  getPublicTeamById,
  // players
  getPublicPlayerById,
  getPublicPlayerStats,
  // fixtures
  getPublicFixtures,
  getPublicFixtureById,
  getPublicFixtureLineups,
  // types
  type ApiSuccess,
  type ApiError,
  type PaginatedData,
  type PaginationParams,
  type PublicLeagueSummary,
  type PublicLeagueDetail,
  type PublicTeam,
  type PublicTeamDetail,
  type LeagueTeamsResponse,
  type PublicPlayerBrief,
  type PublicPlayerDetail,
  type PublicPlayerStats,
  type PublicStandingEntry,
  type PublicStandingsResponse,
  type PublicStatisticsResponse,
  type PublicFixture,
  type PublicFixtureEvent,
  type PublicFixtureTeamRef,
  type PublicFixturesPaginated,
  type PublicFixtureLineupsResponse,
  type PublicSearchResponse,
  type GetPublicFixturesParams,
} from "../management";
