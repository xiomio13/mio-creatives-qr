import React from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../../context/LanguageContext";
import styles from "./Navigation.module.css";

export const Navigation = ({ activeTab, onTabChange, historyCount = 0 }) => {
  const { t } = useLanguage();

  return (
    <nav className={styles.navContainer} aria-label="Navegación principal">
      <div className={styles.tabGroup} role="tablist">
        {/* Pestaña 1: Generador */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "generator"}
          className={`${styles.tabButton} ${activeTab === "generator" ? styles.activeTab : ""}`}
          onClick={() => onTabChange("generator")}
        >
          <svg
            className={styles.tabIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span className={styles.tabText}>
            {t?.generatorTab || "Generador"}
          </span>
        </button>

        {/* Pestaña 2: Mis Códigos */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "history"}
          className={`${styles.tabButton} ${activeTab === "history" ? styles.activeTab : ""}`}
          onClick={() => onTabChange("history")}
        >
          <svg
            className={styles.tabIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className={styles.tabText}>
            {t?.historyTab || "Mis Códigos"}
          </span>
          {historyCount > 0 && (
            <span
              className={styles.countBadge}
              aria-label={`${historyCount} códigos guardados`}
            >
              {historyCount}
            </span>
          )}
        </button>

        {/* Pestaña 3: Preguntas Frecuentes */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "faq"}
          className={`${styles.tabButton} ${activeTab === "faq" ? styles.activeTab : ""}`}
          onClick={() => onTabChange("faq")}
        >
          <svg
            className={styles.tabIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className={styles.tabText}>{t?.faqTab || "Preguntas"}</span>
        </button>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  historyCount: PropTypes.number,
};
