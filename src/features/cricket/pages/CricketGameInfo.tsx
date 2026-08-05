import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import Image from "@/components/common/Image";

import { SegmentedSelector } from "@/components/ui/SegmentedSelector";
import { getCricketMatchById } from "@/lib/api/cricket";
import { CricketStandingsTable } from "../components/CricketStandingsTable";
import type { CricketMatchDetailResponse } from "../types";
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
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

// ─── Demo data for deeper match details ──────────────────────────────────────

const DEMO_OVER_RUNS = [
  { over: 1, runs: 8 }, { over: 2, runs: 12 }, { over: 3, runs: 6 },
  { over: 4, runs: 9 }, { over: 5, runs: 14 }, { over: 6, runs: 11 },
  { over: 7, runs: 7 }, { over: 8, runs: 10 }, { over: 9, runs: 9 },
  { over: 10, runs: 13 }, { over: 11, runs: 8 }, { over: 12, runs: 11 },
  { over: 13, runs: 12 }, { over: 14, runs: 8 }, { over: 15, runs: 14 },
  { over: 16, runs: 10 }, { over: 17, runs: 9 }, { over: 18, runs: 12 },
  { over: 19, runs: 15 }, { over: 20, runs: 16 },
];



type CricketTab = "match-info" | "commentary" | "scorecard" | "stats" | "squads-wagon" | "standings";

const TABS: { id: CricketTab; label: string }[] = [
  { id: "scorecard", label: "Scorecard" },
  { id: "stats", label: "Stats" },
  { id: "squads-wagon", label: "Squads & Wagon Wheel" },
  { id: "commentary", label: "Commentary" },
  { id: "standings", label: "Standings" },
  { id: "match-info", label: "Match Info" },
];


// ─── Page component ───────────────────────────────────────────────────────────

const CricketGameInfo = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [activeTab, setActiveTab] = useState<CricketTab>("scorecard");
  const [isFav, setIsFav] = useState(false);
  const [activeScorecardInnings, setActiveScorecardInnings] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedOver, setSelectedOver] = useState<string | null>(null);
  const [activeCommentaryInnings, setActiveCommentaryInnings] = useState(0);

  const [matchData, setMatchData] = useState<CricketMatchDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    setIsLoading(true);
    getCricketMatchById(matchId)
      .then((data) => {
        setMatchData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [matchId]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (isLoading) {
    return (
      <div className="dark:bg-[#0D1117] min-h-screen flex flex-col">
        <PageHeader />
        <div className="flex-1 flex justify-center items-center text-white">Loading Match Data...</div>
        <FooterComp />
      </div>
    );
  }

  if (!matchData?.responseObject?.item?.fixture) {
    return (
      <div className="dark:bg-[#0D1117] min-h-screen flex flex-col">
        <PageHeader />
        <div className="flex-1 flex justify-center items-center text-white">Match not found</div>
        <FooterComp />
      </div>
    );
  }

  const fixture = matchData.responseObject.item.fixture;
  const live = matchData.responseObject.item.live;
  const isLive = fixture.status === "Live" || fixture.status === "In Progress";


  // ─── Hero banner ───────────────────────────────────────────────────────────
  const HeroBanner = () => (
    <div className="grid">
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
            <div className="flex justify-center items-center">
              {/* Optional center element (e.g., tournament name) */}
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
            <div className="flex justify-center items-center gap-4 md:gap-10">
              <div className="flex flex-col items-center gap-3 w-28 md:w-48 text-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full p-2 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                  <Image src={fixture.localteam.image_url} alt={fixture.localteam.name} className="w-full h-full object-contain" />
                </div>
                <p className="text-sm md:text-xl font-bold leading-tight line-clamp-2">{fixture.localteam.name}</p>
              </div>
              
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <div className="flex justify-center items-center gap-3 tabular-nums tall-font text-[32px] md:text-[56px] font-bold leading-none">
                  <p>{fixture.localteam.totalscore || "-"}</p>
                  <p className="text-[24px] md:text-[32px] opacity-70">-</p>
                  <p>{fixture.visitorteam.totalscore || "-"}</p>
                </div>
                <div className="bg-brand-secondary/90 backdrop-blur font-semibold text-white py-1 md:py-1.5 px-3 md:px-5 rounded-full text-[10px] md:text-xs shadow-md uppercase tracking-wider border border-white/20">
                  {isLive ? "● Live" : fixture.status}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 w-28 md:w-48 text-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full p-2 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                  <Image src={fixture.visitorteam.image_url} alt={fixture.visitorteam.name} className="w-full h-full object-contain" />
                </div>
                <p className="text-sm md:text-xl font-bold leading-tight line-clamp-2">{fixture.visitorteam.name}</p>
              </div>
            </div>
            
            {(() => {
              const postMsg = (fixture as any).note?.post || (fixture.raw as any)?.note?.post || fixture.comment?.post || (fixture.raw as any)?.matchinfo?.info?.post || (fixture.raw as any)?.matchinfo?.info?.note?.post;
              if (!postMsg) return null;
              return (
                <p className="mt-6 text-[13px] font-medium opacity-90 text-center max-w-2xl bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm">{postMsg}</p>
              );
            })()}
            {(() => {
              const tossWinnerId = (fixture as any).note?.toss_winner_teamId || (fixture.raw as any)?.note?.toss_winner_teamId || fixture.toss_winner_team_id || (fixture.raw as any)?.matchinfo?.info?.toss_winner_teamId || (fixture.raw as any)?.matchinfo?.info?.note?.toss_winner_teamId;
              if (tossWinnerId) {
                const tossWinnerStr = String(tossWinnerId) === String(fixture.localteam.id)
                  ? fixture.localteam.name 
                  : (String(tossWinnerId) === String(fixture.visitorteam.id) ? fixture.visitorteam.name : "");
                if (tossWinnerStr) {
                   return <p className="mt-2 text-[12px] font-medium opacity-90 text-center max-w-2xl text-amber-400">{tossWinnerStr} won the toss</p>;
                }
              }
              return null;
            })()}
            <p className="mt-3 text-[11px] opacity-80 flex items-center gap-1">📍 {fixture.venue}</p>
          </div>
        </div>
    </div>
  );

  // ─── Match Info tab ────────────────────────────────────────────────────────
  const MatchInfoTab = () => {
    const matchInfo = fixture.raw?.matchinfo?.info || [];
    
    let tossWinnerStr = "N/A";
    if (fixture.toss_winner_team_id === fixture.localteam.id) {
       tossWinnerStr = `${fixture.localteam.name} won the toss`;
    } else if (fixture.toss_winner_team_id === fixture.visitorteam.id) {
       tossWinnerStr = `${fixture.visitorteam.name} won the toss`;
    }

    const motm = fixture.man_of_match;

    return (
      <div className="w-full lg:w-[60%] block-style !p-0 overflow-hidden mx-auto">
        <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
          <p className="font-semibold text-[#23272A] dark:text-white">Match Details</p>
        </div>
        <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
          <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium w-32 uppercase tracking-wider">Format</span>
            <span className="text-sm font-semibold text-[#23272A] dark:text-white flex-1">{fixture.match_format || "N/A"}</span>
          </div>
          <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium w-32 uppercase tracking-wider">Status</span>
            <span className="text-sm font-semibold text-[#23272A] dark:text-white flex-1">{fixture.status || "N/A"}</span>
          </div>
          <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium w-32 uppercase tracking-wider">Date</span>
            <span className="text-sm font-semibold text-[#23272A] dark:text-white flex-1">{fixture.match_date} at {fixture.match_time}</span>
          </div>
          
          <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium w-32 uppercase tracking-wider">Toss</span>
            <span className="text-sm font-semibold text-[#23272A] dark:text-white flex-1">{tossWinnerStr}</span>
          </div>

          {motm && motm.name && motm.name !== "Man Of Match" && (
            <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium w-32 uppercase tracking-wider">Player of Match</span>
              <div className="flex-1 flex items-center gap-3">
                {motm.image_url ? (
                   <img src={motm.image_url} alt={motm.name} className="w-8 h-8 rounded-full object-cover bg-snow-200 dark:bg-[#1F2937]" />
                ) : (
                   <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-xs font-bold text-brand-secondary">
                     {motm.name.charAt(0)}
                   </div>
                )}
                <span className="text-sm font-semibold text-[#23272A] dark:text-white">{motm.name}</span>
              </div>
            </div>
          )}

          {fixture.comment?.post && (
             <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
               <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium w-32 uppercase tracking-wider">Result</span>
               <span className="text-sm font-semibold text-brand-secondary flex-1">{fixture.comment.post}</span>
             </div>
          )}
          {matchInfo.map((info: any, i: number) => {
            if (!info.value) return null;
            if (info.name === "Toss" || info.name === "Man Of Match") return null; // We handled these
            return (
              <div key={i} className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium w-32 uppercase tracking-wider">{info.name}</span>
                <span className="text-sm font-semibold text-[#23272A] dark:text-white flex-1">{info.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Commentary tab ────────────────────────────────────────────────────────

  const getPlayer = (id: string) => {
    const localPlayer = live?.lineups?.localteam?.player?.find((p: any) => p.profileid === id);
    if (localPlayer) return localPlayer;
    return live?.lineups?.visitorteam?.player?.find((p: any) => p.profileid === id);
  };

  const CommentaryTab = () => {
    let commentaries = live?.commentaries || [];
    const inningsList = live?.innings || [];
    const currentInning = inningsList[activeCommentaryInnings];

    if (commentaries.length === 0 || !currentInning) {
      return (
        <div className="w-full lg:w-[60%] block-style !p-0 mx-auto">
           <div className="p-8 text-center text-neutral-500">Commentary not available yet.</div>
        </div>
      );
    }

    const currentBattingTeam = currentInning.team; // 'localteam' | 'visitorteam'
    const getTeamForPlayer = (id: string) => {
       if (live?.lineups?.localteam?.player?.some((p: any) => p.profileid === id)) return 'localteam';
       if (live?.lineups?.visitorteam?.player?.some((p: any) => p.profileid === id)) return 'visitorteam';
       return null;
    };

    const filteredCommentaries = commentaries.filter((c: any) => getTeamForPlayer(c.batsman_id) === currentBattingTeam);

    // Group by Over logic
    const groupedCommentaries = filteredCommentaries.reduce((acc: any, c: any) => {
      const overStr = c.over;
      if (!overStr) return acc;
      const overNum = Math.floor(parseFloat(overStr));
      if (!acc[overNum]) acc[overNum] = [];
      acc[overNum].push(c);
      return acc;
    }, {});

    const sortedOvers = Object.keys(groupedCommentaries).sort((a, b) => Number(b) - Number(a));

    const inningsOptions = inningsList.map((inn, i) => ({
      value: String(i),
      label: inn.name,
    }));

    const battingTeamInfo = currentBattingTeam === "localteam" ? fixture.localteam : fixture.visitorteam;
    const bowlingTeamInfo = currentBattingTeam === "localteam" ? fixture.visitorteam : fixture.localteam;

    return (
      <div className="w-full lg:w-[70%] block-style !p-0 overflow-hidden mx-auto">
        {/* Header */}
        <div className="px-5 py-3 border-b border-snow-200 dark:border-[#1F2937] flex justify-between items-center bg-snow-50 dark:bg-white/5">
          <h2 className="font-semibold text-[#23272A] dark:text-white text-lg">Play-by-Play</h2>
          <div className="w-44">
             <SegmentedSelector
               value={String(activeCommentaryInnings)}
               options={inningsOptions}
               onChange={(v) => setActiveCommentaryInnings(Number(v))}
               size="sm"
             />
          </div>
        </div>

        {/* Top Indicator */}
        <div className="p-4 border-b border-snow-200 dark:border-[#1F2937]">
           <div className="flex items-center gap-4">
              <div className="flex-1 bg-snow-200 dark:bg-white/5 rounded-full h-8 flex items-center justify-center p-1">
                 <img src={battingTeamInfo.image_url} className="h-full rounded-full" />
              </div>
              <div className="flex-1 bg-snow-200 dark:bg-white/5 rounded-full h-8 flex items-center justify-center p-1 opacity-50">
                 <img src={bowlingTeamInfo.image_url} className="h-full rounded-full" />
              </div>
           </div>
           <div className="flex items-center gap-3 mt-4">
              <img src={battingTeamInfo.image_url} className="w-10 h-10 rounded-full bg-snow-200 dark:bg-white/10" />
              <div>
                 <p className="font-semibold text-[#23272A] dark:text-white leading-tight">{battingTeamInfo.name}</p>
                 <p className="text-neutral-500 text-xs">{currentInning.name}</p>
              </div>
           </div>
        </div>

        <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
          {sortedOvers.map((overNum) => {
            const balls = groupedCommentaries[overNum];
            const sortedBalls = [...balls].sort((a: any, b: any) => parseFloat(a.over) - parseFloat(b.over));
            
            const overRuns = balls.reduce((sum: number, c: any) => sum + parseInt(c.runs || '0') + parseInt(c.wides || '0') + parseInt(c.noballs || '0') + parseInt(c.byes || '0') + parseInt(c.legbyes || '0'), 0);
            
            const bowlerIds = [...new Set(balls.map((b: any) => b.bowler_id))];
            const batterIds = [...new Set(balls.map((b: any) => b.batsman_id))];
            
            const bowlers = bowlerIds.map((id: any) => getPlayer(id)).filter(Boolean);
            const batters = batterIds.map((id: any) => getPlayer(id)).filter(Boolean);
            const bowlerNames = bowlers.map(b => b?.name).join(' & ');
            const batterNames = batters.map(b => b?.name).join(' & ');

            return (
              <div 
                key={overNum} 
                className="p-5 flex items-stretch gap-4 hover:bg-snow-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => setSelectedOver(overNum)}
              >
                {/* Bowler Avatar (Left) */}
                <div className="flex flex-col items-center justify-center w-14 shrink-0">
                  <p className="font-semibold text-[#23272A] dark:text-white text-sm mb-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">Over {Number(overNum) + 1}</p>
                  <div className="relative">
                     {bowlers[0]?.image_url ? (
                        <img src={bowlers[0].image_url} className="w-10 h-10 rounded-full object-cover bg-snow-200 dark:bg-white/10 ring-2 ring-white dark:ring-[#12161b]" />
                     ) : (
                        <div className="w-10 h-10 rounded-full bg-snow-200 dark:bg-white/10 flex items-center justify-center font-semibold text-[#23272A] dark:text-white text-xs ring-2 ring-white dark:ring-[#12161b]">
                          {bowlers[0]?.name?.charAt(0) || '?'}
                        </div>
                     )}
                  </div>
                </div>

                {/* Center Content */}
                <div className="flex-1 flex flex-col justify-center items-center">
                   <p className="font-semibold text-[#23272A] dark:text-white text-xs md:text-sm mb-3 text-center">
                     {bowlerNames} <span className="text-neutral-500 font-normal mx-1">to</span> {batterNames}
                   </p>
                   <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {sortedBalls.map((c: any, idx: number) => {
                         const isFour = c.isFour === "True";
                         const isSix = c.isSix === "True";
                         const isWicket = c.isWicket === "True";
                         const runs = parseInt(c.runs || '0');
                         
                         let label = runs.toString();
                         let bgClass = "bg-[#4ade80] text-[#12161b]"; // green for runs 1, 2, 3
                         
                         if (isWicket) {
                            label = "W";
                            bgClass = "bg-[#ef4444] text-white"; // red
                         } else if (isSix) {
                            label = "6";
                            bgClass = "bg-[#a855f7] text-white"; // purple
                         } else if (isFour) {
                            label = "4";
                            bgClass = "bg-[#3b82f6] text-white"; // blue
                         } else if (c.byes !== "0" || c.legbyes !== "0") {
                            label = `B${runs}`;
                            bgClass = "bg-[#eab308] text-[#12161b]"; // yellow
                         } else if (c.wides !== "0" || c.noballs !== "0") {
                            label = c.wides !== "0" ? "Wd" : "Nb";
                            bgClass = "bg-[#64748b] text-white"; // slate
                         } else if (runs === 0) {
                            bgClass = "bg-[#64748b] text-white"; // slate
                         }

                         return (
                           <div key={idx} className={`w-7 h-6 rounded-sm flex items-center justify-center text-xs font-bold ${bgClass}`}>
                             {label}
                           </div>
                         );
                      })}
                   </div>
                </div>

                {/* Batters Avatar (Right) */}
                <div className="flex flex-col items-center justify-center w-14 shrink-0">
                  <p className="font-semibold text-[#23272A] dark:text-white text-sm mb-2 whitespace-nowrap">{overRuns} Runs</p>
                  <div className="flex justify-center">
                     {batters.map((b, i) => (
                        <div key={b?.profileid || i} className={`relative ${i > 0 ? '-ml-3' : ''} z-[${10 - i}]`}>
                           {b?.image_url ? (
                              <img src={b.image_url} className="w-10 h-10 rounded-full object-cover bg-snow-200 dark:bg-white/10 ring-2 ring-white dark:ring-[#12161b]" />
                           ) : (
                              <div className="w-10 h-10 rounded-full bg-snow-200 dark:bg-white/10 flex items-center justify-center font-semibold text-[#23272A] dark:text-white text-xs ring-2 ring-white dark:ring-[#12161b]">
                                {b?.name?.charAt(0) || '?'}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Scorecard tab ─────────────────────────────────────────────────────────
  const ScorecardTab = () => {
    const inningsList = live?.innings || [];
    const innings = inningsList[activeScorecardInnings];
    


    if (!innings) {
      return <div className="p-8 text-center text-neutral-500">Scorecard data not available yet.</div>;
    }

    const inningsOptions = inningsList.map((inn, i) => ({
      value: String(i),
      label: inn.name,
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
                <p className="text-xl font-black text-[#23272A] dark:text-white">{innings.total.tot}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Run Rate</p>
                <p className="font-bold text-[#23272A] dark:text-white">{innings.total.rr || "-"}</p>
              </div>
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
                  {innings.batsmanstats?.player?.map((b: any, idx: number) => (
                    <tr key={idx} className="hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-1.5 pr-4">
                        <div className="flex items-center gap-2 py-1">
                          {b.image_url ? (
                            <img src={b.image_url} alt={b.batsman} className="w-7 h-7 rounded-full object-cover bg-snow-200 dark:bg-white/10 shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-[10px] font-bold text-brand-secondary shrink-0">
                              {b.batsman.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            <p className="font-medium text-[#23272A] dark:text-white text-xs leading-none">{b.batsman}</p>
                            <div className="flex items-center gap-1">
                               {b.dismissal_fielders?.dismissal_fielder?.image_url && (
                                 <img src={b.dismissal_fielders.dismissal_fielder.image_url} alt="Fielder" className="w-3.5 h-3.5 rounded-full object-cover bg-snow-200 dark:bg-white/10 shrink-0" />
                               )}
                               <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-none">{b.status}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-1.5 font-bold text-[#23272A] dark:text-white text-xs">{b.r}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.b}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.s4}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.s6}</td>
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
                  {innings.bowlers?.player?.map((b: any, idx: number) => (
                    <tr key={idx} className="hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-1.5 pr-4">
                        <div className="flex items-center gap-2 py-1">
                          {b.image_url ? (
                            <img src={b.image_url} alt={b.bowler} className="w-7 h-7 rounded-full object-cover bg-snow-200 dark:bg-white/10 shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-500 shrink-0">
                              {b.bowler.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-[#23272A] dark:text-white text-xs leading-none">{b.bowler}</span>
                        </div>
                      </td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.o}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.m}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.r}</td>
                      <td className="text-right py-1.5 font-bold text-brand-secondary text-xs">{b.w}</td>
                      <td className="text-right py-1.5 text-neutral-500 dark:text-neutral-400 text-xs">{b.er}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">Fall of Wickets Timeline</p>
            
            {/* Horizontal Visual Timeline */}
            <div className="mb-6 relative">
               <div className="absolute top-[5px] left-0 right-0 h-0.5 bg-snow-200 dark:bg-[#1F2937]" />
               <div className="flex justify-between relative z-10 w-full overflow-x-auto hide-scrollbar pb-2">
                  {live?.wickets?.filter((w: any) => w.inning === innings.inningnum).map((w: any, i: number) => (
                    <div key={i} className="flex flex-col items-center flex-shrink-0" style={{ width: '60px' }}>
                      <div className="w-3 h-3 bg-brand-secondary rounded-full mb-2" />
                      <div className="text-[10px] font-bold text-[#23272A] dark:text-white text-center leading-none">{w.runs}/{w.wickets}</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 text-center leading-none mt-1">{w.overs}</div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Vertically scrollable timeline */}
            <div className="max-h-[200px] overflow-y-auto hide-scrollbar">
              <div className="relative pl-3 border-l-2 border-snow-200 dark:border-[#1F2937] ml-2 flex flex-col gap-4">
                {live?.wickets?.filter((w: any) => w.inning === innings.inningnum).map((w: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-white dark:ring-[#0D1117]" />
                    <div>
                      <div className="flex items-baseline gap-2">
                         <span className="font-bold text-[#23272A] dark:text-white text-sm">{w.runs}/{w.wickets}</span>
                         <span className="text-xs text-neutral-400 dark:text-neutral-500">{w.overs} Overs</span>
                      </div>
                      <div className="text-sm font-medium mt-0.5 text-[#23272A] dark:text-white">{w.player}</div>
                      {/* Assuming dismissal info is within batsmentstats for this player */}
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                         {innings.batsmanstats?.player?.find((b: any) => b.batsman === w.player)?.status || "Out"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {innings.partnerships && innings.partnerships.length > 0 && (
             <div className="px-5 py-4 border-t border-snow-200 dark:border-[#1F2937]">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">Partnerships</p>
                <div className="flex flex-col gap-2">
                   {innings.partnerships.map((p: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-snow-50 dark:bg-[#161B22] p-2.5 rounded-lg text-xs">
                         <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-snow-200 dark:bg-white/10 flex items-center justify-center font-bold text-[#23272A] dark:text-white">{p.wicket}</div>
                            <span className="font-medium text-[#23272A] dark:text-white">Wicket</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <span className="font-bold text-[#23272A] dark:text-white text-sm">{p.runs}</span>
                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{p.balls} balls</span>
                         </div>
                         <div className="text-right">
                            <span className="font-medium text-[#23272A] dark:text-white max-w-[100px] truncate block">{p.batters}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>

        {/* AI Overview & Top Scorers: 60% */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4">
          {(() => {
            const matchSummary = (() => {
               const tossTeam = fixture.toss_winner_team_id === fixture.localteam.id ? fixture.localteam.name : (fixture.toss_winner_team_id === fixture.visitorteam.id ? fixture.visitorteam.name : null);
               const tossInfo = tossTeam ? `${tossTeam} won the toss.` : "";
               
               let inningsSummary = "";
               if (live?.innings && live.innings.length > 0) {
                  const inn1 = live.innings[0];
                  const inn1TeamName = inn1.team === "localteam" ? fixture.localteam.name : fixture.visitorteam.name;
                  inningsSummary += `${inn1TeamName} posted a total of ${inn1.total?.tot || 0}. `;
                  
                  if (live.innings.length > 1) {
                     const inn2 = live.innings[1];
                     const inn2TeamName = inn2.team === "localteam" ? fixture.localteam.name : fixture.visitorteam.name;
                     inningsSummary += `In response, ${inn2TeamName} ${fixture.status === "Finished" ? "finished their innings at" : "are currently at"} ${inn2.total?.tot || 0}.`;
                  } else {
                     const team2Name = inn1.team === "localteam" ? fixture.visitorteam.name : fixture.localteam.name;
                     inningsSummary += `In reply, ${team2Name} are yet to bat.`;
                  }
               }
               
               const comment = fixture.comment?.post || "";
               
               return `${tossInfo} ${inningsSummary} ${comment}`.trim() || "Match summary is not available at the moment.";
            })();

            let topBatter = { name: "N/A", runs: -1, balls: 0, image: null as string | null };
            let fastestSR = { name: "N/A", sr: -1, image: null as string | null };
            let bestBowler = { name: "N/A", w: -1, r: 999, image: null as string | null };
            let bestEcon = { name: "N/A", econ: 999, image: null as string | null };

            live?.innings?.forEach(inn => {
               inn.batsmanstats?.player?.forEach((b: any) => {
                  const r = parseInt(b.r || "0");
                  const sr = parseFloat(b.sr || "0");
                  if (r > topBatter.runs) topBatter = { name: b.batsman, runs: r, balls: parseInt(b.b || "0"), image: b.image_url };
                  if (parseInt(b.b || "0") >= 15 && sr > fastestSR.sr) fastestSR = { name: b.batsman, sr, image: b.image_url };
               });
               inn.bowlers?.player?.forEach((b: any) => {
                  const w = parseInt(b.w || "0");
                  const r = parseInt(b.r || "0");
                  const econ = parseFloat(b.er || "0");
                  const o = parseFloat(b.o || "0");
                  if (w > bestBowler.w || (w === bestBowler.w && r < bestBowler.r)) bestBowler = { name: b.bowler, w, r, image: b.image_url };
                  if (o >= 2 && econ < bestEcon.econ) bestEcon = { name: b.bowler, econ, image: b.image_url };
               });
            });

            return (
              <>
                <div className="block-style !p-0 overflow-hidden flex flex-col">
                   <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-gradient-to-r from-brand-secondary/10 to-transparent">
                      <p className="font-semibold text-brand-secondary flex items-center gap-2">
                         <StarSolidIcon className="w-5 h-5" /> AI Match Summary
                      </p>
                   </div>
                   <div className="p-5 text-sm text-[#23272A] dark:text-neutral-300 leading-relaxed font-medium">
                      {matchSummary}
                   </div>
                </div>

                <div className="block-style !p-0 overflow-hidden">
                   <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
                      <p className="font-semibold text-[#23272A] dark:text-white">Top Performers</p>
                   </div>
                   <div className="flex flex-col divide-y divide-snow-200 dark:divide-[#1F2937]">
                      <div className="px-5 py-3 flex items-center gap-4 hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                         <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary font-bold text-xs shrink-0 overflow-hidden">
                            {topBatter.image ? <img src={topBatter.image} className="w-full h-full object-cover"/> : topBatter.name.charAt(0)}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-bold text-neutral-500">Top Batter</p>
                            <p className="font-semibold text-sm text-[#23272A] dark:text-white truncate w-full">{topBatter.name}</p>
                         </div>
                         <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-[#23272A] dark:text-white">{topBatter.runs > -1 ? `${topBatter.runs}` : "-"}</p>
                            <p className="text-xs text-neutral-500">{topBatter.runs > -1 ? `(${topBatter.balls})` : ""}</p>
                         </div>
                      </div>
                      <div className="px-5 py-3 flex items-center gap-4 hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                         <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 font-bold text-xs shrink-0 overflow-hidden">
                            {fastestSR.image ? <img src={fastestSR.image} className="w-full h-full object-cover"/> : fastestSR.name.charAt(0)}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-bold text-neutral-500">Fastest Strike Rate</p>
                            <p className="font-semibold text-sm text-[#23272A] dark:text-white truncate w-full">{fastestSR.name}</p>
                         </div>
                         <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-[#23272A] dark:text-white">{fastestSR.sr > -1 ? `${fastestSR.sr}` : "-"}</p>
                            <p className="text-xs text-neutral-500">{fastestSR.sr > -1 ? "SR" : ""}</p>
                         </div>
                      </div>
                      <div className="px-5 py-3 flex items-center gap-4 hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                         <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold text-xs shrink-0 overflow-hidden">
                            {bestBowler.image ? <img src={bestBowler.image} className="w-full h-full object-cover"/> : bestBowler.name.charAt(0)}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-bold text-neutral-500">Best Bowler</p>
                            <p className="font-semibold text-sm text-[#23272A] dark:text-white truncate w-full">{bestBowler.name}</p>
                         </div>
                         <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-[#23272A] dark:text-white">{bestBowler.w > -1 ? `${bestBowler.w}/${bestBowler.r}` : "-"}</p>
                            <p className="text-xs text-neutral-500">{bestBowler.w > -1 ? "wkts" : ""}</p>
                         </div>
                      </div>
                      <div className="px-5 py-3 flex items-center gap-4 hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                         <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-xs shrink-0 overflow-hidden">
                            {bestEcon.image ? <img src={bestEcon.image} className="w-full h-full object-cover"/> : bestEcon.name.charAt(0)}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-bold text-neutral-500">Most Economical</p>
                            <p className="font-semibold text-sm text-[#23272A] dark:text-white truncate w-full">{bestEcon.name}</p>
                         </div>
                         <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-[#23272A] dark:text-white">{bestEcon.econ < 999 ? `${bestEcon.econ}` : "-"}</p>
                            <p className="text-xs text-neutral-500">{bestEcon.econ < 999 ? "Econ" : ""}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {(() => {
                  const keyMoments = live?.commentaries?.filter((c: any) => c.isWicket === "True" || c.isSix === "True").slice(0, 5) || [];
                  if (keyMoments.length === 0) return null;
                  return (
                    <div className="block-style !p-0 overflow-hidden">
                       <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
                          <p className="font-semibold text-[#23272A] dark:text-white">Key Moments</p>
                       </div>
                       <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                          {keyMoments.map((m: any) => (
                            <div key={m.id} className="px-5 py-3 flex gap-4 items-center">
                              <div className="flex flex-col items-center gap-1 w-12 shrink-0">
                                <span className="text-xs font-semibold text-[#23272A] dark:text-white">{m.over}</span>
                              </div>
                              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white bg-snow-300 dark:bg-[#2A313C]">
                                 {m.isWicket === "True" ? <span className="bg-rose-500 w-full h-full flex items-center justify-center rounded-full">W</span> : <span className="bg-brand-secondary w-full h-full flex items-center justify-center rounded-full">6</span>}
                              </div>
                              <p className="text-sm font-medium text-[#23272A] dark:text-neutral-300 line-clamp-2">{m.post}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  );
                })()}
              </>
            );
          })()}
        </div>
      </div>
    );
  };



  // ─── Squads & Wagon Wheel tab ──────────────────────────────────────────────
  const SquadsWagonTab = () => {
    const homeSquad = live?.lineups?.localteam?.player || [];
    const awaySquad = live?.lineups?.visitorteam?.player || [];
    const [activeTeamTab, setActiveTeamTab] = useState<"home" | "away">("home");

    if (homeSquad.length === 0 && awaySquad.length === 0) {
      return <div className="p-8 text-center text-neutral-500">Squads not announced yet.</div>;
    }

    const currentSquad = activeTeamTab === "home" ? homeSquad : awaySquad;

    return (
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Wagon Wheel: 40% */}
        <div className="w-full lg:w-[40%] block-style !p-0 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
            <p className="font-semibold text-[#23272A] dark:text-white">Wagon Wheel [DEMO]</p>
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

        {/* Squad: 60% — tabs */}
        <div className="w-full lg:w-[60%] block-style !p-0 overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-snow-200 dark:border-[#1F2937]">
            <SegmentedSelector
              value={activeTeamTab}
              options={[
                 { value: "home", label: fixture.localteam.name },
                 { value: "away", label: fixture.visitorteam.name },
              ]}
              onChange={(v) => setActiveTeamTab(v as "home" | "away")}
              size="sm"
            />
          </div>
          <div className="divide-y divide-snow-200 dark:divide-[#1F2937] flex-1">
            {currentSquad.map((player: any, i: number) => {
              // Extract badges from mock or role string
              const isCaptain = player.isCaptain || player.role?.includes("Captain");
              const isWK = player.isWicketKeeper || player.role?.includes("WK");
              const isImpact = player.isImpactPlayer || player.role?.includes("Impact");
              
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-snow-50 dark:hover:bg-white/5 transition-colors">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden ${activeTeamTab === "home" ? "bg-brand-secondary/10 text-brand-secondary" : "bg-indigo-500/10 text-indigo-500"}`}>
                    {player.image_url ? (
                       <img src={player.image_url} alt={player.name} className="w-full h-full object-cover" />
                    ) : (
                       player.jerseyNo || player.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#23272A] dark:text-white truncate">{player.name}</p>
                      {isCaptain && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 px-1.5 py-0.5 rounded text-[10px] font-bold">(C)</span>}
                      {isWK && <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500 px-1.5 py-0.5 rounded text-[10px] font-bold">(WK)</span>}
                      {isImpact && <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-1.5 py-0.5 rounded text-[10px] font-bold">Impact</span>}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">{player.role || "Player"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };




  // ─── Stats tab ─────────────────────────────────────────────────────────────
  const StatsTab = () => {
    const inningsList = live?.innings || [];
    
    // Innings Comparison Logic
    const inn1 = inningsList[0];
    const inn2 = inningsList[1];

    if (!inn1) return <div className="p-8 text-center text-neutral-500">Stats not available yet.</div>;

    const calcStats = (inn: any) => {
      if (!inn) return null;
      let runs = 0, wickets = 0, extras = 0, boundaries = 0, dots = 0, balls = 0;
      
      const runsStr = inn.total?.tot?.split(" ")[0];
      runs = parseInt(runsStr || "0");
      wickets = parseInt(inn.total?.wickets || "0");
      const overStr = inn.total?.tot?.match(/\(([^)]+)\)/)?.[1]?.trim() || "0";
      
      inn.batsmanstats?.player?.forEach((b: any) => {
         boundaries += parseInt(b.s4 || "0") + parseInt(b.s6 || "0");
      });
      inn.bowlers?.player?.forEach((b: any) => {
         dots += parseInt(b.d || "0"); // if available, or calc from balls - hits
         const overs = parseFloat(b.o || "0");
         balls += Math.floor(overs) * 6 + (overs % 1) * 10;
      });

      return { runs, wickets, extras, boundaries, rr: parseFloat(inn.total?.rr || "0"), overs: overStr, dots };
    };

    const s1 = calcStats(inn1);
    const s2 = calcStats(inn2);

    const ComparisonRow = ({ label, v1, v2, suffix = "" }: { label: string, v1: any, v2: any, suffix?: string }) => {
       const max = Math.max(parseFloat(v1 || "0"), parseFloat(v2 || "0"));
       const w1 = max > 0 ? (parseFloat(v1 || "0") / max) * 100 : 0;
       const w2 = max > 0 ? (parseFloat(v2 || "0") / max) * 100 : 0;
       
       return (
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex justify-between text-xs font-semibold text-[#23272A] dark:text-white">
               <span>{v1}{suffix}</span>
               <span className="text-neutral-500 uppercase tracking-wider">{label}</span>
               <span>{v2}{suffix}</span>
            </div>
            <div className="flex gap-2 h-2">
               <div className="flex-1 bg-snow-200 dark:bg-[#1F2937] rounded-l-full flex justify-end">
                  <div className="h-full bg-brand-secondary rounded-l-full transition-all" style={{ width: `${w1}%` }} />
               </div>
               <div className="flex-1 bg-snow-200 dark:bg-[#1F2937] rounded-r-full">
                  <div className="h-full bg-indigo-500 rounded-r-full transition-all" style={{ width: `${w2}%` }} />
               </div>
            </div>
          </div>
       );
    };

    return (
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="w-full lg:w-[50%] block-style !p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
            <p className="font-semibold text-[#23272A] dark:text-white">Innings Comparison</p>
          </div>
          <div className="p-5">
            <div className="flex justify-between text-xs font-bold mb-6 pb-2 border-b border-snow-200 dark:border-[#1F2937]">
               <span className="text-brand-secondary">{fixture.localteam.name}</span>
               <span className="text-indigo-500">{fixture.visitorteam.name}</span>
            </div>
            {s1 && (
              <>
                 <ComparisonRow label="Runs" v1={s1.runs} v2={s2?.runs || 0} />
                 <ComparisonRow label="Wickets" v1={s1.wickets} v2={s2?.wickets || 0} />
                 <ComparisonRow label="Run Rate" v1={s1.rr} v2={s2?.rr || 0} />
                 <ComparisonRow label="Boundaries" v1={s1.boundaries} v2={s2?.boundaries || 0} />
                 <ComparisonRow label="Overs" v1={s1.overs} v2={s2?.overs || 0} />
              </>
            )}
          </div>
        </div>

        {/* Runs per Over Chart: 50% */}
        <div className="w-full lg:w-[50%] block-style !p-0 overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-snow-200 dark:border-[#1F2937] flex justify-between items-center">
            <p className="font-semibold text-[#23272A] dark:text-white">Runs per Over</p>
            <div className="w-44">
              <SegmentedSelector
                value={String(activeScorecardInnings)}
                options={(live?.innings || []).map((inn, i) => ({ value: String(i), label: inn.name }))}
                onChange={(v) => setActiveScorecardInnings(Number(v))}
                size="sm"
              />
            </div>
          </div>
          
          {(() => {
            const playerToTeam: Record<string, string> = {};
            live?.lineups?.localteam?.player?.forEach((p: any) => playerToTeam[p.profileid] = "localteam");
            live?.lineups?.visitorteam?.player?.forEach((p: any) => playerToTeam[p.profileid] = "visitorteam");

            const inningsData: Record<number, Record<number, number>> = { 1: {}, 2: {} };

            live?.commentaries?.forEach((c: any) => {
              const overStr = c.over;
              if (!overStr) return;
              
              const overNum = Math.floor(parseFloat(overStr)) + 1;
              const battingTeamStr = playerToTeam[c.batsman_id];
              
              let currentInning = 1;
              if (live.innings?.[1]?.team === battingTeamStr) {
                 currentInning = 2;
              }

              const runs = parseInt(c.runs || '0') + parseInt(c.wides || '0') + parseInt(c.noballs || '0') + parseInt(c.byes || '0') + parseInt(c.legbyes || '0');

              if (!inningsData[currentInning][overNum]) {
                inningsData[currentInning][overNum] = 0;
              }
              inningsData[currentInning][overNum] += runs;
            });

            const maxOver = Math.max(
              ...Object.keys(inningsData[1]).map(Number),
              ...Object.keys(inningsData[2]).map(Number),
              0
            );
            
            const inn1Name = live?.innings?.[0]?.team === "localteam" ? fixture.localteam.name.slice(0,3) : fixture.visitorteam.name.slice(0,3);
            const inn2Name = live?.innings?.[1]?.team === "localteam" ? fixture.localteam.name.slice(0,3) : fixture.visitorteam.name.slice(0,3);

            const lineChartData = [];
            for (let i = 1; i <= maxOver; i++) {
               lineChartData.push({
                  over: i,
                  [inn1Name || fixture.localteam.name.slice(0,3)]: inningsData[1][i] || 0,
                  [inn2Name || fixture.visitorteam.name.slice(0,3)]: inningsData[2][i] || 0,
               });
            }

            const activeInningNum = activeScorecardInnings + 1;
            const activeBars = Object.keys(inningsData[activeInningNum] || {}).map(k => ({
               over: parseInt(k),
               runs: inningsData[activeInningNum][parseInt(k)]
            })).sort((a, b) => b.over - a.over); // desc

            const chartData = DEMO_OVER_RUNS.map((o, idx) => {
              const homeRuns = DEMO_OVER_RUNS.slice(0, idx + 1).reduce((sum, curr) => sum + curr.runs, 0);
              const awayRuns = DEMO_OVER_RUNS.slice(0, idx + 1).reduce((sum, curr) => sum + Math.max(0, curr.runs - 2 + (idx % 4)), 0);
              return {
                over: o.over,
                [fixture.localteam.name.slice(0,3)]: homeRuns,
                [fixture.visitorteam.name.slice(0,3)]: awayRuns,
              };
            });

            const finalLineData = lineChartData.length > 0 ? lineChartData : chartData;
            const finalBars = activeBars.length > 0 ? activeBars : DEMO_OVER_RUNS;
            const maxRuns = Math.max(...finalBars.map(r => r.runs));

            return (
              <>
                <div className="p-4" style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={finalLineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="over" stroke="#888" tick={{ fill: '#888', fontSize: 11 }} />
                      <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 11 }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#161B22', border: '1px solid #1F2937', color: 'white', fontSize: 12 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey={inn1Name || fixture.localteam.name.slice(0,3)} stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey={inn2Name || fixture.visitorteam.name.slice(0,3)} stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="px-5 pb-5 mt-2 overflow-y-auto max-h-[400px] hide-scrollbar">
                  <div className="space-y-2">
                    {finalBars.map((o) => (
                      <div key={o.over} className="flex items-center justify-between text-sm border-b border-snow-200 dark:border-[#1F2937] py-1.5">
                        <span className="text-neutral-500 dark:text-neutral-400 text-xs">Over {o.over}</span>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 bg-snow-200 dark:bg-white/10 rounded-full w-24">
                            <div className="h-full bg-brand-secondary rounded-full" style={{ width: `${maxRuns === 0 ? 0 : (o.runs / maxRuns) * 100}%` }} />
                          </div>
                          <span className="font-bold text-[#23272A] dark:text-white w-6 text-right">{o.runs}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    );
  };

  const renderOverModal = () => {
    if (!selectedOver) return null;
    const inningsList = live?.innings || [];
    const currentInning = inningsList[activeCommentaryInnings];
    const currentBattingTeam = currentInning?.team;

    const getTeamForPlayer = (id: string) => {
       if (live?.lineups?.localteam?.player?.some((p: any) => p.profileid === id)) return 'localteam';
       if (live?.lineups?.visitorteam?.player?.some((p: any) => p.profileid === id)) return 'visitorteam';
       return null;
    };

    const balls = live?.commentaries?.filter((c: any) => 
      Math.floor(parseFloat(c.over)).toString() === selectedOver && 
      getTeamForPlayer(c.batsman_id) === currentBattingTeam
    ) || [];
    if (balls.length === 0) return null;

    const overRuns = balls.reduce((sum: number, c: any) => sum + parseInt(c.runs || '0') + parseInt(c.wides || '0') + parseInt(c.noballs || '0') + parseInt(c.byes || '0') + parseInt(c.legbyes || '0'), 0);
    const overWickets = balls.filter((c: any) => c.isWicket === "True").length;

    const bowlerIds = [...new Set(balls.map((b: any) => b.bowler_id))];
    const batterIds = [...new Set(balls.map((b: any) => b.batsman_id))];
    const bowlers = bowlerIds.map((id: any) => getPlayer(id)).filter(Boolean);
    const batters = batterIds.map((id: any) => getPlayer(id)).filter(Boolean);

    const batterStats = batters.map(b => {
      const bBalls = balls.filter((c: any) => c.batsman_id === b?.profileid);
      const r = bBalls.reduce((s: number, c: any) => s + parseInt(c.runs || '0'), 0);
      const s4 = bBalls.filter((c: any) => c.isFour === "True").length;
      const s6 = bBalls.filter((c: any) => c.isSix === "True").length;
      const isOut = bBalls.some((c: any) => c.isWicket === "True");
      return { ...b, r, balls: bBalls.length, s4, s6, isOut };
    });

    const bowlerStats = bowlers.map(b => {
      const bBalls = balls.filter((c: any) => c.bowler_id === b?.profileid);
      const r = bBalls.reduce((s: number, c: any) => s + parseInt(c.runs || '0'), 0);
      const extras = bBalls.reduce((s: number, c: any) => s + parseInt(c.wides || '0') + parseInt(c.noballs || '0') + parseInt(c.byes || '0') + parseInt(c.legbyes || '0'), 0);
      return { ...b, r, extras };
    });

    const battingTeamInfo = currentBattingTeam === "localteam" ? fixture.localteam : fixture.visitorteam;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => setSelectedOver(null)}>
        <div className="bg-white dark:bg-[#1e2329] rounded-xl w-full max-w-md border border-snow-200 dark:border-white/10 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
          
          {/* Header */}
          <div className="p-5 border-b border-snow-200 dark:border-white/5 flex justify-between items-start bg-snow-50 dark:bg-[#161a20]">
             <div>
                <h3 className="font-semibold text-[#23272A] dark:text-white text-xl mb-1">Over {Number(selectedOver) + 1}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">{overRuns} Runs • {overWickets} Wicket{overWickets !== 1 ? 's' : ''}</p>
             </div>
             <div className="text-right">
                <p className="text-neutral-500 text-xs font-semibold uppercase mb-1">Batting</p>
                <div className="flex items-center justify-end gap-2">
                   <img src={battingTeamInfo.image_url} className="w-4 h-4 rounded-full" />
                   <span className="font-semibold text-[#23272A] dark:text-white">{battingTeamInfo.name.slice(0,3).toUpperCase()}: {battingTeamInfo.totalscore}</span>
                </div>
             </div>
          </div>
          
          <div className="p-5 overflow-y-auto hide-scrollbar flex-1">
             {/* Batters Table */}
             <div className="mb-6">
               <table className="w-full text-sm text-left">
                  <thead>
                     <tr className="text-neutral-500 dark:text-neutral-400 border-b border-snow-200 dark:border-white/5">
                        <th className="pb-2 font-medium">Batter</th>
                        <th className="pb-2 font-medium text-center">R</th>
                        <th className="pb-2 font-medium text-center">4s</th>
                        <th className="pb-2 font-medium text-center">6s</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-snow-200 dark:divide-white/5">
                     {batterStats.map((b: any) => (
                       <tr key={b?.profileid || Math.random()}>
                          <td className="py-3">
                             <div className="flex items-center gap-3">
                                {b?.image_url ? (
                                   <img src={b.image_url} className="w-8 h-8 rounded-full object-cover bg-snow-200 dark:bg-white/10" />
                                ) : (
                                   <div className="w-8 h-8 rounded-full bg-snow-200 dark:bg-white/10 flex items-center justify-center font-semibold text-[#23272A] dark:text-white text-xs">{b?.name?.charAt(0) || '?'}</div>
                                )}
                                <div>
                                   <p className="font-semibold text-[#23272A] dark:text-white">{b?.name}</p>
                                   {b?.isOut && <p className="text-[#ef4444] text-[10px] font-semibold uppercase">Out</p>}
                                </div>
                             </div>
                          </td>
                          <td className="py-3 text-center font-semibold text-[#23272A] dark:text-white">{b.r} <span className="text-neutral-500 text-xs font-normal">({b.balls}b)</span></td>
                          <td className="py-3 text-center text-neutral-500 dark:text-neutral-400">{b.s4}</td>
                          <td className="py-3 text-center text-neutral-500 dark:text-neutral-400">{b.s6}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
             </div>

             {/* Bowlers Table */}
             <div className="mb-6">
               <table className="w-full text-sm text-left">
                  <thead>
                     <tr className="text-neutral-500 dark:text-neutral-400 border-b border-snow-200 dark:border-white/5">
                        <th className="pb-2 font-medium">Bowler</th>
                        <th className="pb-2 font-medium text-center">R</th>
                        <th className="pb-2 font-medium text-center">Extras</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-snow-200 dark:divide-white/5">
                     {bowlerStats.map((b: any) => (
                       <tr key={b?.profileid || Math.random()}>
                          <td className="py-3">
                             <div className="flex items-center gap-3">
                                {b?.image_url ? (
                                   <img src={b.image_url} className="w-8 h-8 rounded-full object-cover bg-snow-200 dark:bg-white/10" />
                                ) : (
                                   <div className="w-8 h-8 rounded-full bg-snow-200 dark:bg-white/10 flex items-center justify-center font-semibold text-[#23272A] dark:text-white text-xs">{b?.name?.charAt(0) || '?'}</div>
                                )}
                                <p className="font-semibold text-[#23272A] dark:text-white">{b?.name}</p>
                             </div>
                          </td>
                          <td className="py-3 text-center font-semibold text-[#23272A] dark:text-white">{b.r}</td>
                          <td className="py-3 text-center text-neutral-500 dark:text-neutral-400">{b.extras}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
             </div>

             {/* Commentary List */}
             <div>
                <p className="text-white font-bold mb-3">Commentary</p>
                <div className="space-y-2">
                   {[...balls].sort((a: any, b: any) => parseFloat(b.over) - parseFloat(a.over)).map((c: any) => (
                      <div key={c.id} className="bg-[#242930] rounded-lg p-3.5 flex gap-3 items-start border border-white/5">
                         <span className="text-neutral-400 text-xs font-bold pt-0.5 w-7 shrink-0">{c.over}</span>
                         <p className="text-neutral-200 text-sm leading-relaxed">{c.post}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="p-4 bg-[#161a20] border-t border-white/5 flex justify-end">
             <button onClick={() => setSelectedOver(null)} className="text-[#a855f7] font-bold text-sm px-4 py-2 hover:bg-[#a855f7]/10 rounded-lg transition-colors uppercase tracking-wider">
               Close
             </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case "match-info":      return <MatchInfoTab />;
      case "commentary":      return <CommentaryTab />;
      case "scorecard":       return <ScorecardTab />;
      case "stats":           return <StatsTab />;
      case "squads-wagon":    return <SquadsWagonTab />;
      case "standings":       return (
         <CricketStandingsTable 
            seriesId={fixture.series_id} 
            localteamId={fixture.localteam?.id} 
            visitorteamId={fixture.visitorteam?.id} 
         />
      );
      default:                return null;
    }
  };

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />

      <div className="w-full">
        <HeroBanner />

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

        <div className="page-padding-x py-6 flex flex-col gap-4">
          {renderTab()}
        </div>
      </div>

      <FooterComp />
      {renderOverModal()}
    </div>
  );
};

export default CricketGameInfo;
