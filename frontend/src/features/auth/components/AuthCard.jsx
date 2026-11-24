import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config';

// Marco común de las pantallas sin sesión (inicio de sesión, registro, recuperar contraseña).
function AuthCard({ title, subtitle, wide = false, children }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-4 py-10 lg:px-8">
      <div className={`px-6 sm:px-10 py-10 mx-auto w-full ${wide ? 'sm:max-w-md' : 'sm:max-w-sm'} rounded-[3vw] border`}>
        <h1 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Portal de Internado y Servicio Social
        </h1>
        <p className="mt-1 text-center text-xs text-gray-500">Licenciatura en Medicina · Universidad de Sonora</p>
        {title && <h2 className="mt-8 text-center text-lg font-semibold text-gray-800">{title}</h2>}
        {subtitle && <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>}
        <div className="mt-8">
          {children}
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-gray-500">
        <Link to={ROUTES.PRIVACY_NOTICE} className="hover:text-indigo-600 underline underline-offset-2">
          Aviso de privacidad
        </Link>
      </p>
    </div>
  );
}

export default AuthCard;
