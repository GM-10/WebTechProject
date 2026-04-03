import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Future Routes */}
          <Route path="profile" element={<div className="p-8 text-white">Profile Module (Coming Soon)</div>} />
          <Route path="skills" element={<div className="p-8 text-white">Skill Gap Analysis (Coming Soon)</div>} />
          <Route path="cp-tracker" element={<div className="p-8 text-white">CP Tracker (Coming Soon)</div>} />
          <Route path="ats" element={<div className="p-8 text-white">ATS Checker (Coming Soon)</div>} />
          <Route path="tests" element={<div className="p-8 text-white">Mock Tests (Coming Soon)</div>} />
          <Route path="analytics" element={<div className="p-8 text-white">CDC Analytics (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
