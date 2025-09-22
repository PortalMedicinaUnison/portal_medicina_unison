import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../config';
import { useUser } from '../../../contexts/UserContext';
import { loginRequest } from '../../../services/authService';
import { setToken, removeToken } from '../../../utils/auth';

export default function useAuth() {
  const navigate = useNavigate();
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
      const token = data?.access_token;
      if (!token) throw new Error('Access token does not received');
      
      setToken(token);
      await reload();
      setSuccess(true);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading, navigate, reload]);

  const logout = useCallback(() => {
    removeToken();
    clearUser();
    reset();
    navigate(ROUTES.AUTH.LOGIN);
  }, [navigate, clearUser, reset]);

  return { login, logout, loading, error, success, isAuthenticated, reset }
}
