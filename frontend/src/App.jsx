import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import MedicalRecordPage from './pages/MedicalRecordPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import DocumentsPage from './pages/DocumentsPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/avisos" element={<AnnouncementsPage />} />
          <Route path="/historiaClinica" element={<MedicalRecordPage />} />
          <Route path="/reportes" element={<ReportsPage />} />
          <Route path="/documentos" element={<DocumentsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
