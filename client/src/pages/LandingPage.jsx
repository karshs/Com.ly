import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, QrCode, BarChart3, LayoutTemplate, ArrowRight } from 'lucide-react';
import './LandingPage.css';

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      {/* Top Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          com<span>.</span>ly
        </Link>
        <div className="landing-nav-links">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="landing-nav-link">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign up Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <h1 className="landing-hero-title">
          Understand what clicks with your audience
        </h1>
        <p className="landing-hero-subtitle">
          Com.ly makes it easy to create, share, and track short links, QR Codes, and Bio-link pages.
          Find what's resonating and scale into bigger reach, more clicks, and more growth.
        </p>
        <div className="landing-hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary landing-btn-cta">
              Open My Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary landing-btn-cta">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary landing-btn-cta">
                Log in to Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="landing-features">
        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <Link2 size={22} />
          </div>
          <h3 className="landing-feature-title">URL Shortening</h3>
          <p className="landing-feature-desc">
            Shorten long URLs into clean, memorable links with custom alias support and tag organization.
          </p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <QrCode size={22} />
          </div>
          <h3 className="landing-feature-title">Dynamic QR Codes</h3>
          <p className="landing-feature-desc">
            Generate crisp, scannable QR codes instantly for print, packaging, and digital campaigns.
          </p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <BarChart3 size={22} />
          </div>
          <h3 className="landing-feature-title">Click Analytics</h3>
          <p className="landing-feature-desc">
            Track engagement over time with visual charts breaking down clicks, device types, and top referrers.
          </p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <LayoutTemplate size={22} />
          </div>
          <h3 className="landing-feature-title">Bio-Link Hub</h3>
          <p className="landing-feature-desc">
            Build your personal Link-in-Bio profile with customizable themes and a live preview.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 Com.ly. Simple URL Shortener & Bio-Link Hub.</p>
      </footer>
    </div>
  );
};
