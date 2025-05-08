import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '../../utils/auth';
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
        setAuthStatus({ isAuthenticated: false, loading: false });
        console.error("No token found");
        return;
      }

      try {
        const response = await verifyTokenRequest(token);
        setAuthStatus({ 
          isAuthenticated: response.status === 200, 
          loading: false 
        });
      } catch (error) {
        console.error("Token verification failed:", error);
        removeToken();
        setAuthStatus({ isAuthenticated: false, loading: false });
      }
    };

    verifyToken();
  }, []);

  if (authStatus.loading) {
    return <div>Loading...</div>;
  }

  if (!authStatus.isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;