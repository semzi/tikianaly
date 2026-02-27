import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlayerById } from "@/lib/api/endpoints";

interface GetPlayerImageProps {
  playerId: string | number;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

interface PlayerApiItem {
  player_id?: number;
  image?: string;
}

interface PlayerApiResponse {
  responseObject?: {
    item?: PlayerApiItem | PlayerApiItem[];
  };
}

const extractImageUrl = (data: PlayerApiResponse): string | null => {
  const item = data?.responseObject?.item;
  const player = Array.isArray(item) ? item[0] : item;
  const rawImage = player?.image ? String(player.image).trim() : "";

  if (!rawImage) return null;
  
  return rawImage.startsWith("data:image") ? rawImage : `data:image/png;base64,${rawImage}`;
};

const GetPlayerImage: React.FC<GetPlayerImageProps> = ({
  playerId,
  alt,
  className,
  width = 48,
  height = 48,
}) => {
  const id = String(playerId);
  
  const { data: imageUrl, isLoading: loading } = useQuery({
    queryKey: ["player", "image", id],
    queryFn: async () => {
      const res = await getPlayerById(id) as PlayerApiResponse;
      return extractImageUrl(res);
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - player images don't change often
    gcTime: 7 * 24 * 60 * 60 * 1000, // Keep in garbage collection for 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => 250 * Math.pow(2, attemptIndex),
    enabled: !!playerId && String(playerId).trim() !== "",
  });

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 rounded-full object-cover ${className ?? ""}`}
        style={{ minWidth: width, minHeight: height }}
      />
    );
  }

  if (!imageUrl) {
    return (
      <img
        src={"/loading-state/player.svg"}
        alt={`${alt} - No Image`}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        className={`object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={`object-cover ${className ?? ""}`}
    />
  );
};

export default GetPlayerImage;