# Cargora — Session Journal

> Chronologisches Tagebuch aller Claude-Sessions an diesem Projekt. Neueste Einträge **oben**. Format pro Eintrag siehe Vorlage am Ende.

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
