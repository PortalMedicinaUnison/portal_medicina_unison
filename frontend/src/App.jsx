import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRoutes from './user/UserRoutes';
import AdminRoutes from './admin/AdminRoutes';


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas del usuario */}
        <Route path="/*" element={<UserRoutes />} />

        {/* Rutas del administrador */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>

  );
}

export default App;
