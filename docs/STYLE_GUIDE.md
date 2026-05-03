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

## Offen — wartet auf `design-survey-v2.html`

### Perspektive (kritisch)

Patrick: „entweder 3/4 iso, oder 'vorne/oben' also keine klassische draufsicht"

→ **4 Optionen** zur Auswahl in der Folge-Survey:
1. **3/4-Iso (OpenTTD/SimCity 2000)** — schräge Drauf­sicht, Rauten-Tiles, Höhen als Stufen
2. **Cabinet-Iso (RollerCoaster Tycoon)** — flacherer Winkel, mehr Vorderseite sichtbar
3. **2.5D-Aufsicht (Theme Hospital/Anno 1404)** — schräge Drauf­sicht mit Volumen-Schatten
4. **High-Angle Side-View (Tropico/Banished)** — fast seitlich, leicht von oben

**Code-Komplexität:** 1 < 2 < 3 < 4. Visual-Reichtum: ähnlich umgekehrt.

### Era-Range

Wie viele Eras tatsächlich umsetzen? Mittelalter ist Start. Aber wie weit?
- 3 Eras (Mittelalter → Industrialisierung → Moderne)?
- 5 Eras (+ Frühe Neuzeit als Übergang, + Sci-Fi)?
- Mehr granular?

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
