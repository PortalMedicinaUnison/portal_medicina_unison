import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import UserList from '../admin/features/users/pages/UserListPage';
import SiteList from '../admin/features/sites/pages/SitesListPage';

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADMIN.USER_LIST} element={<UserList />} />
        <Route path={ROUTES.ADMIN.SITE_LIST} element={<SiteList />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
