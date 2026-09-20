import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { getErrorMessage } from '../utils/error';
import { ArrowRight } from 'lucide-react';
import './Auth.css';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authApi.forgotPassword(email);
      setMessage(res.message || 'Reset link sent to your email.');
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send reset link.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-section" style={{ margin: 'auto', maxWidth: '480px', justifyContent: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link to="/" className="auth-logo">
            <img src="/logo.png" alt="Comly" style={{ height: '48px', width: 'auto', display: 'block' }} />
          </Link>
        </div>


        <div className="auth-card" style={{ margin: 0, padding: 0 }}>
          <h1 className="auth-title">Reset your password</h1>
          <p className="auth-subtitle">Enter your email and we'll help you get back into your account.</p>

          {error && <div className="alert alert-danger" style={{ marginBottom: '20px' }}>{error}</div>}
          {message && (
            <div className="alert alert-success" style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px', borderRadius: '12px' }}>
              <p>{message}</p>
              {resetToken && (
                <div style={{ marginTop: '10px', fontSize: '13px', paddingTop: '10px', borderTop: '1px dashed #a7f3d0', width: '100%' }}>
                  <p style={{ fontWeight: 600, marginBottom: '6px' }}>Dev Testing Link:</p>
                  <Link to={`/reset-password/${resetToken}`} className="auth-link">
                    Click here to reset password directly →
                  </Link>
                </div>
              )}
            </div>
          )}

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

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              <span>{loading ? 'Sending...' : 'Send reset instructions'}</span>
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
            <Link to="/login" className="auth-link">← Back to log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

