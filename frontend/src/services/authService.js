import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const loginRequest = (credentials) =>
  api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

// Registro de estudiantes pre-registrados (no permite crear administradores).
export const registerRequest = (data) =>
  api.post(API_ENDPOINTS.AUTH.REGISTER, data);

export const refreshTokenRequest = () =>
  api.post(API_ENDPOINTS.AUTH.REFRESH);

// ----------------- Restablecer contraseña (sin sesión) ----------------

// { email_enabled, email_link_minutes }: sin correo configurado, el enlace lo genera la coordinación.
export const getPasswordResetOptionsRequest = () =>
  api.get(API_ENDPOINTS.AUTH.PASSWORD_RESET_OPTIONS);

export const requestPasswordResetRequest = (email) =>
  api.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, { email });

// El token va en el cuerpo (no en la URL de la API) para que no quede en los logs.
export const verifyPasswordResetRequest = (token) =>
  api.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_VERIFY, { token });

// data: { token, new_password, confirm_password }
export const confirmPasswordResetRequest = (data) =>
  api.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, data);
