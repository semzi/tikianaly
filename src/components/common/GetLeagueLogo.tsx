import React, { useEffect, useState } from "react";
import axios from "axios";

interface GetLeagueLogoProps {
  leagueId: string | number;
  alt: string;
  className?: string;
}

interface LeagueLogoApiItem {
  id?: number;
  base64?: string;
}

const GetLeagueLogo: React.FC<GetLeagueLogoProps> = ({ leagueId, alt, className }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagueLogo = async () => {
      setLoading(true);
      setError(null);

      const id = String(leagueId);

      try {
        const url = `/goalserve/api/v1/logotips/soccer/leagues?k=13bf8a6da00f4047d69808de0442e200&ids=${id}`;
        const response = await axios.get(url, { timeout: 15000 });

        console.log(`API Response for leagueId ${id}:`, response.data);

        const raw = response.data as unknown;
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

        const data = parsed as LeagueLogoApiItem[];
        const first = Array.isArray(data) ? data[0] : undefined;
        if (first && typeof first.base64 === "string" && first.base64) {
          const dataUri = `data:image/png;base64,${first.base64}`;
          setLogoUrl(dataUri);
        } else {
          setLogoUrl(null);
        }
      } catch (err: any) {
        console.error(`Error fetching logo for leagueId ${leagueId}:`, err);
        const status = err?.response?.status;
        const statusText = err?.response?.statusText;
        setError(status ? `Failed to load logo (${status}${statusText ? ` ${statusText}` : ""})` : "Failed to load logo");
        setLogoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if (leagueId === null || leagueId === undefined || String(leagueId).trim() === "") {
      setLogoUrl(null);
      setLoading(false);
      return;
    }

    fetchLeagueLogo();
  }, [leagueId]);

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 rounded-full ${className ?? ""}`}
        style={{ minWidth: "20px", minHeight: "20px" }}
      />
    );
  }

  if (error || !logoUrl) {
    return <img src={"/loading-state/shield.svg"} alt={`${alt} - No Logo`} className={className} />;
  }

  return <img src={logoUrl} alt={alt} className={className} />;
};

export default GetLeagueLogo;
