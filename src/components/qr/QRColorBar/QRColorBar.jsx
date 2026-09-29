// src/components/qr/QRColorBar/QRColorBar.jsx
import React from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../../context/LanguageContext";
import styles from "./QRColorBar.module.css";

const DEFAULT_COLORS = [
  { key: "black", value: "#000000" },
  { key: "white", value: "#FFFFFF" },
  { key: "gray", value: "#64748B" },
];

export const QRColorBar = ({ color, onChange }) => {
  const { t } = useLanguage();

  return (
    <div className={styles.colorBarContainer}>
      <div className={styles.presetGroup}>
        {DEFAULT_COLORS.map((c) => {
          const isSelected = color.toLowerCase() === c.value.toLowerCase();
          const label = t?.colors?.[c.key] || c.key;

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
              onClick={() => onChange(c.value)}
              title={label}
              aria-label={`${t?.colorLabel || "Color"}: ${label}`}
            />
          );
        })}
      </div>

      <label
        className={styles.pickerWrapper}
        title={t?.customColor || "Personalizado"}
      >
        <input
          type="color"
          className={styles.colorPickerInput}
          value={color}
          onChange={(e) => onChange(e.target.value)}
          aria-label={t?.customColor || "Personalizado"}
        />
        <span className={styles.hexCode}>{color.toUpperCase()}</span>
      </label>
    </div>
  );
};

QRColorBar.propTypes = {
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
