import { GitCompareArrows, Goal, ShoppingBasket, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlayerRatings } from "@/lib/api/endpoints";
import categories from "@/data/categoryList";

type CategoryItem = {
  label: string;
  variant: string;
  href: string;
};

const sportIcons: Record<string, React.ReactNode> = {
  Football: <Goal className="h-3.5 w-3.5" />,
  Basketball: <ShoppingBasket className="h-3.5 w-3.5" />,
  "American Football": <Shield className="h-3.5 w-3.5" />,
  Cricket: <img src="/icons/cricket-1.svg" alt="" className="h-3.5 w-3.5" />,
};

const posLabel: Record<string, string> = {
  F: "Forward",
  M: "Midfielder",
  G: "Goalkeeper",
  D: "Defender",
};

type TopPlayer = { name: string; position: string; rating: string; image: string };

const fallbackPlayers: TopPlayer[] = [
  { name: "L. Messi", position: "Forward", rating: "9.7", image: "https://cdn.tikianaly.com/soccer/player/119.png" },
  { name: "L. James", position: "Small Forward", rating: "9.5", image: "https://cdn.tikianaly.com/soccer/player/119.png" },
  { name: "P. Mahomes", position: "Quarterback", rating: "9.3", image: "https://cdn.tikianaly.com/soccer/player/119.png" },
];

export const Category = () => {
  const location = useLocation();
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res: any = await getPlayerRatings();
        const ratings: any[] = res?.responseObject?.item?.ratings ?? [];
        const withImage = ratings.filter((p: any) => p.playerImageUrl);
        const seen = new Set<string>();
        const unique: TopPlayer[] = [];
        for (const p of withImage) {
          if (seen.has(p.playerImageUrl)) continue;
          seen.add(p.playerImageUrl);
          unique.push({
            name: p.playerName ?? "Unknown",
            position: posLabel[p.pos] ?? p.pos ?? "N/A",
            rating: String(p.rating ?? ""),
            image: p.playerImageUrl,
          });
          if (unique.length === 3) break;
        }
        if (!cancelled) setTopPlayers(unique);
      } catch {
        if (!cancelled) setTopPlayers([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayPlayers = topPlayers.length === 3 ? topPlayers : fallbackPlayers;

  return (
    <div style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
      <div className="flex hide-scrollbar dark:bg-[#0D1117] w-full gap-2 overflow-x-auto overflow-y-hidden page-padding-x py-2 items-center">
        {categories.map((cat: CategoryItem) => {
          const isActive = location.pathname.startsWith(cat.href);

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
              {sportIcons[cat.label]}
              {cat.label}
            </Link>
          );
        })}

        <div className="flex items-center gap-1.5 rounded-full bg-brand-secondary pl-1.5 pr-1 py-0.5 h-fit shrink-0">
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
        </div>

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
      </div>
    </div>
  );
};

export default Category;

