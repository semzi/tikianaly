import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getLeagueById } from "@/lib/api/endpoints";
import Image from "./Image";

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
  
  const { data: logoUrl, isLoading: loading} = useQuery({
    queryKey: ["league", "logo", id],
    queryFn: async () => {
      const res = await getLeagueById(id) as LeagueApiResponse;
      return extractImageUrl(res);
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, 
    gcTime: 7 * 24 * 60 * 60 * 1000, 
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

  return (
    <Image
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