import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { linkApi } from '../api/link.api';
import { QRModal } from '../components/QRModal';
import { getErrorMessage } from '../utils/error';
import {
  Link2,
  Copy,
  Check,
  QrCode,
  BarChart3,
  Trash2,
  CornerDownRight,
  Search,
  Calendar,
  MousePointerClick,
} from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Form State
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Copy feedback state { [linkId]: true }
  const [copiedMap, setCopiedMap] = useState({});

  // QR Modal state
  const [qrSelectedLink, setQrSelectedLink] = useState(null);

  const fetchLinks = useCallback(async (targetPage = page, searchTerm = search) => {
    try {
      setLoading(true);
      const data = await linkApi.getLinks({ page: targetPage, limit: 10, search: searchTerm });
      setLinks(data.links || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch links:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchLinks(page, search);
  }, [page, search, fetchLinks]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLinks(1, search);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setCreating(true);

    try {
      await linkApi.createLink({ originalUrl, customSlug });
      setFormSuccess('Link created successfully!');
      setOriginalUrl('');
      setCustomSlug('');
      setPage(1);
      fetchLinks(1, search);
    } catch (err) {
      setFormError(getErrorMessage(err, 'Failed to create short link.'));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this short link?')) return;
    try {
      await linkApi.deleteLink(id);
      fetchLinks(page, search);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete link'));
    }
  };

  const handleCopy = (link) => {
    const url = link.shortUrl || `http://localhost:5000/r/${link.shortCode}`;
    navigator.clipboard.writeText(url);
    setCopiedMap((prev) => ({ ...prev, [link._id || link.id]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [link._id || link.id]: false }));
    }, 2000);
  };

  return (
    <div className="dashboard-container">
      {/* Quick Create Card */}
      <section className="create-card">
        <div className="create-card-header">
          <h2 className="create-card-title">Quick create: Short link</h2>
        </div>

        {formError && <div className="alert alert-danger">{formError}</div>}
        {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

        <form onSubmit={handleCreate}>
          <div className="create-form-row">
            <div className="form-group create-input-url" style={{ marginBottom: 0 }}>
              <input
                type="url"
                className="form-input"
                placeholder="Enter your destination URL (https://example.com/long-page)"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
            </div>

            <div className="form-group create-input-slug" style={{ marginBottom: 0 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Custom alias (optional)"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary create-btn-submit"
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create Com.ly link'}
            </button>
          </div>
        </form>
      </section>

      {/* Links Management Section */}
      <section className="links-section">
        <div className="links-header">
          <h2 className="links-title">
            Your Links <span className="badge badge-gray">{totalCount}</span>
          </h2>

          <form onSubmit={handleSearchSubmit} className="links-search-bar">
            <Search size={15} className="links-search-icon" />
            <input
              type="text"
              className="links-search-input"
              placeholder="Search links or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {/* Link Cards List */}
        {loading ? (
          <div className="empty-state">Loading your links...</div>
        ) : links.length === 0 ? (
          <div className="empty-state">
            <Link2 size={36} color="var(--text-light)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No links found</p>
            <p style={{ fontSize: '13px' }}>Paste a long URL above to generate your first short link.</p>
          </div>
        ) : (
          <div className="link-list">
            {links.map((link) => {
              const linkId = link._id || link.id;
              const shortUrl = link.shortUrl || `http://localhost:5000/r/${link.shortCode}`;
              const isCopied = !!copiedMap[linkId];
              const dateFormatted = new Date(link.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={linkId} className="link-card">
                  <div className="link-card-left">
                    <div className="link-short-row">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link-short-url"
                      >
                        {shortUrl}
                      </a>
                      <button
                        onClick={() => handleCopy(link)}
                        className="btn-icon-copy"
                        title="Copy to clipboard"
                      >
                        {isCopied ? (
                          <Check size={16} color="var(--success)" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>

                    <div className="link-destination-row">
                      <CornerDownRight size={14} color="var(--text-light)" />
                      <span>{link.originalUrl}</span>
                    </div>

                    <div className="link-meta-row">
                      <span className="badge badge-blue">
                        <MousePointerClick size={12} />
                        {link.clicks || 0} clicks
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} />
                        {dateFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="link-card-actions">
                    <button
                      onClick={() => setQrSelectedLink(link)}
                      className="btn-action-icon"
                      title="View QR Code"
                    >
                      <QrCode size={18} />
                    </button>

                    <Link
                      to={`/analytics/${linkId}`}
                      className="btn-action-icon"
                      title="View Analytics"
                    >
                      <BarChart3 size={18} />
                    </Link>

                    <button
                      onClick={() => handleDelete(linkId)}
                      className="btn-action-icon btn-delete"
                      title="Delete link"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="pagination-bar">
            <span>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* QR Modal */}
      <QRModal
        isOpen={!!qrSelectedLink}
        link={qrSelectedLink}
        onClose={() => setQrSelectedLink(null)}
      />
    </div>
  );
};
