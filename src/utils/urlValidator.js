// src/utils/urlValidator.js

/**
 * Tipos de contenido soportados para códigos QR
 */
export const CONTENT_TYPES = {
  URL: "url",
  EMAIL: "email",
  PHONE: "phone",
  WIFI: "wifi",
  TEXT: "text",
};

/**
 * Analiza una cadena y determina su tipo semántico y sugerencias de formato.
 *
 * @param {string} rawInput - Texto ingresado por el usuario.
 * @returns {{ type: string, label: string, icon: string, hint: string | null }}
 */
export function analyzeContent(rawInput) {
  const value = (rawInput || "").trim();

  if (!value) {
    return {
      type: CONTENT_TYPES.TEXT,
      label: "Texto o enlace",
      icon: "📝",
      hint: null,
    };
  }

  // Detección de Wi-Fi
  if (/^WIFI:/i.test(value)) {
    return {
      type: CONTENT_TYPES.WIFI,
      label: "Red Wi-Fi",
      icon: "📶",
      hint: "Configuración de conexión automática a Wi-Fi.",
    };
  }

  // Detección de Correo
  if (/^mailto:/i.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return {
      type: CONTENT_TYPES.EMAIL,
      label: "Correo Electrónico",
      icon: "✉️",
      hint: "Al escanearlo, abrirá la aplicación de correo.",
    };
  }

  // Detección de Teléfono
  if (/^tel:/i.test(value) || /^\+?[0-9\s\-()]{7,20}$/.test(value)) {
    return {
      type: CONTENT_TYPES.PHONE,
      label: "Teléfono",
      icon: "📞",
      hint: "Al escanearlo, iniciará una llamada directa.",
    };
  }

  // Detección de URL completa (http/https)
  if (/^https?:\/\//i.test(value)) {
    try {
      new URL(value);
      return {
        type: CONTENT_TYPES.URL,
        label: "Enlace Web Seguro",
        icon: "🌐",
        hint: null,
      };
    } catch {
      return {
        type: CONTENT_TYPES.URL,
        label: "Enlace Web",
        icon: "🌐",
        hint: "Verifica que la dirección web esté bien escrita.",
      };
    }
  }

  // Detección de posibles dominios sin protocolo (ej. "google.com" o "www.ejemplo.com")
  if (/^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(value)) {
    return {
      type: CONTENT_TYPES.URL,
      label: "Enlace Web",
      icon: "🌐",
      hint: 'Tip: Agrega "https://" al inicio para asegurar la apertura directa en el navegador.',
    };
  }

  // Por defecto: Texto plano
  return {
    type: CONTENT_TYPES.TEXT,
    label: "Texto Plano",
    icon: "📝",
    hint: null,
  };
}
