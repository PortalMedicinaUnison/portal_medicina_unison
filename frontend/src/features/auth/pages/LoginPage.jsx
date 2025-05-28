import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-10">
              <div className="flex items-center">
                <img 
                  //src="https://cdn-s3.sistemas.unison.mx/sistemas/inicio/logo.png" 
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
        {/* Columna izquierda con imagen de fondo */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ9CbmSEuvStekyitOWcnXkWZkQsZfO5kLVA&s')",
              opacity: 0.9
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent" />
        </div>
        {/* Columna derecha con el formulario */}
        <div className="flex flex-1 flex-col justify-center lg:w-1/2 lg:items-center">
          <div className='px-10 py-10 mx-auto sm:mx-auto w-[400px] max-w-sm rounded-xl border shadow-lg bg-white'>
            <h2 className="login-title">Iniciar Sesión</h2>
            <p className="mb-4 text-gray-600 text-center">
              Bienvenido al Portal de Medicina. Ingresa tus credenciales para continuar.
            </p>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Footer amarillo mostaza fuera del componente principal para que quede al final de la página
export default function LoginPageWithFooter() {
  return (
    <>
      <LoginPage />
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
