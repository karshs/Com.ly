import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { getErrorMessage } from '../utils/error';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
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
      <div className="auth-form-section" style={{ margin: 'auto', maxWidth: '480px', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link to="/" className="auth-logo" style={{ justifyContent: 'center' }}>
            <img src="/logo.png" alt="Comly" style={{ height: '48px', width: 'auto', display: 'inline-block' }} />
          </Link>
        </div>


        <div className="auth-card" style={{ textAlign: 'center', margin: 0, padding: 0 }}>
          {status === 'verifying' && (
            <div>
              <h2 className="auth-title">Verifying your email...</h2>
              <p className="auth-subtitle">Please wait while we confirm your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <CheckCircle size={56} color="#10b981" style={{ margin: '0 auto 16px' }} />
              <h2 className="auth-title">Email Verified!</h2>
              <p className="auth-subtitle">{message}</p>
              <Link
                to="/login"
                className="auth-submit-btn"
                style={{ textDecoration: 'none', marginTop: '24px', display: 'inline-flex' }}
              >
                <span>Go to Login</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <XCircle size={56} color="#ef4444" style={{ margin: '0 auto 16px' }} />
              <h2 className="auth-title">Verification Failed</h2>
              <p className="auth-subtitle">{message}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                <Link
                  to="/login"
                  className="auth-submit-btn"
                  style={{ textDecoration: 'none', display: 'inline-flex' }}
                >
                  <span>Try Logging In</span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/signup" className="auth-link" style={{ fontSize: '14px', marginTop: '6px' }}>
                  Back to Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="auth-terms" style={{ textAlign: 'center', marginTop: '32px' }}>
          Com.ly — Simple URL Shortener & Bio Link Hub
        </div>
      </div>
    </div>
  );
};

