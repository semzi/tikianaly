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
    <div className="bg-brand-primary overflow-x-hidden text-white page-padding-x py-2 md:py-3 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center justify-between gap-4 md:gap-10">
        <img src="\logos\whitelogo.png" className="w-35 md:w-40" alt="TikiAnaly Logo" />

        {/* Desktop Nav */}
        <div className="hidden md:flex cursor-pointer font-semibold items-center gap-6 text">
          {["News", "Favourite", "About Us"].map((item) => (
            <Link
              key={item}
              to={
                item === "News"
                  ? "/news"
                  : item === "Favourite"
                  ? "/favourite"
                  : "/about"
              }
              className="relative group"
            >
              <span className="group-hover:text-brand-secondary transition-colors duration-300">
                {item}
              </span>
              <span className="secondary-hover"></span>
            </Link>
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
        <button
          className="flex items-center justify-center bg-transparent transition-colors"
          onClick={() => setTheme(theme === "dark" ? "" : "dark")}
          aria-label="Toggle theme"
        >
          <span className="relative w-5 h-5 block">
            <Sun
              className={`absolute inset-0 w-5 h-5 text-white transition-all duration-300 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-75"
              }`}
            />
            <Moon
              className={`absolute inset-0 w-5 h-5 text-white transition-all duration-300 ${
          theme !== "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-75"
              }`}
            />
          </span>
        </button>
        <Link to="/login">
          <div className="rounded-full bg-white w-9 h-9 shrink-0 p-2 hidden lg:flex justify-center items-center">
            <UserIcon  className="h-5 text-brand-primary" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PageHeader;
