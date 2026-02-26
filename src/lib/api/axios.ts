import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { navigate } from "../router/navigate";

const RETRY_AFTER_MS = 10_000;

type RetryConfig = InternalAxiosRequestConfig & {
  __tikianalyRetry?: {
    attempted?: boolean;
  };
};

let lastRetryFn: null | (() => void) = null;

const scheduleRetry = (fn: () => void) => {
  lastRetryFn = fn;
  try {
    window.dispatchEvent(
      new CustomEvent("backend:retry-scheduled", { detail: { seconds: Math.round(RETRY_AFTER_MS / 1000) } })
    );
  } catch {
    // ignore
  }
  window.setTimeout(() => {
    try {
      window.dispatchEvent(new Event("backend:retry-start"));
    } catch {
      // ignore
    }
    fn();
  }, RETRY_AFTER_MS);
};

if (typeof window !== "undefined") {
  window.addEventListener("backend:retry-now", () => {
    if (lastRetryFn) {
      try {
        window.dispatchEvent(new Event("backend:retry-start"));
      } catch {
        // ignore
      }
      lastRetryFn();
    }
  });
}

const apiClient = axios.create({
    baseURL: 'https://tikianaly-service-backend.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// blog  baserurl 
const API = axios.create({
  baseURL: "https://tikianaly-blog.onrender.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});
export { API };
// end of blog url

// Auth token helpers
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const sessionStored = sessionStorage.getItem("tikianaly_token");
    if (sessionStored) return JSON.parse(sessionStored);
    const localStored = localStorage.getItem("tikianaly_token");
    return localStored ? JSON.parse(localStored) : null;
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string, rememberMe: boolean = true): void => {
  if (typeof window === "undefined") return;
  if (rememberMe) {
    localStorage.setItem("tikianaly_token", JSON.stringify(token));
    sessionStorage.removeItem("tikianaly_token");
    return;
  }
  sessionStorage.setItem("tikianaly_token", JSON.stringify(token));
  localStorage.removeItem("tikianaly_token");
};

export const getStoredUser = (): any | null => {
  if (typeof window === "undefined") return null;
  try {
    const sessionStored = sessionStorage.getItem("tikianaly_user");
    if (sessionStored) return JSON.parse(sessionStored);
    const localStored = localStorage.getItem("tikianaly_user");
    return localStored ? JSON.parse(localStored) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: any, rememberMe: boolean = true): void => {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem("tikianaly_user", serialized);
    sessionStorage.removeItem("tikianaly_user");
    return;
  }
  sessionStorage.setItem("tikianaly_user", serialized);
  localStorage.removeItem("tikianaly_user");
};

// Forgot password reset token helpers
export const getResetToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("tikianaly_reset_token");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setResetToken = (token: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("tikianaly_reset_token", JSON.stringify(token));
};

export const clearResetToken = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("tikianaly_reset_token");
};

export const clearAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("tikianaly_token");
  localStorage.removeItem("tikianaly_user");
  sessionStorage.removeItem("tikianaly_token");
  sessionStorage.removeItem("tikianaly_user");
  sessionStorage.removeItem("tikianaly_reset_token");
};

// Request interceptor: Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      const headers = config.headers as Record<string, unknown>;
      const hasAuthorization =
        typeof headers.Authorization === "string" ||
        typeof headers.authorization === "string";

      if (!hasAuthorization) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors (only redirect if token exists)
apiClient.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined") {
      try {
        window.dispatchEvent(new Event("backend:online"));
      } catch {
        // ignore
      }
    }
    return response;
  },
  (error: AxiosError) => {
    // Only handle 401 if user was previously authenticated
    // This prevents redirecting on public endpoints that return 401
    if (error.response?.status === 401 && getAuthToken()) {
      clearAuthToken();
      // Use setTimeout to avoid navigation during render
      setTimeout(() => {
        navigate("/login");
      }, 0);
    }

    const status = error.response?.status;
    const isNetworkError = !error.response;
    const isServerError = typeof status === "number" && status >= 500;
    const shouldTreatOffline = isNetworkError || isServerError;

    const cfg = (error.config ?? {}) as RetryConfig;
    const method = String(cfg.method ?? "get").toLowerCase();
    const isGet = method === "get";
    const retryAttempted = Boolean(cfg.__tikianalyRetry?.attempted);

    if (typeof window !== "undefined" && shouldTreatOffline) {
      try {
        window.dispatchEvent(new Event("backend:offline"));
      } catch {
        // ignore
      }
    }

    if (shouldTreatOffline) {
      (error as any).message = "Service temporarily unavailable. Retrying...";
    }

    // Simple retry strategy:
    // - Only retry GET requests (idempotent)
    // - Only retry once per request
    // - Retry after 10s
    if (typeof window !== "undefined" && shouldTreatOffline && isGet && !retryAttempted) {
      cfg.__tikianalyRetry = { attempted: true };

      scheduleRetry(() => {
        apiClient
          .request(cfg)
          .then(() => {
            try {
              window.dispatchEvent(new Event("backend:online"));
            } catch {
              // ignore
            }
          })
          .catch(() => {
            try {
              window.dispatchEvent(new Event("backend:offline"));
            } catch {
              // ignore
            }
          });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
