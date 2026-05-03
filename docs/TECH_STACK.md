# Cargora — Tech Stack

> **Stand:** 2026-05-03

---

## Übersicht

| Layer | Tool | Version | Begründung |
|-------|------|---------|------------|
| **Sprache** | TypeScript | 6.x | Strict mode, Compiler fängt Fehler, Claude ist sehr stark in TS |
| **Build** | Vite | 8.x | Schneller HMR, einfaches Setup, modern |
| **Game-Engine** | Phaser | 4.1.x | 2D-Engine, Top-Down-Optimiert, Pixel-Art-tauglich, gute Doku |
| **Multiplayer (geplant)** | Colyseus | TBD | TS-nativ, Rooms+State-Sync eingebaut |
| **Hosting Spiel (geplant)** | Cloudflare Pages | — | Kostenlos, deploy via Git Push |
| **Hosting MP-Server (geplant)** | Railway oder Render | — | ~5 EUR/Monat |
| **Repo** | GitHub | — | `BmboBeutlin/cargora`, public |
| **Editor** | VS Code | — | Patricks Standard |
| **Sprite-Stil** | Pixel Art | — | Top-Down, 32×32 für Vehicles, kaschiert KI-Generation-Schwächen |

---

## Warum Web-Stack statt Godot oder Unity?

Entscheidung am 2026-05-03 — Begründung in `DECISIONS.md` ADR-001.

**Kurz:**
- Multiplayer im Browser einfacher (kein Installer, Link teilen reicht)
- TypeScript ist Claudes Stärke
- Hosting trivial
- Iteration schneller (Browser-Refresh statt Editor-Neustart)
- Tauri/Electron-Wrapper später möglich, falls Desktop-App gewünscht

**Was wir opfern:**
- Top-Performance bei 5000+ Entitäten (kommt erst bei großen Maps)
- 3D-Grafik (wir wollen 2D, Punkt)

---

## Phaser 4 — Was du wissen musst

- **Phaser 4** ist der Nachfolger von Phaser 3 (RC seit 2024). API ist großteils kompatibel.
- **Scene-System:** `class GameScene extends Phaser.Scene` mit `create()`, `update()`, `preload()`.
- **Game-Objekte:** `this.add.rectangle()`, `this.add.sprite()`, `this.add.image()`.
- **Input:** `this.input.on('pointerdown', ...)`, `this.input.on('wheel', ...)`.
- **Tweens:** `this.tweens.add({ targets, x, y, duration, ease, onComplete })`.
- **Camera:** `this.cameras.main` mit `setZoom()`, `getWorldPoint()`, etc.
- **Pixel Art:** `pixelArt: true` im Game-Config aktivieren.

---

## Code-Konventionen

Aus globaler Patrick-Konvention + projekt-spezifisch:

### TypeScript

- `"strict": true` — pflicht
- `erasableSyntaxOnly: true` — keine TS-`enum`s, keine `namespace`, keine Parameter-Properties
- `verbatimModuleSyntax: true` — `import type` für Type-Only-Imports
- `noUnusedLocals/Parameters: true` — saubere Codebase

### Const-Objects statt Enums

```typescript
// ❌ NICHT
enum TileType { Asphalt, Schotter }

// ✅ DOCH
const TileType = {
  Asphalt: 'asphalt',
  Schotter: 'schotter',
} as const;
type TileType = (typeof TileType)[keyof typeof TileType];
```

### Stil

- **Sprache im Code:** Englisch (Variablen, Funktionen, Kommentare)
- **Sprache in der UI:** Deutsch (HUD-Texte, Menüs später)
- **Keine Emojis im Code** (nur in Doku, sparsam)
- **Inline-Styles:** Nicht für CSS — wir nutzen `src/style.css` mit CSS-Variablen
- **Farben:** Orange `#f0882a` NUR für Logo/Primary-Akzent — sonst Graustufen-Palette

### File-Layout

```
src/
├── main.ts           # Entry point + Game-Config
├── style.css         # Globaler Reset + UI-Styling
├── scenes/           # Phaser-Scenes (eine Datei pro Scene)
├── world/            # Tile-Grid, Karte, Pathfinding
├── entities/         # Vehicle (LKW, Zug, ...) als abstrakter Type
├── economy/          # Cargo, Märkte, Warenketten
├── net/              # Multiplayer-Client (später)
└── types/            # Globale Type-Definitionen
```

---

## Dependencies (aktuell)

```json
{
  "dependencies": {
    "phaser": "^4.1.0"
  },
  "devDependencies": {
    "typescript": "~6.0.2",
    "vite": "^8.0.10"
  }
}
```

**Bewusst minimal.** Jede zusätzliche Lib muss begründet sein:
- ESLint? — TBD, vielleicht später für CI
- Prettier? — TBD, später
- Vitest? — sobald wir Tests schreiben (Phase 2+)

---

## Entwicklungs-Workflow

```bash
cd C:\Users\patrick\cargora
npm install          # einmalig
npm run dev          # Dev-Server auf localhost:5173
npm run build        # Production-Build in dist/
npm run preview      # Preview des Production-Builds
```

**Hot Module Replacement (HMR)** ist via Vite aktiv. Code-Änderung → Browser refreshed automatisch.

---

## Geplante Erweiterungen (nicht jetzt)

- **Colyseus-Server** als eigenes `server/`-Subprojekt mit eigener `package.json`
- **Zustand-Store** für UI-State (außerhalb von Phaser, falls wir HTML-UI erweitern)
- **Sentry** für Error-Tracking, sobald Freunde das Spiel testen
- **Sound:** Howler.js oder Phaser-eigenes Sound-System (Phase 4+)
- **Asset-Pipeline:** Sprite-Sheets aus einzelnen PNGs generieren (Aseprite-Workflow)
