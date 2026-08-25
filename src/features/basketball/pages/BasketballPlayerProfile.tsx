import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { navigate } from "@/lib/router/navigate";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getBasketballPlayerDetail } from "@/lib/api/basketball/index";
import GetBasketballPlayerImage from "@/components/common/GetBasketballPlayerImage";

interface ShootingSplit {
  made?: number;
  attempts?: number;
}

interface PlayerInfo {
  id: number;
  name: string;
  team?: string;
  teamId?: string | number;
  isStarter?: boolean;
  minutes?: string;
  points?: number;
  assists?: number;
  rebounds?: { total: number; defense: number; offense: number };
  steals?: number;
  blocks?: number;
  turnovers?: number;
  personalFouls?: number;
  fieldGoals?: ShootingSplit;
  freethrows?: ShootingSplit;
  threePoints?: ShootingSplit;
  plusMinus?: number;
  efficiency?: number;
}

const asNumber = (value: unknown): number | undefined => {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const shootingPercent = (split?: ShootingSplit): string => {
  if (!split?.attempts) return "—";
  return `${((((split.made || 0) / split.attempts) * 100) || 0).toFixed(1)}%`;
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="rounded-2xl border border-snow-200 dark:border-white/10 bg-white dark:bg-[#161B22] p-5">
    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-n5">
      {label}
    </p>
    <p className="mt-2 text-lg font-bold text-brand-primary dark:text-white">
      {value ?? "—"}
    </p>
  </div>
);

const BasketballPlayerProfile: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;

    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const res: any = await getBasketballPlayerDetail(playerId);
        const item =
          res?.responseObject?.item ||
          res?.responseObject?.items?.[0] ||
          res?.responseObject ||
          null;

        setPlayerInfo({
          id: Number(item?.player_id ?? item?.id ?? playerId),
          name: String(item?.player_name || item?.name || "Unknown Player"),
          team: String(item?.team_name || ""),
          teamId: item?.team_id,
          isStarter: item?.is_starter,
          minutes: item?.minutes ? String(item.minutes) : undefined,
          points: asNumber(item?.points),
          assists: asNumber(item?.assists),
          rebounds: item?.rebounds
            ? {
                total: Number(item.rebounds.total ?? 0),
                defense: Number(item.rebounds.defense ?? 0),
                offense: Number(item.rebounds.offense ?? 0),
              }
            : undefined,
          steals: asNumber(item?.steals),
          blocks: asNumber(item?.blocks),
          turnovers: asNumber(item?.turnovers),
          personalFouls: asNumber(item?.personal_fouls),
          fieldGoals: item?.field_goals || undefined,
          freethrows: item?.freethrows || undefined,
          threePoints: item?.three_points || undefined,
          plusMinus: asNumber(item?.plus_minus),
          efficiency: asNumber(item?.efficiency),
        });
      } catch {
        // leave playerInfo as null
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-[#0D1117]">
        <PageHeader />
        <div className="page-padding-x py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-snow-200 dark:bg-white/10 rounded-2xl" />
            <div className="h-96 bg-snow-200 dark:bg-white/10 rounded-2xl" />
          </div>
        </div>
        <FooterComp />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#0D1117]">
      <PageHeader />

      <div className="secondary-gradient relative z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="page-padding-x py-12 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110 flex items-center justify-center w-10 h-10 border border-white/10 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 dark:bg-[#161B22]/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/5"
            >
              <GetBasketballPlayerImage
                playerId={playerId}
                alt={playerInfo?.name}
                className="w-28 h-28 md:w-36 md:h-36"
                width={144}
                height={144}
              />
            </motion.div>

            <div className="flex-1 text-center md:text-left text-white pb-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap justify-center md:justify-start gap-2 mb-4"
              >
                <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
                  Basketball
                </span>
                {playerInfo?.isStarter ? (
                  <span className="bg-orange-500/20 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md text-orange-100">
                    Starter
                  </span>
                ) : null}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-bold text-3xl md:text-5xl text-white"
              >
                {playerInfo?.name}
              </motion.h1>

              {playerInfo?.team ? (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mt-3 text-white/80 text-sm md:text-lg font-medium"
                >
                  {playerInfo.team}
                </motion.p>
              ) : null}

              {playerInfo?.minutes ? (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="mt-1 text-white/60 text-sm"
                >
                  {playerInfo.minutes} min
                </motion.p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="page-padding-x py-12 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Points" value={playerInfo?.points} />
          <StatCard label="Assists" value={playerInfo?.assists} />
          <StatCard label="Rebounds" value={playerInfo?.rebounds?.total} />
          <StatCard label="Efficiency" value={playerInfo?.efficiency} />
          <StatCard label="Steals" value={playerInfo?.steals} />
          <StatCard label="Blocks" value={playerInfo?.blocks} />
          <StatCard label="Turnovers" value={playerInfo?.turnovers} />
          <StatCard label="Personal Fouls" value={playerInfo?.personalFouls} />
          <StatCard label="Plus / Minus" value={playerInfo?.plusMinus} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-brand-primary dark:text-white mb-4">
            Shooting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-snow-200 dark:border-white/10 bg-white dark:bg-[#161B22] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-n5">
                Field Goals
              </p>
              <p className="mt-2 text-2xl font-bold text-brand-primary dark:text-white">
                {playerInfo?.fieldGoals?.made ?? "—"}
                <span className="text-base font-medium text-neutral-n5">
                  {" "}
                  / {playerInfo?.fieldGoals?.attempts ?? "—"}
                </span>
              </p>
              <p className="mt-1 text-sm text-neutral-n5">
                {shootingPercent(playerInfo?.fieldGoals)}
              </p>
            </div>

            <div className="rounded-2xl border border-snow-200 dark:border-white/10 bg-white dark:bg-[#161B22] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-n5">
                Three Pointers
              </p>
              <p className="mt-2 text-2xl font-bold text-brand-primary dark:text-white">
                {playerInfo?.threePoints?.made ?? "—"}
                <span className="text-base font-medium text-neutral-n5">
                  {" "}
                  / {playerInfo?.threePoints?.attempts ?? "—"}
                </span>
              </p>
              <p className="mt-1 text-sm text-neutral-n5">
                {shootingPercent(playerInfo?.threePoints)}
              </p>
            </div>

            <div className="rounded-2xl border border-snow-200 dark:border-white/10 bg-white dark:bg-[#161B22] p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-n5">
                Free Throws
              </p>
              <p className="mt-2 text-2xl font-bold text-brand-primary dark:text-white">
                {playerInfo?.freethrows?.made ?? "—"}
                <span className="text-base font-medium text-neutral-n5">
                  {" "}
                  / {playerInfo?.freethrows?.attempts ?? "—"}
                </span>
              </p>
              <p className="mt-1 text-sm text-neutral-n5">
                {shootingPercent(playerInfo?.freethrows)}
              </p>
            </div>
          </div>
        </div>

        {playerInfo?.rebounds ? (
          <div>
            <h2 className="text-lg font-bold text-brand-primary dark:text-white mb-3">
              Rebounds Breakdown
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Offense" value={playerInfo.rebounds.offense} />
              <StatCard label="Defense" value={playerInfo.rebounds.defense} />
              <StatCard label="Total" value={playerInfo.rebounds.total} />
            </div>
          </div>
        ) : null}
      </div>

      <FooterComp />
    </div>
  );
};

export default BasketballPlayerProfile;