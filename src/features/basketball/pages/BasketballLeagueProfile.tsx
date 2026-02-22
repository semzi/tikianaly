import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { BasketballStandingsTable } from "../components/standings/BasketballStandingsTable";
import Category from "@/features/dashboard/components/Category";
import { getBasketballLeagues } from "@/lib/api/endpoints";

interface LeagueInfo {
  id: number;
  name: string;
  type: string;
  country?: string;
  logo?: string;
  season?: string;
}

const BasketballLeagueProfile = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagueData = async () => {
      if (!leagueId) return;
      setLoading(true);
      try {
        const response = await getBasketballLeagues();
        if (response.success && response.responseObject) {
          const leagues = response.responseObject.items || [];
          const found = leagues.find(
            (l: any) =>
              String(l.id) === String(leagueId) ||
              String(l.leagueId) === String(leagueId) ||
              String(l.league_id) === String(leagueId),
          );
          if (found) {
            setLeagueInfo({
              id: found.league_id || found.leagueId || found.id,
              name: found.name,
              type: found.type || "League",
              country: found.country_name || found.country,
              logo: found.logo || found.image_path,
              season: found.season_name,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching league info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueData();
  }, [leagueId]);

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-[#0D1117]">
        <PageHeader />
        <Category />
        <div className="page-padding-x py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-snow-200 dark:bg-[#1F2937] rounded-xl" />
            <div className="h-96 bg-snow-200 dark:bg-[#1F2937] rounded-xl" />
          </div>
        </div>
        <FooterComp />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />
      <Category />

      <div className="flex page-padding-x gap-5 py-5 justify-around">
        {/* Main Content Area */}
        <div className="w-full pb-30 flex flex-col gap-y-5 h-full overflow-y-auto hide-scrollbar pr-2">
          {/* Header Banner */}
          <div className="secondary-gradient relative z-0 rounded-[10px] overflow-hidden shadow-lg">
            <div className="w-full px-6 py-8 relative z-0 flex items-center">
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors flex-shrink-0"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>

                <div className="bg-white p-3 rounded-xl shadow-lg flex-shrink-0">
                  <img
                    src={leagueInfo?.logo || "/loading-state/league.svg"}
                    alt={leagueInfo?.name}
                    className="w-20 h-20 object-contain"
                  />
                </div>

                <div className="text-center md:text-left text-white min-w-0">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md border border-white/10">
                      Basketball
                    </span>
                    <span className="bg-orange-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md border border-orange-500/20 text-orange-200">
                      {leagueInfo?.type}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight truncate">
                    {leagueInfo?.name || "League Profile"}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-snow-100 opacity-90 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{leagueInfo?.country || "International"}</span>
                    </div>
                    {leagueInfo?.season && (
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Season: {leagueInfo.season}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Standings Table */}
          <div className="block-style !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-snow-200 dark:border-[#1F2937]">
              <h2 className="text-lg font-bold theme-text">League Standings</h2>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <BasketballStandingsTable leagueId={leagueId} />
            </div>
          </div>
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default BasketballLeagueProfile;
