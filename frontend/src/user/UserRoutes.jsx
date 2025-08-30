import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES  } from '../config';
import ProtectedRoute from '../features/auth/ProtectedRoute';

import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import HomePage from '../pages/HomePage';
import UserFormPage from '../features/profile/pages/UserFormPage';
import UserInfoPage from '../features/profile/pages/UserInfoPage';

// Reports pages
import ReportsListPage from './features/reports/pages/ReportsListPage';
import ReportFormPage from './features/reports/pages/ReportFormPage';
import ReportInfoPage from './features/reports/pages/ReportInfoPage';

function UserRoutes() {
  return (

    <Routes>
      <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.AUTH.SIGNUP} element={<RegisterPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.USER.PROFILE} element={<UserInfoPage />} />
        <Route path={ROUTES.USER.EDIT_PROFILE} element={<UserFormPage />} />
        
        {/* Reports routes */}
        <Route path={ROUTES.USER.REPORTS_LIST} element={<ReportsListPage />} />
        <Route path={ROUTES.USER.REPORT_CREATE} element={<ReportFormPage />} />
        <Route path={ROUTES.USER.REPORT_INFO(':reportId')} element={<ReportInfoPage />} />
      </Route>
    </Routes>
  );
}

export default UserRoutes;
