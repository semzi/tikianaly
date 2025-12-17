import React from "react";
import { Link } from "react-router-dom";

interface AfconBannerProps {
  className?: string;
}

export const AfconBanner: React.FC<AfconBannerProps> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full rounded-lg overflow-hidden mb-4 ${className}`}
      style={{
        backgroundImage: "url('/afcon-backdrop.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "150px",
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <img 
            src="/afcon-logo.png" 
            alt="AFCON Logo" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
          <div className="flex flex-col gap-1 text-white">
            <span className="font-semibold text-base md:text-lg">
              AFCON FINAL Countdown
            </span>
            <span className="font-mono tracking-widest text-2xl md:text-3xl font-bold">
              01&nbsp;:&nbsp;12&nbsp;:&nbsp;47&nbsp;:&nbsp;23
            </span>
            <span className="text-xs font-medium opacity-80">
              Days&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hrs&nbsp;&nbsp;&nbsp;Min&nbsp;&nbsp;&nbsp;Sec
            </span>
          </div>
        </div>
        <Link
          className="mt-3 md:mt-0 ml-0 md:ml-7 px-5 py-2 rounded-lg bg-brand-primary text-white font-semibold text-sm shadow hover:bg-brand-primary/90 transition"
          to="/football/afcon"
        >
        Visit League
      </Link>
    </div>
  </div>
  );
}
