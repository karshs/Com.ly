import { createContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef(null);
  const exitTimerRef = useRef(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    setIsExiting(true);
    timerRef.current = setTimeout(() => {
      setToast(null);
      setIsExiting(false);
    }, 300);
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    // Clear any existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    setIsExiting(false);
    setToast({ message, type });

    // Trigger smooth exit animation after the main duration
    exitTimerRef.current = setTimeout(() => {
      setIsExiting(true);
    }, duration);

    // Unmount from DOM after exit animation finishes
    timerRef.current = setTimeout(() => {
      setToast(null);
      setIsExiting(false);
    }, duration + 300);
  }, []);

  const toastElement = toast ? (
    <div
      className={`toast-floating toast-${toast.type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      onClick={hideToast}
      style={{ cursor: 'pointer' }}
    >
      {toast.type === 'success' ? (
        <CheckCircle size={18} />
      ) : (
        <AlertCircle size={18} />
      )}
      <span>{toast.message}</span>
      <X size={14} style={{ marginLeft: 6, opacity: 0.7 }} />
    </div>
  ) : null;

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {typeof document !== 'undefined' && toastElement
        ? createPortal(toastElement, document.body)
        : null}
    </ToastContext.Provider>
  );
};

