import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: email,
      password: password,
      role: "student"
    };

    try {
      const response = await api.post('/token/', formData);
      sessionStorage.setItem("access_token", response.data.access_token);
      navigate('/inicio');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Iniciar Sesión
        </button>
      </div>
      <p className="text-center text-sm text-gray-600 mt-4">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="text-blue-500 hover:text-blue-700">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
