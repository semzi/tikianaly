import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import { Category } from "../components/dasboardelements/Category";
import { BookmarkIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/solid";


export const news = () => {
  return (
    <div className="dark:bg-[#0D1117]">
      <PageHeader />
      <Category />
      <div className="page-padding-x  mt-4">
        <div className="block-style">
          <p className="sz-4 mb-3 dark:text-white font-[500]">Trending News</p>
          <div className="flex justify-around  gap-5">
            <div className='relative w-4/6 bg-[url("/assets/icons/kilan.jpg")] bg-cover bg-top rounded-[8px]'>
              <div className="flex flex-col absolute bottom-5 px-5 gap-y-2">
                <div className="flex items-center text-white gap-2 sz-7 ">
                  <img src="/assets/icons/Football/Team/Arsenal.png" alt="" className="w-6 h-6" />
                  <span>Ali Moses</span>
                  <span>|</span>
                  <span>6 mins read</span>
                </div>
                <p className="text-white sz-4 font-bold">
                  Kylian Mbappe Scores third goal in UCL win
                </p>
                <div className="flex gap-3">
                    <span className="text-white sz-7">6 hours ago</span>
                    <HeartIcon className="w-5 h-5 cursor-pointer text-ui-negative" />
                    <BookmarkIcon className="w-5 h-5 cursor-pointer text-white" />
                    <ShareIcon className="w-5 h-5 cursor-pointer text-white" />
                </div>
              </div>
            </div>
            <div className="flex flex-col py-4 w-2/6 gap-y-5">
                    {/* single news column */}
                    <div className="flex items-center gap-3 text-neutral-n4">
                      <div className='image w-2/6 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div className="w-4/6">
                        <p className="sz-7 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">6 hours ago</span>
                      </div>
                    </div>
                    {/* end of news col */}
                    {/* single news column */}
                    <div className="flex  items-center gap-3 text-neutral-n4">
                      <div className='image w-2/6 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div className="w-4/6">
                        <p className="sz-7 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">6 hours ago</span>
                      </div>
                    </div>
                    {/* end of news col */}
                    {/* single news column */}
                    <div className="flex items-center gap-3 text-neutral-n4">
                      <div className='image w-2/6 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div className="w-4/6">
                        <p className="sz-7 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">6 hours ago</span>
                      </div>
                    </div>
                    {/* end of news col */}
                    {/* single news column */}
                    <div className="flex  items-center gap-3 text-neutral-n4">
                      <div className='image w-2/6 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div className="w-4/6">
                        <p className="sz-7 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">6 hours ago</span>
                      </div>
                    </div>
                    {/* end of news col */}
            </div>
          </div>
        </div>
      </div>
      <FooterComp />
    </div>
  );
};

export default news;
