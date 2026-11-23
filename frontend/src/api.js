import axios from 'axios'
import { getToken, removeToken } from './utils/auth';

// URL del backend: se configura con VITE_API_URL (p. ej. en frontend/.env.local o en el build).
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Evento que avisa a la app de que la sesión expiró (lo escucha UserContext).
export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Un 401 en una petición que llevaba token significa que la sesión ya no es válida.
        const sentToken = Boolean(error.config?.headers?.Authorization);
        if (error.response?.status === 401 && sentToken) {
            removeToken();
            window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
        }
        return Promise.reject(error);
    }
);

export default api;
