import { Moon, Sun, UserIcon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../ThemeContext";
import { Link } from "react-router-dom";
import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
export const PageHeader = () => {
  const [searchShow, setSearchShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-brand-primary overflow-x-hidden text-white page-padding-x py-4 flex justify-between items-center">
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
        {!searchShow && (
          <div className="hidden md:flex border md:border-none p-2 rounded items-center gap-2">
            <img src="/assets/icons/Vector.png" alt="" className=" w-4 h-4" />
            <img
              src="/assets/icons/United Kingdom.png"
              alt=""
              className="w-5 h-5"
            />
            <p className="font-semibold text-sm md:text-base">ENG</p>
          </div>
        )}
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
        <MagnifyingGlassIcon
          className="h-5"
          onClick={() => setSearchShow(searchShow ? false : true)}
        />
        <Cog6ToothIcon className="h-5" />
        <div className=" gap-2 h-max px-2 py-1 rounded justify-center bg-neutral-300/50 flex">
          {/* Desktop theme toggle */}
          <div className="hidden md:flex gap-2">
            {theme === "" ? (
              <button
                className="bg-white px-3 py-0 rounded"
                onClick={() => setTheme("")}
              >
                <Sun className="text-neutral-800 w-5 h-5" />
              </button>
            ) : (
              <button
                className="bg-transparent px-3 py-0 hover:bg-white rounded"
                onClick={() => setTheme("")}
              >
                <Sun className="hover:text-neutral-800 w-5 h-5" />
              </button>
            )}
            {theme === "dark" ? (
              <button
                className="bg-neutral-800/50 px-3 py-2 rounded duration-300 transition-colors"
                onClick={() => setTheme("dark")}
              >
                <Moon />
              </button>
            ) : (
              <button
                className="bg-transparent px-3 py-2 hover:bg-neutral-800/50 rounded duration-300 transition-colors"
                onClick={() => setTheme("dark")}
              >
                <Moon />
              </button>
            )}
          </div>
          {/* Mobile theme toggle */}
          <div className="flex md:hidden gap-1">
            {theme === "" ? (
              <button
                className="p-1 rounded bg-white"
                onClick={() => setTheme("")}
              >
                <Sun className="w-5 h-5 text-neutral-800" />
              </button>
            ) : (
              <button className="p-1 rounded" onClick={() => setTheme("")}>
                <Sun className="w-5 h-5 text-white" />
              </button>
            )}
            {theme === "dark" ? (
              <button
                className="p-1 rounded bg-neutral-800/50"
                onClick={() => setTheme("dark")}
              >
                <Moon className="w-5 h-5" />
              </button>
            ) : (
              <button className="p-1 rounded " onClick={() => setTheme("dark")}>
                <Moon className="w-5 h-5 " />
              </button>
            )}
          </div>
        </div>
        <Link to="/signup">
          <div className="rounded-full bg-white w-9 h-9 shrink-0 p-2 flex justify-center items-center">
            <UserIcon  className="h-5 text-brand-primary" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PageHeader;
