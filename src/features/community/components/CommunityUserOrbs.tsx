import type { CommunityUserOrb } from "../data/mockCommunity";

type CommunityUserOrbsProps = {
  users: CommunityUserOrb[];
};

const initialsFromName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export default function CommunityUserOrbs({ users }: CommunityUserOrbsProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-1">
      {users.map((user) => {
        const initials = initialsFromName(user.name);
        return (
          <button
            key={user.id}
            type="button"
            className="flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-brand-primary cursor-pointer"
            title={user.name}
            aria-label={user.name}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-[44px] w-[44px] rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-snow-200 text-sm font-semibold text-neutral-n4">
                {initials}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
