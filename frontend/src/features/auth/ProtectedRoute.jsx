import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config';
import { useUser } from '../../contexts/UserContext';
import LoadingSpinner from '../../utils/ui/LoadingSpinner';

const ProtectedRoute = () => {
  const { isAuthenticated, loading: fetching } = useUser();
  const location = useLocation();

  if (fetching) {
    return (
      <div className="min-h-screen w-full grid place-items-center">
        <LoadingSpinner />;
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;