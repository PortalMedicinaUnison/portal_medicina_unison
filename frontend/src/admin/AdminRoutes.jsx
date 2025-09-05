import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config.js';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import SiteFormPage from '../admin/features/sites/pages/SiteFormPage.jsx';
import SitesListPage from '../admin/features/sites/pages/SitesListPage.jsx';
import SiteInfoPage from '../admin/features/sites/pages/SiteInfoPage.jsx';

import InstitutionsListPage from '../admin/features/institutions/pages/InstitutionsListPage.jsx'
import InstitutionFormPage from '../admin/features/institutions/pages/InstitutionsFormPage.jsx';
import AnnouncementFormPage from '../admin/features/announcements/pages/AnnouncementFormPage.jsx';
import AnnouncementsListPage from '../admin/features/announcements/pages/AnnouncementsListPage.jsx';
import AnnouncementInfoPage from '../admin/features/announcements/pages/AnnouncementInfoPage.jsx';

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADMIN.SITE_CREATE} element={<SiteFormPage />} />
        <Route path={ROUTES.ADMIN.SITE_LIST} element={<SitesListPage />} />
        <Route path="sites/:siteId" element={<SiteInfoPage />} />
        
        <Route path={ROUTES.ADMIN.INSTITUTION_LIST} element={<InstitutionsListPage />} />
          <Route path={ROUTES.ADMIN.INSTITUTION_CREATE} element={<InstitutionFormPage />} />
          <Route path={ROUTES.ADMIN.ANNOUNCEMENTS_LIST} element={<AnnouncementsListPage />} />
          <Route path={ROUTES.ADMIN.ANNOUNCEMENT_CREATE} element={<AnnouncementFormPage />} />
          <Route path="announcements/:announcementId" element={<AnnouncementInfoPage />} />
          <Route path="announcements" element={<InstitutionFormPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
