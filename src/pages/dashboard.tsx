import { PageHeader } from "../components/dasboardelements/PageHeader";
import { FooterComp } from "../components/dasboardelements/Footer";
import { Category } from "../components/dasboardelements/Category";
import popularLeagues from "../data/popularLeagues";
import allLeagues from "../data/allLeagues";

export const dashboard = () => {
  return (
    <div>
      <PageHeader />
      <Category />
      <div className="flex page-padding-x gap-3 py-5 justify-around">
        {/* Left Sidebar */}
        <div className="w-1/5 hidden md:block">
          <div className="flex flex-col gap-y-10">
            {/* Popular Leagues */}
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

            {/* All Leagues */}
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
        {/* Main Content */}
        <div className="bg-ui-pending w-full lg:w-3/5"> <ul className="bg-white border-1 h-fit border-snow-200 rounded p-5">
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
            </ul></div>
        {/* Right Sidebar */}
        <div className="w-1/5 bg-ui-negative hidden lg:block md:w-1/5">3</div>
      </div>
      <FooterComp />
    </div>
  );
};

export default dashboard;
