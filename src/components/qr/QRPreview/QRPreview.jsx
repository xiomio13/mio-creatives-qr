// src/components/qr/QRPreview/QRPreview.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import { useLanguage } from '../../../context/LanguageContext';
import { QRColorBar } from '../QRColorBar/QRColorBar';
import styles from './QRPreview.module.css';

export const QRPreview = ({
  value,
  color = '#000000',
  onColorChange,
  isTransparent = false,
  onReady,
}) => {
  const { t } = useLanguage();
  const [svgString, setSvgString] = useState('');
  const hasValue = Boolean(value && value.trim().length > 0);

  useEffect(() => {
    let active = true;

    if (!hasValue) {
      setSvgString('');
      if (onReady) onReady(null);
      return;
    }

    QRCode.toString(value.trim(), {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: color,
        light: isTransparent ? '#00000000' : '#FFFFFF',
      },
    })
      .then((svg) => {
        if (active) {
          setSvgString(svg);
          if (onReady) onReady(svg);
        }
      })
      .catch((err) => {
        console.error('Error generando QR:', err);
        if (onReady) onReady(null);
      });

    return () => {
      active = false;
    };
  }, [value, color, isTransparent, hasValue, onReady]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.qrArea}>
        {hasValue && svgString ? (
          <div
            className={styles.qrWrapper}
            style={{
              backgroundColor: isTransparent ? 'transparent' : '#FFFFFF',
              border: color.toUpperCase() === '#FFFFFF' ? '1.5px solid #CBD5E1' : undefined,
            }}
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>{t.emptyStateText}</p>
          </div>
        )}
      </div>

      <QRColorBar color={color} onChange={onColorChange} />
    </div>
  );
};

QRPreview.propTypes = {
  value: PropTypes.string,
  color: PropTypes.string,
  onColorChange: PropTypes.func.isRequired,
  isTransparent: PropTypes.bool,
  onReady: PropTypes.func,
};