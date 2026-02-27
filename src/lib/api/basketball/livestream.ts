import apiClient from "../axios";
import { applyPatch } from "fast-json-patch";

let cachedBasketballPatchState: unknown = null;

export type BasketballLiveStreamOptions = {
  url?: string;
  withCredentials?: boolean;
};

export type BasketballLiveStreamHandlers<T = any> = {
  onOpen?: (ev: Event) => void;
  onMessage: (data: T, ev: MessageEvent) => void;
  onError?: (ev: Event) => void;
  parse?: (raw: string) => T;
  useFastJsonPatch?: boolean;
};

export const createBasketballLiveStream = <T = any>(
  handlers: BasketballLiveStreamHandlers<T>,
  options: BasketballLiveStreamOptions = {}
): EventSource => {
  const baseUrl = String(apiClient.defaults.baseURL ?? "");
  const url =
    options.url ?? `${baseUrl.replace(/\/+$/, "")}/api/v1/basketball/sse/stream-live`;

  let currentState: unknown = cachedBasketballPatchState;
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
          cachedBasketballPatchState = currentState;
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
      cachedBasketballPatchState = currentState;
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

export type BasketballDashboardStreamHandlers = {
  onOpen?: (ev: Event) => void;
  onUpdate: (fixtures: any[], ev: MessageEvent) => void;
  onError?: (ev: Event) => void;
};

export const subscribeBasketballDashboardLive = (
  handlers: BasketballDashboardStreamHandlers,
  options: BasketballLiveStreamOptions = {}
): EventSource => {
  return createBasketballLiveStream<any[]>({
    onOpen: handlers.onOpen,
    onError: handlers.onError,
    useFastJsonPatch: true,
    onMessage: (fixtures, ev) => {
      handlers.onUpdate(fixtures, ev);
    },
  }, options);
};

export type BasketballGameInfoStreamHandlers = {
  matchId: string;
  onOpen?: (ev: Event) => void;
  onMatch: (match: any | null, ev: MessageEvent) => void;
  onError?: (ev: Event) => void;
};

export const subscribeBasketballGameInfoLive = (
  handlers: BasketballGameInfoStreamHandlers,
  options: BasketballLiveStreamOptions = {}
): EventSource => {
  return createBasketballLiveStream<any[]>({
    onOpen: handlers.onOpen,
    onError: handlers.onError,
    useFastJsonPatch: true,
    onMessage: (matches, ev) => {
      const match =
        matches.find((m) => String(m.match_id) === String(handlers.matchId)) ?? null;
      handlers.onMatch(match, ev);
    },
  }, options);
};

export const closeBasketballLiveStream = (eventSource: EventSource | null | undefined) => {
  eventSource?.close();
};