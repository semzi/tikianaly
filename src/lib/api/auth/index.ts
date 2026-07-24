import { authApiClient as apiClient } from "../axios";

/**
 * Register a new user
 * @param data - User registration data
 */
export const addUser = async (data: any) => {
  const response = await apiClient.post("/api/v1/auth/register", data);
  return response.data;
};

/**
 * Login a user
 * @param data - Login credentials (email/phone and password)
 */
export const login = async (data: any) => {
  const response = await apiClient.post("/api/v1/auth/login", data);
  return response.data;
};

/**
 * Forgot password: request OTP
 * @param data - Request data containing email
 */
export const forgotPasswordRequestOtp = async (data: { email: string }) => {
  const response = await apiClient.post("/api/v1/auth/reset-password", data);
  return response.data;
};

/**
 * Forgot password: reset password using OTP
 * @param data - OTP value and new password
 */
export const forgotPasswordVerifyOtp = async (
  data: { resetId: string; resetOtp: string; newPassword: string }
) => {
  const response = await apiClient.post("/api/v1/auth/reset-password/confirm", data);
  return response.data;
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get("/api/v1/auth/me");
  return response.data;
};

/**
 * Change password while authenticated
 */
export const changePassword = async (data: any) => {
  const response = await apiClient.post("/api/v1/auth/change-password", data);
  return response.data;
};

/**
 * Logout
 */
export const logout = async () => {
  const response = await apiClient.post("/api/v1/auth/logout");
  return response.data;
};

/**
 * Refresh access tokens
 */
export const refreshTokens = async (data: { refreshToken: string }) => {
  const response = await apiClient.post("/api/v1/auth/refresh", data);
  return response.data;
};