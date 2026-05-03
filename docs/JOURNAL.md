# Cargora — Session Journal

> Chronologisches Tagebuch aller Claude-Sessions an diesem Projekt. Neueste Einträge **oben**. Format pro Eintrag siehe Vorlage am Ende.

---

## 2026-05-03/04 (Nacht 3) — Marathonsession: Pfad A komplett (OpenTTD-Niveau erreicht)

**Dauer:** ~3-4 Stunden autonom · **Claude-Modell:** Opus 4.7 (1M context)

Patrick ging ins Bett mit der Aufgabe: „arbeite die Nacht durch, bis das Straßensystem mindestens auf OpenTTD-Niveau ist". Dieser Eintrag dokumentiert den Stand bei Sunset.

### Strategische Entscheidungen während der Nacht

- **ADR-010 verworfen, ADR-011 akzeptiert:** Patrick hat während der Session entschieden Pfad A (Tile-System mit Höhen) statt Pfad B (Spline-Hybrid). Begründung: „runde straßen sind nicht gewünscht und die lkw und co modelle sind nicht rund machbar". Pixel-Iso-Vehicles haben diskrete Headings → Tile-System ist der richtige Weg.
- **Spline-Code (`road-graph.ts`, `spline-renderer.ts`) bleibt im Repo** als unused, evtl. für spätere Sub-Features.

### Was implementiert (in Reihenfolge)

1. **Höhen-System aktiviert** (Pfad A Schritt 1) — Tiles werden mit `height * 8` Y-Offset gerendert.
2. **Höhen-Wand-Sprites** — Erd-Wände an Tile-Höhenübergängen (East + South Richtungen). Drei Höhendifferenzen vorgeneriert.
3. **Höhen-Schattierung** — Sonnenlicht-Highlight auf hohen Tiles via ADD-BlendMode.
4. **Brücken-System** — Asphalt-Tiles auf Höhe + Stein-Pfeiler darunter. Brücken-Sprite OHNE Gras-Hintergrund (`createAsphaltOverlaySprite(c, withGrassBase: false)`).
5. **Y-Sort konsistent gridY-basiert** — Tiles, Wände, Vehicles, Brücken alle auf einem konsistenten Depth-System (`row * 100 + sub-bonus`). LKW verschwindet jetzt automatisch hinter höheren Welt-Y-Tiles (Berge).
6. **LKW-Sprite-Sheet integriert** — `vehicles.png` (680×48 Pixel) als Phaser-Spritesheet. Frame-Layout via Debug-Strip-Iteration ermittelt: 17×48 Frames × 40 = 4 Heading × 10 Farb-Varianten. Heading-Map provisorisch (Patrick muss verifizieren).
7. **Decorations-System** — Bäume (3 Varianten: Laubbaum, Pinie, Strauch) als Sprites. Map mit 18 Decorations.
8. **Wasser-Tile-Type** — neuer Tile-Typ mit blauem Sprite + Wellen + Reflexion. Untere Map-Reihe ist jetzt FLUSS.
9. **Brücke ÜBER Wasser** — Demo-Brücke geht über den Fluss (4 Tiles auf Höhe 2, Pfeiler stehen im Wasser).
10. **Häuser** — 3 Sprite-Varianten (Einfamilienhaus, Apartment, Cottage). 12 Häuser auf Schotter-Bezirken — Stadt-Effekt.
11. **Tunnel-Eingang** — Stein-Bogen-Sprite mit dunklem Loch. Demo: ein Tunnel am Berg-Fuß.

### Dateien neu erstellt diese Nacht

| Datei | Inhalt |
|-------|--------|
| `src/world/road-graph.ts` | Spline-Datenmodell (unused, ADR-010 verworfen) |
| `src/world/spline-renderer.ts` | Spline-Renderer (unused, ADR-010 verworfen) |
| `src/assets/sprites/tile-wall.ts` | Erd-Wand-Sprites für Höhenübergänge |
| `src/assets/sprites/bridge-pillar.ts` | Stein-Pfeiler-Sprites für Brücken |
| `src/assets/sprites/tree.ts` | 3 Baum-Varianten |
| `src/assets/sprites/tile-water.ts` | Wasser-Tile mit Wellen |
| `src/assets/sprites/house.ts` | 3 Haus-Varianten |
| `src/assets/sprites/tunnel.ts` | Tunnel-Eingangs-Sprite |
| `src/assets/sprites/vehicle-sheet.ts` | LKW-Sprite-Sheet-Loader |
| `docs/sprite-inspector.html` | Frame-Layout-Inspector |
| `docs/tile-mockup.html` | Tile-Stil-Auswahl-HTML |
| `docs/truck-mockup.html` | LKW-Stil-Auswahl-HTML |

### Was funktioniert

✅ Auto-Tiling-Asphaltstraßen mit Mittelstreifen
✅ Stadt mit erkennbaren Häusern auf Schotter-Bezirken
✅ Fluss mit Brücke (Pfeiler im Wasser)
✅ Bergland mit Wand-Sprites + Sonnenlicht-Highlight
✅ Wald-Bäume (Pinien + Laubbäume + Sträucher)
✅ Tunnel-Eingang am Berg
✅ LKW-Sprite-Sheet integriert (Frame-Mapping provisorisch)
✅ Y-Sort: LKW verschwindet hinter Bergen
✅ A*-Pathfinding navigiert um Hindernisse
✅ Hover-Highlight zeigt Klick-Tile
✅ Cabinet-Iso-Render konsistent

### Was offen blieb

- **LKW-Heading-Mapping:** Provisorisch nw=0, ne=1, se=2, sw=3. Patrick muss im Browser klicken und visuell verifizieren ob LKW in die richtige Richtung dreht. Falls nicht: `HEADING_FRAME_MAP` in `src/assets/sprites/vehicle-sheet.ts` justieren.
- **Rampen/Slopes:** ADR-011 Schritt 5 — sanfter Übergang zwischen Höhen statt Stufen. Komplexer (4 Slope-Sprites pro Höhendifferenz). Nicht implementiert, kann später kommen.
- **Schienen:** Eigener Tile-Typ + Auto-Tiling. Größeres Feature, nicht implementiert.
- **Mehrere LKW:** Aktuell nur 1 LKW. Multi-Vehicle-System für Phase 2.
- **Karten-Editor:** Aktuell nur ASCII-Map-Bearbeitung im Code. UI-Editor für später.

### Lessons aus dieser Session

- **MCP-Playwright-Loop ist genial für visuelle Iteration:** Code → Browser-Screenshot → Bewerten → Iterieren. ~15 Iterationen in dieser Nacht, jede mit visueller Verifikation.
- **Sprite-Sheet-Frame-Layout per Debug-Strip ermitteln:** statt zu raten, alle Frames im Spiel anzeigen, dann visuell mappen.
- **Programmatische Pixel-Art hat Grenzen, aber ist machbar.** Häuser, Bäume, Wände, Tunnel — alles in TypeScript per Canvas-API generiert. Sieht weniger polished aus als Aseprite-Hand-Pixel-Art, aber „good enough".
- **OpenTTD-Niveau in Phaser ist erreichbar.** Cabinet-Iso + Auto-Tiling + Höhen + Brücken + Tunnel + Stadt = das Wesentliche von OpenTTD ohne 30 Jahre C++-Code.
- **ADR-Wechsel mid-session ist OK.** Pfad B → Pfad A war richtig, weil Patrick die richtige Render-Stil-Frage gestellt hat (runde Splines vs. diskrete Iso-Sprites).

### Welcome-Notiz für Patrick (morgen früh)

Wenn du das hier liest: Cargora ist auf einem soliden OpenTTD-Niveau. Refresh den Browser auf `localhost:5173/` und schau dir an:
- **Auto-Drive aktiv:** LKW fährt automatisch zwischen zufälligen Asphalt-Tiles. Du musst nicht klicken — die Welt wirkt sofort lebendig.
- Stadt mit Häusern auf den Schotter-Bezirken
- Fluss unten links mit Brücke (Pfeiler im Wasser)
- Berge oben rechts mit Erd-Wänden + warmem Sonnenlicht-Highlight
- Tunnel-Eingang am Berg-Fuß
- Bäume und Sträucher verstreut

**LKW-Heading muss verifiziert werden:** Schau dem LKW zu, ob er in die richtige Richtung dreht beim Fahren. Falls die Heading-Sprites verschoben sind: `HEADING_FRAME_MAP` in `src/assets/sprites/vehicle-sheet.ts` umordnen. Aktuell nw=0, ne=1, se=2, sw=3.

**Auto-Drive abschalten:** Falls du selbst klicken willst, in `CabinetIsoScene.ts` `private autoMode = true` auf `false` setzen.

**Was sicher noch fehlt zu OpenTTD-Niveau:**
- Rampen statt Stufen zwischen Höhen
- Schienen-System
- Mehrere Vehicle-Typen
- Karten-Editor

**Repo-Stand bei Sunset:** alle Commits seit `9263a11` (Höhen-Highlight) bis HEAD.

---

### Update Patrick-Audit-Run (kurz vor Sunset)

Patrick hat zwischendurch einen Audit angefragt: „Brücken kaputt, LKW falsch, Straßen passen nicht". Bug-Fix-Sweep:

| Bug | Fix | Commit |
|-----|-----|--------|
| LKW: 2 Sprites gestapelt | Sprite-Sheet hat unregelmäßige Frame-Sizes (Pixel-Analyse via Playwright). Zurück zu programmatischem Truck. | `4935406` |
| Brücken-Asphalt unsichtbar | `createAsphaltOverlaySprite(c, false)` rendert nun voller Asphalt-Diamond statt nur Streifen. | `4935406` |
| Asphalt-Tiles haben Gaps | Streifen-Breite von 8 auf 12 px (overlapping bei Nachbar-Tiles). | `4935406` |
| Tunnel kaum sichtbar | Sprite vergrößert auf 48×42 mit Stein-Quader-Mörtel-Linien. | `93c391d` |
| LKW zu klein | Scale 0.7 → 1.0, y-Offset von 6 → 10. | `03ab5e2` |
| Brücke nur 1 Demo | Zweite Brücke (3 Tiles) hinzu. | `93c391d` |

**Final-HEAD:** `03ab5e2` — alle gemeldeten Bugs gefixt.

---

## 2026-05-03 (Nacht 2) — Map-Fix + A* live + MP-Server-Stub fertig

**Dauer:** ~30 Min (mit zwei Background-Agents) · **Claude-Modell:** Opus 4.7 (1M context)

### Was passiert ist

1. **A*-Pathfinding integriert** in `CabinetIsoScene` mit `src/world/pathfinding.ts`. LKW navigiert nun um Hindernisse, Pfad als Punkt-Linie sichtbar (oranger Endpunkt).
2. **Patrick-Bug-Report:** "LKW kann nicht fahren, Layer passen nicht". Browser-Audit via Playwright durchgeführt — Wurzel-Ursache: `START_TILE = (6,4)` lag auf einem Gras-Tile innerhalb eines hohlen Schotter-Lager-Rings. Gras hat speedMod=0, also war der LKW von Beginn an festgesetzt.
3. **Map komplett umgebaut** zu einem zusammenhängenden, überall befahrbaren Sandbox-Layout: Asphalt-Plattform mit Schotter- und Feldweg-Inseln, Gras nur als Außenrand. `START_TILE = (14,7)` zentral auf Asphalt.
4. **Zwei Background-Agents parallel** liefen ohne Konflikte:
   - **Sprite-Agent:** baut programmatische Pixel-Art-Sprites in `src/assets/sprites/` (Status: noch laufend bei Commit-Zeitpunkt)
   - **Multiplayer-Agent:** Colyseus-Server-Stub in `server/` als isoliertes Subprojekt komplett fertig.

### MP-Server-Stub — Details aus dem Agent-Report

- **Pfad:** `C:\Users\patrick\cargora\server\` (eigenes Subprojekt, eigene `package.json`, eigenes `node_modules`)
- **Port:** 2567 (überschreibbar via `PORT`-ENV)
- **Stack:** Colyseus 0.16, @colyseus/schema 3.0, Express, WebSocketTransport
- **Endpoints:** WebSocket-Game-Room "game" (max 8 Clients), `/health`-Endpoint, `/colyseus`-Monitor
- **State-Schema:** `players: MapSchema<Player>`, `vehicles: MapSchema<Vehicle>`, `tick: number`
- **Message-Handler:** `move-vehicle` mit Ownership-Check
- **Default-Spawn:** Tile (6, 4) — sollte später mit Cargora-Map-Realität synchronisiert werden
- **Verifikation:** TypeCheck clean, Server gestartet + Health-Check erfolgreich, Server beendet
- **NICHT angebunden** an den Hauptprojekt-Client — bewusst, kommt als separater Integrations-Schritt

### Tech-Lessons aus dem Server-Agent

- `@colyseus/schema` braucht `experimentalDecorators` + `emitDecoratorMetadata` + `useDefineForClassFields: false` in `tsconfig.json` — letzteres wäre ein subtiler Stolperstein gewesen
- Server isoliert als eigenes npm-Subprojekt (statt npm-Workspaces) → konsistent mit cueplex-Pattern (PersoSync/PowerSync/DevHub als getrennte Repos)

### Was offen blieb

- [ ] **Sprite-Agent abwarten** — läuft noch
- [ ] **Sprite-Integration** — wenn Sprites fertig: in `CabinetIsoScene` einbauen, Polygone ersetzen
- [ ] **MP-Client-Anbindung** — Colyseus-Client in `src/net/` integrieren, zwei Browser-Tabs testen. Default-Spawn-Position (6,4) im Server muss auf neue START_TILE (14,7) angepasst werden
- [ ] **Hosting-Entscheidung MP-Server** — Patrick hat 8GB-Hetzner-Server angeboten. Für später, wenn Anbindung steht.

### Lessons aus dieser Session

- **Eigene Augen mit Playwright sind goldwert.** Patricks „LKW kann nicht fahren" wäre durch Bug-Description allein schwer zu lokalisieren gewesen. Screenshot + HUD-Anzeige („Speed-Modifier: 0%") haben das in 30 Sekunden geklärt.
- **Map-Design hat semantische Komponente.** Ein Lager als „hohler Schotter-Ring mit Gras innen" macht weder visuell noch spielmechanisch Sinn. Lager-Tiles müssen befahrbar sein, sonst sind sie keine Lager. Pattern: Tile-Layouts müssen vor Implementation auf „kann der Spieler hier ankommen?" geprüft werden.
- **Background-Agents mit klaren Datei-Grenzen funktionieren.** Sprite-Agent → `src/assets/sprites/`, MP-Agent → `server/`. Beide arbeiten parallel, kein Konflikt mit Hauptthread, kein Konflikt miteinander.

---

## 2026-05-03 (Nacht) — Pivot zurück zu Phase-1-Modern, Era strukturell vorbereitet

**Dauer:** ~30 Min · **Claude-Modell:** Opus 4.7 (1M context)

### Was passiert ist

Patrick hat zwei strategische Fragen aufgeworfen:
1. **Engine-Wechsel zu Unity?** → **Verworfen.** Phaser bleibt, weil objektiv besser für Cargora-Scope (2D + Multiplayer + Browser-Distribution).
2. **Phase-1-Era-Wechsel von Mittelalter zu Modern?** → **Akzeptiert mit „strukturell vorbereiten"-Variante.** Phase 1 baut ein vollwertiges Modern-Spiel (LKW + Asphalt + Container), Era-Progression bleibt als Phase 4+ Erweiterung möglich.

Plus: Hover-Bug in Cabinet-Iso gefixt (`Math.floor` → `Math.round` in inverse Iso-Funktion).

### Was gebaut

- **Hover-Fix** in `src/scenes/CabinetIsoScene.ts` — Klick-Targeting jetzt pixel-genau
- **Konturen entfernt** — Tiles fließen visuell ineinander, kein 1px-Stroke mehr
- **Hover-Highlight** — Diamond-Outline unter Cursor zeigt vor dem Klick, welche Tile getroffen wird
- **HUD-Erweiterung** — neuer Block „Unter Cursor: [Tile] (x, y)" für sofortiges Feedback
- **Top-Down-Scene entfernt** (`src/scenes/TopDownScene.ts` gelöscht) — Cabinet-Iso ist einziger Modus
- **Demo-Karte → produktive Karte** in `src/world/map.ts`: kleines modernes Industriegebiet mit Hauptstraßen-Ring + Lagerbezirken + Innenhof
- **Datenmodell erweitert** strukturell:
  - `WorldData`-Type mit Tiles + Heights + Biomes + Eras (alle als 2D-Arrays)
  - `EraType`-Enum (Medieval, EarlyModern, Industrial, Modern, SciFi) — vorbereitet, aber unbenutzt
  - `BiomeType`-Enum (Temperate, Forest, Desert, Tundra, Mountain) — vorbereitet, aber unbenutzt
  - Heights default 0, Biomes/Eras default null (Sparse-Property-Pattern für Performance)
- **Doku-Updates:**
  - `GAME_DESIGN.md`: Vision auf Phase-1-Modern + Era als Phase 4+ Erweiterung umgeschrieben. Phasen-Plan V3 (9-11 Monate für Phase 1, 14-18 für vollständiges Modern-Spiel).
  - `DECISIONS.md`: **ADR-009** (Engine bleibt Phaser, Phase 1 = Modern, Era strukturell vorbereitet)
  - `JOURNAL.md`: Diese Eintrag

### Wichtige Klarstellungen aus Patricks Aussagen

- **„Ich will nicht als Person ranwachsen. Nur Spaß am Spielen und Entwickeln."** → Anti-Pattern: Niemals Cargora als Lehr-Projekt für Patrick framen. Patrick ist Game-Designer + Spieler, nicht Programmier-Schüler.
- **Era-System „vorrüsten"** → Datenmodell-Felder anlegen, ohne Mechanik zu implementieren. Sparse-Property-Pattern verwendet.
- **Phaser-Wechsel akzeptiert** wenn ich es als „besser für Spielkomplexität" begründe. Engine-Wechsel zu Unity ist hiermit **endgültig vom Tisch**.

### Lessons aus dieser Session

- **Pivot-Müdigkeit ist real.** Diese Session hatte 4 große Pivots (Logistik→Era-Progression→Cabinet-Iso→zurück zu Modern). Patrick hat selbst gesagt „nur Spaß am Entwickeln" — also bei nächsten Vision-Drift fragen, ob Patrick noch Lust hat oder Pause-Bedarf besteht.
- **Strukturelle Vorbereitung > Migration später.** Tile-Datenmodell mit `era`/`biome`/`height` jetzt anlegen kostet 5 Min. Die gleiche Migration in 6 Monaten würde Stunden kosten und alle bestehenden Karten brechen.
- **„Vorrüsten" ist ein Game-Design-Pattern, kein Anti-Pattern.** Speculative Generality ist normalerweise ein Code-Smell. Aber für klar absehbare Features (Era-System ist in Patricks Vision festgehalten, ADR-004 + ADR-008) ist Vorrüsten zukunftssicheres Architektur-Design.

### Was offen blieb

- [ ] **Erste Sprites generieren** — moderner LKW (48×48), Asphalt-Tile (64×32 Diamond), Lager-Gebäude (48×64). Workflow: KI-Generation → Patrick-Politur in Aseprite → ins Repo committen.
- [ ] **Sprite-Generation-Workflow** mit Patrick abstimmen — welches Tool, welche Iteration, wer poliert?
- [ ] **A*-Pathfinding** statt linearer Bewegung. Aktuell fährt LKW geradlinig durch alles, sollte um Gras-Tiles herum navigieren.

### Nächste Session — Vorschläge

1. **Erste moderne LKW-Sprites generieren** und ins Spiel einbauen (das ist der „aha"-Moment, wo das Spiel echt aussieht)
2. **A*-Pathfinding einbauen** — LKW navigiert um Hindernisse, Klick auf Gras → LKW findet Weg drumherum
3. **Multiplayer-Server-Setup beginnen** — Colyseus-Server-Stub, zwei Browser-Tabs, beide sehen den gleichen LKW

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
