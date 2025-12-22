"use client";

import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { Send } from "lucide-react";

import {
  commentOnPost,
  getPostById,
  reactToPost,
  type NewComment,
  type ReactionType,
} from "@/lib/api/newsEndpoint";
import ReadAlso from "./ReadAlso";
import FooterComp from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";

const reactionConfig = [
  { key: "like", icon: "👍", label: "Like" },
  { key: "love", icon: "❤️", label: "Love" },
  { key: "clap", icon: "👏", label: "Clap" },
] as const;

interface Post {
  _id?: string;
  title?: string;
  imageUrl?: string;
  content?: string;
  writer?: string;
  createdAt?: string;
  hashtags?: string[];
  reactions?: {
    like?: number;
    love?: number;
    clap?: number;
  };
  comments?: Array<{ displayName: string; message: string }>;
}

interface ApiResponse {
  responseObject?: Post;
}

interface BlogPostClientProps {
  id: string;
  initialPost: Post | null;
  initialError: string | null;
}

export default function BlogPostClient({
  id,
  initialPost,
  initialError,
}: BlogPostClientProps) {
  const [urlId, setUrlId] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(initialPost);
  const [error, setError] = useState<string | null>(initialError);
  const [selected, setSelected] = useState<string | null>(null);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [hasReacted, setHasReacted] = useState<boolean>(false);
  const [comments, setComments] = useState<
    Array<{ displayName: string; message: string }>
  >(initialPost?.comments ?? []);
  const [displayName, setDisplayName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] =
    useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const reactionCounts = useMemo<Record<string, number>>(() => {
    return {
      like: post?.reactions?.like ?? 0,
      love: post?.reactions?.love ?? 0,
      clap: post?.reactions?.clap ?? 0,
    };
  }, [post?.reactions?.clap, post?.reactions?.like, post?.reactions?.love]);

  // determine id from URL params (either ?id=... or last path segment)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams.get("id");
      if (q) {
        setUrlId(q);
        return;
      }
      const segments = url.pathname.split("/").filter(Boolean);
      if (segments.length) {
        const last = segments[segments.length - 1];
        // if last looks like an id (has length > 6), use it
        if (last && last.length > 5) setUrlId(last);
      }
    } catch {
      // ignore
    }
  }, []);

  // (only fetching single post by id; no listing needed)

  const effectiveId = urlId ?? id;

  // fetch the post when we have the effective id
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!effectiveId) return;
      try {
        setIsRefreshing(true);
        const data = (await getPostById(effectiveId)) as ApiResponse;
        const fetched = data?.responseObject ?? null;
        if (mounted) {
          setPost(fetched);
          setComments(
            Array.isArray(fetched?.comments) ? fetched?.comments : []
          );
          setError(null);
        }
      } catch (err: unknown) {
        if (mounted)
          setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        if (mounted) setIsRefreshing(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [effectiveId]);

  useEffect(() => {
    if (!effectiveId) return;
    const key = `post:${effectiveId}:reaction`;
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (stored) {
      setSelected(stored);
      setHasReacted(true);
    } else {
      setSelected(null);
      setHasReacted(false);
    }
  }, [effectiveId]);

  const refreshPost = async () => {
    if (!effectiveId) return;
    try {
      setIsRefreshing(true);
      const data = (await getPostById(effectiveId)) as ApiResponse;
      const updatedPost = data?.responseObject ?? null;
      if (updatedPost) {
        setPost(updatedPost);
        setComments(
          Array.isArray(updatedPost.comments) ? updatedPost.comments : []
        );
        setError(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to refresh post");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReact = async (type: ReactionType) => {
    const postId = post?._id ?? effectiveId;
    if (!postId || isReacting || hasReacted) return;
    setIsReacting(true);
    setSelected(type);
    try {
      await reactToPost(postId, type);
      const key = `post:${effectiveId}:reaction`;
      if (typeof window !== "undefined" && effectiveId)
        localStorage.setItem(key, type);
      setHasReacted(true);
      await refreshPost();
    } catch {
      setSelected(null);
    } finally {
      setIsReacting(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    // fallback: try _id property or effectiveId
    const finalPostId = post?._id ?? effectiveId;
    if (!finalPostId || isSubmittingComment) return;
    const trimmedName = displayName.trim() || "Anonymous";
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    const newComment: NewComment = {
      displayName: trimmedName,
      message: trimmedMessage,
    };
    setIsSubmittingComment(true);
    setComments((prev) => [...prev, newComment]);
    setMessage("");
    try {
      await commentOnPost(finalPostId, newComment);
      await refreshPost();
    } catch {
      setComments((prev) => prev.filter((_, idx) => idx !== prev.length - 1));
      setMessage(trimmedMessage);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    if (post) {
      setComments(Array.isArray(post.comments) ? post.comments : []);
    }
  }, [post]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Blog Post</h2>
          <p className="mb-6 theme-text">{error}</p>
          <a
            href="/"
            className="inline-block bg-brand-p1 text-white px-6 py-3 rounded-lg hover:bg-brand-p2 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="theme-text">
          {isRefreshing ? "Loading post…" : "Post not found"}
        </p>
      </div>
    );
  }

  const formatDate = (value?: string) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleString("en-US", { timeZone: "UTC" });
    } catch {
      return "";
    }
  };

  const renderContent = () => {
    const html = String(marked(post?.content ?? "")).replace(
      /<a\s+[^>]*>(.*?)<\/a>/gi,
      "$1"
    );
    return { __html: html };
  };

  return (
    <>
      <PageHeader />
      <div className="flex bg-white dark:bg-[#0d1117] flex-col lg:flex-row gap-8 page-padding-x py-8">
        <div className="w-full md:w-7/10 lg:w-7/10">
          <h1 className="text-2xl md:text-3xl theme-text font-bold mb-2">{post?.title}</h1>
          <div className="flex flex-row itemms-left justify-  md:justify-start md:items-center text-sm text-neutral-m6 mb-4 gap-3">
            <span>By {post?.writer ?? "Tikianaly"}</span>
            <span className="hidden md:block">•</span>
            <span suppressHydrationWarning>{formatDate(post?.createdAt)}</span>
          </div>
          <div className="relative w-full aspect-video mb-6">
            <img
              src={post?.imageUrl || "/logo.webp"}
              alt={post?.title ?? "Blog post"}
              className="object-cover rounded-lg"
            />
          </div>
          <div
            className="richtext max-w-none theme-text leading-relaxed"
            dangerouslySetInnerHTML={renderContent()}
          />
          <div className="flex flex-wrap gap-2 mb-10">
            {(post?.hashtags ?? []).map((tag: string) => (
              <span
                key={tag}
                className="bg-brand-p3/10 text-brand-p1 px-3 py-1 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex gap-6 mt-8 mb-2">
            {reactionConfig.map((cfg) => {
              const count = reactionCounts?.[cfg.key] ?? 0;
              const isSelected = selected === cfg.key;
              return (
                <button
                  key={cfg.key}
                  className={`flex cursor-pointer flex-col items-center px-3 py-1 group focus:outline-none transition-transform duration-200 ${
                    isSelected ? "bg-brand-p3/20 rounded-full scale-110" : ""
                  }`}
                  aria-label={cfg.label}
                  type="button"
                  disabled={isReacting || hasReacted || isRefreshing}
                  onClick={() => handleReact(cfg.key as ReactionType)}
                >
                  <span className="flex items-center gap-2 text-neutral-m6">
                    {cfg.icon}
                    <span className="text-sm">{count}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isRefreshing && (
              <>
                <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-brand-p1 border-t-transparent" />
                <span>Updating…</span>
              </>
            )}
          </div>
          <div className="mt-5 flex flex-col-reverse overflow-y-auto gap-3 text-sm h-90 edge-lighting pb-0 px-0 block-style ">
            <div className=" pb-7 bg-gradient-to-t from-black/5 to-transparent w-full items-end z-2">
              <form
                onSubmit={handleSubmitComment}
                className="flex gap-2 w-full px-3"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="rounded-full outline-none py-2 px-5 theme-text bg-snow-200 dark:bg-neutral-800 focus:bg-snow-100 dark:focus:bg-neutral-700 w-2/5"
                />
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-full outline-none py-2 px-5 theme-text bg-snow-200 dark:bg-neutral-800 focus:bg-snow-100 dark:focus:bg-neutral-700 w-full"
                />
                <button
                  disabled={isSubmittingComment}
                  className="secondary rounded-full py-2 px-4 text-white"
                >
                  <Send className="w-4 h-4 " />
                </button>
              </form>
            </div>

            <div className="flex mx-5 h-full overflow-y-auto hide-scrollbar flex-col gap-3">
              <p className="font-[500] mb-1 flex items-center sz-4 theme-text">
                Comments
              </p>
              {comments.length === 0 ? (
                <p className="text-neutral-m6 text-xs">
                  Be the first to comment.
                </p>
              ) : (
                comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=static-seed-${i}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                      alt={c.displayName}
                      width={20}
                      height={20}
                      className="h-5 w-5 rounded-full"
                    />
                    <div className="block">
                      <p className="text-neutral-m6 text-xs">{c.displayName}</p>
                      <p className="theme-text">{c.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/10">
          <p className="mb-8">Also Read</p>
          <div className=" ">
            <ReadAlso currentId={effectiveId} />
          </div>
        </div>
      </div>
      <FooterComp />
    </>
  );
}
