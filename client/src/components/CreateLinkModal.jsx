import { useState } from 'react';
import { linkApi } from '../api/link.api';
import { getErrorMessage } from '../utils/error';
import { X, Link2, CheckCircle } from 'lucide-react';

export const CreateLinkModal = ({ isOpen, onClose, onLinkCreated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await linkApi.createLink({ originalUrl, customSlug });
      setSuccess(true);
      setOriginalUrl('');
      setCustomSlug('');
      if (onLinkCreated) onLinkCreated(res.link);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create short link.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link2 size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Create New Short Link</h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} /> Link created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="modalOriginalUrl">Destination URL</label>
            <input
              id="modalOriginalUrl"
              type="url"
              className="form-input"
              placeholder="https://example.com/very-long-url-path"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modalCustomSlug">Custom Alias (Optional)</label>
            <input
              id="modalCustomSlug"
              type="text"
              className="form-input"
              placeholder="e.g. portfolio, summer-deal"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1.5 }}
            >
              {loading ? 'Creating...' : 'Create Short Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
