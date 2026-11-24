import { Link } from 'react-router-dom';
import { ADMIN_HOME, ROUTES } from '../config';
import { useUser } from '../contexts/UserContext';

function NotFoundPage() {
  const { isAuthenticated, isAdmin } = useUser();
  const home = !isAuthenticated ? ROUTES.AUTH.LOGIN : (isAdmin ? ADMIN_HOME : ROUTES.HOME);

  return (
    <div className="min-h-screen w-full grid place-items-center p-6">
      <div className="text-center max-w-md">
        <p className="text-5xl font-bold text-gray-300">404</p>
        <h1 className="mt-4 text-xl font-semibold text-gray-800">Página no encontrada</h1>
        <p className="mt-2 text-gray-600">La dirección que buscas no existe o fue movida.</p>
        <Link to={home} className="btn-primary inline-block mt-6">Ir al inicio</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
