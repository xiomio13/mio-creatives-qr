// src/components/layout/LanguageSelector/LanguageSelector.jsx
import { useLanguage } from "../../../context/LanguageContext";
import styles from "./LanguageSelector.module.css";

const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

export const LanguageSelector = () => {
  const context = useLanguage();

  // Compatibilidad defensiva con la función del contexto
  const currentLang = context?.language || "es";
  const handleLangChange =
    context?.changeLanguage || context?.setLanguage || (() => {});

  return (
    <div className={styles.selectorWrapper}>
      <label htmlFor="language-switcher" className="sr-only">
        Cambiar idioma
      </label>
      <div className={styles.selectContainer}>
        <select
          id="language-switcher"
          value={currentLang}
          onChange={(e) => handleLangChange(e.target.value)}
          className={styles.select}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <svg
          className={styles.arrowIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};
