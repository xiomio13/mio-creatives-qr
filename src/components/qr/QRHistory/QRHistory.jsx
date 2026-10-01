// src/components/qr/QRHistory/QRHistory.jsx
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode";
import { useLanguage } from "../../../context/LanguageContext";
import styles from "./QRHistory.module.css";

const ITEMS_PER_PAGE = 10;

const HistoryThumbnail = ({ value, color }) => {
  const [svgMarkup, setSvgMarkup] = useState("");

  useEffect(() => {
    let isMounted = true;
    QRCode.toString(
      value,
      {
        type: "svg",
        margin: 1,
        color: {
          dark: color || "#000000",
          light: "#00000000",
        },
      },
      (err, svg) => {
        if (!err && isMounted) {
          setSvgMarkup(svg);
        }
      },
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
  const [editingText, setEditingText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Cálculo de paginación O(1) en memoria
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (validPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, validPage]);

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
    if (e.key === "Enter") handleSaveName(id);
    if (e.key === "Escape") setEditingId(null);
  };

  // 1. Estado vacío: Botón conectado que lleva al generador
  if (!items || items.length === 0) {
    return (
      <section
        className={styles.historyContainer}
        aria-label="Historial de códigos"
      >
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>
            No tienes códigos guardados todavía
          </h3>
          <p className={styles.emptyText}>
            Cada código QR que generes y descargues se guardará automáticamente
            aquí en tu navegador para que puedas re-exportarlo en cualquier
            formato cuando lo necesites.
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

  const startCount = (validPage - 1) * ITEMS_PER_PAGE + 1;
  const endCount = Math.min(validPage * ITEMS_PER_PAGE, items.length);

  return (
    <section
      className={styles.historyContainer}
      aria-label={t?.historyTitle || "Mis Códigos Guardados"}
    >
      {/* Cabecera con botón "+ Nuevo QR" y acción "Borrar todo" */}
      <div className={styles.historyHeader}>
        <h3 className={styles.title}>Mis Códigos Guardados ({items.length})</h3>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.createIconButton}
            onClick={onGoToGenerator}
            title="Crear un nuevo código QR"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo QR
          </button>

          <button
            type="button"
            onClick={onClear}
            className={styles.clearButton}
            aria-label="Borrar todo el historial"
          >
            {t?.clearHistory || "Borrar todo"}
          </button>
        </div>
      </div>

      {/* Lista de Códigos (Límite visual de 10 ítems) */}
      <ul className={styles.historyList}>
        {paginatedItems.map((item) => (
          <li key={item.id} className={styles.historyCard}>
            <div
              onClick={() => onSelect(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelect(item)}
              title="Cargar en el Generador"
              style={{ cursor: "pointer" }}
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
                    <h4
                      className={styles.itemName}
                      title={item.name || item.value}
                    >
                      {item.name || item.value}
                    </h4>
                    <button
                      type="button"
                      className={styles.editIconButton}
                      onClick={() => handleStartEditing(item)}
                      aria-label="Editar nombre del QR"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
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
                <span>
                  Último formato: {item.format?.toUpperCase()} ({item.size}px)
                </span>
              </div>
            </div>

            <div className={styles.actionGroup}>
              <button
                type="button"
                className={styles.downloadActionButton}
                onClick={() => onOpenDownloadModal(item)}
                aria-label={`Exportar ${item.name || item.value}`}
              >
                <svg
                  width="15"
                  height="15"
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

      {/* Paginador (se activa solo si hay más de 10 códigos guardados) */}
      {items.length > ITEMS_PER_PAGE && (
        <div className={styles.paginationFooter}>
          <span>
            Mostrando{" "}
            <strong>
              {startCount} - {endCount}
            </strong>{" "}
            de <strong>{items.length}</strong> códigos
          </span>

          <div className={styles.paginationControls}>
            <button
              type="button"
              className={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage === 1}
            >
              Anterior
            </button>
            <span className={styles.pageInfo}>
              {validPage} / {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
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
    }),
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onOpenDownloadModal: PropTypes.func.isRequired,
  onUpdateName: PropTypes.func.isRequired,
  onGoToGenerator: PropTypes.func.isRequired,
};
