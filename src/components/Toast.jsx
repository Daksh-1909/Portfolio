import React, { useEffect } from 'react';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast ${type === 'error' ? 'toast-error' : ''}`}>
      <span className="toast-icon">
        <i className={type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'}></i>
      </span>
      <p>{message}</p>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
