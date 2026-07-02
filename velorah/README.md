# Velorah

Cinematic hero landing page with a fullscreen looping video background, glassmorphic navigation, and an in-app "Zen Mode" focus timer for deep work / studying — built with React, Vite, TypeScript, Tailwind CSS, and shadcn/ui.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Structure

- `src/pages/Hero.tsx` — the landing page (video background, glass nav, cinematic headline, "Begin Journey" CTA)
- `src/pages/Zen.tsx` — the focus/study timer page you land on after clicking "Begin Journey" (`/zen` route)
- `src/components/BackgroundVideo.tsx` — shared fullscreen looping `<video>` background
- `src/components/Navbar.tsx` — shared glassmorphic nav bar
- `src/components/TimerRing.tsx` — SVG progress ring used by Zen Mode
- `src/components/ui/button.tsx` — shadcn/ui button primitive
- `src/index.css` — theme tokens (HSL CSS variables), Google Fonts import, `.liquid-glass` effect, and `fade-rise` / ambient-pulse keyframes

## Zen Mode

Clicking "Begin Journey" (from the nav or the hero CTA) routes to `/zen`, a fullscreen focus timer that keeps the same video background, typography, and liquid-glass styling as the hero:

- Presets: Sprint (15m), Focus (25m), Deep Work (50m), Flow (90m)
- Start / pause / reset controls
- An animated SVG progress ring that pulses gently while a session is running
- "Exit Session" returns to the hero page
