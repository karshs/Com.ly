import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Link2,
  QrCode,
  BarChart2,
  LayoutTemplate,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import './LandingPage.css';

// 4-point decorative dark yellow star sparkle
const StarSparkle = ({ className, size = 26 }) => (
  <svg
    className={`bg-sparkle ${className || ''}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      fill="#d97706"
    />
  </svg>
);

export const LandingPage = () => {
  const { user } = useAuth();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-honey-page">
      {/* Three spaced apart dark yellow background sparkles */}
      <StarSparkle className="sparkle-pos-top-right" size={30} />
      <StarSparkle className="sparkle-pos-mid-left" size={24} />
      <StarSparkle className="sparkle-pos-bottom-right" size={26} />

      {/* Top Navbar */}
      <header className="landing-header">
        <div className="landing-header-inner">
          {/* Logo Image with Link */}
          <Link to="/" className="landing-logo-brand" title="Com.ly">
            <img src="/logo.png" alt="Comly" className="landing-logo-img" />
          </Link>

          {/* Navigation Links */}
          <nav className="landing-nav-menu">
            <button type="button" onClick={() => scrollToSection('features')} className="landing-nav-btn">
              Features
            </button>
          </nav>

          {/* Right Auth CTA */}
          <div className="landing-header-auth">
            {user ? (
              <Link to="/dashboard" className="honey-btn honey-btn-sm">
                <span>Dashboard</span>
                <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="landing-link-login">
                  Log In
                </Link>
                <Link to="/signup" className="honey-btn honey-btn-sm">
                  <span>Sign up Free</span>
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="landing-main-wrap">
        {/* Hero Section */}
        <section className="landing-hero-section">
          <h1 className="landing-hero-headline">
            Understand what <span className="drawn-highlight">clicks</span> with your audience
          </h1>

          <p className="landing-hero-lead">
            <strong>Com.ly</strong> makes it delightfully easy to create, share, and track clean short links, dynamic QR Codes, and Bio-link pages. Find what's resonating and scale your reach.
          </p>

          <div className="landing-hero-cta-row">
            {user ? (
              <Link to="/dashboard" className="honey-btn honey-btn-lg">
                <span>Go to Workspace</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="honey-btn honey-btn-lg">
                  <span>Get Started Free</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="subtle-btn subtle-btn-lg">
                  <UserCheck size={18} />
                  <span>Log in to Account</span>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Four Simple Tools, One Happy Home Section */}
        <section id="features" className="landing-pillars-section">
          <div className="pillars-header">
            <span className="pill-eyebrow font-mono">CORE BUILDING BLOCKS</span>
            <h2 className="pillars-title">Four simple tools, one happy home</h2>
            <p className="pillars-subtitle">
              Everything you need to share your work without drowning in bloated spreadsheets.
            </p>
          </div>


          <div className="pillars-grid">
            {/* 1. URL Shortening */}
            <div className="bubbly-card">
              <div>
                <div className="pillar-icon-box bg-yellow-soft">
                  <Link2 size={24} />
                </div>
                <h3 className="pillar-card-title">URL Shortening</h3>
                <p className="pillar-card-desc">
                  Turn awkward 200-character links into tidy, friendly addresses that look great anywhere.
                </p>
              </div>
              <div className="pillar-micro-preview">
                <div className="micro-tag font-mono">PREVIEW</div>
                <div className="micro-link font-mono">com.ly/launch-day</div>
                <div className="micro-note text-success">✓ Instant 15ms redirect</div>
              </div>
            </div>

            {/* 2. Dynamic QR Codes */}
            <div className="bubbly-card">
              <div>
                <div className="pillar-icon-box bg-amber-soft">
                  <QrCode size={24} />
                </div>
                <h3 className="pillar-card-title">Dynamic QR Codes</h3>
                <p className="pillar-card-desc">
                  Print once on flyers or menus, change destination link whenever your menu or promo changes!
                </p>
              </div>
              <div className="pillar-micro-preview qr-preview-row">
                <div className="qr-mini-thumb">
                  <QrCode size={22} color="#1f2937" />
                </div>
                <div className="qr-mini-info">
                  <div className="qr-mini-title">Cafe Menu</div>
                  <div className="qr-mini-sub font-mono">Scans: 412</div>
                </div>
                <span className="badge-editable">Editable</span>
              </div>
            </div>

            {/* 3. Click Analytics */}
            <div className="bubbly-card">
              <div>
                <div className="pillar-icon-box bg-orange-soft">
                  <BarChart2 size={24} />
                </div>
                <h3 className="pillar-card-title">Click Analytics</h3>
                <p className="pillar-card-desc">
                  Visual insights that show where your fans are coming from, what time they tap, and on what device.
                </p>
              </div>
              <div className="pillar-micro-preview chart-micro-box">
                <div className="micro-bars-row">
                  <div className="micro-bar bar-1" />
                  <div className="micro-bar bar-2" />
                  <div className="micro-bar bar-3" />
                  <div className="micro-bar bar-4" />
                </div>
                <div className="micro-bars-labels font-mono">
                  <span>X</span>
                  <span>YT</span>
                  <span className="label-top">IG</span>
                  <span>Mail</span>
                </div>
              </div>
            </div>

            {/* 4. Bio-Link Hub */}
            <div className="bubbly-card">
              <div>
                <div className="pillar-icon-box bg-gold-soft">
                  <LayoutTemplate size={24} />
                </div>
                <h3 className="pillar-card-title">Bio-Link Hub</h3>
                <p className="pillar-card-desc">
                  Craft one single, beautiful landing page for your social profiles with shop links and media.
                </p>
              </div>
              <div className="pillar-micro-preview bio-mini-box">
                <div className="bio-mini-avatar">C</div>
                <div className="bio-mini-name">com.ly/@sarah</div>
                <div className="bio-mini-button">☕ Buy me a Coffee</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer-honey">
        <div className="landing-footer-inner">
          <div className="footer-brand">
            <Link to="/" title="Com.ly">
              <img src="/logo.png" alt="Comly" className="footer-logo-img" />
            </Link>
            <span>© 2026 — Simple, honest link tools.</span>
          </div>

          <div className="footer-links">
            <button type="button" onClick={() => scrollToSection('features')} className="footer-nav-link">
              Features
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};



