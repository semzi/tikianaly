import { useEffect, useMemo, useState } from "react";

type UseProfileAvatarOptions = {
  seed?: string;
};

export const useProfileAvatar = (options: UseProfileAvatarOptions = {}) => {
  const stableSeed = useMemo(() => {
    const raw = String(options.seed ?? "").trim();
    if (raw) return raw;
    return `${Math.random()}`;
  }, [options.seed]);

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          stableSeed
        )}&backgroundColor=ff4500`;
        setAvatarUrl(url);
      } catch {
        setAvatarUrl("");
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePicture();
  }, [stableSeed]);

  return { avatarUrl, loading };
};

export default useProfileAvatar;
