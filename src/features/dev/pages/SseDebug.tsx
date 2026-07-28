import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type LogItem = {
  ts: number;
  kind: "open" | "message" | "error" | "close";
  raw?: string;
  parsed?: unknown;
};

const DEFAULT_URL =
  "https://api.tikianaly.com/api/v1/football/sse/stream-match-info?matchId=4366647";

export const SseDebug = () => {
  const [searchParams] = useSearchParams();
  const urlFromQuery = String(searchParams.get("url") ?? "").trim();

  const initialUrl = urlFromQuery || DEFAULT_URL;
  const [inputUrl, setInputUrl] = useState(initialUrl);

  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [paused, setPaused] = useState(false);

  const esRef = useRef<EventSource | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const append = (item: LogItem) => {
    if (paused && item.kind === "message") return;
    setLogs((prev) => {
      const next = [...prev, item];
      return next.length > 500 ? next.slice(next.length - 500) : next;
    });
  };

  const close = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
      setConnected(false);
      append({ ts: Date.now(), kind: "close" });
    }
  };

  const connect = (targetUrl: string) => {
    close();

    append({ ts: Date.now(), kind: "open", raw: `CONNECT ${targetUrl}` });

    try {
      const es = new EventSource(targetUrl);
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        append({ ts: Date.now(), kind: "open", raw: "SSE connected" });
      };

      es.onmessage = (ev) => {
        const raw = String(ev.data ?? "");
        let parsed: unknown = undefined;
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = undefined;
        }
        append({ ts: Date.now(), kind: "message", raw, parsed });
      };

      es.onerror = () => {
        setConnected(false);
        append({ ts: Date.now(), kind: "error", raw: "SSE error (see browser console for details)" });
      };
    } catch (e) {
      append({ ts: Date.now(), kind: "error", raw: `Failed to construct EventSource: ${e}` });
    }
  };

  const handleConnect = () => {
    connect(inputUrl);
  };

  useEffect(() => {
    connect(initialUrl);
    return () => {
      close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [logs.length]);

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />

      <div className="page-padding-x py-6">
        <div className="block-style p-4 rounded">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0 flex-1 max-w-2xl">
              <p className="theme-text font-semibold text-base mb-2">SSE Debug</p>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConnect();
                }}
                placeholder="Enter SSE URL..."
                className="w-full px-3 py-2 rounded-lg border border-snow-200 dark:border-snow-100/10 bg-white/60 dark:bg-white/5 theme-text text-sm focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  connected
                    ? "text-ui-positive border-ui-positive/40 bg-ui-positive/10"
                    : "theme-text border-snow-200 dark:border-snow-100/10 bg-white/60 dark:bg-white/5"
                }`}
              >
                {connected ? "Connected" : "Disconnected"}
              </span>

              <button
                type="button"
                onClick={handleConnect}
                className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:opacity-90"
              >
                Connect
              </button>
              <button
                type="button"
                onClick={close}
                className="px-3 py-2 rounded-lg border border-snow-200 dark:border-snow-100/10 theme-text text-sm font-semibold hover:bg-snow-100 dark:hover:bg-white/5"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                className="px-3 py-2 rounded-lg border border-snow-200 dark:border-snow-100/10 theme-text text-sm font-semibold hover:bg-snow-100 dark:hover:bg-white/5"
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="px-3 py-2 rounded-lg border border-snow-200 dark:border-snow-100/10 theme-text text-sm font-semibold hover:bg-snow-100 dark:hover:bg-white/5"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-snow-200 dark:border-snow-100/10 bg-white/80 dark:bg-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-snow-200 dark:border-snow-100/10 flex items-center justify-between">
            <p className="theme-text text-sm font-semibold">Events</p>
            <p className="text-neutral-m6 text-xs">Showing last {logs.length} (max 500)</p>
          </div>

          <div ref={scrollerRef} className="max-h-[70vh] overflow-auto">
            {logs.length === 0 ? (
              <div className="p-4 text-sm text-neutral-m6">No events yet.</div>
            ) : (
              <div className="divide-y divide-snow-200 dark:divide-snow-100/10">
                {logs.map((l, idx) => {
                  const time = new Date(l.ts).toLocaleTimeString();
                  const label = l.kind.toUpperCase();
                  return (
                    <div key={`${l.ts}-${idx}`} className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="theme-text text-xs font-semibold">{label}</p>
                        <p className="text-neutral-m6 text-xs">{time}</p>
                      </div>

                      {l.raw ? (
                        <pre className="mt-2 text-xs theme-text whitespace-pre-wrap break-words">{l.raw}</pre>
                      ) : null}

                      {l.parsed !== undefined ? (
                        <pre className="mt-2 text-xs text-neutral-m6 whitespace-pre-wrap break-words">{JSON.stringify(l.parsed, null, 2)}</pre>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default SseDebug;
