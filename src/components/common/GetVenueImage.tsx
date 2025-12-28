import React, { useEffect, useState } from "react";
import { getTeamById } from "@/lib/api/endpoints";

interface GetVenueImageProps {
  teamId?: string | number;
  alt?: string;
  className?: string;
}

const venueImageMemoryCache = new Map<string, string>();
const venueImageStorageKey = (id: string) => `team_venue_image_base64_${id}`;

const sniffMimeFromBase64 = (b64: string) => {
  const head = String(b64 ?? "").trim().slice(0, 12);
  if (head.startsWith("iVBOR")) return "image/png";
  if (head.startsWith("/9j/")) return "image/jpeg";
  if (head.startsWith("R0lG")) return "image/gif";
  if (head.startsWith("UklGR")) return "image/webp";
  return "image/jpeg";
};

const normalizeBase64ToDataUri = (raw: string) => {
  const v = String(raw ?? "").trim();
  if (!v) return "";
  if (v.startsWith("data:image/")) return v;
  if (v.includes("base64,")) return v;
  const mime = sniffMimeFromBase64(v);
  return `data:${mime};base64,${v}`;
};

const GetVenueImage: React.FC<GetVenueImageProps> = ({ teamId, alt = "Venue", className }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const id = teamId == null ? "" : String(teamId).trim();
    if (!id) {
      setImgUrl(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchVenueImage = async () => {
      setLoading(true);

      const memoryCached = venueImageMemoryCache.get(id);
      if (memoryCached) {
        setImgUrl(memoryCached);
        setLoading(false);
        return;
      }

      try {
        const stored = sessionStorage.getItem(venueImageStorageKey(id));
        if (stored) {
          venueImageMemoryCache.set(id, stored);
          setImgUrl(stored);
          setLoading(false);
          return;
        }
      } catch {
        // ignore storage errors
      }

      try {
        const res = await getTeamById(id);
        const itemRoot = (res as any)?.responseObject?.item;
        const item = Array.isArray(itemRoot) ? itemRoot?.[0] : itemRoot;
        const rawBase64 =
          (item as any)?.venue?.venue_image ??
          (item as any)?.venue_image ??
          (item as any)?.venueImage;

        const dataUri = rawBase64 ? normalizeBase64ToDataUri(String(rawBase64)) : "";
        if (!dataUri) {
          if (!cancelled) setImgUrl(null);
          return;
        }

        venueImageMemoryCache.set(id, dataUri);
        try {
          sessionStorage.setItem(venueImageStorageKey(id), dataUri);
        } catch {
          // ignore storage errors
        }

        if (!cancelled) setImgUrl(dataUri);
      } catch (e) {
        if (!cancelled) setImgUrl(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchVenueImage();

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  if (loading) {
    return <div className={`animate-pulse bg-gray-300 rounded ${className ?? ""}`} style={{ minHeight: 120 }} />;
  }

  if (!imgUrl) {
    return <img src="/icons/stadium.png" alt={alt} className={className ?? ""} />;
  }

  return <img src={imgUrl} alt={alt} className={className ?? ""} />;
};

export default GetVenueImage;
