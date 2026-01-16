import { useEffect } from "react";

type StatItem = {
  label: string;
  value: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onViewProfile?: () => void;
  playerName?: string;
  playerImageUrl?: string;
  stats?: StatItem[];
};

const PlayerStatsBottomSheet = ({ open, onClose, onViewProfile, playerName, playerImageUrl, stats }: Props) => {
  const demoStats: StatItem[] = [
    { label: "Rating", value: "7.4" },
    { label: "Minutes", value: "90" },
    { label: "Goals", value: "1" },
    { label: "Assists", value: "0" },
    { label: "Pass accuracy", value: "86%" },
    { label: "Duels", value: "14" },
    { label: "Duels won", value: "8" },
    { label: "Dribble attempts", value: "5" },
    { label: "Dribbles completed", value: "3" },
    { label: "Shots", value: "3" },
    { label: "Shots on target", value: "2" },
    { label: "Key passes", value: "2" },
    { label: "Tackles", value: "2" },
    { label: "Interceptions", value: "1" },
    { label: "Fouls drawn", value: "2" },
    { label: "Fouls committed", value: "1" },
    { label: "Offsides", value: "1" },
    { label: "Total crosses", value: "4" },
    { label: "Accurate crosses", value: "2" },
    { label: "Blocks", value: "1" },
    { label: "Clearances", value: "3" },
    { label: "Dispossessed", value: "2" },
    { label: "Aerials won", value: "2" },
    { label: "Dribbled past", value: "1" },
    { label: "Yellow cards", value: "1" },
  ];

  const statsArray = Array.isArray(stats) && stats.length ? stats : demoStats;
  const getStat = (label: string) => statsArray.find((s) => s.label === label)?.value;

  const rating = getStat("Rating");
  const minutes = getStat("Minutes");
  const goals = getStat("Goals");
  const assists = getStat("Assists");
  const passAcc = getStat("Pass accuracy");
  const duelsWon = getStat("Duels won");
  const duels = getStat("Duels");
  const dribbles = getStat("Dribbles completed");
  const dribbleAttempts = getStat("Dribble attempts");

  const highlightCards: Array<{ label: string; value: string }> = [];
  if (minutes) highlightCards.push({ label: "Minutes", value: minutes });
  if (goals) highlightCards.push({ label: "Goals", value: goals });
  if (assists) highlightCards.push({ label: "Assists", value: assists });
  if (passAcc) highlightCards.push({ label: "Pass acc (%)", value: passAcc });

  const ratioCards: Array<{ label: string; value: string }> = [];
  if (duelsWon && duels) ratioCards.push({ label: "Duels", value: `${duelsWon}/${duels}` });
  if (dribbles && dribbleAttempts) ratioCards.push({ label: "Dribbles", value: `${dribbles}/${dribbleAttempts}` });

  const remainingStats = statsArray.filter(
    (s) => !["Rating", "Minutes", "Goals", "Assists", "Pass accuracy", "Duels", "Duels won", "Dribble attempts", "Dribbles completed"].includes(s.label)
  );

  const ratingNum = (() => {
    const raw = String(rating ?? "").trim();
    if (!raw) return null;
    const n = Number(raw.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : null;
  })();

  const statAccent = (label: string) => {
    const key = String(label).toLowerCase();
    if (key.includes("goal") || key.includes("assist")) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    if (key.includes("pass") || key.includes("key")) return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
    if (key.includes("duel") || key.includes("aerial")) return "bg-violet-500/10 text-violet-700 dark:text-violet-300";
    if (key.includes("dribble")) return "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300";
    if (key.includes("tackle") || key.includes("interception") || key.includes("clear")) return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
    if (key.includes("save") || key.includes("punch") || key.includes("claim")) return "bg-teal-500/10 text-teal-700 dark:text-teal-300";
    if (key.includes("yellow") || key.includes("red")) return "bg-rose-500/10 text-rose-700 dark:text-rose-300";
    return "bg-snow-100 dark:bg-snow-100/5 theme-text";
  };

  const ratingTone = (() => {
    if (ratingNum == null) {
      return {
        ring: "border-snow-200 dark:border-snow-100/10",
        bg: "bg-snow-100 dark:bg-snow-100/5",
        text: "theme-text",
      };
    }
    if (ratingNum >= 7.0) {
      return {
        ring: "border-emerald-500/50 dark:border-emerald-400/40",
        bg: "bg-emerald-500/10 dark:bg-emerald-400/10",
        text: "text-emerald-700 dark:text-emerald-300",
      };
    }
    if (ratingNum >= 6.0) {
      return {
        ring: "border-amber-500/50 dark:border-amber-400/40",
        bg: "bg-amber-500/10 dark:bg-amber-400/10",
        text: "text-amber-700 dark:text-amber-300",
      };
    }
    return {
      ring: "border-rose-500/50 dark:border-rose-400/40",
      bg: "bg-rose-500/10 dark:bg-rose-400/10",
      text: "text-rose-700 dark:text-rose-300",
    };
  })();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[200] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      <div
        className={`absolute left-0 right-0 bottom-0 transition-transform duration-200 will-change-transform ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-[70vh] mb-16 md:mb-1 rounded-t-2xl bg-white dark:bg-[#0D1117] border-t border-snow-200 dark:border-snow-100/10 overflow-hidden flex flex-col">
          <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={playerImageUrl || "/loading-state/player.svg"}
                alt={playerName || "Player"}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/loading-state/player.svg";
                }}
              />
              <div className="min-w-0">
                <p className="font-semibold theme-text truncate">{playerName || "Player"}</p>
                <p className="text-xs text-neutral-m6">Match stats</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-snow-200/60 dark:bg-snow-100/10 theme-text flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="px-4 pb-3 flex-1 min-h-0 flex flex-col">
            {statsArray.length ? (
              <>
                <div
                  className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y pr-1"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-16 h-16 border-4 ${ratingTone.ring} ${ratingTone.bg} flex items-center justify-center flex-shrink-0`}
                        aria-label="Rating"
                      >
                        <span className={`text-lg font-extrabold tabular-nums ${ratingTone.text}`}>{rating || "-"}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="theme-text font-semibold truncate">Performance</p>
                        <p className="text-xs text-neutral-m6">Rating</p>
                      </div>
                    </div>

                    {(highlightCards.length || ratioCards.length) ? (
                      <div className="grid grid-cols-2 gap-2">
                        {highlightCards.slice(0, 4).map((c) => (
                          <div
                            key={`h-${c.label}`}
                            className="rounded-xl px-3 py-2 bg-snow-100 dark:bg-snow-100/5 border border-snow-200 dark:border-snow-100/10"
                          >
                            <p className="text-[11px] text-neutral-m6">{c.label}</p>
                            <p className="theme-text font-semibold tabular-nums">{c.value}</p>
                          </div>
                        ))}
                        {ratioCards.slice(0, 2).map((c) => (
                          <div
                            key={`r-${c.label}`}
                            className="rounded-xl px-3 py-2 bg-snow-100 dark:bg-snow-100/5 border border-snow-200 dark:border-snow-100/10"
                          >
                            <p className="text-[11px] text-neutral-m6">{c.label}</p>
                            <p className="theme-text font-semibold tabular-nums">{c.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {remainingStats.length ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {remainingStats.map((s) => (
                          <div
                            key={s.label}
                            className={`rounded-xl px-3 py-2 border border-snow-200 dark:border-snow-100/10 ${statAccent(s.label)}`}
                          >
                            <p className="text-[11px] opacity-70 truncate">{s.label}</p>
                            <p className="text-[14px] font-extrabold tabular-nums truncate">{s.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div
                  className="pt-1 flex-shrink-0"
                  style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
                >
                  <button
                    type="button"
                    onClick={onViewProfile}
                    disabled={!onViewProfile}
                    className={`w-full h-12 rounded-xl font-semibold ${
                      onViewProfile
                        ? "bg-brand-primary text-white"
                        : "bg-snow-200 dark:bg-snow-100/10 text-neutral-m6 cursor-not-allowed"
                    }`}
                  >
                    View Player Profile
                  </button>
                </div>
              </>
            ) : (
              <div className="py-10">
                <p className="theme-text text-center">No player stats available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsBottomSheet;
