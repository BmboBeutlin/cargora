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

---

## ADR-007: Cabinet-Iso als Karten-Perspektive

**Datum:** 2026-05-03
**Status:** Akzeptiert
**Entscheider:** Patrick (via Survey V2)

### Kontext

In Survey V1 hat Patrick „3/4 iso oder 'vorne/oben'" notiert. Survey V2 mit visuellem Vergleich (4 Optionen) hat Cabinet-Iso (RollerCoaster Tycoon-Stil) gewählt.

### Optionen

1. **3/4-Iso (OpenTTD)** — Standard-Iso, etwas steiler
2. **Cabinet-Iso (RCT)** — flacherer Winkel, mehr Vorderseite
3. **2.5D-Aufsicht (Theme Hospital)** — Top-Down mit Schatten-Hint
4. **High-Angle Side-View (Tropico)** — fast seitlich

### Entscheidung

**Option 2: Cabinet-Iso.**

### Begründung

- Patrick-Wahl in V2-Survey
- Mittelweg zwischen Code-Komplexität und Visual-Reichtum
- Mehr Front-Detail von Sprites möglich (LKW-Grill, Pferd-Profil, Gebäude-Eingang sichtbar)
- Klassisch-charmanter Tycoon-Look (Wertschätzung der Genre-Tradition)
- **Live-Demo im Code:** Spieler kann zwischen Top-Down und Cabinet-Iso wechseln (Taste `I`) — beide Modi parallel implementiert

### Konsequenzen

- Tile-Größe wird 64×32 px (Diamond-Shape) statt 48×48 (Quadrat)
- Sprite-Auflösung bleibt 48×48 (passt visuell auf 64×32-Tile)
- Y-Sort-Render-Reihenfolge nötig (`setDepth` in Phaser)
- Pathfinding bleibt grid-basiert (Iso ist nur Render-Schicht), keine zusätzliche Komplexität
- Click-to-Move braucht inverse Iso-Transformation (`screenToGrid`-Funktion)
- **Implementiert:** `src/scenes/CabinetIsoScene.ts` mit `gridToScreen` / `screenToGrid` Helpers

---

## ADR-008: Era-Progression mit individuellem Spieler-Tempo + Glockenkurve

**Datum:** 2026-05-03
**Status:** Akzeptiert
**Entscheider:** Patrick (via Survey V2 Anmerkungen)

### Kontext

Era-Progression ist Kern-Mechanik (ADR-004). Survey V2 musste klären: Wie schnell wechseln Eras? Was wenn Spieler unterschiedlich schnell sind?

### Entscheidung

**Spieler bestimmen ihren eigenen Era-Übergang individuell**, kombiniert mit Pioneer-Tradeoffs und einer Glockenkurve der Era-Tiefen.

### Begründung

- **Spieler-Tempo:** Patrick: „wenn ein spieler schneller ist als der andere kann er auch schneller in die neue era vorgehen. allerdings muss das natürlich alles tradeoffs haben." → Echte Strategie-Wahl: Pionier sein (riskant, teuer, Monopol) oder Nachzügler (sicher, billig, Aufholjagd).
- **Cross-Era-Multiplayer:** Spieler in unterschiedlichen Eras spielen auf derselben Karte und können handeln. Realistisch (analog historische Welt-Asymmetrie).
- **Glockenkurve:** Patrick: „mittelalter ist immer sehr langweilig" → Mittelalter & Sci-Fi sind dünn (Onboarding + Endgame), Industrialisierung & Moderne sind dick (Hauptspiel-Phase).

### Konsequenzen

- **Forschungssystem komplexer:** Tech-Tree pro Spieler statt global. Pro Era eigener Tech-Tree-Branch.
- **Pioneer-Tradeoff-Balancing:** Frühe Era-Tech muss schwächer sein als spät-erforschte (Beta-Phase). Pionier zahlt mehr, bekommt Monopol-Bonus.
- **Cross-Era-Handel:** Mittelalter-Cargo-Container muss in Industrialisierungs-Bahnhof passen → Adapter-Mechaniken.
- **Phasen-Plan-Implikation:** Phase 1 ist nur Mittelalter (klein, schnell). Phasen 2-5 fokussieren Industrialisierung+Moderne (groß). Phase 6 ist Sci-Fi (klein).
- **UX-Aspekt:** Visualisierung der individuellen Era-Position pro Spieler nötig (HUD-Widget, Map-Overlay).

---

---

## ADR-009: Engine bleibt Phaser, Phase 1 = Modern ohne Era-System (strukturell vorbereitet)

**Datum:** 2026-05-03 (späte Session)
**Status:** Akzeptiert
**Entscheider:** Patrick

### Kontext

Im Verlauf der Session-Diskussion sind zwei strategische Fragen aufgetaucht:
1. **Engine-Wechsel?** Sollte Cargora in Unity oder Unreal statt Phaser/Browser gebaut werden, damit Patrick optional Game-Dev lernen kann?
2. **Era-Start-Wechsel?** Soll Phase 1 statt Mittelalter mit Moderne/Industrialisierung beginnen — der „interessante" Teil zuerst?

Patrick wollte ehrliche Empfehlung, hat dann auf Basis dessen entschieden.

### Entscheidungen

**A. Engine bleibt Phaser/Browser/TypeScript.**

Patrick: „Wenn du sagst Phaser und Browser ist definitiv besser und, wenn das ganze Spiel komplexer wird und irgendwie dann haben wir da trotzdem mehr Möglichkeiten oder kriegen das einfacher hin, dann bleiben wir beim Browser."

→ Engine-Wechsel zu Unity vom Tisch. Bisherige Code-Basis (Phaser, Vite, TypeScript, Cabinet-Iso-Scene) bleibt produktiv.

**B. Phase 1 baut „Cargora ohne Era-System" — als komplettes Modern-Spiel.**

Patrick: „Ok, dann erstmal ohne Era-System. Dann können wir das ja noch reinmachen. Vielleicht kannst du das ja aber schon irgendwie vorrüsten, dass man die Era-Progression drin hat, eventuell."

→ ADR-004 (Era-Progression als Kern-Mechanik) wird inhaltlich auf „Phase 4+ optional" zurückgestuft. Phase 1 baut ein vollwertiges Logistik-Spiel mit modernen LKW + Container + Asphaltstraßen, OHNE Era-Wechsel.

**C. Era-System wird strukturell vorbereitet, nicht visuell aktiviert.**

→ Tile-Datenmodell bekommt `era`-Feld (default `null`). Wenn Era-System später kommt, sind Karten ohne Migration upgradebar. Sparse-Property-Pattern: nur Tiles, die explizit eine Era-Markierung brauchen, bekommen einen Tag.

### Begründung

**Engine-Wahl Phaser:**
- Cargora-Scope ist 2D + Multiplayer + Browser-Distribution → Phaser objektiv überlegen für diesen Use-Case
- Unity bietet 3D + Mobile + Visual-Editor — alles Features, die Cargora nicht braucht
- Patrick hat „kein Programmieren lernen" als Hauptziel definiert → Engine-Lernen widerspricht dem
- Bisherige 4h Code-Arbeit bleibt nutzbar

**Phase 1 = Modern:**
- Patrick hat eigene Aussage: „Mittelalter ist immer sehr langweilig" — pragmatisch ehrlich
- Moderne Vehicles + Cargo + Container haben mehr Tiefe-Potenzial sofort sichtbar
- KI-Sprite-Generation funktioniert mit modernen Assets besser (mehr Trainings-Daten als für Mittelalter-Pferdewagen)
- „Aha"-Moment kommt schneller (sieht in Phase 1 wie ein Mini-Tycoon aus, nicht wie Anno-1404-ohne-Komplexität)

**Era-System strukturell vorbereiten:**
- Patrick will explizit „vorrüsten" — also Datenmodell-Felder anlegen, ohne Mechanik
- Vermeidet Migrations-Schmerz in 6+ Monaten, falls Era-Progression doch kommt
- Sparse-Property-Pattern (default `null`) hat null Performance-Kosten

### Konsequenzen

- **ADR-004 wird Status: „Status: Akzeptiert für Phase 4+, NICHT für Phase 1"** umetikettiert
- **GAME_DESIGN.md wird angepasst:** Phase 1 explizit als Single-Era beschrieben, Era-Progression als optionale Phase 4+ Erweiterung
- **Tile-Datenmodell erweitert** um `era`, `biome`, `height` (alle default null/0). Produktive Karte ohne Era-Tags.
- **Sprite-Generation startet mit modernen Assets:** LKW, Asphalt, Lagerhalle. Mittelalter-Pferdewagen kommen falls/wenn Era-Progression aktiviert wird.
- **Phasen-Plan komprimiert:** Statt 20-24 Monate jetzt wieder 12-15 Monate für ein vollwertiges Modern-Spiel mit Multiplayer.

---

---

## ADR-010: Spline-Hybrid-Architektur für Straßen + Schienen (Pfad B)

**Datum:** 2026-05-03 (späte Nacht)
**Status:** **VERWORFEN — siehe ADR-011 für Begründung**
**Entscheider:** Patrick (initial akzeptiert, dann nach Spline-Demo zurückgenommen)

### Kontext

Tile-basiertes Auto-Tiling für Straßen (ADR-007 Cabinet-Iso, plus Auto-Tile-System) hat strukturelle Limits:
- Nur 4 Welt-Achsen-Richtungen (8 mit Diagonal-Tiling) — keine smoothen Kurven
- Brücken und Tunnel müssten als spezielle Tile-Varianten implementiert werden — komplex und visuell starr
- Höhenmechanik (Berge/Täler) für Straßen mit Iso-Stufen geht, ist aber bei beliebigen Winkeln unmöglich

Patrick hat angefragt: „Vector/Spline klingt aber so als bräuchten wir das, gerade auch wenn Brücken und Tunnel kommen sollen". Nach Diskussion 4 Pfade (Tile-bleiben / Spline-Hybrid / Unity / nachdenken) hat Patrick **Pfad B (Spline-Hybrid)** gewählt.

### Entscheidung

**Spline-Hybrid:** Tiles für Boden + Splines für Straßen/Schienen.

- **Tile-System bleibt** für: Gras, Schotter-Bezirke, Feldweg, Wald, Wasser, Berge (Höhe pro Tile)
- **Spline-System neu für:** Asphalt-Straßen, Schienen, später ggf. andere Wegtypen
- **Brücken/Tunnel:** Splines mit Z-Höhe pro Knoten — beliebige Höhen, beliebige Winkel
- **Pathfinding:** Graph-A* auf Knoten/Kanten statt Grid-A* auf Tiles
- **LKW-Bewegung:** Spline-Following mit Bezier-Interpolation statt Tile-zu-Tile-Schritt

### Migration-Plan (graduell, nicht Big-Bang)

| Schritt | Was | Status |
|---------|-----|--------|
| 1. Datenmodell | `src/world/road-graph.ts` mit RoadNode + RoadEdge + RoadGraph | ✅ initial skeleton |
| 2. Renderer | `src/world/spline-renderer.ts` zeichnet Edges als Asphalt-Pixel-Linien mit Iso-Slope | TBD |
| 3. Demo-Spline | Eine Test-Straße im Spiel sichtbar (statisch, ohne Funktion) | TBD |
| 4. Pathfinding | Graph-A* in `src/world/pathfinding.ts` als Variante | TBD |
| 5. LKW auf Spline | Truck folgt Spline statt Tile-Schritten, Heading aus Spline-Tangente | TBD |
| 6. Asphalt-Tiles ausphasen | `tile-asphalt` aus Map raus, Spline-Layer übernimmt | TBD |
| 7. Karten-Editor | Click-Drag um Splines zu bauen (Knoten setzen, Kurven ziehen) | TBD |
| 8. Brücken/Tunnel | Z-Höhe pro Knoten + Pfeiler-Sprites + Tunnel-Eingangs-Sprites | TBD |
| 9. Multiplayer-Anpassung | Server-Schema: Vehicle-Position als `{ edgeId, t, lane }` statt `{ x, y }` | TBD |

**Aufwand insgesamt:** ~6-10 Tage Vollzeit, verteilt über mehrere Sessions.

### Begründung

- **Brücken/Tunnel/Berge sind explizite Vision-Features.** Tile-basiert wäre starr und visuell limitiert.
- **Hybrid statt Volle-Migration:** Tile-System für Boden bleibt nutzbar. Sprite-Pipeline, Camera-System, Multiplayer-Architektur größtenteils erhalten.
- **Cities-Skylines-Optik mit smoothen Kurven** ist erreichbar, ohne die volle 3D-Komplexität von Unity.
- **Engine-Wechsel zu Unity ist abgelehnt** (siehe ADR-009): hoher Aufwand für minimalen Mehrwert bei 2D-Pixel-Art-Spiel.

### Konsequenzen

- **Bisheriges Auto-Tiling-System (ADR-007 + Asphalt-Auto-Tiling)** wird ausgephast: bleibt vorerst aktiv, Spline-Layer wächst parallel, am Ende Asphalt-Tiles raus.
- **Pathfinding-Komplexität wächst:** zwei Systeme — Tile-Boden + Spline-Straßen. Pathfinding muss beide kennen.
- **Karten-Editor-Komplexität wächst:** Tile-Painting für Boden + Spline-Bauen für Straßen.
- **Multiplayer-Server-Schema (Stub in `server/`) muss angepasst werden:** Vehicle-Position als `{ edgeId, t }`.
- **Brücken-Sprites + Tunnel-Sprites** müssen extern besorgt oder programmatisch generiert werden.

### Alternativen verworfen

- **Pfad A (Tile-bleiben + Höhen):** OpenTTD-Niveau erreichbar, aber starrere Optik. Zu limitiert für Patricks Vision.
- **Pfad C (Unity):** Massiver Aufwand, Engine-Lernen widerspricht Patricks „kein Programmieren lernen"-Constraint.

---

---

## ADR-011: Pfad A — Tile-System mit Höhen, Brücken und Tunneln (statt Spline)

**Datum:** 2026-05-03 (späte Nacht, nach Spline-Demo)
**Status:** Akzeptiert — Pfad A bestätigt, Pfad B (ADR-010) verworfen
**Entscheider:** Patrick

### Kontext

ADR-010 hatte Spline-Hybrid (Pfad B) gewählt, mit dem Argument für smoothe Brücken/Tunnel-Optik. Nach erstem Spline-Demo-Render hat Patrick neu evaluiert:

> „runde straßen sind nicht gewünscht und die lkw und co modelle sind nicht rund machbar"

**Erkenntnis:** Render-Stil und Bewegungs-System müssen zusammenpassen. Pixel-Art-Iso-Vehicles haben diskrete Heading-Sprites (4 oder 8 Richtungen). Auf geschwungenen Splines würden sie visuell brechen — der LKW würde „springen" zwischen Heading-Sprites entlang einer Kurve. OpenTTD, Transport Tycoon Deluxe und SimCity 2000 haben aus genau diesem Grund alle nur Tile-Achsen-basierte Straßen, keine echten Splines.

### Entscheidung

**Pfad A (ursprünglich verworfen) wird wieder aufgenommen.** Tile-System bleibt vollständig, erweitert um:

- **Höhen pro Tile** (Berge/Täler) — `heights: number[][]` in WorldData ist bereits vorbereitet, wird aktiviert
- **Brücken als Tile-Variante** mit `bridgeOver`-Flag und sichtbaren Pfeilern
- **Tunnel-Eingänge** als spezielle Tile-Sprites
- Optional: **8-Nachbarn-Auto-Tiling** für Diagonal-Straßen (256 Sprite-Varianten) — falls Patrick später will

### Begründung

- **Render-Konsistenz:** Diskrete Pixel-Art-Vehicles passen zu Tile-Achsen-Straßen, nicht zu Splines
- **OpenTTD-Vorbild:** 30 Jahre bewährtes Pattern, klar funktioniert mit Iso-Pixel-Art
- **Geringerer Migrations-Aufwand:** Auto-Tile-System bleibt komplett, nur Erweiterung um Höhen + Brücken-Tile-Varianten
- **Spline-Code bleibt im Repo** als unused/deprecated für mögliche spätere Sub-Features (z.B. Maglev-Schienen in Era 5)

### Neuer Migrations-Plan (Pfad A)

| Schritt | Was | Aufwand | Status |
|---------|-----|---------|--------|
| 1. Höhen-System aktivieren | gridToScreen + height, Demo-Berge | 1-2h | TBD |
| 2. Höhen-Wand-Sprites | Sichtbare Steilstufen zwischen Tile-Höhen | 2-3h | TBD |
| 3. Brücken-Tile-Varianten | Asphalt-Brücken-Sprites + bridgeOver-Flag | 3-5h | TBD |
| 4. Tunnel-Eingänge | Tile-Sprites mit Tunnel-Loch + Tunnel-Logik | 2-3h | TBD |
| 5. 8-Nachbarn-Auto-Tiling | Diagonal-Straßen (optional, Phase 2.5+) | 4-6h | TBD |

**Gesamt für Pfad-A-Komplett:** ~12-19h Engine-Erweiterung. Verteilt über mehrere Sessions.

### Konsequenzen

- **ADR-010 verworfen,** aber Datenmodell und Renderer bleiben im Repo:
  - `src/world/road-graph.ts` — unused, evtl. später für Sub-Features
  - `src/world/spline-renderer.ts` — unused, evtl. später
- **Tile-System bleibt zentrales Engine-Paradigma**
- **Phasen-Plan in GAME_DESIGN.md V3 bleibt gültig** — Phase 1 (Modern), Era-Progression als Phase 4+
- **Auto-Tiling-Asphalt aktiviert weiterhin** (ADR-007 Auto-Tile-System bleibt vollständig)

### Patrick-Quote für die Geschichte

> „runde straßen sind nicht gewünscht und die lkw und co modelle sind nicht rund machbar"

Das ist die Kern-Erkenntnis: Engine-Wahl muss Asset-Style entsprechen, nicht umgekehrt.

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
