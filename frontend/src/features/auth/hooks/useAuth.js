import { useState } from 'react';
import { setToken, removeToken, isAuthenticated } from '../../../utils/auth';
import { useUser } from '../../../contexts/UserContext';
import { loginRequest } from '../../../services/authService';


export default function useAuth() {
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const { clearUser } = useUser();

  const login = async (credentials) => {
    setError(null);
    
    try {
      const response = await loginRequest(credentials);
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
    clearUser();
    setAuthenticated(false);
  };
  
  return { login, logout, error, authenticated };
}
