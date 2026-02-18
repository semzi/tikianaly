import { ArrowRightIcon } from "@heroicons/react/24/solid";
import type { SuggestedCommunity } from "../data/mockCommunity";

type SuggestedCommunitiesProps = {
  items: SuggestedCommunity[];
};

export default function SuggestedCommunities({
  items,
}: SuggestedCommunitiesProps) {
  const maxItems = 7;
  const visibleItems = items.slice(0, maxItems);
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-n1 dark:text-white">
          Suggested Communities
        </p>
        <span className="text-xs text-brand-secondary cursor-pointer underline">
          +54
        </span>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto hide-scrollbar">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="min-w-[160px] rounded-2xl bg-white dark:bg-[#161B22] border border-snow-200 dark:border-white/10 overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-24 w-full object-cover"
              loading="lazy"
            />
            <p className="px-3 py-2 text-sm font-medium text-neutral-n1 dark:text-white truncate">
              {item.name}
            </p>
          </div>
        ))}
        <button
          type="button"
          className="min-w-[160px] flex flex-col items-center justify-center rounded-2xl border border-snow-200 dark:border-white/10 bg-white dark:bg-[#161B22] p-4 text-left transition-colors cursor-pointer hover:border-brand-secondary"
          aria-label="View all suggested communities"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
            <ArrowRightIcon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-neutral-n1 dark:text-white text-center ">
            View all suggested
          </p>
        </button>
      </div>
    </div>
  );
}
