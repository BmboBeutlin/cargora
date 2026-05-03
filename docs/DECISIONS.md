# Cargora — Architecture Decision Records (ADRs)

> Chronologische Liste aller signifikanten Architektur-Entscheidungen mit Begründung. Format inspiriert von Michael Nygards ADR-Stil.

---

## ADR-001: Web-Stack statt Godot/Unity

**Datum:** 2026-05-03
**Status:** Akzeptiert
**Entscheider:** Patrick

### Kontext

Cargora soll ein Multiplayer-fähiges 2D-Top-Down-Spiel werden, von Patrick mit Freunden gespielt. Patrick programmiert nicht selbst — Claude schreibt 100% des Codes. Patrick ist Grafik/Design-stark.

### Optionen

1. **Godot 4 + GDScript** — Open Source, MP eingebaut, gut für 2D
2. **Unity + C#** — riesiges Ökosystem, schwerere Engine
3. **Web-Stack: TypeScript + Phaser + Vite + Colyseus** — Browser-basiert
4. **Rust + Bevy** — Performance, aber zu schwer für Hobby-Projekt

### Entscheidung

**Option 3: Web-Stack.**

### Begründung

- Freunde brauchen nichts installieren — Link teilen, spielen
- Hosting trivial (Cloudflare Pages + Railway)
- Claude ist in TypeScript am stärksten → weniger Bugs
- Iteration schneller (Browser-Refresh statt Editor-Neustart)
- Patrick hat HTML/CSS-Kenntnisse — kann zumindest UI-Layouts grob beurteilen
- Tauri/Electron-Wrapper später möglich, falls Desktop-App gewünscht (siehe ADR-XXX später bei Bedarf)

### Konsequenzen

- Performance-Limit bei 5000+ gleichzeitigen Entitäten — irrelevant für Phase 1, evaluieren in Phase 4
- Kein „echtes" Desktop-App-Gefühl bis Tauri-Wrapper draufgesetzt wird
- Multiplayer-Server-Hosting kostet ~5 EUR/Monat ab MP-Phase

---

## ADR-002: Pixel Art Top-Down als Visual-Stil

**Datum:** 2026-05-03
**Status:** Akzeptiert
**Entscheider:** Patrick

### Kontext

Grafiken sollen überwiegend KI-generiert sein. Patrick will explizit nicht „nach KI" aussehen.

### Optionen

1. **Realistische 3D-Render** (Midjourney-default) — sieht zu sehr nach KI aus
2. **Pixel Art Top-Down** — kaschiert KI-Schwächen, eigener Stil
3. **Vektor-Optik** (Mini-Motorways-Style) — sehr abstrakt, weniger Tiefe-Vermittlung

### Entscheidung

**Option 2: Pixel Art Top-Down.**

### Begründung

- Bei 32×32 Pixeln keine 6-Finger-Hände, keine Glanz-Artefakte
- Konsistenz erzwingbar (feste Palette, feste Auflösung)
- Stilistisch eigenständig — Spieler sehen es als Designentscheidung, nicht als Notlösung
- Patrick kann KI-Sprites in Aseprite manuell polieren (seine Stärke)

### Konsequenzen

- Style-Guide nötig (`docs/STYLE_GUIDE.md` TBD): feste Palette, feste Auflösung pro Asset-Typ
- Aseprite als Tool (~20 EUR Einmal-Kauf) für Patrick zur Sprite-Politur
- Kein Realismus möglich — alles muss in Pixel-Art-Sprache erzählt werden

---

## ADR-003: Doku-First-Strategie für Multi-Session-Kontinuität

**Datum:** 2026-05-03
**Status:** Akzeptiert
**Entscheider:** Patrick

### Kontext

Das Projekt läuft über 12+ Monate, mit vielen einzelnen Claude-Sessions. Engram (das primäre Memory-System) ist nicht immer in jeder CLI-Session verfügbar (siehe Tunnel-Probleme 2026-05-03). Patrick will, dass auch ohne Engram zukünftige Sessions wissen, wo sie stehen.

### Optionen

1. **Nur auf Engram verlassen** — riskant, wenn Engram ausfällt
2. **Doku-Files als Engram-Ersatz** — redundant, Pflege-Aufwand
3. **Hybrid: Engram primär + Doku-Files als Backup** — Best-of-Both

### Entscheidung

**Option 3: Hybrid mit Doku als zuverlässigem Fallback.**

Konkret:
- `CLAUDE.md` im Repo-Root als Master-Index
- `docs/INDEX.md` als Inhaltsverzeichnis
- `docs/JOURNAL.md` als Session-Tagebuch
- `docs/DECISIONS.md` (diese Datei) für Architektur-ADRs
- `docs/GAME_DESIGN.md`, `docs/TECH_STACK.md` als lebende Specs
- Engram zusätzlich, wenn verfügbar

### Begründung

- Doku in Git ist immer verfügbar, auch ohne Tunnel/Server
- ADRs zwingen zur Begründungs-Disziplin
- Patrick kann Doku selbst lesen — Engram-Memories nicht (CLI-Tool only)
- Externe (Patricks Kumpel) können Doku verstehen, ohne Engram-Zugang zu brauchen

### Konsequenzen

- Pflege-Aufwand: Nach jeder signifikanten Session muss `JOURNAL.md` ergänzt werden
- Doppelte Speicherung möglich (Engram + Doku) — bewusste Redundanz
- `CLAUDE.md` muss erste Aktion in neuer Session sein (Lesen)

---

## Template für neue ADRs

```markdown
## ADR-XXX: [Titel]

**Datum:** YYYY-MM-DD
**Status:** Vorgeschlagen | Akzeptiert | Abgelehnt | Veraltet | Ersetzt durch ADR-YYY
**Entscheider:** Patrick (oder Patrick + Kumpel)

### Kontext

[Was ist die Situation, warum müssen wir entscheiden?]

### Optionen

1. **Option A** — Beschreibung
2. **Option B** — Beschreibung

### Entscheidung

**Option X gewählt.**

### Begründung

- Punkt 1
- Punkt 2

### Konsequenzen

- Was ändert sich dadurch
- Welche Folge-Aufgaben entstehen
```
