import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const login = (credentials) =>
  api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

export const signUp = (data) =>
  api.post(API_ENDPOINTS.AUTH.SIGNUP, data);

export const verifyToken = (token) =>
  api.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN, { token });

export const refreshToken = (token) =>
  api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { token });
