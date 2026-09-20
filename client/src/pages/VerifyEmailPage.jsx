import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { getErrorMessage } from '../utils/error';
import { CheckCircle, XCircle } from 'lucide-react';
import './Auth.css';

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');
  const hasRequested = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-invoking the one-time token
    if (hasRequested.current || !token) return;
    hasRequested.current = true;

    const verify = async () => {
      try {
        const res = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(res.message || 'Email verified successfully! You can now log in.');
      } catch (err) {
        setStatus('error');
        setMessage(getErrorMessage(err, 'Verification link is invalid or has expired.'));
      }
    };

    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-form-section" style={{ margin: 'auto', maxWidth: '500px' }}>
        <Link to="/" className="auth-logo" style={{ textAlign: 'center' }}>
          com<span>.</span>ly
        </Link>

        <div className="auth-card" style={{ textAlign: 'center' }}>
          {status === 'verifying' && (
            <div>
              <h2 className="auth-title">Verifying your email...</h2>
              <p className="auth-subtitle">Please wait while we confirm your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
              <h2 className="auth-title">Email Verified!</h2>
              <p className="auth-subtitle">{message}</p>
              <Link to="/login" className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <XCircle size={56} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
              <h2 className="auth-title">Verification Failed</h2>
              <p className="auth-subtitle">{message}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <Link to="/login" className="btn btn-primary btn-block">
                  Try Logging In
                </Link>
                <Link to="/signup" className="btn btn-secondary btn-block">
                  Back to Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="auth-terms" style={{ textAlign: 'center' }}>
          Com.ly — Simple URL Shortener & Bio Link Hub
        </div>
      </div>
    </div>
  );
};
