import { useState, useEffect } from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

interface ReturnToTodayProps {
  show: boolean;
  onReturnToToday: () => void;
  subtitle?: string;
}

const ReturnToToday = ({ show, onReturnToToday, subtitle = "Go back to today's fixtures" }: ReturnToTodayProps) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!show) return;
    if (!isMobile) {
      setIsCollapsed(false);
      return;
    }
    setIsCollapsed(false);
    const t = window.setTimeout(() => setIsCollapsed(true), 5000);
    return () => window.clearTimeout(t);
  }, [show, isMobile]);

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-50 flex justify-center px-4 pointer-events-none w-full">
      <button
        type="button"
        className={`pointer-events-auto backdrop-blur shadow-[0_0_18px_rgba(34,211,238,0.35)] dark:shadow-[0_0_22px_rgba(217,70,239,0.30)] hover:shadow-[0_0_24px_rgba(34,211,238,0.55)] dark:hover:shadow-[0_0_28px_rgba(217,70,239,0.50)] transition-shadow border border-cyan-400/40 dark:border-fuchsia-400/30 bg-white/90 dark:bg-black/40 ${
          isMobile && isCollapsed
            ? "w-14 h-14 rounded-full flex items-center justify-center"
            : "w-full max-w-md rounded-2xl px-4 py-3 text-left"
        }`}
        onClick={onReturnToToday}
      >
        {isMobile && isCollapsed ? (
          <ArrowUturnLeftIcon className="h-6 w-6 text-brand-primary dark:text-white" />
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 border border-cyan-400/30 dark:border-fuchsia-400/30 flex items-center justify-center flex-shrink-0">
              <ArrowUturnLeftIcon className="h-5 w-5 text-brand-primary dark:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-primary dark:text-white">Return to Today</p>
              <p className="text-xs text-neutral-n5 dark:text-snow-200 truncate">{subtitle}</p>
            </div>
            <div className="text-xs font-semibold text-brand-secondary dark:text-cyan-300 flex-shrink-0">
              Open
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default ReturnToToday;
