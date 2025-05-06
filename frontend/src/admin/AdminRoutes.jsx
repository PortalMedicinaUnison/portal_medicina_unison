import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config';

import UserList from '../admin/features/users/pages/UserListPage';

function AdminRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.ADMIN.USER_LIST} element={<UserList />} />
    </Routes>
  );
}

export default AdminRoutes;
