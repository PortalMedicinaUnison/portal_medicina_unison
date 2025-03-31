import React from 'react';
import api from '../../api';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const access_token = {
          token: sessionStorage.getItem("access_token")
        };

        console.log("access_token", access_token);
        console.log("antes de verificar token")
        const response = await api.post('/auth/verify-token/', access_token);
        console.log("despues de verificar token")
        console.log("response", response);
        
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
        console.log("ya autenticado")

      } catch (error) {
        console.log("Dentro del catch");
        setIsAuthenticated(false);
        setLoading(false);
        navigate('/'); 
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;

