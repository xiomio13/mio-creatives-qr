// src/components/layout/Header.jsx
import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./Header.module.css";

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.brandWrapper}>
        <img
          src="/logo.svg"
          alt="Mio Creatives Logo"
          width="64"
          height="64"
          className={styles.logo}
        />

        <h1 className={styles.title}>
          {t?.brandTitle || "Mio Creatives"}{" "}
          <span className={styles.badge}>{t?.brandBadge || "QR"}</span>
        </h1>
      </div>

      <p className={styles.subtitle}>
        {t?.subtitle ||
          "Generador estático y permanente. Sin enlaces intermediarios, sin suscripciones trampa y sin caducidad."}
      </p>
    </header>
  );
};
