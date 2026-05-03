# Sprites — Programmatic Placeholder Pixel Art

> **Status:** Phase 1 (Modern-Setting) — programmatisch via Canvas-API erzeugte Platzhalter.
> **Stand:** 2026-05-03

Diese Sprites sind **kein finaler Asset-Stand**. Sie ersetzen die nackten blauen Polygone aus dem Bootstrap-Prototyp durch erkennbare Pixel-Art, sind aber bewusst bescheiden — echte Aseprite-Hand-Pixel-Art ist deutlich besser und kommt spaeter.

## Was hier liegt

| Datei | Output | Aufloesung | Zweck |
|-------|--------|------------|-------|
| `truck.ts` | `HTMLCanvasElement` | 48x48 | Moderner Cargo-LKW, Cabinet-Iso ~30deg von vorne-oben |
| `tile-asphalt.ts` | `HTMLCanvasElement` | 64x32 | Strassen-Tile, Diamond-Shape |
| `tile-grass.ts` | `HTMLCanvasElement` | 64x32 | Wiesen-Tile mit Grashalmen |
| `tile-schotter.ts` | `HTMLCanvasElement` | 64x32 | Schotter-Tile mit Stein-Pixeln |
| `tile-feldweg.ts` | `HTMLCanvasElement` | 64x32 | Sandiger Feldweg mit Reifenspuren |
| `warehouse.ts` | `HTMLCanvasElement` | 64x96 | Lager-Halle mit Roll-Tor |
| `index.ts` | Re-Exports | — | Sammelpunkt + `SPRITE_KEYS` |

## Verwendung

Jede Datei exportiert genau eine `create...Sprite()`-Funktion, die ein frisches `HTMLCanvasElement` zurueckgibt. Diese Canvases lassen sich direkt in Phaser als Texturen registrieren:

```typescript
import { createTruckSprite, SPRITE_KEYS } from '@/assets/sprites';

// In einer Phaser.Scene.preload() oder create():
const truckCanvas = createTruckSprite();
this.textures.addCanvas(SPRITE_KEYS.truck, truckCanvas);

// Spaeter:
this.add.image(x, y, SPRITE_KEYS.truck);
```

Alle Sprites werden mit `imageSmoothingEnabled = false` gezeichnet — Pixel bleiben hart, kein Anti-Aliasing.

## Stil-Vorgaben (eingehalten)

- Cabinet-Iso-Look (keine reine Top-Down-Sicht)
- Lichtquelle oben-rechts -> Schatten links/unten
- Begrenzte Palette pro Sprite (5-8 Farben)
- 1px-Outlines, harte Kanten
- **Kein Orange in Sprites** (Cargora-Orange ist UI-only)
- Modern-Setting-Farben (Asphalt-Grau, Industrie-Blau, gedaemtes Gruen, Beige-Braun)

## Limitierungen der programmatischen Generation

Programmatische Pixel-Art via Canvas-`fillRect` ist **kein Ersatz** fuer hand-gepixelte Sprites in Aseprite:

1. **Keine wirklich organischen Formen.** Pferde, Baeume, geschwungene Karosserie-Kanten lassen sich algorithmisch nur grob skizzieren. Was hier rauskommt sind eckige Andeutungen.
2. **Schatten/Highlights sind grobe Bands**, keine fein modellierten Volumen.
3. **Keine Animation/Frames.** Jede Funktion produziert genau einen statischen Sprite.
4. **Kein einheitlicher Master-Stil.** Jeder Sprite wurde isoliert designt — bei einem grossen Sprite-Set faellt das auf.
5. **Die Cabinet-Iso-Perspektive ist hier approximiert**, nicht streng mathematisch konstruiert. Vehicles und Buildings koennten leicht inkonsistente Winkel haben.
6. **Iteration ist teuer.** Jede visuelle Aenderung ist Code-Edit + Page-Reload — in Aseprite zieht man einfach Pixel.

## Nicht-Aufgabe dieses Moduls

- Diese Files **integrieren sich nicht selbst** in `CabinetIsoScene`, `map.ts` oder `main.ts`. Patrick / Hauptagent verdrahten die Texturen manuell.
- Keine Aenderung an `package.json`, `tsconfig.json`, vorhandenen Scenes.
- Keine Animation, kein Spritesheet, kein Atlas.

## Naechste Schritte (Empfehlung)

1. Patrick begutachtet das visuelle Resultat im Browser.
2. Pro Sprite: entweder akzeptieren als Platzhalter oder direkt durch Aseprite-Pixel-Art ersetzen.
3. Sobald echte PNGs vorliegen, werden die `create...Sprite()`-Funktionen redundant — sie koennen dann durch `loader.image(key, 'path/to.png')` abgeloest werden, das Interface (`SPRITE_KEYS`) bleibt stabil.
