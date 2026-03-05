import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getLeagueById } from "@/lib/api/endpoints";

interface GetLeagueLogoProps {
  leagueId: string | number;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

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

const extractImageUrl = (data: LeagueApiResponse): string | null => {
  const item = data?.responseObject?.item;
  const league = Array.isArray(item) ? item[0] : item;

  const rawImage = String(
    (league as any)?.image ??
      (league as any)?.logo ??
      (league as any)?.image_path ??
      ""
  ).trim();

  if (!rawImage) return null;
  
  return rawImage.startsWith("data:image") ? rawImage : `data:image/png;base64,${rawImage}`;
};

const GetLeagueLogo: React.FC<GetLeagueLogoProps> = ({
  leagueId,
  alt,
  className,
  width = 32,
  height = 32,
}) => {
  const id = String(leagueId);
  
  const { data: logoUrl, isLoading: loading, error } = useQuery({
    queryKey: ["league", "logo", id],
    queryFn: async () => {
      const res = await getLeagueById(id) as LeagueApiResponse;
      return extractImageUrl(res);
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - league logos don't change often
    gcTime: 7 * 24 * 60 * 60 * 1000, // Keep in garbage collection for 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => 250 * Math.pow(2, attemptIndex),
    enabled: !!leagueId && String(leagueId).trim() !== "",
  });

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 rounded-full object-contain ${className ?? ""}`}
        style={{ minWidth: width, minHeight: height }}
      />
    );
  }

  if (error || !logoUrl) {
    return (
      <img
        src={"/loading-state/shield.svg"}
        alt={`${alt} - No Logo`}
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
      alt={alt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={`object-contain ${className ?? ""}`}
    />
  );
};

export default GetLeagueLogo;