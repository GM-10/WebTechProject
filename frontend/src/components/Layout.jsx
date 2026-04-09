import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  TrendingUp, 
  Code2, 
  FileCheck, 
  BrainCircuit, 
  LineChart,
  LogOut,
  Bell,
  Menu,
  X,
  Briefcase,
  ClipboardList
} from 'lucide-react';
import Notifications from './Notifications';
import './Layout.css';


const navItems = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/app/profile', icon: User },
  { name: 'Jobs', path: '/app/jobs', icon: Briefcase },
  { name: 'Applications', path: '/app/applications', icon: ClipboardList },
  { divider: true, label: 'TOOLS' },
  { name: 'Skill Gap', path: '/app/skills', icon: TrendingUp },
  { name: 'CP Tracker', path: '/app/cp-tracker', icon: Code2 },
  { name: 'ATS Resume', path: '/app/ats', icon: FileCheck },
  { name: 'Mock Tests', path: '/app/tests', icon: BrainCircuit },
  { divider: true, label: 'ADMIN' },
  { name: 'Analytics (CDC)', path: '/app/analytics', icon: LineChart },
];

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}') || {};



  const handleLogout = () => {
    sessionStorage.clear();

    navigate('/login');
    window.location.reload(); // Refresh to clear state
  };

  return (
    <div className="layout-container">
      {/* Mobile Toggle */}
      <button 
        className="mobile-toggle btn-ghost"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar glass-panel ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-box">
            <span className="logo-icon glass-panel">
              <BrainCircuit size={24} color="var(--primary)" />
            </span>
            <h2 className="logo-text gradient-text">CampusPlace</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, idx) => {
              // Only show Dashboard, Jobs, Applications, and Analytics to CDC/Admin
              // Hide Tools and Profile for CDC/Admin
              if (user.role === 'cdc' || user.role === 'admin') {
                if (['My Profile', 'Skill Gap', 'CP Tracker', 'ATS Resume', 'Mock Tests'].includes(item.name)) return null;
                if (item.divider && item.label === 'TOOLS') return null;
              } else {
                // Hide Analytics from Students
                if (item.path === '/app/analytics') return null;
                if (item.divider && item.label === 'ADMIN') return null;
              }

              if (item.divider) {
                return (
                  <li key={`divider-${idx}`} className="nav-divider">
                    <span>{item.label}</span>
                  </li>
                );
              }
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>


        <div className="sidebar-footer">
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header glass-panel">
          <div className="header-left">
            <h2 className="header-page-title">
              {navItems.find(item => window.location.pathname.includes(item.path))?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="header-right">
            <Notifications />
            <button className="btn-icon header-logout ml-2" onClick={handleLogout} title="Logout">
              <LogOut size={18} color="#f87171" />
            </button>
            <div className="user-profile ml-4">


              <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'Felix'}`} alt="User" className="avatar" />
              <div className="user-info">
                <span className="user-name">{user.name || 'User'}</span>
                <span className="user-role">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Guest'}</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="content-wrapper scrollable">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
