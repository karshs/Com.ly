import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/error';
import { Link as LinkIcon, QrCode, CheckCircle, ArrowRight } from 'lucide-react';
import './Auth.css';

export const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devVerifyToken, setDevVerifyToken] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await signup(username, email, password);
      setSuccessMsg(res.message || 'Account created successfully! Please verify your email.');
      if (res.verificationToken) {
        setDevVerifyToken(res.verificationToken);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create account. Please check your details.'));
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
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          {successMsg ? (
            <div className="alert alert-success" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '15px' }}>
                <CheckCircle size={20} /> {successMsg}
              </div>
              
              {devVerifyToken && (
                <div style={{ width: '100%', marginTop: '4px', paddingTop: '10px', borderTop: '1px dashed #a7f3d0' }}>
                  <p style={{ fontSize: '13px', marginBottom: '8px' }}>
                    Click below to verify your email directly:
                  </p>
                  <Link
                    to={`/verify/${devVerifyToken}`}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    Verify Email Now <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  placeholder="e.g. rohan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
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
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="6+ characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
                style={{ marginTop: '12px' }}
              >
                {loading ? 'Creating account...' : 'Create free account'}
              </button>
            </form>
          )}
        </div>

        <div className="auth-terms">
          By creating an account, you agree to Com.ly's Terms of Service and Privacy Policy.
        </div>
      </div>

      {/* Right Brand Panel */}
      <div className="auth-side-panel">
        <div className="auth-graphic">
          <div className="auth-graphic-chip">
            <LinkIcon size={14} style={{ display: 'inline', marginRight: 4 }} />
            com.ly/SFlivingShop
          </div>
          <div className="auth-graphic-qr">
            <QrCode size={90} color="#0f172a" />
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
            Power your online brand
          </p>
        </div>
        <h2 className="auth-side-tagline">
          Power your links, QR Codes, and bio pages with Com.ly
        </h2>
      </div>
    </div>
  );
};
