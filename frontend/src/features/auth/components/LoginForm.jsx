import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../config';
import useAuth from '../hooks/useAuth';
import { cleanFormData } from "../../../utils/utils";


const INITIAL_FORM = {
  email: '',
  password: '',
};

function LoginForm() {
  const navigate = useNavigate();
  const { login, loading: authenticating, error: authError, isAuthenticated, reset } = useAuth();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');
  
// ---------------------- HANDLERS ----------------------
 
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (validationError) return setValidationError('');

  }, [validationError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedData = cleanFormData(formData);
    
    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.email) errors.push('El correo es requerido.');
    if (!cleanedData.password) errors.push('La contraseña es requerida.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    const payload = {
      email: cleanedData.email,
      password: cleanedData.password,
    };

    await login(payload);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.HOME);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

// ---------------------- RENDER ----------------------
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="form-label">Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input_full"
          placeholder="Correo"
          // disabled={saving}
          required
        />
      </div>

      <div className="mb-1">
        <label className="form-label">Contraseña:</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input_full"
            placeholder="Contraseña"
            // disabled={saving}
            required
          />
      </div>

      <div className="mb-6">
        {(validationError || authError) && (
          <div className="alert-error">
            <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">
                {validationError || authError}
              </span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary_full"
      >
        {authenticating ? 'Iniciando sesión' : 'Iniciar sesión'}
      </button>

      <div className="mt-6">
        <p className="text-center text-xs text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to={ROUTES.AUTH.SIGNUP} className="text-indigo-500 hover:text-indigo-500">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
