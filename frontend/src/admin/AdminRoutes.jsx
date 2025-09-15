import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config.js';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import PromotionFormPage from '../admin/features/promotions/pages/PromotionFormPage.jsx';
import PromotionListPage from '../admin/features/promotions/pages/PromotionsListPage.jsx';
import PromotionInfoPage from '../admin/features/promotions/pages/PromotionInfoPage.jsx';

import SiteFormPage from '../admin/features/sites/pages/SiteFormPage.jsx';
import SitesListPage from '../admin/features/sites/pages/SitesListPage.jsx';
import SiteInfoPage from '../admin/features/sites/pages/SiteInfoPage.jsx';

import InstitutionsListPage from '../admin/features/institutions/pages/InstitutionsListPage.jsx';
import InstitutionFormPage from '../admin/features/institutions/pages/InstitutionsFormPage.jsx';
import AnnouncementFormPage from '../admin/features/announcements/pages/AnnouncementFormPage.jsx';
import AnnouncementsListPage from '../admin/features/announcements/pages/AnnouncementsListPage.jsx';
import AnnouncementInfoPage from '../admin/features/announcements/pages/AnnouncementInfoPage.jsx';
import SurveyFormPage from '../admin/features/surveys/pages/SurveysFormPage.jsx';
import SurveysListPage from '../admin/features/surveys/pages/SurveysListPage.jsx';
import SurveyInfoPage from '../admin/features/surveys/pages/SurveyInfoPage.jsx';

import ReportsListPage from '../admin/features/reports/pages/ReportsListPage.jsx';
import ReportInfoPage from '../admin/features/reports/pages/ReportInfoPage.jsx';

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADMIN.SITE_CREATE} element={<SiteFormPage />} />
        <Route path={ROUTES.ADMIN.SITE_LIST} element={<SitesListPage />} />
        <Route path="sites/:siteId" element={<SiteInfoPage />} />
        
        <Route path={ROUTES.ADMIN.INSTITUTION_LIST} element={<InstitutionsListPage />} />
        <Route path={ROUTES.ADMIN.INSTITUTION_CREATE} element={<InstitutionFormPage />} />
        <Route path={ROUTES.ADMIN.REPORT_LIST} element={<ReportsListPage />} />
        <Route path={ROUTES.ADMIN.REPORT_DETAIL(':reportId')} element={<ReportInfoPage />} />
        <Route path={ROUTES.ADMIN.PROMOTION_CREATE} element={<PromotionFormPage />} />
        <Route path={ROUTES.ADMIN.PROMOTION_LIST} element={<PromotionListPage />} />
        <Route path="promotions/:promotionId" element={<PromotionInfoPage />} />
          <Route path={ROUTES.ADMIN.INSTITUTION_CREATE} element={<InstitutionFormPage />} />
          <Route path={ROUTES.ADMIN.ANNOUNCEMENTS_LIST} element={<AnnouncementsListPage />} />
          <Route path={ROUTES.ADMIN.ANNOUNCEMENT_CREATE} element={<AnnouncementFormPage />} />
          <Route path="announcements/:announcementId" element={<AnnouncementInfoPage />} />
          <Route path={ROUTES.ADMIN.SURVEY_CREATE} element={<SurveyFormPage />} />
          <Route path={ROUTES.ADMIN.SURVEY_LIST} element={<SurveysListPage />} />
          <Route path="surveys/:surveyId" element={<SurveyInfoPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
