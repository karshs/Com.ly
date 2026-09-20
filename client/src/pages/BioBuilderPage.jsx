import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bioApi } from '../api/bio.api';
import { useAuth } from '../context/AuthContext';
import {
  ExternalLink,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle,
} from 'lucide-react';
import './BioBuilderPage.css';

export const BioBuilderPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  // Bio Form State
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [theme, setTheme] = useState('minimal-light');
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchBio = async () => {
      try {
        setLoading(true);
        const res = await bioApi.getMyBio();
        if (res.profile) {
          setDisplayName(res.profile.displayName || user?.username || '');
          setBio(res.profile.bio || '');
          setAvatarUrl(res.profile.avatarUrl || '');
          setTheme(res.profile.theme || 'minimal-light');
          setLinks(res.profile.links || []);
        }
      } catch (err) {
        console.error('Failed to load bio profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
  }, [user]);

  const handleAddLink = () => {
    setLinks([...links, { label: '', url: '', order: links.length }]);
  };

  const handleUpdateLink = (index, field, value) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  const handleRemoveLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleMoveLink = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === links.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...links];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setLinks(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      await bioApi.updateMyBio({
        displayName,
        bio,
        avatarUrl,
        theme,
        links,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update bio profile');
    } finally {
      setSaving(false);
    }
  };

  const publicBioUrl = `/bio/${user?.username}`;

  if (loading) {
    return (
      <div className="bio-builder-container">
        <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          Loading your Bio Hub...
        </p>
      </div>
    );
  }

  return (
    <div className="bio-builder-container">
      {/* Top Header */}
      <div className="bio-builder-top">
        <h1 className="bio-builder-title">Bio Hub Customizer</h1>
        {user?.username && (
          <Link to={publicBioUrl} target="_blank" className="bio-public-badge">
            <span>com.ly/bio/{user.username}</span>
            <ExternalLink size={14} />
          </Link>
        )}
      </div>

      {savedSuccess && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={18} /> Profile updated successfully!
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="bio-builder-grid">
        {/* Left Column: Editor Form */}
        <form onSubmit={handleSave} className="bio-editor-card">
          {/* Section: Profile Info */}
          <div>
            <h3 className="editor-section-title">Profile Information</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                className="form-input"
                placeholder="e.g. Karsh"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bio">Bio Description</label>
              <textarea
                id="bio"
                className="form-textarea"
                rows={3}
                placeholder="A short introduction about you..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="avatarUrl">Avatar Image URL (Optional)</label>
              <input
                id="avatarUrl"
                type="url"
                className="form-input"
                placeholder="https://example.com/my-photo.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Section: Themes */}
          <div>
            <h3 className="editor-section-title">Choose Theme</h3>
            <div className="theme-picker-grid">
              <div
                className={`theme-card-option ${theme === 'minimal-light' ? 'selected' : ''}`}
                onClick={() => setTheme('minimal-light')}
              >
                <div className="theme-preview-pill pill-light" />
                <span className="theme-name">Minimal Light</span>
              </div>

              <div
                className={`theme-card-option ${theme === 'dark-slate' ? 'selected' : ''}`}
                onClick={() => setTheme('dark-slate')}
              >
                <div className="theme-preview-pill pill-slate" />
                <span className="theme-name">Dark Slate</span>
              </div>

              <div
                className={`theme-card-option ${theme === 'gradient' ? 'selected' : ''}`}
                onClick={() => setTheme('gradient')}
              >
                <div className="theme-preview-pill pill-gradient" />
                <span className="theme-name">Gradient</span>
              </div>
            </div>
          </div>

          {/* Section: Links Manager */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 className="editor-section-title" style={{ marginBottom: 0 }}>Social & Custom Links</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddLink}
              >
                <Plus size={14} /> Add Link
              </button>
            </div>

            {links.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                No custom links added yet. Click "+ Add Link" to add your first button.
              </p>
            ) : (
              <div className="links-editor-list">
                {links.map((item, index) => (
                  <div key={index} className="link-editor-item">
                    <div className="link-editor-row">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Button Label (e.g. GitHub)"
                        value={item.label}
                        onChange={(e) => handleUpdateLink(index, 'label', e.target.value)}
                        required
                      />
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://..."
                        value={item.url}
                        onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                        required
                      />
                    </div>

                    <div className="link-editor-actions">
                      <button
                        type="button"
                        className="btn-icon-sm"
                        disabled={index === 0}
                        onClick={() => handleMoveLink(index, 'up')}
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-sm"
                        disabled={index === links.length - 1}
                        onClick={() => handleMoveLink(index, 'down')}
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-sm btn-delete"
                        onClick={() => handleRemoveLink(index)}
                        title="Delete Link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ width: '100%', padding: '12px' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>

        {/* Right Column: Live Phone Mockup */}
        <div className="phone-preview-wrapper">
          <div className="phone-mockup-frame">
            <div className={`phone-screen theme-${theme}`}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="phone-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="phone-avatar-placeholder">
                  {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              <h2 className="phone-name">{displayName || 'Your Name'}</h2>
              <p className="phone-bio">{bio || 'Your bio description will appear here.'}</p>

              <div className="phone-links-list">
                {links.map((link, idx) => (
                  <div key={idx} className="phone-link-btn">
                    {link.label || 'Untitled Link'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
