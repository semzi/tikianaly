import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamFixtures } from "@/lib/api/endpoints";
import GetTeamLogo from "@/components/common/GetTeamLogo";
import { MapPinIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  MinusIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

type FixtureTeam = {
  id: string;
  name: string;
  score?: string;
};

type Fixture = {
  id: string;
  fixture_id: number;
  date: string;
  time: string;
  status: string;
  venue: string;
  venue_city: string;
  localteam: FixtureTeam;
  visitorteam: FixtureTeam;
  league_name: string;
  week?: number;
};

type TeamFixturesResponse = {
  success: boolean;
  message: string;
  responseObject: {
    played: Fixture[];
    upcoming: Fixture[];
  };
  statusCode: number;
};

type TeamFixturesSidebarProps = {
  teamId: string | number;
  teamName?: string;
};

const TeamFixturesSidebar = ({ teamId }: TeamFixturesSidebarProps) => {
  const [homeForm, setHomeForm] = useState<string[]>([]);
  const [awayForm, setAwayForm] = useState<string[]>([]);
  const [userPick, setUserPick] = useState<null | "home" | "draw" | "away">(null);

  const queryClient = useQueryClient();

  const {
    data: fixtures,
    isLoading,
    error,
  } = useQuery<TeamFixturesResponse>({
    queryKey: ["teamFixtures", teamId],
    queryFn: async () => await getTeamFixtures(teamId),
    enabled: !!teamId,
  });

  const errorMessage =
    error instanceof Error ? error.message : error ? "Failed to load fixtures" : null;

  const nextMatch = fixtures?.responseObject?.upcoming?.[0];

  useEffect(() => {
    const fixtureId = nextMatch?.fixture_id;
    if (!fixtureId) return;

    try {
      const raw = localStorage.getItem(`prediction_pick_${fixtureId}`);
      setUserPick(raw === "home" || raw === "draw" || raw === "away" ? raw : null);
    } catch {
      setUserPick(null);
    }
  }, [nextMatch?.fixture_id]);

  const onVote = (pick: "home" | "draw" | "away") => {
    const fixtureId = nextMatch?.fixture_id;
    if (!fixtureId) return;

    const nextPick = userPick === pick ? null : pick;
    setUserPick(nextPick);
    try {
      if (!nextPick) localStorage.removeItem(`prediction_pick_${fixtureId}`);
      else localStorage.setItem(`prediction_pick_${fixtureId}`, nextPick);
    } catch {
      // ignore
    }
  };

  const toTs = (d?: string) => {
    const ts = Date.parse(String(d ?? ""));
    return Number.isFinite(ts) ? ts : 0;
  };

  const getFormResult = (fixture: Fixture, isHomeTeam: boolean) => {
    const team = isHomeTeam ? fixture.localteam : fixture.visitorteam;
    const opponent = isHomeTeam ? fixture.visitorteam : fixture.localteam;
    
    if (!team.score || !opponent.score) return null;
    
    const teamScore = parseInt(team.score);
    const opponentScore = parseInt(opponent.score);
    
    if (teamScore > opponentScore) return "W";
    if (teamScore < opponentScore) return "L";
    return "D";
  };

  const getFormColor = (result: string) => {
    switch (result) {
      case "W": return "bg-green-500 text-white";
      case "L": return "bg-red-500 text-white";
      case "D": return "bg-yellow-500 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      weekday: "short"
    });
  };

  useEffect(() => {
    const loadTeamForm = async () => {
      const homeId = nextMatch?.localteam?.id;
      const awayId = nextMatch?.visitorteam?.id;
      const cutoffTs = toTs(nextMatch?.date);

      if (!homeId || !awayId) {
        setHomeForm([]);
        setAwayForm([]);
        return;
      }

      try {
        const [homeFx, awayFx] = await Promise.all([
          queryClient.fetchQuery<TeamFixturesResponse>({
            queryKey: ["teamFixtures", homeId],
            queryFn: () => getTeamFixtures(homeId),
          }),
          queryClient.fetchQuery<TeamFixturesResponse>({
            queryKey: ["teamFixtures", awayId],
            queryFn: () => getTeamFixtures(awayId),
          }),
        ]);

        const homePlayed = (homeFx?.responseObject?.played ?? []) as Fixture[];
        const awayPlayed = (awayFx?.responseObject?.played ?? []) as Fixture[];

        const toForm = (items: Fixture[], forTeamId: string, cutoff: number) => {
          const filtered = items
            .filter((fx) => {
              if (!cutoff) return true;
              const fxTs = toTs(fx?.date);
              return fxTs > 0 && fxTs < cutoff;
            })
            .sort((a, b) => toTs(b?.date) - toTs(a?.date));

          const out: string[] = [];
          for (const fx of filtered.slice(0, 5)) {
            const isHome = String(fx?.localteam?.id ?? "") === String(forTeamId);
            const r = getFormResult(fx, isHome);
            if (r) out.push(r);
          }
          return out;
        };

        setHomeForm(toForm(homePlayed, String(homeId), cutoffTs));
        setAwayForm(toForm(awayPlayed, String(awayId), cutoffTs));
      } catch {
        setHomeForm([]);
        setAwayForm([]);
      }
    };

    loadTeamForm();
  }, [nextMatch?.localteam?.id, nextMatch?.visitorteam?.id, queryClient]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="h-4 w-24 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
          <div className="h-3 w-16 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
        </div>

        <div className="rounded-xl border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-28 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
            <div className="h-3 w-10 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
          </div>

          <div className="grid grid-cols-3 items-start gap-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
              <div className="h-3 w-24 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={`hf-${i}`} className="w-3 h-3 rounded-full bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center pt-3">
              <div className="h-3 w-6 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
              <div className="h-3 w-24 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={`af-${i}`} className="w-3 h-3 rounded-full bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
            <div className="h-3 w-40 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
          </div>
        </div>

        <div className="-mt-px rounded-b-xl border border-t-0 border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-2">
          <div className="h-3 w-28 rounded bg-snow-200 dark:bg-[#1F2937] animate-pulse mb-2" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={`pv-${i}`} className="h-9 rounded-md bg-snow-200 dark:bg-[#1F2937] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="block-style border border-red-500/20 bg-red-500/10 p-3 rounded">
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="font-bold text-lg theme-text">Next Match</p>
        {nextMatch?.date ? (
          <p className="text-xs text-neutral-n5 dark:text-snow-200">{formatDate(nextMatch.date)}</p>
        ) : null}
      </div>
      {nextMatch ? (
        <div>
          <Link
            to={`/football/gameinfo/${nextMatch.fixture_id}?fixtureId=${encodeURIComponent(String(nextMatch.fixture_id))}`}
            className="block rounded-t-xl border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-4 hover:bg-snow-100/60 dark:hover:bg-white/5 transition-colors"
          >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-neutral-n5 dark:text-snow-200 truncate">{nextMatch.league_name}</p>
            <p className="text-xs text-neutral-n5 dark:text-snow-200">{nextMatch.time}</p>
          </div>

          <div className="grid grid-cols-3 items-start gap-3">
            <div className="flex flex-col items-center gap-2 min-w-0">
              <GetTeamLogo teamId={nextMatch.localteam.id} alt={nextMatch.localteam.name} className="w-10 h-10 object-contain" />
              <p className="text-sm font-semibold theme-text text-center truncate w-full">{nextMatch.localteam.name}</p>
              <div className="flex gap-0.5 flex-nowrap justify-center">
                {[...homeForm].reverse().map((r, idx) => (
                  <span
                    key={`${nextMatch.localteam.id}-form-${idx}`}
                    className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold ${getFormColor(r)}`}
                    title={r}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center pt-3">
              <span className="text-xs font-bold text-neutral-n5 dark:text-snow-200">VS</span>
            </div>

            <div className="flex flex-col items-center gap-2 min-w-0">
              <GetTeamLogo teamId={nextMatch.visitorteam.id} alt={nextMatch.visitorteam.name} className="w-10 h-10 object-contain" />
              <p className="text-sm font-semibold theme-text text-center truncate w-full">{nextMatch.visitorteam.name}</p>
              <div className="flex gap-0.5 flex-nowrap justify-center">
                {[...awayForm].reverse().map((r, idx) => (
                  <span
                    key={`${nextMatch.visitorteam.id}-form-${idx}`}
                    className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold ${getFormColor(r)}`}
                    title={r}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-neutral-n5 dark:text-snow-200">
            <MapPinIcon className="h-4 w-4" />
            <span className="truncate">{nextMatch.venue}</span>
          </div>
          </Link>

          <div className="-mt-px rounded-b-xl border border-t-0 border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-2">
            <p className="text-[11px] font-semibold theme-text mb-2">Vote your prediction</p>
            <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onVote("home")}
              className={`flex items-center justify-center gap-1 rounded-md px-2 py-2 text-[11px] font-semibold transition-colors ${
                userPick === "home"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
              }`}
              aria-pressed={userPick === "home"}
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </button>

            <button
              type="button"
              onClick={() => onVote("draw")}
              className={`flex items-center justify-center gap-1 rounded-md px-2 py-2 text-[11px] font-semibold transition-colors ${
                userPick === "draw"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
              }`}
              aria-pressed={userPick === "draw"}
            >
              <MinusIcon className="h-4 w-4" />
              Draw
            </button>

            <button
              type="button"
              onClick={() => onVote("away")}
              className={`flex items-center justify-center gap-1 rounded-md px-2 py-2 text-[11px] font-semibold transition-colors ${
                userPick === "away"
                  ? "bg-sky-600 text-white"
                  : "bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20"
              }`}
              aria-pressed={userPick === "away"}
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              Away
            </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#161B22] p-4">
          <p className="text-sm text-neutral-n5 dark:text-snow-200">No upcoming fixtures</p>
        </div>
      )}
    </div>
  );
};

export default TeamFixturesSidebar;
