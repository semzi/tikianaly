import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCricketStandingsBySeriesId } from "@/lib/api/endpoints";

import Image from "@/components/common/Image";

export type CricketStandingsRow = {
  position: number;
  team: string;
  teamId?: number;
  imageUrl?: string;
  played: number;
  wins: number;
  losses: number;
  tied: number;
  points: number;
};

type CricketStandingTeam = {
  id?: string;
  nr?: string;
  pos?: string;
  won?: string;
  lost?: string;
  name?: string;
  tied?: string;
  games?: string;
  points?: string;
  image_url?: string;
};

type CricketStandingsResponse = {
  success?: boolean;
  message?: string;
  responseObject?: {
    item?: {
      series_id?: string;
      standings?: {
        team?: CricketStandingTeam[];
      };
    };
  };
};

type Props = {
  seriesId?: string | number;
  localteamId?: string | number;
  visitorteamId?: string | number;
};

export const CricketStandingsTable = ({ seriesId, localteamId, visitorteamId }: Props) => {
  const {
    data: apiData,
    error: apiError,
    isLoading,
  } = useQuery<CricketStandingsResponse>({
    queryKey: ["cricketStandings", seriesId],
    queryFn: async () =>
      (await getCricketStandingsBySeriesId(String(seriesId ?? ""))) as CricketStandingsResponse,
    enabled: !!seriesId,
    staleTime: 60_000,
  });

  const openTeamProfile = (teamId?: number) => {
    if (!teamId) return;
    // navigate(`/team/profile/${encodeURIComponent(String(teamId))}`); // adjust if there is a cricket team profile
  };

  const SkeletonBlock = ({ className }: { className: string }) => (
    <div className={`animate-pulse rounded bg-snow-200/80 dark:bg-white/10 ${className}`} />
  );

  const StandingsSkeletonDesktop = () => (
    <div className="hidden lg:block block-style overflow-x-auto">
      <div className="min-w-full">
        <div className="grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px] gap-3 px-6 py-4 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
          <div className="text-center">#</div>
          <div>Team</div>
          <div className="text-center">P</div>
          <div className="text-center">W</div>
          <div className="text-center">L</div>
          <div className="text-center">T</div>
          <div className="text-center">PTS</div>
        </div>
        <div className="flex flex-col gap-2 px-6 pb-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px] gap-3 items-center"
            >
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <div className="flex items-center gap-3 min-w-0">
                <SkeletonBlock className="w-8 h-8 rounded-full" />
                <SkeletonBlock className="h-3 w-40" />
              </div>
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-6 mx-auto" />
              <SkeletonBlock className="h-4 w-8 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const StandingsSkeletonMobile = () => (
    <div className="block lg:hidden">
      <div>
        <div className="flex">
          <div className="w-[220px] shrink-0">
            <div className="grid grid-cols-[40px_1fr] gap-3 px-4 py-2 mb-2 h-10 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap items-center">
              <div className="text-center">#</div>
              <div>Team</div>
            </div>
            <div className="flex flex-col gap-0">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="grid grid-cols-[40px_1fr] gap-3 px-4 h-10 items-center whitespace-nowrap">
                  <SkeletonBlock className="h-4 w-6 mx-auto" />
                  <div className="flex items-center gap-2 min-w-0">
                    <SkeletonBlock className="w-7 h-7 rounded-full" />
                    <SkeletonBlock className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-x-auto hide-scrollbar">
            <div className="min-w-[240px]">
              <div className="grid grid-cols-[40px_40px_40px_40px_50px] gap-3 px-4 py-2 mb-2 h-10 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap items-center">
                <div className="text-center">P</div>
                <div className="text-center">W</div>
                <div className="text-center">L</div>
                <div className="text-center">T</div>
                <div className="text-center">PTS</div>
              </div>
              <div className="flex flex-col gap-0">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="grid grid-cols-[40px_40px_40px_40px_50px] gap-3 px-4 h-10 items-center whitespace-nowrap">
                    <SkeletonBlock className="h-4 w-6 mx-auto" />
                    <SkeletonBlock className="h-4 w-6 mx-auto" />
                    <SkeletonBlock className="h-4 w-6 mx-auto" />
                    <SkeletonBlock className="h-4 w-6 mx-auto" />
                    <SkeletonBlock className="h-4 w-8 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const apiErrorMessage =
    apiError instanceof Error ? apiError.message : apiError ? "Failed to load standings" : "";

  const data = useMemo<CricketStandingsRow[]>(() => {
    const apiStandings = apiData?.responseObject?.item?.standings?.team;
    if (Array.isArray(apiStandings) && apiStandings.length) {
      const toNum = (v: unknown) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      };

      return apiStandings
        .map((t) => {
          return {
            position: toNum(t.pos),
            team: String(t.name ?? ""),
            teamId: Number.isFinite(Number(t.id)) ? Number(t.id) : undefined,
            imageUrl: typeof t.image_url === "string" ? t.image_url : undefined,
            played: toNum(t.games),
            wins: toNum(t.won),
            losses: toNum(t.lost),
            tied: toNum(t.tied),
            points: toNum(t.points),
          };
        })
        .filter((r) => r.team.trim())
        .sort((a, b) => a.position - b.position);
    }
    return [];
  }, [apiData]);

  const getHighlightBgClass = (teamId?: number) => {
    if (!teamId) return "";
    const homeIdNum = Number(localteamId);
    const awayIdNum = Number(visitorteamId);

    if (Number.isFinite(homeIdNum) && teamId === homeIdNum) return "bg-brand-secondary/10";
    if (Number.isFinite(awayIdNum) && teamId === awayIdNum) return "bg-brand-primary/10";
    return "";
  };

  const renderRows = (rowItems: CricketStandingsRow[], paddingX: string) => {
    const gridClass = "grid-cols-[40px_1fr_40px_40px_40px_40px_50px]";

    return (
      <div className="flex flex-col gap-2">
        {rowItems.map((team) => {
          const highlightBg = getHighlightBgClass(team.teamId);

          return (
            <div
              key={`${team.position}-${team.team}`}
              className={`grid ${gridClass} gap-3 ${paddingX} items-center relative whitespace-nowrap ${highlightBg}`}
            >
              <div className="text-center font-medium text-sm text-neutral-n4 dark:text-snow-200">
                {team.position}
              </div>
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={team.imageUrl || ""}
                  alt={team.team}
                  className="w-8 h-8 rounded-full object-contain flex-shrink-0"
                />
                <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate">
                  {team.team}
                </span>
              </div>

              <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.played}</div>
              <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.wins}</div>
              <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.losses}</div>
              <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.tied}</div>
              <div className="text-center font-semibold text-sm text-neutral-n4 dark:text-snow-200">
                {team.points}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="my-8">
      {apiErrorMessage ? (
        <div className="mb-4 text-sm text-ui-negative">{apiErrorMessage}</div>
      ) : null}
      {!isLoading && !apiErrorMessage && data.length === 0 ? (
        <div className="mb-4 text-sm text-neutral-n4 dark:text-snow-200">No records at the Moment check back later</div>
      ) : null}

      {isLoading ? (
        <>
          <StandingsSkeletonDesktop />
          <StandingsSkeletonMobile />
        </>
      ) : null}

      {!isLoading ? (
        <>
          <div className="hidden lg:block block-style overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px] gap-3 px-6 py-4 mb-2 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap">
                <div className="text-center">#</div>
                <div>Team</div>
                <div className="text-center">P</div>
                <div className="text-center">W</div>
                <div className="text-center">L</div>
                <div className="text-center">T</div>
                <div className="text-center">PTS</div>
              </div>
              {renderRows(data, "px-6")}
            </div>
          </div>

          <div className="block lg:hidden">
            <div>
              <div className="flex">
                <div className="w-[88px] shrink-0">
                  <div className="px-2 py-2 mb-2 h-10 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap flex items-center justify-center" />
                  <div className="flex flex-col gap-0">
                    {data.map((team) => (
                      <div
                        key={`mobile-logo-${team.position}-${team.team}`}
                        className={`px-2 h-10 flex relative items-center gap-2 whitespace-nowrap ${getHighlightBgClass(team.teamId)}`}
                      >
                        <div className="w-6 text-center font-medium text-sm text-neutral-n4 dark:text-snow-200">
                          {team.position}
                        </div>
                        <Image
                          src={team.imageUrl || ""}
                          alt={team.team}
                          className="w-7 h-7 rounded-full object-contain flex-shrink-0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-x-auto hide-scrollbar">
                  <div className="min-w-[400px]">
                    <div className="grid grid-cols-[140px_40px_40px_40px_40px_50px] gap-3 px-2 py-2 mb-2 h-10 border-b border-snow-200 dark:border-[#1F2937] font-semibold text-sm text-brand-primary whitespace-nowrap items-center">
                      <div>Team</div>
                      <div className="text-center">P</div>
                      <div className="text-center">W</div>
                      <div className="text-center">L</div>
                      <div className="text-center">T</div>
                      <div className="text-center">PTS</div>
                    </div>
                    <div className="flex flex-col gap-0">
                      {data.map((team) => (
                        <div
                          key={`mobile-scroll-${team.position}-${team.team}`}
                          className={`grid grid-cols-[140px_40px_40px_40px_40px_50px] gap-3 px-2 h-10 items-center whitespace-nowrap ${getHighlightBgClass(team.teamId)}`}
                        >
                          <div className="min-w-0">
                            <span className="font-medium text-sm text-neutral-n4 dark:text-snow-200 truncate block w-[140px]">
                              {team.team}
                            </span>
                          </div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.played}</div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.wins}</div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.losses}</div>
                          <div className="text-center text-sm text-neutral-n4 dark:text-snow-200">{team.tied}</div>
                          <div className="text-center font-semibold text-sm text-neutral-n4 dark:text-snow-200">{team.points}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-6 lg:block-style p-4 md:p-6">
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 text-sm">
            <div>
              <span className="font-semibold text-brand-primary">#:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Position</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">Team:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Team</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">P:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Played</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">W:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Wins</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">L:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Losses</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">T:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Tied</span>
            </div>
            <div>
              <span className="font-semibold text-brand-primary">PTS:</span>{" "}
              <span className="text-neutral-n4 dark:text-snow-200">Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CricketStandingsTable;

