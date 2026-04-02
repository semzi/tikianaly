import React, { useState } from "react";

type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback?: string;
};

const Image: React.FC<ImageProps> = ({
  src,
  alt = "",
  className = "",
  fallback = "/loading-state/shield.svg",
  ...props
}) => {
  const [error, setError] = useState(false);

  const getSource = () => {
    if (error || !src || src.trim() === "" || src === "undefined" || src === "null") {
      return fallback;
    }
    return src;
  };

  return (
    <img
      src={getSource()}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
};

export default Image;
