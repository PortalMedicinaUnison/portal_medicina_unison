import React from 'react';
import { Routes, Route } from 'react-router-dom';

function AdminRoutes() {
  return (
    <Routes>
      {/* Rutas protegidas para administrador */}
      <Route element={<ProtectedRoute />}>
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
