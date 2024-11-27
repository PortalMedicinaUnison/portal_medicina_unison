import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoriaClinica1 from './pages/HistoriaClinica/HC1';
import HistoriaClinica2 from './pages/HistoriaClinica/HC2';
import HistoriaClinica3 from './pages/HistoriaClinica/HC3';
import HistoriaClinica4 from './pages/HistoriaClinica/HC4';
import HistoriaClinica5 from './pages/HistoriaClinica/HC5';
import HistoriaClinica6 from './pages/HistoriaClinica/HC6';
import HistoriaClinica7 from './pages/HistoriaClinica/HC7';
import HistoriaClinica8_9 from './pages/HistoriaClinica/HC8_9';
import HistoriaClinica10 from './pages/HistoriaClinica/HC10';
import HistoriaClinica11_12 from './pages/HistoriaClinica/HC11_12';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/historiaclinica1" element={<HistoriaClinica1 />} />
        <Route path="/historiaclinica2" element={<HistoriaClinica2 />} />
        <Route path="/historiaclinica3" element={<HistoriaClinica3 />} />
        <Route path="/historiaclinica4" element={<HistoriaClinica4 />} />
        <Route path="/historiaclinica5" element={<HistoriaClinica5 />} />
        <Route path="/historiaclinica6" element={<HistoriaClinica6 />} />
        <Route path="/historiaclinica7" element={<HistoriaClinica7 />} />
        <Route path="/historiaclinica8-9" element={<HistoriaClinica8_9 />} />
        <Route path="/historiaclinica10" element={<HistoriaClinica10 />} />
        <Route path="/historiaclinica11-12" element={<HistoriaClinica11_12 />} />
      </Routes>
    </Router>
  );
}

export default App;
