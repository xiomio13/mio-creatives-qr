// src/App.jsx
import React, { useState, useRef, useCallback } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/layout/Header';
import { LanguageSelector } from './components/layout/LanguageSelector/LanguageSelector';
import { Footer } from './components/layout/Footer';
import { QRPreview } from './components/qr/QRPreview/QRPreview';
import { QRControls } from './components/qr/QRControls/QRControls';
import { exportQRCode } from './services/qrExportService';
import './App.css';

export default function App() {
  const [url, setUrl] = useState('');
  const [resolution, setResolution] = useState(500);
  const [format, setFormat] = useState('png');
  const [color, setColor] = useState('#000000');
  const [isTransparent, setIsTransparent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Almacenamos el marcado SVG generado en memoria (cero consultas al DOM)
  const qrSvgMarkupRef = useRef('');

  const handleQRReady = useCallback((svgString) => {
    qrSvgMarkupRef.current = svgString || '';
  }, []);

  const isValidUrl = Boolean(url && url.trim().length > 0);

  const handleDownload = async () => {
    if (!isValidUrl || isDownloading) return;

    const svgMarkup = qrSvgMarkupRef.current;
    if (!svgMarkup) {
      alert('Aún no se ha generado ningún código QR para descargar.');
      return;
    }

    try {
      setIsDownloading(true);
      await exportQRCode({
        svgMarkup,
        size: Number(resolution),
        format,
        transparentBg: format === 'jpg' ? false : isTransparent,
        filename: 'mio-creatives-qr',
      });
    } catch (error) {
      console.error('Error al exportar el código QR:', error);
      alert('Ocurrió un error al intentar generar la descarga.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <LanguageProvider>
      <div className="appContainer">
        <header className="topBar">
          <LanguageSelector />
        </header>

        <main className="mainContent">
          <Header />

          <div className="generatorCard">
            {/* Columna Izquierda: Vista previa y barra de color */}
            <section className="previewColumn">
              <QRPreview
                value={url}
                color={color}
                onColorChange={setColor}
                isTransparent={format === 'jpg' ? false : isTransparent}
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
    </LanguageProvider>
  );
}