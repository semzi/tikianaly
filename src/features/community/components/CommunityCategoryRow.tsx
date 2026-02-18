import {
  FireIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import type {
  CommunityCategory,
  CommunityUserOrb,
} from "../data/mockCommunity";

const iconMap = {
  Hot: FireIcon,
  Spotlight: SparklesIcon,
  Clubs: UserGroupIcon,
};

type CommunityCategoryRowProps = {
  categories: CommunityCategory[];
  users?: CommunityUserOrb[];
};

const LivePulseIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 12h4l2-4 4 8 2-4h4" />
  </svg>
);

const initialsFromName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export default function CommunityCategoryRow({
  categories,
  users = [],
}: CommunityCategoryRowProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-1">
      {categories.map((item) => {
        const Icon =
          item.label === "Live"
            ? LivePulseIcon
            : (iconMap[item.label as keyof typeof iconMap] ?? SparklesIcon);
        const isActive = item.active;
        return (
          <button
            key={item.id}
            type="button"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <span
              className={`flex h-[80px] w-[80px] items-center justify-center rounded-full border-3 overflow-hidden ${
                isActive ? "border-brand-secondary" : "border-brand-primary"
              }`}
            >
              <span className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-[#0D1117] text-white duration-500 ease-out hover:scale-130">
                <Icon className="h-6 w-6" />
              </span>
            </span>
            <span className="text-xs font-medium text-neutral-n4 dark:text-snow-200">
              {item.label}
            </span>
          </button>
        );
      })}
      {[...users]
        .sort((a, b) => Number(Boolean(a.viewed)) - Number(Boolean(b.viewed)))
        .map((user) => {
        const initials = initialsFromName(user.name);
        const ringClass = user.viewed
          ? "border-snow-200 dark:border-white/20"
          : "border-brand-primary";
        return (
          <div
            key={user.id}
            className="flex flex-col items-center gap-2 cursor-pointer"
            title={user.name}
          >
            <button
              type="button"
              className={`flex h-[80px] w-[80px] items-center justify-center rounded-full border-3 ${ringClass} cursor-pointer overflow-hidden`}
              aria-label={user.name}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-[75px] w-[75px] rounded-full object-cover hover:scale-105 duration-500 ease-out"
                  loading="lazy"
                />
              ) : (
                <span className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-snow-200 text-base font-semibold text-neutral-n4">
                  {initials}
                </span>
              )}
            </button>
            <span className="text-xs font-medium text-neutral-n4 dark:text-snow-200">
              {user.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
