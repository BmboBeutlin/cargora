# Cargora — Game Design Document

> **Stand:** 2026-05-03 (V2 — nach Patrick-Survey)
> **Status:** Vision konsolidiert, 2 Punkte zur Perspektive + Era-Range noch offen (siehe `design-survey-v2.html`)

---

## Vision in einem Satz

Du baust ein Transport-Imperium auf, das mit Pferdekarren im Mittelalter beginnt und sich über Jahrhunderte zu einem modernen Logistik-Konzern entwickelt — gemeinsam mit Freunden in einer fiktiven Welt mit echten Märkten, echten Wechselwirkungen und echter Konkurrenz.

---

## Konsolidierte Vision (aus Survey-V1, 2026-05-03)

### A. Setting

| Aspekt | Entscheidung | Notiz |
|--------|--------------|-------|
| **Welt** | Fiktive Welt | Eigene Karten, prozedural generierbar oder handgebaut. Keine echten Städtenamen. |
| **Tech-Niveau** | **Era-Progression** | Start: **Mittelalter mit Pferdekarren**. Tech-Tree wächst durch Eras: Mittelalter → Industrialisierung → Moderne → leichter Sci-Fi-Twist. (Patrick-Anmerkung: „beginnend aber mit pferden am liebsten im mittelalter oderso") |
| **Karten-Größe** | Mittel ~600×600 | Platz für 2-4 Spieler-Firmen, mehrere Städte. Kampagne über mehrere Sitzungen. |

### B. Multiplayer

| Aspekt | Entscheidung |
|--------|--------------|
| **Konkurrenz** | Allianzen + Verträge erlaubt. Spieler können Kartelle bilden, Lieferabkommen schließen. |
| **Sabotage-Härte** | **Volle Bandbreite:** wirtschaftlich + Spionage + direkte Sabotage. (Patrick: „spionage und co aber auch dazu") |
| **Sitzungs-Format** | Kampagne über Wochen mit Save & Continue. Welt persistiert. |

### C. Wirtschaft

| Aspekt | Entscheidung |
|--------|--------------|
| **Modell** | Cash-Flow + Investoren/Aktien/Kredite. Spieler kann Kapital aufnehmen, Firma an die Börse bringen, Konkurrenten übernehmen. |

### D. Visual

| Aspekt | Entscheidung | Status |
|--------|--------------|--------|
| **Pixel-Auflösung** | 48×48 px pro Sprite | Bestätigt |
| **Stadt-Stil** | Erkennbare Gebäudetypen (Häuser, Fabriken, Kirchen, Wohnblocks) | Bestätigt |
| **Terrain-Perspektive** | **3/4-Iso ODER „vorne/oben" — KLÄRUNG OFFEN** | Patrick: „entweder 3/4 iso, oder 'vorne/oben' also keine klassische draufsicht" → Folge-Survey nötig |

---

## ⚠ Offene Klärungen (kritisch vor Sprite-Generation)

### Klärung 1: Perspektive (siehe `design-survey-v2.html`)

Patricks „vorne/oben" könnte mehrere Dinge bedeuten:
- **3/4-Iso wie OpenTTD/SimCity 2000** — Tiles als Rauten, Höhen als Stufen
- **Cabinet-Iso wie RollerCoaster Tycoon** — flacherer Winkel, mehr Vorderseite
- **2.5D-Aufsicht wie Theme Hospital/Anno 1404** — schräge Drauf­sicht mit Schatten
- **High-Angle Side-View wie Tropico/Banished** — fast seitlich, leicht von oben

→ Mit Bild-Vergleichen klären in **Folge-Survey**.

### Klärung 2: Era-Range

Patricks „Mittelalter beginnend → leichter Sci-Fi" — wie weit reicht der Tech-Tree?
- Endet mit Heute (LKW, Container)?
- Endet mit Near-Future (E-LKW, Drohnen)?
- Endet mit echtem Sci-Fi (Magnet-Bahnen, Anti-Grav)?

→ Auch in **Folge-Survey**.

---

## Kern-Pillars (was Cargora ausmacht)

### 1. Era-Progression als zentrale Belohnungs-Loop (NEU)

Spieler beginnen mit Pferdewagen auf Trampelpfaden. Über Wochen Spielzeit forscht und investiert man sich durch:

- **Era 1 — Mittelalter:** Pferdewagen, Trampelpfade, kleine Marktplätze, Burgen als Zentrum.
- **Era 2 — Frühe Neuzeit:** Postkutschen, Schotterstraßen, erste Handelshäuser, Häfen.
- **Era 3 — Industrialisierung:** Dampfeisenbahn, Kanäle, Fabriken, erste Kohlezüge.
- **Era 4 — Moderne:** LKW, Container, Asphalt-Autobahnen, Flughäfen, Container-Terminals.
- **Era 5 — Leichter Sci-Fi:** E-LKW, Cargo-Drohnen, Magnet-Bahnen, automatisierte Häfen.

Jede Era unlocked neue Modalitäten + neue Cargo-Typen + neue Wettbewerbsdynamiken.

### 2. Modulare Tiefe statt Breite

Wenige Systeme — aber jedes mit echter Simulationstiefe. Pferdewagen haben:
- **Pferderasse** (Last vs. Geschwindigkeit)
- **Kutschen-Typ** (Wagen, Karren, Postkutsche)
- **Hufeisen** (Material, Verschleiß)
- **Beladung** (Volumen, Verderblichkeit)

LKWs später analog mit Reifen + Motor + Aufbau. **Gleiches Prinzip durch alle Eras.**

### 3. Echter Markt statt Festpreise

Preise entstehen durch Angebot/Nachfrage zwischen Spielern und NPC-Konsumenten. Knappheit treibt Preise. Konkurrenz drückt sie.

### 4. Multiplayer von Anfang an

Nicht „Singleplayer mit MP-Bolt-on" — MP-First. 2-8 Spieler, gemeinsame Welt, Handelsverträge, Konkurrenz, Allianzen, Spionage, direkte Sabotage.

### 5. Städte als lebende Akteure

Städte wachsen, ihre Bedürfnisse ändern sich mit der Era (Mittelalter: Getreide+Holz, Industrialisierung: Kohle+Stahl, Moderne: Elektronik+Lebensmittel). Stadtinfrastruktur (gute Anbindung) zieht Bevölkerung.

### 6. Konfigurierbare Infrastruktur

In jeder Era anders, aber gleicher Grundgedanke:
- **Mittelalter:** Marktplatz mit konfigurierbarer Größe + Wachposten
- **Industrialisierung:** Bahnhof mit Anzahl Gleise + Wartungshallen
- **Moderne:** Flughafen mit Frachtterminals (Kühl/Tiefkühl/Ambient), Runway-Längen

### 7. Forschung mit Spionage-Möglichkeit

Technologien werden erforscht und können von Konkurrenten kopiert werden, wenn sie Zugang zu deinen Anlagen bekommen. Spionage als MP-Element. Auch direkte Sabotage möglich.

---

## Modalitäten pro Era

| Era | Modalitäten | Tiefe-Beispiele |
|-----|-------------|-----------------|
| **Mittelalter** | Pferdewagen, Boote (Fluss/Küste), Wanderhändler | Pferderasse, Kutschen-Typ, Wagen-Bauweise, Hufeisen-Verschleiß, Last-Verteilung |
| **Frühe Neuzeit** | Postkutschen, Segelschiffe, erste Kanäle | Schiffsklassen, Segel-Konfiguration, Crew-Stärke |
| **Industrialisierung** | Dampfeisenbahn, Dampfschiffe, Kanal-Schleppkähne | Lokomotive + Wagen-Sets, Spurweite, Signalsystem |
| **Moderne** | LKW, Container-Bahn, Container-Schiff, Cargo-Flugzeug | Reifen, Motor, Aufbau, Klima, Routenplanung, Treibstoff |
| **Sci-Fi-Twist** | E-LKW, Cargo-Drohnen, Magnet-Bahnen, evtl. autonome Konvois | Batterien, KI-Routing, Lade-Infrastruktur |

---

## Beispiel: Eine konkrete Tiefe-Mechanik durch Eras

**Era 1 (Mittelalter):** Du transportierst Salz aus einer Mine zur Stadt.
- Pferdewagen mit 2 Pferden, Holzfässer als Cargo.
- Trampelpfad ist matschig im Regen → Wagen bleibt stecken.
- Lösung: Investiere in Schotterweg-Bau-Forschung.

**Era 3 (Industrialisierung):** Salz wird zur Industrie — du baust eine Schmalspurbahn.
- Dampflok zieht 4 Kohlewagen + 6 Salzwagen.
- Signalsystem verhindert Kollisionen.
- Lösung: Doppelgleisige Strecke gegen Stau.

**Era 4 (Moderne):** Salz ist Bulk-Cargo — du nutzt Container.
- LKW-Konvoi zur Bahn-Umladestelle, Container-Zug, Container-Schiff zum Übersee-Markt.
- Tiefkühl-Container nicht nötig (Salz ist robust).
- Lösung: Optimiere Container-Umlauf und Lager-Just-in-Time.

**Eine Cargo-Linie wächst über Eras mit, statt verworfen zu werden.** Das ist der Era-Progression-Reiz.

---

## Was Cargora NICHT ist

- Kein Open World/RPG — keine Spieler-Avatare
- Kein Echtzeit-Kampfspiel — Sabotage ist ökonomisch/spionage/punktuell, kein Krieg
- Kein Story-Spiel — keine Cutscenes, keine Hauptquest
- Kein Mobile-Spiel — Browser/Desktop, Maus+Tastatur
- Kein Pay2Win, kein kommerzielles Modell

---

## Spielerzahl & Sitzungs-Format

- **Spielerzahl:** 2-8 (Phase 1: 2 für MVP)
- **Sitzungslänge:** 30-120 Minuten pro Sitzung
- **Persistenz:** Save & Continue über Wochen — eine Kampagne kann Monate dauern
- **Era-Übergang:** Zeit-Beschleunigung möglich, sodass eine Kampagne durch alle 5 Eras führt (Spieler entscheiden gemeinsam, wann beschleunigt wird)

---

## Phasen-Plan (überarbeitet nach Survey)

| Phase | Dauer | Ziel |
|-------|-------|------|
| **Phase 0 (jetzt)** | Tag 1 | Stunde-1-Prototyp ✅ + Doku-Struktur ✅ + GitHub-Repo ✅ + Survey ✅ |
| **Phase 1 (MVP)** | Mon 1-3 | **NUR Era 1 (Mittelalter):** Pferdewagen + Trampelpfade + 2 Cargo-Typen + lokales Singleplayer + Basis-Multiplayer |
| **Phase 2 (Era-Tiefe)** | Mon 4-6 | Modulare Pferdewagen (Pferd/Kutsche/Hufeisen), erste Forschung, eine Warenkette in Era 1 |
| **Phase 3 (Era-Übergang)** | Mon 7-10 | **Era 2 (Frühe Neuzeit) freigeschaltet** — Tech-Forschung führt zur nächsten Era. Spieler erleben ersten Era-Switch. |
| **Phase 4 (Wirtschaft)** | Mon 11-14 | Echter Markt zwischen Spielern, Investoren/Aktien-System, Städte mit Bedarfsmodell |
| **Phase 5 (Era 3+)** | Mon 15-20 | Industrialisierung dazu (Dampfeisenbahn als zweite Modalität) |
| **Phase 6+ (offene Skalierung)** | Mon 21+ | Era 4 (Moderne) + Era 5 (Sci-Fi). Sabotage/Spionage. Polish. |

**Gesamt: ~20-24 Monate bis vollständige Era-Progression.** Das ist **deutlich mehr** als ursprünglich geplante 12 Monate — weil Era-Progression das Scope vervielfacht. Aber **jede Phase liefert ein spielbares Etwas**.

---

## Patrick-Anmerkung zur Survey

> „Diese Art von Umfrage hat mir extrem gefallen. Beim nächsten Mal vielleicht noch mehrfach Auswahl"

→ Notiert für zukünftige Surveys: **Multi-Select-Optionen** als Feature einbauen (nicht nur Radio-Buttons).

---

## Revisions-Notizen

- **2026-05-03 V1:** Initial-Version. Kern-Pillars festgelegt, Phasen grob.
- **2026-05-03 V2:** Survey-Antworten von Patrick eingearbeitet. **Massiver Pivot:** Mittelalter-Start mit Era-Progression. Phasen-Plan komplett überarbeitet (12 → 20+ Monate). Zwei Klärungspunkte zu Perspektive + Era-Range bleiben offen, separate Folge-Survey.
