import apiClient from "./axios";
import { applyPatch } from "fast-json-patch";

let cachedFastPatchState: unknown = null;

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
  useFastJsonPatch?: boolean;
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

  let currentState: unknown = cachedFastPatchState;
  let pendingPatchOps: unknown[] = [];

  const eventSource = new EventSource(url, {
    withCredentials: options.withCredentials ?? false,
  });

  eventSource.onopen = (ev) => {
    handlers.onOpen?.(ev);

    if (handlers.useFastJsonPatch && currentState != null) {
      handlers.onMessage(currentState as T, ev as unknown as MessageEvent);
    }
  };

  eventSource.onmessage = (ev) => {
    const raw = String(ev.data ?? "");
    if (handlers.useFastJsonPatch) {
      let parsed: any;
      try {
        parsed = JSON.parse(raw) as any;
      } catch {
        return;
      }

      // Raw RFC6902 JSON Patch stream:
      // - Full snapshot is any JSON value (usually an array/object of fixtures)
      // - Patch is an array of operations: [{ op, path, value? }, ...]
      const looksLikePatchArray =
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every(
          (op: any) =>
            op &&
            typeof op === "object" &&
            typeof op.op === "string" &&
            typeof op.path === "string"
        );

      if (looksLikePatchArray) {
        if (currentState == null) {
          pendingPatchOps = pendingPatchOps.concat(parsed as unknown[]);
          return;
        }

        try {
          const result = applyPatch(currentState as any, parsed as any, false, false);
          currentState = result.newDocument;
          cachedFastPatchState = currentState;
          handlers.onMessage(currentState as T, ev);
          return;
        } catch {
          return;
        }
      }

      // Otherwise treat as a full snapshot
      currentState = parsed ?? null;

      if (currentState != null && pendingPatchOps.length > 0) {
        try {
          const result = applyPatch(currentState as any, pendingPatchOps as any, false, false);
          currentState = result.newDocument;
        } catch {
          // ignore and continue with snapshot
        } finally {
          pendingPatchOps = [];
        }
      }
      cachedFastPatchState = currentState;
      handlers.onMessage(currentState as T, ev);
      return;
    }

    const data = handlers.parse ? handlers.parse(raw) : (raw as unknown as T);
    handlers.onMessage(data, ev);
  };

  eventSource.onerror = (ev) => {
    handlers.onError?.(ev);
  };

  return eventSource;
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
    useFastJsonPatch: true,
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
    useFastJsonPatch: true,
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

export const subscribeBasketballLiveMatchesStream = (
  handlers: {
    onOpen?: (ev: Event) => void;
    onUpdate: (fixtures: any, ev: MessageEvent) => void;
    onError?: (ev: Event) => void;
  },
  options: LiveStreamOptions = {},
): EventSource => {
  const baseUrl = String(apiClient.defaults.baseURL ?? "");
  const url =
    options.url ??
    `${baseUrl.replace(/\/+$/, "")}/api/v1/basketball/sse/stream-live`;

  return createFootballLiveStream<any>(
    {
      useFastJsonPatch: true,
      onOpen: handlers.onOpen,
      onError: handlers.onError,
      onMessage: (fixtures, ev) => {
        handlers.onUpdate(fixtures, ev);
      },
    },
    { ...options, url },
  );
};