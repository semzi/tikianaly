import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";

type RadarDatum = {
  skill: string;
  value: number;
};

interface PlayerRadarChartProps {
  data?: RadarDatum[];
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
}) => {

  return (
    <div className="w-full h-96 ">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
           <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.1)" }}
            formatter={(value, _) => [`${value}`, "Rating"]}
          />
          <Radar
            name="Player Stats"
            dataKey="value"
            stroke="#FF4500"
            fill="#0056d2"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlayerRadarChart;