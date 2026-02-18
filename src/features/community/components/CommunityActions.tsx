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
  orange: "bg-[#FCEFE6] text-[#F07C2E] dark:bg-[#2A1C12] dark:text-[#F6A06A]",
  purple: "bg-[#EEE6FF] text-[#8B5CF6] dark:bg-[#241A33] dark:text-[#B794F4]",
  green: "bg-[#E7F8EC] text-[#22C55E] dark:bg-[#12251B] dark:text-[#4ADE80]",
  red: "bg-[#FFF0EB] text-[#FF4500] dark:bg-[#2A1711] dark:text-[#FF7A52]",
};

type CommunityActionsProps = {
  actions: CommunityAction[];
};

export default function CommunityActions({ actions }: CommunityActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = iconMap[action.label as keyof typeof iconMap] ?? UsersIcon;
        const toneClass = toneClasses[action.tone];
        return (
          <button
            key={action.id}
            type="button"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${toneClass}`}
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
