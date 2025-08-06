import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import { Category } from "../components/dasboardelements/Category";
import { BookmarkIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/solid";
import Navigation from "../components/dasboardelements/Navigation";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
var newsData = [
  {
    image: "/assets/icons/mbape.png",
    title: "Kylian Mbappe Scores third goal in UCL win",
    time: "6 hours ago",
  },
  {
    image: "/assets/icons/mbape.png",
    title: "Kylian Mbappe Scores third goal in UCL win",
    time: "6 hours ago",
  },
  {
    image: "/assets/icons/mbape.png",
    title: "Kylian Mbappe Scores third goal in UCL win",
    time: "6 hours ago",
  },
  {
    image: "/assets/icons/mbape.png",
    title: "Kylian Mbappe Scores third goal in UCL win",
    time: "6 hours ago",
  },
];
export const news = () => {
  return (
    <div className="dark:bg-[#0D1117]">
      <PageHeader />
      <Navigation />
      <Category />
      <div className="page-padding-x gap-10 flex flex-col mt-4">
        <div className="block-style">
          <p className="sz-4 mb-3 dark:text-white font-[500]">Trending News</p>
          <div className="flex justify-around  gap-5">
            <div className='relative w-full lg:w-4/6 h-80 bg-[url("/assets/icons/kilan.jpg")] bg-cover bg-top rounded-[8px]'>
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 rounded-[8px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                }}
              />
              <div className="flex flex-col absolute bottom-5 px-5 gap-y-2">
                <div className="flex items-center text-white gap-2 sz-7 ">
                  <img
                    src="/assets/icons/Football/Team/Arsenal.png"
                    alt=""
                    className="w-6 h-6"
                  />
                  <span>Ali Moses</span>
                  <span>|</span>
                  <span>6 mins read</span>
                </div>
                <p className="text-white sz-4 font-bold">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex gap-3">
                  <span className="text-white sz-7">6 hours ago</span>
                  <HeartIcon className="w-5 h-5 cursor-pointer text-brand-secondary" />
                  <BookmarkIcon className="w-5 h-5 cursor-pointer text-white" />
                  <ShareIcon className="w-5 h-5 cursor-pointer text-white" />
                </div>
              </div>
            </div>
            {/* Sidebar with list of trending news items */}
            <div className="md:flex flex-col hidden py-4 w-2/6 gap-y-5">
              {/* Map through newsData array to render each news item */}
              {newsData.map((news, idx) => (
                <div
                  key={idx}
                  className="flex items-center border-b border-snow-100 dark:border-[#1F2937] pb-3 gap-3 text-neutral-n4"
                >
                  {/* News image as a background */}
                  <div
                    className="image w-2/6 bg-cover bg-center h-20 rounded"
                    style={{ backgroundImage: `url('${news.image}')` }}
                  ></div>
                  {/* News title and time */}
                  <div className="w-4/6">
                    <p className="sz-7 dark:text-snow-200 font-[500]">
                      {news.title}
                    </p>
                    <span className="sz-8 dark:text-snow-200">{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="block-style">
          <div className="flex mb-3 dark:text-white justify-between">
            <p className="sz-4 font-medium">Football News</p>
            <div className="flex text-neutral-n4 dark:text-white">
              <AdjustmentsHorizontalIcon className="w-5 h-5 cursor-pointer" />
              <span className=" ml-2">Filter</span>
            </div>
          </div>
          {newsData.map((news, idx) => (
                <div
                  key={idx}
                  className="flex lg:hidden items-center border-b border-snow-100 dark:border-[#1F2937] pb-3 gap-3 text-neutral-n4"
                >
                  {/* News image as a background */}
                  <div
                    className="image w-2/6 bg-cover bg-center h-20 rounded"
                    style={{ backgroundImage: `url('${news.image}')` }}
                  ></div>
                  {/* News title and time */}
                  <div className="w-4/6">
                    <p className="sz-7 dark:text-snow-200 font-[500]">
                      {news.title}
                    </p>
                    <span className="sz-8 dark:text-snow-200">{news.time}</span>
                    <div className="flex overflow-x-auto  overflow-y-auto whitespace-nowrap text-neutral-n5 sz-8 gap-2">
                      <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                        #Premier League
                      </p>
                      <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                        #Real Madrid
                      </p>
                      <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                        #Liverpool
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          <div className="flex justify-between mb-5 border-b border-snow-100 dark:border-[#1F2937] pb-5">
            <div className="flex items-center  gap-3 text-neutral-n4">
              {/* News image as a background */}
              <div
                className="image w-30 bg-cover bg-center h-20 rounded"
                style={{ backgroundImage: `url('/assets/icons/mbape.png')` }}
              ></div>
              {/* News title and time */}
              <div className="flex flex-col justify-between h-full">
                <p className="sz-7 dark:text-snow-200 font-[500]">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex text-neutral-n5 sz-8 gap-2">
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Premier League
                  </p>
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Real Madrid
                  </p>
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Liverpool
                  </p>
                </div>
              </div>
            </div>
            <p className="text-neutral-n4 dark:text-snow-200  sz-8 self-end mt-auto">
              6 Hours Ago
            </p>
          </div>

          <div className="flex justify-between mb-5 border-b border-snow-100 dark:border-[#1F2937] pb-5">
            <div className="flex items-center  gap-3 text-neutral-n4">
              {/* News image as a background */}
              <div
                className="image w-30 bg-cover bg-center h-20 rounded"
                style={{ backgroundImage: `url('/assets/icons/mbape.png')` }}
              ></div>
              {/* News title and time */}
              <div className="flex flex-col justify-between h-full">
                <p className="sz-7 dark:text-snow-200 font-[500]">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex text-neutral-n5 sz-8 gap-2">
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Premier League
                  </p>
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Real Madrid
                  </p>
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Liverpool
                  </p>
                </div>
              </div>
            </div>
            <p className="text-neutral-n4 dark:text-snow-200 sz-8 self-end mt-auto">
              6 Hours Ago
            </p>
          </div>

          <div className="flex justify-between mb-5 border-b border-snow-100 dark:border-[#1F2937] pb-5">
            <div className="flex items-center  gap-3 text-neutral-n4">
              {/* News image as a background */}
              <div
                className="image w-30 bg-cover bg-center h-20 rounded"
                style={{ backgroundImage: `url('/assets/icons/mbape.png')` }}
              ></div>
              {/* News title and time */}
              <div className="flex flex-col justify-between h-full">
                <p className="sz-7 dark:text-snow-200 font-[500]">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex text-neutral-n5 sz-8 gap-2">
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Premier League
                  </p>
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Real Madrid
                  </p>
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Liverpool
                  </p>
                </div>
              </div>
            </div>
            <p className="text-neutral-n4 dark:text-snow-200 sz-8 self-end mt-auto">
              6 Hours Ago
            </p>
          </div>

          <div className="flex justify-between mb-5 border-b border-snow-100 dark:border-[#1F2937] pb-5">
            <div className="flex items-center  gap-3 text-neutral-n4">
              {/* News image as a background */}
              <div
                className="image w-30 bg-cover bg-center h-20 rounded"
                style={{ backgroundImage: `url('/assets/icons/mbape.png')` }}
              ></div>
              {/* News title and time */}
              <div className="flex flex-col justify-between h-full">
                <p className="sz-7 dark:text-snow-200 font-[500]">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex text-neutral-n5 sz-8 gap-2">
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Premier League
                  </p>
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Real Madrid
                  </p>
                  <p className="bg-brand-p4 dark:bg-brand-s4 dark:text-neutral-n3 cursor-pointer rounded px-2 py-1 h-fit">
                    #Liverpool
                  </p>
                </div>
              </div>
            </div>
            <p className="text-neutral-n4 dark:text-snow-200 sz-8 self-end mt-auto">
              6 Hours Ago
            </p>
          </div>
        </div>

        <div className="block-style">
          <div className="flex mb-3 justify-between">
            <p className="sz-4 dark:text-white font-medium">Basketball News</p>
            <div className="flex">
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-neutral-n4 cursor-pointer" />
              <span className="text-neutral-n4 ml-2">Filter</span>
            </div>
          </div>
          <div className="flex justify-between mb-5 border-b border-snow-100 dark:border-[#1F2937] pb-5">
            <div className="flex items-center  gap-3 text-neutral-n4">
              {/* News image as a background */}
              <div
                className="image w-30 bg-cover bg-center h-20 rounded"
                style={{ backgroundImage: `url('/assets/icons/mbape.png')` }}
              ></div>
              {/* News title and time */}
              <div className="flex flex-col justify-between h-full">
                <p className="sz-7 dark:text-snow-200 font-[500]">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex text-neutral-n5 sz-8 gap-2">
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Premier League
                  </p>
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Real Madrid
                  </p>
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Liverpool
                  </p>
                </div>
              </div>
            </div>
            <p className="text-neutral-n4 sz-8 dark:text-snow-200 self-end mt-auto">
              6 Hours Ago
            </p>
          </div>

          <div className="flex justify-between mb-5 border-b border-snow-100 dark:border-[#1F2937] pb-5">
            <div className="flex items-center  gap-3 text-neutral-n4">
              {/* News image as a background */}
              <div
                className="image w-30 bg-cover bg-center h-20 rounded"
                style={{ backgroundImage: `url('/assets/icons/mbape.png')` }}
              ></div>
              {/* News title and time */}
              <div className="flex flex-col justify-between h-full">
                <p className="sz-7 dark:text-snow-200 font-[500]">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex text-neutral-n5 sz-8 gap-2">
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Premier League
                  </p>
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Real Madrid
                  </p>
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Liverpool
                  </p>
                </div>
              </div>
            </div>
            <p className="text-neutral-n4 sz-8 self-end mt-auto">6 Hours Ago</p>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center  gap-3 text-neutral-n4">
              {/* News image as a background */}
              <div
                className="image w-30 bg-cover bg-center h-20 rounded"
                style={{ backgroundImage: `url('/assets/icons/mbape.png')` }}
              ></div>
              {/* News title and time */}
              <div className="flex flex-col justify-between h-full">
                <p className="sz-7 dark:text-snow-200 font-[500]">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex text-neutral-n5 sz-8 gap-2">
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Premier League
                  </p>
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Real Madrid
                  </p>
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Liverpool
                  </p>
                </div>
              </div>
            </div>
            <p className="text-neutral-n4 sz-8 self-end mt-auto">6 Hours Ago</p>
          </div>

          <div className="flex justify-between mb-5 border-b border-snow-100 pb-5">
            <div className="flex items-center  gap-3 text-neutral-n4">
              {/* News image as a background */}
              <div
                className="image w-30 bg-cover bg-center h-20 rounded"
                style={{ backgroundImage: `url('/assets/icons/mbape.png')` }}
              ></div>
              {/* News title and time */}
              <div className="flex flex-col justify-between h-full">
                <p className="sz-7 dark:text-snow-200 font-[500]">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex text-neutral-n5 sz-8 gap-2">
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Premier League
                  </p>
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Real Madrid
                  </p>
                  <p className="bg-brand-p4 cursor-pointer rounded px-2 py-1 h-fit">
                    #Liverpool
                  </p>
                </div>
              </div>
            </div>
            <p className="text-neutral-n4 sz-8 self-end mt-auto">6 Hours Ago</p>
          </div>
        </div>
      </div>
      <FooterComp />
    </div>
  );
};

export default news;
