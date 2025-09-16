import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import UserListPage from '../admin/features/users/pages/UserListPage.jsx';
import UserInfoAdminPage from '../admin/features/users/pages/UserInfoAdmin.jsx';

import PromotionListPage from '../admin/features/promotions/pages/PromotionsListPage.jsx';
import PromotionFormPage from '../admin/features/promotions/pages/PromotionFormPage.jsx';
import PromotionInfoPage from '../admin/features/promotions/pages/PromotionInfoPage.jsx';
import PromotionUpdatePage from '../admin/features/promotions/pages/PromotionUpdatePage.jsx';

import SitesListPage from '../admin/features/sites/pages/SitesListPage.jsx';
import SiteFormPage from '../admin/features/sites/pages/SiteFormPage.jsx';
import SiteInfoPage from '../admin/features/sites/pages/SiteInfoPage.jsx';
// import SiteUpdatePage from '../admin/features/sites/pages/SiteUpdatePage.jsx';

import InstitutionsListPage from '../admin/features/institutions/pages/InstitutionsListPage.jsx';
import InstitutionFormPage from '../admin/features/institutions/pages/InstitutionsFormPage.jsx';
// import InstitutionInfoPage from '../admin/features/institutions/pages/InstitutionsInfoPage.jsx';
// import InstitutionUpdatePage from '../admin/features/institutions/pages/InstitutionsUpdatePage.jsx';

import AnnouncementsListPage from '../admin/features/announcements/pages/AnnouncementsListPage.jsx';
import AnnouncementFormPage from '../admin/features/announcements/pages/AnnouncementFormPage.jsx';
import AnnouncementInfoPage from '../admin/features/announcements/pages/AnnouncementInfoPage.jsx';
// import AnnouncementUpdatePage from '../admin/features/announcements/pages/AnnouncementUpdatePage.jsx';

import SurveysListPage from '../admin/features/surveys/pages/SurveysListPage.jsx';
import SurveyFormPage from '../admin/features/surveys/pages/SurveysFormPage.jsx';
import SurveyInfoPage from '../admin/features/surveys/pages/SurveyInfoPage.jsx';
// import SurveyUpdatePage from '../admin/features/surveys/pages/SurveyUpdatePage.jsx';

import EnrollmentFormPage from '../admin/features/users/enrollments/pages/EnrollmentFormPage.jsx';
import EnrollmentsListPage from '../admin/features/users/enrollments/pages/EnrollmentsListPage.jsx';

import ReportsListPage from '../admin/features/reports/pages/ReportsListPage.jsx';
import ReportInfoPage from '../admin/features/reports/pages/ReportInfoPage.jsx';

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {/* Users */}
        <Route path="users" element={<UserListPage />} />
        <Route path="users/academic/:academicId" element={<UserInfoAdminPage />} />

        {/* Promotions */}
        <Route path="promotions" element={<PromotionListPage />} />
        <Route path="promotions/create" element={<PromotionFormPage />} />
        <Route path="promotions/:promotionId" element={<PromotionInfoPage />} />
        <Route path="promotions/:promotionId/edit" element={<PromotionUpdatePage />} />

        {/* Sites */}
        <Route path="sites" element={<SitesListPage />} />
        <Route path="sites/create" element={<SiteFormPage />} />
        <Route path="sites/:siteId" element={<SiteInfoPage />} />
        {/* <Route path="sites/:siteId/edit" element={<SiteUpdatePage />} /> */}

        {/* Institutions */}
        <Route path="institutions" element={<InstitutionsListPage />} />
        <Route path="institutions/create" element={<InstitutionFormPage />} />
        {/* <Route path="institutions/:institutionId" element={<InstitutionInfoPage />} /> */}
        {/* <Route path="institutions/:institutionId/edit" element={<InstitutionUpdatePage />} /> */}

        {/* Announcements */}
        <Route path="announcements" element={<AnnouncementsListPage />} />
        <Route path="announcements/create" element={<AnnouncementFormPage />} />
        <Route path="announcements/:announcementId" element={<AnnouncementInfoPage />} />
        {/* <Route path="announcements/:announcementId/edit" element={<AnnouncementUpdatePage />} /> */}

        {/* Surveys */}
        <Route path="surveys" element={<SurveysListPage />} />
        <Route path="surveys/create" element={<SurveyFormPage />} />
        <Route path="surveys/:surveyId" element={<SurveyInfoPage />} />
        {/* <Route path="surveys/:surveyId/edit" element={<SurveyUpdatePage />} /> */}

        {/* User enrollments */}
        <Route path="user/enrollments" element={<EnrollmentsListPage />} />
        <Route path="user/enrollments/create" element={<EnrollmentFormPage />} />

        {/* Reports */}
        <Route path="reports" element={<ReportsListPage />} />
        <Route path="reports/:reportId" element={<ReportInfoPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
