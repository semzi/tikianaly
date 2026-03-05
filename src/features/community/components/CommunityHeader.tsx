import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

type CommunityHeaderProps = {
  title?: string;
};

export default function CommunityHeader({
  title = "Community",
}: CommunityHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-semibold text-neutral-n1 dark:text-white">
        {title}
      </h1>
      <div className="flex items-center gap-3 text-neutral-n4 dark:text-snow-200">
        <button
          type="button"
          className="h-9 w-9 rounded-full bg-snow-100 dark:bg-white/10 flex items-center justify-center cursor-pointer"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="h-9 w-9 rounded-full bg-snow-100 dark:bg-white/10 flex items-center justify-center cursor-pointer"
          aria-label="Profile"
        >
          <UserCircleIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
