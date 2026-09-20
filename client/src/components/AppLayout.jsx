import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreateLinkModal } from './CreateLinkModal';
import {
  Home,
  Link2,
  LayoutTemplate,
  Plus,
  LogOut,
  Search,
  ExternalLink,
} from 'lucide-react';
import './AppLayout.css';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <Link to="/dashboard" className="sidebar-logo" title="Com.ly">
            <img src="/logo.png" alt="Comly" className="sidebar-logo-img" />
          </Link>
        </div>


        <div className="sidebar-action">
          <button
            type="button"
            className="btn btn-primary sidebar-btn-create"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} />
            <span>Create new</span>
          </button>
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
            to="/links"
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
          <div className="user-profile-badge" title={`${user?.username} (${user?.email})`}>
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

          <div className="header-actions" ref={userMenuRef}>
            <button
              type="button"
              className="header-avatar-btn"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-label="User profile menu"
            >
              <div className="header-avatar" title={user?.email}>
                {initial}
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-header">
                  <div className="user-dropdown-avatar">{initial}</div>
                  <div className="user-dropdown-details">
                    <span className="user-dropdown-name">{user?.username || 'User'}</span>
                    <span className="user-dropdown-email">{user?.email || ''}</span>
                  </div>
                </div>

                <div className="user-dropdown-divider" />

                <div className="user-dropdown-links">
                  <Link
                    to="/bio-builder"
                    className="user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <LayoutTemplate size={16} />
                    <span>Bio Hub Customizer</span>
                  </Link>

                  {user?.username && (
                    <a
                      href={`/bio/${user.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="user-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ExternalLink size={16} />
                      <span>View Public Bio</span>
                    </a>
                  )}
                </div>

                <div className="user-dropdown-divider" />

                <button
                  type="button"
                  className="user-dropdown-item user-dropdown-logout"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="app-page-content">
          <Outlet />
        </main>
      </div>


      {/* Global Quick Create Modal */}
      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onLinkCreated={() => {
          // If already on dashboard or links, reload/dispatch event
          window.dispatchEvent(new CustomEvent('comly:link-created'));
        }}
      />
    </div>
  );
};
