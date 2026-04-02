import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTeamById } from "@/lib/api/endpoints";
import Image from "./Image";

interface GetTeamLogoProps {
  teamId?: string | number;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
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

const teamLogoFailedCache = new Set<string>();

const extractImageUrl = (data: TeamApiResponse): string | null => {
  const item = data?.responseObject?.item;
  const team = Array.isArray(item) ? item[0] : item;
  const rawImage = team?.image ? String(team.image).trim() : "";

  if (!rawImage) return null;

  return rawImage.startsWith("data:image")
    ? rawImage
    : `data:image/png;base64,${rawImage}`;
};

const GetTeamLogo: React.FC<GetTeamLogoProps> = ({
  teamId,
  alt,
  className,
  width = 32,
  height = 32,
}) => {
  const safeAlt = String(alt ?? "").trim() || "Team";
  const id = String(teamId ?? "").trim();

  const { data: logoUrl, isLoading: loading } = useQuery({
    queryKey: ["team", "logo", id],
    queryFn: async () => {
      if (teamLogoFailedCache.has(id)) {
        return null;
      }

      try {
        const res = (await getTeamById(id)) as TeamApiResponse;
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
    enabled: id !== "",
  });

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 h-5 w-5 rounded-full object-contain ${className ?? ""}`}
      />
    );
  }

  return (
    <Image
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

export default GetTeamLogo;
