# Cargora — Session Journal

> Chronologisches Tagebuch aller Claude-Sessions an diesem Projekt. Neueste Einträge **oben**. Format pro Eintrag siehe Vorlage am Ende.

---

## 2026-05-03 (Spät-Abend) — Survey V2 + Cabinet-Iso live im Spiel

**Dauer:** ~30 Min · **Claude-Modell:** Opus 4.7 (1M context)

### Was gebaut

- **Survey V2 von Patrick ausgefüllt** (Perspektive Cabinet-Iso, alle 5 Eras, Spieler-Tempo)
- **Code-Refactoring** aus monolithischem `main.ts` zu Multi-File:
  - `src/world/map.ts` — Tile-Definitionen + Karten-Daten (geteilt zwischen Scenes)
  - `src/scenes/TopDownScene.ts` — bisherige Top-Down-Logik
  - `src/scenes/CabinetIsoScene.ts` — neue Cabinet-Iso-Scene mit Diamond-Tiles + Y-Sort
  - `src/ui/hud.ts` — gemeinsame HUD-Render-Funktion
  - `src/main.ts` — Game-Config + Scene-Switcher (Taste `I` oder Button)
- **Live im Browser vergleichbar:** Patrick kann zwischen Top-Down und Cabinet-Iso wechseln, beide haben gleiche Spielmechanik (Klick-Fahren, Speed-Modifier)
- **Doku-Updates:**
  - `GAME_DESIGN.md`: V2-Antworten konsolidiert + Glockenkurve der Era-Tiefen
  - `STYLE_GUIDE.md`: Cabinet-Iso-Math + Tile-Größen finalisiert
  - `DECISIONS.md`: ADR-007 (Cabinet-Iso) + ADR-008 (Era-Progression mit Spieler-Tempo + Glocke)

### Patricks Survey-V2-Antworten

- **Perspektive:** Cabinet-Iso (RollerCoaster Tycoon-Stil)
- **Eras:** Alle 5 (Mittelalter, Frühe Neuzeit, Industrialisierung, Moderne, Sci-Fi-Twist)
- **Era-Tempo:** Spieler bestimmen Era-Übergang
- **Anmerkungen:**
  - Spieler-Tempo individuell mit Tradeoffs (Pioneer-Vorteil + Pioneer-Risiko)
  - Glockenkurve: Mittelalter+Sci-Fi schmal, Industrialisierung+Moderne breit
  - Live-Demo der Cabinet-Iso angefragt → eingebaut

### Technische Notizen

- **Phaser 4 Multi-Scene:** `game.scene.start(key)` + `game.scene.stop(key)` funktionieren wie erwartet, Scene-Switch ist instant
- **Cabinet-Iso-Math:** `gridToScreen(gx, gy) = (ORIGIN + (gx-gy)*W/2, ORIGIN + (gx+gy)*H/2)` mit TILE_W=64, TILE_H=32
- **Y-Sort über `setDepth(screenY)`:** Tiles weiter unten (näher am Spieler) werden über Tiles oben gerendert
- **Truck als 2-Polygon-Stack** (Body + Top) gibt 2.5D-Look ohne echte Sprites

### Nächste Session — Vorschläge

1. **Patrick testet beide Modi im Browser** und gibt Feedback (welche Perspektive fühlt sich „richtig" an?)
2. **Falls Cabinet-Iso bestätigt:** Top-Down-Scene entfernen, Cabinet-Iso wird Default
3. **Falls noch Anpassungen nötig:** Iso-Winkel/Tile-Verhältnis variieren (z.B. flacher → 64×24)
4. **Erste Era-1-Sprites generieren** (Pferdewagen, Trampelpfad-Tile, Marktplatz-Gebäude) — alle in Cabinet-Iso-Look

### Lessons aus dieser Session

- **Live-Code-Vergleich schlägt Survey-Bilder.** Die SVG-Skizzen in V2-Survey waren grobe Approximationen. Erst die echte Implementation im Browser zeigt, wie sich die Steuerung anfühlt. Pattern: Wo möglich, Live-Code statt statische Mockups.
- **Refactoring zu Multi-File hat sich gelohnt** — von 175 LOC monolithisch auf 5 Dateien strukturiert, die alle <100 LOC sind. Skaliert für die nächsten 100+ Code-Sessions.
- **Y-Sort-via-setDepth ist die einfachste Iso-Render-Reihenfolge.** Keine Sortier-Listen, keine Container-Hierarchien — nur Depth = Y-Position. Skaliert auf tausende Entities.

---

## 2026-05-03 (Abend) — Survey V1 + Vision-Pivot zu Era-Progression

**Dauer:** ~45 Min · **Claude-Modell:** Opus 4.7 (1M context)

### Was gebaut

- **Interaktive Design-Survey V1** (`docs/design-survey.html`) mit 10 Fragen, Visualisierungen, Auto-Save in localStorage
- Patrick hat die Survey ausgefüllt — Antworten konsolidiert in `docs/GAME_DESIGN.md`
- **Massiver Vision-Pivot**: Spiel beginnt jetzt im **Mittelalter mit Pferdekarren**, mit Era-Progression bis (potenziell) Sci-Fi
- `docs/GAME_DESIGN.md` V2 geschrieben mit überarbeitetem Phasen-Plan (12 → 20-24 Monate)
- `docs/STYLE_GUIDE.md` angelegt (Skelett mit bestätigten Pixel-Auflösung 48×48 + Stadt-Stil)
- **Survey V2** (`docs/design-survey-v2.html`) für die zwei offenen Klärungen: Perspektive (4 Optionen mit SVG-Visualisierungen) + Era-Range (Multi-Select)
- **3 neue ADRs** in `docs/DECISIONS.md`:
  - ADR-004: Era-Progression als Kern-Mechanik
  - ADR-005: Pixel-Auflösung 48×48 + erkennbare Gebäudetypen
  - ADR-006: Sabotage volle Bandbreite (wirtschaftlich + Spionage + direkt)
- `docs/INDEX.md` aktualisiert (Surveys + STYLE_GUIDE eingetragen)

### Patricks Survey-V1-Antworten (kompakt)

| Frage | Antwort |
|-------|---------|
| Setting | Fiktive Welt |
| Tech-Niveau | Mittelalter-Start mit Era-Progression bis leichter Sci-Fi |
| Karte | Mittel ~600×600 |
| Multiplayer | Allianzen + Verträge |
| Sabotage | Voll (Wirtschaft + Spionage + Direkt) |
| Format | Save-&-Continue-Kampagnen über Wochen |
| Wirtschaft | Cash-Flow + Investoren/Aktien/Kredite |
| Pixel | 48×48 |
| Stadt | Erkennbare Gebäudetypen |
| Perspektive | OFFEN — V2-Survey nötig (3/4-Iso ODER „vorne/oben") |

### Patricks Feedback zur Survey

> „Diese Art von Umfrage hat mir extrem gefallen. Beim nächsten Mal vielleicht noch mehrfach Auswahl"

→ Multi-Select in V2-Survey integriert (Frage 2: Era-Auswahl).

### Offene Klärungen vor Sprite-Generation

- [ ] **Perspektive** — V2-Survey, Frage 1 (4 visuelle Optionen)
- [ ] **Era-Range** — V2-Survey, Frage 2 (Multi-Select)
- [ ] **Era-Übergangs-Tempo** — V2-Survey, Frage 3

### Nächste Session — Vorschläge

1. **V2-Survey ausfüllen lassen** — Patrick öffnet `docs/design-survey-v2.html`, beantwortet 3 Fragen
2. **Style-Guide finalisieren** mit Perspektive-Wahl
3. **Erste Era-1-Sprites generieren** (Pferdewagen + Trampelpfad-Tile + Marktplatz-Gebäude)
4. **Spiel-Code anpassen** — aus „LKW + Asphalt" wird „Pferdewagen + Trampelpfad", neue Tile-Map mit Era-1-Optik

### Lessons aus dieser Session

- **Vorgefertigte Survey schneller als Q&A im Chat.** Patrick hat in ~10 Min alle 10 Fragen beantwortet, mit visuellen Vergleichen wo nötig. Pattern für zukünftige Game-Design-Iterationen: Survey-First statt Endlos-Chat.
- **Multi-Select-Feedback war wertvoll.** Patrick wollte Multi-Select — direkt in V2 eingebaut. Pattern: Survey-Feedback im nächsten Iteration aufnehmen, nicht erst „beim nächsten Spiel".
- **Anmerkungen sind oft wichtiger als die Hauptauswahl.** Patrick hat „Tech-Niveau: Heute + Sci-Fi-Twist" gewählt, aber in den Anmerkungen „Mittelalter beginnend mit Pferden" geschrieben — was die Vision **fundamental** geändert hat. Anmerkungen niemals überlesen.

---

## 2026-05-03 — Projekt-Bootstrap (Stunde-1-Prototyp)

**Dauer:** ~1 Stunde · **Claude-Modell:** Opus 4.7 (1M context)

### Was gebaut

- Verzeichnis `C:\Users\patrick\cargora\` angelegt
- Vite + TypeScript + Phaser 4 initialisiert (`npm create vite@latest cargora --template vanilla-ts`)
- Phaser 4.1 als Dependency hinzugefügt
- Vite-Default-Boilerplate (Counter, Logos, Asset-Demos) entfernt
- Stunde-1-Prototyp implementiert in `src/main.ts`:
  - 30×18-Tile-Karte (32px-Tiles), hardcoded als ASCII
  - 4 Tile-Typen: Asphalt, Schotter, Feldweg, Gras (nicht befahrbar)
  - LKW als blaues Quadrat mit Richtungs-Indikator (weißer Punkt vorne)
  - Klick-zum-Fahren mit Tween-basierter Bewegung
  - Geschwindigkeit abhängig vom durchschnittlichen Speed-Modifier zwischen Start- und Ziel-Tile
  - Mausrad-Zoom (0.5×–2.5×)
  - HUD oben links: Position, Untergrund, Speed-Modifier, Steuerungs-Hinweis
  - Flash-Warnung bei Versuch, auf Gras zu fahren
- Komplette Doku-Struktur angelegt:
  - `CLAUDE.md` (Master-Index)
  - `docs/INDEX.md` (Doku-Inhaltsverzeichnis)
  - `docs/GAME_DESIGN.md` (Vision + Pillars + Phasen-Plan)
  - `docs/TECH_STACK.md` (Tech-Entscheidungen)
  - `docs/DECISIONS.md` (ADR-001 bis ADR-003)
  - `docs/JOURNAL.md` (diese Datei)
  - `README.md` (Public-facing)

### Entscheidungen getroffen

- ADR-001: Web-Stack (TS+Phaser+Vite+Colyseus) statt Godot/Unity
- ADR-002: Pixel Art Top-Down als Visual-Stil
- ADR-003: Doku-First-Strategie als Engram-Backup

### Technischer Stack final

- TypeScript 6, Vite 8, Phaser 4.1
- Pfad: `C:\Users\patrick\cargora\`
- Repo: `BmboBeutlin/cargora` auf GitHub (öffentlich, geplant)
- Hosting: TBD (Cloudflare Pages für Spiel, Railway/Render für MP-Server)

### Was offen blieb

- [ ] **GitHub-Repo erstellen + initial push** — `gh repo create BmboBeutlin/cargora --public --source=. --push`
- [ ] **Browser-Test** — `npm run dev` ausführen, prüfen ob Phaser 4-API in main.ts wie erwartet funktioniert (Phaser 4 vs. 3 könnte API-Diffs haben)
- [ ] **README.md** noch ausschmücken (Quickstart, Screenshot)
- [ ] **`.gitignore`** prüfen (Vite-Default sollte reichen, aber `dist/` und `node_modules/` müssen drin sein)
- [ ] **Engram-Verfügbarkeit** in dieser Session geklärt: NICHT erreichbar (`mcp__engram__*`-Tools nicht geladen). Tunnel-Status für nächste Session prüfen.

### Lessons aus dieser Session

- **Phaser 4 ist installiert (4.1.x)**, nicht Phaser 3. API-Kompatibilität noch nicht final getestet — falls in nächster Session Bugs auftauchen, könnten sie aus Phaser-3→4-Migration-Differenzen stammen.
- **Vite Vanilla-TS-Template hat üppiges Boilerplate** (Logos, Counter, Asset-Demos) — beim Setup direkt rauswerfen, nicht „später aufräumen".
- **`erasableSyntaxOnly: true`** verbietet TS-`enum`s. Const-Objects mit Companion-Type sind Pflicht-Pattern (in CLAUDE.md global festgelegt, jetzt in TECH_STACK.md projekt-lokal nochmal dokumentiert).

### Nächste Session — Vorschläge

1. **Browser-Test der Stunde-1-Version** — `npm run dev`, klicken, Bugs sammeln, fixen.
2. **GitHub-Repo erstellen** — Initial-Commit + Push, Patricks Kumpel als Collaborator vorbereiten.
3. **Game-Design-Session** — `docs/GAME_DESIGN.md` „Offene Fragen" durchgehen mit Patrick (Karten-Größe, Tech-Niveau, Konfliktlösung MP, Wirtschaftsmodell etc.).
4. **A*-Pathfinding** — aktuelle Bewegung ist geradlinig (kein Pathfinding, ignoriert Hindernisse zwischen Start und Ziel). Erst dann „echte" Karten möglich.

---

## Vorlage für neue Einträge

```markdown
## YYYY-MM-DD — [Kurze Beschreibung der Session]

**Dauer:** X Stunden · **Claude-Modell:** [Modell]

### Was gebaut

- Bullet 1
- Bullet 2

### Entscheidungen getroffen

- ADR-XXX: ... (Verweis auf DECISIONS.md falls signifikant)

### Was offen blieb

- [ ] Aufgabe 1
- [ ] Aufgabe 2

### Lessons aus dieser Session

- Lesson 1 (mit Wiederverwendbarkeit für Zukunft)

### Nächste Session — Vorschläge

1. Mögliche nächste Aktion
```
