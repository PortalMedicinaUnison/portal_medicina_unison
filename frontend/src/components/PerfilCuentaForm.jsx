import React, { useState } from 'react';

function PerfilCuentaForm() {
  // Estado para almacenar los datos del formulario
  const [nombre, setNombre] = useState('Antonio');
  const [apellidoPaterno, setApellidoPaterno] = useState('Pérez');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [email, setEmail] = useState('antonioperez@gmail.com');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar los datos del usuario
    console.log({
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Nombre</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Apellido Paterno</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={apellidoPaterno}
          onChange={(e) => setApellidoPaterno(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Apellido Materno</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={apellidoMaterno}
          onChange={(e) => setApellidoMaterno(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Dirección de correo electrónico</label>
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Actualizar la cuenta
      </button>
    </form>
  );
}

export default PerfilCuentaForm;
