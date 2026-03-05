import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/lib/api/news/newsEndpoint";

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-gray-300 dark:bg-[#1F2937] rounded ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
  </div>
);

const toPlainText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/[`*_#[\]()>!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const truncateWords = (value: unknown, maxWords: number) => {
  const text = toPlainText(value);
  if (!text) return "";
  const words = text.split(" ").filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}...`;
};

// Fetch news with caching
const fetchNews = async () => {
  const res = await getAllPosts(1, 6);
  const items = res?.responseObject?.items;
  return Array.isArray(items) ? items : [];
};

export const RightBar = () => {
  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ["news", "latest"],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 mins
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 mins
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Refetch on component mount if stale
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchInterval: 5 * 60 * 1000, // Background refetch every 5 minutes
    refetchIntervalInBackground: true, // Continue refetching even when tab is not focused
  });

  const featuredPost = posts?.[0];
  const sidePosts = posts?.slice(1, 3) || [];

  return (
    <div>
      <div className="flex flex-col gap-y-6">
        {/* News Section */}
        <ul className="block-style p-4">
          <>
            <p className="font-[500] text-sm flex items-center dark:text-snow-200 text-[#23272A] mb-3">
              Latest News
            </p>

            {loading ? (
              <div className="flex text-neutral-n4 flex-col gap-y-2 mb-4">
                <SkeletonBlock className="w-full h-24 rounded-md" />
                <SkeletonBlock className="w-full h-4" />
                <SkeletonBlock className="w-2/3 h-3" />
              </div>
            ) : featuredPost ? (
              <Link
                to={`/news/read/${featuredPost.id}`}
                className="flex text-neutral-n4 flex-col gap-y-2 mb-4 group"
              >
                <div
                  className="image w-full bg-cover bg-top h-24 rounded-md transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{
                    backgroundImage: `url('${featuredPost.imageUrl || "/logo.webp"}')`,
                  }}
                ></div>
                <p className="text-xs dark:text-white font-[500] leading-snug line-clamp-3">
                  {featuredPost.title}
                </p>
                <div className="flex dark:text-snow-200 gap-2 text-[10px]">
                  <span>{featuredPost.timeAgo || ""}</span>
                  <span>{featuredPost.readTime || ""}</span>
                </div>
              </Link>
            ) : null}

            <div className="flex-col flex gap-3">
              {loading
                ? Array.from({ length: 2 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-neutral-n4 ${
                        idx === 0
                          ? "border-y dark:border-[#1F2937] border-snow-200 py-3"
                          : ""
                      }`}
                    >
                      <SkeletonBlock className="w-16 h-10 flex-shrink-0 rounded-md" />
                      <div className="flex-1">
                        <SkeletonBlock className="w-full h-3 mb-1" />
                        <SkeletonBlock className="w-1/2 h-2" />
                      </div>
                    </div>
                  ))
                : sidePosts.map((news, idx) => (
                    <Link
                      key={news?.id ?? idx}
                      to={`/news/read/${news.id}`}
                      className={`flex items-center gap-2 text-neutral-n4 group ${
                        idx === 0
                          ? "border-y dark:border-[#1F2937] border-snow-200 py-3"
                          : ""
                      }`}
                    >
                      <div
                        className="image w-16 h-10 flex-shrink-0 bg-cover bg-center rounded-md transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundImage: `url('${news.imageUrl || "/logo.webp"}')`,
                        }}
                      ></div>
                      <div className="min-w-0">
                        <p className="text-[11px] dark:text-snow-200 font-[500] leading-tight line-clamp-2">
                          {truncateWords((news as any)?.title, 8)}
                        </p>
                        <span className="text-[10px] dark:text-white/70">
                          {news.timeAgo || ""}
                        </span>
                      </div>
                    </Link>
                  ))}
            </div>
          </>
        </ul>

        {/* Download  Section */}
        <div>
          <ul className="block-style">
            <p className="font-[500] dark:text-snow-200 mb-3 text-[#23272A]">
              Download our Mobile App
            </p>
            <div className="flex flex-col gap-3">
              <img src="\assets\icons\Group 1261157024.png" alt="" />
              <img
                src="\assets\icons\Frame 1261157588.png"
                className="cursor-pointer"
                alt=""
              />
              <img
                src="\assets\icons\Frame 1261157587.png"
                className="cursor-pointer"
                alt=""
              />
            </div>
          </ul>

          <div className="mt-7">
            <ul className="block-style edge-lighting">
              <p className="font-[500] dark:text-snow-200 mb-3 text-[#23272A]">
                Chat with our AI Buddy
              </p>
              <div className="flex flex-col gap-3">
                <img src="\assets\icons\Chat bot-bro 1.png" alt="" />
                <img
                  src="\assets\icons\Secondary.png"
                  className="cursor-pointer"
                  alt=""
                />
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;