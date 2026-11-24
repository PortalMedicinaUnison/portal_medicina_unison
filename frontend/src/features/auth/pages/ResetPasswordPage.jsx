import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../../config';
import AuthCard from '../components/AuthCard';
import { useResetPassword } from '../hooks/usePasswordReset';
import LoadingSpinner from '../../../utils/ui/LoadingSpinner';
import { validatePassword } from '../../../utils/validations';

const INITIAL_FORM = { newPassword: '', confirmPassword: '' };

// Enlace de un solo uso: /reset-password?token=...
function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { tokenInfo, verifying, tokenError, confirmReset, loading, error, success, reset } = useResetPassword(token);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError('');
    if (error) reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Las contraseñas no se recortan: los espacios forman parte de ellas.
    const { newPassword, confirmPassword } = formData;
    const errors = [];
    const check = validatePassword(newPassword);
    if (!check.valid) errors.push(check.error);
    if (newPassword !== confirmPassword) errors.push('Las contraseñas no coinciden.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }
    await confirmReset(formData);
  };

  useEffect(() => {
    if (success) {
      navigate(ROUTES.AUTH.LOGIN, {
        replace: true,
        state: { notice: 'Tu contraseña se actualizó. Inicia sesión con tu contraseña nueva.' },
      });
    }
  }, [success, navigate]);

  if (verifying) {
    return (
      <AuthCard title="Restablecer contraseña">
        <LoadingSpinner />
      </AuthCard>
    );
  }

  if (tokenError) {
    return (
      <AuthCard title="Restablecer contraseña">
        <div className="alert-error">{tokenError}</div>
        <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="btn-primary_full mt-6 text-center">
          Pedir un enlace nuevo
        </Link>
        <p className="mt-6 text-center text-xs text-gray-500">
          <Link to={ROUTES.AUTH.LOGIN} className="text-indigo-500 hover:text-indigo-600">Volver a iniciar sesión</Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Crea una contraseña nueva"
      subtitle={tokenInfo?.email ? `Para la cuenta ${tokenInfo.email}` : null}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="form-label" htmlFor="reset-new-password">Contraseña nueva:</label>
          <input
            id="reset-new-password"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            className="form-input_full"
            autoComplete="new-password"
            disabled={loading}
            required
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="form-inlabel_right">
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <div>
          <label className="form-label" htmlFor="reset-confirm-password">Confirmar contraseña:</label>
          <input
            id="reset-confirm-password"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input_full"
            autoComplete="new-password"
            disabled={loading}
            required
          />
        </div>
        <p className="text-xs text-gray-500">Mínimo 8 caracteres, con al menos una mayúscula y un número.</p>

        {(validationError || error) && <div className="alert-error">{validationError || error}</div>}

        <button type="submit" className="btn-primary_full" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar contraseña'}
        </button>
        <p className="text-center text-xs text-gray-500">Al guardarla se cerrarán las sesiones abiertas de tu cuenta.</p>
      </form>
    </AuthCard>
  );
}

export default ResetPasswordPage;
