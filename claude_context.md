# Contexto del Proyecto: My-Portfolio

Este archivo proporciona un resumen eficiente en tokens para asistir a la IA.

## Stack Tecnológico
- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide-React.
- **Backend:** Node.js, Express, Mongoose (MongoDB).

## Arquitectura
- App MERN: frontend en raíz, API Express en `/server`.
- Modo fallback: Si MongoDB no está corriendo, el backend usa datos mock y sigue funcionando (`server/index.js`).

## Estructura de Carpetas 
- `/.claude/skills`: Contiene 31 skills instaladas de `awesome-claude-skills` listas para usar por Claude Code (ej. herramientas de UI/UX como `artifacts-builder`, `theme-factory`, `canvas-design`).
- `/src/components`: Secciones principales de la UI (`Navbar`, `Hero`, `About`, `Experience`, `Projects`, `Education`, `Contact`).
- **Efectos e Interactividad:** La UI incluye elementos visuales avanzados y de juego como `DualWorldOverlay`, `CyberGrid`, `MouseEffect` y un minijuego/efecto `TurretDefense` integrados en el background de `App.jsx`.
- `/server`: Carpeta del backend (API puerto 5000). Incluye `/routes` y `/models`.

## Scripts de Desarrollo
- Frontend: `npm run dev`
- Backend: `cd server && npm run dev`

## Notas Clave
- El sitio es un portfolio personal interactivo con temática cyber/gaming.
- Utiliza **Tailwind CSS v4** y motion animations con **Framer Motion**.
- La tipografía principal en todo el sitio es pixelart (`Press Start 2P`), con contenedores y componentes adaptados (responsive, break-words) para móviles.
- Los minijuegos de background están integrados y adaptados estéticamente al DOM dinámico (ej. `TurretDefense` lee las posiciones de la UI usando `getBoundingClientRect()`).
- El proyecto tiene soporte avanzado para **Claude Code** mediante skills locales, permitiendo generación de UI/UX (`artifacts-builder`), branding y despliegue automatizado.
