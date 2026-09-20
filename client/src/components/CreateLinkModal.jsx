import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { linkApi } from '../api/link.api';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../utils/error';
import { X, Link2 } from 'lucide-react';


export const CreateLinkModal = ({ isOpen, onClose, onLinkCreated }) => {
  const { showToast } = useToast();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setError('');
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);


  if (!isOpen && !isClosing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await linkApi.createLink({ originalUrl, customSlug });
      setOriginalUrl('');
      setCustomSlug('');
      if (onLinkCreated) onLinkCreated(res.link);
      handleClose();
      showToast('Link created successfully!', 'success');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create short link.'));
    } finally {
      setLoading(false);
    }
  };

  const modalElement = (
    <div className={`modal-overlay ${isClosing ? 'modal-exit' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link2 size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Create New Short Link</h3>
          </div>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

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
              onClick={handleClose}
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

  return typeof document !== 'undefined'
    ? createPortal(modalElement, document.body)
    : null;
};

