// src/services/qrExportService.js
import QRCode from "qrcode";

/**
 * Disparador nativo y seguro de descargas de archivos Blob o DataURL.
 */
const triggerDownload = (blobOrUrl, filename) => {
  const isBlob = blobOrUrl instanceof Blob;
  const downloadUrl = isBlob ? URL.createObjectURL(blobOrUrl) : blobOrUrl;

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (isBlob) {
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 300);
  }
};

/**
 * Exporta y descarga un código QR a partir de su texto/URL sin depender del DOM.
 * @param {Object} params
 * @param {string} params.value - Texto o URL a codificar.
 * @param {number} params.size - Resolución en píxeles (200 a 2000).
 * @param {'png' | 'jpg' | 'svg'} params.format - Formato de exportación.
 * @param {boolean} params.transparentBg - Si conserva fondo transparente.
 * @param {string} params.color - Color de los módulos del QR (por defecto #000000).
 * @param {string} [params.filename] - Nombre del archivo descargado.
 */
export const exportQRCode = async ({
  value,
  size = 500,
  format = "png",
  transparentBg = false,
  color = "#000000",
  filename = "mio-creatives-qr",
}) => {
  if (!value || typeof value !== "string") {
    throw new Error(
      "No se proporcionó un texto o enlace válido para generar el código QR.",
    );
  }

  const normalizedFormat = (format || "png").toLowerCase();
  const sanitizedFilename = `${filename}-${size}x${size}.${normalizedFormat}`;
  const isJpg = normalizedFormat === "jpg";
  const shouldBeTransparent = isJpg ? false : Boolean(transparentBg);

  // 1. Exportación Vectorial SVG
  if (normalizedFormat === "svg") {
    const svgString = await QRCode.toString(value, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: color || "#000000",
        light: shouldBeTransparent ? "#00000000" : "#FFFFFF",
      },
    });

    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    triggerDownload(blob, sanitizedFilename);
    return;
  }

  // 2. Exportación Rasterizada (PNG / JPG) vía Canvas en memoria
  const canvas = document.createElement("canvas");
  canvas.width = Number(size);
  canvas.height = Number(size);

  await QRCode.toCanvas(canvas, value, {
    width: Number(size),
    margin: 1,
    errorCorrectionLevel: "H",
    color: {
      dark: color || "#000000",
      light: shouldBeTransparent ? "#00000000" : "#FFFFFF",
    },
  });

  return new Promise((resolve, reject) => {
    const mimeType = isJpg ? "image/jpeg" : "image/png";
    const quality = isJpg ? 0.95 : 1.0;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Fallo al generar el archivo de imagen."));
          return;
        }
        triggerDownload(blob, sanitizedFilename);
        resolve();
      },
      mimeType,
      quality,
    );
  });
};

/**
 * Copia el código QR generado directamente al portapapeles en formato PNG.
 */
export const copyQRToClipboard = async ({
  value,
  size = 1000,
  transparentBg = false,
  color = "#000000",
}) => {
  if (!value) {
    throw new Error("No hay texto o enlace para copiar.");
  }

  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error(
      "Tu navegador no soporta la copia directa de imágenes al portapapeles.",
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = Number(size);
  canvas.height = Number(size);

  await QRCode.toCanvas(canvas, value, {
    width: Number(size),
    margin: 1,
    errorCorrectionLevel: "H",
    color: {
      dark: color || "#000000",
      light: transparentBg ? "#00000000" : "#FFFFFF",
    },
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Fallo al generar la imagen para el portapapeles."));
        return;
      }

      try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    }, "image/png");
  });
};
