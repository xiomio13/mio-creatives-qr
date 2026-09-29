# Mio Creatives QR ⚡

Generador de códigos QR estáticos, vectoriales y permanentes con renderizado local en el navegador.

A diferencia de los servicios comerciales tradicionales, **Mio Creatives QR no usa enlaces intermediarios, no requiere registro, no contiene anuncios y nunca caduca**.

---

## Características Principales

- **100% Estático y Privado:** El código QR se genera y procesa directamente en tu navegador (Client-Side). Tus datos nunca tocan un servidor externo.
- **Exportación Multiformato:** Descargas directas en:
  - **PNG** (con soporte de fondo transparente y alta resolución).
  - **JPG** (fondo blanco opaco optimizado).
  - **SVG** (vectorial nativo con escalabilidad infinita).
- **Resolución Personalizada:** Presets rápidos desde 200px hasta 2000px.
- **Soporte Multilingüe:** Internacionalización nativa (Español, Inglés, Portugués) con persistencia local.
- **Sin Dependencias Inestables:** Construido sobre la biblioteca estándar `qrcode` de Node/Browser.

---

## Arquitectura y Principios de Desarrollo

El proyecto sigue estándares estrictos de **Clean Code**, **Separación de Responsabilidades (SRP)** y **Paradigma Declarativo de React**:

- **Smart / Dumb Components:**
  - `App.jsx`: Componente orquestador que centraliza el estado reactivo y maneja el flujo de descarga en memoria.
  - `QRPreview` y `QRColorBar`: Componentes desacoplados de presentación y captura de color.
  - `QRControls`: Formulario interactivo accesible para la parametrización de salida.
- **Cero Manipulación Imperativa del DOM:** Eliminación de llamadas a `querySelector`. Comunicación basada en contratos y callbacks declarativos (`onReady`).
- **CSS Modules:** Aislamiento de estilos por componente para evitar contaminación de selectores globales.
- **Seguridad Web:** Protección vía `Content-Security-Policy` estricta, cabeceras anti-sniffing y aislamiento de permisos de hardware.

---

## Estructura del Proyecto

```text
mio-creatives-qr/
├── public/                 # Favicon, logo vectorial y recursos públicos
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Footer, LanguageSelector
│   │   └── qr/             # QRPreview, QRControls, QRColorBar
│   ├── context/            # LanguageContext (i18n reactivo con fallback)
│   ├── services/           # qrExportService (conversión y descarga SVG/Canvas)
│   ├── App.css             # Estructura de layout central
│   ├── App.jsx             # Smart component raíz
│   ├── index.css           # Tokens y variables CSS globales
│   └── main.jsx            # Entry point con LanguageProvider global
├── package.json
└── vite.config.js

Instalación y Ejecución Local
Clonar el repositorio:

Bash
git clone [https://github.com/xiomio13/mio-creatives-qr.git](https://github.com/xiomio13/mio-creatives-qr.git)
cd mio-creatives-qr
Instalar dependencias:

Bash
npm install
Iniciar el servidor de desarrollo:

Bash
npm run dev
Compilar para producción:

Bash
npm run build
