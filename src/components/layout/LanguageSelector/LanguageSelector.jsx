// src/components/layout/LanguageSelector/LanguageSelector.jsx
import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './LanguageSelector.module.css';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.selectWrapper}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={styles.languageSelect}
          aria-label="Seleccionar idioma / Select language"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>
      </div>
    </div>
  );
};