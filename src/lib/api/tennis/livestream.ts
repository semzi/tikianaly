import apiClient from "../axios";

export type TennisLiveStreamOptions = {
  url?: string;
  withCredentials?: boolean;
};

export type TennisLiveStreamHandlers<T = any> = {
  onOpen?: (ev: Event) => void;
  onMessage: (data: T, ev: MessageEvent) => void;
  onError?: (ev: Event) => void;
  parse?: (raw: string) => T;
};

export const createTennisLiveStream = <T = any>(
  handlers: TennisLiveStreamHandlers<T>,
  options: TennisLiveStreamOptions = {},
): EventSource => {
  const baseUrl = String(apiClient.defaults.baseURL ?? "");
  const url =
    options.url ??
    `${baseUrl.replace(/\/+$/, "")}/api/v1/tennis/sse/stream-live`;

  const eventSource = new EventSource(url, {
    withCredentials: options.withCredentials ?? false,
  });

  eventSource.onopen = (ev) => handlers.onOpen?.(ev);

  eventSource.onmessage = (ev) => {
    const raw = String(ev.data ?? "");
    const data = handlers.parse ? handlers.parse(raw) : (raw as unknown as T);
    handlers.onMessage(data, ev);
  };

  eventSource.onerror = (ev) => handlers.onError?.(ev);

  return eventSource;
};

export type TennisDashboardStreamHandlers = {
  onOpen?: (ev: Event) => void;
  onUpdate: (matches: any[], ev: MessageEvent) => void;
  onError?: (ev: Event) => void;
};

const normalizeLivePayload = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.matches)) return payload.matches;
  if (Array.isArray(payload?.responseObject?.items)) {
    return payload.responseObject.items;
  }

  return [];
};

export const subscribeTennisLiveMatchesStream = (
  handlers: TennisDashboardStreamHandlers,
  options: TennisLiveStreamOptions = {},
): EventSource => {
  return createTennisLiveStream<any>(
    {
      onOpen: handlers.onOpen,
      onError: handlers.onError,
      parse: (raw) => {
        try {
          return JSON.parse(raw);
        } catch {
          return [];
        }
      },
      onMessage: (payload, ev) => {
        handlers.onUpdate(normalizeLivePayload(payload), ev);
      },
    },
    options,
  );
};

export const closeTennisLiveStream = (
  eventSource: EventSource | null | undefined,
) => {
  eventSource?.close();
};
