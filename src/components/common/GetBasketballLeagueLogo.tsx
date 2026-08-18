import React from "react";

interface GetBasketballLeagueLogoProps {
  leagueId?: string | number;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

const GetBasketballLeagueLogo: React.FC<GetBasketballLeagueLogoProps> = ({
  alt,
  className,
  width = 32,
  height = 32,
}) => {
  const safeAlt = String(alt ?? "").trim() || "League";

  return (
    <img
      src="/loading-state/shield.svg"
      alt={safeAlt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={`object-contain ${className ?? ""}`}
    />
  );
};

export default GetBasketballLeagueLogo;
