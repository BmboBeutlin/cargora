# Cargora — Visual Style Guide

> **Stand:** 2026-05-03 (Skelett, wird komplettiert nach Klärung Perspektive)
> **Status:** WIP — Pixel-Auflösung + Stadtbild bestätigt, Perspektive offen

---

## Bestätigte Werte

| Aspekt | Wert | Begründung |
|--------|------|------------|
| **Pixel-Auflösung pro Sprite** | 48 × 48 px | Patrick-Wahl in Survey 2026-05-03. Mehr Detail als OpenTTD-Default, erlaubt sichtbare Räder, Fenster, Banner. |
| **Tile-Größe Karte** | 48 × 48 px (für Top-Down) oder 48 × 24 px Rauten (für Iso) | Hängt von Perspektive ab — siehe `OFFEN`. |
| **Stadt-Stil** | Erkennbare Gebäudetypen | Häuser, Fabriken, Kirchen, Wohnblocks haben unterschiedliche Sprites + Cargo-Profile. |
| **Era-Visualität** | Era-spezifisch | Sprites müssen pro Era anders aussehen (Pferdewagen ≠ LKW). |
| **Akzentfarbe** | `#f0882a` (Cargora-Orange) | Nur für Logo + Primary-Buttons, NIE in Sprites/Tiles. |

---

## Bestätigt aus V2-Survey

### Perspektive: **Cabinet-Iso (RollerCoaster Tycoon-Stil)**

- **Tile-Shape:** Diamond/Raute mit 2:1-Verhältnis
- **Tile-Größe:** 64×32 px (entspricht 48×48 äquivalent für Sprite-Auflösung)
- **Render-Reihenfolge:** Y-Sort (hinten nach vorne via `setDepth`)
- **Vehicles/Buildings:** Sprites mit erkennbarer Vorderseite (mehr Front-Detail als bei True-Iso)
- **Mathematik:**
  ```
  screenX = ORIGIN_X + (gridX - gridY) * (TILE_W / 2)
  screenY = ORIGIN_Y + (gridX + gridY) * (TILE_H / 2)
  ```

### Era-Range: **Alle 5 Eras**

Mittelalter, Frühe Neuzeit, Industrialisierung, Moderne, Sci-Fi-Twist.

→ Pro Era separater Sprite-Set (Vehicles, Buildings, Tile-Texturen).

### Era-Sprite-Volumen (Schätzung)

Bei 5 Eras × ~30 Sprites pro Era (10 Vehicles, 15 Buildings, 5 Tile-Sets) = **~150 Sprites total**. Spread über 20-24 Monate = ~6-8 Sprites pro Monat. Machbar mit KI-Generation + Patrick-Politur.

---

## Farbpalette (Vorab-Skizze, finalisiert nach Sprite-Tests)

Inspiration: Cargora-App-Theme (dunkel) + warmer Mittelalter-Look.

### Era 1 — Mittelalter (Vorab)

```
Erde/Trampelpfad:    #6a5238  (warmes Braun)
Wiese:               #4a7a3a  (gedämpftes Grün)
Wald:                #2a4a2a  (Tannengrün)
Stein/Burg:          #807868  (Kalkstein-Grau)
Holz (Wagen, Hütten):#a06840  (Eichenholz)
Pferd (Fuchs):       #8a4a2a  (Rotbraun)
Pferd (Schimmel):    #d8d0c0  (Cremeweiß)
Cargo-Sack:          #c8a878  (Leinen)
Wasser:              #4a6a8a  (gedämpftes Blau)
```

### UI-Palette (App-Frame, NICHT Sprites)

```
--bg-base:       #0d0f13  (App-Hintergrund)
--bg-surface:    #171b22  (Panels, HUD)
--bg-elevated:   #1e2229  (Cards, Hover)
--text-main:    #c8d0db  (Primärtext)
--text-secondary:#7a8494  (Labels)
--accent:        #f0882a  (Cargora-Orange — sparsam!)
```

---

## Sprite-Konventionen (für KI-Generation + manuelle Politur)

### Datei-Struktur (TBD nach erstem Sprite-Test)

```
src/assets/sprites/
├── era1-medieval/
│   ├── vehicles/
│   │   ├── horse-cart-empty.png      (48×48)
│   │   ├── horse-cart-loaded.png     (48×48)
│   │   └── ...
│   ├── tiles/
│   │   ├── grass.png                 (48×48 oder 48×24)
│   │   ├── path-trampelpfad.png      (48×48 oder 48×24)
│   │   └── ...
│   └── buildings/
│       ├── house-small.png           (48×48)
│       ├── market-square.png         (96×96)
│       └── ...
├── era2-early-modern/   (TBD)
└── ...
```

### Generierungs-Workflow

1. Claude generiert Sprite-Vorschlag (KI-Image-Generation in 48×48 oder höher, dann downscale).
2. Patrick beurteilt + ggf. polish in Aseprite (manuelle Pixel-Korrektur).
3. Final-Sprite committed unter `src/assets/sprites/...`.
4. Eintrag in `docs/STYLE_GUIDE.md` (Update dieser Datei): Welcher Sprite, welche Era, welche Funktion.

### KI-Generation-Anti-Patterns

Was wir VERMEIDEN:
- ❌ KI-typische weiche Verläufe / Glow / Bokeh
- ❌ 6-Finger-Hände, falsch-anatomische Pferde
- ❌ Inkonsistente Lichtquellen zwischen Sprites
- ❌ „Realistic"-Stil (sieht zu sehr nach KI)
- ❌ Anti-Aliasing zwischen Pixeln (Pixel müssen hart bleiben)

Was wir WOLLEN:
- ✅ Klare 1-Pixel-Linien
- ✅ Begrenzte Palette (max. 16 Farben pro Sprite)
- ✅ Eine konsistente Lichtquelle (oben-rechts)
- ✅ Stilisierte, „knapp lesbare" Formen statt fotorealistisch

---

## Iteration-Log

- **2026-05-03:** Skelett angelegt. Pixel-Auflösung 48×48 + Stadt-Stil bestätigt. Perspektive offen → wartet auf v2-Survey. Vorab-Palette für Era 1 (Mittelalter) skizziert.
