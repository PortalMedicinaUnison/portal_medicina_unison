import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
        
    <div className="flex flex-wrap">
      {/* Columna izquierda */}
      <div className="flex w-full flex-col md:w-1/2">
        <div className="flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12">
          <a
            href="#"
            className="border-b-4 border-gray-700 pb-2 text-2xl font-bold text-gray-900"
          >
            Unison.
          </a>
        </div>
    
    <div className="flex min-h-screen flex-1 flex-col justify-center lg:px-8">
      <div className="px-10 py-10 mx-auto sm:w-full sm:max-w-md rounded-[3vw] border">
        <h2 className="login-title">Registrarse</h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <RegisterForm />
        </div> 
      </div>
    </div>
      </div> {/* ← Aquí cerramos la columna izquierda */}


    <div className="pointer-events-none relative hidden h-screen select-none bg-black md:block md:w-1/2">
      <div className="absolute bottom-0 z-10 px-8 text-white opacity-100">
        <p className="mb-8 text-3xl font-semibold leading-10">We work 10x faster than our compeititors and stay consistant. While they're bogged won with techincal debt, we're realeasing new features.</p>
        <p className="mb-4 text-3xl font-semibold">John Elmond</p>
        <p className="">Founder, Emogue</p>
        <p className="mb-7 text-sm opacity-70">Web Design Agency</p>
      </div>
      <img className="-z-1 absolute top-0 h-full w-full object-cover opacity-90" src="https://images.unsplash.com/photo-1565301660306-29e08751cc53?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" />
    </div>
</div>
  );
}

export default RegisterPage;
