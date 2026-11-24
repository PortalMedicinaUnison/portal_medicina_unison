import { useState, useCallback, useEffect, useRef } from 'react';
import { SESSION_EXPIRED_EVENT } from '../../../api';
import { getMeRequest } from '../../../services/userService';
import { getToken, removeToken } from '../../../utils/auth';

export default function useUserSession() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // `loadedRef` evita poner la app en "cargando" al refrescar una sesión ya cargada
  // (si no, ProtectedRoute/Layout desmontan la página y hay un parpadeo al guardar el perfil).
  const loadedRef = useRef(false);

  const clear = useCallback(() => {
    loadedRef.current = false;
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
    if (!loadedRef.current) setLoading(true);
    setError(null);
    try {
      const { data } = await getMeRequest();
      setUser(data);
      loadedRef.current = true;
      return data;
    } catch (err) {
      // Solo un 401 invalida la sesión; un fallo de red no debe cerrar la sesión.
      if (err?.response?.status === 401) {
        removeToken();
        setUser(null);
        loadedRef.current = false;
        setError('Tu sesión no es válida o expiró. Inicia sesión de nuevo.');
      } else {
        setError('No se pudo conectar con el servidor. Intenta de nuevo.');
      }
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
      loadedRef.current = false;
      setUser(null);
      setError('Tu sesión expiró. Inicia sesión de nuevo.');
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  return { user, loading, error, refresh, clear };
}
