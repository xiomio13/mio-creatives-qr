// src/constants/qrConfig.js

export const QR_SIZES = [200, 500, 1000, 1500, 2000];

export const QR_FORMATS = {
  PNG: "png",
  JPG: "jpg",
  SVG: "svg",
};

// Corrección de error High (~30% de redundancia contra daños)
export const QR_ERROR_CORRECTION = "H";

export const DEFAULT_CONFIG = {
  size: 500,
  format: QR_FORMATS.PNG,
  transparentBg: false,
  fgColor: "#000000",
  bgColor: "#FFFFFF",
};
