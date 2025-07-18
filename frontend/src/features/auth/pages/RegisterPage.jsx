import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
        
  <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className=" w-full">
        <div className="flex px-4 py-8">
          <a
            href="#"
            className="border-b-4 border-gray-700 pb-2 text-2xl font-bold text-black"
          >
            Portal internado-servicio social
          </a>
        </div>
      </nav>

    <div className="flex flex-1">      
      <div className="hidden md:flex w-1/2 relative bg-[url('../../../../assets/base.svg')] bg-center bg-contain">
        <img 
          className="absolute top-20 left-1/4 w-3/4 h-3/4 object-contain" 
          src="../../../../assets/started.svg" 
        />
      </div>    

    {/* Formulario */}
      <div className="flex min-h-screen flex-1 flex-col relative lg:px-8">
        <div className='absolute top-5 left-1/4 w-3/4 object-contain px-10 py-10 mx-auto sm:mx-auto sm:w-full sm:max-w-sm rounded-[3vw] border bg-white'>
            <h2 className="login-title">
              Registrarse
            </h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <RegisterForm />
            </div>
        </div>
      </div>
    </div>

        <footer className="bg-[#24398A] w-full py-4 mt-auto">
        <div className="text-center text-xs text-white">
          © 2025 Unison. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default RegisterPage;
