// src/components/layout/Header.jsx
import React from "react";
import { useLanguage } from "../../context/LanguageContext";

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header
      style={{ textAlign: "center", marginBottom: "1.5rem", width: "100%" }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.75rem",
        }}
      >
        {/* Tu isotipo oficial desde public/logo.svg */}
        <img
          src="/logo.svg"
          alt="Mio Creatives Logo"
          width="64"
          height="64"
          style={{ display: "block", objectFit: "contain" }}
        />

        <h1
          style={{
            fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            fontSize: "1.9rem",
            fontWeight: 700,
            color: "var(--color-text-primary, #0F172A)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {t?.brandTitle || "Mio Creatives"}{" "}
          <span style={{ color: "#7C3AED" }}>{t?.brandBadge || "QR"}</span>
        </h1>
      </div>

      <p
        style={{
          fontFamily: 'var(--font-body, "Inter", sans-serif)',
          fontSize: "0.95rem",
          color: "var(--color-text-secondary, #64748B)",
          maxWidth: "560px",
          margin: "0 auto",
          lineHeight: 1.5,
        }}
      >
        {t?.subtitle ||
          "Generador estático y permanente. Sin enlaces intermediarios, sin suscripciones trampa y sin caducidad."}
      </p>
    </header>
  );
};
