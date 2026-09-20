import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'react-qr-code';
import { X, Download, Copy, Check } from 'lucide-react';
import './QRModal.css';


export const QRModal = ({ isOpen, onClose, link }) => {
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeLink, setActiveLink] = useState(link);

  useEffect(() => {
    if (isOpen && link) {
      setActiveLink(link);
      setIsClosing(false);
    }
  }, [isOpen, link]);

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
  if (!activeLink) return null;

  const shortUrl = activeLink.shortUrl || `http://localhost:5000/r/${activeLink.shortCode}`;

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
    a.download = `comly-qr-${activeLink.shortCode}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const modalElement = (
    <div className={`modal-overlay ${isClosing ? 'modal-exit' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>QR Code</h3>
          <button className="modal-close" onClick={handleClose}>
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

  return typeof document !== 'undefined'
    ? createPortal(modalElement, document.body)
    : null;
};

