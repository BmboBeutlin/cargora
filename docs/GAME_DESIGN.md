# Cargora — Game Design Document

> **Stand:** 2026-05-03 (V2 — nach Patrick-Survey)
> **Status:** Vision konsolidiert, 2 Punkte zur Perspektive + Era-Range noch offen (siehe `design-survey-v2.html`)

---

## Vision in einem Satz

**Phase 1:** Du verwaltest eine moderne Logistik-Firma — jeder LKW konfigurierbar, jeder Cargo-Typ mit Anforderungen, echte Märkte, Multiplayer mit Freunden in fiktiver Welt.

**Langfristige Vision (Phase 4+):** Era-Progression wird optional zugeschaltet — beginne im Mittelalter mit Pferdekarren und entwickle dich durch alle Eras bis Sci-Fi.

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

## Survey V2 Ergebnisse (2026-05-03 Abend)

### Perspektive: **Cabinet-Iso (RollerCoaster Tycoon-Stil)**

Cabinet-Iso bedeutet:
- Tiles als Rauten (Diamond-Shape, 2:1-Verhältnis)
- Flacherer Winkel als True-Iso → mehr Vorderseite von Gebäuden/Vehicles sichtbar
- Render-Reihenfolge: hinten nach vorne (Y-Sort)
- Code-Komplexität: mittel (Iso-Math, aber kein 3D)

**Live-Demo im Spiel:** Patrick kann im Browser zwischen Top-Down und Cabinet-Iso wechseln (Taste `I` oder Button oben rechts). Beide Modi nutzen dieselbe Karte und gleiche Spielmechanik.

### Eras: **Alle 5 Eras** (Mittelalter → Frühe Neuzeit → Industrialisierung → Moderne → Sci-Fi-Twist)

### Era-Übergangs-Tempo: **Spieler bestimmen + Glockenkurve**

Patrick: „die eras sollten halt durch die progression weiterschreiten. das bedeutet wenn ein spieler schneller ist als der andere kann er auch schneller in die neue era vorgehen. allerdings muss das natürlich alles tradeoffs haben."

**Konkrete Mechanik:**
- Jeder Spieler forscht individuell. Wer früher die Era-Tech freischaltet, kommt früher in die nächste Era.
- **Pioneer-Vorteil:** Neue Era-Tech zuerst nutzen können (Monopol-Periode).
- **Pioneer-Risiko:** Frühe Tech ist teuer, fehleranfällig, wenig erforscht. Konkurrenten profitieren von späterer, billigerer Adoption.
- **Cross-Era-Multiplayer:** Spieler in unterschiedlichen Eras spielen gleichzeitig auf derselben Karte. Pferdekarren-Spieler kann mit LKW-Spieler Handelsverträge schließen.

Patrick zur Zeit-Verteilung: „mittelalter ist immer sehr langweilig und dann industrialisierung bis moderne sind sehr interessant. da vielleicht den hauptaugenmerk dass wir da so eine art glocke bauen oder so."

**Glockenkurve der Era-Tiefe:**

| Era | Forschungstiefe | Spielzeit-Anteil (geschätzt) |
|-----|-----------------|------------------------------|
| Mittelalter | Klein (Onboarding, schnell durch) | ~10% |
| Frühe Neuzeit | Mittel | ~15% |
| **Industrialisierung** | **Groß** | **~30%** |
| **Moderne** | **Groß** | **~30%** |
| Sci-Fi-Twist | Klein (Endgame-Belohnung) | ~15% |

→ Mittelalter und Sci-Fi sind „Türöffner" und „Belohnung", die Mitte ist das Hauptspiel.

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

## Phasen-Plan (V3 — nach Era-System-Verschiebung)

| Phase | Dauer | Ziel |
|-------|-------|------|
| **Phase 0 (jetzt)** | Tag 1 | Bootstrap-Prototyp ✅ + Doku ✅ + GitHub ✅ + Cabinet-Iso ✅ |
| **Phase 1 (MVP Modern)** | Mon 1-3 | LKW + Asphalt-Straßen + 2 Cargo-Typen + lokales Singleplayer + Basis-Multiplayer (2 Spieler) |
| **Phase 1.5 (Tile-System)** | Mon 4-5 | Auto-Tiling für glatte Straßen + Wasser + Berge/Höhen + Biome (Wald/Wüste). Erste echte Pixel-Sprites. |
| **Phase 2 (Modulare Tiefe)** | Mon 6-8 | Modulare LKW (Reifen + Motor + Aufbau), Forschungsbaum, eine vollständige Warenkette |
| **Phase 3 (Wirtschaft)** | Mon 9-11 | Echter Markt zwischen Spielern, Cash-Flow + Investoren-System, Städte mit Bedarfsmodell |
| **Phase 4 (zweite Modalität)** | Mon 12-14 | Schiene (Container-Bahn) als zweite Modalität. Polish. **Optional: Era-Progression-System hier aktivierbar.** |
| **Phase 5+ (offene Skalierung)** | Mon 15+ | Luft + Schiff. Sabotage/Spionage. Wenn Era-System gewünscht: Mittelalter+Industrialisierung+Sci-Fi-Eras retrospektiv hinzufügen. |

**Gesamt für Phase 1 (Multiplayer-fähiges Modern-Spiel): ~9-11 Monate.**
**Gesamt für vollständiges Spiel mit allen Modalitäten: ~14-18 Monate.**
**Era-Progression bleibt als Phase 5+ Erweiterung möglich** — das Datenmodell ist strukturell vorbereitet (Tile-Datenmodell hat optionale `era`-Property).

### Was sich gegenüber V2-Plan geändert hat

V2 wollte mit Mittelalter starten + Era-Progression als Kern-Mechanik (20-24 Monate Gesamt-Scope). V3 baut zuerst ein vollwertiges Modern-Spiel (9-11 Monate bis spielbar), Era-Progression bleibt als optional-zuschaltbares Feature für später. Begründung in **`DECISIONS.md` ADR-009**.

---

## Patrick-Anmerkung zur Survey

> „Diese Art von Umfrage hat mir extrem gefallen. Beim nächsten Mal vielleicht noch mehrfach Auswahl"

→ Notiert für zukünftige Surveys: **Multi-Select-Optionen** als Feature einbauen (nicht nur Radio-Buttons).

---

## Revisions-Notizen

- **2026-05-03 V1:** Initial-Version. Kern-Pillars festgelegt, Phasen grob.
- **2026-05-03 V2:** Survey-Antworten von Patrick eingearbeitet. **Massiver Pivot:** Mittelalter-Start mit Era-Progression. Phasen-Plan komplett überarbeitet (12 → 20+ Monate). Zwei Klärungspunkte zu Perspektive + Era-Range bleiben offen, separate Folge-Survey.
