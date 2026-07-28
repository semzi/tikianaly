import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import { mockCricketMatches, mockCricketStandings } from "../data/mockCricket";
import { SegmentedSelector } from "@/components/ui/SegmentedSelector";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeftIcon,
  StarIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

// ─── Demo data for deeper match details ──────────────────────────────────────

const DEMO_SCORECARD = {
  innings: [
    {
      team: "Mumbai Indians",
      short: "MI",
      total: "184/5",
      overs: "20.0",
      runRate: "9.20",
      batters: [
        { name: "Rohit Sharma", runs: 64, balls: 42, fours: 6, sixes: 3, sr: "152.4", out: "c Dhoni b Jadeja" },
        { name: "Ishan Kishan", runs: 31, balls: 22, fours: 3, sixes: 1, sr: "140.9", out: "c Raina b Theekshana" },
        { name: "Suryakumar Yadav", runs: 45, balls: 28, fours: 4, sixes: 2, sr: "160.7", out: "not out" },
        { name: "Tilak Varma", runs: 22, balls: 16, fours: 2, sixes: 1, sr: "137.5", out: "run out (Jadeja)" },
        { name: "Hardik Pandya", runs: 14, balls: 9, fours: 0, sixes: 2, sr: "155.6", out: "not out" },
      ],
      bowlers: [
        { name: "Ravindra Jadeja", overs: "4.0", maidens: 0, runs: 28, wickets: 1, econ: "7.00" },
        { name: "Maheesh Theekshana", overs: "4.0", maidens: 0, runs: 32, wickets: 1, econ: "8.00" },
        { name: "Deepak Chahar", overs: "4.0", maidens: 0, runs: 41, wickets: 1, econ: "10.25" },
        { name: "Mitchell Santner", overs: "4.0", maidens: 0, runs: 38, wickets: 1, econ: "9.50" },
        { name: "Shardul Thakur", overs: "4.0", maidens: 0, runs: 45, wickets: 1, econ: "11.25" },
      ],
    },
    {
      team: "Chennai Super Kings",
      short: "CSK",
      total: "172/8",
      overs: "20.0",
      runRate: "8.60",
      batters: [
        { name: "Devon Conway", runs: 48, balls: 36, fours: 5, sixes: 1, sr: "133.3", out: "c Kishan b Bumrah" },
        { name: "Ruturaj Gaikwad", runs: 39, balls: 28, fours: 4, sixes: 1, sr: "139.3", out: "c Sharma b Pandya" },
        { name: "MS Dhoni", runs: 28, balls: 16, fours: 1, sixes: 3, sr: "175.0", out: "not out" },
        { name: "Ambati Rayudu", runs: 21, balls: 14, fours: 2, sixes: 1, sr: "150.0", out: "b Chahal" },
        { name: "Ravindra Jadeja", runs: 18, balls: 12, fours: 1, sixes: 1, sr: "150.0", out: "b Bumrah" },
      ],
      bowlers: [
        { name: "Jasprit Bumrah", overs: "4.0", maidens: 1, runs: 18, wickets: 2, econ: "4.50" },
        { name: "Hardik Pandya", overs: "4.0", maidens: 0, runs: 35, wickets: 2, econ: "8.75" },
        { name: "Yuzvendra Chahal", overs: "4.0", maidens: 0, runs: 29, wickets: 2, econ: "7.25" },
        { name: "Rohit Sharma", overs: "4.0", maidens: 0, runs: 41, wickets: 1, econ: "10.25" },
        { name: "Akash Madhwal", overs: "4.0", maidens: 0, runs: 49, wickets: 1, econ: "12.25" },
      ],
    },
  ],
};

const DEMO_PARTNERSHIP = [
  { wicket: "1st", runs: 82, balls: 52, batters: "Rohit & Kishan" },
  { wicket: "2nd", runs: 58, balls: 36, batters: "Rohit & SKY" },
  { wicket: "3rd", runs: 28, balls: 18, batters: "SKY & Tilak" },
  { wicket: "4th", runs: 12, balls: 8, batters: "SKY & Pandya" },
];

const DEMO_OVER_RUNS = [
  { over: 1, runs: 8 }, { over: 2, runs: 12 }, { over: 3, runs: 6 },
  { over: 4, runs: 9 }, { over: 5, runs: 14 }, { over: 6, runs: 11 },
  { over: 7, runs: 7 }, { over: 8, runs: 10 }, { over: 9, runs: 9 },
  { over: 10, runs: 13 }, { over: 11, runs: 8 }, { over: 12, runs: 11 },
  { over: 13, runs: 12 }, { over: 14, runs: 8 }, { over: 15, runs: 14 },
  { over: 16, runs: 10 }, { over: 17, runs: 9 }, { over: 18, runs: 12 },
  { over: 19, runs: 15 }, { over: 20, runs: 16 },
];

const DEMO_SQUAD = {
  "Mumbai Indians": [
    { name: "Rohit Sharma", role: "Batter (C)", jerseyNo: "45" },
    { name: "Ishan Kishan", role: "WK-Batter", jerseyNo: "32" },
    { name: "Suryakumar Yadav", role: "Batter", jerseyNo: "73" },
    { name: "Tilak Varma", role: "Batter", jerseyNo: "19" },
    { name: "Hardik Pandya", role: "All-rounder", jerseyNo: "228" },
    { name: "Tim David", role: "Batter", jerseyNo: "8" },
    { name: "Jasprit Bumrah", role: "Bowler", jerseyNo: "93" },
    { name: "Yuzvendra Chahal", role: "Bowler", jerseyNo: "10" },
    { name: "Akash Madhwal", role: "Bowler", jerseyNo: "77" },
    { name: "Piyush Chawla", role: "Bowler", jerseyNo: "52" },
    { name: "Tristan Stubbs", role: "Batter", jerseyNo: "56" },
  ],
  "Chennai Super Kings": [
    { name: "Devon Conway", role: "WK-Batter", jerseyNo: "13" },
    { name: "Ruturaj Gaikwad", role: "Batter (C)", jerseyNo: "31" },
    { name: "MS Dhoni", role: "WK-Batter", jerseyNo: "7" },
    { name: "Ambati Rayudu", role: "Batter", jerseyNo: "24" },
    { name: "Ravindra Jadeja", role: "All-rounder", jerseyNo: "8" },
    { name: "Deepak Chahar", role: "Bowler", jerseyNo: "90" },
    { name: "Maheesh Theekshana", role: "Bowler", jerseyNo: "23" },
    { name: "Mitchell Santner", role: "All-rounder", jerseyNo: "65" },
    { name: "Shardul Thakur", role: "All-rounder", jerseyNo: "54" },
    { name: "Prashant Solanki", role: "Bowler", jerseyNo: "22" },
    { name: "Kyle Jamieson", role: "Bowler", jerseyNo: "11" },
  ],
};

const DEMO_HEAD_TO_HEAD = [
  { date: "14 Apr 2024", home: "Mumbai Indians", homeScore: "168/6", away: "Chennai Super Kings", awayScore: "166/9", result: "MI won by 2 runs" },
  { date: "02 Apr 2024", home: "Chennai Super Kings", homeScore: "210/7", away: "Mumbai Indians", awayScore: "181/8", result: "CSK won by 29 runs" },
  { date: "18 Mar 2023", home: "Mumbai Indians", homeScore: "157/9", away: "Chennai Super Kings", awayScore: "161/6", result: "CSK won by 4 wkts" },
  { date: "21 Apr 2023", home: "Chennai Super Kings", homeScore: "188/9", away: "Mumbai Indians", awayScore: "189/4", result: "MI won by 6 wkts" },
  { date: "10 Apr 2022", home: "Mumbai Indians", homeScore: "155/7", away: "Chennai Super Kings", awayScore: "123/6", result: "MI won by 32 runs" },
];

type CricketTab = "scorecard" | "squads-wagon" | "head-to-head" | "standings";

const TABS: { id: CricketTab; label: string }[] = [
  { id: "scorecard", label: "Scorecard" },
  { id: "squads-wagon", label: "Squads & Wagon Wheel" },
  { id: "head-to-head", label: "Head to Head" },
  { id: "standings", label: "Standings" },
];

const FormDot = ({ r }: { r: string }) => {
  const bg = r === "W" ? "bg-emerald-500" : r === "L" ? "bg-rose-500" : "bg-slate-400";
  return <span className={`w-2 h-2 rounded-full inline-block ${bg}`} title={r} />;
};

// ─── Page component ───────────────────────────────────────────────────────────

const CricketGameInfo = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [activeTab, setActiveTab] = useState<CricketTab>("scorecard");
  const [isFav, setIsFav] = useState(false);
  const [activeScorecardInnings, setActiveScorecardInnings] = useState(0);
  const [activeSquadTeam, setActiveSquadTeam] = useState(0);
  const [copied, setCopied] = useState(false);

  const match = mockCricketMatches.find((m) => m.id === matchId) ?? mockCricketMatches[0];
  const standings = mockCricketStandings[match.leagueId] ?? [];
  const isLive = match.status === "Live";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  // ─── Hero banner ───────────────────────────────────────────────────────────
  const HeroBanner = () => (
    <div className="w-full mb-4 relative">
      <div className="grid h-64 md:h-72">
        {/* Background Layer */}
        <div className="col-start-1 row-start-1 w-full h-full bg-brand-primary">
          <div className="h-full w-full bg-cover bg-center relative">
            <div
              className="absolute blur-sm inset-0 pointer-events-none z-[1] opacity-50"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, var(--gameinfo-stripe-color, rgba(0,0,0,0.1)) 0px, var(--gameinfo-stripe-color, rgba(0,0,0,0.1)) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px)",
              }}
            />
          </div>
        </div>

        {/* Content Layer */}
        <div className="col-start-1 row-start-1 w-full relative z-[2] px-4 pt-6 pb-16 md:pt-8 md:pb-20">
          <div className="relative grid grid-cols-3 items-center">
            <button type="button" onClick={() => navigate("/cricket")} className="flex gap-4 items-center w-fit cursor-pointer text-left">
              <ArrowLeftIcon className="text-white h-5" />
              <p className="text-white hidden md:block">Back</p>
            </button>
            <div className="bg-brand-secondary md:opacity-100 opacity-0 font-semibold mb-2 items-center text-white py-1.5 px-4 rounded w-fit mx-auto">
              <span className="text-[12px]">{isLive ? "● Live" : match.status}</span>
            </div>
            <div className="flex gap-4 justify-end">
              <button type="button" onClick={() => setIsFav((v) => !v)} className="p-1.5 hover:opacity-80 transition-opacity">
                {isFav ? (
                  <StarSolidIcon className="h-5 w-5 text-amber-500" />
                ) : (
                  <StarIcon className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
                )}
              </button>
              <button type="button" onClick={copyLink} className="p-1.5 hover:opacity-80 transition-opacity">
                {copied ? <DocumentDuplicateIcon className="h-5 w-5 text-emerald-500" /> : <ShareIcon className="h-5 w-5 text-white/80 hover:text-white transition-colors" />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center text-white">
            <div className="flex justify-center items-center gap-6 leading-none tabular-nums tall-font text-[32px] md:text-[56px]">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xl md:text-2xl font-bold">{match.homeTeam.short}</p>
                {match.homeTeam.wickets && match.homeTeam.wickets !== "-" && (
                  <p className="text-xs text-white/60">{match.homeTeam.wickets}</p>
                )}
              </div>
              <div className="flex justify-center items-center gap-3">
                <p>{match.homeTeam.score}</p>
                <p className="text-[24px] md:text-[32px]">-</p>
                <p>{match.awayTeam.score}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-xl md:text-2xl font-bold">{match.awayTeam.short}</p>
                {match.awayTeam.wickets && match.awayTeam.wickets !== "-" && (
                  <p className="text-xs text-white/60">{match.awayTeam.wickets}</p>
                )}
              </div>
            </div>
            {match.result && (
              <p className="mt-4 text-[13px] font-medium opacity-90">{match.result}</p>
            )}
            <p className="mt-2 text-[11px] opacity-70">📍 {match.venue}</p>
          </div>
        </div>
      </div>

      <div className="flex z-10 h-12 w-full -mt-12 overflow-y-hidden overflow-x-auto bg-brand-p3 dark:bg-gray-800 backdrop-blur-2xl cursor-pointer sticky top-0 hide-scrollbar justify-start md:justify-center rounded-t-xl relative">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0 md:mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-orange-500 font-medium"
                  : "text-gray-600 dark:text-snow-200 hover:text-gray-800 dark:text-gray-400 dark:hover:text-brand-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Scorecard tab ─────────────────────────────────────────────────────────
  const ScorecardTab = () => {
    const innings = DEMO_SCORECARD.innings[activeScorecardInnings];
    
    const chartData = DEMO_OVER_RUNS.map((o, idx) => {
      const homeRuns = DEMO_OVER_RUNS.slice(0, idx + 1).reduce((sum, curr) => sum + curr.runs, 0);
      const awayRuns = DEMO_OVER_RUNS.slice(0, idx + 1).reduce((sum, curr) => sum + Math.max(0, curr.runs - 2 + (idx % 4)), 0);
      return {
        over: o.over,
        [match.homeTeam.short]: homeRuns,
        [match.awayTeam.short]: awayRuns,
      };
    });

    const inningsOptions = DEMO_SCORECARD.innings.map((inn, i) => ({
      value: String(i),
      label: `${inn.short ?? inn.team.split(" ").slice(-1)[0]} Innings`,
    }));

    return (
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Scorecard: 40% */}
        <div className="w-full lg:w-[40%] block-style !p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-snow-200 dark:border-[#1F2937]">
            <SegmentedSelector
              value={String(activeScorecardInnings)}
              options={inningsOptions}
              onChange={(v) => setActiveScorecardInnings(Number(v))}
              size="sm"
            />
          </div>
          <div className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-brand-secondary/5 to-transparent border-b border-snow-200 dark:border-[#1F2937]">
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Total</p>
                <p className="text-xl font-black text-[#23272A] dark:text-white">{innings.total}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Overs</p>
                <p className="font-bold text-[#23272A] dark:text-white">{innings.overs}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Run Rate</p>
                <p className="font-bold text-[#23272A] dark:text-white">{innings.runRate}</p>
              </div>
            </div>
            <div>
              <select
                value={activeScorecardInnings}
                onChange={(e) => setActiveScorecardInnings(Number(e.target.value))}
                className="bg-snow-100 dark:bg-white/5 border-none text-[11px] font-semibold text-[#23272A] dark:text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-secondary cursor-pointer"
              >
                <option value={0}>1st Inning</option>
                <option value={1}>2nd Inning</option>
              </select>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">Batting</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-neutral-400 dark:text-neutral-500 border-b border-snow-200 dark:border-[#1F2937]">
                    <th className="text-left pb-2 font-medium">Batter</th>
                    <th className="text-right pb-2 font-medium">R</th>
                    <th className="text-right pb-2 font-medium">B</th>
                    <th className="text-right pb-2 font-medium">4s</th>
                    <th className="text-right pb-2 font-medium">6s</th>
                    <th className="text-right pb-2 font-medium">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                  {innings.batters.map((b) => (
                    <tr key={b.name} className="hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-1.5 pr-4">
                        <p className="font-medium text-[#23272A] dark:text-white text-xs leading-none">{b.name}</p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-none mt-0.5">{b.out}</p>
                      </td>
                      <td className="text-right py-1.5 font-bold text-[#23272A] dark:text-white text-xs">{b.runs}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.balls}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.fours}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.sixes}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.sr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-5 pb-5 border-b border-snow-200 dark:border-[#1F2937]">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">Bowling</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-neutral-400 dark:text-neutral-500 border-b border-snow-200 dark:border-[#1F2937]">
                    <th className="text-left pb-2 font-medium">Bowler</th>
                    <th className="text-right pb-2 font-medium">O</th>
                    <th className="text-right pb-2 font-medium">M</th>
                    <th className="text-right pb-2 font-medium">R</th>
                    <th className="text-right pb-2 font-medium">W</th>
                    <th className="text-right pb-2 font-medium">Econ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                  {innings.bowlers.map((b) => (
                    <tr key={b.name} className="hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-1.5 pr-4 font-medium text-[#23272A] dark:text-white text-xs leading-none">{b.name}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.overs}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.maidens}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.runs}</td>
                      <td className="text-right py-1.5 font-bold text-brand-secondary text-xs">{b.wickets}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.econ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">Fall of Wickets</p>
            <div className="flex flex-wrap gap-2">
              {/* Dummy data for FOW since it's not in DEMO_SCORECARD currently */}
              {[
                { wkt: 1, runs: 12, over: "2.1", player: "Rohit" },
                { wkt: 2, runs: 45, over: "5.4", player: "Ishan" },
                { wkt: 3, runs: 88, over: "11.2", player: "Surya" },
                { wkt: 4, runs: 132, over: "15.5", player: "Hardik" },
              ].map((fow, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-snow-100 dark:bg-[#161B22] px-2 py-1 rounded text-xs">
                  <span className="font-bold text-[#23272A] dark:text-white">{fow.runs}-{fow.wkt}</span>
                  <span className="text-neutral-400 dark:text-neutral-500">({fow.player}, {fow.over})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Runs per Over Chart: 60% */}
        <div className="w-full lg:w-[60%] block-style !p-0 overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-snow-200 dark:border-[#1F2937] flex justify-between items-center">
            <p className="font-semibold text-[#23272A] dark:text-white">Runs per Over</p>
            <div className="w-44">
              <SegmentedSelector
                value={String(activeScorecardInnings)}
                options={[
                  { value: "0", label: "1st Inning" },
                  { value: "1", label: "2nd Inning" }
                ]}
                onChange={(v) => setActiveScorecardInnings(Number(v))}
                size="sm"
              />
            </div>
          </div>
          
          <div className="p-4" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="over" stroke="#888" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 11 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#161B22', border: '1px solid #1F2937', color: 'white', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey={match.homeTeam.short} stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey={match.awayTeam.short} stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="px-5 pb-5 mt-2 overflow-y-auto max-h-[400px] hide-scrollbar">
            <div className="space-y-2">
              {DEMO_OVER_RUNS.map((o) => {
                const maxRuns = Math.max(...DEMO_OVER_RUNS.map((r) => r.runs));
                return (
                  <div key={o.over} className="flex items-center justify-between text-sm border-b border-snow-200 dark:border-[#1F2937] py-1.5">
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs">Over {o.over}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 bg-snow-200 dark:bg-white/10 rounded-full w-24">
                        <div className="h-full bg-brand-secondary rounded-full" style={{ width: `${(o.runs / maxRuns) * 100}%` }} />
                      </div>
                      <span className="font-bold text-[#23272A] dark:text-white w-6 text-right">{o.runs}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };



  // ─── Squads & Wagon Wheel tab ──────────────────────────────────────────────
  const SquadsWagonTab = () => {
    const teams = [match.homeTeam.name, match.awayTeam.name];
    const homeSquad = DEMO_SQUAD[teams[0] as keyof typeof DEMO_SQUAD] ?? [];
    const awaySquad = DEMO_SQUAD[teams[1] as keyof typeof DEMO_SQUAD] ?? [];
    const maxLen = Math.max(homeSquad.length, awaySquad.length);
    return (
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Wagon Wheel: 40% */}
        <div className="w-full lg:w-[40%] block-style !p-0 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
            <p className="font-semibold text-[#23272A] dark:text-white">Wagon Wheel</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Detailed shot placement</p>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[#f4f5f7] dark:bg-[#12161b] relative min-h-[300px]">
            <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-auto drop-shadow-lg">
              {/* Field Background */}
              <circle cx="150" cy="150" r="140" fill="#2d6a4f" stroke="#40916c" strokeWidth="2" />
              
              {/* 30 Yard Circle */}
              <circle cx="150" cy="150" r="65" fill="none" stroke="#40916c" strokeDasharray="4 4" strokeWidth="1.5" />
              
              {/* Pitch */}
              <rect x="144" y="120" width="12" height="60" fill="#e6ccb2" rx="1" />
              {/* Creases */}
              <line x1="140" y1="128" x2="160" y2="128" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
              <line x1="140" y1="172" x2="160" y2="172" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
              {/* Stumps */}
              <circle cx="150" cy="122" r="1.5" fill="#a68a64" />
              <circle cx="150" cy="178" r="1.5" fill="#a68a64" />

              {/* Shot vectors */}
              {/* 4s (Blue) */}
              <line x1="150" y1="150" x2="50" y2="80" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="50" cy="80" r="3" fill="#3b82f6" />
              
              <line x1="150" y1="150" x2="250" y2="70" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="250" cy="70" r="3" fill="#3b82f6" />
              
              {/* 6s (Orange) */}
              <line x1="150" y1="150" x2="250" y2="250" stroke="#f97316" strokeWidth="2.5" />
              <circle cx="250" cy="250" r="4" fill="#f97316" />
              
              <line x1="150" y1="150" x2="70" y2="240" stroke="#f97316" strokeWidth="2.5" />
              <circle cx="70" cy="240" r="4" fill="#f97316" />
              
              {/* 1s, 2s (White/Gray) */}
              <line x1="150" y1="150" x2="100" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="100" cy="120" r="2" fill="#94a3b8" />
              
              <line x1="150" y1="150" x2="120" y2="200" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="120" cy="200" r="2" fill="#94a3b8" />
              
              {/* Labels */}
              <text x="150" y="25" textAnchor="middle" fontSize="10" fill="#fefae0" opacity="0.9" fontWeight="500">Third Man</text>
              <text x="150" y="285" textAnchor="middle" fontSize="10" fill="#fefae0" opacity="0.9" fontWeight="500">Fine Leg</text>
              <text x="25" y="153" textAnchor="middle" fontSize="10" fill="#fefae0" opacity="0.9" fontWeight="500">Cover</text>
              <text x="275" y="153" textAnchor="middle" fontSize="10" fill="#fefae0" opacity="0.9" fontWeight="500">Square Leg</text>
            </svg>
            
            <div className="w-full max-w-[280px] grid grid-cols-3 gap-2 mt-6">
              <div className="bg-white dark:bg-[#1e2328] rounded p-2 text-center border border-snow-200 dark:border-white/5 shadow-sm">
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Off Side</div>
                <div className="text-sm font-bold text-[#23272A] dark:text-white">45%</div>
              </div>
              <div className="bg-white dark:bg-[#1e2328] rounded p-2 text-center border border-snow-200 dark:border-white/5 shadow-sm">
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Straight</div>
                <div className="text-sm font-bold text-[#23272A] dark:text-white">20%</div>
              </div>
              <div className="bg-white dark:bg-[#1e2328] rounded p-2 text-center border border-snow-200 dark:border-white/5 shadow-sm">
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Leg Side</div>
                <div className="text-sm font-bold text-[#23272A] dark:text-white">35%</div>
              </div>
            </div>
            
            <div className="flex gap-4 text-[10px] text-neutral-500 dark:text-neutral-400 mt-4 font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#f97316] inline-block" /> Sixes</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#3b82f6] inline-block" /> Fours</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#94a3b8] inline-block" /> 1s & 2s</span>
            </div>
          </div>
        </div>

        {/* Squad: 60% — both teams side by side */}
        <div className="w-full lg:w-[60%] block-style !p-0 overflow-hidden flex flex-col">
          {/* Header row with both team names */}
          <div className="grid grid-cols-2 border-b border-snow-200 dark:border-[#1F2937]">
            <div className="px-3 py-2.5 text-center">
              <p className="text-xs font-semibold text-[#23272A] dark:text-white">{match.homeTeam.short}</p>
            </div>
            <div className="px-3 py-2.5 text-center border-l border-snow-200 dark:border-[#1F2937]">
              <p className="text-xs font-semibold text-[#23272A] dark:text-white">{match.awayTeam.short}</p>
            </div>
          </div>
          {/* Player rows — home on left, away on right */}
          <div className="divide-y divide-snow-200 dark:divide-[#1F2937] flex-1">
            {Array.from({ length: maxLen }).map((_, i) => {
              const home = homeSquad[i];
              const away = awaySquad[i];
              return (
                <div key={i} className="grid grid-cols-2">
                  {/* Home player */}
                  {home ? (
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                      <div className="h-7 w-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-[9px] font-bold text-brand-secondary shrink-0">
                        {home.jerseyNo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#23272A] dark:text-white truncate leading-none">{home.name}</p>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate leading-none mt-0.5">{home.role}</p>
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                  {/* Away player */}
                  {away ? (
                    <div className="flex items-center gap-3 px-4 py-2.5 border-l border-snow-200 dark:border-[#1F2937] hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                      <div className="h-7 w-7 rounded-full bg-indigo-500/10 flex items-center justify-center text-[9px] font-bold text-indigo-500 shrink-0">
                        {away.jerseyNo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#23272A] dark:text-white truncate leading-none">{away.name}</p>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate leading-none mt-0.5">{away.role}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-l border-snow-200 dark:border-[#1F2937]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ─── Head to head tab ─────────────────────────────────────────────────────
  const HeadToHeadTab = () => {
    const wins = {
      home: DEMO_HEAD_TO_HEAD.filter((m) => m.result.startsWith("MI")).length,
      away: DEMO_HEAD_TO_HEAD.filter((m) => m.result.startsWith("CSK")).length,
    };
    return (
      <div className="block-style !p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
          <p className="font-semibold text-[#23272A] dark:text-white">Head to Head</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Last {DEMO_HEAD_TO_HEAD.length} meetings</p>
        </div>
        {/* Summary bar */}
        <div className="grid grid-cols-3 text-center py-4 border-b border-snow-200 dark:border-[#1F2937] px-5">
          <div>
            <p className="text-2xl font-black text-[#23272A] dark:text-white">{wins.home}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{match.homeTeam.short} Wins</p>
          </div>
          <div>
            <p className="text-2xl font-black text-neutral-400">{DEMO_HEAD_TO_HEAD.length}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Played</p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#23272A] dark:text-white">{wins.away}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{match.awayTeam.short} Wins</p>
          </div>
        </div>
        {/* bar */}
        <div className="px-5 py-3 border-b border-snow-200 dark:border-[#1F2937]">
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="bg-brand-secondary h-full transition-all" style={{ width: `${(wins.home / DEMO_HEAD_TO_HEAD.length) * 100}%` }} />
            <div className="bg-rose-500 h-full transition-all flex-1" />
          </div>
        </div>
        {/* Past results */}
        <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
          {DEMO_HEAD_TO_HEAD.map((h, i) => (
            <div key={i} className="px-5 py-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[#23272A] dark:text-white">{h.home}</span>
                    <span className="font-bold text-[#23272A] dark:text-white">{h.homeScore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">{h.away}</span>
                    <span className="text-neutral-500 dark:text-neutral-400">{h.awayScore}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{h.date}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${h.result.includes(match.homeTeam.short.slice(0,2)) ? "bg-brand-secondary/15 text-brand-secondary" : "bg-rose-500/15 text-rose-500"}`}>
                  {h.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── Standings tab ─────────────────────────────────────────────────────────
  const StandingsTab = () => (
    <div className="block-style !p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
        <p className="font-semibold text-[#23272A] dark:text-white">{match.league} — Standings</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-neutral-400 dark:text-neutral-500 border-b border-snow-200 dark:border-[#1F2937]">
              <th className="text-left px-5 py-2 font-medium">#</th>
              <th className="text-left py-2 font-medium">Team</th>
              <th className="text-center py-2 font-medium">P</th>
              <th className="text-center py-2 font-medium">W</th>
              <th className="text-center py-2 font-medium">L</th>
              <th className="text-center py-2 font-medium">Pts</th>
              <th className="text-center py-2 font-medium">NRR</th>
              <th className="text-center pr-5 py-2 font-medium">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-snow-200 dark:divide-[#1F2937]">
            {standings.map((s) => {
              const isInMatch = s.team === match.homeTeam.name || s.team === match.awayTeam.name;
              return (
                <tr key={s.team} className={`transition-colors ${isInMatch ? "bg-brand-secondary/5 dark:bg-brand-secondary/10" : "hover:bg-snow-50 dark:hover:bg-white/5"}`}>
                  <td className="px-5 py-3 text-neutral-500 dark:text-neutral-400">{s.position}</td>
                  <td className="py-3 pr-4">
                    <span className={`font-medium ${isInMatch ? "text-brand-secondary" : "text-[#23272A] dark:text-white"}`}>{s.team}</span>
                  </td>
                  <td className="text-center py-3 text-neutral-500 dark:text-neutral-400">{s.played}</td>
                  <td className="text-center py-3 text-neutral-500 dark:text-neutral-400">{s.won}</td>
                  <td className="text-center py-3 text-neutral-500 dark:text-neutral-400">{s.lost}</td>
                  <td className="text-center py-3 font-bold text-[#23272A] dark:text-white">{s.points}</td>
                  <td className={`text-center py-3 text-xs ${s.nrr.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>{s.nrr}</td>
                  <td className="text-center pr-5 py-3">
                    <div className="flex gap-1 justify-center">
                      {s.form.split("").map((r, i) => <FormDot key={i} r={r} />)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case "scorecard":       return <ScorecardTab />;
      case "squads-wagon":    return <SquadsWagonTab />;
      case "head-to-head":    return <HeadToHeadTab />;
      case "standings":       return <StandingsTab />;
      default:                return null;
    }
  };

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />

      <div className="w-full">
        <HeroBanner />
        <div className="page-padding-x py-6 flex flex-col gap-4">
          {renderTab()}
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default CricketGameInfo;
