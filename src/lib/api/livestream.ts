// Re-export livestream functions from organized folders
// This file maintains backward compatibility with existing imports

// Football livestream exports
export {
  createFootballLiveStream,
  subscribeDashboardLiveFixtures,
  subscribeGameInfoLiveFixture,
  closeLiveStream,
  type LiveStreamTeam,
  type LiveStreamEvent,
  type LiveStreamFixture,
  type DashboardLiveFixture,
  type LiveStreamHandlers,
  type LiveStreamOptions,
  type DashboardStreamHandlers,
  type GameInfoStreamHandlers,
} from "./football/livestream";

// Basketball livestream exports
export {
  createBasketballLiveStream,
  subscribeBasketballDashboardLive,
  subscribeBasketballGameInfoLive,
  closeBasketballLiveStream,
  type BasketballLiveStreamOptions,
  type BasketballLiveStreamHandlers,
  type BasketballDashboardStreamHandlers,
  type BasketballGameInfoStreamHandlers,
} from "./basketball/livestream";

// Legacy export for backward compatibility (basketball was using football's function)
export { subscribeBasketballDashboardLive as subscribeBasketballLiveMatchesStream } from "./basketball/livestream";
