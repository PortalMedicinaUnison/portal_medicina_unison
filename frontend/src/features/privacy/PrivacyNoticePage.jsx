import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_HOME, ROUTES } from '../../config';
import { useUser } from '../../contexts/UserContext';
import PrivacyNoticeContent, { LAST_UPDATED } from './PrivacyNoticeContent';

// Página pública: se puede consultar sin iniciar sesión (enlace en el registro y en el inicio de sesión).
function PrivacyNoticePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useUser();
  const home = !isAuthenticated ? ROUTES.AUTH.LOGIN : (isAdmin ? ADMIN_HOME : ROUTES.HOME);

  const goBack = () => {
    // Si es la primera página de la app (p. ej. se abrió en otra pestaña) no hay a dónde volver.
    if (location.key !== 'default') navigate(-1);
    else navigate(home);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
      <article className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 sm:p-10">
        <header className="mb-8 space-y-1">
          <p className="text-xs uppercase tracking-wide text-gray-500">Portal de Internado y Servicio Social · Medicina Unison</p>
          <h1 className="text-2xl font-bold text-gray-900">Aviso de privacidad integral</h1>
          <p className="text-xs text-gray-500">Última actualización: {LAST_UPDATED}</p>
        </header>

        <PrivacyNoticeContent />

        <footer className="mt-10 flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={goBack}>Volver</button>
          <Link to={home} className="btn-primary">Ir al portal</Link>
        </footer>
      </article>
    </div>
  );
}

export default PrivacyNoticePage;
