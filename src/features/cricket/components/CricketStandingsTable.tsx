import { useState } from "react";
import { SegmentedSelector } from "@/components/ui/SegmentedSelector";
import { mockCricketStandings, type CricketStanding } from "../data/mockCricket";

type ViewMode = "short" | "form";

type Props = {
  leagueId: number;
  league: string;
  highlightTeams?: string[];
};

const FormDot = ({ r }: { r: string }) => {
  const bg =
    r === "W"
      ? "bg-emerald-500"
      : r === "L"
      ? "bg-rose-500"
      : "bg-slate-400 dark:bg-slate-500";
  return <span className={`w-2.5 h-2.5 rounded-full inline-block ${bg}`} title={r} />;
};

export const CricketStandingsTable = ({ leagueId, league, highlightTeams = [] }: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>("short");

  const standings: CricketStanding[] = mockCricketStandings[leagueId] ?? [];

  if (standings.length === 0) {
    return (
      <div className="block-style text-sm text-neutral-500 dark:text-neutral-400 py-8 text-center">
        No standings data available.
      </div>
    );
  }

  const isHighlighted = (team: string) => highlightTeams.includes(team);

  const renderForm = (form: string) =>
    form.split("").map((r, i) => <FormDot key={i} r={r} />);

  return (
    <div className="block-style !p-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937] flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-[#23272A] dark:text-white">{league}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">League Standings</p>
        </div>
        <div className="w-40">
          <SegmentedSelector
            value={viewMode}
            onChange={(v) => setViewMode(v as ViewMode)}
            size="sm"
            options={[
              { value: "short", label: "Table" },
              { value: "form", label: "Form" },
            ]}
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-neutral-400 dark:text-neutral-500 border-b border-snow-200 dark:border-[#1F2937] whitespace-nowrap">
              <th className="text-left px-5 py-3 font-medium w-10">#</th>
              <th className="text-left py-3 font-medium">Team</th>
              <th className="text-center py-3 font-medium">P</th>
              <th className="text-center py-3 font-medium">W</th>
              <th className="text-center py-3 font-medium">L</th>
              <th className="text-center py-3 font-medium">Pts</th>
              <th className="text-center py-3 font-medium">NRR</th>
              {viewMode === "form" && (
                <th className="text-center pr-5 py-3 font-medium">Form</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-snow-200 dark:divide-[#1F2937]">
            {standings.map((s) => {
              const highlighted = isHighlighted(s.team);
              return (
                <tr
                  key={s.team}
                  className={`transition-colors relative ${
                    highlighted
                      ? "bg-brand-secondary/5 dark:bg-brand-secondary/10"
                      : "hover:bg-snow-50 dark:hover:bg-white/5"
                  }`}
                >
                  <td className="relative px-5 py-3 text-neutral-500 dark:text-neutral-400 font-medium">
                    {highlighted && (
                      <span className="absolute left-0 top-[15%] bottom-[15%] w-1 rounded-r-md bg-brand-secondary" />
                    )}
                    {s.position}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-medium ${
                        highlighted ? "text-brand-secondary" : "text-[#23272A] dark:text-white"
                      }`}
                    >
                      {s.team}
                    </span>
                  </td>
                  <td className="text-center py-3 text-neutral-500 dark:text-neutral-400">{s.played}</td>
                  <td className="text-center py-3 text-neutral-500 dark:text-neutral-400">{s.won}</td>
                  <td className="text-center py-3 text-neutral-500 dark:text-neutral-400">{s.lost}</td>
                  <td className="text-center py-3 font-bold text-[#23272A] dark:text-white">{s.points}</td>
                  <td
                    className={`text-center py-3 text-xs font-medium ${
                      s.nrr.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                    }`}
                  >
                    {s.nrr}
                  </td>
                  {viewMode === "form" && (
                    <td className="text-center pr-5 py-3">
                      <div className="flex gap-1 justify-center">{renderForm(s.form)}</div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile table */}
      <div className="block md:hidden overflow-x-hidden">
        <div
          className={`grid ${
            viewMode === "form"
              ? "grid-cols-[32px_1fr_36px_44px_44px_70px]"
              : "grid-cols-[32px_1fr_36px_44px_44px]"
          } gap-2 px-3 py-2 border-b border-snow-200 dark:border-[#1F2937] text-xs font-medium text-neutral-400 dark:text-neutral-500 whitespace-nowrap`}
        >
          <div className="text-center">#</div>
          <div>Team</div>
          <div className="text-center">P</div>
          <div className="text-center">Pts</div>
          <div className="text-center">NRR</div>
          {viewMode === "form" && <div className="text-center">Form</div>}
        </div>

        <div className="flex flex-col divide-y divide-snow-200 dark:divide-[#1F2937]">
          {standings.map((s) => {
            const highlighted = isHighlighted(s.team);
            return (
              <div
                key={s.team}
                className={`grid ${
                  viewMode === "form"
                    ? "grid-cols-[32px_1fr_36px_44px_44px_70px]"
                    : "grid-cols-[32px_1fr_36px_44px_44px]"
                } gap-2 px-3 h-12 relative items-center whitespace-nowrap transition-colors ${
                  highlighted
                    ? "bg-brand-secondary/5 dark:bg-brand-secondary/10"
                    : "hover:bg-snow-50 dark:hover:bg-white/5"
                }`}
              >
                {highlighted && (
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-1 rounded-r-md bg-brand-secondary" />
                )}
                <div className="text-center font-medium text-sm text-neutral-500 dark:text-neutral-400">
                  {s.position}
                </div>
                <div className="min-w-0">
                  <span
                    className={`font-medium text-sm truncate block ${
                      highlighted ? "text-brand-secondary" : "text-[#23272A] dark:text-white"
                    }`}
                  >
                    {s.team}
                  </span>
                </div>
                <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">{s.played}</div>
                <div className="text-center text-sm font-bold text-[#23272A] dark:text-white">{s.points}</div>
                <div
                  className={`text-center text-xs font-medium ${
                    s.nrr.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                  }`}
                >
                  {s.nrr}
                </div>
                {viewMode === "form" && (
                  <div className="flex gap-1 justify-center">{renderForm(s.form)}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-snow-200 dark:border-[#1F2937] grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span><span className="font-semibold text-[#23272A] dark:text-white">P:</span> Played</span>
        <span><span className="font-semibold text-[#23272A] dark:text-white">W:</span> Won</span>
        <span><span className="font-semibold text-[#23272A] dark:text-white">L:</span> Lost</span>
        <span><span className="font-semibold text-[#23272A] dark:text-white">Pts:</span> Points</span>
        <span><span className="font-semibold text-[#23272A] dark:text-white">NRR:</span> Net Run Rate</span>
      </div>
    </div>
  );
};

export default CricketStandingsTable;
