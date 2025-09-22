import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center lg:px-8">
      <div className='px-10 py-10 mx-auto sm:mx-auto sm:w-full sm:max-w-sm rounded-[3vw] border'>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Portal de Servicio Social
          </h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <LoginForm />
          </div>
      </div>
    </div>
  );
}

export default LoginPage;
