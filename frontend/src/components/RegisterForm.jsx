import React, { useState } from 'react';
import api from '../api';

function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [motherLastName, setMotherLastName] = useState('');
  const [expediente, setExpediente] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    pat_last_name: '',
    mat_last_name: '',
    file_number: '',
    email: '',
    password: ''
  });

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
    if (!/^\d{9}$/.test(expediente)) {
      setError('El expediente debe ser un número de exactamente 9 dígitos.');
      return;
    }

    // Validación de coincidencia de correos
    if (email !== confirmEmail) {
      setError('Los correos electrónicos no coinciden.');
      return;
    }

    // Validación de coincidencia de contraseñas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Validación de la contraseña
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Limpiar el error si todo es correcto
    setError('');

    // Aquí puedes añadir la lógica para manejar el registro de los usuarios
    setFormData({
      ...formData,
      name: firstName,
      pat_last_name: lastName,
      mat_last_name: motherLastName,
      file_number: expediente,
      email: email,
      password: password
    });
    
    try {
      const response = await api.post('/students/', formData);
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
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Apellido Paterno:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Apellido Materno:</label>
          <input
            type="text"
            value={motherLastName}
            onChange={(e) => setMotherLastName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Expediente:</label>
          <input
            type="text"
            value={expediente}
            onChange={handleExpedienteChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            maxLength="9"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Correo:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Confirmar Correo:</label>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Campo de contraseña con botón para mostrar/ocultar */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
    </form>
  );
}

export default RegisterForm;
