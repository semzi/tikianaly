import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/api/newsEndpoint";

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-[#1F2937] rounded ${className}`} />
);

export const RightBar = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAllPosts(1, 6);
        const items = res?.responseObject?.items;
        if (mounted) setPosts(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error(err);
        if (mounted) setPosts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const featuredPost = posts?.[0];
  const sidePosts = posts?.slice(1, 3) || [];

  return (
    <div>
      <div className="flex flex-col gap-y-10">
        {/* News Section */}
        <ul className="block-style edge-lighting">
          <>
            <p className="font-[500] flex items-center dark:text-snow-200 text-[#23272A]">
              Latest News
            </p>

            {loading ? (
              <div className="flex text-neutral-n4 flex-col gap-y-3 mb-5">
                <SkeletonBlock className="mt-4 w-full h-32" />
                <SkeletonBlock className="w-full h-5" />
                <SkeletonBlock className="w-2/3 h-4" />
              </div>
            ) : featuredPost ? (
              <Link
                to={`/news/read/${featuredPost._id}`}
                className="flex text-neutral-n4 flex-col gap-y-3 mb-5"
              >
                <div
                  className="image mt-4 w-full bg-cover bg-top h-32 rounded"
                  style={{
                    backgroundImage: `url('${featuredPost.imageUrl || "/logo.webp"}')`,
                  }}
                ></div>
                <p className="sz-6 dark:text-white font-[500]">
                  {featuredPost.title}
                </p>
                <div className="flex dark:text-snow-200 gap-2 sz-8 ">
                  <span>{featuredPost.timeAgo || ""}</span>
                  
                  <span>{featuredPost.readTime || ""}</span>
                </div>
              </Link>
            ) : null}

            <div className="flex-col flex gap-5">
              {loading
                ? Array.from({ length: 2 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-neutral-n4 ${
                        idx === 0
                          ? "border-y-1 dark:border-[#1F2937] border-snow-200 py-5"
                          : ""
                      }`}
                    >
                      <SkeletonBlock className="w-50 h-20" />
                      <div className="flex-1">
                        <SkeletonBlock className="w-full h-4 mb-2" />
                        <SkeletonBlock className="w-1/2 h-3" />
                      </div>
                    </div>
                  ))
                : sidePosts.map((news, idx) => (
                    <Link
                      key={news?._id ?? idx}
                      to={`/news/read/${news._id}`}
                      className={`flex items-center gap-3 text-neutral-n4 ${
                        idx === 0
                          ? "border-y-1 dark:border-[#1F2937] border-snow-200 py-5"
                          : ""
                      }`}
                    >
                      <div
                        className="image w-50 bg-cover bg-center h-20 rounded"
                        style={{
                          backgroundImage: `url('${news.imageUrl || "/logo.webp"}')`,
                        }}
                      ></div>
                      <div>
                        <p className="sz-8 dark:text-snow-200 font-[500]">
                          {news.title}
                        </p>
                        <span className="sz-8 dark:text-white">
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