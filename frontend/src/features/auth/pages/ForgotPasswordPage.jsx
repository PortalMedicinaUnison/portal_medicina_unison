import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config';
import AuthCard from '../components/AuthCard';
import { useForgotPassword } from '../hooks/usePasswordReset';
import LoadingSpinner from '../../../utils/ui/LoadingSpinner';
import { validateEmail } from '../../../utils/validations';


// Siempre disponible: la coordinación genera el enlace desde el detalle del usuario.
function CoordinatorHelp() {
  return (
    <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
      <p className="font-semibold text-gray-800">Pídelo a la coordinación</p>
      <p className="mt-1">
        Escribe o acude a la coordinación del internado y servicio social con tu número de expediente.
        Te harán llegar un enlace de un solo uso para que crees una contraseña nueva.
      </p>
    </div>
  );
}

function ForgotPasswordPage() {
  const { options, loadingOptions, requestReset, loading, error, success, reset } = useForgotPassword();
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (validationError) setValidationError('');
    if (error) reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleaned = email.trim();
    const check = validateEmail(cleaned);
    if (!check.valid) {
      setValidationError(check.error);
      return;
    }
    await requestReset(cleaned);
  };

  if (loadingOptions) {
    return (
      <AuthCard title="Recuperar contraseña">
        <LoadingSpinner />
      </AuthCard>
    );
  }

  const emailEnabled = Boolean(options?.email_enabled);

  return (
    <AuthCard
      title="Recuperar contraseña"
      subtitle={emailEnabled ? 'Te enviaremos un enlace para crear una contraseña nueva.' : null}
    >
      {emailEnabled && success && (
        <div className="alert-success mb-6" role="status">
          Si el correo está registrado, recibirás un enlace en unos minutos
          {options.email_link_minutes ? ` (vence en ${options.email_link_minutes} minutos)` : ''}.
          Revisa también la carpeta de correo no deseado.
        </div>
      )}

      {emailEnabled && !success && (
        <form onSubmit={handleSubmit} className="mb-6">
          <label className="form-label" htmlFor="forgot-email">Correo de tu cuenta:</label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            className="form-input_full"
            placeholder="Correo"
            autoComplete="email"
            disabled={loading}
            required
          />
          {(validationError || error) && (
            <div className="alert-error mt-4">{validationError || error}</div>
          )}
          <button type="submit" className="btn-primary_full mt-6" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
      )}

      {emailEnabled && <p className="mb-3 text-center text-xs text-gray-500">¿No tienes acceso a ese correo?</p>}
      <CoordinatorHelp />

      <p className="mt-6 text-center text-xs text-gray-500">
        <Link to={ROUTES.AUTH.LOGIN} className="text-indigo-500 hover:text-indigo-600">Volver a iniciar sesión</Link>
      </p>
    </AuthCard>
  );
}

export default ForgotPasswordPage;
