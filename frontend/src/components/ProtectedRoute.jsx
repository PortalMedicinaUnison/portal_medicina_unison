import React from 'react';
import api from '../api';
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

        const response = await api.post('/check_auth/', access_token);
        
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
        console.log(response)

      } catch (error) {
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

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;

