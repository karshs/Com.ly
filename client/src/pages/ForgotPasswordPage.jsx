import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
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
      setError(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-section" style={{ margin: 'auto', maxWidth: '500px' }}>
        <Link to="/" className="auth-logo">com<span>.</span>ly</Link>
        <div className="auth-card">
          <h1 className="auth-title">Reset your password</h1>
          <p className="auth-subtitle">Enter your email and we'll help you get back into your account.</p>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && (
            <div className="alert alert-success" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <p>{message}</p>
              {resetToken && (
                <div style={{ marginTop: '8px', fontSize: '13px' }}>
                  <strong>Dev Testing Link:</strong><br />
                  <Link to={`/reset-password/${resetToken}`}>Click here to reset password directly</Link>
                </div>
              )}
            </div>
          )}

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
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset instructions'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
            <Link to="/login">← Back to log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
