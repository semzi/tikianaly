import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type BackendStatus = {
  isOnline: boolean;
  isChecking: boolean;
  retryInSeconds: number;
  lastErrorAt: number | null;
  markOffline: () => void;
  retryNow: () => void;
};

const BackendStatusContext = createContext<BackendStatus | null>(null);

export const useBackendStatus = (): BackendStatus => {
  const ctx = useContext(BackendStatusContext);
  if (!ctx) {
    return {
      isOnline: true,
      isChecking: false,
      retryInSeconds: 0,
      lastErrorAt: null,
      markOffline: () => {},
      retryNow: () => {},
    };
  }
  return ctx;
};

export const BackendStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [retryInSeconds, setRetryInSeconds] = useState(0);
  const [lastErrorAt, setLastErrorAt] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current !== null) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const scheduleRetry = (seconds: number) => {
    clearTimers();
    setRetryInSeconds(seconds);

    countdownRef.current = window.setInterval(() => {
      setRetryInSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    timerRef.current = window.setTimeout(() => {
      try {
        window.dispatchEvent(new Event("backend:retry-now"));
      } catch {
        // ignore
      }
    }, seconds * 1000);
  };

  const markOffline = () => {
    setIsOnline(false);
    setIsChecking(false);
    setLastErrorAt(Date.now());
    scheduleRetry(10);
  };

  const retryNow = () => {
    clearTimers();
    setIsChecking(true);
    setRetryInSeconds(0);
    try {
      window.dispatchEvent(new Event("backend:retry-now"));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const onBrowserOnline = () => {
      retryNow();
    };

    const onBackendOffline = (ev: Event) => {
      markOffline();
      const seconds = (ev as CustomEvent)?.detail?.seconds;
      if (typeof seconds === "number" && Number.isFinite(seconds) && seconds > 0) {
        scheduleRetry(seconds);
      }
    };

    const onBackendOnline = () => {
      clearTimers();
      setIsOnline(true);
      setIsChecking(false);
      setRetryInSeconds(0);
      setLastErrorAt(null);
    };

    const onRetryScheduled = (ev: Event) => {
      const seconds = (ev as CustomEvent)?.detail?.seconds;
      if (typeof seconds === "number" && Number.isFinite(seconds) && seconds > 0) {
        setIsOnline(false);
        setLastErrorAt(Date.now());
        scheduleRetry(seconds);
      }
    };

    const onRetryStart = () => {
      setIsChecking(true);
    };

    window.addEventListener("online", onBrowserOnline);
    window.addEventListener("backend:offline", onBackendOffline as EventListener);
    window.addEventListener("backend:online", onBackendOnline);
    window.addEventListener("backend:retry-scheduled", onRetryScheduled as EventListener);
    window.addEventListener("backend:retry-start", onRetryStart);
    return () => {
      window.removeEventListener("online", onBrowserOnline);
      window.removeEventListener("backend:offline", onBackendOffline as EventListener);
      window.removeEventListener("backend:online", onBackendOnline);
      window.removeEventListener("backend:retry-scheduled", onRetryScheduled as EventListener);
      window.removeEventListener("backend:retry-start", onRetryStart);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const value = useMemo<BackendStatus>(() => {
    return {
      isOnline,
      isChecking,
      retryInSeconds,
      lastErrorAt,
      markOffline,
      retryNow,
    };
  }, [isOnline, isChecking, retryInSeconds, lastErrorAt]);

  return <BackendStatusContext.Provider value={value}>{children}</BackendStatusContext.Provider>;
};
