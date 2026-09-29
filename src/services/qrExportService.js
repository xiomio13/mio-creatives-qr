// src/services/qrExportService.js
import { QR_FORMATS } from "../constants/qrConfig";

/**
 * Fuerza la descarga en el navegador de un archivo a partir de un Blob o URL.
 * @param {string} url
 * @param {string} filename
 */
const triggerDownload = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 150);
};

/**
 * Exporta y descarga un código QR a partir de su elemento SVG renderizado en el DOM.
 * @param {Object} params
 * @param {SVGElement} params.svgElement Nodo SVG del QR generado.
 * @param {number} params.size Resolución cuadrada en px (200, 500, 1000, 1500, 2000).
 * @param {'png' | 'jpg' | 'svg'} params.format Formato de descarga.
 * @param {boolean} params.transparentBg Si el fondo debe ser transparente.
 * @param {string} [params.filename] Nombre base del archivo resultante.
 */
export const exportQRCode = async ({
  svgElement,
  size,
  format,
  transparentBg,
  filename = "mio-creatives-qr",
}) => {
  if (!svgElement) {
    throw new Error(
      "No se encontró el elemento SVG del código QR para exportar.",
    );
  }

  const outputName = `${filename}-${size}x${size}.${format}`;

  // 1. Descarga vectorial directa (SVG)
  if (format === QR_FORMATS.SVG) {
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    if (transparentBg) {
      svgString = svgString.replace(
        /<rect[^>]*fill="#?[a-fA-F0-9]+"[^>]*>/i,
        "",
      );
    }

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    triggerDownload(URL.createObjectURL(svgBlob), outputName);
    return outputName;
  }

  // 2. Descarga rasterizada (PNG / JPG) vía Canvas off-screen
  return new Promise((resolve, reject) => {
    try {
      const isJpg = format === QR_FORMATS.JPG;
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgElement);

      // Si es JPG o no se solicitó transparencia, aseguramos un fondo blanco explícito en el SVG
      if (isJpg || !transparentBg) {
        if (
          !svgString.includes('<rect width="100%" height="100%" fill="#FFFFFF"')
        ) {
          svgString = svgString.replace(
            /(<svg[^>]*>)/i,
            '$1<rect width="100%" height="100%" fill="#FFFFFF"/>',
          );
        }
      } else {
        // Si es transparente, eliminamos cualquier fondo blanco que traiga el SVG por defecto
        svgString = svgString.replace(
          /<rect[^>]*fill="#?[a-fA-F0-9]+"[^>]*>/i,
          "",
        );
      }

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error(
          "No fue posible inicializar el contexto 2D del Canvas.",
        );
      }

      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const blobUrl = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        // En JPG siempre rellenamos el fondo sólido del Canvas en blanco antes del trazo
        if (isJpg || !transparentBg) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, size, size);
        } else {
          ctx.clearRect(0, 0, size, size);
        }

        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(blobUrl);

        const mimeType = isJpg ? "image/jpeg" : "image/png";
        const quality = isJpg ? 0.95 : 1.0;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Error generando el archivo de imagen."));
              return;
            }
            triggerDownload(URL.createObjectURL(blob), outputName);
            resolve(outputName);
          },
          mimeType,
          quality,
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        reject(new Error("Fallo al procesar el vector SVG en memoria."));
      };

      img.src = blobUrl;
    } catch (err) {
      reject(err);
    }
  });
};
