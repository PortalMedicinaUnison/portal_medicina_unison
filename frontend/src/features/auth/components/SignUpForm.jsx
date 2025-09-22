import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../config';
import useSignUp from '../hooks/useSignUp';
import { cleanFormData } from "../../../utils/utils";


const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  secondLastName: '',
  academicId: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: '',
};

function SignUpForm() {
  const navigate = useNavigate();
  const { signUpUser, loading: saving, success: saved, error: saveError, reset  } = useSignUp();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ---------------------- HANDLERS ----------------------

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (validationError) return setValidationError('');
    if (saveError) return reset();
            
  }, [validationError, saveError, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = cleanFormData(formData);
    
    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!data.firstName) errors.push('El nombre es requerido.');
    if (!data.lastName) errors.push('El apellido paterno es requerido.');
    if (!data.academicId) errors.push('El número de expediente es requerido.');
    if (!data.email) errors.push('El correo es requerido.');
    if (data.email !== data.confirmEmail) errors.push('Los correos no coinciden.');
    if (!data.password) errors.push('La contraseña es requerida.');
    if (data.password !== data.confirmPassword) errors.push('Las contraseñas no coinciden.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    await signUpUser(data);
  };

// ---------------------- EFFECTS ----------------------

  useEffect(() => {
    if (saved) {
      setFormData(INITIAL_FORM);
      navigate(ROUTES.AUTH.LOGIN);
    }
  }, [saved, navigate]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
          <label className="form-label">Correo:</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input_full"
            placeholder="Correo"
            disabled={saving}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Confirmar correo:</label>
          <input
            name="confirmEmail"
            type="email"
            value={formData.confirmEmail}
            onChange={handleChange}
            className="form-input_full"
            placeholder="Correo"
            disabled={saving}
            required
          />
        </div>

        <div className="mb-4">
          <div className="relative">
            <label className="form-label">Contraseña:</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="form-input_full"
              placeholder="Contraseña"
              disabled={saving}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="form-inlabel_right"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <label className="form-label">Confirmar contraseña:</label>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input_full"
              placeholder="Contraseña"
              disabled={saving}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="form-inlabel_right"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <div className="mb-4">
          <label className="form-label">Nombre(s):</label>
          <input
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input_full"
            placeholder="Nombre(s)"
            disabled={saving}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Apellido paterno:</label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input_full"
            placeholder="Apellido paterno"
            disabled={saving}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Apellido materno:</label>
          <input
            name="secondLastName"
            type="text"
            value={formData.secondLastName || ''}
            onChange={handleChange}
            className="form-input_full"
            placeholder="Apellido materno (opcional)"
            disabled={saving}
            maxLength="50"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Expediente:</label>
          <input
            name="academicId"
            type="text"
            value={formData.academicId}
            onChange={handleChange}
            className="form-input_full"
            maxLength="9"
            placeholder="Número de expediente"
            disabled={saving}
            required
          />
        </div>
      </div>

      <div className="mb-6">
        {(validationError || saveError) && (
          <div className="alert-error">
            <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">
                {validationError || saveError}
              </span>
          </div>
        )}
      </div>
      
      <button
        type="submit"
        className="btn-primary_full"
      >
        {saving ? 'Registrando...' : 'Crear cuenta'}
      </button>
      
      <div className="mt-6">
        <p className="text-center text-xs text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to={ROUTES.AUTH.LOGIN} className="text-indigo-500 hover:text-indigo-500">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </form>
  );
}

export default SignUpForm;
