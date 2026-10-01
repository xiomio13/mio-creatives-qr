// src/App.jsx
import QRCode from "qrcode";
import React, { useState, useRef, useCallback } from "react";
import { useLanguage } from "./context/LanguageContext";
import { Header } from "./components/layout/Header";
import { LanguageSelector } from "./components/layout/LanguageSelector/LanguageSelector";
import { Navigation } from "./components/layout/Navigation/Navigation";
import { Footer } from "./components/layout/Footer";
import { QRPreview } from "./components/qr/QRPreview/QRPreview";
import { QRControls } from "./components/qr/QRControls/QRControls";
import { QRHistory } from "./components/qr/QRHistory/QRHistory";
import { DownloadModal } from "./components/common/DownloadModal/DownloadModal";
import { Toast } from "./components/common/Toast/Toast";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { exportQRCode, copyQRToClipboard } from "./services/qrExportService";
import "./App.css";

export default function App() {
  const { t } = useLanguage();

  // Estados de navegación y generación
  const [activeTab, setActiveTab] = useState("generator");
  const [url, setUrl] = useState("");
  const [resolution, setResolution] = useState(500);
  const [format, setFormat] = useState("png");
  const [color, setColor] = useState("#000000");
  const [isTransparent, setIsTransparent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Estado del Toast accesible
  const [toastMessage, setToastMessage] = useState("");

  // Persistencia local en el navegador
  const [history, setHistory] = useLocalStorage("mio_qr_history", []);

  // Estado del modal de re-descarga del historial
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Marcado SVG en memoria
  const qrSvgMarkupRef = useRef("");

  const handleQRReady = useCallback((svgString) => {
    qrSvgMarkupRef.current = svgString || "";
  }, []);

  const isValidUrl = Boolean(url && url.trim().length > 0);

  // Acción rápida: Copiar QR en imagen PNG al portapapeles
  const handleCopyQR = async () => {
    if (!isValidUrl) return;

    const svgMarkup = qrSvgMarkupRef.current;
    if (!svgMarkup) {
      setToastMessage(t?.emptyStateText || "Ingresa un enlace o texto válido.");
      return;
    }

    try {
      await copyQRToClipboard({
        svgMarkup,
        size: 1000,
        transparentBg: format === "jpg" ? false : isTransparent,
      });
      setToastMessage("¡Código QR copiado al portapapeles!");
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
      setToastMessage("No se pudo copiar al portapapeles en este navegador.");
    }
  };

  // Descarga desde la vista Generador
  const handleDownload = async () => {
    if (!isValidUrl || isDownloading) return;

    const svgMarkup = qrSvgMarkupRef.current;
    if (!svgMarkup) {
      setToastMessage(t?.emptyStateText || "Ingresa un enlace o texto válido.");
      return;
    }

    try {
      setIsDownloading(true);
      await exportQRCode({
        svgMarkup,
        size: Number(resolution),
        format,
        transparentBg: format === "jpg" ? false : isTransparent,
        filename: "mio-creatives-qr",
      });

      // Guardar en el historial local
      const newItem = {
        id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
        value: url.trim(),
        name: "",
        color,
        format,
        size: Number(resolution),
        isTransparent: format === "jpg" ? false : isTransparent,
        date: new Date().toLocaleDateString(),
      };

      setHistory((prevHistory) => {
        const filtered = prevHistory.filter(
          (item) => item.value !== newItem.value,
        );
        return [newItem, ...filtered].slice(0, 10);
      });

      setToastMessage("¡Código QR descargado exitosamente!");
    } catch (error) {
      console.error("Error al exportar QR:", error);
      setToastMessage("Ocurrió un error al procesar la descarga.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Re-descarga desde el modal del Historial
  const handleModalConfirm = async ({
    format: modalFormat,
    size: modalSize,
    transparentBg,
  }) => {
    if (!selectedHistoryItem) return;

    try {
      const isJpg = modalFormat === "jpg";
      const effectiveTransparent = isJpg ? false : Boolean(transparentBg);

      // Regenerar el marcado SVG asegurando canal alfa transparente si aplica
      const svgMarkup = await QRCode.toString(selectedHistoryItem.value, {
        type: "svg",
        errorCorrectionLevel: "H",
        margin: 1,
        color: {
          dark: selectedHistoryItem.color || "#000000",
          light: effectiveTransparent ? "#00000000" : "#FFFFFF",
        },
      });

      await exportQRCode({
        svgMarkup,
        size: modalSize,
        format: modalFormat,
        transparentBg: effectiveTransparent,
        filename: selectedHistoryItem.name || "mio-creatives-qr",
      });

      setToastMessage("¡Descarga completada!");
    } catch (error) {
      console.error("Error en re-descarga:", error);
      setToastMessage("No se pudo re-descargar el código seleccionado.");
    }
  };

  // Acciones sobre el historial
  const handleSelectHistoryItem = (item) => {
    setUrl(item.value);
    setFormat(item.format);
    setResolution(item.size);
    if (item.color) setColor(item.color);
    if (typeof item.isTransparent === "boolean")
      setIsTransparent(item.isTransparent);
    setActiveTab("generator");
    setToastMessage("Parámetros cargados en el generador.");
  };

  const handleOpenDownloadModal = (item) => {
    setSelectedHistoryItem(item);
    setIsModalOpen(true);
  };

  const handleUpdateName = (id, newName) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item)),
    );
    setToastMessage("Nombre actualizado.");
  };

  const handleRemoveHistoryItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setToastMessage("Elemento eliminado del historial.");
  };

  const handleClearHistory = () => {
    setHistory([]);
    setToastMessage("Historial vaciado.");
  };

  return (
    <div className="appContainer">
      <header className="topBar">
        <LanguageSelector />
      </header>

      <main className="mainContent">
        <Header />

        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          historyCount={history.length}
        />

        {activeTab === "generator" ? (
          <div className="generatorCard">
            {/* Columna Izquierda: Vista Previa */}
            <section className="previewColumn">
              <QRPreview
                value={url}
                color={color}
                onColorChange={setColor}
                isTransparent={format === "jpg" ? false : isTransparent}
                onReady={handleQRReady}
              />
            </section>

            {/* Columna Derecha: Controles */}
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
                onCopy={handleCopyQR}
                isDownloading={isDownloading}
                isValidUrl={isValidUrl}
              />
            </section>
          </div>
        ) : (
          <QRHistory
            items={history}
            onSelect={handleSelectHistoryItem}
            onRemove={handleRemoveHistoryItem}
            onClear={handleClearHistory}
            onOpenDownloadModal={handleOpenDownloadModal}
            onUpdateName={handleUpdateName}
            onGoToGenerator={() => setActiveTab("generator")}
          />
        )}
      </main>

      <Footer />

      {/* Modal accesible de re-descarga */}
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        initialFormat={selectedHistoryItem?.format || "png"}
        initialSize={selectedHistoryItem?.size || 500}
        initialTransparent={selectedHistoryItem?.isTransparent || false}
      />

      {/* Notificación Toast accesible */}
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
