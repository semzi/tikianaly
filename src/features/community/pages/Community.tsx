import { useEffect, useMemo, useState } from "react";
import {
  BookmarkIcon,
  BoltIcon,
  CameraIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FireIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  PlusIcon,
  SparklesIcon,
  UserGroupIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
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
  communityThreads,
  communityUserOrbs,
  suggestedCommunities,
} from "../data/mockCommunity";
import type {
  CommunityCategory,
  CommunityAction,
  CommunityReply,
  CommunityUserOrb,
} from "../data/mockCommunity";

const CAPTION_PREVIEW_CHARS = 165;
const STORY_DURATION_MS = 5500;

type CategoryIconKind = "live" | "hot" | "spotlight" | "clubs";
type StorySource = {
  id: string;
  name: string;
  subtitle: string;
  categoryIconKind?: CategoryIconKind;
  icon?: string;
  avatar?: string;
};

type CommunityView = "home" | "feed";

export default function Community() {
  const formatCount = (value: number) => {
    if (value < 1000) return String(value);
    if (value < 1_000_000) {
      const v = value / 1000;
      return `${v.toFixed(v >= 10 ? 0 : 1)}K`;
    }
    if (value < 1_000_000_000) {
      const v = value / 1_000_000;
      return `${v.toFixed(v >= 10 ? 0 : 1)}M`;
    }
    const v = value / 1_000_000_000;
    return `${v.toFixed(v >= 10 ? 0 : 1)}B`;
  };

  const sortedStories = useMemo(
    () =>
      [...communityStories].sort(
        (a, b) => Number(Boolean(a.viewed)) - Number(Boolean(b.viewed)),
      ),
    [],
  );

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

  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set());
  const [burstingLikes, setBurstingLikes] = useState<Set<string>>(new Set());
  const [communityView, setCommunityView] = useState<CommunityView>("home");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [activeThreadPostId, setActiveThreadPostId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [composerDraft, setComposerDraft] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [expandedReplyBranches, setExpandedReplyBranches] = useState<Set<string>>(new Set());
  const [threadState, setThreadState] =
    useState<Record<string, CommunityReply[]>>(communityThreads);

  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeStorySourceIndex, setActiveStorySourceIndex] = useState<number | null>(null);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const [storyStartedAt, setStoryStartedAt] = useState(0);
  const [storyNow, setStoryNow] = useState(0);

  const sortedUsers = useMemo(
    () =>
      [...communityUserOrbs].sort(
        (a, b) => Number(Boolean(a.viewed)) - Number(Boolean(b.viewed)),
      ),
    [],
  );

  const storySources = useMemo<StorySource[]>(() => {
    const categoryIconMap: Record<string, CategoryIconKind> = {
      Live: "live",
      Hot: "hot",
      Spotlight: "spotlight",
      Clubs: "clubs",
    };

    const categorySources = communityCategories.map((category: CommunityCategory) => ({
      id: `category-${category.id}`,
      name: category.label,
      subtitle: `curated by ${category.label === "Live" ? "TikiAnaly" : category.label}`,
      categoryIconKind: categoryIconMap[category.label] ?? "spotlight",
    }));

    const userSources = sortedUsers.map((user: CommunityUserOrb) => ({
      id: `user-${user.id}`,
      name: user.name,
      subtitle: `Story by ${user.name}`,
      avatar: user.avatar,
    }));

    return [...categorySources, ...userSources];
  }, [sortedUsers]);

  const activeStorySource =
    activeStorySourceIndex !== null && storySources[activeStorySourceIndex]
      ? storySources[activeStorySourceIndex]
      : null;

  const activeStory =
    activeStoryIndex !== null && sortedStories[activeStoryIndex]
      ? sortedStories[activeStoryIndex]
      : null;
  const activeThreadPost = activeThreadPostId
    ? communityFeed.find((item) => item.id === activeThreadPostId) ?? null
    : null;
  const activeThreadReplies = activeThreadPostId
    ? threadState[activeThreadPostId] ?? []
    : [];

  const resetStoryTimer = () => {
    const now = Date.now();
    setStoryStartedAt(now);
    setStoryNow(now);
  };

  const openStory = (
    index: number,
    sourceIndex?: number,
  ) => {
    setActiveStoryIndex(index);
    if (sourceIndex !== undefined) {
      setActiveStorySourceIndex(sourceIndex);
    }
    setIsStoryPaused(false);
    const now = Date.now();
    setStoryStartedAt(now);
    setStoryNow(now);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setActiveStorySourceIndex(null);
    setIsStoryPaused(false);
  };

  const goToNextStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex >= sortedStories.length - 1) {
      closeStory();
      return;
    }
    setActiveStoryIndex((prev) => (prev === null ? prev : prev + 1));
    resetStoryTimer();
  };

  const goToPreviousStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex <= 0) {
      resetStoryTimer();
      return;
    }
    setActiveStoryIndex((prev) => (prev === null ? prev : prev - 1));
    resetStoryTimer();
  };

  const pauseStory = () => {
    if (activeStoryIndex === null || isStoryPaused) return;
    setIsStoryPaused(true);
  };

  const resumeStory = () => {
    if (activeStoryIndex === null || !isStoryPaused) return;
    const now = Date.now();
    const elapsed = storyNow - storyStartedAt;
    setStoryStartedAt(now - elapsed);
    setStoryNow(now);
    setIsStoryPaused(false);
  };

  useEffect(() => {
    if (activeStoryIndex === null || isStoryPaused) return;
    const timer = window.setInterval(() => setStoryNow(Date.now()), 60);
    return () => window.clearInterval(timer);
  }, [activeStoryIndex, isStoryPaused]);

  useEffect(() => {
    if (activeStoryIndex === null) return;

    const elapsed = storyNow - storyStartedAt;
    if (elapsed >= STORY_DURATION_MS) {
      goToNextStory();
    }
  }, [storyNow, storyStartedAt, activeStoryIndex]);

  useEffect(() => {
    if (activeStoryIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeStory();
      if (event.key === "ArrowRight") goToNextStory();
      if (event.key === "ArrowLeft") goToPreviousStory();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeStoryIndex]);

  useEffect(() => {
    if (!activeThreadPostId) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeThreadPostId]);

  useEffect(() => {
    if (!isComposerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isComposerOpen]);

  const storyProgressFor = (index: number) => {
    if (activeStoryIndex === null) return 0;
    if (index < activeStoryIndex) return 100;
    if (index > activeStoryIndex) return 0;

    const elapsed = Math.max(0, storyNow - storyStartedAt);
    return Math.min(100, (elapsed / STORY_DURATION_MS) * 100);
  };

  const toggleFeedAction = (
    id: string,
    key: "likes" | "comments" | "bookmarks" | "shares",
    flag: "liked" | "commented" | "bookmarked" | "shared",
  ) => {
    const current = feedState[id];
    const nextActive = current ? !current[flag] : true;

    setFeedState((prev) => {
      const item = prev[id];
      if (!item) return prev;
      const delta = nextActive ? 1 : -1;
      return {
        ...prev,
        [id]: {
          ...item,
          [flag]: nextActive,
          [key]: Math.max(0, item[key] + delta),
        },
      };
    });

    if (flag === "liked" && nextActive) {
      setBurstingLikes((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      window.setTimeout(() => {
        setBurstingLikes((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 420);
    }
  };

  const toggleCaption = (id: string) => {
    setExpandedCaptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getReactionStyle = (active: boolean, tone: "red" | "blue") => {
    if (tone === "red") {
      return active
        ? "bg-[#FF4500]/12 text-[#FF4500] border-[#FF4500]/25"
        : "bg-snow-100 dark:bg-white/5 text-neutral-n4 dark:text-snow-200 border-snow-200 dark:border-white/10 hover:border-[#FF4500]/30 hover:text-[#FF4500]";
    }

    return active
      ? "bg-[#3B82F6]/12 text-[#3B82F6] border-[#3B82F6]/25"
      : "bg-snow-100 dark:bg-white/5 text-neutral-n4 dark:text-snow-200 border-snow-200 dark:border-white/10 hover:border-[#3B82F6]/30 hover:text-[#3B82F6]";
  };

  const getReactionIconClass = (
    active: boolean,
    tone: "red" | "blue",
  ) =>
    active
      ? `h-4 w-4 ${tone === "red" ? "text-[#FF4500]" : "text-[#3B82F6]"}`
      : "h-4 w-4 text-neutral-n4 dark:text-snow-200";

  const openThread = (postId: string) => {
    setActiveThreadPostId(postId);
    setReplyDraft("");
    setReplyTargetId(null);
  };

  const closeThread = () => {
    setActiveThreadPostId(null);
    setReplyDraft("");
    setReplyTargetId(null);
  };

  const toggleReplyBranch = (replyId: string) => {
    setExpandedReplyBranches((prev) => {
      const next = new Set(prev);
      if (next.has(replyId)) next.delete(replyId);
      else next.add(replyId);
      return next;
    });
  };

  const incrementCommentCount = (postId: string) => {
    setFeedState((prev) => {
      const item = prev[postId];
      if (!item) return prev;
      return {
        ...prev,
        [postId]: {
          ...item,
          comments: item.comments + 1,
        },
      };
    });
  };

  const submitReply = () => {
    if (!activeThreadPostId) return;
    const trimmed = replyDraft.trim();
    if (!trimmed) return;

    const newReply: CommunityReply = {
      id: `reply-local-${Date.now()}`,
      author: "You",
      handle: "@you",
      avatar: "/assets/community/story-messi.jpg",
      time: "now",
      content: trimmed,
      likes: 0,
    };

    setThreadState((prev) => {
      const currentReplies = prev[activeThreadPostId] ?? [];
      if (!replyTargetId) {
        return {
          ...prev,
          [activeThreadPostId]: [newReply, ...currentReplies],
        };
      }

      return {
        ...prev,
        [activeThreadPostId]: currentReplies.map((reply) =>
          reply.id === replyTargetId
            ? {
                ...reply,
                replies: [newReply, ...(reply.replies ?? [])],
              }
            : reply,
        ),
      };
    });

    if (replyTargetId) {
      setExpandedReplyBranches((prev) => new Set(prev).add(replyTargetId));
    }

    incrementCommentCount(activeThreadPostId);
    setReplyDraft("");
    setReplyTargetId(null);
  };

  const activeStoryCaption = activeStory
    ? activeStory.title.length > 140
      ? `${activeStory.title.slice(0, 140).trimEnd()}...`
      : activeStory.title
    : "";

  const openCategoryStory = (_label: string, index: number) => {
    openStory(0, index);
  };

  const openUserStory = (
    _user: { name: string; avatar?: string },
    index: number,
  ) => {
    openStory(0, communityCategories.length + index);
  };

  const categoryIconByKind: Record<CategoryIconKind, typeof BoltIcon> = {
    live: BoltIcon,
    hot: FireIcon,
    spotlight: SparklesIcon,
    clubs: UserGroupIcon,
  };

  const StorySourceCategoryIcon =
    activeStorySource?.categoryIconKind
      ? categoryIconByKind[activeStorySource.categoryIconKind]
      : null;

  const joinedCommunityCards = suggestedCommunities.slice(0, 2);
  const mockHasJoinedCommunities = false;

  const handleCommunityActionClick = (action: CommunityAction) => {
    if (action.id === "feed") {
      setCommunityView("feed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    setComposerDraft("");
  };

  return (
    <div className="min-h-screen bg-body dark:bg-[#0D1117]">
      <PageHeader />
      <main className="m-page-padding-x py-6">
        {communityView === "feed" ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-snow-100 text-neutral-n1 transition-colors hover:bg-snow-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  onClick={() => {
                    setCommunityView("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-label="Back to community"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-neutral-n1 dark:text-white">
                    Your Feed
                  </h1>
                  <p className="text-xs text-neutral-n5">
                    Discover and join communities
                  </p>
                </div>
              </div>

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

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-xl border border-snow-200 px-4 py-2 text-sm font-medium text-neutral-n5 transition-colors hover:border-brand-primary hover:text-brand-primary dark:border-white/10 dark:text-snow-200 dark:hover:border-brand-primary dark:hover:text-white"
              >
                Trending
              </button>
              <button
                type="button"
                className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-primary/30"
              >
                New
              </button>
              <button
                type="button"
                className="rounded-xl border border-snow-200 px-4 py-2 text-sm font-medium text-neutral-n5 transition-colors hover:border-brand-primary hover:text-brand-primary dark:border-white/10 dark:text-snow-200 dark:hover:border-brand-primary dark:hover:text-white"
              >
                My Posts
              </button>
            </div>

            {mockHasJoinedCommunities ? (
              <>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {joinedCommunityCards.map((community) => (
                    <div
                      key={`joined-${community.id}`}
                      className="overflow-hidden rounded-2xl border border-snow-200 bg-white dark:border-white/10 dark:bg-[#161B22]"
                    >
                      <img
                        src={community.image}
                        alt={community.name}
                        className="h-28 w-full object-cover"
                      />
                      <p className="px-4 py-3 text-lg font-medium text-neutral-n1 dark:text-white">
                        {community.name}
                      </p>
                    </div>
                  ))}
                </div>

              </>
            ) : (
              <div className="mt-5">
                <p className="mb-3 text-xl font-medium text-neutral-n1 dark:text-white">
                  Discover new communities
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {joinedCommunityCards.map((community) => (
                    <div
                      key={`discover-${community.id}`}
                      className="overflow-hidden rounded-2xl border border-snow-200 bg-white dark:border-white/10 dark:bg-[#161B22]"
                    >
                      <img
                        src={community.image}
                        alt={community.name}
                        className="h-28 w-full object-cover"
                      />
                      <div className="flex items-center justify-between px-4 py-3">
                        <p className="text-lg font-medium text-neutral-n1 dark:text-white">
                          {community.name}
                        </p>
                        <button
                          type="button"
                          className="rounded-full bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4">
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

                const fullCaption = String(item.content ?? "");
                const isExpanded = expandedCaptions.has(item.id);
                const isLongCaption = fullCaption.length > CAPTION_PREVIEW_CHARS;
                const isCommentActive = activeThreadPostId === item.id;
                const visibleCaption = !isLongCaption || isExpanded
                  ? fullCaption
                  : `${fullCaption.slice(0, CAPTION_PREVIEW_CHARS).trimEnd()}...`;

                return (
                  <div
                    key={`feed-view-${item.id}`}
                    className="rounded-2xl border border-snow-200 dark:border-white/10 bg-white dark:bg-[#161B22] p-4 md:p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-snow-100 dark:bg-white/5 px-2.5 py-1 text-xs font-semibold text-neutral-n5 dark:text-snow-200">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-snow-200 dark:bg-white/10 text-neutral-n4">
                          FC
                        </span>
                        {item.community}
                      </div>
                      <button
                        type="button"
                        className="rounded-full px-2 py-1 text-xs text-neutral-n5 hover:bg-snow-100 dark:hover:bg-white/10"
                        aria-label="Post actions"
                      >
                        ...
                      </button>
                    </div>

                    <div className="mt-3 flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.avatar}
                          alt={item.author}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#161B22]"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[15px] font-semibold text-neutral-n1 dark:text-white truncate">
                              {item.author}
                            </p>
                            {item.verified ? (
                              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-white text-[10px]">
                                v
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-neutral-n5 truncate">{item.time}</p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-[15px] leading-7 text-neutral-n3 dark:text-snow-200">
                      {visibleCaption}
                    </p>
                    {isLongCaption ? (
                      <button
                        type="button"
                        className="mt-1 text-xs font-semibold text-brand-secondary hover:underline"
                        onClick={() => toggleCaption(item.id)}
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    ) : null}

                    {item.image ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-snow-200 dark:border-white/10 bg-snow-100 dark:bg-[#0D1117]">
                        <img
                          src={item.image}
                          alt={`${item.author} post`}
                          className="w-full max-h-[420px] object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${getReactionStyle(
                          state.liked,
                          "red",
                        )}`}
                        onClick={() => toggleFeedAction(item.id, "likes", "liked")}
                        aria-pressed={state.liked}
                      >
                        <span className={burstingLikes.has(item.id) ? "like-burst" : ""}>
                          <HeartIcon className={getReactionIconClass(state.liked, "red")} />
                        </span>
                        <span className="font-semibold">{formatCount(state.likes)}</span>
                      </button>

                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${getReactionStyle(
                          isCommentActive,
                          "blue",
                        )}`}
                        onClick={() => openThread(item.id)}
                        aria-pressed={isCommentActive}
                        aria-label={`Open replies for ${item.author}`}
                      >
                        <ChatBubbleLeftEllipsisIcon
                          className={getReactionIconClass(isCommentActive, "blue")}
                        />
                        <span className="font-semibold">{formatCount(state.comments)}</span>
                      </button>

                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${getReactionStyle(
                          state.bookmarked,
                          "blue",
                        )}`}
                        onClick={() => toggleFeedAction(item.id, "bookmarks", "bookmarked")}
                        aria-pressed={state.bookmarked}
                      >
                        <BookmarkIcon
                          className={getReactionIconClass(state.bookmarked, "blue")}
                        />
                        <span className="font-semibold">{formatCount(state.bookmarks)}</span>
                      </button>

                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${getReactionStyle(
                          state.shared,
                          "blue",
                        )}`}
                        onClick={() => toggleFeedAction(item.id, "shares", "shared")}
                        aria-pressed={state.shared}
                      >
                        <PaperAirplaneIcon
                          className={getReactionIconClass(state.shared, "blue")}
                        />
                        <span className="font-semibold">{formatCount(state.shares)}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
        <>
        <CommunityHeader />
        <div className="mt-4">
          <CommunityCategoryRow
            categories={communityCategories}
            users={communityUserOrbs}
            onCategoryClick={(category, index) =>
              openCategoryStory(category.label, index)
            }
            onUserClick={(user, index) => openUserStory(user, index)}
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
          {sortedStories.map((story, index) => (
            <div
              key={`${story.id}-${index}`}
              className="w-[35%] min-w-[35%] h-[240px] text-left"
              aria-label={`Highlight card by ${story.author}`}
            >
              <CommunityHighlightCard story={story} />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <CommunityActions
            actions={communityActions}
            onActionClick={handleCommunityActionClick}
          />
        </div>

        <div className="mt-6">
          <SuggestedCommunities items={suggestedCommunities} />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold tracking-tight text-neutral-n1 dark:text-white">
              Community Feed
            </p>
            <button
              type="button"
              className="rounded-full border border-snow-200 dark:border-white/10 px-3 py-1 text-xs font-semibold text-brand-secondary hover:bg-brand-secondary/10"
            >
              Trending +54
            </button>
          </div>
          <div className="mt-4 space-y-4">
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

              const fullCaption = String(item.content ?? "");
              const isExpanded = expandedCaptions.has(item.id);
              const isLongCaption = fullCaption.length > CAPTION_PREVIEW_CHARS;
              const isCommentActive = activeThreadPostId === item.id;
              const visibleCaption = !isLongCaption || isExpanded
                ? fullCaption
                : `${fullCaption.slice(0, CAPTION_PREVIEW_CHARS).trimEnd()}...`;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-snow-200 dark:border-white/10 bg-white dark:bg-[#161B22] p-4 md:p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-snow-100 dark:bg-white/5 px-2.5 py-1 text-xs font-semibold text-neutral-n5 dark:text-snow-200">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-snow-200 dark:bg-white/10 text-neutral-n4">
                        FC
                      </span>
                      {item.community}
                    </div>
                    <button
                      type="button"
                      className="rounded-full px-2 py-1 text-xs text-neutral-n5 hover:bg-snow-100 dark:hover:bg-white/10"
                      aria-label="Post actions"
                    >
                      ...
                    </button>
                  </div>

                  <div className="mt-3 flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#161B22]"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[15px] font-semibold text-neutral-n1 dark:text-white truncate">
                            {item.author}
                          </p>
                          {item.verified ? (
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-white text-[10px]">
                              v
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-neutral-n5 truncate">{item.time}</p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-[15px] leading-7 text-neutral-n3 dark:text-snow-200">
                    {visibleCaption}
                  </p>
                  {isLongCaption ? (
                    <button
                      type="button"
                      className="mt-1 text-xs font-semibold text-brand-secondary hover:underline"
                      onClick={() => toggleCaption(item.id)}
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  ) : null}

                  {item.image ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-snow-200 dark:border-white/10 bg-snow-100 dark:bg-[#0D1117]">
                      <img
                        src={item.image}
                        alt={`${item.author} post`}
                        className="w-full max-h-[420px] object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${getReactionStyle(
                        state.liked,
                        "red",
                      )}`}
                      onClick={() =>
                        toggleFeedAction(item.id, "likes", "liked")
                      }
                      aria-pressed={state.liked}
                    >
                      <span className={burstingLikes.has(item.id) ? "like-burst" : ""}>
                        <HeartIcon className={getReactionIconClass(state.liked, "red")} />
                      </span>
                      <span className="font-semibold">{formatCount(state.likes)}</span>
                    </button>

                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${getReactionStyle(
                        isCommentActive,
                        "blue",
                      )}`}
                      onClick={() => openThread(item.id)}
                      aria-pressed={isCommentActive}
                      aria-label={`Open replies for ${item.author}`}
                    >
                      <ChatBubbleLeftEllipsisIcon
                        className={getReactionIconClass(isCommentActive, "blue")}
                      />
                      <span className="font-semibold">{formatCount(state.comments)}</span>
                    </button>

                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${getReactionStyle(
                        state.bookmarked,
                        "blue",
                      )}`}
                      onClick={() =>
                        toggleFeedAction(item.id, "bookmarks", "bookmarked")
                      }
                      aria-pressed={state.bookmarked}
                    >
                      <BookmarkIcon
                        className={getReactionIconClass(state.bookmarked, "blue")}
                      />
                      <span className="font-semibold">{formatCount(state.bookmarks)}</span>
                    </button>

                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${getReactionStyle(
                        state.shared,
                        "blue",
                      )}`}
                      onClick={() =>
                        toggleFeedAction(item.id, "shares", "shared")
                      }
                      aria-pressed={state.shared}
                    >
                      <PaperAirplaneIcon
                        className={getReactionIconClass(state.shared, "blue")}
                      />
                      <span className="font-semibold">{formatCount(state.shares)}</span>
                    </button>
                  </div>

                  <div className="mt-3 text-[11px] text-neutral-n5">
                    <span className="font-semibold text-neutral-n4 dark:text-snow-200">
                      {formatCount(
                        state.likes + state.comments + state.bookmarks + state.shares,
                      )}
                    </span>{" "}
                    total interactions
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </>
        )}
      </main>

      {activeStory ? (
        <div
          className="fixed inset-0 z-[12000] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),rgba(0,0,0,0.92)_62%)] backdrop-blur-md p-2 sm:p-4 md:px-10 md:py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Story viewer"
        >
          <button
            type="button"
            className="absolute right-5 top-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
            onClick={closeStory}
            aria-label="Close story"
          >
            <XMarkIcon className="h-5 w-5 text-white" />
          </button>

          <button
            type="button"
            className="hidden md:inline-flex absolute left-5 top-1/2 z-20 h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-35"
            onClick={goToPreviousStory}
            aria-label="Previous story"
            disabled={activeStoryIndex === 0}
          >
            <ChevronLeftIcon className="h-7 w-7" />
          </button>

          <button
            type="button"
            className="hidden md:inline-flex absolute right-5 top-1/2 z-20 h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-35"
            onClick={goToNextStory}
            aria-label="Next story"
            disabled={activeStoryIndex === sortedStories.length - 1}
          >
            <ChevronRightIcon className="h-7 w-7" />
          </button>

          <div className="mx-auto flex h-full max-w-[1380px] items-center justify-center">
            <div className="relative h-full max-h-[920px] w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/20 bg-black text-white ring-2 ring-brand-primary/60 shadow-[0_24px_120px_rgba(0,0,0,0.55)] md:max-w-[470px]">
            <img
              src={activeStory.image}
              alt={activeStory.title}
              className="absolute inset-0 h-full w-full object-cover scale-110 blur-[2px]"
            />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <div className="absolute left-0 right-0 top-0 p-4">
                <div className="mb-3 flex items-center gap-1">
                  {sortedStories.map((story, index) => (
                    <div
                      key={`${story.id}-progress-${index}`}
                      className="h-1 flex-1 overflow-hidden rounded-full bg-white/35"
                    >
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${storyProgressFor(index)}%` }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-brand-primary">
                      {activeStorySource?.avatar ? (
                        <img
                          src={activeStorySource.avatar}
                          alt={activeStorySource.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : StorySourceCategoryIcon ? (
                        <StorySourceCategoryIcon className="h-4 w-4 text-white" />
                      ) : (
                        <img
                          src={activeStorySource?.icon ?? activeStory.posterIcon}
                          alt="Story source"
                          className="h-4 w-4 object-contain"
                        />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">
                        {activeStorySource?.name ?? "Latest Updates"}
                      </p>
                      <p className="text-xs text-white/80">
                        {activeStorySource?.subtitle ?? "curated by TikiAnaly"}
                      </p>
                    </div>
                  </div>

                  <div />
                </div>
              </div>

              <div className="absolute inset-x-0 top-20 bottom-28 z-10 flex">
                <button
                  type="button"
                  className="h-full w-[28%] md:w-[22%]"
                  onClick={goToPreviousStory}
                  aria-label="Previous story"
                />
                <button
                  type="button"
                  className="h-full flex-1"
                  onPointerDown={pauseStory}
                  onPointerUp={resumeStory}
                  onPointerLeave={resumeStory}
                  onPointerCancel={resumeStory}
                  aria-label="Pause story while holding"
                />
                <button
                  type="button"
                  className="h-full w-[28%] md:w-[22%]"
                  onClick={goToNextStory}
                  aria-label="Next story"
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="mb-4 max-w-[95%] text-[19px] leading-7 text-white/95 sm:text-[22px]">
                  {activeStoryCaption}
                </p>
                <button
                  type="button"
                  className="w-full rounded-lg bg-brand-primary py-3 text-center text-base font-semibold text-white hover:bg-brand-primary/90 sm:text-lg"
                >
                  View Article
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {activeThreadPost ? (
        <div
          className="fixed inset-0 z-[11950] bg-black/55 backdrop-blur-sm p-3 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Replies panel"
        >
          <div className="mx-auto flex h-full max-w-[920px] flex-col overflow-hidden rounded-[28px] border border-snow-200 dark:border-white/10 bg-white dark:bg-[#0D1117] shadow-[0_24px_100px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between border-b border-snow-200 px-5 py-4 dark:border-white/10">
              <div>
                <p className="text-base font-semibold text-neutral-n1 dark:text-white">
                  Conversation
                </p>
                <p className="text-xs text-neutral-n5">Reply in thread</p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-snow-200 text-neutral-n4 transition-colors hover:bg-snow-100 dark:border-white/10 dark:text-snow-200 dark:hover:bg-white/10"
                onClick={closeThread}
                aria-label="Close replies panel"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
              <div className="rounded-3xl border border-snow-200 bg-snow-100/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-start gap-3">
                  <img
                    src={activeThreadPost.avatar}
                    alt={activeThreadPost.author}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-semibold text-neutral-n1 dark:text-white">
                        {activeThreadPost.author}
                      </p>
                      <span className="text-xs text-neutral-n5">{activeThreadPost.time}</span>
                    </div>
                    <p className="mt-2 text-[15px] leading-7 text-neutral-n3 dark:text-snow-200">
                      {activeThreadPost.content}
                    </p>
                    {activeThreadPost.image ? (
                      <div className="mt-3 overflow-hidden rounded-2xl border border-snow-200 dark:border-white/10">
                        <img
                          src={activeThreadPost.image}
                          alt={`${activeThreadPost.author} post`}
                          className="max-h-[360px] w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-snow-200 bg-white p-4 dark:border-white/10 dark:bg-[#161B22]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-n5">
                  {replyTargetId ? "Replying to a reply" : `Replying to @${activeThreadPost.author.toLowerCase()}`}
                </p>
                <div className="mt-3 flex gap-3">
                  <img
                    src="/assets/community/story-messi.jpg"
                    alt="You"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={replyDraft}
                      onChange={(event) => setReplyDraft(event.target.value)}
                      placeholder="Post your reply"
                      className="min-h-[110px] w-full resize-none rounded-2xl border border-snow-200 bg-snow-100 px-4 py-3 text-sm text-neutral-n2 outline-none transition-colors placeholder:text-neutral-n5 focus:border-brand-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        className="text-xs font-semibold text-neutral-n5 hover:text-brand-secondary"
                        onClick={() => setReplyTargetId(null)}
                      >
                        {replyTargetId ? "Cancel nested reply" : "Reply as yourself"}
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={submitReply}
                        disabled={!replyDraft.trim()}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {activeThreadReplies.map((reply) => {
                  const branchExpanded = expandedReplyBranches.has(reply.id);
                  const nestedReplies = reply.replies ?? [];
                  return (
                    <div
                      key={reply.id}
                      className="rounded-3xl border border-snow-200 bg-white p-4 dark:border-white/10 dark:bg-[#161B22]"
                    >
                      <div className="flex gap-3">
                        <img
                          src={reply.avatar}
                          alt={reply.author}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-neutral-n1 dark:text-white">
                              {reply.author}
                            </p>
                            <p className="text-xs text-neutral-n5">{reply.handle}</p>
                            <p className="text-xs text-neutral-n5">{reply.time}</p>
                          </div>
                          <p className="mt-2 text-[15px] leading-7 text-neutral-n3 dark:text-snow-200">
                            {reply.content}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-neutral-n5">
                            <button
                              type="button"
                              className="hover:text-brand-secondary"
                              onClick={() => setReplyTargetId(reply.id)}
                            >
                              Reply
                            </button>
                            <button
                              type="button"
                              className="hover:text-brand-secondary"
                            >
                              Like {formatCount(reply.likes)}
                            </button>
                            {nestedReplies.length ? (
                              <button
                                type="button"
                                className="hover:text-brand-secondary"
                                onClick={() => toggleReplyBranch(reply.id)}
                              >
                                {branchExpanded
                                  ? "Hide replies"
                                  : `View replies (${nestedReplies.length})`}
                              </button>
                            ) : null}
                          </div>

                          {branchExpanded && nestedReplies.length ? (
                            <div className="mt-4 space-y-3 border-l border-snow-200 pl-4 dark:border-white/10">
                              {nestedReplies.map((nestedReply) => (
                                <div key={nestedReply.id} className="rounded-2xl bg-snow-100 p-3 dark:bg-white/5">
                                  <div className="flex items-start gap-3">
                                    <img
                                      src={nestedReply.avatar}
                                      alt={nestedReply.author}
                                      className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-neutral-n1 dark:text-white">
                                          {nestedReply.author}
                                        </p>
                                        <p className="text-xs text-neutral-n5">{nestedReply.handle}</p>
                                        <p className="text-xs text-neutral-n5">{nestedReply.time}</p>
                                      </div>
                                      <p className="mt-1 text-sm leading-6 text-neutral-n3 dark:text-snow-200">
                                        {nestedReply.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {communityView === "feed" ? (
        <button
          type="button"
          className="fixed bottom-24 right-6 z-[200] inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-[0_16px_40px_rgba(0,86,210,0.38)] transition-transform hover:scale-105 hover:bg-brand-primary/90"
          onClick={() => setIsComposerOpen(true)}
          aria-label="Create post"
        >
          <span className="text-4xl leading-none">+</span>
        </button>
      ) : null}

      {isComposerOpen ? (
        <div
          className="fixed inset-0 z-[12100] bg-black/10 backdrop-blur-[2px] md:flex md:items-center md:justify-center md:bg-black/12 md:p-6 md:backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Create post"
        >
          <div className="mx-auto flex h-full w-full flex-col bg-white px-4 pb-6 pt-4 dark:bg-[#0D1117] md:h-[min(82vh,760px)] md:w-[70vw] md:max-w-[980px] md:overflow-hidden md:rounded-[32px] md:border md:border-snow-200 md:px-8 md:pb-8 md:pt-6 md:shadow-[0_24px_100px_rgba(0,0,0,0.28)] md:dark:border-white/10">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="inline-flex items-center gap-3 text-lg font-medium text-neutral-n1 dark:text-white"
                onClick={closeComposer}
              >
                <XMarkIcon className="h-6 w-6" />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                className="rounded-xl bg-brand-primary px-6 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-brand-primary/90"
              >
                Send
              </button>
            </div>

            <div className="mt-8 flex flex-1 gap-3 overflow-hidden">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                <UserCircleIcon className="h-6 w-6" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <button
                  type="button"
                  className="inline-flex w-fit items-center gap-2 rounded-lg border border-brand-primary/50 px-4 py-1.5 text-sm font-medium text-brand-primary"
                >
                  <span>Feed</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>

                <textarea
                  value={composerDraft}
                  onChange={(event) => setComposerDraft(event.target.value)}
                  placeholder="Type your message"
                  className="community-compose-scrollbar mt-3 h-full min-h-[260px] w-full resize-none overflow-y-auto border-l-2 border-brand-primary/60 bg-transparent pl-3 text-lg leading-8 text-neutral-n2 outline-none placeholder:text-neutral-n5 dark:text-white md:min-h-0"
                />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-snow-200 pt-4 dark:border-white/10">
              <div className="flex items-center gap-5 text-brand-primary">
                <button type="button" className="text-lg font-semibold">
                  Aa
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-brand-primary/10"
                  aria-label="Open camera"
                >
                  <CameraIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-brand-primary/10"
                  aria-label="Add image"
                >
                  <PhotoIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="rounded-md border border-brand-primary/30 px-1.5 py-0.5 text-[10px] font-bold"
                >
                  GIF
                </button>
              </div>

              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary"
                aria-label="More composer options"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <FooterComp />
    </div>
  );
}

