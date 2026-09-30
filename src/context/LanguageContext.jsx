// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  es: {
    // Header
    brandTitle: 'Mio Creatives',
    brandBadge: 'QR',
    subtitle: 'Generador estático y permanente. Sin enlaces intermediarios, sin suscripciones trampa y sin caducidad.',

    // Preview
    emptyStateText: 'Ingresa un enlace o texto para generar tu código QR permanente.',
    colorLabel: 'Color del QR',
    customColor: 'Personalizado',
    colors: {
      black: 'Negro',
      white: 'Blanco',
      gray: 'Gris',
    },

    // Controls
    urlLabel: 'Enlace web o texto',
    urlPlaceholder: 'https://ejemplo.com o tu mensaje...',
    resolutionLabel: 'Resolución de Descarga',
    formatLabel: 'Formato de Archivo',
    transparentLabel: 'Fondo transparente',
    jpgWarning: 'El formato JPG no soporta transparencia y se genera siempre con fondo blanco.',
    downloadButton: 'Descargar QR',
    downloading: 'Generando descarga...',

    // History (Nuevos campos para QRHistory)
    historyTitle: 'Historial Reciente',
    clearHistory: 'Borrar todo',

    // Footer
    footerNote: 'Generación local y privada sin cookies ni rastreo.',
    openCode: 'Código abierto',
    backToTop: 'Volver arriba',
  },
  en: {
    // Header
    brandTitle: 'Mio Creatives',
    brandBadge: 'QR',
    subtitle: 'Static and permanent generator. No redirect links, no subscription traps, and no expiration.',

    // Preview
    emptyStateText: 'Enter a link or text to generate your permanent QR code.',
    colorLabel: 'QR Color',
    customColor: 'Custom',
    colors: {
      black: 'Black',
      white: 'White',
      gray: 'Gray',
    },

    // Controls
    urlLabel: 'Web link or text',
    urlPlaceholder: 'https://example.com or your message...',
    resolutionLabel: 'Download Resolution',
    formatLabel: 'File Format',
    transparentLabel: 'Transparent background',
    jpgWarning: 'JPG format does not support transparency and always renders with a white background.',
    downloadButton: 'Download QR',
    downloading: 'Generating download...',

    // History (Nuevos campos para QRHistory)
    historyTitle: 'Recent History',
    clearHistory: 'Clear all',

    // Footer
    footerNote: 'Local and private generation with zero cookies or tracking.',
    openCode: 'Open Source',
    backToTop: 'Back to top',
  },
  pt: {
    // Header
    brandTitle: 'Mio Creatives',
    brandBadge: 'QR',
    subtitle: 'Gerador estático e permanente. Sem links intermediários, sem armadilhas de assinatura e sem expiração.',

    // Preview
    emptyStateText: 'Insira um link ou texto para gerar seu código QR permanente.',
    colorLabel: 'Cor do QR',
    customColor: 'Personalizado',
    colors: {
      black: 'Preto',
      white: 'Branco',
      gray: 'Cinza',
    },

    // Controls
    urlLabel: 'Link da web ou texto',
    urlPlaceholder: 'https://exemplo.com ou sua mensagem...',
    resolutionLabel: 'Resolução de Download',
    formatLabel: 'Formato do Arquivo',
    transparentLabel: 'Fundo transparente',
    jpgWarning: 'O formato JPG não suporta transparência e sempre gera com fundo branco.',
    downloadButton: 'Baixar QR',
    downloading: 'Gerando download...',

    // History (Nuevos campos para QRHistory)
    historyTitle: 'Histórico Recente',
    clearHistory: 'Limpar tudo',

    // Footer
    footerNote: 'Geração local e privada sem cookies ou rastreamento.',
    openCode: 'Código aberto',
    backToTop: 'Voltar ao topo',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('mio_qr_lang') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('mio_qr_lang', language);
  }, [language]);

  const t = translations[language] || translations.es;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser utilizado dentro de un LanguageProvider');
  }
  return context;
};