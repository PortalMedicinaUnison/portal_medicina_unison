import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config.js';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import SiteFormPage from '../admin/features/sites/pages/SiteFormPage.jsx';

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADMIN.SITE_CREATE} element={<SiteFormPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
