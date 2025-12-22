import { Moon, Sun, UserIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { clearAuthToken } from "@/lib/api/axios";
export const PageHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchShow, setSearchShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  type UserProfile = {
    name?: string;
    email?: string;
    avatar?: string;
    [key: string]: unknown;
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load user profile from localStorage
  const loadUserProfile = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("tikianaly_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserProfile({
          name: parsed.name || "",
          email: parsed.email || "",
          avatar: parsed.avatar || "",
        });
      } else {
        setUserProfile(null);
      }
    } catch {
      setUserProfile(null);
    }
  }, []);

  // Load user profile on mount and listen for changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    loadUserProfile();
    // Listen for storage changes (e.g., login from another tab)
    window.addEventListener("storage", loadUserProfile);
    
    return () => {
      window.removeEventListener("storage", loadUserProfile);
    };
  }, [loadUserProfile]);

  // Use user profile or fallback to defaults
  const profile = userProfile || {
    name: "Guest",
    email: "",
    avatar: "",
  };

  // Truncate email if too long
  const truncateEmail = (email: string, maxLength: number = 20): string => {
    if (!email) return "";
    if (email.length <= maxLength) return email;
    return email.substring(0, maxLength) + "...";
  };

  const [openMenu, setOpenMenu] = useState<"mobile" | "desktop" | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideMobile =
        mobileMenuRef.current && mobileMenuRef.current.contains(target);
      const clickedInsideDesktop =
        desktopMenuRef.current && desktopMenuRef.current.contains(target);

      if (!clickedInsideMobile && !clickedInsideDesktop) {
        setOpenMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openMenu]);

  const toggleMenu = (menu: "mobile" | "desktop") => {
    const willOpen = openMenu !== menu;
    if (willOpen) {
      // Refresh user profile when opening menu
      loadUserProfile();
    }
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const handleLogout = () => {
    clearAuthToken();
    setUserProfile(null);
    setOpenMenu(null);
    navigate("/login");
  };

  const navigationItems = [
    { label: "News", href: "/news" },
    { label: "Favourite", href: "/favourites" },
    { label: "About Us", href: "/about" },
  ];

  const isNavActive = (href: string) => {
    const path = location.pathname;

    if (href === "/news") {
      return (
        path === "/news" ||
        path.startsWith("/news/") ||
        path === "/new" ||
        path.startsWith("/new/")
      );
    }

    return path === href || path.startsWith(`${href}/`);
  };

  const renderNavLinks = (wrapperClass: string) => (
    <div className={wrapperClass}>
      {navigationItems.map(({ label, href }) => (
        <Link
          key={label}
          to={href}
          className="relative group"
          aria-current={isNavActive(href) ? "page" : undefined}
        >
          <span
            className={`transition-colors duration-300 group-hover:text-brand-secondary ${
              isNavActive(href) ? "text-brand-secondary" : ""
            }`}
          >
            {label}
          </span>
          <span className="secondary-hover"></span>
        </Link>
      ))}
    </div>
  );

  const renderSearchInput = (inputClassName: string) => (
    <div className="flex w-full">
      <input
        type="text"
        placeholder="Search Here...."
        className={`w-full rounded-[8px] bg-white/90 px-4 py-2 text-brand-primary outline-none ${inputClassName}`}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );

  return (
    <header
      className={`bg-brand-primary text-white m-page-padding-x relative z-10 ${
        isMobile ? "py-1" : "py-3"
      }`}
    >
      {isMobile ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <a href="/" className="shrink-0">
              <img
                src="\logos\whitelogo.png"
                className="w-28"
                alt="TikiAnaly Logo"
              />
            </a>
            <div className="flex items-center gap-3 text-white/80">
              <MagnifyingGlassIcon
                className="h-5 w-5"
                onClick={() => setSearchShow(!searchShow)}
              />
              <Cog6ToothIcon className="h-5 w-5" />
              <button
                className="bg-transparent transition-colors"
                onClick={() => setTheme(theme === "dark" ? "" : "dark")}
                aria-label="Toggle theme"
              >
                <span className="relative block h-5 w-5">
                  <Sun
                    className={`absolute inset-0 h-5 w-5 text-white transition-all duration-300 ${
                      theme === "dark"
                        ? "scale-100 rotate-0 opacity-100"
                        : "-rotate-90 scale-75 opacity-0"
                    }`}
                  />
                  <Moon
                    className={`absolute inset-0 h-5 w-5 text-white transition-all duration-300 ${
                      theme !== "dark"
                        ? "scale-100 rotate-0 opacity-100"
                        : "rotate-90 scale-75 opacity-0"
                    }`}
                  />
                </span>
              </button>
              <div className="relative" ref={mobileMenuRef}>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-primary"
                  onClick={() => toggleMenu("mobile")}
                  aria-haspopup="true"
                  aria-expanded={openMenu === "mobile"}
                >
                  <UserIcon className="h-4" />
                </button>
                {openMenu === "mobile" && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-snow-200 bg-white p-4 text-brand-primary shadow-lg">
                    {userProfile ? (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-full bg-brand-primary/10 flex items-center justify-center">
                            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-brand-primary">
                              {(profile.name || "U").charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{profile.name}</p>
                            <p className="text-xs text-neutral-n5 truncate" title={profile.email || ""}>
                              {truncateEmail(profile.email || "", 18)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <Link
                            to="/account"
                            className="block rounded-lg border border-snow-200 px-4 py-2 text-sm font-medium hover:bg-brand-primary/5"
                            onClick={() => setOpenMenu(null)}
                          >
                            Account
                          </Link>
                          <button
                            className="w-full rounded-lg border border-snow-200 px-4 py-2 text-sm font-medium hover:bg-brand-primary/5"
                            onClick={() => setOpenMenu(null)}
                          >
                            Settings
                          </button>
                          <button
                            className="w-full rounded-lg bg-ui-negative px-4 py-2 text-sm font-semibold text-white hover:bg-ui-negative/80"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-neutral-n5 mb-3 text-center">Sign in to access your account</p>
                        <Link
                          to="/login"
                          className="block w-full rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white text-center hover:bg-blue-600 transition-colors"
                          onClick={() => setOpenMenu(null)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          className="block w-full rounded-lg border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary text-center hover:bg-brand-primary/5 transition-colors"
                          onClick={() => setOpenMenu(null)}
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {searchShow && renderSearchInput("text-sm")}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 md:gap-10">
            <a href="/">
              <img
                src="\logos\whitelogo.png"
                className="w-35 md:w-40"
                alt="TikiAnaly Logo"
              />
            </a>
            {renderNavLinks(
              "hidden md:flex cursor-pointer items-center gap-6 font-semibold"
            )}
          </div>
          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            {!searchShow && (
              <div className="hidden items-center gap-2 rounded border p-2 md:flex md:border-none">
                <img src="/assets/icons/Vector.png" alt="" className="h-4 w-4" />
                <img
                  src="/assets/icons/United Kingdom.png"
                  alt=""
                  className="h-5 w-5"
                />
                <p className="text-sm font-semibold md:text-base">ENG</p>
              </div>
            )}
            {searchShow && renderSearchInput("max-w-xs text-base")}
            <MagnifyingGlassIcon
              className="h-5"
              onClick={() => setSearchShow(!searchShow)}
            />
            <Cog6ToothIcon className="h-5" />
            <button
              className="bg-transparent transition-colors"
              onClick={() => setTheme(theme === "dark" ? "" : "dark")}
              aria-label="Toggle theme"
            >
              <span className="relative block h-5 w-5">
                <Sun
                  className={`absolute inset-0 h-5 w-5 text-white transition-all duration-300 ${
                    theme === "dark"
                      ? "scale-100 rotate-0 opacity-100"
                      : "-rotate-90 scale-75 opacity-0"
                  }`}
                />
                <Moon
                  className={`absolute inset-0 h-5 w-5 text-white transition-all duration-300 ${
                    theme !== "dark"
                      ? "scale-100 rotate-0 opacity-100"
                      : "rotate-90 scale-75 opacity-0"
                  }`}
                />
              </span>
            </button>
            <div className="relative hidden lg:flex" ref={desktopMenuRef}>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white p-2 text-brand-primary"
                onClick={() => toggleMenu("desktop")}
                aria-haspopup="true"
                aria-expanded={openMenu === "desktop"}
              >
                <UserIcon className="h-5" />
              </button>
              {openMenu === "desktop" && (
                <div className="absolute z-10000 right-0 top-12 w-72 rounded-2xl border border-snow-200 bg-white p-4 text-brand-primary shadow-2xl">
                  {userProfile ? (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                          <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-brand-primary">
                            {(profile.name || "U").charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold truncate">{profile.name}</p>
                          <p className="text-sm text-neutral-n5 truncate" title={profile.email || ""}>
                            {truncateEmail(profile.email || "", 22)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 space-y-2">
                        <Link
                          to="/account"
                          className="block rounded-lg border border-snow-200 px-4 py-2 text-sm font-medium hover:bg-brand-primary/5"
                          onClick={() => setOpenMenu(null)}
                        >
                          Account
                        </Link>
                        <button
                          className="w-full rounded-lg border border-snow-200 px-4 py-2 text-sm font-medium hover:bg-brand-primary/5"
                          onClick={() => setOpenMenu(null)}
                        >
                          Settings
                        </button>
                        <button
                          className="w-full rounded-lg bg-ui-negative px-4 py-2 text-sm font-semibold text-white hover:bg-ui-negative/80"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-n5 mb-3 text-center">Sign in to access your account</p>
                      <Link
                        to="/login"
                        className="block w-full rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white text-center hover:bg-blue-600 transition-colors"
                        onClick={() => setOpenMenu(null)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full rounded-lg border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary text-center hover:bg-brand-primary/5 transition-colors"
                        onClick={() => setOpenMenu(null)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PageHeader;
