// src/components/common/Toast/Toast.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Toast.module.css";

export const Toast = ({ message, isVisible, onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!isVisible) return;

    // Desaparece automáticamente después de 3.5 segundos
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible || !message) return null;

  return (
    <div className={styles.toastContainer} role="status" aria-live="polite">
      <div className={styles.toastContent}>
        {/* Icono de Check */}
        <span className={styles.toastIcon} aria-hidden="true">
          ✓
        </span>

        {/* Texto del aviso */}
        <span className={styles.toastText}>{message}</span>

        {/* Botón interactivo para cerrar cuando el usuario lo desee */}
        <button
          type="button"
          className={styles.toastCloseBtn}
          onClick={onClose}
          aria-label="Cerrar notificación"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};
