import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import {
  mockAmericanFootballLiveMatches,
  mockAmericanFootballUpcomingMatches,
} from "../data/mockAmericanFootball";

const AmericanFootballMatchDetail = () => {
  const { matchId } = useParams();

  const match = useMemo(() => {
    return [
      ...mockAmericanFootballLiveMatches,
      ...mockAmericanFootballUpcomingMatches,
    ].find((item) => item.id === matchId);
  }, [matchId]);

  return (
    <div className="min-h-screen bg-snow-100 dark:bg-[#0F172A]">
      <PageHeader />

      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
        <div className="block-style space-y-4">
          {!match ? (
            <p className="text-sm text-[#586069] dark:text-snow-300">
              No preview available for this match yet.
            </p>
          ) : (
            <>
              <div className="rounded-2xl bg-brand-secondary/10 p-4">
                <p className="text-sm font-semibold text-brand-primary">
                  {match.league}
                </p>
                <p className="text-xl font-semibold text-[#23272A] dark:text-white">
                  {match.homeTeam} vs {match.awayTeam}
                </p>
                <p className="text-sm text-[#586069] dark:text-snow-300">
                  {match.status} • {match.period} • {match.clock}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-snow-200 p-4 dark:border-[#1F2937]">
                  <p className="text-sm font-semibold text-[#23272A] dark:text-white">
                    Match snapshot
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-[#586069] dark:text-snow-300">
                    <p>Venue: {match.venue}</p>
                    <p>Kickoff: {match.kickoff}</p>
                    <p>Score: {match.score}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-snow-200 p-4 dark:border-[#1F2937]">
                  <p className="text-sm font-semibold text-[#23272A] dark:text-white">
                    Preview
                  </p>
                  <p className="mt-3 text-sm text-[#586069] dark:text-snow-300">
                    {match.highlight}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default AmericanFootballMatchDetail;
