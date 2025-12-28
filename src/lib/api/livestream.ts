import apiClient from "./axios";

export type LiveStreamTeam = {
  id: string;
  name: string;
  goals: string;
};

export type LiveStreamEvent = {
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
  ts?: string | number;
};

export type LiveStreamFixture = {
  match_id: string;
  fixture_id: string;
  static_id: string;
  league_id: string;
  league_name: string;
  is_cup: boolean;
  file_group: string;
  localteam: LiveStreamTeam;
  visitorteam: LiveStreamTeam;
  covered_live: boolean;
  venue: unknown;
  date: string;
  timer: number;
  time: number;
  status: string;
  injury_time: number;
  injury_minute: number;
  commentary_available: boolean;
  halfTimeScore: string;
  fullTimeScore: string;
  extraTimeScore: string;
  events: LiveStreamEvent[];
  lastUpdatedAt?: number;
};

export type DashboardLiveFixture = Pick<
  LiveStreamFixture,
  | "match_id"
  | "fixture_id"
  | "static_id"
  | "league_id"
  | "league_name"
  | "status"
  | "timer"
  | "injury_time"
  | "injury_minute"
  | "localteam"
  | "visitorteam"
>;

export type LiveStreamHandlers<T = string> = {
  onOpen?: (ev: Event) => void;
  onMessage: (data: T, ev: MessageEvent) => void;
  onError?: (ev: Event) => void;
  parse?: (raw: string) => T;
};

export type LiveStreamOptions = {
  url?: string;
  withCredentials?: boolean;
};

export const createFootballLiveStream = <T = string>(
  handlers: LiveStreamHandlers<T>,
  options: LiveStreamOptions = {}
): EventSource => {
  const baseUrl = String(apiClient.defaults.baseURL ?? "");
  const url =
    options.url ?? `${baseUrl.replace(/\/+$/, "")}/api/v1/football/live/live-stream`;

  const eventSource = new EventSource(url, {
    withCredentials: options.withCredentials ?? false,
  });

  eventSource.onopen = (ev) => {
    handlers.onOpen?.(ev);
  };

  eventSource.onmessage = (ev) => {
    const raw = String(ev.data ?? "");
    const data = handlers.parse ? handlers.parse(raw) : (raw as unknown as T);
    handlers.onMessage(data, ev);
  };

  eventSource.onerror = (ev) => {
    handlers.onError?.(ev);
  };

  return eventSource;
};

const parseJsonArray = <T,>(raw: string): T[] => {
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as T[]) : [];
};

export type DashboardStreamHandlers = {
  onOpen?: (ev: Event) => void;
  onUpdate: (fixtures: DashboardLiveFixture[], ev: MessageEvent) => void;
  onError?: (ev: Event) => void;
};

export const subscribeDashboardLiveFixtures = (
  handlers: DashboardStreamHandlers,
  options: LiveStreamOptions = {}
): EventSource => {
  return createFootballLiveStream<LiveStreamFixture[]>({
    onOpen: handlers.onOpen,
    onError: handlers.onError,
    parse: (raw) => parseJsonArray<LiveStreamFixture>(raw),
    onMessage: (fixtures, ev) => {
      handlers.onUpdate(fixtures as DashboardLiveFixture[], ev);
    },
  }, options);
};

export type GameInfoStreamHandlers = {
  matchId: string;
  onOpen?: (ev: Event) => void;
  onFixture: (fixture: LiveStreamFixture | null, ev: MessageEvent) => void;
  onEvents?: (events: LiveStreamEvent[], ev: MessageEvent) => void;
  onError?: (ev: Event) => void;
};

export const subscribeGameInfoLiveFixture = (
  handlers: GameInfoStreamHandlers,
  options: LiveStreamOptions = {}
): EventSource => {
  return createFootballLiveStream<LiveStreamFixture[]>({
    onOpen: handlers.onOpen,
    onError: handlers.onError,
    parse: (raw) => parseJsonArray<LiveStreamFixture>(raw),
    onMessage: (fixtures, ev) => {
      const fixture =
        fixtures.find((f) => String(f.match_id) === String(handlers.matchId)) ?? null;
      handlers.onFixture(fixture, ev);
      if (fixture && handlers.onEvents) {
        handlers.onEvents(fixture.events ?? [], ev);
      }
    },
  }, options);
};

export const closeLiveStream = (eventSource: EventSource | null | undefined) => {
  eventSource?.close();
};
