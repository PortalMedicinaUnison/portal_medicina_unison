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
      <Route path={ROUTES.HOME} element={<HomePage />} />

      <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.AUTH.SIGNUP} element={<RegisterPage />} />
      
      <Route path={ROUTES.USER.PROFILE} element={<UserInfoPage />} />
      <Route path={ROUTES.USER.EDIT_PROFILE} element={<UserFormPage />} />
    </Routes>
  );
}

export default UserRoutes;
