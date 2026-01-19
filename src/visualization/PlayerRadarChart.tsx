import {
  Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";

type RadarDatum = {
  skill: string;
  value: number;
};

type RadarSeries = {
  name: string;
  data: RadarDatum[];
  stroke?: string;
  fill?: string;
};

interface PlayerRadarChartProps {
  data?: RadarDatum[];
  series?: RadarSeries[];
}

const PlayerRadarChart: React.FC<PlayerRadarChartProps> = ({
  data = [
    { skill: "Pace", value: 86 },
    { skill: "Shooting", value: 79 },
    { skill: "Passing", value: 82 },
    { skill: "Dribbling", value: 88 },
    { skill: "Defense", value: 60 },
    { skill: "Physical", value: 75 },
  ],
  series,
}) => {

  const resolvedSeries: RadarSeries[] =
    series && series.length
      ? series
      : [
          {
            name: "Player Stats",
            data,
            stroke: "#FF4500",
            fill: "#0056d2",
          },
        ];

  const skillOrder = resolvedSeries[0]?.data?.map((d) => d.skill) ?? [];
  const chartData = skillOrder.map((skill) => {
    const row: Record<string, any> = { skill };
    resolvedSeries.forEach((s, idx) => {
      const found = (s.data ?? []).find((d) => d.skill === skill);
      row[`s${idx}`] = found?.value ?? 0;
    });
    return row;
  });

  return (
    <div className="w-full h-96 ">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.1)" }}
            formatter={(value, _) => {
              const n = typeof value === "number" ? value : Number(value);
              const out = Number.isFinite(n) ? n.toFixed(1) : String(value);
              return [out, "Score"];
            }}
          />
          <Legend />
          {resolvedSeries.map((s, idx) => (
            <Radar
              key={`radar-${idx}`}
              name={s.name}
              dataKey={`s${idx}`}
              stroke={s.stroke ?? "#FF4500"}
              fill={s.fill ?? s.stroke ?? "#FF4500"}
              fillOpacity={0.35}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlayerRadarChart;