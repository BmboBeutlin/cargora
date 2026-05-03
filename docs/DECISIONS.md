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

---

## ADR-004: Era-Progression als Kern-Mechanik (Pivot von „nur Moderne")

**Datum:** 2026-05-03
**Status:** Akzeptiert
**Entscheider:** Patrick (via Survey V1 + Anmerkungen)

### Kontext

Initial-Vision (Stunde 1) war ein Logistik-Tycoon mit modernen LKW als Start. Survey V1 hat ergeben: Patrick will mit **Pferdekarren im Mittelalter** beginnen, mit Tech-Tree-Progression durch die Eras. Wörtlich: „beginnend aber mit pferden am liebsten im mittelalter oderso".

### Optionen

1. **Nur eine Era (Moderne)** — wie ursprünglich geplant. Schmaler Scope.
2. **Era-Progression** — Spieler beginnen Mittelalter, forschen sich durch Eras hoch (wie Civilization).
3. **Mehrere Welten in jeder Era** — getrennte Spiele pro Era, nicht progressiv.

### Entscheidung

**Option 2: Era-Progression als Kern-Mechanik.**

### Begründung

- Patricks explizite Vision (V1-Anmerkung)
- Fügt langlebige Belohnungs-Loop hinzu — jede neue Era ist „neues Spiel im Spiel"
- Passt zu Save-&-Continue-Kampagnen (auch Patrick-Wahl)
- Nutzt Modulare-Tiefe-Pillar voll aus: Pferdekarren haben analoges System wie LKW (Pferd/Kutsche/Hufeisen ↔ Reifen/Motor/Aufbau)
- Era-Übergänge sind eindeutige Spielzeit-Marker für Multiplayer-Sessions

### Konsequenzen

- **Scope vervielfacht sich.** Statt 12 Monate jetzt 20-24 Monate bis vollständige Era-Progression. (Phasen-Plan in `GAME_DESIGN.md` überarbeitet.)
- **Phase 1 MVP ändert sich komplett** — statt LKW + Asphalt-Straßen jetzt Pferdewagen + Trampelpfade.
- **Sprite-Pipeline pro Era nötig** — Era-spezifische Vehicles, Tiles, Buildings.
- **Forschungsbaum wird Era-übergreifend** — statt linear nun mit Era-Verzweigungen.
- **Tech-Stack-Auswirkung minimal** — Phaser/TS/Colyseus skalieren mit, nur Asset-Volume wächst.

---

## ADR-005: Pixel-Auflösung 48×48 + Stadt-Stil mit erkennbaren Gebäudetypen

**Datum:** 2026-05-03
**Status:** Akzeptiert
**Entscheider:** Patrick (via Survey V1)

### Kontext

Initial-Style-Guide brauchte Konkretisierung. Survey V1 hat zwei Visual-Punkte bestätigt.

### Entscheidung

- **Pixel-Auflösung pro Sprite:** 48 × 48 px
- **Stadt-Stil:** Erkennbare Gebäudetypen (Häuser, Fabriken, Kirchen, Wohnblocks)

### Begründung

- 48×48 erlaubt sichtbare Details (Räder, Fenster, Banner, Pferde-Mähne)
- 48×48 ist Mittelweg zwischen Retro-Charme (16×16) und KI-Generation-Aufwand (64+)
- Erkennbare Gebäudetypen → Cargo-Bedarfs-Profile pro Typ → tiefere Wirtschaft
- Konsistent mit Era-Progression (Mittelalter-Burg ≠ Industrialisierung-Fabrik ≠ Moderne-Hochhaus)

### Konsequenzen

- Sprite-Generation muss in 48px arbeiten (oder höher, dann downscale)
- Style-Guide-File `docs/STYLE_GUIDE.md` angelegt
- Pro Era separate Sprite-Sets nötig
- Tile-Größe Karte muss zu 48 passen — entweder 48×48 (Top-Down) oder 48×24 (Iso-Rauten)

---

## ADR-006: Sabotage volle Bandbreite (wirtschaftlich + Spionage + direkt)

**Datum:** 2026-05-03
**Status:** Akzeptiert
**Entscheider:** Patrick (via Survey V1)

### Kontext

Multiplayer-Konfliktdynamik musste festgelegt werden.

### Entscheidung

**Volle Bandbreite erlauben.** Patrick hat „+ Direkte Sabotage" gewählt UND notiert: „spionage und co aber auch dazu". Alle drei Stufen erlaubt.

### Begründung

- Patrick hat es explizit gewählt
- Hobby-Projekt mit Freunden — soziale Dynamik erträgt Drama (kein Reputations-Risiko wie bei kommerziellem Game)
- Multi-Tier-System gibt Spielern Wahl: Pazifist spielt rein wirtschaftlich, Aggressor sabotiert
- Direkte Sabotage muss kostspielig genug sein, dass sie strategisch ist (sonst kippt das Spiel)

### Konsequenzen

- **Komplexes Konflikt-Balancing** in Phase 4+ nötig
- **Anti-Sabotage-Mechaniken** (Wachposten, Versicherungen, Reputation-System) müssen mit Sabotage zusammen designt werden
- Möglicherweise „Pazifist-Modus" als Server-Setting für Gruppen, die das nicht wollen

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
