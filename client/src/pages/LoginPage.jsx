import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/error';
import { Link as LinkIcon, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Auth.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Form Section */}
      <div className="auth-form-section">
        <div>
          <Link to="/" className="auth-logo">
            <img src="/logo.png" alt="Comly" style={{ height: '48px', width: 'auto', display: 'block' }} />
          </Link>
        </div>


        <div className="auth-card">
          <h1 className="auth-title">Log in and start sharing</h1>
          <p className="auth-subtitle">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>

          {error && <div className="alert alert-danger" style={{ marginBottom: '20px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="email">Email address</label>
              <div className="auth-input-wrapper">
                <input
                  id="email"
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <div className="auth-form-label-row">
                <label className="auth-form-label" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="auth-link" style={{ fontSize: '13px' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="auth-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-input-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              <span>{loading ? 'Logging in...' : 'Log in'}</span>
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
        </div>

        <div className="auth-terms">
          By logging in, you agree to Com.ly's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>

      {/* Right Brand Showcase Panel */}
      <div className="auth-side-panel">
        <div className="auth-showcase-container">
          <div className="auth-graphic-card">
            <div className="auth-graphic-pill">
              <LinkIcon size={14} />
              <span>com.ly/my-portfolio</span>
            </div>
            
            <div className="auth-graphic-qr-box">
              <svg width="128" height="128" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Top Left Corner Marker */}
                <rect x="10" y="10" width="34" height="34" rx="8" stroke="#0f172a" strokeWidth="6" />
                <rect x="21" y="21" width="12" height="12" rx="3" fill="#0f172a" />
                
                {/* Top Right Corner Marker */}
                <rect x="76" y="10" width="34" height="34" rx="8" stroke="#0f172a" strokeWidth="6" />
                <rect x="87" y="21" width="12" height="12" rx="3" fill="#0f172a" />
                
                {/* Bottom Left Corner Marker */}
                <rect x="10" y="76" width="34" height="34" rx="8" stroke="#0f172a" strokeWidth="6" />
                <rect x="21" y="87" width="12" height="12" rx="3" fill="#0f172a" />
                
                {/* Center Amber Accent */}
                <circle cx="60" cy="60" r="10" stroke="#f59e0b" strokeWidth="5" />
                <circle cx="60" cy="60" r="3" fill="#f59e0b" />
                
                {/* Decorative QR Pattern Dots */}
                <rect x="56" y="14" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="56" y="28" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="14" y="56" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="28" y="56" width="8" height="8" rx="2" fill="#0f172a" />
                
                <rect x="84" y="56" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="98" y="56" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="56" y="84" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="56" y="98" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="76" y="76" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="98" y="76" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="84" y="92" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="98" y="98" width="8" height="8" rx="2" fill="#0f172a" />
              </svg>
            </div>

            <div className="auth-graphic-footer">
              <span className="auth-dot">•</span> Instant QR & Bio Page
            </div>
          </div>

          <h2 className="auth-side-headline">
            Power your links, QR Codes, and bio pages with Com.ly
          </h2>
          <p className="auth-side-subtext">
            Clean URLs, memorable QR codes, and lightweight bio profiles tailored to your brand.
          </p>
        </div>
      </div>
    </div>
  );
};

