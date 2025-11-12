import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import HomePage from '../user/features/announcements/pages/AnnouncementCardPage';

// Profile pages
import ProfileUpdatePage from '../features/profile/pages/ProfileUpdatePage';
import ProfilePage from '../features/profile/pages/ProfilePage';

// Reports pages
import ReportListPage from './features/reports/pages/ReportListPage';
import ReportFormPage from './features/reports/pages/ReportFormPage';

// Internship pages
import ApplicationRedirectPage from '../user/features/applications/pages/ApplicationRedirectPage';
import ApplicationUpdatePage from '../user/features/applications/pages/ApplicationUpdatePage';
import ApplicationDeclinedPage from '../user/features/applications/pages/ApplicationDeclinedPage';

import InternshipDetailPage from '../user/features/internships/pages/InternshipDetailPage';

// Survey pages
import SurveyPage from '../user/features/surveys/pages/SurveyCardPage';


function UserRoutes() {
  return (

    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/edit" element={<ProfileUpdatePage />} />
        
        {/* Reports routes */}
        <Route path="reports" element={<ReportListPage />} />
        <Route path="reports/create" element={<ReportFormPage />} />

        {/* Applications routes */}
        <Route path="my-internship/application" element={<ApplicationUpdatePage />} />
        <Route path="my-internship/declined" element={<ApplicationDeclinedPage />} />

        {/* Internships routes */}
        <Route path="my-internship" element={<InternshipDetailPage />} />
        <Route path="my-internship/redirect" element={<ApplicationRedirectPage />} />

        {/* Surveys routes */}
        <Route path="surveys" element={<SurveyPage />} />
      </Route>
    </Routes>
  );
}

export default UserRoutes;
