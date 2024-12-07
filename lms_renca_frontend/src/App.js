//LMS/lms_renca_frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import DirectorDashboard from './components/director/DirectorDashboard';
import AdministradorDashboard from './components/municipalidad/AdministradorDashboard';
import ProfesorDashboard from './components/profesor/ProfesorDashboard';
import EstudianteDashboard from './components/estudiante/EstudianteDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/director" element={<DirectorDashboard />} />
        <Route path="/administrador" element={<AdministradorDashboard />} />
        <Route path="/profesor" element={<ProfesorDashboard />} />
        <Route path="/estudiante" element={<EstudianteDashboard />} />
      </Routes>
  );
}

export default App;