import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Ajusta los imports según la ubicación real de tus componentes/páginas
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import HomePage from '../pages/HomePage';
import UserFormPage from '../features/profile/pages/UserFormPage';
import UserInfoPage from '../features/profile/pages/UserInfoPage';

function UserRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />

      {/* Rutas protegidas (requieren autenticación) */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<UserInfoPage />} />
      <Route path="/edit-profile" element={<UserFormPage />} />
    </Routes>
  );
}

export default UserRoutes;
