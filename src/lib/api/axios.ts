import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { navigate } from "../router/navigate";

const apiClient = axios.create({
  baseURL: 'https://tikianaly-service-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token helpers
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("tikianaly_token");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("tikianaly_token", JSON.stringify(token));
};

export const clearAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("tikianaly_token");
  localStorage.removeItem("tikianaly_user");
};

// Request interceptor: Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
