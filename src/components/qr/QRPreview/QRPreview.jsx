// src/components/qr/QRPreview/QRPreview.jsx
import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useLanguage } from "../../../context/LanguageContext";
import styles from "./QRPreview.module.css";

export const QRPreview = ({
  value,
  color = "#000000",
  onColorChange,
  isTransparent = false,
}) => {
  const { t } = useLanguage();
  const [svgString, setSvgString] = useState("");
  const hasValue = Boolean(value && value.trim().length > 0);

  const defaultColors = [
    { label: t.colors.black, value: "#000000" },
    { label: t.colors.white, value: "#FFFFFF" },
    { label: t.colors.gray, value: "#64748B" },
  ];

  useEffect(() => {
    let active = true;

    if (!hasValue) {
      setSvgString("");
      return;
    }

    QRCode.toString(value.trim(), {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: color,
        light: isTransparent ? "#00000000" : "#FFFFFF",
      },
    })
      .then((svg) => {
        if (active) setSvgString(svg);
      })
      .catch((err) => {
        console.error("Error generando QR:", err);
      });

    return () => {
      active = false;
    };
  }, [value, color, isTransparent, hasValue]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.qrArea}>
        {hasValue && svgString ? (
          <div
            className={styles.qrWrapper}
            style={{
              backgroundColor: isTransparent ? "transparent" : "#FFFFFF",
              border:
                color.toUpperCase() === "#FFFFFF"
                  ? "1px solid #CBD5E1"
                  : undefined,
            }}
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>{t.emptyStateText}</p>
          </div>
        )}
      </div>

      {/* Barra de Color */}
      <div className={styles.colorBarContainer}>
        <div className={styles.presetGroup}>
          {defaultColors.map((c) => {
            const isSelected = color.toLowerCase() === c.value.toLowerCase();
            return (
              <button
                key={c.value}
                type="button"
                className={`${styles.colorChip} ${isSelected ? styles.activeChip : ""}`}
                style={{
                  backgroundColor: c.value,
                  border:
                    c.value === "#FFFFFF"
                      ? "1.5px solid #CBD5E1"
                      : "1.5px solid transparent",
                }}
                onClick={() => onColorChange(c.value)}
                title={c.label}
                aria-label={`${t.colorLabel}: ${c.label}`}
              />
            );
          })}
        </div>

        <label className={styles.pickerWrapper} title={t.customColor}>
          <input
            type="color"
            className={styles.colorPickerInput}
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            aria-label={t.customColor}
          />
          <span className={styles.hexCode}>{color.toUpperCase()}</span>
        </label>
      </div>
    </div>
  );
};
