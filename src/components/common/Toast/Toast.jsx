// src/components/common/Toast/Toast.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Toast.module.css";

export const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={styles.toastWrapper} role="status" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>

      <span className={styles.message}>{message}</span>

      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        &times;
      </button>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Toast;
