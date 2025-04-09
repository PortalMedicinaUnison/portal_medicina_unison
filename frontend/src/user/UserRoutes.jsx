import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Ajusta los imports según la ubicación real de tus componentes/páginas
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import HomePage from '../pages/HomePage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import MedicalRecordPage from "./features/medical_record/pages/MedicalRecordPage";
import ApplicantInfoPage from '../features/profile/components/ApplicantInfoPage';

function UserRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Rutas protegidas (requieren autenticación) */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route path="/inicio" element={<HomePage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/historiaClinica" element={<MedicalRecordPage />} />
      <Route path="/applicants" element={<ApplicantInfoPage />} />
      <Route path="/applicants/:id" element={<ApplicantInfoPage />} />
    </Routes>
  );
}

export default UserRoutes;
