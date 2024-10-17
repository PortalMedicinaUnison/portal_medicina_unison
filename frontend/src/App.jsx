import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserPage from './pages/UserPage';
import EditPage from './pages/EditPage';
import ProtectedRoute from './components/ProtectedRoute';
import TestPage from './pages/test';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/test" element={<TestPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/edit" element={<EditPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
