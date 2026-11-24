import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRoutes from './user/UserRoutes';
import LoadingSpinner from './utils/ui/LoadingSpinner';

// El panel de administración se carga aparte: los estudiantes no descargan su código.
const AdminRoutes = lazy(() => import('./admin/AdminRoutes'));


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas del usuario */}
        <Route path="/*" element={<UserRoutes />} />

        {/* Rutas del administrador */}
        <Route
          path="/admin/*"
          element={(
            <Suspense fallback={<div className="min-h-screen grid place-items-center"><LoadingSpinner /></div>}>
              <AdminRoutes />
            </Suspense>
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
