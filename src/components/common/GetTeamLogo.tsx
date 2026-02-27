import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTeamById } from "@/lib/api/endpoints";

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

const extractImageUrl = (data: TeamApiResponse): string | null => {
  const item = data?.responseObject?.item;
  const team = Array.isArray(item) ? item[0] : item;
  const rawImage = team?.image ? String(team.image).trim() : "";

  if (!rawImage) return null;
  
  return rawImage.startsWith("data:image") ? rawImage : `data:image/png;base64,${rawImage}`;
};

const GetTeamLogo: React.FC<GetTeamLogoProps> = ({
  teamId,
  alt,
  className,
  width = 32,
  height = 32,
}) => {
  const safeAlt = String(alt ?? "").trim() || "Team";
  const id = String(teamId);
  
  const { data: logoUrl, isLoading: loading } = useQuery({
    queryKey: ["team", "logo", id],
    queryFn: async () => {
      const res = await getTeamById(id) as TeamApiResponse;
      return extractImageUrl(res);
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - team logos don't change often
    gcTime: 7 * 24 * 60 * 60 * 1000, // Keep in garbage collection for 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => 250 * Math.pow(2, attemptIndex),
    enabled: !!teamId && String(teamId).trim() !== "",
  });

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 h-5 w-5 rounded-full object-contain ${className ?? ""}`}
      />
    );
  }

  if (!logoUrl) {
    return (
      <img
        src={"/loading-state/shield.svg"}
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

export default GetTeamLogo;