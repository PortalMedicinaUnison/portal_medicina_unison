import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useRegister from '../hooks/useRegister';

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    secondLastName: '',
    academicId: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const { registerUser, error, success } = useRegister();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isRegistered = await registerUser(formData);
    if (isRegistered) {
      console.log('Registro exitoso');
      
      setFormData({
        firstName: '',
        lastName: '',
        secondLastName: '',
        academicId: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: ''
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {success && (
        <div className="alert-success-text">
          Alumno registrado exitosamente.
        </div>
      )}

      <div className="mb-4">
          <label className="form-label">Correo:</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input_full"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Confirmar correo:</label>
          <input
            name="confirmEmail"
            type="email"
            value={formData.confirmEmail}
            onChange={handleChange}
            required
            className="form-input_full"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Contraseña:</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input_full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="form-label">Confirmar contraseña:</label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input_full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
        <div className="mb-4">
          <label className="form-label">Nombre(s):</label>
          <input
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Apellido paterno:</label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Apellido materno:</label>
          <input
            name="secondLastName"
            type="text"
            value={formData.secondLastName || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Expediente:</label>
          <input
            name="academicId"
            type="text"
            value={formData.academicId}
            onChange={handleChange}
            required
            className="form-input"
            maxLength="9"
          />
        </div>
      </div>

      <div className="mb-6">
        {error && (
          <div className="alert-footer-text">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>

        <button
          type="submit"
          className="btn-primary_full"
        >
          Crear cuenta
        </button>
      
      <p className="login-footer-text">
        ¿Ya tienes cuenta?{' '}
        <Link to="/" className="form-link">
          Inicia sesión aquí
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
