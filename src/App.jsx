// src/App.jsx
import React, { useState, useRef } from 'react';
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
  const [color, setColor] = useState('#000000'); // Negro por defecto
  const [isTransparent, setIsTransparent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const previewRef = useRef(null);
  const isValidUrl = Boolean(url && url.trim().length > 0);

  const handleDownload = async () => {
    if (!isValidUrl || isDownloading) return;

    const svgElement = previewRef.current?.querySelector('svg');
    if (!svgElement) {
      alert('Aún no se ha generado ningún código QR para descargar.');
      return;
    }

    try {
      setIsDownloading(true);
      await exportQRCode({
        svgElement,
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
            {/* Columna Izquierda: Previsualización + Barra de Color Abajo */}
            <section className="previewColumn" ref={previewRef}>
              <QRPreview
                value={url}
                color={color}
                onColorChange={setColor}
                isTransparent={format === 'jpg' ? false : isTransparent}
              />
            </section>

            {/* Columna Derecha: Parámetros y Descarga */}
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