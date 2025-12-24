import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import { Category } from "@/features/dashboard/components/Category";
import { BookmarkIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { ArrowUpRight } from "lucide-react";

import { getAllPosts } from "@/lib/api/newsEndpoint";
import { Link } from "react-router-dom";

const SkeletonPost = () => (
  <div className="animate-pulse bg-gray-300 dark:bg-[#1F2937] rounded-lg h-28 w-full mb-4" />
);

const EmptyCard = () => (
  <div className="flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg h-28 mb-4 bg-gray-100 dark:bg-[#1F2937] text-gray-500">
    <img src="/logo.webp" alt="No Post" className="w-10 h-10 mr-3" />
    <span>No posts available</span>
  </div>
);

const News = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (page: number) => {
    setLoading(true);
    try {
      const res = await getAllPosts(page, 20);
      setPosts(res?.responseObject.items || []);
      setTotalPages(res?.responseObject.totalPages || 1);
    } catch (error) {
      console.error(error);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

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
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              className={`px-3 py-1 rounded cursor-pointer ${
                page === p ? "bg-brand-primary text-white" : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => setPage(Number(p))}
            >
              {p}
            </button>
          )
        )}
        <button
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
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
      <div className="page-padding-x gap-10 flex flex-col mt-4">
        {/* Trending Section */}
        <div className="block-style">
          <p className="sz-4 mb-3 dark:text-white font-medium">Trending News</p>
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Main Trending Post */}
            <div className="relative w-full lg:w-4/6 h-90 md:h-110 rounded-lg bg-gray-200 dark:bg-[#1F2937] overflow-hidden">
              {loading ? (
                <SkeletonPost />
              ) : trendingPost ? (
                <Link to={`/news/read/${trendingPost._id}`} className="block relative h-full w-full">
                  <div
                    className="absolute inset-0 bg-cover bg-top"
                    style={{ backgroundImage: `url('${trendingPost.imageUrl || "/logo.webp"}')` }}
                  />
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                    }}
                  />
                  <div className="flex flex-col absolute bottom-5 px-5 gap-y-2">
                    <div className="flex items-center text-white gap-2 sz-7">
                      <span className="capitalize">{trendingPost.source || "Author"}</span>
                      <span>|</span>
                      <span>{trendingPost.readTime || "5 mins read"}</span>
                    </div>
                    <p className="text-white sz-4 font-bold">{trendingPost.title}</p>
                    <div className="flex gap-3">
                      <span className="text-white sz-7">{trendingPost.timeAgo || "6 hours ago"}</span>
                      <HeartIcon className="w-5 h-5 cursor-pointer text-brand-secondary" />
                      <BookmarkIcon className="w-5 h-5 cursor-pointer text-white" />
                      <ShareIcon className="w-5 h-5 cursor-pointer text-white" />
                    </div>
                  </div>
                  <div className="bg-[#324a56] px-5 py-1 rounded-full text-white absolute bottom-5 right-3 text-sm animate-bounce flex items-center gap-1 cursor-pointer">
                    Read Post
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              ) : (
                <EmptyCard />
              )}
            </div>

            {/* Sidebar with 5 posts */}
            <div className="md:flex flex-col hidden py-4 w-2/6 gap-y-5">
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => <SkeletonPost key={idx} />)
                : sidePosts.length
                ? sidePosts.map((news, idx) => (
                    <Link
                      key={idx}
                      to={`/news/read/${news._id}`}
                      className="flex items-center border-b border-snow-100 dark:border-[#1F2937] pb-3 gap-3 text-neutral-n4 hover:bg-gray-200 dark:hover:bg-[#1F2937] rounded transition"
                    >
                      <div
                        className="image w-2/6 bg-cover bg-center h-20 rounded"
                        style={{ backgroundImage: `url('${news.imageUrl || "/logo.webp"}')` }}
                      />
                      <div className="w-4/6">
                        <p className="sz-7 dark:text-snow-200 font-medium">{news.title}</p>
                        <span className="sz-8 dark:text-snow-200">{news.timeAgo || "6 hours ago"}</span>
                      </div>
                    </Link>
                  ))
                : <EmptyCard />}
            </div>
          </div>
        </div>

        {/* Rest of the posts */}
        <div className="block-style">
          <div className="flex mb-3 justify-between">
            <p className="sz-4 font-medium text-neutral-n4 dark:text-white">All News</p>
            <div className="flex items-center text-neutral-n4 dark:text-white hover:text-brand-secondary transition-colors cursor-pointer">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span className="ml-2">Filter</span>
            </div>
          </div>

          {loading
            ? Array.from({ length: 5 }).map((_, idx) => <SkeletonPost key={idx} />)
            : remainingPosts.length
            ? remainingPosts.map((news, idx) => (
                <Link
                  key={idx}
                  to={`/news/read/${news._id}`}
                  className="flex items-center p-3 gap-3 mb-2 rounded transition-colors border border-snow-200 dark:border-[#1F2937] bg-white dark:bg-[#161B22] hover:bg-snow-100 dark:hover:bg-[#1F2937] text-neutral-n4"
                >
                  <img
                    className="image w-40 object-cover bg-center h-full rounded"
                    src={`${news.imageUrl || "/logo.webp"}`}
                  />
                  <div className="w-4/6">
                    <p className="sz-7 dark:text-snow-200 font-medium">{news.title}</p>
                    <span className="sz-8 dark:text-snow-200">{news.timeAgo || "6 hours ago"}</span>
                    <div className="flex overflow-x-auto hide-scrollbar overflow-y-auto whitespace-nowrap text-neutral-n5 sz-8 gap-2 mt-1">
                      {news.tags?.map((tag: string, i: number) => (
                        <p
                          key={i}
                          className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit"
                        >
                          {tag}
                        </p>
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