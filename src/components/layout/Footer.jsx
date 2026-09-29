// src/components/layout/Footer.jsx
import React from "react";
import { useLanguage } from "../../context/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "2rem 1rem 3rem",
        width: "100%",
        fontFamily: 'var(--font-body, "Inter", sans-serif)',
        fontSize: "0.85rem",
        color: "var(--color-text-secondary, #64748B)",
        boxSizing: "border-box",
      }}
    >
      <p style={{ margin: "0 0 0.5rem 0" }}>
        © {new Date().getFullYear()} Mio Creatives.{" "}
        {t?.footerNote || "Generación local y privada sin cookies ni rastreo."}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "inherit",
            textDecoration: "none",
            transition: "color 150ms ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#FF5500")}
          onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}
        >
          • {t?.openCode || "Código abierto"}
        </a>
        <span>•</span>
        <button
          type="button"
          onClick={handleScrollTop}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            font: "inherit",
            cursor: "pointer",
            padding: 0,
            textDecoration: "none",
            transition: "color 150ms ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#FF5500")}
          onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}
        >
          {t?.backToTop || "Volver arriba"}
        </button>
      </div>
    </footer>
  );
};
