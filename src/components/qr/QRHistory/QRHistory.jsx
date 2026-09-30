// src/components/qr/QRHistory/QRHistory.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './QRHistory.module.css';

const HistoryThumbnail = ({ value, color }) => {
  const [svgMarkup, setSvgMarkup] = useState('');

  useEffect(() => {
    let isMounted = true;
    QRCode.toString(
      value,
      {
        type: 'svg',
        margin: 1,
        color: {
          dark: color || '#000000',
          light: '#00000000',
        },
      },
      (err, svg) => {
        if (!err && isMounted) {
          setSvgMarkup(svg);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [value, color]);

  return (
    <div
      className={styles.qrThumbnail}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
      aria-hidden="true"
    />
  );
};

HistoryThumbnail.propTypes = {
  value: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export const QRHistory = ({
  items = [],
  onSelect,
  onRemove,
  onClear,
  onOpenDownloadModal,
  onUpdateName,
  onGoToGenerator,
}) => {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleStartEditing = (item) => {
    setEditingId(item.id);
    setEditingText(item.name || item.value);
  };

  const handleSaveName = (id) => {
    if (onUpdateName) {
      onUpdateName(id, editingText.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveName(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  // Estado vacío estructurado y accesible
  if (!items || items.length === 0) {
    return (
      <section className={styles.historyContainer} aria-label="Historial de códigos">
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No tienes códigos guardados todavía</h3>
          <p className={styles.emptyText}>
            Cada código QR que generes y descargues se guardará automáticamente aquí en tu navegador para que puedas re-exportarlo en cualquier formato cuando lo necesites.
          </p>
          <button
            type="button"
            className={styles.goToGeneratorButton}
            onClick={onGoToGenerator}
          >
            Crear mi primer código QR
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.historyContainer} aria-label={t?.historyTitle || 'Mis Códigos Guardados'}>
      <div className={styles.historyHeader}>
        <h3 className={styles.title}>
          Mis Códigos Guardados ({items.length})
        </h3>
        <button
          type="button"
          onClick={onClear}
          className={styles.clearButton}
          aria-label={t?.clearHistory || 'Borrar todo el historial'}
        >
          {t?.clearHistory || 'Borrar todo'}
        </button>
      </div>

      <ul className={styles.historyList}>
        {items.map((item) => (
          <li key={item.id} className={styles.historyCard}>
            <div
              onClick={() => onSelect(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(item)}
              title="Cargar en el Generador"
              style={{ cursor: 'pointer' }}
            >
              <HistoryThumbnail value={item.value} color={item.color} />
            </div>

            <div className={styles.cardContent}>
              <div className={styles.titleRow}>
                {editingId === item.id ? (
                  <input
                    type="text"
                    className={styles.nameInput}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => handleSaveName(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    autoFocus
                    maxLength={40}
                  />
                ) : (
                  <>
                    <h4 className={styles.itemName} title={item.name || item.value}>
                      {item.name || item.value}
                    </h4>
                    <button
                      type="button"
                      className={styles.editIconButton}
                      onClick={() => handleStartEditing(item)}
                      aria-label="Editar nombre del QR"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              <span className={styles.itemUrl} title={item.value}>
                {item.value}
              </span>

              <div className={styles.metaRow}>
                <span>{item.date}</span>
                <span>•</span>
                <span>Último formato: {item.format?.toUpperCase()} ({item.size}px)</span>
              </div>
            </div>

            <div className={styles.actionGroup}>
              <button
                type="button"
                className={styles.downloadActionButton}
                onClick={() => onOpenDownloadModal(item)}
                aria-label={`Exportar ${item.name || item.value}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar
              </button>

              <button
                type="button"
                className={styles.removeButton}
                onClick={() => onRemove(item.id)}
                aria-label={`Eliminar ${item.name || item.value}`}
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

QRHistory.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      name: PropTypes.string,
      color: PropTypes.string,
      format: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      isTransparent: PropTypes.bool,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onOpenDownloadModal: PropTypes.func.isRequired,
  onUpdateName: PropTypes.func.isRequired,
  onGoToGenerator: PropTypes.func.isRequired,
};