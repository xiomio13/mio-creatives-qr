// src/App.jsx
import React, { useState, useRef, useCallback } from "react";
import { useLanguage } from "./context/LanguageContext";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Header } from "./components/layout/Header";
import { LanguageSelector } from "./components/layout/LanguageSelector/LanguageSelector";
import { Navigation } from "./components/layout/Navigation/Navigation";
import { Footer } from "./components/layout/Footer";
import { FAQView } from "./components/layout/FAQ/FAQView";
import { QRPreview } from "./components/qr/QRPreview/QRPreview";
import { QRControls } from "./components/qr/QRControls/QRControls";
import { QRHistory } from "./components/qr/QRHistory/QRHistory";
import { DownloadModal } from "./components/common/DownloadModal/DownloadModal";
import { Toast } from "./components/common/Toast/Toast";
import { exportQRCode } from "./services/qrExportService";
import "./App.css";

export default function App() {
  const { t } = useLanguage();

  // Pestaña activa: 'generator' | 'history' | 'faq'
  const [activeTab, setActiveTab] = useState("generator");

  // Estado del generador
  const [url, setUrl] = useState("");
  const [resolution, setResolution] = useState(500);
  const [format, setFormat] = useState("png");
  const [color, setColor] = useState("#000000");
  const [isTransparent, setIsTransparent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Historial en localStorage
  const [history, setHistory] = useLocalStorage("mio_qr_history", []);

  // Modal de descarga del historial
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Toast accesible
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Almacenamiento en memoria del SVG renderizado
  const qrSvgMarkupRef = useRef("");

  const handleQRReady = useCallback((svgString) => {
    qrSvgMarkupRef.current = svgString || "";
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const handleDownload = async () => {
    const svgMarkup = qrSvgMarkupRef.current;
    if (!svgMarkup) return;

    try {
      setIsDownloading(true);
      await exportQRCode({
        svgMarkup,
        size: Number(resolution),
        format,
        transparentBg: format === "jpg" ? false : isTransparent,
        filename: "mio-creatives-qr",
      });

      // Guardar automáticamente en el historial local
      const newItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        value: url,
        name: url.replace(/^https?:\/\//i, "").slice(0, 30),
        color,
        format,
        size: Number(resolution),
        isTransparent: format === "jpg" ? false : isTransparent,
        date: new Date().toLocaleDateString(),
      };

      setHistory((prev) =>
        [newItem, ...prev.filter((i) => i.value !== url)].slice(0, 20),
      );
      triggerToast(t?.downloading || "¡Descarga iniciada con éxito!");
    } catch (err) {
      console.error(err);
      triggerToast("Error al exportar la imagen.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Acciones sobre el Historial
  const handleSelectFromHistory = (item) => {
    setUrl(item.value);
    if (item.color) setColor(item.color);
    if (item.format) setFormat(item.format);
    if (item.size) setResolution(item.size);
    if (typeof item.isTransparent === "boolean")
      setIsTransparent(item.isTransparent);
    setActiveTab("generator");
  };

  const handleRemoveHistoryItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleUpdateName = (id, newName) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item)),
    );
  };

  const handleOpenDownloadModal = (item) => {
    setSelectedHistoryItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmModalDownload = async ({
    format: modalFormat,
    size: modalSize,
    transparentBg: modalTransparent,
  }) => {
    if (!selectedHistoryItem) return;

    try {
      await exportQRCode({
        svgMarkup: qrSvgMarkupRef.current || "",
        size: Number(modalSize),
        format: modalFormat,
        transparentBg: modalTransparent,
        filename: selectedHistoryItem.name || "mio-creatives-qr",
      });
      triggerToast(t?.downloading || "¡Descarga iniciada con éxito!");
    } catch (err) {
      console.error(err);
      triggerToast("Error al descargar el archivo.");
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "1rem 2rem",
        }}
      >
        <LanguageSelector />
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
          padding: "0 1.5rem 3rem",
        }}
      >
        <Header />

        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          historyCount={history.length}
        />

        {activeTab === "generator" && (
          <div className="generatorCard">
            <section style={{ display: "flex", justifyContent: "center" }}>
              <QRPreview
                value={url}
                color={color}
                onColorChange={setColor}
                isTransparent={format === "jpg" ? false : isTransparent}
                onReady={handleQRReady}
                onCopySuccess={() =>
                  triggerToast(
                    t?.copiedToast || "¡Código QR copiado al portapapeles!",
                  )
                }
              />
            </section>

            <section>
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
                isValidUrl={Boolean(url && url.trim().length > 0)}
              />
            </section>
          </div>
        )}

        {activeTab === "history" && (
          <QRHistory
            items={history}
            onSelect={handleSelectFromHistory}
            onRemove={handleRemoveHistoryItem}
            onClear={handleClearHistory}
            onOpenDownloadModal={handleOpenDownloadModal}
            onUpdateName={handleUpdateName}
            onGoToGenerator={() => setActiveTab("generator")}
          />
        )}

        {activeTab === "faq" && <FAQView />}
      </main>

      <Footer />

      {/* Modal accesible de re-descarga */}
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmModalDownload}
        initialFormat={selectedHistoryItem?.format || "png"}
        initialSize={selectedHistoryItem?.size || 500}
        initialTransparent={selectedHistoryItem?.isTransparent || false}
      />

      {/* Notificación Toast accesible */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
