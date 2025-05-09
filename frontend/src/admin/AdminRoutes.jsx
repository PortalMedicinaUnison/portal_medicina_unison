import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import UserList from '../admin/features/users/pages/UserListPage';

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADMIN.USER_LIST} element={<UserList />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
