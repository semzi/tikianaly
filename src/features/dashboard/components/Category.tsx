import { GitCompareArrows, Goal, ShoppingBasket, Shield, X, ArrowUpRight, Star, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getPlayerRatings } from "@/lib/api/endpoints";
import categories from "@/data/categoryList";

type CategoryItem = {
  label: string;
  variant: string;
  href: string;
};

const getSportIcon = (label: string, isActive: boolean) => {
  switch (label) {
    case "Football":
      return <Goal className="h-3.5 w-3.5" />;
    case "Basketball":
      return <ShoppingBasket className="h-3.5 w-3.5" />;
    case "American Football":
      return <Shield className="h-3.5 w-3.5" />;
    case "Cricket":
      return (
        <img
          src="/icons/cricket-1.svg"
          alt=""
          className={`h-3.5 w-3.5 ${
            isActive ? "invert dark:invert-0" : "opacity-60 dark:invert dark:opacity-50"
          }`}
        />
      );
    default:
      return null;
  }
};

const posLabel: Record<string, string> = {
  F: "Forward",
  M: "Midfielder",
  G: "Goalkeeper",
  D: "Defender",
};

type TopPlayer = { name: string; position: string; rating: string; image: string };

type RatingEntry = {
  rating: number;
  matchId: number;
  playerId: number;
  playerName: string;
  playerImageUrl: string | null;
  pos: string;
};

const fallbackPlayers: TopPlayer[] = [
  { name: "L. Messi", position: "Forward", rating: "9.7", image: "https://cdn.tikianaly.com/soccer/player/119.png" },
  { name: "L. James", position: "Small Forward", rating: "9.5", image: "https://cdn.tikianaly.com/soccer/player/119.png" },
  { name: "P. Mahomes", position: "Quarterback", rating: "9.3", image: "https://cdn.tikianaly.com/soccer/player/119.png" },
];

const getRatingStyle = (rating: number): { bg: string; text: string } => {
  if (rating >= 8) return { bg: "#3b82f6", text: "#fff" };    // Blue
  if (rating >= 6) return { bg: "#22c55e", text: "#fff" };    // Green
  if (rating >= 5) return { bg: "#eab308", text: "#fff" };    // Yellow
  return { bg: "#ef4444", text: "#fff" };                      // Red
};

export const Category = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [allRatings, setAllRatings] = useState<RatingEntry[]>([]);
  const [showModal, setShowModal] = useState(false);

  const isFootballActive = location.pathname.startsWith("/football") || location.pathname === "/";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res: any = await getPlayerRatings();
        const ratings: RatingEntry[] = res?.responseObject?.item?.ratings ?? [];

        if (!cancelled) setAllRatings(ratings);

        const withImage = ratings.filter((p) => p.playerImageUrl);
        const seen = new Set<string>();
        const unique: TopPlayer[] = [];
        for (const p of withImage) {
          if (seen.has(p.playerImageUrl!)) continue;
          seen.add(p.playerImageUrl!);
          unique.push({
            name: p.playerName ?? "Unknown",
            position: posLabel[p.pos] ?? p.pos ?? "N/A",
            rating: String(p.rating ?? ""),
            image: p.playerImageUrl!,
          });
          if (unique.length === 3) break;
        }
        if (!cancelled) setTopPlayers(unique);
      } catch {
        if (!cancelled) {
          setTopPlayers([]);
          setAllRatings([]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayPlayers = topPlayers.length === 3 ? topPlayers : fallbackPlayers;

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  return (
    <>
      <div style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
        <div className="flex hide-scrollbar dark:bg-[#0D1117] w-full gap-2 overflow-x-auto overflow-y-hidden page-padding-x py-2 items-center">
          {categories.map((cat: CategoryItem) => {
            const isActive =
              location.pathname.startsWith(cat.href) ||
              (location.pathname === "/" && cat.label === "Football");

            return (
              <Link
                key={cat.label}
                to={cat.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-6 py-2 text-xs font-normal shrink-0 transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#0D1117] text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-neutral-500 dark:text-gray-400 border border-neutral-200 dark:border-white/20"
                }`}
              >
                {getSportIcon(cat.label, isActive)}
                {cat.label}
              </Link>
            );
          })}

          {isFootballActive && (
            <>
              <button
                type="button"
                onClick={openModal}
                className="flex items-center gap-1.5 rounded-full bg-brand-secondary pl-1.5 pr-1 py-0.5 h-fit shrink-0 cursor-pointer transition-transform active:scale-95"
              >
                <div className="flex items-center">
                  {displayPlayers.map((player, i) => (
                    <img
                      key={player.name}
                      src={player.image}
                      alt={player.name}
                      className={`h-6 w-6 rounded-full object-cover bg-white/20 ring-1 ring-brand-secondary ${i > 0 ? "-ml-1.5" : ""}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-semibold text-white whitespace-nowrap leading-none">Top Rated Players</span>
                <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center">
                  <svg className="h-3.5 w-3.5 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <Link
                to="/player/compare"
                className="flex items-center gap-1.5 rounded-full bg-black dark:bg-white pl-1.5 pr-1 py-0.5 h-fit shrink-0"
              >
                <img
                  src={displayPlayers[0].image}
                  alt={displayPlayers[0].name}
                  className="h-6 w-6 rounded-full object-cover bg-white/20 ring-1 ring-black dark:ring-white"
                />
                <GitCompareArrows className="h-3.5 w-3.5 text-white/70 dark:text-black/70" />
                <img
                  src={displayPlayers[1].image}
                  alt={displayPlayers[1].name}
                  className="h-6 w-6 rounded-full object-cover bg-white/20 ring-1 ring-black dark:ring-white"
                />
                <span className="text-[10px] font-semibold text-white dark:text-black whitespace-nowrap leading-none">Compare Players</span>
                <div className="h-7 w-7 rounded-full bg-white dark:bg-black flex items-center justify-center">
                  <svg className="h-3.5 w-3.5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Top Rated Players Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative w-full sm:max-w-md max-h-[85vh] bg-white dark:bg-[#161B22] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Drag indicator (mobile) */}
              <div className="flex justify-center pt-3 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-brand-secondary/15 flex items-center justify-center">
                    <Star className="h-4.5 w-4.5 text-brand-secondary" fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold theme-text leading-tight">Top Rated Players</h2>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                      {allRatings.length} players • Highest ratings
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4 theme-text" />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-200 dark:bg-white/10 mx-5" />

              {/* Player List */}
              <div className="overflow-y-auto flex-1 px-4 py-2">
                {allRatings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-neutral-400 dark:text-neutral-500">
                    <User className="h-10 w-10 mb-3 opacity-50" />
                    <p className="text-sm font-medium">No rated players available</p>
                  </div>
                ) : (
                  allRatings.map((player, idx) => {
                    const ratingNum = player.rating;
                    const rStyle = getRatingStyle(ratingNum);

                    return (
                      <motion.div
                        key={`${player.playerId}-${player.matchId}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.25 }}
                        className="flex items-center gap-2 py-1.5 px-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* Rank */}
                        <span className="text-[10px] font-bold text-neutral-300 dark:text-neutral-600 w-3.5 text-center shrink-0 tabular-nums">
                          {idx + 1}
                        </span>

                        {/* Player Image */}
                        <div className="relative shrink-0">
                          {player.playerImageUrl ? (
                            <img
                              src={player.playerImageUrl}
                              alt={player.playerName}
                              className="h-8 w-8 rounded-full object-cover bg-neutral-100 dark:bg-white/10 ring-1 ring-neutral-200 dark:ring-white/10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <div className={`h-8 w-8 rounded-full bg-neutral-200 dark:bg-white/10 flex items-center justify-center ring-1 ring-neutral-200 dark:ring-white/10 ${player.playerImageUrl ? "hidden" : ""}`}>
                            <User className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                          </div>
                        </div>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => {
                              closeModal();
                              navigate(`/player/profile/${player.playerId}`);
                            }}
                            className="text-[13px] font-semibold theme-text hover:text-brand-secondary transition-colors truncate block max-w-full text-left cursor-pointer"
                          >
                            {player.playerName}
                          </button>
                          <span className="inline-flex items-center mt-0.5 text-[11px] font-medium text-neutral-500 dark:text-snow-200">
                            {posLabel[player.pos] ?? player.pos}
                          </span>
                        </div>

                        {/* Rating Badge */}
                        <div
                          className="shrink-0 flex items-center justify-center h-7 min-w-[38px] rounded-md font-bold text-xs tabular-nums"
                          style={{ backgroundColor: rStyle.bg, color: rStyle.text }}
                        >
                          {ratingNum.toFixed(1)}
                        </div>

                        {/* Go to Match */}
                        <div className="relative shrink-0 flex items-center">
                          {idx === 0 && (
                            <motion.div
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.3,
                                x: { type: "spring", repeat: Infinity, repeatType: "reverse", duration: 0.5 }
                              }}
                              className="absolute right-[calc(100%+8px)] whitespace-nowrap bg-brand-secondary text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm pointer-events-none z-10"
                            >
                              View match
                              <div className="absolute top-1/2 right-[-4px] -translate-y-1/2 border-y-[4px] border-y-transparent border-l-[4px] border-l-brand-secondary" />
                            </motion.div>
                          )}
                          <motion.button
                            type="button"
                            animate={idx === 0 ? {
                              scale: [1, 1.1, 1],
                              boxShadow: [
                                "0 0 0 0 rgba(255, 69, 0, 0.4)",
                                "0 0 0 4px rgba(255, 69, 0, 0)",
                                "0 0 0 0 rgba(255, 69, 0, 0)"
                              ]
                            } : {}}
                            transition={idx === 0 ? { duration: 1.5, repeat: 1, ease: "easeInOut" } : {}}
                            onClick={() => {
                              closeModal();
                              navigate(`/football/gameinfo/${player.matchId}`);
                            }}
                            className="h-7 w-7 rounded-md bg-neutral-100 dark:bg-white/8 flex items-center justify-center hover:bg-brand-secondary/15 hover:text-brand-secondary transition-colors cursor-pointer text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                            title="View match"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Category;

