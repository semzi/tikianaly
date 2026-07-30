import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { format, isToday } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import Category from "@/features/dashboard/components/Category";
import { CricketLeftBar } from "../components/CricketLeftBar";
import {
  mockCricketLeagues,
  mockCricketMatches,
  mockCricketStandings,
} from "../data/mockCricket";
import { navigate } from "@/lib/router/navigate";

const badgeText = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const CricketLeagueProfile = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const league = useMemo(
    () =>
      mockCricketLeagues.find((item) => String(item.id) === String(leagueId)) ??
      mockCricketLeagues[0],
    [leagueId],
  );

  const [activeTab, setActiveTab] = useState<"overview" | "fixtures" | "standings">(
    "overview",
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fixtures = useMemo(
    () => mockCricketMatches.filter((match) => match.leagueId === league.id),
    [league.id],
  );

  const standings = mockCricketStandings[league.id] ?? [];

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />
      <Category />

      <div className="page-padding-x py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
          <aside className="hidden lg:block">
            <CricketLeftBar />
          </aside>

          <main className="min-w-0">
            <button
              type="button"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#586069] dark:text-snow-200"
              onClick={() => navigate("/cricket/leagues")}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to leagues
            </button>

            <section className="rounded-3xl border border-snow-200 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] p-6 text-white shadow-lg dark:border-white/10">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-black text-white"
                    style={{ backgroundColor: league.accent }}
                  >
                    {badgeText(league.name)}
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/55">
                    {league.region}
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
                    {league.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">
                    {league.description}
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-white/80 md:min-w-[260px]">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-white/55">Season</p>
                    <p className="mt-1 font-semibold text-white">{league.season}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-white/55">Format</p>
                    <p className="mt-1 font-semibold text-white">{league.format}</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-snow-200 dark:border-[#1F2937]">
              {[
                { id: "overview" as const, label: "Overview" },
                { id: "fixtures" as const, label: "Fixtures" },
                { id: "standings" as const, label: "Standings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`px-5 py-3 text-sm font-semibold ${
                    activeTab === tab.id
                      ? "border-b-2 border-brand-secondary text-brand-secondary"
                      : "text-[#586069] dark:text-snow-200"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}

              {activeTab === "fixtures" ? (
                <div className="relative ml-auto">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-snow-200 px-4 py-2 text-sm text-[#586069] dark:border-white/10 dark:text-snow-200"
                    onClick={() => setShowDatePicker((value) => !value)}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate && isToday(selectedDate)
                      ? "Today"
                      : selectedDate
                        ? format(selectedDate, "dd MMM")
                        : "Pick date"}
                  </button>
                  {showDatePicker ? (
                    <div className="absolute right-0 top-full z-20 mt-2 rounded-2xl border border-snow-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#111827]">
                      <DatePicker
                        inline
                        selected={selectedDate}
                        onChange={(date: any) => {
                          setSelectedDate(date);
                          setShowDatePicker(false);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {activeTab === "overview" ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Teams", value: league.teams },
                  { label: "Region", value: league.region },
                  { label: "Format", value: league.format },
                  { label: "Season", value: league.season },
                ].map((item) => (
                  <div key={item.label} className="block-style">
                    <p className="text-sm text-neutral-500 dark:text-snow-200">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#23272A] dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {activeTab === "overview" ? (
              <div className="mt-6 block-style">
                <p className="font-semibold text-[#23272A] dark:text-white">
                  League notes
                </p>
                <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-snow-200">
                  {league.name} is shown with demo data so the layout can be reviewed
                  without waiting for live endpoints. The page keeps the same card
                  style, spacing, and dark/light treatments as the rest of the sports
                  area.
                </p>
              </div>
            ) : null}

            {activeTab === "fixtures" ? (
              <div className="mt-6 space-y-4">
                {fixtures.map((match) => (
                  <div key={match.id} className="block-style">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-brand-secondary/15 px-3 py-1 text-xs font-semibold text-brand-secondary">
                        {match.status}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-snow-200">
                        {match.startTime} · {match.format}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#23272A] dark:text-white">
                          {match.homeTeam.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-snow-200">
                          {match.homeTeam.score}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-snow-100 px-5 py-4 text-center dark:bg-white/5">
                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-snow-200">
                          {match.over}
                        </p>
                        <p className="mt-2 text-lg font-bold text-[#23272A] dark:text-white">
                          {match.result}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#23272A] dark:text-white">
                          {match.awayTeam.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-snow-200">
                          {match.awayTeam.score}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-snow-200">
                      <MapPinIcon className="h-4 w-4" />
                      {match.venue}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {activeTab === "standings" ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-snow-200 dark:border-[#1F2937]">
                <div className="border-b border-snow-200 px-5 py-4 dark:border-[#1F2937]">
                  <p className="font-semibold text-[#23272A] dark:text-white">
                    Standings
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-snow-200 text-left dark:divide-[#1F2937]">
                    <thead className="bg-snow-50 dark:bg-white/5">
                      <tr className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-snow-200">
                        <th className="px-5 py-3">Pos</th>
                        <th className="px-5 py-3">Team</th>
                        <th className="px-5 py-3">P</th>
                        <th className="px-5 py-3">W</th>
                        <th className="px-5 py-3">L</th>
                        <th className="px-5 py-3">Pts</th>
                        <th className="px-5 py-3">NRR</th>
                        <th className="px-5 py-3">Form</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-snow-200 dark:divide-[#1F2937]">
                      {standings.map((row) => (
                        <tr key={row.team} className="text-sm text-[#23272A] dark:text-white">
                          <td className="px-5 py-3 font-semibold">{row.position}</td>
                          <td className="px-5 py-3">{row.team}</td>
                          <td className="px-5 py-3">{row.played}</td>
                          <td className="px-5 py-3">{row.won}</td>
                          <td className="px-5 py-3">{row.lost}</td>
                          <td className="px-5 py-3 font-semibold">{row.points}</td>
                          <td className="px-5 py-3">{row.nrr}</td>
                          <td className="px-5 py-3 text-neutral-500 dark:text-snow-200">
                            {row.form}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </main>

          <aside className="hidden xl:block">
            <CricketLeftBar />
          </aside>
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default CricketLeagueProfile;
