import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getBasketballTeamLogoById,
} from "@/lib/api/basketball/index";
import Image from "./Image";

interface GetBasketballTeamLogoProps {
  teamId?: string | number;
  imageUrl?: string | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

interface TeamApiItem {
  team_id?: number;
  logo?: string;
  image?: string;
  image_url?: string | null;
}

interface TeamApiResponse {
  responseObject?: {
    item?: TeamApiItem | TeamApiItem[];
  };
}

const teamLogoFailedCache = new Set<string>();

const extractImageUrl = (data: TeamApiResponse): string | null => {
  const item = data?.responseObject?.item;
  const team = Array.isArray(item) ? item[0] : item;
  const rawImage = team?.logo || team?.image || team?.image_url || "";

  if (!rawImage) return null;

  // If already a data URI, return as-is
  if (rawImage.startsWith("data:image")) {
    return rawImage;
  }

  // If it's already a URL, return as-is
  if (rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
    return rawImage;
  }

  // Otherwise assume it's raw base64 and add the prefix
  return `data:image/png;base64,${rawImage}`;
};

const GetBasketballTeamLogo: React.FC<GetBasketballTeamLogoProps> = ({
  teamId,
  imageUrl: directImageUrl,
  alt,
  className,
  width = 32,
  height = 32,
}) => {
  const safeAlt = String(alt ?? "").trim() || "Team";
  const id = String(teamId ?? "").trim();

  // Use the direct URL if provided, otherwise fetch from API
  const shouldFetch = !directImageUrl && id !== "";
  const { data: logoUrl, isLoading: loading } = useQuery({
    queryKey: ["basketball", "team", "logo", id],
    queryFn: async () => {
      if (teamLogoFailedCache.has(id)) {
        return null;
      }

      try {
        const res = (await getBasketballTeamLogoById(id)) as TeamApiResponse;
        const imageUrl = extractImageUrl(res);

        if (!imageUrl) {
          teamLogoFailedCache.add(id);
        }

        return imageUrl;
      } catch {
        teamLogoFailedCache.add(id);
        return null;
      }
    },
    staleTime: 7 * 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: shouldFetch,
  });

  const resolvedUrl = directImageUrl || logoUrl;

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

  return (
    <Image
      src={resolvedUrl}
      alt={safeAlt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={`object-contain ${className ?? ""}`}
    />
  );
};

export default GetBasketballTeamLogo;
