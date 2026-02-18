import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import CommunityHeader from "../components/CommunityHeader";
import CommunityCategoryRow from "../components/CommunityCategoryRow";
import CommunityHighlightCard from "../components/CommunityHighlightCard";
import CommunityActions from "../components/CommunityActions";
import SuggestedCommunities from "../components/SuggestedCommunities";
import {
  communityActions,
  communityCategories,
  communityFeed,
  communityStories,
  communityUserOrbs,
  suggestedCommunities,
} from "../data/mockCommunity";

export default function Community() {
  const formatCount = (value: number) => {
    if (value < 1000) return String(value);
    if (value < 1_000_000) {
      const v = value / 1000;
      return `${v.toFixed(v >= 10 ? 0 : 1)}k`;
    }
    const v = value / 1_000_000;
    return `${v.toFixed(v >= 10 ? 0 : 1)}m`;
  };

  const [feedState, setFeedState] = useState(() =>
    communityFeed.reduce<
      Record<
        string,
        {
          likes: number;
          comments: number;
          bookmarks: number;
          shares: number;
          liked: boolean;
          commented: boolean;
          bookmarked: boolean;
          shared: boolean;
        }
      >
    >((acc, item) => {
      acc[item.id] = {
        likes: item.likes,
        comments: item.comments,
        bookmarks: item.bookmarks,
        shares: item.shares,
        liked: false,
        commented: false,
        bookmarked: false,
        shared: false,
      };
      return acc;
    }, {}),
  );

  const toggleFeedAction = (
    id: string,
    key: "likes" | "comments" | "bookmarks" | "shares",
    flag: "liked" | "commented" | "bookmarked" | "shared",
  ) => {
    setFeedState((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const nextActive = !current[flag];
      const delta = nextActive ? 1 : -1;
      return {
        ...prev,
        [id]: {
          ...current,
          [flag]: nextActive,
          [key]: Math.max(0, current[key] + delta),
        },
      };
    });
  };

  return (
    <div className="min-h-screen bg-body dark:bg-[#0D1117]">
      <PageHeader />
      <main className="m-page-padding-x py-6">
        <CommunityHeader />
        <div className="mt-4">
          <CommunityCategoryRow
            categories={communityCategories}
            users={communityUserOrbs}
          />
        </div>

        <div
          className="mt-4 flex gap-3 overflow-x-auto hide-scrollbar"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 2%, black 97%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 2%, black 97%, transparent 100%)",
          }}
        >
          {[...communityStories]
            .sort(
              (a, b) => Number(Boolean(a.viewed)) - Number(Boolean(b.viewed)),
            )
            .map((story) => (
              <div key={story.id} className="w-[35%] min-w-[35%] h-[240px]">
                <CommunityHighlightCard story={story} />
              </div>
            ))}
        </div>

        <div className="mt-4">
          <CommunityActions actions={communityActions} />
        </div>

        <div className="mt-6">
          <SuggestedCommunities items={suggestedCommunities} />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-n1 dark:text-white">
              Feed
            </p>
            <span className="text-xs text-brand-secondary underline cursor-pointer">
              +54
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {communityFeed.map((item) => {
              const state = feedState[item.id] ?? {
                likes: item.likes,
                comments: item.comments,
                bookmarks: item.bookmarks,
                shares: item.shares,
                liked: false,
                commented: false,
                bookmarked: false,
                shared: false,
              };
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-snow-200 dark:border-white/10 bg-white dark:bg-[#161B22] p-4"
                >
                  <div className="flex items-center gap-2 text-xs text-neutral-n5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-snow-200 text-neutral-n4">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
                      </svg>
                    </span>
                    <span>{item.community}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="h-9 w-9 rounded-full object-cover"
                        loading="lazy"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-neutral-n1 dark:text-white">
                            {item.author}
                          </p>
                          {item.verified ? (
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-white text-[10px]">
                              ✓
                            </span>
                          ) : null}
                          <span className="text-xs text-neutral-n5">
                            • {item.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="text-neutral-n5">
                      •••
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-neutral-n4 dark:text-snow-200">
                    {item.content}
                  </p>

                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="mt-3 h-[300px] w-auto rounded-2xl object-cover"
                      loading="lazy"
                    />
                  ) : null}

                  <div className="mt-3 flex items-center justify-between text-xs text-neutral-n5">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 cursor-pointer ${
                        state.liked
                          ? "text-neutral-n5 dark:text-snow-200"
                          : "hover:text-[#FF4500]"
                      }`}
                      onClick={() =>
                        toggleFeedAction(item.id, "likes", "liked")
                      }
                      aria-pressed={state.liked}
                    >
                      <img
                        src={
                          state.liked
                            ? "/icons/heart-fill-1.svg"
                            : "/icons/heart-line-1.svg"
                        }
                        alt=""
                        className={`h-4 w-4 theme-icon ${state.liked ? "red-icon" : "hover:red-icon"}`}
                      />
                    {formatCount(state.likes)}
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 cursor-pointer ${
                        state.commented
                          ? "text-neutral-n5 dark:text-snow-200"
                          : "hover:text-[#3B82F6]"
                      }`}
                      onClick={() =>
                        toggleFeedAction(item.id, "comments", "commented")
                      }
                      aria-pressed={state.commented}
                    >
                      <img
                        src="/icons/chat-4-line-1.svg"
                        alt=""
                        className={`h-4 w-4 theme-icon ${state.commented ? "blue-icon" : "hover:blue-icon"}`}
                      />
                    {formatCount(state.comments)}
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 cursor-pointer ${
                        state.bookmarked
                          ? "text-neutral-n5 dark:text-snow-200"
                          : "hover:text-[#3B82F6]"
                      }`}
                      onClick={() =>
                        toggleFeedAction(item.id, "bookmarks", "bookmarked")
                      }
                      aria-pressed={state.bookmarked}
                    >
                      <img
                        src={
                          state.bookmarked
                            ? "/icons/bookmark-fill-1.svg"
                            : "/icons/bookmark-line-1.svg"
                        }
                        alt=""
                        className={`h-4 w-4 theme-icon ${state.bookmarked ? "blue-icon" : "hover:blue-icon"}`}
                      />
                    {formatCount(state.bookmarks)}
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 cursor-pointer ${
                        state.shared
                          ? "text-neutral-n5 dark:text-snow-200"
                          : "hover:text-[#3B82F6]"
                      }`}
                      onClick={() =>
                        toggleFeedAction(item.id, "shares", "shared")
                      }
                      aria-pressed={state.shared}
                    >
                      <img
                        src={
                          state.shared
                            ? "/icons/share-forward-fill-1.svg"
                            : "/icons/share-forward-line-1.svg"
                        }
                        alt=""
                        className={`h-4 w-4 theme-icon ${state.shared ? "blue-icon" : "hover:blue-icon"}`}
                      />
                    {formatCount(state.shares)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <FooterComp />
    </div>
  );
}
