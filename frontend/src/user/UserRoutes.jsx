import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Ajusta los imports según la ubicación real de tus componentes/páginas
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import HomePage from '../pages/HomePage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import MedicalRecordPage from "./features/medical_record/pages/MedicalRecordPage";


function UserRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Rutas protegidas (requieren autenticación) */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route path="/inicio" element={<HomePage />} />
S      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/historiaClinica" element={<MedicalRecordPage />} />
    </Routes>
  );
}

export default UserRoutes;
