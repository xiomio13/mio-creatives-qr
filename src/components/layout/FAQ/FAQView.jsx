// src/components/layout/FAQ/FAQView.jsx
import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import styles from "./FAQView.module.css";

export const FAQView = () => {
  const { t } = useLanguage();
  const faqItems = t?.faqs || [];

  return (
    <section
      className={styles.container}
      aria-label={t?.faqTitle || "Preguntas Frecuentes"}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>
          {t?.faqTitle || "Preguntas Frecuentes y Transparencia"}
        </h2>
        <p className={styles.subtitle}>
          {t?.faqSubtitle ||
            "Todo lo que necesitas saber sobre la privacidad, caducidad y funcionamiento de tus códigos QR."}
        </p>
      </header>

      <div className={styles.faqList}>
        {faqItems.map((item, index) => (
          <details key={index} className={styles.item}>
            <summary className={styles.summary}>{item.q}</summary>
            <p className={styles.answer}>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};
