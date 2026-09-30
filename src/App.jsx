// src/App.jsx
import React, { useState, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { useLanguage } from "./context/LanguageContext";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Header } from "./components/layout/Header";
import { LanguageSelector } from "./components/layout/LanguageSelector/LanguageSelector";
import { Navigation } from "./components/layout/Navigation/Navigation";
import { Footer } from "./components/layout/Footer";
import { QRPreview } from "./components/qr/QRPreview/QRPreview";
import { QRControls } from "./components/qr/QRControls/QRControls";
import { QRHistory } from "./components/qr/QRHistory/QRHistory";
import { DownloadModal } from "./components/common/DownloadModal/DownloadModal";
import { exportQRCode } from "./services/qrExportService";
import "./App.css";

export default function App() {
  const { t } = useLanguage();

  // Control de vista activa: 'generator' o 'history'
  const [currentTab, setCurrentTab] = useState("generator");

  const [url, setUrl] = useState("");
  const [resolution, setResolution] = useState(500);
  const [format, setFormat] = useState("png");
  const [color, setColor] = useState("#000000");
  const [isTransparent, setIsTransparent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Persistencia local para el historial
  const [history, setHistory] = useLocalStorage("mio_qr_history", []);

  // Modal de descarga para re-exportación
  const [modalState, setModalState] = useState({
    isOpen: false,
    item: null,
  });

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

      const trimmedUrl = url.trim();
      const nowFormatted = new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setHistory((prev) => {
        const existing = prev.find((item) => item.value === trimmedUrl);
        const filtered = prev.filter((item) => item.value !== trimmedUrl);

        const newEntry = {
          id: existing
            ? existing.id
            : `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: existing?.name || trimmedUrl,
          value: trimmedUrl,
          color,
          format,
          size: Number(resolution),
          isTransparent,
          date: nowFormatted,
        };

        return [newEntry, ...filtered].slice(0, 15);
      });
    } catch (error) {
      console.error("Error al exportar el código QR:", error);
      setErrorMessage("Ocurrió un error al procesar el archivo de descarga.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setUrl(item.value);
    setColor(item.color || "#000000");
    setFormat(item.format || "png");
    setResolution(item.size || 500);
    setIsTransparent(Boolean(item.isTransparent));
    setCurrentTab("generator"); // Redirige automáticamente al generador
  };

  const handleUpdateName = (id, newName) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name: newName.trim() || item.value } : item,
      ),
    );
  };

  const handleRemoveHistoryItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleOpenDownloadModal = (item) => {
    setModalState({
      isOpen: true,
      item,
    });
  };

  const handleCloseDownloadModal = () => {
    setModalState({
      isOpen: false,
      item: null,
    });
  };

  const handleConfirmModalDownload = async ({
    format: modalFormat,
    size: modalSize,
  }) => {
    const item = modalState.item;
    if (!item) return;

    try {
      const svgMarkup = await QRCode.toString(item.value, {
        type: "svg",
        margin: 2,
        color: {
          dark: item.color || "#000000",
          light: "#00000000",
        },
      });

      await exportQRCode({
        svgMarkup,
        size: modalSize,
        format: modalFormat,
        transparentBg:
          modalFormat === "jpg" ? false : Boolean(item.isTransparent),
        filename: (item.name || "mio-qr").replace(/\s+/g, "-").toLowerCase(),
      });
    } catch (err) {
      console.error("Error al re-descargar desde el historial:", err);
      setErrorMessage("Ocurrió un error al procesar la re-descarga.");
    }
  };

  return (
    <div className="appContainer">
      <header className="topBar">
        <LanguageSelector />
      </header>

      <main className="mainContent">
        <Header />

        {/* Selector de pantalla: Generador vs Mis Códigos */}
        <Navigation
          activeTab={currentTab}
          onTabChange={setCurrentTab}
          historyCount={history.length}
        />

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

        {/* Vista 1: Generador Enfocado */}
        {currentTab === "generator" && (
          <div className="generatorCard">
            <section className="previewColumn">
              <QRPreview
                value={url}
                color={color}
                onColorChange={setColor}
                isTransparent={format === "jpg" ? false : isTransparent}
                onReady={handleQRReady}
              />
            </section>

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
        )}

        {/* Vista 2: Mis Códigos (Página de Historial) */}
        {currentTab === "history" && (
          <QRHistory
            items={history}
            onSelect={handleSelectHistoryItem}
            onRemove={handleRemoveHistoryItem}
            onClear={handleClearHistory}
            onOpenDownloadModal={handleOpenDownloadModal}
            onUpdateName={handleUpdateName}
            onGoToGenerator={() => setCurrentTab("generator")}
          />
        )}
      </main>

      <DownloadModal
        isOpen={modalState.isOpen}
        onClose={handleCloseDownloadModal}
        onConfirm={handleConfirmModalDownload}
        initialFormat={modalState.item?.format || "png"}
        initialSize={modalState.item?.size || 500}
      />

      <Footer />
    </div>
  );
}
