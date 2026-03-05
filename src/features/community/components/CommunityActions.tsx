import {
  UsersIcon,
  UserGroupIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import type { CommunityAction } from "../data/mockCommunity";

const iconMap = {
  Feed: UserGroupIcon,
  Groups: UsersIcon,
  Showcase: AcademicCapIcon,
  Browse: MagnifyingGlassIcon,
};

const toneClasses = {
  orange:
    "bg-[#FCEFE6] text-[#F07C2E] dark:bg-[#2A1C12] dark:text-[#F6A06A] hover:bg-[#F9E4D5] dark:hover:bg-[#342116]",
  purple:
    "bg-[#EEE6FF] text-[#8B5CF6] dark:bg-[#241A33] dark:text-[#B794F4] hover:bg-[#E4D7FF] dark:hover:bg-[#2D1F40]",
  green:
    "bg-[#E7F8EC] text-[#22C55E] dark:bg-[#12251B] dark:text-[#4ADE80] hover:bg-[#DAF4E3] dark:hover:bg-[#183022]",
  red:
    "bg-[#FFF0EB] text-[#FF4500] dark:bg-[#2A1711] dark:text-[#FF7A52] hover:bg-[#FFE4DC] dark:hover:bg-[#341C15]",
};

type CommunityActionsProps = {
  actions: CommunityAction[];
  onActionClick?: (action: CommunityAction) => void;
};

export default function CommunityActions({
  actions,
  onActionClick,
}: CommunityActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = iconMap[action.label as keyof typeof iconMap] ?? UsersIcon;
        const toneClass = toneClasses[action.tone];
        return (
          <button
            key={action.id}
            type="button"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${toneClass}`}
            onClick={() => onActionClick?.(action)}
          >
            <Icon className="h-6 w-6" />
            <span className="text-base font-semibold">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
