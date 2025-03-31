import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mx-auto sm:w-full sm:max-w-md">
        <h2 className="login-title">Portal de Servicio Social</h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <RegisterForm />
        </div> 
      </div>
    </div>
  );
}

export default RegisterPage;
