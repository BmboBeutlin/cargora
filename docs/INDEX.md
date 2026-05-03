# Cargora — Doku-Index

> Inhaltsverzeichnis aller Projekt-Dokumente. **Pflege diese Datei**, wenn neue Docs dazukommen.

---

## Master-Dokument

| Datei | Inhalt | Wann lesen? |
|-------|--------|-------------|
| `../CLAUDE.md` | Projekt-Master-Index, Konventionen, Workflow für Claude-Sessions | **IMMER zuerst** in neuer Session |
| `../README.md` | Public-facing Projektbeschreibung + Quickstart | Wenn jemand Externes guckt |

---

## Vision & Spec

| Datei | Inhalt |
|-------|--------|
| [`GAME_DESIGN.md`](GAME_DESIGN.md) | **Vision, Kern-Pillars, Mechaniken, Scope.** Was wird gebaut und warum. |
| [`SCOPE.md`](SCOPE.md) | (TBD) Phasen-Plan: was ist in Phase 1, 2, 3, ... — und was explizit NICHT |

---

## Technik

| Datei | Inhalt |
|-------|--------|
| [`TECH_STACK.md`](TECH_STACK.md) | Tech-Entscheidungen + Begründungen. Phaser, TS, Vite, Colyseus. |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | (TBD) Code-Struktur, Datenmodell, Module-Grenzen |
| [`DECISIONS.md`](DECISIONS.md) | ADRs — chronologische Architekturentscheidungen mit Begründung |

---

## Prozess

| Datei | Inhalt |
|-------|--------|
| [`JOURNAL.md`](JOURNAL.md) | **Session-Tagebuch.** Was wurde wann gebaut, was steht offen. |
| [`STYLE_GUIDE.md`](STYLE_GUIDE.md) | (TBD) Pixel-Art-Konventionen, Farbpalette, UI-Patterns |

---

## Konventionen für diesen Doku-Ordner

- **Sprache:** Deutsch (Patrick liest, Claude schreibt — Patrick spricht Deutsch).
- **Format:** GitHub-Flavored Markdown.
- **Struktur:** Jede Datei beginnt mit H1-Titel + 1-Satz-Zweck.
- **Datums-Format:** `YYYY-MM-DD` (ISO).
- **Querverweise:** relative Links (`./TECH_STACK.md` oder `[Tech](TECH_STACK.md)`).
- **Status-Markierungen:**
  - **TBD** = noch nicht geschrieben, geplant
  - **WIP** = in Arbeit
  - **DONE** = fertig (selten nötig)
  - **DEPRECATED** = überholt, hier nur zur Historie

---

## Wenn du eine neue Doku-Datei anlegst

1. Datei unter `docs/` mit aussagekräftigem Namen (UPPERCASE_WITH_UNDERSCORES.md).
2. **In dieser INDEX.md eintragen** in der passenden Tabelle.
3. **In `../CLAUDE.md`** ergänzen, falls die neue Datei für Claude-Workflow relevant ist.
4. Im aktuellen `JOURNAL.md`-Eintrag erwähnen.
