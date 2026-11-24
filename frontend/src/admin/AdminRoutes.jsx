import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import InscriptionListPage from './features/inscriptions/pages/InscriptionListPage.jsx';
import InscriptionDetailPage from './features/inscriptions/pages/InscriptionDetailPage.jsx';
import PlazaResultsPage from './features/inscriptions/pages/PlazaResultsPage.jsx';
import RecordRedirectPage from './features/inscriptions/pages/RecordRedirectPage.jsx';
import { PROGRAMS } from '../utils/constants';

import UserListPage from '../admin/features/users/pages/UserListPage.jsx';
import UserDetailAdmin from './features/users/pages/UserDetailAdmin.jsx';

import PromotionListPage from './features/promotions/pages/PromotionListPage.jsx';
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

import SurveyListPage from '../admin/features/surveys/pages/SurveyListPage.jsx';
import SurveyFormPage from '../admin/features/surveys/pages/SurveyFormPage.jsx';
import SurveyDetailPage from '../admin/features/surveys/pages/SurveyDetailPage.jsx';
import SurveyUpdatePage from '../admin/features/surveys/pages/SurveyUpdatePage.jsx';

import EnrollmentFormPage from '../admin/features/users/enrollments/pages/EnrollmentFormPage.jsx';
import EnrollmentListPage from '../admin/features/users/enrollments/pages/EnrollmentListPage.jsx';
import EnrollmentDetailPage from '../admin/features/users/enrollments/pages/EnrollmentDetailPage.jsx';

import ReportListPage from '../admin/features/reports/pages/ReportListPage.jsx';
import ReportDetailPage from '../admin/features/reports/pages/ReportDetailPage.jsx';



import DocumentRequirementListPage from './features/document-requirements/pages/DocumentRequirementListPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';


function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allow="admin" />}>
        <Route index element={<Navigate to="internship-applications" replace />} />

        {/* Inscripciones al internado (asignación + internado en una sola vista) */}
        <Route path="internship-applications" element={<InscriptionListPage key="internship" program={PROGRAMS.INTERNSHIP} />} />
        <Route path="internship-applications/act" element={<PlazaResultsPage key="internship-act" program={PROGRAMS.INTERNSHIP} />} />
        <Route path="internship-applications/create" element={<Navigate to="/admin/internship-applications" replace />} />
        <Route path="internship-applications/:applicationId" element={<InscriptionDetailPage key="internship-detail" program={PROGRAMS.INTERNSHIP} />} />

        {/* Users */}
        <Route path="users" element={<UserListPage />} />
        <Route path="users/:userId" element={<UserDetailAdmin />} />

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
        <Route path="surveys" element={<SurveyListPage />} />
        <Route path="surveys/create" element={<SurveyFormPage />} />
        <Route path="surveys/:surveyId" element={<SurveyDetailPage />} />
        <Route path="surveys/:surveyId/edit" element={<SurveyUpdatePage />} />

        {/* User enrollments */}
        <Route path="enrollments" element={<EnrollmentListPage />} />
        <Route path="enrollments/create" element={<EnrollmentFormPage />} />
        <Route path="enrollments/:enrollmentId" element={<EnrollmentDetailPage />} />

        {/* Reports */}
        <Route path="reports" element={<ReportListPage />} />
        <Route path="reports/:reportId" element={<ReportDetailPage />} />

        {/* Enlaces anteriores a internados: llevan a su inscripción */}
        <Route path="internships" element={<Navigate to="/admin/internship-applications" replace />} />
        <Route path="internships/:recordId" element={<RecordRedirectPage program={PROGRAMS.INTERNSHIP} />} />

        {/* Social service applications */}
        <Route path="social-service-applications" element={<InscriptionListPage key="social-service" program={PROGRAMS.SOCIAL_SERVICE} />} />
        <Route path="social-service-applications/act" element={<PlazaResultsPage key="social-service-act" program={PROGRAMS.SOCIAL_SERVICE} />} />
        <Route path="social-service-applications/create" element={<Navigate to="/admin/social-service-applications" replace />} />
        <Route path="social-service-applications/:applicationId" element={<InscriptionDetailPage key="social-service-detail" program={PROGRAMS.SOCIAL_SERVICE} />} />

        {/* Social services */}
        <Route path="social-services" element={<Navigate to="/admin/social-service-applications" replace />} />
        <Route path="social-services/:recordId" element={<RecordRedirectPage program={PROGRAMS.SOCIAL_SERVICE} />} />

        <Route path="document-requirements" element={<DocumentRequirementListPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AdminRoutes;
