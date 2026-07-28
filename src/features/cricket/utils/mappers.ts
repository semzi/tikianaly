export interface CricketMappedMatch {
  id: string;
  league: string;
  status: string;
  highlight: string;
  format: string;
  startTime: string;
  homeTeam: {
    id: string;
    name: string;
    score: string;
    wickets: string;
    imageUrl: string;
    overs?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    score: string;
    wickets: string;
    imageUrl: string;
    overs?: string;
  };
  result?: string;
}

const parseScoreAndOvers = (totalScoreStr: string | undefined, innings: any[], teamId: string) => {
  let score = totalScoreStr || "";
  let overs = "";

  if (innings && innings.length > 0) {
    const inning = innings.find((inn: any) => inn.team === teamId);
    if (inning && inning.total && inning.total.tot) {
      const match = inning.total.tot.match(/\(\s*([0-9.]+)\s*\)/);
      if (match) {
        overs = match[1];
      }
    }
  }

  return { score, overs };
};

export const mapCricketMatch = (apiMatch: any): CricketMappedMatch => {
  const homeScoreInfo = parseScoreAndOvers(apiMatch.localteam?.totalscore, apiMatch.innings, "localteam");
  const awayScoreInfo = parseScoreAndOvers(apiMatch.visitorteam?.totalscore, apiMatch.innings, "visitorteam");

  return {
    id: String(apiMatch.match_id || apiMatch.id),
    league: apiMatch.name || "Unknown League",
    status: apiMatch.status || "Unknown",
    highlight: apiMatch.match_format || "",
    format: apiMatch.match_format || "",
    startTime: apiMatch.match_time || "",
    homeTeam: {
      id: apiMatch.localteam?.id || "",
      name: apiMatch.localteam?.name || "Unknown",
      score: homeScoreInfo.score,
      wickets: apiMatch.localteam?.wickets || "",
      imageUrl: apiMatch.localteam?.image_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(apiMatch.localteam?.name || "Team") + "&background=random",
      overs: homeScoreInfo.overs,
    },
    awayTeam: {
      id: apiMatch.visitorteam?.id || "",
      name: apiMatch.visitorteam?.name || "Unknown",
      score: awayScoreInfo.score,
      wickets: apiMatch.visitorteam?.wickets || "",
      imageUrl: apiMatch.visitorteam?.image_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(apiMatch.visitorteam?.name || "Team") + "&background=random",
      overs: awayScoreInfo.overs,
    },
    result: apiMatch.comment?.post || apiMatch.result,
  };
};
