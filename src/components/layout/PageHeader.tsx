import { GitCompare, Moon, Sun, UserIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  // Cog6ToothIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { clearAuthToken } from "@/lib/api/axios";
import { getLeagueByName, getPlayerByName, getTeamByName } from "@/lib/api/endpoints";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
export const PageHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchShow, setSearchShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchScope, setSearchScope] = useState<
    "all" | "players" | "teams" | "leagues"
  >("all");
  const [searchLoading, setSearchLoading] = useState(false);
  const [demoResults, setDemoResults] = useState<
    Array<{
      id?: string | number;
      name: string;
      country: string;
      image?: string;
      kind: "player" | "team" | "league";
    }>
  >([]);
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchRequestIdRef = useRef(0);

  const normalizeItemsToArray = (items: unknown): any[] => {
    if (Array.isArray(items)) return items;
    if (items && typeof items === "object") return [items];
    return [];
  };

  const mergeSearchResults = (
    prev: Array<{ id?: string | number; name: string; country: string; image?: string; kind: "player" | "team" | "league" }>,
    incoming: Array<{ id?: string | number; name: string; country: string; image?: string; kind: "player" | "team" | "league" }>
  ) => {
    if (incoming.length === 0) return prev;
    const seen = new Set(prev.map((r) => `${r.kind}:${String(r.id ?? "")}::${r.name}`));
    const next = [...prev];
    incoming.forEach((r) => {
      const key = `${r.kind}:${String(r.id ?? "")}::${r.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        next.push(r);
      }
    });
    return next;
  };

  const closeSearch = () => {
    setSearchShow(false);
    setSearchValue("");
  };

  const handleSelectSearchResult = useCallback(
    (r: { id?: string | number; name: string; kind: "player" | "team" | "league" }) => {
      if (!r?.id) {
        setSearchValue(r?.name ?? "");
        return;
      }

      if (r.kind === "player") {
        setOpenMenu(null);
        closeSearch();
        navigate(`/player/profile/${r.id}`);
        return;
      }

      if (r.kind === "team") {
        setOpenMenu(null);
        closeSearch();
        navigate(`/team/profile/${r.id}`);
        return;
      }

      setSearchValue(r?.name ?? "");
    },
    [navigate]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!searchShow) return;

    const id = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(id);
    };
  }, [searchShow]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (searchShow && isMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [searchShow, isMobile]);

  useEffect(() => {
    if (!searchShow) return;

    const q = searchValue.trim();
    if (!q) {
      setSearchLoading(false);
      setDemoResults([]);
      return;
    }

    setSearchLoading(true);
    const requestId = ++searchRequestIdRef.current;

    const timeoutId = window.setTimeout(() => {
      if (requestId !== searchRequestIdRef.current) return;
      setDemoResults([]);

      if (searchScope === "all") {
        let remaining = 3;

        const done = () => {
          remaining -= 1;
          if (remaining <= 0 && requestId === searchRequestIdRef.current) {
            setSearchLoading(false);
          }
        };

        getPlayerByName(q)
          .then((data) => {
            if (requestId !== searchRequestIdRef.current) return;
            const items = normalizeItemsToArray(data?.responseObject?.item);
            const players = items.slice(0, 5).map((p: any) => {
              const rawImage = p?.image;
              const image =
                typeof rawImage === "string" && rawImage.length
                  ? rawImage.startsWith("data:image")
                    ? rawImage
                    : `data:image/png;base64,${rawImage}`
                  : undefined;

              const name = [p?.firstname, p?.lastname].filter(Boolean).join(" ") || "Unknown";

              return {
                id: p?.id ?? p?.player_id ?? p?.pid,
                name: String(name),
                country: String(p?.nationality ?? ""),
                image,
                kind: "player" as const,
              };
            });

            setDemoResults((prev) => mergeSearchResults(prev, players));
          })
          .catch(() => {
            // ignore
          })
          .finally(done);

        getTeamByName(q)
          .then((data) => {
            if (requestId !== searchRequestIdRef.current) return;
            const items = normalizeItemsToArray(data?.responseObject?.item);
            const teams = items.slice(0, 5).map((t: any) => {
              const rawImage = t?.image;
              const image =
                typeof rawImage === "string" && rawImage.length
                  ? rawImage.startsWith("data:image")
                    ? rawImage
                    : `data:image/png;base64,${rawImage}`
                  : undefined;

              return {
                id: t?.id ?? t?.team_id ?? t?.tid,
                name: String(t?.name ?? t?.team_name ?? t?.team?.name ?? "Unknown"),
                country: String(t?.country ?? ""),
                image,
                kind: "team" as const,
              };
            });

            setDemoResults((prev) => mergeSearchResults(prev, teams));
          })
          .catch(() => {
            // ignore
          })
          .finally(done);

        getLeagueByName(q)
          .then((data) => {
            if (requestId !== searchRequestIdRef.current) return;
            const items = normalizeItemsToArray(data?.responseObject?.item);
            const leagues = items.slice(0, 5).map((l: any) => {
              return {
                id: l?.id ?? l?.league_id ?? l?.gid,
                name: String(l?.name ?? "Unknown"),
                country: String(l?.category ?? ""),
                kind: "league" as const,
              };
            });

            setDemoResults((prev) => mergeSearchResults(prev, leagues));
          })
          .catch(() => {
            // ignore
          })
          .finally(done);

        return;
      }

      if (searchScope === "players") {
        (async () => {
          try {
            const data = await getPlayerByName(q);

            if (requestId !== searchRequestIdRef.current) return;

            const items = normalizeItemsToArray(data?.responseObject?.item);
            const normalized: Array<{ id?: string | number; name: string; country: string; image?: string; kind: "player" }> =
              items.length
                ? items.slice(0, 10).map((p: any) => {
                    const rawImage = p?.image;
                    const image =
                      typeof rawImage === "string" && rawImage.length
                        ? rawImage.startsWith("data:image")
                          ? rawImage
                          : `data:image/png;base64,${rawImage}`
                        : undefined;

                    const name =
                      [p?.firstname, p?.lastname].filter(Boolean).join(" ") || "Unknown";

                    return {
                      id: p?.id ?? p?.player_id ?? p?.pid,
                      name: String(name),
                      country: String(p?.nationality ?? ""),
                      image,
                      kind: "player",
                    };
                  })
                : [];

            setDemoResults(normalized);
            setSearchLoading(false);
          } catch {
            if (requestId !== searchRequestIdRef.current) return;
            setDemoResults([]);
            setSearchLoading(false);
          }
        })();

        return;
      }

      if (searchScope === "teams") {
        (async () => {
          try {
            const data = await getTeamByName(q);

            if (requestId !== searchRequestIdRef.current) return;

            const items = normalizeItemsToArray(data?.responseObject?.item);
            const normalized: Array<{ id?: string | number; name: string; country: string; image?: string; kind: "team" }> =
              items.length
                ? items.slice(0, 10).map((t: any) => {
                    const rawImage = t?.image;
                    const image =
                      typeof rawImage === "string" && rawImage.length
                        ? rawImage.startsWith("data:image")
                          ? rawImage
                          : `data:image/png;base64,${rawImage}`
                        : undefined;

                    return {
                      id: t?.id ?? t?.team_id ?? t?.tid,
                      name: String(t?.name ?? t?.team_name ?? t?.team?.name ?? "Unknown"),
                      country: String(t?.country ?? ""),
                      image,
                      kind: "team",
                    };
                  })
                : [];

            setDemoResults(normalized);
            setSearchLoading(false);
          } catch {
            if (requestId !== searchRequestIdRef.current) return;
            setDemoResults([]);
            setSearchLoading(false);
          }
        })();

        return;
      }

      if (searchScope === "leagues") {
        (async () => {
          try {
            const data = await getLeagueByName(q);

            if (requestId !== searchRequestIdRef.current) return;

            const items = normalizeItemsToArray(data?.responseObject?.item);
            const normalized: Array<{ id?: string | number; name: string; country: string; image?: string; kind: "league" }> =
              items.length
                ? items.slice(0, 10).map((l: any) => {
                    return {
                      id: l?.id ?? l?.league_id ?? l?.gid,
                      name: String(l?.name ?? "Unknown"),
                      country: String(l?.category ?? ""),
                      kind: "league",
                    };
                  })
                : [];

            setDemoResults(normalized);
            setSearchLoading(false);
          } catch {
            if (requestId !== searchRequestIdRef.current) return;
            setDemoResults([]);
            setSearchLoading(false);
          }
        })();

        return;
      }

      if (requestId !== searchRequestIdRef.current) return;
      setDemoResults([]);
      setSearchLoading(false);
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue, searchScope, searchShow]);

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
    { label: "Privacy Policy", href: "/privacy-policy" },
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

  const shouldShowDemoPanel = searchShow && searchValue.trim().length > 0;

  const renderDemoSearchPanel = (panelClassName: string, forceLight = false) => {
    if (!shouldShowDemoPanel) return null;

    const isDark = forceLight ? false : theme === "dark";
    const scopeIsSingle = searchScope !== "all";
    const skeletonLogoBgClass = isDark ? "bg-white/10" : "bg-snow-200";

    return (
      <div className={panelClassName}>
        <div
          className={`rounded-xl p-3 shadow-lg ${
            isDark ? "bg-neutral-900 text-white" : "bg-white text-brand-primary"
          }`}
        >
          <div className={`mb-2 text-xs font-semibold ${isDark ? "text-white/70" : "text-neutral-n5"}`}>
            {searchScope.toUpperCase()} RESULTS
          </div>

          {searchLoading && demoResults.length === 0 ? (
            <div className="space-y-1 animate-pulse">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 ${
                    isDark ? "bg-white/0" : "bg-transparent"
                  }`}
                >
                  <div
                    className={`h-10 w-10 object-cover ${
                      scopeIsSingle && searchScope === "players" ? "rounded-full" : "rounded-none"
                    } ${skeletonLogoBgClass}`}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div
                      className={`h-4 w-2/3 rounded ${
                        isDark ? "bg-white/10" : "bg-snow-200"
                      }`}
                    />
                    <div
                      className={`h-3 w-1/3 rounded ${
                        isDark ? "bg-white/10" : "bg-snow-200"
                      }`}
                    />
                  </div>
                  <div
                    className={`ml-auto h-9 w-9 rounded-full ${
                      isDark ? "bg-white/10" : "bg-snow-200"
                    }`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {demoResults.map((r) => (
                <button
                  key={`${r.kind}-${String(r.id ?? r.name)}`}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
                    isDark ? "hover:bg-white/10" : "hover:bg-snow-100"
                  }`}
                  onClick={() => handleSelectSearchResult(r)}
                >
                  {r.kind === "league" && r.id ? (
                    <GetLeagueLogo
                      leagueId={r.id}
                      alt={r.name}
                      className="h-10 w-10 rounded-none object-contain"
                    />
                  ) : (
                    <img
                      src={
                        r.image ||
                        (r.kind === "league"
                          ? "/loading-state/shield.svg"
                          : "/loading-state/player.svg")
                      }
                      alt={r.name}
                      className={`h-10 w-10 object-cover ${
                        r.kind === "player" ? "rounded-full" : "rounded-none"
                      } ${
                        r.kind === "player"
                          ? isDark
                            ? "bg-white/10"
                            : "bg-snow-200"
                          : "bg-transparent"
                      }`}
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src =
                          r.kind === "league"
                            ? "/loading-state/shield.svg"
                            : "/loading-state/player.svg";
                      }}
                    />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={`truncate text-sm font-semibold ${
                        isDark ? "text-white" : "text-brand-primary"
                      }`}
                    >
                      {r.name}
                    </span>
                    <span className={`truncate text-xs ${isDark ? "text-white/60" : "text-neutral-n5"}`}>
                      {r.country}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`ml-auto flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                      isDark
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-snow-100 text-brand-primary hover:bg-snow-200"
                    }`}
                    aria-label="Open"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSearchResult(r);
                    }}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSearchInput = (inputClassName: string) => (
    <div className="flex w-full py-2">
      <input
        type="text"
        placeholder="Search Here...."
        className={`w-full rounded-[8px] px-4 py-2 outline-none ${
          theme === "dark"
            ? "bg-white/10 text-white placeholder:text-white/50"
            : "bg-white/90 text-brand-primary"
        } ${inputClassName}`}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          if (e.target.value.trim()) setSearchLoading(true);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          if (searchLoading) return;
          const first = demoResults?.[0];
          if (!first) return;
          handleSelectSearchResult(first);
        }}
        ref={searchInputRef}
      />
    </div>
  );

  const renderSearchScopeButtons = (wrapperClassName: string) => (
    <div className={wrapperClassName}>
      <button
        type="button"
        onClick={() => setSearchScope("all")}
        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
          searchScope === "all"
            ? "bg-white text-brand-primary"
            : "bg-brand-secondary text-white hover:bg-brand-secondary/90"
        }`}
      >
        All
      </button>
      <button
        type="button"
        onClick={() => setSearchScope("players")}
        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
          searchScope === "players"
            ? "bg-white text-brand-primary"
            : "bg-brand-secondary text-white hover:bg-brand-secondary/90"
        }`}
      >
        Players
      </button>
      <button
        type="button"
        onClick={() => setSearchScope("teams")}
        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
          searchScope === "teams"
           ? "bg-white text-brand-primary"
            : "bg-brand-secondary text-white hover:bg-brand-secondary/90"
        }`}
      >
        Teams
      </button>
      <button
        type="button"
        onClick={() => setSearchScope("leagues")}
        className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
          searchScope === "leagues"
            ? "bg-white text-brand-primary"
            : "bg-brand-secondary text-white hover:bg-brand-secondary/90"
        }`}
      >
        Leagues
      </button>
    </div>
  );

  return (
    <header
      className={`bg-brand-primary text-white m-page-padding-x relative isolate overflow-visible ${
        searchShow ? "z-[10000]" : "z-10"
      } ${isMobile ? "py-1" : "py-3"}`}
    >
      <div
        className="absolute blur-sm inset-0 pointer-events-none z-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--gameinfo-stripe-color) 0px, var(--gameinfo-stripe-color) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px)",
        }}
      />

      <div className="relative z-[1]">
      {!isMobile && searchShow && (
        <div
          className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm"
          onClick={() => {
            setOpenMenu(null);
            closeSearch();
          }}
        >
          <div
            className="mx-auto mt-20 w-full max-w-3xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl bg-brand-primary p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex-1">{renderSearchInput("text-base")}</div>
                {renderSearchScopeButtons("hidden md:flex items-center gap-2")}
                <button
                  type="button"
                  className="rounded-md p-2 text-white/90 hover:bg-white/10"
                  onClick={() => {
                    setOpenMenu(null);
                    closeSearch();
                  }}
                  aria-label="Close search"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              {renderDemoSearchPanel("mt-2")}
            </div>
          </div>
        </div>
      )}
      {isMobile && searchShow && (
        <div
          className="fixed inset-0 z-[9999] bg-white text-brand-primary"
        >
          <div
            className="mx-auto h-full w-full max-w-lg px-4 pb-6 pt-4 overflow-y-auto"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">{renderSearchInput("text-base")}</div>
              <button
                type="button"
                className="rounded-md p-2 text-brand-primary hover:bg-snow-100"
                onClick={() => {
                  setOpenMenu(null);
                  closeSearch();
                }}
                aria-label="Close search"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {renderSearchScopeButtons("mt-2 flex flex-wrap items-center gap-2")}

            <div className="mt-3">
              {renderDemoSearchPanel("", true)}
            </div>

            {!shouldShowDemoPanel ? (
              <div className="mt-6 text-sm text-neutral-n5">Type to search…</div>
            ) : null}

            <div className="h-10" />
          </div>
        </div>
      )}
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
                onClick={() => {
                  setOpenMenu(null);
                  setSearchShow(true);
                }}
              />
              <button
                type="button"
                className="bg-transparent transition-colors"
                onClick={() => {
                  setOpenMenu(null);
                  closeSearch();
                  navigate("/player/compare");
                }}
                aria-label="Compare players"
              >
                <GitCompare className="h-5 w-5 text-white" />
              </button>
              {/* <Cog6ToothIcon className="h-5 w-5" /> */}
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
                  <div className="absolute right-0 z-[1000] mt-3 w-64 rounded-2xl border border-snow-200 bg-white p-4 text-brand-primary shadow-lg">
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
                          {/* <button
                            className="w-full rounded-lg border border-snow-200 px-4 py-2 text-sm font-medium hover:bg-brand-primary/5"
                            onClick={() => setOpenMenu(null)}
                          >
                            Settings
                          </button> */}
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
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          {searchShow ? null : (
            <>
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
                <div className="hidden items-center gap-2 rounded border p-2 md:flex md:border-none">
                  <img src="/assets/icons/Vector.png" alt="" className="h-4 w-4" />
                  <img
                    src="/assets/icons/United Kingdom.png"
                    alt=""
                    className="h-5 w-5"
                  />
                  <p className="text-sm font-semibold md:text-base">ENG</p>
                </div>
                <MagnifyingGlassIcon
                  className="h-5"
                  onClick={() => {
                    setOpenMenu(null);
                    setSearchShow(true);
                  }}
                />
                <button
                  type="button"
                  className="bg-transparent transition-colors"
                  onClick={() => {
                    setOpenMenu(null);
                    closeSearch();
                    navigate("/player/compare");
                  }}
                  aria-label="Compare players"
                >
                  <GitCompare className="h-5 w-5 text-white" />
                </button>
                {/* <Cog6ToothIcon className="h-5" /> */}
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
                    <div className="absolute z-[1000] right-0 top-12 w-72 rounded-2xl border border-snow-200 bg-white p-4 text-brand-primary shadow-2xl">
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
                            {/* <button
                              className="w-full rounded-lg border border-snow-200 px-4 py-2 text-sm font-medium hover:bg-brand-primary/5"
                              onClick={() => setOpenMenu(null)}
                            >
                              Settings
                            </button> */}
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
            </>
          )}
        </div>
      )}
      </div>
    </header>
  );
};

export default PageHeader;
