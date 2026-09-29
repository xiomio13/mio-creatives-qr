// src/hooks/useQRGenerator.js
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QR_ERROR_CORRECTION, DEFAULT_CONFIG } from "../constants/qrConfig";

export const useQRGenerator = () => {
  const [value, setValue] = useState("");
  const [svgString, setSvgString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados de configuración de exportación
  const [size, setSize] = useState(DEFAULT_CONFIG.size);
  const [format, setFormat] = useState(DEFAULT_CONFIG.format);
  const [transparentBg, setTransparentBg] = useState(
    DEFAULT_CONFIG.transparentBg,
  );

  useEffect(() => {
    // Estado Empty: si el input está vacío, limpiamos la vista previa
    if (!value.trim()) {
      setSvgString("");
      setError("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    // Debounce de 250ms para evitar recalcular la matriz en cada pulsación de tecla
    const handler = setTimeout(async () => {
      try {
        const svg = await QRCode.toString(value.trim(), {
          type: "svg",
          errorCorrectionLevel: QR_ERROR_CORRECTION,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setSvgString(svg);
      } catch (err) {
        setError(
          "El contenido es demasiado largo o no se pudo generar el código.",
        );
        setSvgString("");
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [value]);

  return {
    value,
    setValue,
    svgString,
    isLoading,
    error,
    size,
    setSize,
    format,
    setFormat,
    transparentBg,
    setTransparentBg,
  };
};
