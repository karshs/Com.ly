import React from 'react';
import QRCode from 'react-qr-code';
import { X, Download, Copy, Check } from 'lucide-react';
import './QRModal.css';

export const QRModal = ({ isOpen, onClose, link }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !link) return null;

  const shortUrl = link.shortUrl || `http://localhost:5000/r/${link.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.getElementById('comly-qr-code');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comly-qr-${link.shortCode}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>QR Code</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="qr-modal-body">
          <div className="qr-code-wrapper">
            <QRCode
              id="comly-qr-code"
              value={shortUrl}
              size={180}
              level="H"
            />
          </div>

          <div className="qr-link-display">
            {shortUrl}
          </div>

          <div className="qr-actions">
            <button
              onClick={handleCopy}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <Download size={16} />
              <span>Download SVG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
