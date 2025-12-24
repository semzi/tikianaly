import React, { useEffect, useState } from "react";
import axios from "axios";

interface GetTeamLogoProps {
  teamId: string | number;
  alt: string;
  className?: string;
}

interface TeamLogoApiItem {
  id?: number;
  base64?: string;
}

const teamLogoMemoryCache = new Map<string, string>();
const teamLogoStorageKey = (id: string) => `team_logo_base64_${id}`;

const GetTeamLogo: React.FC<GetTeamLogoProps> = ({ teamId, alt, className }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const url = `/goalserve/api/v1/logotips/soccer/teams?k=13bf8a6da00f4047d69808de0442e200&ids=${id}`;
        let responseData: unknown;
        let lastErr: unknown;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            const response = await axios.get(url, {
              timeout: 15000,
              signal: controller.signal,
            });
            responseData = response.data;
            lastErr = undefined;
            break;
          } catch (e) {
            lastErr = e;
            if ((e as any)?.name === "CanceledError" || controller.signal.aborted) throw e;
            await new Promise((r) => setTimeout(r, 250 * Math.pow(2, attempt)));
          }
        }

        if (lastErr) throw lastErr;

        const raw = responseData as unknown;
        const parsed: unknown =
          typeof raw === "string"
            ? (() => {
                try {
                  return JSON.parse(raw);
                } catch {
                  return raw;
                }
              })()
            : raw;

        const data = parsed as TeamLogoApiItem[];
        const first = Array.isArray(data) ? data[0] : undefined;
        if (first && typeof first.base64 === "string" && first.base64) {
          const dataUri = `data:image/png;base64,${first.base64}`;
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
        if (err?.name === "CanceledError" || controller.signal.aborted) return;
        console.error(`Error fetching logo for teamId ${teamId}:`, err);
        const status = err?.response?.status;
        const statusText = err?.response?.statusText;
        setError(status ? `Failed to load logo (${status}${statusText ? ` ${statusText}` : ""})` : "Failed to load logo");
        setLogoUrl(null);
      } finally {
        setLoading(false);
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
    return <img src={"/loading-state/shield.svg"} alt={`${alt} - No Logo`} className={`object-contain ${className ?? ""}`} />;
  }

  return <img src={logoUrl} alt={alt} className={`object-contain ${className ?? ""}`} />;
};

export default GetTeamLogo;