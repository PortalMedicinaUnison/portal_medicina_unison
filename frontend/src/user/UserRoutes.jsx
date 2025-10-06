import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES  } from '../config';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import HomePage from '../pages/HomePage';

// Profile pages
import ProfileUpdatePage from '../features/profile/pages/ProfileUpdatePage';
import ProfilePage from '../features/profile/pages/ProfilePage';

// Reports pages
import ReportsListPage from './features/reports/pages/ReportsListPage';
import ReportFormPage from './features/reports/pages/ReportFormPage';

// Applications pages
import ApplicationUpdatePage from '../user/features/applications/pages/ApplicationUpdatePage';
import ApplicationDeclinedPage from '../user/features/applications/pages/ApplicationDeclinedPage';

// Internships pages
import InternshipDetailPage from '../user/features/internships/pages/InternshipDetailPage';

function UserRoutes() {
  return (

    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/edit" element={<ProfileUpdatePage />} />
        
        {/* Reports routes */}
        <Route path="reports" element={<ReportsListPage />} />
        <Route path="reports/create" element={<ReportFormPage />} />

        {/* Internships routes */}
        <Route path="application" element={<ApplicationUpdatePage />} />
        <Route path="my-internship/declined" element={<ApplicationDeclinedPage />} />
        <Route path="my-internship" element={<InternshipDetailPage />} />
      </Route>
    </Routes>
  );
}

export default UserRoutes;
