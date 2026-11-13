# 🚶 AWS re:Invent 2026 Step Counter

Generador de tarjetas personalizadas para mostrar tus estadísticas de pasos durante el AWS re:Invent 2026.

> [https://reinvent-steps.vercel.app](https://reinvent-steps.vercel.app/)

![Preview](preview.png)

## ✨ Características

- 📊 Ingreso de pasos por día, lunes 30 de noviembre a viernes 4 de diciembre
- 🏨 Selección de venues recorridos
- 🏅 Sistema de rangos con temática AI y progreso al próximo rango
- 👀 Tarjeta con preview en vivo mientras cargás los datos
- 🌐 Español e inglés, con detección automática del idioma del browser
- 📱 Diseño responsive
- 🖼️ Descarga como imagen PNG

## 🏅 Sistema de Rangos

| Pasos       | Rango                 | Emoji |
| ----------- | --------------------- | ----- |
| 0 - 30k     | Prompt Padawan        | 🌱    |
| 30k - 50k   | Context Window Walker | 🧭    |
| 50k - 75k   | Vibe Coder            | ✨    |
| 75k - 100k  | Token Burner          | 🔥    |
| 100k - 125k | Agentic Strider       | 🤖    |
| 125k - 150k | Multi-Agent Legend    | 🧠    |
| 150k - 175k | AGI Titan             | 👑    |
| 175k+       | Werner Vogels Mode    | 🚀    |

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
reinvent-steps/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                  # Formulario, estado y layout
│   ├── data.js                  # Rangos, venues y helpers
│   ├── i18n.js                  # Textos en español e inglés
│   ├── components/
│   │   ├── StepsCard.jsx        # La tarjeta que se exporta a PNG
│   │   ├── RankLegend.jsx       # Tabla de rangos
│   │   └── Icons.jsx            # Logo AWS, LinkedIn, GitHub
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Tokens de tema (Tailwind 4) y fondo
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Tecnologías

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [html-to-image](https://github.com/bubkoo/html-to-image) para generar el PNG

## 📝 Personalización

### Cambiar rangos

Editá el array `RANKS` en `src/data.js`:

```javascript
const RANKS = [
  { min: 0, max: 30000, name: "Tu Rango", emoji: "🎯", color: "#FF9900", description: "..." },
  // ...
];
```

### Cambiar venues

Editá el array `VENUES` en `src/data.js`:

```javascript
const VENUES = ["Venue 1", "Venue 2", "Venue 3"];
```

## 📄 Licencia

MIT - Libre para usar y modificar.

---

Made with ♥️ for the AWS re:Invent community
