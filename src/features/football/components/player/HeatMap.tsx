import { useMemo, useState } from "react";
import {
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

type HeatMapPoint = {
  x: number;
  y: number;
  count: number;
};

type ActionPoint = {
  type: "pass" | "shot" | "carry" | "tackle" | "interception" | string;
  x: number;
  y: number;
  outcome?: "success" | "fail" | "goal" | string;
};

type PlayerHeatMapData = {
  player_id: string;
  name: string;
  match_id: string;
  heatmap: HeatMapPoint[];
  actions: ActionPoint[];
};

type HeatMapProps = {
  data?: PlayerHeatMapData;
  height?: number;
  pitchSrc?: string;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const buildDemoData = (): PlayerHeatMapData => {
  // Pitch coordinates are assumed 0-100 (x) and 0-100 (y)
  // Generate a comprehensive distribution:
  // - primary hot zone in right half-space
  // - secondary zone around box
  // - scattered low-intensity touches
  const hot: HeatMapPoint[] = [];

  const pushCluster = (cx: number, cy: number, base: number, spread: number, n: number) => {
    for (let i = 0; i < n; i += 1) {
      const dx = (Math.random() - 0.5) * spread;
      const dy = (Math.random() - 0.5) * spread;
      const c = base + Math.round(Math.random() * (base * 0.6));
      hot.push({ x: clamp(cx + dx, 0, 100), y: clamp(cy + dy, 0, 100), count: Math.max(1, c) });
    }
  };

  const pushLine = (x1: number, y1: number, x2: number, y2: number, base: number, n: number) => {
    for (let i = 0; i < n; i += 1) {
      const t = n <= 1 ? 0 : i / (n - 1);
      const x = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 3;
      const y = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 3;
      const c = base + Math.round(Math.random() * (base * 0.7));
      hot.push({ x: clamp(x, 0, 100), y: clamp(y, 0, 100), count: Math.max(1, c) });
    }
  };

  // Right half-space / advanced 9 area (primary hot zone)
  pushCluster(78, 52, 18, 18, 48);
  // Box presence
  pushCluster(88, 48, 16, 12, 34);
  // Penalty spot / central
  pushCluster(84, 50, 14, 10, 22);
  // Build-up support touches
  pushCluster(65, 35, 10, 26, 34);
  // Link-up between lines
  pushCluster(72, 44, 11, 18, 28);
  // Wide runs
  pushCluster(92, 70, 8, 22, 18);
  // A few repeated patterns (diagonal runs)
  pushLine(60, 30, 90, 55, 10, 18);
  pushLine(62, 65, 90, 52, 8, 14);
  // Random low-count scatter (more density)
  for (let i = 0; i < 80; i += 1) {
    hot.push({ x: Math.random() * 100, y: Math.random() * 100, count: 1 + Math.round(Math.random() * 5) });
  }

  const actions: ActionPoint[] = [
    { type: "pass", x: 52, y: 22, outcome: "success" },
    { type: "pass", x: 58, y: 28, outcome: "success" },
    { type: "pass", x: 62, y: 32, outcome: "success" },
    { type: "pass", x: 66, y: 38, outcome: "fail" },
    { type: "pass", x: 70, y: 20, outcome: "success" },
    { type: "pass", x: 74, y: 36, outcome: "success" },
    { type: "pass", x: 76, y: 44, outcome: "fail" },
    { type: "pass", x: 80, y: 49, outcome: "success" },
    { type: "pass", x: 83, y: 55, outcome: "success" },
    { type: "pass", x: 86, y: 58, outcome: "success" },
    { type: "carry", x: 68, y: 41, outcome: "success" },
    { type: "carry", x: 72, y: 46, outcome: "success" },
    { type: "carry", x: 76, y: 52, outcome: "success" },
    { type: "carry", x: 78, y: 55, outcome: "success" },
    { type: "carry", x: 81, y: 58, outcome: "success" },
    { type: "carry", x: 85, y: 60, outcome: "fail" },
    { type: "shot", x: 86, y: 46, outcome: "fail" },
    { type: "shot", x: 88, y: 48, outcome: "goal" },
    { type: "shot", x: 90, y: 50, outcome: "fail" },
    { type: "shot", x: 92, y: 52, outcome: "fail" },
    { type: "shot", x: 84, y: 54, outcome: "fail" },
    { type: "tackle", x: 60, y: 46, outcome: "success" },
    { type: "tackle", x: 64, y: 44, outcome: "fail" },
    { type: "interception", x: 62, y: 40, outcome: "success" },
    { type: "interception", x: 66, y: 38, outcome: "success" },
  ];

  // Sprinkle additional action points for visual richness
  for (let i = 0; i < 26; i += 1) {
    const roll = Math.random();
    const type = roll < 0.65 ? "pass" : roll < 0.85 ? "carry" : "shot";
    const outcome = type === "shot" ? (Math.random() < 0.15 ? "goal" : "fail") : Math.random() < 0.78 ? "success" : "fail";
    const x = clamp(55 + Math.random() * 40, 0, 100);
    const y = clamp(18 + Math.random() * 64, 0, 100);
    actions.push({ type, x, y, outcome });
  }

  // Ensure the original user-supplied points are included
  hot.push(
    { x: 82, y: 45, count: 12 },
    { x: 75, y: 30, count: 8 },
    { x: 90, y: 50, count: 15 }
  );

  return {
    player_id: "12345",
    name: "E. Haaland",
    match_id: "987654",
    heatmap: hot,
    actions,
  };
};

const colorForCount = (count: number, min: number, max: number) => {
  const t = max === min ? 0 : (count - min) / (max - min);
  // Super-red heat: keep RGB red, scale alpha by intensity
  const alpha = 0.25 + t * 0.75;
  return `rgba(255, 0, 0, ${alpha.toFixed(3)})`;
};

const HeatMeshLayer = ({
  points,
  minCount,
  maxCount,
}: {
  points: HeatMapPoint[];
  minCount: number;
  maxCount: number;
}) => {
  const max = maxCount || 1;
  const min = minCount || 0;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <defs>
        <filter id="hm-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id="hm-blur-strong" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <g style={{ mixBlendMode: "screen" }}>
        {(points ?? []).map((p, idx) => {
          const c = Number(p.count ?? 0);
          const t = max === min ? 0 : (c - min) / (max - min);
          const r = 5 + t * 10;
          const fill = colorForCount(c, minCount, maxCount);
          return (
            <g key={`${idx}-${p.x}-${p.y}-${p.count}`}>
              <circle cx={p.x} cy={p.y} r={r * 1.6} fill={fill} filter="url(#hm-blur-strong)" opacity={0.95} />
              <circle cx={p.x} cy={p.y} r={r} fill={fill} filter="url(#hm-blur)" opacity={1} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

const ActionDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;

  const type = String(payload?.type ?? "");
  const outcome = String(payload?.outcome ?? "");

  const isGoal = type === "shot" && outcome === "goal";
  const isFail = outcome === "fail";

  const fill = isGoal ? "#22C55E" : isFail ? "#EF4444" : "#F59E0B";
  const stroke = "rgba(0,0,0,0.35)";

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {isGoal ? <circle cx={cx} cy={cy} r={9} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.6} /> : null}
    </g>
  );
};

// const HeatCell = (props: any) => {
//   const { cx, cy, payload, minCount, maxCount } = props;
//   if (cx == null || cy == null) return null;

//   const count = Number(payload?.count ?? 0);
//   const fill = colorForCount(count, minCount, maxCount);

//   // Square-like cell
//   const size = 18;

//   return (
//     <rect
//       x={cx - size / 2}
//       y={cy - size / 2}
//       width={size}
//       height={size}
//       rx={6}
//       ry={6}
//       fill={fill}
//       stroke="rgba(255,255,255,0.25)"
//       strokeWidth={1}
//     />
//   );
// };

export default function HeatMap({
  data,
  height = 420,
}: HeatMapProps) {
  const [mode, setMode] = useState<"heat" | "actions" | "both">("both");

  const demo = useMemo(() => buildDemoData(), []);
  const d = data ?? demo;

  const stats = useMemo(() => {
    const arr = d?.heatmap ?? [];
    const counts = arr.map((p) => p.count);
    const min = counts.length ? Math.min(...counts) : 0;
    const max = counts.length ? Math.max(...counts) : 0;
    return { min, max };
  }, [d]);

  return (
    <div className="block-style">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="font-bold theme-text">Heat Map</p>
          <p className="text-xs text-neutral-n5 dark:text-snow-200 truncate">
            {d?.name ?? "Player"} · Match {d?.match_id ?? "-"}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setMode("both")}
            className={`px-3 py-1.5 rounded text-xs border transition-colors ${
              mode === "both"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-transparent theme-text border-snow-200/60 dark:border-snow-100/10"
            }`}
          >
            Both
          </button>
          <button
            type="button"
            onClick={() => setMode("heat")}
            className={`px-3 py-1.5 rounded text-xs border transition-colors ${
              mode === "heat"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-transparent theme-text border-snow-200/60 dark:border-snow-100/10"
            }`}
          >
            Heat
          </button>
          <button
            type="button"
            onClick={() => setMode("actions")}
            className={`px-3 py-1.5 rounded text-xs border transition-colors ${
              mode === "actions"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-transparent theme-text border-snow-200/60 dark:border-snow-100/10"
            }`}
          >
            Actions
          </button>
        </div>
      </div>

      <div className="w-full" style={{ aspectRatio: "4 / 3", maxHeight: height }}>
        <div
          className="relative w-full h-full rounded-lg overflow-hidden border border-snow-200/60 dark:border-snow-100/10"
          style={{
            background:
              "linear-gradient(90deg, rgba(6, 245, 18, 0.74) 0%, rgba(0, 255, 94, 0.9) 50%, rgba(0, 255, 21, 0.8) 100%), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.86) 0px, rgba(255, 255, 255, 0.78) 42px, rgba(255, 255, 255, 0.02) 42px, rgba(255,255,255,0.02) 84px)",
          }}
        >
          {/* Heat mesh layer */}
          {(mode === "heat" || mode === "both") && (
            <HeatMeshLayer points={d?.heatmap ?? []} minCount={stats.min} maxCount={stats.max} />
          )}

          {/* Actions layer (Recharts for mapping + tooltip) */}
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 18, right: 18, bottom: 18, left: 18 }}>
                <XAxis type="number" dataKey="x" domain={[0, 100]} tick={false} axisLine={false} />
                <YAxis type="number" dataKey="y" domain={[0, 100]} tick={false} axisLine={false} />
                <ZAxis type="number" dataKey="count" range={[6, 22]} />
                <Tooltip />
                <Legend />

                {(mode === "actions" || mode === "both") && (
                  <Scatter name="Actions" data={d?.actions ?? []} fill="#F59E0B" shape={<ActionDot />} />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Heat points</p>
          <p className="font-bold theme-text">{(d?.heatmap ?? []).length}</p>
        </div>
        <div className="bg-snow-100 dark:bg-[#161B22] border border-snow-200/60 dark:border-snow-100/10 rounded p-3">
          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Actions</p>
          <p className="font-bold theme-text">{(d?.actions ?? []).length}</p>
        </div>
        <div className="bg-ui-success/10 border border-ui-success/20 rounded p-3">
          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Goals</p>
          <p className="font-bold theme-text">
            {(d?.actions ?? []).filter((a) => a.type === "shot" && a.outcome === "goal").length}
          </p>
        </div>
        <div className="bg-brand-primary/10 border border-brand-primary/20 rounded p-3">
          <p className="text-[10px] text-neutral-n5 dark:text-snow-200">Successful actions</p>
          <p className="font-bold theme-text">
            {(d?.actions ?? []).filter((a) => a.outcome === "success" || a.outcome === "goal").length}
          </p>
        </div>
      </div>
    </div>
  );
}
