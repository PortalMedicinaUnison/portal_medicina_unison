import React from 'react';
import PerfilCuentaForm from '../components/PerfilCuentaForm';

function PerfilCuentaPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 shadow-md rounded flex">
        {/* Sección del perfil de usuario */}
        <div className="w-1/4 text-center border-r">
          <img
            src="https://via.placeholder.com/100"
            alt="Usuario"
            className="rounded-full mx-auto mb-4"
          />
          <h2 className="text-lg font-bold mb-2">Antonio Pérez</h2>
          <a href="/perfil" className="text-blue-500">Ver el perfil</a>

          <div className="mt-6 space-y-4">
            <button className="block w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <i className="fas fa-user mr-2"></i>Cuenta
            </button>
            <button className="block w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <i className="fas fa-key mr-2"></i>Cambiar la contraseña
            </button>
            <button className="block w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <i className="fas fa-lock mr-2"></i>Privacidad
            </button>
            <button className="block w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-red-500">
              <i className="fas fa-trash mr-2"></i>Borrar la cuenta
            </button>
          </div>
        </div>

        {/* Sección de edición de cuenta (importada del componente separado) */}
        <div className="w-3/4 px-8">
          <h2 className="text-2xl font-bold mb-6">Cuenta</h2>
          <PerfilCuentaForm />
        </div>
      </div>
    </div>
  );
}

export default PerfilCuentaPage;
