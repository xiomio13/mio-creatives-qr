// src/App.jsx
import React, { useState, useRef, useCallback } from "react";
import { useLanguage } from "./context/LanguageContext";
import { Header } from "./components/layout/Header";
import { LanguageSelector } from "./components/layout/LanguageSelector/LanguageSelector";
import { Footer } from "./components/layout/Footer";
import { QRPreview } from "./components/qr/QRPreview/QRPreview";
import { QRControls } from "./components/qr/QRControls/QRControls";
import { exportQRCode } from "./services/qrExportService";
import "./App.css";

export default function App() {
  const { t } = useLanguage();
  const [url, setUrl] = useState("");
  const [resolution, setResolution] = useState(500);
  const [format, setFormat] = useState("png");
  const [color, setColor] = useState("#000000");
  const [isTransparent, setIsTransparent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Referencia en memoria para el marcado SVG puro
  const qrSvgMarkupRef = useRef("");

  const handleQRReady = useCallback((svgString) => {
    qrSvgMarkupRef.current = svgString || "";
    if (svgString) {
      setErrorMessage("");
    }
  }, []);

  const isValidUrl = Boolean(url && url.trim().length > 0);

  const handleDownload = async () => {
    if (!isValidUrl || isDownloading) return;

    const svgMarkup = qrSvgMarkupRef.current;
    if (!svgMarkup) {
      setErrorMessage(t?.emptyStateText || "Ingrese un enlace o texto válido.");
      return;
    }

    try {
      setIsDownloading(true);
      setErrorMessage("");
      await exportQRCode({
        svgMarkup,
        size: Number(resolution),
        format,
        transparentBg: format === "jpg" ? false : isTransparent,
        filename: "mio-creatives-qr",
      });
    } catch (error) {
      console.error("Error al exportar el código QR:", error);
      setErrorMessage("Ocurrió un error al procesar el archivo de descarga.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="appContainer">
      <header className="topBar">
        <LanguageSelector />
      </header>

      <main className="mainContent">
        <Header />

        {errorMessage && (
          <div
            role="alert"
            aria-live="polite"
            style={{
              maxWidth: "520px",
              margin: "0 auto 1.5rem",
              padding: "0.75rem 1rem",
              backgroundColor: "#FEF2F2",
              color: "#991B1B",
              borderRadius: "8px",
              border: "1px solid #FCA5A5",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        )}

        <div className="generatorCard">
          {/* Columna Izquierda: Vista previa y selector de color */}
          <section className="previewColumn">
            <QRPreview
              value={url}
              color={color}
              onColorChange={setColor}
              isTransparent={format === "jpg" ? false : isTransparent}
              onReady={handleQRReady}
            />
          </section>

          {/* Columna Derecha: Parámetros y descarga */}
          <section className="controlsColumn">
            <QRControls
              url={url}
              onUrlChange={setUrl}
              resolution={resolution}
              onResolutionChange={setResolution}
              format={format}
              onFormatChange={setFormat}
              isTransparent={isTransparent}
              onTransparentChange={setIsTransparent}
              onDownload={handleDownload}
              isDownloading={isDownloading}
              isValidUrl={isValidUrl}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
