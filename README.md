# WorldCup Insight 2026 ⚽

> Plataforma premium de análisis para la Copa Mundial FIFA 2026.
> Dark theme · Glassmorphism · Neon · Datos en vivo.

🔗 **[worldcup-insight.vercel.app](https://worldcup-insight.vercel.app)**

---

## Módulos

| Módulo | Estado | API |
|--------|:------:|-----|
| Dashboard | ✅ | Stats live, partido destacado, grupos |
| Equipos | ✅ | 48 selecciones, banderas, búsqueda |
| Partidos | ✅ | 104 matches, filtros, scores en vivo |
| Estadios | ✅ | 16 sedes por país anfitrión |
| Bracket | ✅ | Fase eliminatoria completa |
| Rankings | ✅ | Goleadores y tabla de equipos |
| Jugadores | ✅ | Goleadores del torneo, stats, búsqueda |
| Predicciones | ✅ | Proyecciones de clasificación por grupo |

---

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · TanStack Query · Zustand · React Router

## APIs

- **worldcup26.ir** — scores en vivo, equipos, grupos, estadios (gratis, sin key)
- **API-Football** — jugadores y stats (gratis con key)
- **OpenFootball** — respaldo de datos

---

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # TypeScript + Vite
```

## Deploy

Push a `main` → Vercel auto-deploy.

---

Construido con ⚽ y React 19
