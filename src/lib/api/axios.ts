import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { navigate } from "../router/navigate";

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
    return Promise.reject(error);
  }
);

export default apiClient;
