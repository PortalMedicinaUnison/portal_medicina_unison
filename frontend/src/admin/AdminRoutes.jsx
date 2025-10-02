import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config.js';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import ApplicationDetailPage from '../admin/features/applications/pages/ApplicationDetailPage.jsx';
import ApplicationListPage from '../admin/features/applications/pages/ApplicationListPage.jsx';

import UserListPage from '../admin/features/users/pages/UserListPage.jsx';
import UserInfoAdminPage from './features/users/pages/UserDetailAdmin.jsx';

import PromotionListPage from '../admin/features/promotions/pages/PromotionsListPage.jsx';
import PromotionFormPage from '../admin/features/promotions/pages/PromotionFormPage.jsx';
import PromotionDetailPage from '../admin/features/promotions/pages/PromotionDetailPage.jsx';
import PromotionUpdatePage from '../admin/features/promotions/pages/PromotionUpdatePage.jsx';

import SiteListPage from '../admin/features/sites/pages/SiteListPage.jsx';
import SiteFormPage from '../admin/features/sites/pages/SiteFormPage.jsx';
import SiteDetailPage from '../admin/features/sites/pages/SiteDetailPage.jsx';
import SiteUpdatePage from '../admin/features/sites/pages/SiteUpdatePage.jsx';

import InstitutionListPage from '../admin/features/institutions/pages/InstitutionListPage.jsx';
import InstitutionFormPage from '../admin/features/institutions/pages/InstitutionFormPage.jsx';
import InstitutionDetailPage from '../admin/features/institutions/pages/InstitutionDetailPage.jsx';
import InstitutionUpdatePage from '../admin/features/institutions/pages/InstitutionUpdatePage.jsx';

import AnnouncementListPage from '../admin/features/announcements/pages/AnnouncementListPage.jsx';
import AnnouncementFormPage from '../admin/features/announcements/pages/AnnouncementFormPage.jsx';
import AnnouncementDetailPage from '../admin/features/announcements/pages/AnnouncementDetailPage.jsx';
import AnnouncementUpdatePage from '../admin/features/announcements/pages/AnnouncementUpdatePage.jsx';

import SurveysListPage from '../admin/features/surveys/pages/SurveysListPage.jsx';
import SurveyFormPage from '../admin/features/surveys/pages/SurveysFormPage.jsx';
import SurveyInfoPage from '../admin/features/surveys/pages/SurveyInfoPage.jsx';
// import SurveyUpdatePage from '../admin/features/surveys/pages/SurveyUpdatePage.jsx';

import EnrollmentFormPage from '../admin/features/users/enrollments/pages/EnrollmentFormPage.jsx';
import EnrollmentsListPage from '../admin/features/users/enrollments/pages/EnrollmentsListPage.jsx';

import ReportsListPage from '../admin/features/reports/pages/ReportsListPage.jsx';
import ReportInfoPage from '../admin/features/reports/pages/ReportInfoPage.jsx';

const toRel = (absPath) => absPath.replace(/^\//, '');

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {/* Applications */}
        <Route path="applications" element={<ApplicationListPage />} />
        <Route path="applications/:applicationId" element={<ApplicationDetailPage />} />

        {/* Users */}
        <Route path="users" element={<UserListPage />} />
        <Route path="users/academicId/:academicId" element={<UserInfoAdminPage />} />

        {/* Promotions */}
        <Route path="promotions" element={<PromotionListPage />} />
        <Route path="promotions/create" element={<PromotionFormPage />} />
        <Route path="promotions/:promotionId" element={<PromotionDetailPage />} />
        <Route path="promotions/:promotionId/edit" element={<PromotionUpdatePage />} />

        {/* Sites */}
        <Route path="sites" element={<SiteListPage />} />
        <Route path="sites/create" element={<SiteFormPage />} />
        <Route path="sites/:siteId" element={<SiteDetailPage />} />
        <Route path="sites/:siteId/edit" element={<SiteUpdatePage />} />

        {/* Institutions */}
        <Route path="institutions" element={<InstitutionListPage />} />
        <Route path="institutions/create" element={<InstitutionFormPage />} />
        <Route path="institutions/:institutionId" element={<InstitutionDetailPage />} />
        <Route path="institutions/:institutionId/edit" element={<InstitutionUpdatePage />} />

        {/* Announcements */}
        <Route path="announcements" element={<AnnouncementListPage />} />
        <Route path="announcements/create" element={<AnnouncementFormPage />} />
        <Route path="announcements/:announcementId" element={<AnnouncementDetailPage />} />
        <Route path="announcements/:announcementId/edit" element={<AnnouncementUpdatePage />} />

        {/* Surveys */}
        <Route path="surveys" element={<SurveysListPage />} />
        <Route path="surveys/create" element={<SurveyFormPage />} />
        <Route path="surveys/:surveyId" element={<SurveyInfoPage />} />
        {/* <Route path="surveys/:surveyId/edit" element={<SurveyUpdatePage />} /> */}

        {/* User enrollments */}
        <Route path="enrollments" element={<EnrollmentsListPage />} />
        <Route path="enrollments/create" element={<EnrollmentFormPage />} />

        {/* Reports */}
        <Route path="reports" element={<ReportsListPage />} />
        <Route path="reports/:reportId" element={<ReportInfoPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
