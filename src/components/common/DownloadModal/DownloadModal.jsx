// src/components/common/DownloadModal/DownloadModal.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./DownloadModal.module.css";

export const DownloadModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialFormat = "png",
  initialSize = 500,
}) => {
  const [format, setFormat] = useState(initialFormat);
  const [size, setSize] = useState(initialSize);

  if (!isOpen) return null;

  const handleDownload = () => {
    onConfirm({ format, size: Number(size) });
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Descargar Código QR</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <p className={styles.subtitle}>
          Selecciona el formato y la resolución deseada
        </p>

        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <label htmlFor="modal-format" className={styles.label}>
              Formato
            </label>
            <select
              id="modal-format"
              className={styles.select}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="svg">SVG</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="modal-size" className={styles.label}>
              Tamaño
            </label>
            <select
              id="modal-size"
              className={styles.select}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              <option value={200}>200×200 px</option>
              <option value={500}>500×500 px</option>
              <option value={1000}>1000×1000 px</option>
              <option value={1500}>1500×1500 px</option>
              <option value={2000}>2000×2000 px</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className={styles.downloadButton}
          onClick={handleDownload}
        >
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar ahora
        </button>
      </div>
    </div>
  );
};

// Export por defecto adicional para garantizar compatibilidad total
export default DownloadModal;

DownloadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  initialFormat: PropTypes.string,
  initialSize: PropTypes.number,
};
