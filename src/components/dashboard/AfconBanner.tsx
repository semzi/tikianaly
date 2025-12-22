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
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-center md:justify-between px-4 py-3 md:px-6 md:py-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <img 
            src="/afcon-logo.png" 
            alt="AFCON Logo" 
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
          <div className="flex flex-col gap-0 md:gap-1 text-white">
            <span className="font-semibold text-sm md:text-base lg:text-lg">
              AFCON FINAL Countdown
            </span>
            <span className="font-mono tracking-widest text-xl md:text-2xl lg:text-3xl font-bold">
              01&nbsp;:&nbsp;12&nbsp;:&nbsp;47&nbsp;:&nbsp;23
            </span>
            <span className="text-xs font-medium opacity-80">
              Days&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hrs&nbsp;&nbsp;&nbsp;Min&nbsp;&nbsp;&nbsp;Sec
            </span>
          </div>
        </div>
        <Link
          className="mt-3 md:mt-0 ml-0 md:ml-7 px-5 py-2 rounded-lg bg-white text-brand-primary font-semibold text-sm shadow hover:bg-gray-200 transition"
          to="/football/afcon"
        >
        Visit Cup
      </Link>
    </div>
  </div>
  );
}
