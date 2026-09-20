import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { getErrorMessage } from '../utils/error';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Auth.css';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.resetPassword(token, newPassword);
      setMessage(res.message || 'Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid or expired token.'));
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
          <h1 className="auth-title">Set new password</h1>
          <p className="auth-subtitle">Enter your new secure password below.</p>

          {error && <div className="alert alert-danger" style={{ marginBottom: '20px' }}>{error}</div>}
          {message && <div className="alert alert-success" style={{ marginBottom: '20px' }}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="newPassword">New Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="6+ characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
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

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              <span>{loading ? 'Updating password...' : 'Update password'}</span>
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

