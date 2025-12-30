import React, { useEffect, useState } from "react";
import { getLeagueById } from "@/lib/api/endpoints";

interface GetLeagueLogoProps {
  leagueId: string | number;
  alt: string;
  className?: string;
}

const leagueLogoMemoryCache = new Map<string, string>();
const leagueLogoStorageKey = (id: string) => `league_logo_image_${id}`;

interface LeagueApiItem {
  id?: number;
  league_id?: number;
  image?: string;
  logo?: string;
  image_path?: string;
}

interface LeagueApiResponse {
  responseObject?: {
    item?: LeagueApiItem | LeagueApiItem[];
  };
}

const GetLeagueLogo: React.FC<GetLeagueLogoProps> = ({ leagueId, alt, className }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchLeagueLogo = async () => {
      setLoading(true);
      setError(null);

      const id = String(leagueId);

      const memoryCached = leagueLogoMemoryCache.get(id);
      if (memoryCached) {
        setLogoUrl(memoryCached);
        setLoading(false);
        return;
      }

      try {
        const stored = sessionStorage.getItem(leagueLogoStorageKey(id));
        if (stored) {
          leagueLogoMemoryCache.set(id, stored);
          setLogoUrl(stored);
          setLoading(false);
          return;
        }
      } catch {
        // ignore storage errors
      }

      try {
        let res: unknown;
        let lastErr: unknown;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            if (controller.signal.aborted) return;
            res = await getLeagueById(id);
            lastErr = undefined;
            break;
          } catch (e) {
            lastErr = e;
            if (controller.signal.aborted) return;
            await new Promise((r) => setTimeout(r, 250 * Math.pow(2, attempt)));
          }
        }

        if (lastErr) throw lastErr;
        if (controller.signal.aborted) return;

        const item = (res as LeagueApiResponse)?.responseObject?.item;
        const league = Array.isArray(item) ? item[0] : item;

        const rawImage = String(
          (league as any)?.image ??
            (league as any)?.logo ??
            (league as any)?.image_path ??
            ""
        ).trim();

        if (rawImage) {
          const dataUri = rawImage.startsWith("data:image") ? rawImage : `data:image/png;base64,${rawImage}`;
          leagueLogoMemoryCache.set(id, dataUri);
          try {
            sessionStorage.setItem(leagueLogoStorageKey(id), dataUri);
          } catch {
            // ignore storage errors
          }
          setLogoUrl(dataUri);
        } else {
          setLogoUrl(null);
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;
        console.error(`Error fetching logo for leagueId ${leagueId}:`, err);
        const status = err?.response?.status;
        const statusText = err?.response?.statusText;
        setError(status ? `Failed to load logo (${status}${statusText ? ` ${statusText}` : ""})` : "Failed to load logo");
        setLogoUrl(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    if (leagueId === null || leagueId === undefined || String(leagueId).trim() === "") {
      setLogoUrl(null);
      setLoading(false);
      return;
    }

    fetchLeagueLogo();

    return () => {
      controller.abort();
    };
  }, [leagueId]);

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 rounded-full object-contain ${className ?? ""}`}
        style={{ minWidth: "20px", minHeight: "20px" }}
      />
    );
  }

  if (error || !logoUrl) {
    return <img src={"/loading-state/shield.svg"} alt={`${alt} - No Logo`} className={`object-contain ${className ?? ""}`} />;
  }

  return <img src={logoUrl} alt={alt} className={`object-contain ${className ?? ""}`} />;
};

export default GetLeagueLogo;
