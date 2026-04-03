import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
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
  X
} from 'lucide-react';
import './Layout.css';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'Skill Gap', path: '/skills', icon: TrendingUp },
  { name: 'CP Tracker', path: '/cp-tracker', icon: Code2 },
  { name: 'ATS Resume', path: '/ats', icon: FileCheck },
  { name: 'Mock Tests', path: '/tests', icon: BrainCircuit },
  { name: 'Analytics (CDC)', path: '/analytics', icon: LineChart },
];

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
            {navItems.map((item) => {
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
          <button className="nav-link logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header glass-panel">
          <div className="header-left">
            {/* Contextual Title can go here */}
          </div>
          <div className="header-right">
            <button className="btn-icon">
              <Bell size={20} />
              <span className="badge"></span>
            </button>
            <div className="user-profile">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="avatar" />
              <div className="user-info">
                <span className="user-name">Alex JD</span>
                <span className="user-role">Student</span>
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
