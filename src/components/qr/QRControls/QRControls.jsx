// src/components/qr/QRControls/QRControls.jsx
import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './QRControls.module.css';

const RESOLUTIONS = [200, 500, 1000, 1500, 2000];
const FORMATS = ['png', 'jpg', 'svg'];

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

  return (
    <div className={styles.controlsContainer}>
      {/* 1. Input de Enlace */}
      <div className={styles.group}>
        <label htmlFor="qr-input-url" className={styles.label}>
          {t.urlLabel}
        </label>
        <input
          id="qr-input-url"
          type="text"
          className={styles.input}
          placeholder={t.urlPlaceholder}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* 2. Selector de Resolución */}
      <div className={styles.group}>
        <span className={styles.label}>{t.resolutionLabel}</span>
        <div className={styles.segmentedGroup}>
          {RESOLUTIONS.map((res) => {
            const isActive = Number(resolution) === res;
            return (
              <button
                key={res}
                type="button"
                className={`${styles.segmentButton} ${isActive ? styles.activeSegment : ''}`}
                onClick={() => onResolutionChange(res)}
              >
                {res}px
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selector de Formato */}
      <div className={styles.group}>
        <span className={styles.label}>{t.formatLabel}</span>
        <div className={styles.segmentedGroup}>
          {FORMATS.map((fmt) => {
            const isActive = format.toLowerCase() === fmt;
            return (
              <button
                key={fmt}
                type="button"
                className={`${styles.segmentButton} ${isActive ? styles.activeSegment : ''}`}
                onClick={() => onFormatChange(fmt)}
              >
                {fmt.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Checkbox Fondo Transparente */}
      <div className={styles.checkboxContainer}>
        <label className={styles.checkboxLabel}>
          <span>{t.transparentLabel}</span>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isTransparent && format !== 'jpg'}
            disabled={format === 'jpg'}
            onChange={(e) => onTransparentChange(e.target.checked)}
          />
        </label>
        {format === 'jpg' && (
          <p className={styles.helperText}>{t.jpgWarning}</p>
        )}
      </div>

      {/* 5. Botón de Descarga */}
      <button
        type="button"
        className={styles.downloadButton}
        onClick={onDownload}
        disabled={!isValidUrl || isDownloading}
      >
        {isDownloading
          ? t.downloading
          : `${t.downloadButton} (${resolution}x${resolution} ${format.toUpperCase()})`}
      </button>
    </div>
  );
};