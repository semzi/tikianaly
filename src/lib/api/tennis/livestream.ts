// WebSocket-based live stream for Goalserve tennis updates
// Connects to: ws://localhost:7824/
// Uses: { "action": "subscribe", "url": "..." }

const WS_URL = "ws://localhost:7824/";
const TENNIS_LIVE_ENDPOINT =
  "http://localhost:7824/api/tennis_scores/home?json=1";

let webSocket: WebSocket | null = null;

export type TennisDashboardStreamHandlers = {
  onOpen?: (ev: Event) => void;
  onUpdate: (matches: any[], ev: MessageEvent) => void;
  onError?: (ev: Event | Error) => void;
};

const normalizeLivePayload = (payload: any): any[] => {
  // Handle Goalserve response format
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
): WebSocket => {
  if (webSocket && webSocket.readyState === WebSocket.OPEN) {
    return webSocket;
  }

  webSocket = new WebSocket(WS_URL);

  webSocket.onopen = (ev) => {
    // Subscribe to tennis live scores
    const subscribeMsg = {
      action: "subscribe",
      url: TENNIS_LIVE_ENDPOINT,
    };
    webSocket?.send(JSON.stringify(subscribeMsg));
    handlers.onOpen?.(ev);
  };

  webSocket.onmessage = (ev) => {
    try {
      const message = JSON.parse(ev.data);
      // Goalserve format: { type: "update", url: "...", payload: {...} }
      if (message.type === "update" && message.payload) {
        const matches = normalizeLivePayload(message.payload);
        handlers.onUpdate(matches, ev);
      }
    } catch (err) {
      handlers.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  };

  webSocket.onerror = (ev) => {
    handlers.onError?.(ev);
  };

  return webSocket;
};

export const closeTennisLiveStream = (ws: WebSocket | null | undefined) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    // Unsubscribe before closing
    const unsubscribeMsg = {
      action: "unsubscribe",
      url: TENNIS_LIVE_ENDPOINT,
    };
    ws.send(JSON.stringify(unsubscribeMsg));
    ws.close();
  }
};
