// src/components/qr/QRControls/QRControls.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../../context/LanguageContext";
import { analyzeContent } from "../../../utils/urlValidator";
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
  isDownloading,
  isValidUrl,
}) => {
  const { t } = useLanguage();

  // Análisis semántico reactivo en memoria
  const contentInfo = useMemo(() => analyzeContent(url), [url]);

  return (
    <div className={styles.controlsContainer}>
      {/* Campo de texto con badge semántico */}
      <div className={styles.controlGroup}>
        <div className={styles.urlLabelRow}>
          <label htmlFor="qr-input-url" className={styles.label}>
            {t?.urlLabel || "Enlace web o texto"}
          </label>
          {url.trim().length > 0 && (
            <span className={styles.typeBadge} aria-hidden="true">
              <span>{contentInfo.icon}</span>
              <span>{contentInfo.label}</span>
            </span>
          )}
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
          aria-describedby={contentInfo.hint ? "url-semantic-hint" : undefined}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Sugerencia no intrusiva */}
        {contentInfo.hint && (
          <div
            id="url-semantic-hint"
            className={styles.semanticHint}
            role="status"
            aria-live="polite"
          >
            <span>💡</span>
            <span>{contentInfo.hint}</span>
          </div>
        )}
      </div>

      {/* Selector de Resolución */}
      <div className={styles.controlGroup}>
        <label className={styles.label}>
          {t?.resolutionLabel || "Resolución de Descarga"}
        </label>
        <div
          className={styles.segmentedControl}
          role="radiogroup"
          aria-label="Resolución de descarga"
        >
          {RESOLUTION_OPTIONS.map((res) => {
            const isSelected = Number(resolution) === res;
            return (
              <button
                key={res}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`${styles.segmentedButton} ${isSelected ? styles.active : ""}`}
                onClick={() => onResolutionChange(res)}
              >
                {res}px
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de Formato */}
      <div className={styles.controlGroup}>
        <label className={styles.label}>
          {t?.formatLabel || "Formato de Archivo"}
        </label>
        <div
          className={styles.segmentedControl}
          role="radiogroup"
          aria-label="Formato de exportación"
        >
          {FORMAT_OPTIONS.map((fmt) => {
            const isSelected = format === fmt;
            return (
              <button
                key={fmt}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`${styles.segmentedButton} ${isSelected ? styles.active : ""}`}
                onClick={() => onFormatChange(fmt)}
              >
                {fmt.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle de Transparencia */}
      <div className={styles.controlGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={format === "jpg" ? false : isTransparent}
            disabled={format === "jpg"}
            onChange={(e) => onTransparentChange(e.target.checked)}
          />
          <span>{t?.transparentLabel || "Fondo transparente"}</span>
        </label>

        {format === "jpg" && (
          <p className={styles.warningNote}>
            {t?.jpgWarning ||
              "El formato JPG no soporta transparencia y se genera siempre con fondo blanco."}
          </p>
        )}
      </div>

      {/* Botón Principal de Descarga */}
      <button
        type="button"
        className={styles.downloadButton}
        disabled={!isValidUrl || isDownloading}
        onClick={onDownload}
      >
        {isDownloading ? (
          <span>{t?.downloading || "Generando descarga..."}</span>
        ) : (
          <span>
            {t?.downloadButton || "Descargar QR"} ({resolution}×{resolution}{" "}
            {format.toUpperCase()})
          </span>
        )}
      </button>
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
  isDownloading: PropTypes.bool.isRequired,
  isValidUrl: PropTypes.bool.isRequired,
};
