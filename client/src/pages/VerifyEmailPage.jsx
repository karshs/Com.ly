import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { CheckCircle, XCircle } from 'lucide-react';
import './Auth.css';

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(res.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };

    if (token) {
      verify();
    }
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
              <Link to="/signup" className="btn btn-secondary btn-block" style={{ marginTop: '20px' }}>
                Try signing up again
              </Link>
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
