import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const loginRequest = (credentials) =>
  api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

// Registro de estudiantes pre-registrados (no permite crear administradores).
export const registerRequest = (data) =>
  api.post(API_ENDPOINTS.AUTH.REGISTER, data);

export const refreshTokenRequest = () =>
  api.post(API_ENDPOINTS.AUTH.REFRESH);
