import { useState, useCallback, useEffect } from 'react';
import { verifyTokenRequest } from '../../../services/authService';
import { getUserByIdRequest } from '../../../services/userService';
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
    setLoading(true);
    setError(null);

    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const verifyResponse = await verifyTokenRequest(token);
      const userId = verifyResponse?.data?.user_info?.user_id;
      if (!userId) throw new Error('Token verificado pero sin user_id');

      const userResponse = await getUserByIdRequest(userId);
      setUser(userResponse.data || null);
    } catch (err) {
      removeToken();
      setUser(null);
      setError('Sesión inválida o expirada');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, error, refresh, clear };
}