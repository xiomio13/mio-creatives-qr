// src/components/qr/QRControls/QRControls.jsx
import React from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../../context/LanguageContext";
import styles from "./QRControls.module.css";

const RESOLUTIONS = [200, 500, 1000, 1500, 2000];
const FORMATS = ["png", "jpg", "svg"];

export const QRControls = ({
  url,
  onUrlChange,
  resolution,
  onResolutionChange,
  format,
  onFormatChange,
  isTransparent,
  onTransparentChange,
  onDownload,
  onCopy,
  isDownloading,
  isValidUrl,
}) => {
  const { t } = useLanguage();

  return (
    <div className={styles.controlsContainer}>
      {/* 1. Input de Enlace o Texto */}
      <div className={styles.controlGroup}>
        <div className={styles.urlLabelRow}>
          <label htmlFor="qr-input-url" className={styles.label}>
            {t?.urlLabel || "Enlace web o texto"}
          </label>
        </div>
        <input
          id="qr-input-url"
          type="text"
          className={styles.textInput}
          placeholder={
            t?.urlPlaceholder || "https://ejemplo.com o tu mensaje..."
          }
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* 2. Selector de Resolución */}
      <div className={styles.controlGroup}>
        <span className={styles.label}>
          {t?.resolutionLabel || "Resolución de Descarga"}
        </span>
        <div className={styles.segmentedControl}>
          {RESOLUTIONS.map((res) => {
            const isActive = Number(resolution) === res;
            return (
              <button
                key={res}
                type="button"
                className={`${styles.segmentedButton} ${isActive ? styles.active : ""}`}
                onClick={() => onResolutionChange(res)}
              >
                {res}px
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selector de Formato */}
      <div className={styles.controlGroup}>
        <span className={styles.label}>
          {t?.formatLabel || "Formato de Archivo"}
        </span>
        <div className={styles.segmentedControl}>
          {FORMATS.map((fmt) => {
            const isActive = format.toLowerCase() === fmt;
            return (
              <button
                key={fmt}
                type="button"
                className={`${styles.segmentedButton} ${isActive ? styles.active : ""}`}
                onClick={() => onFormatChange(fmt)}
              >
                {fmt.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Checkbox Fondo Transparente */}
      <div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={isTransparent && format !== "jpg"}
            disabled={format === "jpg"}
            onChange={(e) => onTransparentChange(e.target.checked)}
          />
          <span>{t?.transparentLabel || "Fondo transparente"}</span>
        </label>
        {format === "jpg" && (
          <p className={styles.warningNote}>
            {t?.jpgWarning ||
              "* El formato JPG no soporta transparencia y se genera siempre con fondo blanco."}
          </p>
        )}
      </div>

      {/* 5. Fila de Acciones: Copiar y Descargar */}
      <div className={styles.actionButtonsRow}>
        <button
          type="button"
          className={styles.copyButton}
          onClick={onCopy}
          disabled={!isValidUrl || isDownloading}
          title="Copiar imagen PNG al portapapeles"
          aria-label="Copiar imagen PNG al portapapeles"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copiar
        </button>

        <button
          type="button"
          className={styles.downloadButton}
          onClick={onDownload}
          disabled={!isValidUrl || isDownloading}
        >
          {isDownloading
            ? t?.downloading || "Generando descarga..."
            : `${t?.downloadButton || "Descargar QR"} (${resolution}x${resolution} ${format.toUpperCase()})`}
        </button>
      </div>
    </div>
  );
};

QRControls.propTypes = {
  url: PropTypes.string.isRequired,
  onUrlChange: PropTypes.func.isRequired,
  resolution: PropTypes.number.isRequired,
  onResolutionChange: PropTypes.func.isRequired,
  format: PropTypes.string.isRequired,
  onFormatChange: PropTypes.func.isRequired,
  isTransparent: PropTypes.bool.isRequired,
  onTransparentChange: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  isDownloading: PropTypes.bool.isRequired,
  isValidUrl: PropTypes.bool.isRequired,
};
