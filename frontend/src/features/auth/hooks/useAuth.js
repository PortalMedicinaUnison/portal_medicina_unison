import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_HOME, ROUTES } from '../../../config';
import { useUser } from '../../../contexts/UserContext';
import { loginRequest } from '../../../services/authService';
import { setToken, removeToken } from '../../../utils/auth';
import { getErrorMessage } from '../../../utils/errors';

// Solo se regresa a rutas internas de la app (evita redirecciones abiertas).
const isSafeInternalPath = (path) =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.startsWith(ROUTES.AUTH.LOGIN);

export default function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reload, clearUser, isAuthenticated } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const login = useCallback(async (credentials) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data } = await loginRequest(credentials);
      if (!data?.access_token) throw new Error('No se recibió el token de acceso.');
      setToken(data.access_token);
      const user = await reload();
      if (!user) throw new Error('No se pudo cargar tu cuenta.');
      setSuccess(true);

      const isAdmin = user.role === 'admin' || user.role === 'super_admin';
      const from = location.state?.from;
      const target = isSafeInternalPath(from) && from.startsWith(ADMIN_HOME) === isAdmin
        ? from
        : (isAdmin ? ADMIN_HOME : ROUTES.HOME);
      navigate(target, { replace: true });
    } catch (err) {
      removeToken();
      setError(getErrorMessage(err, err?.message || 'Error al iniciar sesión.'));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading, navigate, reload, location.state]);

  const logout = useCallback(() => {
    removeToken();
    clearUser();
    reset();
    navigate(ROUTES.AUTH.LOGIN);
  }, [navigate, clearUser, reset]);

  return { login, logout, loading, error, success, isAuthenticated, reset }
}
