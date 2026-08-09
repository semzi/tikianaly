import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChartBarIcon,
  InformationCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import type { TennisMatch } from "../data/mockTennis";

type TennisGameTab = "stats" | "timeline" | "info";

type TennisGameLocationState = {
  match?: TennisMatch;
};

const TennisGame = () => {
  const { matchId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TennisGameTab>("stats");

  const state = (location.state as TennisGameLocationState | undefined) ?? {};

  const match = useMemo<TennisMatch>(
    () =>
      state.match ?? {
        id: String(matchId ?? "tennis-game"),
        tournament: "Tennis Match",
        round: "Round",
        court: "Center Court",
        status: "Not Started",
        startTime: "--:--",
        player1: { name: "Home Player", score: "-" },
        player2: { name: "Away Player", score: "-" },
        setScores: [],
      },
    [state.match, matchId],
  );

  const gameId = useMemo(() => {
    const raw = String(matchId ?? "").trim();
    if (!raw) return "Unknown";
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [matchId]);

  const tabs = [
    { id: "stats" as TennisGameTab, label: "Stats", icon: ChartBarIcon },
    { id: "timeline" as TennisGameTab, label: "Timeline", icon: ClockIcon },
    {
      id: "info" as TennisGameTab,
      label: "Info",
      icon: InformationCircleIcon,
    },
  ];

  const setScores = match.setScores ?? [];

  const playerOneSetsWon = setScores.filter(
    (s) => Number(s.p1) > Number(s.p2),
  ).length;
  const playerTwoSetsWon = setScores.filter(
    (s) => Number(s.p2) > Number(s.p1),
  ).length;

  const statsRows = [
    {
      label: "Aces",
      p1: setScores.length > 0 ? 6 + setScores.length : 4,
      p2: setScores.length > 0 ? 5 + Math.max(setScores.length - 1, 0) : 3,
    },
    {
      label: "Double Faults",
      p1: setScores.length > 0 ? 2 + Math.max(setScores.length - 1, 0) : 2,
      p2: setScores.length > 0 ? 3 + Math.max(setScores.length - 2, 0) : 3,
    },
    {
      label: "1st Serve %",
      p1: setScores.length > 0 ? 64 : 61,
      p2: setScores.length > 0 ? 62 : 59,
    },
    {
      label: "Break Points Won",
      p1: setScores.length > 0 ? 4 : 2,
      p2: setScores.length > 0 ? 3 : 1,
    },
  ];

  const timelineRows = [
    {
      time: "Set 1",
      event: `${match.player1.name} took the first set`,
      side: "p1",
    },
    {
      time: "Set 2",
      event: `${match.player2.name} responded strongly`,
      side: "p2",
    },
    {
      time: "Now",
      event: `${String(match.status)} - ${String(match.startTime)}`,
      side: "neutral",
    },
  ];

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />

      <section className="relative isolate overflow-hidden bg-gradient-to-r from-orange-500 via-orange-500 to-pink-600 text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px)",
          }}
        />

        <div className="page-padding-x relative z-10 py-4 md:py-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-sm text-white/95 hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          <div className="grid grid-cols-3 items-center gap-3 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-white/90 text-neutral-700 flex items-center justify-center text-lg md:text-2xl font-bold">
                {String(match.player1.name).charAt(0)}
              </div>
              <p className="mt-2 text-sm md:text-3xl font-semibold">
                {match.player1.name}
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="px-3 py-1 rounded-full bg-white text-orange-600 text-xs md:text-sm font-bold uppercase tracking-wide">
                {String(match.status)}
              </span>
              <p className="mt-2 text-xl md:text-5xl font-black tracking-wide">
                {playerOneSetsWon} - {playerTwoSetsWon}
              </p>
              <p className="mt-1 text-xs md:text-base text-white/90">
                {match.tournament}
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-white/90 text-neutral-700 flex items-center justify-center text-lg md:text-2xl font-bold">
                {String(match.player2.name).charAt(0)}
              </div>
              <p className="mt-2 text-sm md:text-3xl font-semibold">
                {match.player2.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex h-12 w-full overflow-x-auto bg-brand-p3/30 dark:bg-gray-800 backdrop-blur-2xl sticky top-0 z-20 hide-scrollbar">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 flex items-center gap-1 ${
                  activeTab === tab.id
                    ? "text-orange-500 font-medium border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="page-padding-x my-8">
        {activeTab === "stats" ? (
          <div className="block-style !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
              <p className="font-bold uppercase text-sm theme-text tracking-wide">
                Tennis Match Statistics
              </p>
            </div>

            <div className="p-5 space-y-6">
              {statsRows.map((row) => {
                const total = row.p1 + row.p2;
                const p1Width = total > 0 ? (row.p1 / total) * 100 : 50;
                const p2Width = total > 0 ? (row.p2 / total) * 100 : 50;

                return (
                  <div key={row.label} className="space-y-2">
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold theme-text uppercase tracking-wider">
                        {row.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-bold theme-text text-right">
                          {row.p1}
                        </p>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-500"
                            style={{ width: `${p1Width}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-xs uppercase font-semibold text-neutral-n4">
                        vs
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-bold theme-text">{row.p2}</p>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-l from-blue-400 to-blue-500"
                            style={{ width: `${p2Width}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-xl border border-snow-200 dark:border-[#1F2937] p-4">
                <p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 mb-2">
                  Set Summary
                </p>
                {setScores.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {setScores.map((set, idx) => (
                      <div
                        key={`set-${idx}`}
                        className="flex items-center justify-between rounded-lg bg-snow-100 dark:bg-[#1F2937] px-3 py-2"
                      >
                        <span className="text-sm font-medium theme-text">
                          Set {idx + 1}
                        </span>
                        <span className="text-sm font-bold theme-text">
                          {set.p1} - {set.p2}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-n4">
                    No set data yet for this match.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "timeline" ? (
          <div className="block-style !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
              <p className="font-bold uppercase text-sm theme-text tracking-wide">
                Match Timeline
              </p>
            </div>
            <div className="p-5 space-y-3">
              {timelineRows.map((row, idx) => (
                <div
                  key={`${row.time}-${idx}`}
                  className="flex items-start gap-3 rounded-lg border border-snow-200 dark:border-[#1F2937] p-3"
                >
                  <div className="w-16 text-xs font-bold text-neutral-n4">
                    {row.time}
                  </div>
                  <div
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      row.side === "p1"
                        ? "bg-green-500"
                        : row.side === "p2"
                          ? "bg-blue-500"
                          : "bg-brand-secondary"
                    }`}
                  />
                  <p className="text-sm theme-text">{row.event}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "info" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="block-style">
              <p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 mb-2">
                Tournament
              </p>
              <p className="text-lg font-semibold theme-text">
                {match.tournament}
              </p>
              <p className="text-sm text-neutral-n4 mt-1">
                Round: {match.round ?? "-"}
              </p>
            </div>

            <div className="block-style">
              <p className="text-xs uppercase font-bold tracking-wide text-neutral-n4 mb-2">
                Match Details
              </p>
              <p className="text-sm theme-text">Court: {match.court ?? "-"}</p>
              <p className="text-sm theme-text">
                Start Time: {match.startTime}
              </p>
              <p className="text-sm theme-text">Match ID: {gameId}</p>
            </div>
          </div>
        ) : null}
      </div>

      <FooterComp />
    </div>
  );
};

export default TennisGame;
