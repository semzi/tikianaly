import React from "react";

interface GetLeagueLogoProps {
  leagueId?: string | number;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  image?: string;
}

const GetLeagueLogo: React.FC<GetLeagueLogoProps> = ({
  alt,
  className,
  width = 32,
  height = 32,
  image,
  leagueId,
}) => {
  const src = image || (leagueId ? `https://cdn.tikianaly.com/soccer/league/${leagueId}.png` : "/loading-state/shield.svg");
  return (
    <img
      src={src}
      alt={alt || "League"}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={`object-contain ${className ?? ""}`}
    />
  );
};

export default GetLeagueLogo;