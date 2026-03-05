import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { Category } from "@/features/dashboard/components/Category";
import { BookmarkIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { ArrowUpRight } from "lucide-react";

import { getAllPosts } from "@/lib/api/news/newsEndpoint";
import { Link } from "react-router-dom";

// Shimmer skeleton components
const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-gray-300 dark:bg-[#1F2937] rounded ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
  </div>
);

const SkeletonTrending = () => (
  <div className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
    <SkeletonBlock className="w-full h-full" />
  </div>
);

const SkeletonSidePost = () => (
  <div className="flex items-center gap-3 pb-3">
    <SkeletonBlock className="w-20 h-16 sm:w-24 sm:h-20 rounded flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <SkeletonBlock className="w-full h-4 mb-2" />
      <SkeletonBlock className="w-2/3 h-3" />
    </div>
  </div>
);

const SkeletonNewsCard = () => (
  <div className="flex items-center gap-3 p-3 mb-2 rounded border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22]">
    <SkeletonBlock className="w-24 h-16 sm:w-32 sm:h-20 rounded flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <SkeletonBlock className="w-full h-4 mb-2" />
      <SkeletonBlock className="w-1/2 h-3 mb-2" />
      <div className="flex gap-2">
        <SkeletonBlock className="w-12 h-5 rounded" />
        <SkeletonBlock className="w-12 h-5 rounded" />
      </div>
    </div>
  </div>
);

const EmptyCard = () => (
  <div className="flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg h-28 mb-4 bg-gray-100 dark:bg-[#1F2937] text-gray-500">
    <img src="/logo.webp" alt="No Post" className="w-10 h-10 mr-3" />
    <span>No posts available</span>
  </div>
);

// Fetch function for TanStack Query
const fetchNewsPage = async (page: number) => {
  const res = await getAllPosts(page, 20);
  return {
    posts: res?.responseObject?.items || [],
    totalPages: res?.responseObject?.totalPages || 1,
  };
};

const News = () => {
  const [page, setPage] = useState(1);
  
  const { data, isLoading: loading } = useQuery({
    queryKey: ["news", "page", page],
    queryFn: () => fetchNewsPage(page),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  const trendingPost = posts?.[0];
  const sidePosts = posts?.slice(1, 6) || [];
  const remainingPosts = posts?.slice(6) || [];

  const renderPagination = () => {
    const maxButtons = 3;
    let startPage = Math.max(1, page - 1);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    const pages: (number | string)[] = [];

    if (startPage > 1) pages.push(1);
    if (startPage > 2) pages.push("...");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push("...");
    if (endPage < totalPages) pages.push(totalPages);

    return (
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        <button
          className="px-3 py-1.5 text-sm rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-3 py-1.5 text-sm text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              className={`px-3 py-1.5 text-sm rounded cursor-pointer ${
                page === p ? "bg-brand-primary text-white" : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => setPage(Number(p))}
            >
              {p}
            </button>
          )
        )}
        <button
          className="px-3 py-1.5 text-sm rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      <PageHeader />
      <Category />
      <div className="page-padding-x gap-6 flex flex-col mt-4 pb-8">
        {/* Trending Section */}
        <div className="block-style p-4 sm:p-5">
          <p className="text-lg sm:text-xl mb-3 dark:text-white font-medium">Trending News</p>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
            {/* Main Trending Post */}
            <div className="relative w-full lg:w-4/6 h-64 sm:h-80 md:h-96 rounded-lg bg-gray-200 dark:bg-[#1F2937] overflow-hidden">
              {loading && !trendingPost ? (
                <SkeletonTrending />
              ) : trendingPost ? (
                <Link to={`/news/read/${trendingPost.id}`} className="block relative h-full w-full group">
                  <div
                    className="absolute inset-0 bg-cover bg-top transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${trendingPost.imageUrl || "/logo.webp"}')` }}
                  />
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                    }}
                  />
                  <div className="flex flex-col absolute bottom-0 left-0 right-0 p-4 sm:p-5 gap-y-2">
                    <div className="flex items-center text-white gap-2 text-xs sm:text-sm">
                      <span className="capitalize truncate">{trendingPost.source || "Author"}</span>
                      <span className="hidden sm:inline">|</span>
                      <span className="hidden sm:inline">{trendingPost.readTime || "5 mins read"}</span>
                    </div>
                    <p className="text-white text-base sm:text-lg md:text-xl font-bold line-clamp-2">{trendingPost.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-white text-xs sm:text-sm">{trendingPost.timeAgo || "6 hours ago"}</span>
                      <div className="flex gap-2 ml-auto">
                        <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-brand-secondary hover:scale-110 transition" />
                        <BookmarkIcon className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-white hover:scale-110 transition" />
                        <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-white hover:scale-110 transition" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-brand-secondary/90 hover:bg-brand-secondary px-4 py-1.5 rounded-full text-white absolute top-4 right-4 text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition">
                    Read Post
                    <ArrowUpRight size={14} />
                  </div>
                </Link>
              ) : (
                <EmptyCard />
              )}
            </div>

            {/* Sidebar with 5 posts */}
            <div className="flex flex-col w-full lg:w-2/6 gap-y-3 lg:gap-y-4">
              {loading && sidePosts.length === 0
                ? Array.from({ length: 4 }).map((_, idx) => <SkeletonSidePost key={idx} />)
                : sidePosts.length
                ? sidePosts.map((news: any, idx: number) => (
                    <Link
                      key={news.id || idx}
                      to={`/news/read/${news.id}`}
                      className="flex items-center gap-3 pb-3 border-b border-snow-100 dark:border-[#1F2937] last:border-b-0 text-neutral-n4 hover:bg-gray-100 dark:hover:bg-[#1F2937]/50 rounded transition group"
                    >
                      <div
                        className="w-20 h-16 sm:w-24 sm:h-20 flex-shrink-0 bg-cover bg-center rounded transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundImage: `url('${news.imageUrl || "/logo.webp"}')` }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm dark:text-snow-200 font-medium line-clamp-2">{news.title}</p>
                        <span className="text-[10px] sm:text-xs dark:text-snow-200/70">{news.timeAgo || "6 hours ago"}</span>
                      </div>
                    </Link>
                  ))
                : <EmptyCard />}
            </div>
          </div>
        </div>

        {/* Rest of the posts */}
        <div className="block-style p-4 sm:p-5">
          <div className="flex mb-4 justify-between items-center">
            <p className="text-lg sm:text-xl font-medium text-neutral-n4 dark:text-white">All News</p>
            <div className="flex items-center text-neutral-n4 dark:text-white hover:text-brand-secondary transition-colors cursor-pointer text-sm">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">Filter</span>
            </div>
          </div>

          {loading && remainingPosts.length === 0
            ? Array.from({ length: 5 }).map((_, idx) => <SkeletonNewsCard key={idx} />)
            : remainingPosts.length
            ? remainingPosts.map((news: any, idx: number) => (
                <Link
                  key={news.id || idx}
                  to={`/news/read/${news.id}`}
                  className="flex items-center gap-3 p-3 mb-2 rounded transition-colors border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22] hover:bg-snow-100 dark:hover:bg-[#1F2937] text-neutral-n4 group"
                >
                  <div
                    className="w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 bg-cover bg-center rounded transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url('${news.imageUrl || "/logo.webp"}')` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm dark:text-snow-200 font-medium line-clamp-2">{news.title}</p>
                    <span className="text-[10px] sm:text-xs dark:text-snow-200/70">{news.timeAgo || "6 hours ago"}</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {news.tags?.slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 text-[10px] sm:text-xs cursor-pointer rounded px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            : <EmptyCard />
          }

          {/* Pagination */}
          {totalPages > 1 && renderPagination()}
        </div>
      </div>
      <FooterComp />
    </div>
  );
};

export default News;