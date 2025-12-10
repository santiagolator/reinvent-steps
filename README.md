# 🚶 AWS re:Invent 2025 Step Counter

Generador de tarjetas personalizadas para mostrar tus estadísticas de pasos durante el AWS re:Invent 2025.

> [https://reinvent-steps.vercel.app](https://reinvent-steps.vercel.app/)

![Preview](preview.png)

## ✨ Características

- 📊 Ingreso de pasos por día (1-7 días)
- 🏨 Selección de venues recorridos
- 🏅 Sistema de rangos de fantasía
- 📱 Diseño responsive
- 🖼️ Descarga como imagen PNG

## 🏅 Sistema de Rangos

| Pasos       | Rango              | Emoji |
| ----------- | ------------------ | ----- |
| 0 - 30k     | Cloud Seedling     | 🌱    |
| 30k - 50k   | Cloud Wanderer     | 🧭    |
| 50k - 75k   | Trail Blazer       | 🔥    |
| 75k - 100k  | Summit Seeker      | ⛰️    |
| 100k - 125k | Cloud Strider      | 🌤️    |
| 125k - 150k | Legend Walker      | 🗺️    |
| 150k - 175k | Cloud Titan        | 👑    |
| 175k+       | Werner Vogels Mode | 🚀    |

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar o descomprimir el proyecto
cd reinvent-steps-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
reinvent-steps-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🛠️ Tecnologías

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- Canvas API para generación de PNG

## 📝 Personalización

### Cambiar rangos

Editá el array `RANKS` en `src/App.jsx`:

```javascript
const RANKS = [
  { min: 0, max: 30000, name: "Tu Rango", emoji: "🎯", color: "#FF9900" },
  // ...
];
```

### Cambiar venues

Editá el array `VENUES` en `src/App.jsx`:

```javascript
const VENUES = ["Venue 1", "Venue 2", "Venue 3"];
```

## 📄 Licencia

MIT - Libre para usar y modificar.

---

Made with ♥️ for the AWS re:Invent community
