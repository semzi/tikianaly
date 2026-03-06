import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getBasketballLeagueLogoById,
} from "@/lib/api/basketball/index";

interface GetBasketballLeagueLogoProps {
  leagueId?: string | number;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

interface LeagueApiItem {
  league_id?: number;
  logo?: string;
  image?: string;
  image_path?: string;
}

interface LeagueApiResponse {
  responseObject?: {
    item?: LeagueApiItem | LeagueApiItem[];
  };
}

const leagueLogoFailedCache = new Set<string>();

const extractImageUrl = (data: LeagueApiResponse): string | null => {
  const item = data?.responseObject?.item;
  const league = Array.isArray(item) ? item[0] : item;
  const rawImage = league?.logo || league?.image || league?.image_path || "";

  if (!rawImage) return null;

  // If already a data URI, return as-is
  if (rawImage.startsWith("data:image")) {
    return rawImage;
  }

  // If it's base64 without prefix, add the prefix
  return `data:image/png;base64,${rawImage}`;
};

const GetBasketballLeagueLogo: React.FC<GetBasketballLeagueLogoProps> = ({
  leagueId,
  alt,
  className,
  width = 32,
  height = 32,
}) => {
  const safeAlt = String(alt ?? "").trim() || "League";
  const id = String(leagueId ?? "").trim();

  const { data: logoUrl, isLoading: loading } = useQuery({
    queryKey: ["basketball", "league", "logo", id],
    queryFn: async () => {
      if (leagueLogoFailedCache.has(id)) {
        return null;
      }

      try {
        const res = (await getBasketballLeagueLogoById(id)) as LeagueApiResponse;
        const imageUrl = extractImageUrl(res);

        if (!imageUrl) {
          leagueLogoFailedCache.add(id);
        }

        return imageUrl;
      } catch {
        leagueLogoFailedCache.add(id);
        return null;
      }
    },
    staleTime: 7 * 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: id !== "",
  });

  if (loading) {
    return (
      <div
        className={`relative overflow-hidden bg-gray-300 dark:bg-[#1F2937] rounded ${className ?? ""}`}
        style={{ width, height }}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
      </div>
    );
  }

  if (!logoUrl) {
    return (
      <img
        src="/loading-state/shield.svg"
        alt={`${safeAlt} - No Logo`}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        className={`object-contain ${className ?? ""}`}
      />
    );
  }

  return (
    <img
      src={logoUrl}
      alt={safeAlt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={`object-contain ${className ?? ""}`}
    />
  );
};

export default GetBasketballLeagueLogo;
