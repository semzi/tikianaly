import React, { useEffect, useState } from "react";
import { getPlayerById } from "@/lib/api/endpoints";

interface GetPlayerImageProps {
  playerId: string | number;
  alt: string;
  className?: string;
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

const playerImageMemoryCache = new Map<string, string>();
const playerImageStorageKey = (id: string) => `player_image_${id}`;

const GetPlayerImage: React.FC<GetPlayerImageProps> = ({ playerId, alt, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPlayerImage = async () => {
      setLoading(true);

      const id = String(playerId);

      const memoryCached = playerImageMemoryCache.get(id);
      if (memoryCached) {
        setImageUrl(memoryCached);
        setLoading(false);
        return;
      }

      try {
        const stored = sessionStorage.getItem(playerImageStorageKey(id));
        if (stored) {
          playerImageMemoryCache.set(id, stored);
          setImageUrl(stored);
          setLoading(false);
          return;
        }
      } catch {
        // ignore storage errors
      }

      try {
        let res: unknown;
        let lastErr: unknown;

        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            if (controller.signal.aborted) return;
            res = await getPlayerById(id);
            lastErr = undefined;
            break;
          } catch (e) {
            lastErr = e;
            if (controller.signal.aborted) return;
            await new Promise((r) => setTimeout(r, 250 * Math.pow(2, attempt)));
          }
        }

        if (lastErr) throw lastErr;
        if (controller.signal.aborted) return;

        const item = (res as PlayerApiResponse)?.responseObject?.item;
        const player = Array.isArray(item) ? item[0] : item;
        const rawImage = player?.image ? String(player.image).trim() : "";

        if (rawImage) {
          const dataUri = rawImage.startsWith("data:image") ? rawImage : `data:image/png;base64,${rawImage}`;
          playerImageMemoryCache.set(id, dataUri);
          try {
            sessionStorage.setItem(playerImageStorageKey(id), dataUri);
          } catch {
            // ignore storage errors
          }
          setImageUrl(dataUri);
        } else {
          setImageUrl(null);
        }
      } catch {
        if (controller.signal.aborted) return;
        setImageUrl(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    if (playerId === null || playerId === undefined || String(playerId).trim() === "") {
      setImageUrl(null);
      setLoading(false);
      return;
    }

    fetchPlayerImage();

    return () => {
      controller.abort();
    };
  }, [playerId]);

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-300 rounded-full object-cover ${className ?? ""}`}
        style={{ minWidth: "20px", minHeight: "20px" }}
      />
    );
  }

  if (!imageUrl) {
    return <img src={"/loading-state/player.svg"} alt={`${alt} - No Image`} className={`object-cover ${className ?? ""}`} />;
  }

  return <img src={imageUrl} alt={alt} className={`object-cover ${className ?? ""}`} />;
};

export default GetPlayerImage;
