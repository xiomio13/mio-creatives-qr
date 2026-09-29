// src/components/layout/Footer.jsx
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

export const Footer = () => {
  const { t } = useLanguage();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footerContainer}>
      <p className={styles.copyText}>
        © {new Date().getFullYear()} Mio Creatives. {t?.footerNote || 'Generación local y privada sin cookies ni rastreo.'}
      </p>
      <div className={styles.linksRow}>
        <a
          href="https://github.com/xiomio13/Mio-creatives-qr"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkItem}
        >
          • {t?.openCode || 'Código abierto'}
        </a>
        <span className={styles.separator}>•</span>
        <button
          type="button"
          onClick={handleScrollTop}
          className={styles.scrollButton}
        >
          {t?.backToTop || 'Volver arriba'}
        </button>
      </div>
    </footer>
  );
};