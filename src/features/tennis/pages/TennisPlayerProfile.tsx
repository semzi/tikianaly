import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChartBarIcon,
  ClockIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";

type TennisPlayerTab = "season" | "history" | "info";

type TennisPlayerLocationState = {
  playerName?: string;
  opponentName?: string;
  tournament?: string;
};

const TennisPlayerProfile = () => {
  const { playerId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TennisPlayerTab>("season");

  const state = (location.state as TennisPlayerLocationState | undefined) ?? {};

  const playerName = useMemo(() => {
    if (state.playerName) return state.playerName;
    const raw = String(playerId ?? "").trim();
    if (!raw) return "Unknown Player";
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [playerId, state.playerName]);

  const tabs = [
    { id: "season" as TennisPlayerTab, label: "Season", icon: ChartBarIcon },
    { id: "history" as TennisPlayerTab, label: "History", icon: ClockIcon },
    {
      id: "info" as TennisPlayerTab,
      label: "Info",
      icon: InformationCircleIcon,
    },
  ];

  const seasonCards = [
    { label: "Ranking", value: "#7" },
    { label: "Win Rate", value: "74%" },
    { label: "Aces / Match", value: "6.1" },
    { label: "Break Points Saved", value: "64%" },
  ];

  const matchHistory = [
    {
      title: `${playerName} vs ${state.opponentName ?? "Top Opponent"}`,
      subtitle: state.tournament ?? "Tour Event",
      result: "W 2-1",
    },
    {
      title: `${playerName} vs Challenger`,
      subtitle: "Masters 1000",
      result: "W 2-0",
    },
    {
      title: `${playerName} vs Seeded Opponent`,
      subtitle: "Grand Slam",
      result: "L 1-2",
    },
  ];

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />

      <section className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.2) 0 10%, transparent 11%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.14) 0 12%, transparent 13%)",
          }}
        />
        <div className="page-padding-x relative z-10 py-4 md:py-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-sm text-white/95 hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white/90 text-slate-700 flex items-center justify-center text-3xl font-black">
                {String(playerName).charAt(0)}
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-extrabold">
                  {playerName}
                </p>
                <p className="text-sm md:text-base text-white/85">
                  {state.tournament ?? "Professional Tennis Tour"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {seasonCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl bg-white/15 backdrop-blur-md px-3 py-2"
                >
                  <p className="text-xs uppercase tracking-wide text-white/75">
                    {card.label}
                  </p>
                  <p className="text-lg font-bold">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex h-12 w-full overflow-x-auto bg-brand-p3/30 dark:bg-brand-p2 backdrop-blur-2xl sticky top-0 z-20 hide-scrollbar">
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
        {activeTab === "season" ? (
          <div className="grid md:grid-cols-2 gap-4">
            {seasonCards.map((card) => (
              <div
                key={card.label}
                className="block-style border border-snow-200 dark:border-[#1F2937]"
              >
                <p className="text-xs uppercase tracking-wide text-neutral-n4">
                  {card.label}
                </p>
                <p className="text-2xl font-bold theme-text mt-1">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === "history" ? (
          <div className="block-style !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] bg-snow-100/50 dark:bg-white/5">
              <p className="font-bold uppercase text-sm theme-text tracking-wide">
                Recent Matches
              </p>
            </div>
            <div className="divide-y divide-snow-200 dark:divide-[#1F2937]">
              {matchHistory.map((item, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  className="px-5 py-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold theme-text">{item.title}</p>
                    <p className="text-sm text-neutral-n4">{item.subtitle}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-snow-200 dark:bg-[#1F2937] text-sm font-bold theme-text">
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "info" ? (
          <div className="block-style">
            <p className="text-xs uppercase tracking-wide text-neutral-n4">
              Player ID
            </p>
            <p className="theme-text font-semibold mt-1">{playerId ?? "-"}</p>
            <p className="text-sm text-neutral-n4 mt-3">
              This profile is now styled to match other sports detail pages and
              is ready for live tennis player API data.
            </p>
          </div>
        ) : null}
      </div>

      <FooterComp />
    </div>
  );
};

export default TennisPlayerProfile;
