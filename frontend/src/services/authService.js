import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const loginRequest = (credentials) =>
  api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

export const verifyTokenRequest = (token) =>
  api.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN, { token });

export const refreshTokenRequest = (token) =>
  api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { token });
