import { useState, useCallback, useEffect } from 'react';
import { SESSION_EXPIRED_EVENT } from '../../../api';
import { getMeRequest } from '../../../services/userService';
import { getToken, removeToken } from '../../../utils/auth';

export default function useUserSession() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const clear = useCallback(() => {
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMeRequest();
      setUser(data);
      return data;
    } catch {
      removeToken();
      setUser(null);
      setError('Tu sesión no es válida o expiró. Inicia sesión de nuevo.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Si cualquier petición recibe 401 (token vencido), se cierra la sesión en la app.
  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setError('Tu sesión expiró. Inicia sesión de nuevo.');
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  return { user, loading, error, refresh, clear };
}
