import apiClient from "../axios";

/**
 * Request OTP for a user
 * @param data - Request data containing email or phone
 */
export const requestOTP = async (data: any) => {
  const response = await apiClient.post("/api/v1/user/request-otp", data);
  return response.data;
};

/**
 * Verify a user with OTP
 * @param data - Request data containing email/phone and OTP
 */
export const verifyUser = async (data: any) => {
  const response = await apiClient.post("/api/v1/user/verify-user", data);
  return response.data;
};

/**
 * Forgot password: request OTP
 * @param data - Request data containing email
 */
export const forgotPasswordRequestOtp = async (data: { email: string }) => {
  const response = await apiClient.post(
    "/api/v1/user/forgot-password/otp",
    data,
  );
  return response.data;
};

/**
 * Forgot password: verify OTP
 * @param data - OTP value
 * @param otpToken - Token returned from forgotPasswordRequestOtp
 */
export const forgotPasswordVerifyOtp = async (
  data: { otp: string },
  otpToken: string,
) => {
  const response = await apiClient.post(
    "/api/v1/user/forgot-password/otp/verify",
    data,
    {
      headers: {
        Authorization: `Bearer ${otpToken}`,
      },
    },
  );
  return response.data;
};

export const forgotPasswordResetPassword = async (
  data: { newPassword: string; confirmPassword: string },
  resetToken: string,
) => {
  const response = await apiClient.post(
    "/api/v1/user/forgot-password/otp/reset",
    data,
    {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    },
  );
  return response.data;
};

/**
 * Register a new user
 * @param data - User registration data
 */
export const addUser = async (data: any) => {
  const response = await apiClient.post("/api/v1/user/add-user", data);
  return response.data;
};

/**
 * Login a user
 * @param data - Login credentials (email/phone and password)
 */
export const login = async (data: any) => {
  const response = await apiClient.post("/api/v1/user/login", data);
  return response.data;
};