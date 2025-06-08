import { useState } from "react";
export const PageHeader = () => {
  const [searchShow, setSearchShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="bg-brand-primary text-white page-padding-x py-4 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center justify-between gap-4 md:gap-10">
        <h1 className="text-xl md:text-2xl font-bold">TikiAnaly</h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex cursor-pointer font-semibold items-center gap-6 text">
          {["News", "Favourite", "About Us"].map((item) => (
            <p key={item} className="relative group">
              <span className="group-hover:text-brand-secondary transition-colors duration-300">
                {item}
              </span>
              <span className="secondary-hover"></span>
            </p>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-6">
        {!searchShow &&
        (<div className="flex border md:border-none p-2 rounded items-center gap-2">
          <img src="/assets/icons/Vector.png" alt="" className=" w-4 h-4" />
          <img
            src="/assets/icons/United Kingdom.png"
            alt=""
            className="w-5 h-5"
          />
          <p className="font-semibold text-sm md:text-base">ENG</p>
        </div>)}
        {searchShow && (
          <div className="flex">
            <input
              type="text"
              placeholder="Search Here...."
              className="rounded-[8px] outline-none px-4"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        )}
        <img
          src="/assets/icons/search-line 2 (2).png"
          alt=""
          className="w-5 h-5"
          onClick={() => setSearchShow(searchShow ? false : true)}
        />
        <img
          src="/assets/icons/setting-white.png"
          alt=""
          className="hidden md:flex w-5 h-5"
        />

        <div className="rounded-full bg-white w-9 h-9 shrink-0 p-2 flex justify-center items-center">
          <img src="/assets/icons/Vector-1.png" alt="" className=" " />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
