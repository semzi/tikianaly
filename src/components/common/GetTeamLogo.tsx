import React, { useEffect, useState } from "react";
import { getTeamById } from "@/lib/api/endpoints";

interface GetTeamLogoProps {
  teamId?: string | number;
  alt?: string;
  className?: string;
}

interface TeamApiItem {
  team_id?: number;
  image?: string;
}

interface TeamApiResponse {
  responseObject?: {
    item?: TeamApiItem | TeamApiItem[];
  };
}

const teamLogoMemoryCache = new Map<string, string>();
const teamLogoStorageKey = (id: string) => `team_logo_image_${id}`;

const GetTeamLogo: React.FC<GetTeamLogoProps> = ({ teamId, alt, className }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const safeAlt = String(alt ?? "").trim() || "Team";

  useEffect(() => {
    const controller = new AbortController();
    const fetchTeamLogo = async () => {
      setLoading(true);
      setError(null);

      const id = String(teamId);

      const memoryCached = teamLogoMemoryCache.get(id);
      if (memoryCached) {
        setLogoUrl(memoryCached);
        setLoading(false);
        return;
      }

      try {
        const stored = sessionStorage.getItem(teamLogoStorageKey(id));
        if (stored) {
          teamLogoMemoryCache.set(id, stored);
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
            res = await getTeamById(id);
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

        const item = (res as TeamApiResponse)?.responseObject?.item;
        const team = Array.isArray(item) ? item[0] : item;
        const rawImage = team?.image ? String(team.image).trim() : "";

        if (rawImage) {
          const dataUri = rawImage.startsWith("data:image") ? rawImage : `data:image/png;base64,${rawImage}`;
          teamLogoMemoryCache.set(id, dataUri);
          try {
            sessionStorage.setItem(teamLogoStorageKey(id), dataUri);
          } catch {
            // ignore storage errors
          }
          setLogoUrl(dataUri);
        } else {
          setLogoUrl(null);
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;
        console.error(`Error fetching logo for teamId ${teamId}:`, err);
        const status = err?.response?.status;
        const statusText = err?.response?.statusText;
        setError(status ? `Failed to load logo (${status}${statusText ? ` ${statusText}` : ""})` : "Failed to load logo");
        setLogoUrl(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    if (teamId === null || teamId === undefined || String(teamId).trim() === "") {
      setLogoUrl(null);
      setLoading(false);
      return;
    }

    fetchTeamLogo();

    return () => {
      controller.abort();
    };
  }, [teamId]);

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 rounded-full object-contain ${className ?? ""}`}
        style={{ minWidth: "20px", minHeight: "20px" }}
      />
    );
  }

  if (error || !logoUrl) {
    return <img src={"/loading-state/shield.svg"} alt={`${safeAlt} - No Logo`} className={`object-contain ${className ?? ""}`} />;
  }

  return <img src={logoUrl} alt={safeAlt} className={`object-contain ${className ?? ""}`} />;
};

export default GetTeamLogo;