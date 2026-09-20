import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link as LinkIcon, QrCode } from 'lucide-react';
import './Auth.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Form */}
      <div className="auth-form-section">
        <Link to="/" className="auth-logo">
          com<span>.</span>ly
        </Link>

        <div className="auth-card">
          <h1 className="auth-title">Log in and start sharing</h1>
          <p className="auth-subtitle">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label" htmlFor="password">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '13px' }}>Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: '12px' }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>

        <div className="auth-terms">
          By logging in, you agree to Com.ly's Terms of Service and Privacy Policy.
        </div>
      </div>

      {/* Right Brand Panel */}
      <div className="auth-side-panel">
        <div className="auth-graphic">
          <div className="auth-graphic-chip">
            <LinkIcon size={14} style={{ display: 'inline', marginRight: 4 }} />
            com.ly/my-portfolio
          </div>
          <div className="auth-graphic-qr">
            <QrCode size={90} color="#0f172a" />
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
            Instant QR & Bio Page
          </p>
        </div>
        <h2 className="auth-side-tagline">
          Power your links, QR Codes, and bio pages with Com.ly
        </h2>
      </div>
    </div>
  );
};
