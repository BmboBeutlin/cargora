# Cargora — Projekt-Master-Index für Claude-Sessions

> **Hinweis an zukünftige Claude-Sessions:** Dieses Dokument ist die **Quelle der Wahrheit** für dieses Projekt. Lies `docs/INDEX.md` als nächstes — dort findest du alle weiteren Dokumente. Falls Engram für diese Session erreichbar ist, nutze zusätzlich `mcp__engram__context(project='cargora')`. Falls nicht: `docs/JOURNAL.md` ist dein Tagebuch über alle bisherigen Sessions.

---

## Was ist Cargora?

Browser-Multiplayer-Spiel im Geist von OpenTTD/Factorio, aber mit **modularer Tiefe** statt Breite. Logistik + Städtesimulation + Warenketten + Forschungsbaum. Hobby-Projekt für Patrick und Freunde, **kein kommerzieller Release** geplant.

**Vision in einem Satz:** Du verwaltest eine Logistik-Firma in einer simulierten Welt mit echten Märkten — jeder LKW, jeder Reifen, jeder Flughafen, jede Fabrik ist konfigurierbar und greift in echte Wechselwirkungen ein.

Detaillierte Vision: siehe **`docs/GAME_DESIGN.md`**.

---

## Wer arbeitet daran?

- **Patrick** — Game Designer, Tester, Doku-Owner. Programmiert NICHT selbst.
- **Claude** (das bin ich) — schreibt 100% des Codes, generiert Grafik, pflegt Doku.
- **Patricks Kumpel** (TBD) — möglicherweise unterstützender Tester/Mit-Designer.

**Wichtig:** Patrick beschreibt in Worten, was er will. Claude übersetzt in Code, Mockups, Specs. Patrick beurteilt, kritisiert, lenkt.

---

## Tech-Stack (kurz, Details in `docs/TECH_STACK.md`)

- **Sprache:** TypeScript
- **Game-Engine:** Phaser 4
- **Build:** Vite
- **Multiplayer-Server (geplant, noch nicht implementiert):** Colyseus
- **Stil:** Pixel Art Top-Down
- **Hosting (geplant):** Cloudflare Pages (Spiel) + Railway/Render (MP-Server)
- **Repo:** `BmboBeutlin/cargora` auf GitHub (öffentlich)

---

## Code-Konventionen (zwingend)

Aus globaler `C:\Users\patrick\CLAUDE.md` übernommen:

- **TypeScript strict:** `erasableSyntaxOnly` + `verbatimModuleSyntax` aktiv
- **Enums:** als `const`-Objects mit Companion-Type, NIEMALS als TS-`enum`
- **Imports:** `import type` für Type-Only-Imports
- **Sprache:** UI-Texte Deutsch, Code/Variablen/Kommentare Englisch, Patrick-Kommunikation Deutsch
- **Keine Emojis im Code** (nur in Dokumenten und nur wenn sinnvoll)
- **Stil:** Inline-Styles mit CSS-Variablen, kein Tailwind, keine CSS-Module
- **Farben:** Orange (`#f0882a`) NUR für Logo/Primary-Button — sonst Graustufen

Wenn du als Claude eine Änderung vorschlägst, die diese Regeln bricht: **stoppe und frage Patrick**.

---

## Projekt-Struktur (Code)

```
cargora/
├── CLAUDE.md              # DIESE Datei — erst lesen
├── README.md              # Public-facing
├── package.json
├── tsconfig.json
├── vite.config.ts (TBD)
├── index.html             # Phaser-Mount-Point + HUD-Container
│
├── src/
│   ├── main.ts            # Entry: Phaser.Game-Init + Haupt-Scene
│   ├── style.css          # Globaler Reset + HUD-Styling
│   ├── scenes/   (TBD)    # Pro Scene eine Datei
│   ├── world/    (TBD)    # Tile-Grid, Karte, Pathfinding
│   ├── entities/ (TBD)    # Vehicles (LKW, Zug, Flugzeug abstract)
│   ├── economy/  (TBD)    # Cargo, Märkte, Warenketten
│   └── net/      (TBD)    # Multiplayer-Client
│
├── server/        (TBD)   # Colyseus-Server, eigenes Subprojekt
│
└── docs/
    ├── INDEX.md           # Inhaltsverzeichnis aller Docs — STARTE HIER
    ├── GAME_DESIGN.md     # Vision + Mechaniken + Scope
    ├── TECH_STACK.md      # Tech-Entscheidungen + Begründungen
    ├── ARCHITECTURE.md    # Code-Struktur + Datenmodell (TBD)
    ├── DECISIONS.md       # ADRs — Architekturentscheidungen mit Datum
    └── JOURNAL.md         # Session-Tagebuch — was wurde wann gebaut
```

---

## Typische Session-Workflows

### Neue Session, du weißt nicht wo wir stehen

1. Lies diese `CLAUDE.md` (jetzt fertig).
2. Lies `docs/INDEX.md` für Doku-Übersicht.
3. Lies die letzten 1–3 Einträge in `docs/JOURNAL.md` — dort steht, was zuletzt passiert ist und was als nächstes ansteht.
4. Falls Engram erreichbar: `mcp__engram__context(project='cargora')` für zusätzliches Wissen.
5. Frag Patrick **kurz**, woran heute gearbeitet werden soll — er sagt's dir in 1-2 Sätzen.

### Du hast etwas Neues gebaut/entschieden

1. **Code commiten** mit aussagekräftiger Message (Deutsch oder Englisch).
2. **`docs/JOURNAL.md`** ergänzen: Heute-Eintrag mit Was-Wurde-Gebaut und Was-Steht-Offen.
3. **Größere Architekturentscheidung?** → `docs/DECISIONS.md` ergänzen (ADR-Format).
4. **Spec-relevant?** → `docs/GAME_DESIGN.md` oder `docs/TECH_STACK.md` aktualisieren.
5. **Falls Engram an:** `remember(project='cargora', type='decision'|'architecture'|'lesson', ...)`.

### Du findest einen Bug oder lernst etwas Wichtiges

1. Bug fixen, commiten.
2. **Falls Lesson nicht-trivial:** `docs/JOURNAL.md` mit Eintrag „Lesson: ...".
3. Falls Engram an: `remember(type='lesson', tags=['bug','...'])`.

---

## Anti-Patterns

- ❌ Code-Änderungen, ohne den Kontext aus `JOURNAL.md` zu lesen.
- ❌ Neue Files irgendwo anlegen, ohne sie in `INDEX.md` einzutragen.
- ❌ Patrick implementieren lassen — er kann es nicht und will es nicht.
- ❌ Tutorials/CodeAcademy-Erklärungen anbieten — Patrick will Resultate, nicht Lernen.
- ❌ Fertige Pixel-Art ohne Patrick-Abnahme integrieren — Stil ist Patricks Domäne.
- ❌ Multiplayer-/Server-Code committen, der nicht lokal getestet wurde.

---

## Kontakt-Punkte zu cueplex

Patrick hat ein Hauptprojekt **cueplex** (Multi-Realm-Platform). Cargora ist davon **strikt getrennt**:

- Eigenes Repo, eigener Pfad, eigene Doku.
- KEINE Code-Imports zwischen den Projekten.
- Engram-Project-Tag: `cargora` (nicht `cueplex`).
- Patrick-Präferenzen aus cueplex (Visual Style Guide etc.) gelten nur als Inspiration, NICHT als Vorschrift.

Wenn ein Hook oder Auto-Recall cueplex-Memories einblendet während du an Cargora arbeitest: **ignoriere sie**, außer sie sind explizit projekt-übergreifend (z.B. „Patrick spricht Deutsch").
