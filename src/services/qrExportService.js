// src/services/qrExportService.js

/**
 * Convierte un marcado SVG en una imagen y descarga el archivo en el formato y resolución especificados.
 *
 * @param {Object} options
 * @param {string} options.svgMarkup - Cadena de texto que contiene el SVG generado.
 * @param {number} options.size - Ancho y alto de exportación en píxeles.
 * @param {'png'|'jpg'|'svg'} options.format - Formato de salida.
 * @param {boolean} options.transparentBg - Si debe preservar fondo transparente (ignorado en JPG).
 * @param {string} options.filename - Nombre base del archivo sin extensión.
 * @returns {Promise<void>}
 */
export async function exportQRCode({
  svgMarkup,
  size = 500,
  format = "png",
  transparentBg = false,
  filename = "mio-creatives-qr",
}) {
  if (!svgMarkup || typeof svgMarkup !== "string") {
    throw new Error("exportQRCode requiere una cadena SVG válida.");
  }

  const cleanFormat = format.toLowerCase();

  // Caso 1: Descarga directa de archivo vectorial SVG
  if (cleanFormat === "svg") {
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    triggerDownload(blob, `${filename}.svg`);
    return;
  }

  // Caso 2: Rasterización a Canvas para PNG o JPG
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgMarkup], {
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
          reject(
            new Error("No se pudo inicializar el contexto 2D del Canvas."),
          );
          return;
        }

        // Manejo de fondo: JPG siempre blanco, PNG según transparentBg
        if (cleanFormat === "jpg" || !transparentBg) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, size, size);
        } else {
          ctx.clearRect(0, 0, size, size);
        }

        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);

        const mimeType = cleanFormat === "jpg" ? "image/jpeg" : "image/png";
        const fileExtension = cleanFormat === "jpg" ? "jpg" : "png";
        const quality = cleanFormat === "jpg" ? 0.95 : 1.0;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(
                new Error("Error al procesar el archivo gráfico en Canvas."),
              );
              return;
            }
            triggerDownload(blob, `${filename}.${fileExtension}`);
            resolve();
          },
          mimeType,
          quality,
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Error al cargar el recurso vectorial SVG en memoria."));
    };

    img.src = url;
  });
}

/**
 * Dispara la descarga mediante un enlace temporal en memoria sin alterar el árbol React.
 *
 * @param {Blob} blob
 * @param {string} downloadName
 */
function triggerDownload(blob, downloadName) {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = downloadName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}
