import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bioApi } from '../api/bio.api';
import './PublicBioPage.css';

export const PublicBioPage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const res = await bioApi.getPublicBio(username);
        setProfile(res.profile);
      } catch (err) {
        setError(err.response?.data?.error?.message || err.response?.data?.message || 'Bio profile not found');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPublicProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Profile Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          {error || `No public bio link profile exists for @${username}.`}
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Com.ly
        </Link>
      </div>
    );
  }

  const themeClass = `public-theme-${profile.theme || 'minimal-light'}`;

  return (
    <div className={`public-bio-page ${themeClass}`}>
      <div className="public-bio-content">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="public-avatar"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="public-avatar-placeholder">
            {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
        )}

        <h1 className="public-name">{profile.displayName}</h1>
        {profile.bio && <p className="public-bio-text">{profile.bio}</p>}

        <div className="public-links-container">
          {(profile.links || []).map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="public-link-button"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <footer className="public-bio-footer">
        Powered by <Link to="/">com.ly</Link>
      </footer>
    </div>
  );
};
