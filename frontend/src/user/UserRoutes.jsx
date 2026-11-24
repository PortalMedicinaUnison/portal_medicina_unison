import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import LoginPage from '../features/auth/pages/LoginPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import PrivacyNoticePage from '../features/privacy/PrivacyNoticePage';
import HomePage from '../user/features/announcements/pages/AnnouncementCardPage';
import NotFoundPage from '../pages/NotFoundPage';

// Profile pages
import ProfileUpdatePage from '../features/profile/pages/ProfileUpdatePage';
import ProfilePage from '../features/profile/pages/ProfilePage';

// Reports pages
import ReportListPage from './features/reports/pages/ReportListPage';
import ReportFormPage from './features/reports/pages/ReportFormPage';
import ReportDetailPage from './features/reports/pages/ReportDetailPage';
import ReportUpdatePage from './features/reports/pages/ReportUpdatePage';

// Internship pages
import ApplicationRedirectPage from '../user/features/applications/pages/ApplicationRedirectPage';
import ApplicationUpdatePage from '../user/features/applications/pages/ApplicationUpdatePage';
import ApplicationDeclinedPage from '../user/features/applications/pages/ApplicationDeclinedPage';

import InternshipDetailPage from '../user/features/internships/pages/InternshipDetailPage';

// Social service pages
import SocialServiceApplicationRedirectPage from './features/social-service/pages/SocialServiceApplicationRedirectPage';
import SocialServiceApplicationUpdatePage from './features/social-service/pages/SocialServiceApplicationUpdatePage';
import SocialServiceApplicationDeclinedPage from './features/social-service/pages/SocialServiceApplicationDeclinedPage';
import SocialServiceDetailPage from './features/social-service/pages/SocialServiceDetailPage';

// Survey pages
import SurveyPage from '../user/features/surveys/pages/SurveyCardPage';


function UserRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="privacy" element={<PrivacyNoticePage />} />

      {/* Perfil: cualquier usuario con sesión (también administradores) */}
      <Route element={<ProtectedRoute allow="any" />}>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/edit" element={<ProfileUpdatePage />} />
      </Route>

      {/* Área del estudiante */}
      <Route element={<ProtectedRoute allow="student" />}>
        <Route index element={<HomePage />} />

        {/* Reports routes */}
        <Route path="reports" element={<ReportListPage />} />
        <Route path="reports/create" element={<ReportFormPage />} />
        <Route path="reports/:reportId" element={<ReportDetailPage />} />
        <Route path="reports/:reportId/edit" element={<ReportUpdatePage />} />

        {/* Applications routes */}
        <Route path="my-internship/application" element={<ApplicationUpdatePage />} />
        <Route path="my-internship/declined" element={<ApplicationDeclinedPage />} />

        {/* Internships routes */}
        <Route path="my-internship" element={<InternshipDetailPage />} />
        <Route path="my-internship/redirect" element={<ApplicationRedirectPage />} />

        {/* Social service routes (mismo flujo que el internado) */}
        <Route path="my-social-service" element={<SocialServiceDetailPage />} />
        <Route path="my-social-service/redirect" element={<SocialServiceApplicationRedirectPage />} />
        <Route path="my-social-service/application" element={<SocialServiceApplicationUpdatePage />} />
        <Route path="my-social-service/declined" element={<SocialServiceApplicationDeclinedPage />} />

        {/* Surveys routes */}
        <Route path="surveys" element={<SurveyPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default UserRoutes;
