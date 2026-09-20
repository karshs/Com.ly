import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Link2,
  LayoutTemplate,
  BarChart3,
  Plus,
  LogOut,
  Search,
} from 'lucide-react';
import './AppLayout.css';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <Link to="/dashboard" className="sidebar-logo">
            com<span>.</span>ly
          </Link>
        </div>

        <div className="sidebar-action">
          <Link to="/dashboard" className="btn btn-primary sidebar-btn-create">
            <Plus size={18} />
            <span>Create new</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Link2 size={18} />
            <span>Links</span>
          </NavLink>

          <NavLink
            to="/bio-builder"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutTemplate size={18} />
            <span>Bio Hub</span>
          </NavLink>
        </nav>

        {/* User Profile & Logout at bottom */}
        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="user-avatar">{initial}</div>
            <div className="user-info">
              <span className="user-name">{user?.username || 'User'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-logout"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <div className="app-main">
        {/* Top Header */}
        <header className="app-header">
          <div className="header-search">
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search links..."
              className="header-search-input"
            />
          </div>

          <div className="header-actions">
            <div className="header-avatar" title={user?.email}>
              {initial}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="app-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
