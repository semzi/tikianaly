import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import { Category } from "../components/dasboardelements/Category";
import popularLeagues from "../data/popularLeagues";
import allLeagues from "../data/allLeagues";

export const dashboard = () => {
  return (
    <div>
      {/* Page Header */}
      <PageHeader />

      {/* Category Navigation */}
      <Category />

      <div className="flex page-padding-x gap-3 py-5 justify-around">
        {/* Left Sidebar */}
        <div className="w-1/5 hidden md:block">
          <div className="flex flex-col gap-y-10">
            {/* Popular Leagues Section */}
            <ul className="bg-white border-1 h-fit border-snow-200 rounded p-5">
              <p className="font-[500] text-[#23272A]">Popular Leagues</p>
              {popularLeagues.map((league, idx) => (
                <li
                  key={league.name + idx}
                  className="flex mt-5 items-center gap-2 text-[#586069] text-sm mb-4"
                >
                  <img src={league.icon} alt={league.name} />
                  <span>{league.name}</span>
                </li>
              ))}
            </ul>

            {/* All Leagues Section */}
            <ul className="bg-white border-1 h-fit border-snow-200 rounded p-5">
              <div className="flex items-center my-auto">
                <p className="font-[500] text-[#23272A]">All Leagues</p>
                <img
                  src="/assets/icons/search-black.png"
                  className="w-[17px] h-[17px] ml-auto align-basel"
                  alt=""
                />
              </div>
              {allLeagues.map((league, idx) => (
                <li
                  key={league.name + idx}
                  className="flex mt-5 items-center gap-2 text-[#586069] text-sm mb-4"
                >
                  <img src={league.icon} alt={league.name} />
                  <span className="flex-1">{league.name}</span>
                  <img
                    src="/assets/icons/expand-up-down-line 1.png"
                    className="cursor-pointer ml-auto align-basel"
                    alt={league.name}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full flex flex-col gap-y-5 lg:w-3/5">
          {/* Date and Filter Controls */}
          <div className="bg-white border-1 h-fit border-snow-200 rounded p-5">
            <div className="flex justify-center flex-col">
              {/* Date Navigation */}
              <div className="flex items-center mb-3 justify-between">
                <img src="\assets\icons\left.png" alt="" />
                <div className="flex gap-3 text-neutral-n5 items-center">
                  <p>Today</p>
                  <img src="\assets\icons\calender.png" alt="" />
                </div>
                <img src="\assets\icons\right.png" alt="" />
              </div>
              {/* Filter Buttons */}
              <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
                <div
                  className="overflow-x-hidden flex gap-3 w-full"
                  style={{
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE 10+
                  }}
                >
                  <button className="filter-btn">Live Games</button>
                  <button className="filter-btn">By Date</button>
                  <button className="filter-btn">Other Filters</button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Games Loop */}
          <div className="flex flex-col gap-5">
          <div className="bg-white border-1 h-fit flex-col border-snow-200 rounded ">
            <div className="flex gap-3 border-b-1 px-5 py-3 border-snow-200">
            <img src="\assets\icons\Football\League\Rectangle 6-3.png" className="w-fit" alt="" />
            <p className="font-[500] text-[#23272A] text-[14px] md:text-base">Champion League</p>
            </div>
            <div className="flex gap-3 border-b-1 p-5 border-snow-200">
            <img src="\assets\icons\Football\League\Rectangle 6-3.png" className="w-fit" alt="" />
            <p className="font-[500] text-[#23272A] text-[14px] md:text-base">Champion League</p>
            </div>
            
          </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 bg-ui-negative hidden lg:block md:w-1/5">3</div>
      </div>

      {/* Footer */}
      <FooterComp />
    </div>
  );
};

export default dashboard;
