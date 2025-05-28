import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-10">
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/6/68/Escudo_Unison.png"
                  alt="UNISON Logo" 
                  width="100" 
                  height="100"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Portal de Medicina</h1>
                <h2 className="text-2xl text-gray-700 font-semibold">Universidad de Sonora</h2>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Columna izquierda con el formulario */}
        <div className="flex flex-1 flex-col justify-center lg:w-1/2 lg:items-center order-2 lg:order-1">
          <div className='px-10 py-10 mx-auto sm:mx-auto w-[400px] max-w-sm rounded-xl border shadow-lg bg-white'>
            <h2 className="login-title">Registro de Usuario</h2>
            <p className="mb-4 text-gray-600 text-center">
              Crea tu cuenta para acceder al Portal de Medicina.
            </p>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <RegisterForm />
            </div>
          </div>
        </div>
        {/* Columna derecha con imagen de fondo */}
        <div className="hidden lg:block lg:w-1/2 relative order-1 lg:order-2">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ9CbmSEuvStekyitOWcnXkWZkQsZfO5kLVA&s')",
              opacity: 0.9
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-gray-900/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default function RegisterPageWithFooter() {
  return (
    <>
      <RegisterPage />
      <footer style={{ backgroundColor: '#faa61a', height: '80px', width: '100vw' }} className="w-screen">
        <div className="h-full flex items-center justify-center">
          <span className="text-white text-center text-sm font-medium">
            2023 Departamento de Ciencias de la Salud | Facultad Interdisciplinaria de Ciencias Biológicas y de Salud | Universidad de Sonora
          </span>
        </div>
      </footer>
    </>
  );
}
