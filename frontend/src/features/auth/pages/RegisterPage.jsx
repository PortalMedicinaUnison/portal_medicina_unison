import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Registro</h1>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
