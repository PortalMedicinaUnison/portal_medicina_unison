import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center lg:px-8">
      <div className="px-10 py-10 mx-auto sm:w-full sm:max-w-md rounded-[3vw] border">
        <h2 className="login-title">Portal de Servicio Social</h2>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <RegisterForm />
        </div> 
      </div>
    </div>
  );
}

export default RegisterPage;
