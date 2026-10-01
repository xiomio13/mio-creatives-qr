// src/services/qrExportService.js

/**
 * Prepara y sanitiza el marcado SVG eliminando o inyectando el fondo según el formato.
 *
 * @param {string} svgMarkup - Código SVG bruto generado.
 * @param {boolean} transparentBg - Si se solicita fondo transparente.
 * @param {boolean} isJpg - Si el formato destino es JPG.
 * @returns {string} - SVG procesado y listo para renderizar.
 */
function prepareSvgMarkup(svgMarkup, transparentBg, isJpg) {
  let cleanedSvg = svgMarkup || "";

  if (isJpg) {
    // JPG no soporta transparencia: garantizamos fondo blanco sólido
    if (cleanedSvg.includes("<rect")) {
      cleanedSvg = cleanedSvg.replace(
        /<rect[^>]*fill="[^"]*"[^>]*>/i,
        '<rect width="100%" height="100%" fill="#FFFFFF"/>',
      );
    } else {
      cleanedSvg = cleanedSvg.replace(
        /(<svg[^>]*>)/i,
        '$1<rect width="100%" height="100%" fill="#FFFFFF"/>',
      );
    }
  } else if (transparentBg) {
    // Si se pide transparente, eliminamos cualquier rectángulo que actúe de fondo blanco
    cleanedSvg = cleanedSvg.replace(
      /<rect[^>]*fill="(?:#ffffff|#fff|white)"[^>]*\/?>(?:<\/rect>)?/gi,
      "",
    );
    cleanedSvg = cleanedSvg.replace(
      /<rect[^>]*fill="rgba?\(255,\s*255,\s*255[^"]*\)"[^>]*\/?>(?:<\/rect>)?/gi,
      "",
    );
  }

  return cleanedSvg;
}

/**
 * Descarga en el navegador cualquier archivo a partir de un Blob o DataURL.
 */
function triggerBrowserDownload(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exporta el código QR en PNG, JPG o SVG respetando la transparencia solicitada.
 *
 * @param {Object} options
 * @param {string} options.svgMarkup - Código SVG generado por la librería QRCode.
 * @param {number} [options.size=500] - Resolución en píxeles.
 * @param {string} [options.format='png'] - Formato ('png', 'jpg', 'svg').
 * @param {boolean} [options.transparentBg=false] - Transparencia activa o inactiva.
 * @param {string} [options.filename='mio-creatives-qr'] - Nombre base del archivo.
 * @returns {Promise<void>}
 */
export async function exportQRCode({
  svgMarkup,
  size = 500,
  format = "png",
  transparentBg = false,
  filename = "mio-creatives-qr",
}) {
  const currentFormat = format.toLowerCase();
  const isJpg = currentFormat === "jpg";
  const effectiveTransparent = isJpg ? false : Boolean(transparentBg);

  const finalSvg = prepareSvgMarkup(svgMarkup, effectiveTransparent, isJpg);

  // 1. Exportación Vectorial SVG directa
  if (currentFormat === "svg") {
    const blob = new Blob([finalSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    triggerBrowserDownload(url, `${filename}.svg`);
    URL.revokeObjectURL(url);
    return;
  }

  // 2. Exportación Raster (PNG o JPG) mediante Canvas nativo
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([finalSvg], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("No se pudo inicializar el contexto de Canvas 2D."));
          return;
        }

        // Control del lienzo
        if (effectiveTransparent) {
          ctx.clearRect(0, 0, size, size); // Canal alfa 0 (100% transparente)
        } else {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, size, size); // Fondo sólido blanco
        }

        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);

        const mimeType = isJpg ? "image/jpeg" : "image/png";
        const dataUrl = canvas.toDataURL(mimeType, 0.95);
        triggerBrowserDownload(
          dataUrl,
          `${filename}-${size}x${size}.${currentFormat}`,
        );
        resolve();
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Error al decodificar la matriz SVG en el lienzo."));
    };

    img.src = url;
  });
}

/**
 * Copia la imagen PNG resultante directamente al portapapeles (Clipboard API).
 */
export async function copyQRToClipboard({
  svgMarkup,
  size = 1000,
  transparentBg = false,
}) {
  if (!navigator.clipboard || typeof window.ClipboardItem === "undefined") {
    throw new Error(
      "El navegador no soporta la escritura directa de imágenes en el portapapeles.",
    );
  }

  const finalSvg = prepareSvgMarkup(svgMarkup, Boolean(transparentBg), false);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([finalSvg], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Contexto Canvas no disponible."));
          return;
        }

        if (transparentBg) {
          ctx.clearRect(0, 0, size, size);
        } else {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, size, size);
        }

        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error("Error al generar el Blob PNG."));
            return;
          }
          try {
            const clipboardItem = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([clipboardItem]);
            resolve();
          } catch (clipErr) {
            reject(clipErr);
          }
        }, "image/png");
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Error al cargar la imagen para el portapapeles."));
    };

    img.src = url;
  });
}
