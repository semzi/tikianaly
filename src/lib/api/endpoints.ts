import apiClient from './axios';

// Authentication Endpoints

/**
 * Request OTP for a user
 * @param data - Request data containing email or phone
 */
export const requestOTP = async (data: any) => {
  const response = await apiClient.post('/api/user/request-otp', data);
  return response.data;
};

/**
 * Verify a user with OTP
 * @param data - Request data containing email/phone and OTP
 */
export const verifyUser = async (data: any) => {
  const response = await apiClient.post('/api/user/verify-user', data);
  return response.data;
};

/**
 * Register a new user
 * @param data - User registration data
 */
export const addUser = async (data: any) => {
  const response = await apiClient.post('/api/user/add-user', data);
  return response.data;
};

/**
 * Login a user
 * @param data - Login credentials (email/phone and password)
 */
export const login = async (data: any) => {
  const response = await apiClient.post('/api/user/login', data);
  return response.data;
};

