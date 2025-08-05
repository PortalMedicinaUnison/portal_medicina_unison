import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken, removeToken } from '../../utils/auth';
import { ROUTES } from '../../config';
import { verifyTokenRequest } from '../../services/authService';

const ProtectedRoute = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    loading: true
  });
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = getToken();
      
      if (!token) {
        console.error("No token found");
        setAuthStatus({ isAuthenticated: false, loading: false });
        return;
      }

      try {
        const response = await verifyTokenRequest(token);
        if (response && response.status === 200) {
          setAuthStatus({ 
            isAuthenticated: true, 
            loading: false 
          });
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        removeToken();
        setAuthStatus({ isAuthenticated: false, loading: false });
      }
    };

    verifyToken();
  }, []);

  if (authStatus.loading) {
    return <div>Verificando autenticación...</div>;
  }

  if (!authStatus.isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace state={{ from: location }} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;