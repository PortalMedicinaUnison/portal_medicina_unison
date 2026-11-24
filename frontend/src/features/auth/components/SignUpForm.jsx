import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../config';
import useSignUp from '../hooks/useSignUp';
import { cleanFormData } from "../../../utils/utils";
import { validateAcademicId, validateEmail, validatePassword } from "../../../utils/validations";


const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  secondLastName: '',
  academicId: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: '',
  acceptPrivacyNotice: false,
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
    const cleanedData = cleanFormData(formData);
    
    // ---------------------- VALIDATIONS ----------------------
    const errors = [];
    if (!cleanedData.firstName) errors.push('El nombre es requerido.');
    if (!cleanedData.lastName) errors.push('El apellido paterno es requerido.');
    if (!cleanedData.academicId) errors.push('El número de expediente es requerido.');
    else if (!validateAcademicId(cleanedData.academicId).valid) errors.push(validateAcademicId(cleanedData.academicId).error);
    if (!cleanedData.email) errors.push('El correo es requerido.');
    else if (!validateEmail(cleanedData.email).valid) errors.push(validateEmail(cleanedData.email).error);
    if (cleanedData.email !== cleanedData.confirmEmail) errors.push('Los correos no coinciden.');
    if (!cleanedData.password) errors.push('La contraseña es requerida.');
    else if (!validatePassword(cleanedData.password).valid) errors.push(validatePassword(cleanedData.password).error);
    if (cleanedData.password !== cleanedData.confirmPassword) errors.push('Las contraseñas no coinciden.');
    if (!formData.acceptPrivacyNotice) errors.push('Debes aceptar el aviso de privacidad.');
    if (errors.length > 0) {
      setValidationError(errors.join(' | '));
      return;
    }

    // El rol lo decide el backend: el registro siempre crea una cuenta de estudiante.
    const payload = {
      first_name: cleanedData.firstName,
      last_name: cleanedData.lastName,
      second_last_name: cleanedData.secondLastName || null,
      academic_id: cleanedData.academicId,
      email: cleanedData.email,
      password: cleanedData.password,
      accept_privacy_notice: formData.acceptPrivacyNotice,
    };

    await signUpUser(payload);
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
          <label className="form-label" htmlFor="signup-email">Correo:</label>
          <input
            id="signup-email"
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
          <label className="form-label" htmlFor="signup-confirm-email">Confirmar correo:</label>
          <input
            id="signup-confirm-email"
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
            <label className="form-label" htmlFor="signup-password">Contraseña:</label>
            <input
              id="signup-password"
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
            <label className="form-label" htmlFor="signup-confirm-password">Confirmar contraseña:</label>
            <input
              id="signup-confirm-password"
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
          <label className="form-label" htmlFor="signup-first-name">Nombre(s):</label>
          <input
            id="signup-first-name"
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
          <label className="form-label" htmlFor="signup-last-name">Apellido paterno:</label>
          <input
            id="signup-last-name"
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
          <label className="form-label" htmlFor="signup-second-last-name">Apellido materno:</label>
          <input
            id="signup-second-last-name"
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
          <label className="form-label" htmlFor="signup-academic-id">Expediente:</label>
          <input
            id="signup-academic-id"
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

      <div className="mb-6 flex items-start gap-3">
        <input
          id="signup-privacy"
          name="acceptPrivacyNotice"
          type="checkbox"
          checked={formData.acceptPrivacyNotice}
          onChange={handleChange}
          className="mt-1 size-4 shrink-0 rounded border-gray-300"
          disabled={saving}
          required
        />
        <label htmlFor="signup-privacy" className="text-xs text-gray-700">
          He leído y acepto el{' '}
          <Link
            to={ROUTES.PRIVACY_NOTICE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline underline-offset-2"
          >
            aviso de privacidad
          </Link>
          , incluido el tratamiento de los datos sensibles de los documentos y reportes que suba al portal.
        </label>
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
