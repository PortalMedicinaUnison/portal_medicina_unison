import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config';
import useAuth from '../hooks/useAuth';
import { isValidEmail } from '../../../utils/validations';
import '../../../styles.css';


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedEmail = email.trim();
    console.log(cleanedEmail);
    if (!isValidEmail(cleanedEmail)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    const credentials = { email: cleanedEmail, password };
    await login(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="form-label">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input_full"
        />
      </div>

      <div className="mb-1">
        <label className="form-label">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input_full"
          />
      </div>

      <div className="mb-6">
        {error && (
          <p className="alert-footer-text">
              {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary_full"
      >
        Iniciar Sesión
      </button>

      <p className="login-footer-text">
        ¿No tienes cuenta?{' '}
        <Link to={ROUTES.AUTH.SIGNUP} className="form-link">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
