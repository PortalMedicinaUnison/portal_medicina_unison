import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ADMIN_HOME, ROUTES } from '../../config';
import { useUser } from '../../contexts/UserContext';
import LoadingSpinner from '../../utils/ui/LoadingSpinner';

/**
 * Protege rutas por sesión y rol.
 *  allow="any"     → cualquier usuario con sesión
 *  allow="student" → solo estudiantes (un administrador se manda a /admin)
 *  allow="admin"   → administradores y super administradores (un estudiante se manda al inicio)
 */
const ProtectedRoute = ({ allow = 'any' }) => {
  const { isAuthenticated, isAdmin, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full grid place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace state={{ from: location.pathname + location.search }} />;
  }

  if (allow === 'admin' && !isAdmin) return <Navigate to={ROUTES.HOME} replace />;
  if (allow === 'student' && isAdmin) return <Navigate to={ADMIN_HOME} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
