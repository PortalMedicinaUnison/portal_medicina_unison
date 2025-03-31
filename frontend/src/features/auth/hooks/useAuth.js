import { useState } from 'react';
import api from '../../../api';
import { setToken, removeToken, isAuthenticated } from '../../../utils/auth';


export default function useAuth() {
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/login/', { email, password });
      setToken(response.data.access_token);
      setAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión.");
      console.error("Login failed", err);
      setAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setAuthenticated(false);
  };
  
  return { login, logout, error, authenticated };
}
