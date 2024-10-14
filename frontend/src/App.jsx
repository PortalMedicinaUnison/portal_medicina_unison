import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TestPage from './pages/TestPage';
import ErrorPage from './pages/ErrorPage';
import KaboomPage from './pages/kaboom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/kaboom" element={<KaboomPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/test" element={<TestPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
