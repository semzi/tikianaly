import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getBasketballPlayerImageById,
} from "@/lib/api/basketball/index";

interface GetBasketballPlayerImageProps {
  playerId?: string | number;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

interface PlayerApiItem {
  player_id?: number;
  image?: string;
  photo?: string;
  image_path?: string;
}

interface PlayerApiResponse {
  responseObject?: {
    item?: PlayerApiItem | PlayerApiItem[];
  };
}

const playerImageFailedCache = new Set<string>();

const extractImageUrl = (data: PlayerApiResponse): string | null => {
  const item = data?.responseObject?.item;
  const player = Array.isArray(item) ? item[0] : item;
  const rawImage = player?.image || player?.photo || player?.image_path || "";

  if (!rawImage) return null;

  // If already a data URI, return as-is
  if (rawImage.startsWith("data:image")) {
    return rawImage;
  }

  // If it's base64 without prefix, add the prefix
  return `data:image/png;base64,${rawImage}`;
};

const GetBasketballPlayerImage: React.FC<GetBasketballPlayerImageProps> = ({
  playerId,
  alt,
  className,
  width = 64,
  height = 64,
}) => {
  const safeAlt = String(alt ?? "").trim() || "Player";
  const id = String(playerId ?? "").trim();

  const { data: imageUrl, isLoading: loading } = useQuery({
    queryKey: ["basketball", "player", "image", id],
    queryFn: async () => {
      if (playerImageFailedCache.has(id)) {
        return null;
      }

      try {
        const res = (await getBasketballPlayerImageById(id)) as PlayerApiResponse;
        const imgUrl = extractImageUrl(res);

        if (!imgUrl) {
          playerImageFailedCache.add(id);
        }

        return imgUrl;
      } catch {
        playerImageFailedCache.add(id);
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
        className={`relative overflow-hidden bg-gray-300 dark:bg-[#1F2937] rounded-full ${className ?? ""}`}
        style={{ width, height }}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <img
        src="/loading-state/player.svg"
        alt={`${safeAlt} - No Image`}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        className={`object-contain rounded-full bg-gray-200 dark:bg-[#1F2937] ${className ?? ""}`}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={safeAlt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={`object-cover rounded-full ${className ?? ""}`}
    />
  );
};

export default GetBasketballPlayerImage;
