import type { CommunityStory } from "../data/mockCommunity";

type CommunityHighlightCardProps = {
  story: CommunityStory;
};

export default function CommunityHighlightCard({
  story,
}: CommunityHighlightCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-neutral-n2 h-[240px] cursor-pointer">
      <img
        src={story.image}
        alt={story.title}
        className="h-full w-full object-cover scale-110 transition-transform duration-300 ease-out group-hover:scale-100"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <img
            src={story.posterIcon}
            alt=""
            className="h-4 w-4"
            loading="lazy"
          />
          <span>{story.posterLabel}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {story.authorAvatar ? (
            <img
              src={story.authorAvatar}
              alt={story.author}
              className="h-8 w-8 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-white/30" />
          )}
          <p className="text-sm font-semibold">
            {story.author} • {story.time}
          </p>
        </div>
        <p className="mt-2 text-sm font-medium">{story.title}</p>
      </div>
    </div>
  );
}
