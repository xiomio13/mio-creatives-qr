// src/components/qr/QRControls/QRControls.jsx
import React from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../../context/LanguageContext";
import styles from "./QRControls.module.css";

const RESOLUTION_OPTIONS = [200, 500, 1000, 1500, 2000];
const FORMAT_OPTIONS = ["png", "jpg", "svg"];

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
  const isJpg = format.toLowerCase() === "jpg";

  return (
    <div className={styles.controlsContainer}>
      {/* 1. Grupo de Entrada de URL o Texto */}
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
        <div
          className={styles.segmentedControl}
          role="radiogroup"
          aria-label="Resolución"
        >
          {RESOLUTION_OPTIONS.map((res) => {
            const isActive = Number(resolution) === res;
            return (
              <button
                key={res}
                type="button"
                role="radio"
                aria-checked={isActive}
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
        <div
          className={styles.segmentedControl}
          role="radiogroup"
          aria-label="Formato"
        >
          {FORMAT_OPTIONS.map((fmt) => {
            const isActive = format.toLowerCase() === fmt;
            return (
              <button
                key={fmt}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`${styles.segmentedButton} ${isActive ? styles.active : ""}`}
                onClick={() => onFormatChange(fmt)}
              >
                {fmt.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Checkbox de Fondo Transparente */}
      <div className={styles.controlGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={isTransparent && !isJpg}
            disabled={isJpg}
            onChange={(e) => onTransparentChange(e.target.checked)}
          />
          <span>{t?.transparentLabel || "Fondo transparente"}</span>
        </label>
        {isJpg && (
          <p className={styles.warningNote}>
            {t?.jpgWarning ||
              "* El formato JPG no soporta transparencia y se genera siempre con fondo blanco."}
          </p>
        )}
      </div>

      {/* 5. Acciones: Botón Copiar + Botón Descargar */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          width: "100%",
          marginTop: "0.5rem",
        }}
      >
        <button
          type="button"
          onClick={onCopy}
          disabled={!isValidUrl || isDownloading}
          style={{
            minHeight: "52px",
            padding: "0 1.25rem",
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            color: "#0F172A",
            fontFamily: "inherit",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: !isValidUrl ? "not-allowed" : "pointer",
            opacity: !isValidUrl ? 0.45 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 150ms ease",
            flexShrink: 0,
          }}
          aria-label={t?.copyButton || "Copiar"}
        >
          <svg
            width="18"
            height="18"
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
          {t?.copyButton || "Copiar"}
        </button>

        <button
          type="button"
          className={styles.downloadButton}
          onClick={onDownload}
          disabled={!isValidUrl || isDownloading}
          style={{ flex: 1, margin: 0 }}
        >
          {isDownloading
            ? t?.downloading || "Generando descarga..."
            : `${t?.downloadButton || "Descargar QR"} (${resolution}×${resolution} ${format.toUpperCase()})`}
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
