import { useEffect, useRef, useState } from "react";

export const ScriptSandbox = () => {
  const [matchId, setMatchId] = useState("");
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startListening = () => {
    if (!matchId) return;

    // Close previous stream if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url =
      "https://tikianaly-service-backend.onrender.com/api/v1/football/live/live-stream";

    const es = new EventSource(url);
    eventSourceRef.current = es;

    setActiveMatchId(matchId);
    setMatchData(null);

    es.onopen = () => {
      console.log("SSE connected for match:", matchId);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.match_id === matchId) {
          setMatchData((prev: any) => ({
            ...prev,
            ...data, // merge updates
          }));
        }
      } catch {}
    };

    es.onerror = (e) => {
      console.error("SSE error", e);
    };
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen page-padding-x py-6 max-w-xl">
      <h1 className="text-xl font-semibold theme-text">
        Live Match Viewer
      </h1>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          placeholder="Enter match ID"
          className="flex-1 px-3 py-2 rounded-md border text-sm"
        />
        <button
          onClick={startListening}
          className="px-4 py-2 rounded-md bg-black text-white text-sm"
        >
          Load
        </button>
      </div>

      {/* Match Data */}
      <div className="mt-6">
        {!activeMatchId && (
          <p className="text-sm text-neutral-m6">
            Enter a match ID to start streaming.
          </p>
        )}

        {activeMatchId && !matchData && (
          <p className="text-sm text-neutral-m6">
            Waiting for live updates for match {activeMatchId}…
          </p>
        )}

        {matchData && (
          <div className="block-style p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">
                {matchData.home_team} vs {matchData.away_team}
              </h2>
              <span className="text-sm font-medium">
                {matchData.home_score} - {matchData.away_score}
              </span>
            </div>

            <div className="text-xs text-neutral-m6">
              Status: {matchData.status} • Minute: {matchData.minute}'
            </div>

            <pre className="mt-3 text-xs overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(matchData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptSandbox;
