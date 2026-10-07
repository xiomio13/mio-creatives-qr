// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

const translations = {
  es: {
    // Encabezado y Navegación
    brandTitle: "Mio Creatives",
    brandBadge: "QR",
    subtitle:
      "Generador estático y permanente. Sin enlaces intermediarios, sin suscripciones trampa y sin caducidad.",
    generatorTab: "Generador",
    historyTab: "Mis Códigos",
    faqTab: "Preguntas Frecuentes",

    // Previsualización y Color
    emptyStateText:
      "Ingresa un enlace o texto para generar tu código QR permanente.",
    colorLabel: "Color del QR",
    customColor: "Personalizado",
    colors: {
      black: "Negro",
      white: "Blanco",
      gray: "Gris",
    },

    // Controles del Generador
    urlLabel: "Enlace web o texto",
    urlPlaceholder: "https://ejemplo.com o tu mensaje...",
    resolutionLabel: "Resolución de Descarga",
    formatLabel: "Formato de Archivo",
    transparentLabel: "Fondo transparente",
    jpgWarning:
      "* El formato JPG no soporta transparencia y se genera siempre con fondo blanco.",
    copyButton: "Copiar",
    copiedToast: "¡Código QR copiado al portapapeles!",
    downloadButton: "Descargar QR",
    downloading: "Generando descarga...",

    // Historial (Mis Códigos)
    historyTitle: "Mis Códigos Guardados",
    newQrBtn: "Nuevo QR",
    clearHistory: "Borrar todo",
    emptyHistoryTitle: "No tienes códigos guardados todavía",
    emptyHistoryText:
      "Cada código QR que generes y descargues se guardará automáticamente en este navegador.",
    createFirstQr: "Crear mi primer código QR",
    downloadAction: "Descargar",
    historyPrivacyNotice:
      "Tus códigos se guardan de forma 100% privada únicamente en este dispositivo. Si borras el historial o los datos de navegación de tu navegador, esta lista se reiniciará.",

    // Modal de Re-descarga
    modalTitle: "Descargar Código QR",
    modalSubtitle: "Selecciona el formato y la resolución deseada",
    modalFormat: "Formato",
    modalSize: "Tamaño",
    modalDownloadNow: "Descargar ahora",

    // Preguntas Frecuentes (FAQ)
    faqTitle: "Preguntas Frecuentes y Transparencia",
    faqSubtitle:
      "Todo lo que necesitas saber sobre la privacidad, caducidad y funcionamiento de tus códigos QR.",
    faqs: [
      {
        q: "¿Mis códigos QR caducan o tienen un límite de escaneos?",
        a: "No, jamás. Nuestros códigos son 100% estáticos. La información se graba directamente en la matriz gráfica de la imagen, por lo que funcionarán de por vida sin límites de escaneo y sin depender de suscripciones ni servidores intermedios.",
      },
      {
        q: "¿Mio Creatives QR es realmente 100% gratuito?",
        a: "Es completamente gratuito y sin costos ocultos. No requerimos tarjeta de crédito, registros ni planes de pago. La aplicación procesa todo en tu propio dispositivo sin mantener servidores costosos.",
      },
      {
        q: "¿Tienen acceso a mis datos o ven la información que genero?",
        a: "No, tu privacidad es absoluta. El proceso ocurre enteramente en tu navegador (Client-Side). Ningún texto, URL o información se envía ni almacena en bases de datos externas.",
      },
      {
        q: '¿Dónde se guardan los códigos de "Mis Códigos"?',
        a: "Se guardan en la memoria local de este navegador (localStorage). Nadie más puede acceder a ellos. Ten en cuenta que si realizas una limpieza del historial o datos de navegación, la lista local se limpiará.",
      },
      {
        q: "¿Qué formato y resolución debo descargar para imprimir?",
        a: "Para uso digital o redes sociales, PNG es perfecto. Para impresiones físicas (volantes, afiches, vinilos o lonas), recomendamos SVG (vectorial infinito) o la resolución PNG de 2000px para garantizar nitidez sin pixelarse.",
      },
    ],

    // Pie de página
    footerNote: "Generación local y privada sin cookies ni rastreo.",
    openCode: "Código abierto",
    backToTop: "Volver arriba",
  },

  en: {
    // Header & Navigation
    brandTitle: "Mio Creatives",
    brandBadge: "QR",
    subtitle:
      "Static and permanent generator. No redirect links, no subscription traps, and no expiration.",
    generatorTab: "Generator",
    historyTab: "My Codes",
    faqTab: "FAQ",

    // Preview & Color
    emptyStateText: "Enter a link or text to generate your permanent QR code.",
    colorLabel: "QR Color",
    customColor: "Custom",
    colors: {
      black: "Black",
      white: "White",
      gray: "Gray",
    },

    // Generator Controls
    urlLabel: "Web link or text",
    urlPlaceholder: "https://example.com or your message...",
    resolutionLabel: "Download Resolution",
    formatLabel: "File Format",
    transparentLabel: "Transparent background",
    jpgWarning:
      "* JPG format does not support transparency and always renders with a white background.",
    copyButton: "Copy",
    copiedToast: "QR code copied to clipboard!",
    downloadButton: "Download QR",
    downloading: "Generating download...",

    // History (My Codes)
    historyTitle: "My Saved Codes",
    newQrBtn: "New QR",
    clearHistory: "Clear all",
    emptyHistoryTitle: "You have no saved codes yet",
    emptyHistoryText:
      "Every QR code you generate and download is automatically saved in this browser.",
    createFirstQr: "Create my first QR code",
    downloadAction: "Download",
    historyPrivacyNotice:
      "Your codes are stored 100% privately on this device only. If you clear your browser history or cache, this list will be reset.",

    // Re-download Modal
    modalTitle: "Download QR Code",
    modalSubtitle: "Select your preferred format and resolution",
    modalFormat: "Format",
    modalSize: "Size",
    modalDownloadNow: "Download now",

    // FAQ
    faqTitle: "Frequently Asked Questions & Transparency",
    faqSubtitle:
      "Everything you need to know about privacy, permanence, and how your QR codes work.",
    faqs: [
      {
        q: "Do my QR codes expire or have a scan limit?",
        a: "No, never. Our codes are 100% static. Data is encoded directly into the image matrix, meaning they will work permanently with unlimited scans and without any subscription fees.",
      },
      {
        q: "Is Mio Creatives QR truly 100% free?",
        a: "It is completely free with no hidden catches. We do not require credit cards, accounts, or paid plans. Processing occurs right inside your browser without expensive backends.",
      },
      {
        q: "Do you have access to my data or generated links?",
        a: "No, your privacy is complete. Generation happens entirely on your local device (Client-Side). No URLs, messages, or metadata are ever transmitted or stored on external servers.",
      },
      {
        q: 'Where are the codes in "My Codes" stored?',
        a: "They are saved in your local browser storage (localStorage). Only you can view them on this machine. Note that clearing your browser cache or history will reset this list.",
      },
      {
        q: "Which format and resolution should I download for printing?",
        a: "For digital use, PNG works best. For physical printing (flyers, banners, packaging, business cards), we recommend SVG (infinitely scalable vector) or PNG at 2000px.",
      },
    ],

    // Footer
    footerNote: "Local and private generation with zero cookies or tracking.",
    openCode: "Open Source",
    backToTop: "Back to top",
  },

  pt: {
    // Cabeçalho e Navegação
    brandTitle: "Mio Creatives",
    brandBadge: "QR",
    subtitle:
      "Gerador estático e permanente. Sem links intermediários, sem armadilhas de assinatura e sem expiração.",
    generatorTab: "Gerador",
    historyTab: "Meus Códigos",
    faqTab: "Perguntas Frequentes",

    // Pré-visualização e Cor
    emptyStateText:
      "Insira um link ou texto para gerar seu código QR permanente.",
    colorLabel: "Cor do QR",
    customColor: "Personalizado",
    colors: {
      black: "Preto",
      white: "Branco",
      gray: "Cinza",
    },

    // Controles do Gerador
    urlLabel: "Link da web ou texto",
    urlPlaceholder: "https://exemplo.com ou sua mensagem...",
    resolutionLabel: "Resolução de Download",
    formatLabel: "Formato do Arquivo",
    transparentLabel: "Fundo transparente",
    jpgWarning:
      "* O formato JPG não suporta transparência e sempre gera com fundo branco.",
    copyButton: "Copiar",
    copiedToast: "Código QR copiado para a área de transferência!",
    downloadButton: "Baixar QR",
    downloading: "Gerando download...",

    // Histórico (Meus Códigos)
    historyTitle: "Meus Códigos Salvos",
    newQrBtn: "Novo QR",
    clearHistory: "Limpar tudo",
    emptyHistoryTitle: "Você ainda não tem códigos salvos",
    emptyHistoryText:
      "Cada código QR que você gerar e baixar será salvo automaticamente neste navegador.",
    createFirstQr: "Criar meu primeiro código QR",
    downloadAction: "Baixar",
    historyPrivacyNotice:
      "Seus códigos são salvos de forma 100% privada apenas neste dispositivo. Se você limpar o histórico ou dados do navegador, esta lista será redefinida.",

    // Modal de Download
    modalTitle: "Baixar Código QR",
    modalSubtitle: "Selecione o formato e a resolução desejados",
    modalFormat: "Formato",
    modalSize: "Tamanho",
    modalDownloadNow: "Baixar agora",

    // FAQ
    faqTitle: "Perguntas Frequentes e Transparência",
    faqSubtitle:
      "Tudo o que você precisa saber sobre privacidade, validade e funcionamento dos seus códigos QR.",
    faqs: [
      {
        q: "Meus códigos QR expiram ou têm limite de leituras?",
        a: "Não, nunca. Nossos códigos são 100% estáticos. A informação é gravada diretamente na matriz visual, funcionando permanentemente sem limites de escaneamento e sem assinaturas intermediárias.",
      },
      {
        q: "O Mio Creatives QR é realmente 100% gratuito?",
        a: "É totalmente gratuito e sem pegadinhas. Não solicitamos cartão de crédito, cadastro nem taxas ocultas. Tudo é processado diretamente no seu navegador.",
      },
      {
        q: "Vocês têm acesso aos meus dados ou links gerados?",
        a: "Não, sua privacidade é absoluta. A criação ocorre 100% no seu dispositivo (Client-Side). Nenhum dado é enviado ou armazenado em servidores externos.",
      },
      {
        q: 'Onde ficam salvos os códigos de "Meus Códigos"?',
        a: "Eles ficam salvos no armazenamento local deste navegador (localStorage). Se você limpar o histórico de navegação ou cache, a lista será limpa.",
      },
      {
        q: "Qual formato e resolução devo baixar para impressão?",
        a: "Para telas e redes sociais, PNG é ideal. Para impressões gráficas (cartões, banners, cardápios), recomendamos SVG (vetor escalável) ou PNG em 2000px.",
      },
    ],

    // Rodapé
    footerNote: "Geração local e privada sem cookies ou rastreamento.",
    openCode: "Código aberto",
    backToTop: "Voltar ao topo",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("mio_qr_lang") || "es";
  });

  useEffect(() => {
    localStorage.setItem("mio_qr_lang", language);
    document.documentElement.lang = language;
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
    throw new Error(
      "useLanguage debe ser utilizado dentro de un LanguageProvider",
    );
  }
  return context;
};
