import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    patLastName: '',
    matLastName: '',
    fileNumber: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("name:" + name + ", value: " + value);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [error, setError] = useState('');
  
  // Estado para controlar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const minLength = /^.{8,}$/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (!minLength.test(password)) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!hasUppercase.test(password)) {
      return 'La contraseña debe incluir al menos una letra mayúscula.';
    }
    if (!hasLowercase.test(password)) {
      return 'La contraseña debe incluir al menos una letra minúscula.';
    }
    if (!hasNumber.test(password)) {
      return 'La contraseña debe incluir al menos un número.';
    }
    if (!hasSpecialChar.test(password)) {
      return 'La contraseña debe incluir al menos un símbolo especial.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de formato del expediente
    if (!/^\d{9}$/.test(formData.fileNumber)) {
      setError('El expediente debe ser un número de exactamente 9 dígitos.');
      return;
    }
    // Validación de coincidencia de correos
    if (formData.email !== formData.confirmEmail) {
      setError('Los correos electrónicos no coinciden.');
      return;
    }
    // Validación de coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    // Validación de la contraseña
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Limpiar el error si todo es correcto
    setError('');

    // Aquí puedes añadir la lógica para manejar el registro de los usuarios
    const user = {
      name: formData.name,
      pat_last_name: formData.patLastName,
      mat_last_name: formData.matLastName,
      file_number: formData.fileNumber,
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await api.post('/users/', user);
      document.getElementById("registro_exitoso").style.display = "block";
      const elements = document.getElementsByTagName("input");
      for (const element of elements) {
        element.value = "";
      }
      console.log(response);
    } catch (error) {
      console.error("Register failed", error);
    }
  };
  
  // Asegurarse de que solo se ingresen números
  const handleExpedienteChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setExpediente(value);
    }
  };

  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

      {/* Mensaje de registro exitoso */}
      <div id="registro_exitoso" className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center' style={{display: 'none'}}>
        <span className="block sm:inline"><p>Alumno registrado exitosamente.</p></span>
      </div>
      
      {/* Mensaje de error más visible */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Formulario en dos columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nombre(s):</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Apellido Paterno:</label>
          <input
            name="patLastName"
            type="text"
            value={formData.patLastName}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Apellido Materno:</label>
          <input
            name="matLastName"
            type="text"
            value={formData.matLastName}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Expediente:</label>
          <input
            name="fileNumber"
            type="text"
            value={formData.fileNumber}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            maxLength="9"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Correo:</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Confirmar Correo:</label>
          <input
            name="confirmEmail"
            type="email"
            value={formData.confirmEmail}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Campo de contraseña con botón para mostrar/ocultar */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

        {/* Campo de confirmar contraseña con botón para mostrar/ocultar */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Confirmar Contraseña:</label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Crear cuenta
        </button>
      </div>
      <p className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes cuenta?{' '}
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          Inicia sesión aquí
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
