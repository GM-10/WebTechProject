import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import AtsChecker from './pages/AtsChecker';
import SkillGap from './pages/SkillGap';
import CPTracker from './pages/CPTracker';
import MockTests from './pages/MockTests';
import Analytics from './pages/Analytics';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};


const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        
        {/* Landing Page as home */}
        <Route path="/" element={<Landing />} />

        <Route 
          path="/app" 
          element={<ProtectedRoute><Layout /></ProtectedRoute>}
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="profile" element={
            <RoleProtectedRoute allowedRoles={['student']}><Profile /></RoleProtectedRoute>
          } />
          
          <Route path="jobs" element={<Jobs />} />
          <Route path="applications" element={<Applications />} />
          
          {/* Phase 3 Routes - Student Only */}
          <Route path="skills" element={
            <RoleProtectedRoute allowedRoles={['student']}><SkillGap /></RoleProtectedRoute>
          } />
          <Route path="cp-tracker" element={
            <RoleProtectedRoute allowedRoles={['student']}><CPTracker /></RoleProtectedRoute>
          } />
          <Route path="ats" element={
            <RoleProtectedRoute allowedRoles={['student']}><AtsChecker /></RoleProtectedRoute>
          } />
          <Route path="tests" element={
            <RoleProtectedRoute allowedRoles={['student']}><MockTests /></RoleProtectedRoute>
          } />
          
          {/* Phase 4 Routes - CDC/Admin Only */}
          <Route path="analytics" element={
            <RoleProtectedRoute allowedRoles={['cdc', 'admin']}><Analytics /></RoleProtectedRoute>
          } />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
