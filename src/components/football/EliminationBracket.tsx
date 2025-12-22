import React, { useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface Team {
  id: string;
  name: string;
  flag: string; // Using flag as logo
}

interface Match {
  id: string;
  round: string;
  homeTeam: Team | null;
  awayTeam: Team | null;
  winner: Team | null;
  score?: string;
  date?: string;
  isDraw?: boolean; // New property for draw matches
  isPenaltyShootout?: boolean; // New property for penalty shootouts
}

interface Round {
  name: string;
  matches: Match[];
}

interface BracketData {
  rounds: Round[];
}

interface EliminationBracketProps {
  data: BracketData;
  loading?: boolean;
}

const SkeletonMatch: React.FC = () => (
  <div className="bg-gray-200 dark:bg-gray-700 rounded p-2 animate-pulse w-48 h-16 flex flex-col justify-around">
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
  </div>
);

export const EliminationBracket: React.FC<EliminationBracketProps> = ({ data, loading }) => {
  const matchRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const roundRefs = useRef<Record<string, HTMLDivElement | null>>({}); 
  const bracketContainerRef = useRef<HTMLDivElement | null>(null);

  const totalRounds = data.rounds.length;
  const finalRoundIndex = totalRounds > 0 ? totalRounds - 1 : -1;

  const leftBracketRounds = data.rounds.slice(0, Math.floor(finalRoundIndex / 2));
  const finalRound = totalRounds > 0 ? data.rounds[finalRoundIndex] : null;
  const rightBracketRounds = data.rounds.slice(Math.floor(finalRoundIndex / 2), finalRoundIndex).reverse();

  useEffect(() => {
    if (loading || !bracketContainerRef.current) return;

    const drawLines = () => {
      const svg = document.getElementById("bracket-svg");
      if (!svg || !bracketContainerRef.current) return;

      // Set SVG dimensions to match parent container
      const parentRect = bracketContainerRef.current.getBoundingClientRect();
      svg.setAttribute("width", String(parentRect.width));
      svg.setAttribute("height", String(parentRect.height));
      
      // Clear previous lines
      while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
      }

      const bracketContainerRect = bracketContainerRef.current!.getBoundingClientRect();

      data.rounds.forEach((round, roundIndex) => {
        round.matches.forEach((match, matchIndex) => {
          const matchElement = matchRefs.current[match.id];
          if (!matchElement) return;

          const matchRect = matchElement.getBoundingClientRect();

          // Coordinates for the starting point of the horizontal line from the match card
          const startX = matchRect.right - bracketContainerRect.left; 
          const startY = matchRect.top + matchRect.height / 2 - bracketContainerRect.top;

          // Draw horizontal line from match to the right
          const hLine1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
          hLine1.setAttribute("x1", String(startX));
          hLine1.setAttribute("y1", String(startY));
          hLine1.setAttribute("x2", String(startX + 30)); // Extend 30px horizontally
          hLine1.setAttribute("y2", String(startY));
          hLine1.setAttribute("stroke", "#9CA3AF");
          hLine1.setAttribute("strokeWidth", "2");
          svg.appendChild(hLine1);

          // Connectors for subsequent rounds
          if (roundIndex < data.rounds.length - 1) {
            const nextRound = data.rounds[roundIndex + 1];
            const nextMatchIndex = Math.floor(matchIndex / 2);
            const nextMatch = nextRound.matches[nextMatchIndex];
            const nextMatchElement = matchRefs.current[nextMatch.id];

            if (nextMatchElement) {
              const nextMatchRect = nextMatchElement.getBoundingClientRect();

              const midHorizontalX = startX + 30; // End of the first horizontal line

              // Vertical line connecting two matches in a pair
              if (matchIndex % 2 === 0 && round.matches[matchIndex + 1]) {
                const siblingMatchElement = matchRefs.current[round.matches[matchIndex + 1].id];
                if (siblingMatchElement) {
                  const siblingRect = siblingMatchElement.getBoundingClientRect();

                  const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                  vLine.setAttribute("x1", String(midHorizontalX));
                  vLine.setAttribute("y1", String(startY));
                  vLine.setAttribute("x2", String(midHorizontalX));
                  vLine.setAttribute("y2", String(siblingRect.top + siblingRect.height / 2 - bracketContainerRect.top));
                  vLine.setAttribute("stroke", "#9CA3AF");
                  vLine.setAttribute("strokeWidth", "2");
                  svg.appendChild(vLine);
                }
              }

              // Horizontal line to the next round's match from the midpoint of the vertical line
              if (matchIndex % 2 === 0) { // Only draw one horizontal line per pair to the next round
                const nextMatchCenterY = nextMatchRect.top + nextMatchRect.height / 2 - bracketContainerRect.top;
                const hLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                hLine2.setAttribute("x1", String(midHorizontalX));
                hLine2.setAttribute("y1", String(nextMatchCenterY));
                hLine2.setAttribute("x2", String(nextMatchRect.left - bracketContainerRect.left));
                hLine2.setAttribute("y2", String(nextMatchCenterY));
                hLine2.setAttribute("stroke", "#9CA3AF");
                hLine2.setAttribute("strokeWidth", "2");
                svg.appendChild(hLine2);
              }
            }
          }
        });
      });
    };

    // Use a small timeout to ensure all elements are rendered before drawing
    const timeoutId = setTimeout(() => {
      drawLines();
    }, 50);

    window.addEventListener("resize", drawLines);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", drawLines);
    };
  }, [data, loading]);

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4 theme-text">{loading ? "Loading Skeleton" : "Single Elimination"}</h2>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={2}
        limitToBounds={false}
      >
        <TransformComponent>
          <div ref={bracketContainerRef} className="relative flex justify-between space-x-8 p-4 h-[700px] w-full">
            <svg id="bracket-svg" className="absolute inset-0 w-full h-full pointer-events-none"></svg>
            {loading ? (
              <div className="flex flex-col items-center justify-around w-full h-full">
                {Array.from({ length: 3 }).map((_, roundIdx) => (
                  <div key={roundIdx} className="flex flex-col items-center justify-around w-60 py-4">
                    <h3 className="text-lg font-semibold mb-8 theme-text">Loading..</h3>
                    <div className="flex flex-col justify-around h-full">
                      {Array.from({ length: Math.pow(2, 2 - roundIdx) }).map((_, matchIdx) => (
                        <React.Fragment key={matchIdx}>
                          <SkeletonMatch />
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              data.rounds.map((round) => (
                <div key={round.name} className="flex flex-col items-center justify-around w-fit py-4" ref={(el) => { roundRefs.current[round.name] = el; }}>
                  <h3 className="text-lg font-semibold mb-8 theme-text">{round.name}</h3>
                  <div className="flex flex-col justify-around h-full">
                    {round.matches.map((match) => (
                      <div 
                        key={match.id} 
                        ref={(el) => { matchRefs.current[match.id] = el; }}
                        className="relative flex flex-col items-center bg-brand-secondary rounded-lg p-3 w-full text-white z-10"
                      >
                          <div className="flex justify-between w-full mb-1">
                            <div className="flex items-center gap-2">
                              {match.homeTeam?.flag && <img src={match.homeTeam.flag} alt={match.homeTeam.name} className="w-5 h-5 rounded-full" />}
                              <span className="text-sm font-semibold">{match.homeTeam?.name || '-------'}</span>
                              {match.isPenaltyShootout && match.homeTeam?.id === match.winner?.id && <span className="text-xs bg-gray-600 px-1 py-0.5 rounded-md ml-2">PEN</span>}
                            </div>
                            {match.score && <span className="text-sm font-semibold">{match.score.split('-')[0]}</span>}
                          </div>
                          <div className="flex justify-between w-full">
                            <div className="flex items-center gap-2">
                              {match.awayTeam?.flag && <img src={match.awayTeam.flag} alt={match.awayTeam.name} className="w-5 h-5 rounded-full" />}
                              <span className="text-sm">{match.awayTeam?.name || '-------'}</span>
                              {match.isPenaltyShootout && match.awayTeam?.id === match.winner?.id && <span className="text-xs bg-gray-600 px-1 py-0.5 rounded-md ml-2">PEN</span>}
                            </div>
                            {match.score && <span className="text-sm">{match.score.split('-')[1]}</span>}
                          </div>
                        {match.date && <span className="text-xs mt-2 opacity-75">{match.date}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};