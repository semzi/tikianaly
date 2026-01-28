import PageHeader from "@/components/layout/PageHeader";
import { FooterComp } from "@/components/layout/Footer";
import GetLeagueLogo from "@/components/common/GetLeagueLogo";
import { getLeagueById } from "@/lib/api/endpoints";
import { navigate } from "@/lib/router/navigate";
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import StandingsTable from "@/features/football/components/standings/StandingsTable";
import { Helmet } from "react-helmet";
import { useToast } from "@/context/ToastContext";

type LeagueApiItem = {
  id?: number;
  league_id?: number;
  leagueId?: number;
  name?: string;
  category?: string;
  country?: string;
  image?: string;
  logo?: string;
  image_path?: string;
};

type LeagueApiResponse = {
  success?: boolean;
  message?: string;
  responseObject?: {
    item?: LeagueApiItem | LeagueApiItem[];
  };
  statusCode?: number;
};

const LeagueProfile = () => {
  const toast = useToast();
  const tabs = [{ id: "standings", label: "Standings" }];

  const getTabFromHash = () => {
    if (typeof window === "undefined") return "standings";
    const hash = window.location.hash.replace("#", "");
    return tabs.find((t) => t.id === hash) ? hash : "standings";
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);

  const { leagueId: leagueIdParam } = useParams<{ leagueId?: string }>();
  const [searchParams] = useSearchParams();
  const leagueIdFromQuery = searchParams.get("id") ?? undefined;
  const leagueId = leagueIdParam ?? leagueIdFromQuery;

  const [league, setLeague] = useState<LeagueApiItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const foundTab = tabs.find((t) => t.id === hash);
      setActiveTab(foundTab ? hash : "standings");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [tabs]);

  const handleTabClick = (tabId: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(tabId);
    const newUrl = `${window.location.pathname}${window.location.search}#${tabId}`;
    window.history.replaceState(null, "", newUrl);
  };

  useEffect(() => {
    const run = async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = (await getLeagueById(id)) as LeagueApiResponse;
        const item = res?.responseObject?.item;
        const resolved = Array.isArray(item) ? item[0] : item;
        setLeague(resolved ?? null);
      } catch (e: any) {
        setError(String(e?.message ?? "Failed to load league"));
        setLeague(null);
      } finally {
        setLoading(false);
      }
    };

    const id = String(leagueId ?? "").trim();
    if (!id) {
      setLeague(null);
      setError(null);
      setLoading(false);
      return;
    }

    run(id);
  }, [leagueId]);

  const resolvedLeagueId = useMemo(() => {
    const fromItem = league?.league_id ?? league?.leagueId ?? league?.id;
    const fromUrl = Number.isFinite(Number(leagueId)) ? Number(leagueId) : leagueId;
    return fromItem ?? fromUrl;
  }, [league, leagueId]);

  const leagueName = useMemo(() => {
    const name = String(league?.name ?? "").trim();
    return name || "League";
  }, [league]);

  const leagueCategory = useMemo(() => {
    const s = String(league?.category ?? "").trim();
    return s || "-";
  }, [league]);

  const leagueCountry = useMemo(() => {
    const s = String(league?.country ?? "").trim();
    return s || "-";
  }, [league]);

  const canonicalUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}${window.location.search}`
    : "";

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [hasCopiedShareUrl, setHasCopiedShareUrl] = useState(false);

  const copyShareUrl = async () => {
    try {
      if (!canonicalUrl) throw new Error("Missing URL");

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(canonicalUrl);
      } else if (typeof document !== "undefined") {
        const el = document.createElement("textarea");
        el.value = canonicalUrl;
        el.setAttribute("readonly", "true");
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }

      setHasCopiedShareUrl(true);
      toast.show({ variant: "success", message: "Link copied to clipboard" });
    } catch {
      toast.show({ variant: "error", message: "Could not copy link. Please copy it manually." });
    }
  };

  const pageTitle = useMemo(() => `${leagueName} | League Profile | TikiAnaly`, [leagueName]);
  const pageDescription = useMemo(() => `Standings and league details for ${leagueName}.`, [leagueName]);

  return (
    <div className="dark:bg-[#0D1117] min-h-screen">
      {isShareOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Share link"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setIsShareOpen(false);
              setHasCopiedShareUrl(false);
            }}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0D1117] border border-snow-200 dark:border-snow-100/10 shadow-2xl">
            <div className="flex items-start justify-between gap-4 px-5 pt-5">
              <div className="min-w-0">
                <p className="theme-text font-bold text-base">Share this profile</p>
                <p className="text-neutral-m6 text-sm mt-1">
                  Copy the link below to share this page with friends or on social media.
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg p-2 hover:bg-snow-100 dark:hover:bg-white/5"
                onClick={() => {
                  setIsShareOpen(false);
                  setHasCopiedShareUrl(false);
                }}
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5 theme-text" />
              </button>
            </div>

            <div className="px-5 pb-5 pt-4">
              <div className="flex items-center gap-3 rounded-xl border border-snow-200 dark:border-snow-100/10 bg-snow-100/50 dark:bg-white/5 px-3 py-2">
                <input
                  value={canonicalUrl}
                  readOnly
                  className="w-full bg-transparent text-sm theme-text outline-none"
                />
                <button
                  type="button"
                  onClick={copyShareUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3 py-2 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                  {hasCopiedShareUrl ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <PageHeader />

      <div className="secondary-gradient relative z-0">
        <div className="overflow-hidden h-auto md:h-80 bg-cover bg-center w-full relative z-0">
          <div className="absolute left-0 top-0 h-full w-2 bg-brand-primary" />
          <div className="w-full backdrop-blur-3xl h-full min-h-[220px] md:min-h-0 page-padding-x pb-4 md:pb-0 relative z-0">
            <div className="justify-between flex py-3 md:py-5">
              <div
                onClick={() => navigate(-1)}
                className="relative cursor-pointer px-3 z-10 grid grid-cols-3 items-center"
              >
                <div className="flex gap-4">
                  <ArrowLeftIcon className="text-white h-5" />
                  <p className="text-white hidden md:block">Back</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setIsShareOpen(true);
                    setHasCopiedShareUrl(false);
                  }}
                  aria-label="Share"
                >
                  <ShareIcon className="text-white h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2">
              <div className="flex items-center gap-4">
                {resolvedLeagueId ? (
                  <div className="bg-white p-4   rounded-2xl">
                    <GetLeagueLogo
                      leagueId={resolvedLeagueId}
                      alt={leagueName}
                      className="w-20 h-20 md:w-28 md:h-28"
                    />
                  </div>
                ) : (
                  <div className="bg-white p-2 rounded-2xl">
                    <img
                      src="/loading-state/shield.svg"
                      alt=""
                      className="w-20 h-20 md:w-28 md:h-28"
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-extrabold text-2xl md:text-3xl text-white whitespace-normal break-words">{leagueName}</p>
                  <p className="text-snow-200 text-sm md:text-base whitespace-normal break-words">
                    {leagueCategory}{leagueCountry !== "-" ? ` / ${leagueCountry}` : ""}
                  </p>
                </div>
              </div>

              <div className="text-white text-sm">
                {loading ? "Loading…" : null}
                {error ? <span className="text-ui-negative">{error}</span> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex z-3 h-12 w-full overflow-y-hidden overflow-x-auto bg-brand-p3/30 dark:bg-snow-200 backdrop-blur-2xl cursor-pointer sticky top-0 hide-scrollbar justify-start md:justify-center">
        <div className="flex md:justify-center md:gap-5 md:items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0 md:mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => handleTabClick(tab.id, e)}
              className={`py-2 cursor-pointer px-1.5 sm:px-4 text-xs md:text-sm transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? "text-orange-500 font-medium"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="page-padding-x">
        {!leagueId && (
          <div className="my-4 block-style p-3 rounded theme-text">
            Open this page with a league id, e.g. <span className="font-semibold">/league/profile/1204</span> or{" "}
            <span className="font-semibold">/league/profile?id=1204</span>.
          </div>
        )}

        {activeTab === "standings" ? (
          <div className="my-8">
            <StandingsTable leagueId={resolvedLeagueId} />
          </div>
        ) : null}
      </div>

      <FooterComp />
    </div>
  );
};

export default LeagueProfile;
