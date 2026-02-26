import { useBackendStatus } from "@/context/BackendStatusContext";

export const BackendStatusBanner = () => {
  const { isOnline, isChecking, retryInSeconds, retryNow } = useBackendStatus();

  if (isOnline) return null;

  return (
    <div className="sticky top-0 z-[60] w-full border-b border-amber-500/20 bg-amber-500/10 backdrop-blur">
      <div className="page-padding-x py-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 truncate">
            Unable to connect — retrying in {retryInSeconds}s
          </p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-200/80 truncate">
            Some live features may be unavailable.
          </p>
        </div>

        <button
          type="button"
          onClick={retryNow}
          disabled={isChecking}
          className="shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold border border-amber-500/30 text-amber-800 dark:text-amber-200 hover:bg-amber-500/10 disabled:opacity-60"
        >
          {isChecking ? "Checking..." : "Retry now"}
        </button>
      </div>
    </div>
  );
};
