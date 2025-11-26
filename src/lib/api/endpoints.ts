import apiClient from './axios';

// Authentication Endpoints

/**
 * Request OTP for a user
 * @param data - Request data containing email or phone
 */
export const requestOTP = async (data: any) => {
  const response = await apiClient.post('/api/v1/user/request-otp', data);
  return response.data;
};

/**
 * Verify a user with OTP
 * @param data - Request data containing email/phone and OTP
 */
export const verifyUser = async (data: any) => {
  const response = await apiClient.post('/api/v1/user/verify-user', data);
  return response.data;
};

/**
 * Register a new user
 * @param data - User registration data
 */
export const addUser = async (data: any) => {
  const response = await apiClient.post('/api/v1/user/add-user', data);
  return response.data;
};

/**
 * Login a user
 * @param data - Login credentials (email/phone and password)
 */
export const login = async (data: any) => {
  const response = await apiClient.post('/api/v1/user/login', data);
  return response.data;
};

// Football Favorites Endpoints

/**
 * Filter favorites
 * @param data - Filter criteria for favorites
 */
export const filterFavorites = async (data: any) => {
  const response = await apiClient.post('/api/v1/football/filter-favorites', data);
  return response.data;
};

/**
 * Add a favorite
 * @param data - Favorite item data to add
 */
export const addFavorite = async (data: any) => {
  const response = await apiClient.post('/api/v1/football/add-favorites', data);
  return response.data;
};

/**
 * Get all favorites
 * @param params - Optional query parameters
 */
export const getFavorites = async (params?: any) => {
  const response = await apiClient.get('/api/v1/football/get-favorites', { params });
  return response.data;
};

/**
 * Delete a favorite by ID
 * @param id - The ID of the favorite to delete
 */
export const deleteFavorite = async (id: string | number) => {
  const response = await apiClient.delete(`/api/v1/football/delete-favorites/${id}`);
  return response.data;
};

