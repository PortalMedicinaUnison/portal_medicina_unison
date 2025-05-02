import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES  } from '../config';

import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import HomePage from '../pages/HomePage';
import UserFormPage from '../features/profile/pages/UserFormPage';
import UserInfoPage from '../features/profile/pages/UserInfoPage';

function UserRoutes() {
  return (

    <Routes>
      {/* Rutas públicas */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<RegisterPage />} />

      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.PROFILE} element={<UserInfoPage />} />
      <Route path={ROUTES.EDIT_PROFILE} element={<UserFormPage />} />
    </Routes>
  );
}

export default UserRoutes;
