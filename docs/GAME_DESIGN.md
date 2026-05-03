# Cargora — Game Design Document

> **Stand:** 2026-05-03 (Initial-Vision)
> **Status:** WIP — Kern-Vision dokumentiert, Mechanik-Details werden iterativ ergänzt.

---

## Vision in einem Satz

Du verwaltest eine Logistik-Firma in einer simulierten Welt mit echten Märkten — jeder LKW, jeder Reifen, jeder Flughafen, jede Fabrik ist konfigurierbar und greift in echte Wechselwirkungen ein.

---

## Inspiration

- **OpenTTD** — Logistik-Tycoon-Klassiker, aber zu oberflächlich
- **Factorio** — Tiefe in Warenketten, Belt-Logik
- **Mini Motorways / Mini Metro** — klare Visual-Sprache, Logistik als Puzzle
- **Cities: Skylines** — Städtesimulation als integrales Element
- **SimuTrans Extended** — modulare Fahrzeuge mit echten Werten

---

## Kern-Pillars (was Cargora ausmacht)

### 1. Modulare Tiefe statt Breite

Wenige Systeme — aber jedes mit echter Simulationstiefe. Kein „Truck { speed: 80, capacity: 20 }". Stattdessen:

```
Truck {
  chassis, tires, engine, cargo_bay, upgrades[]
}
```

Wechselwirkungen statt linearen Werte. Reifen × Straßentyp × Ladung × Wetter = 4D-Entscheidungsraum.

### 2. Echter Markt statt Festpreise

Preise entstehen durch Angebot/Nachfrage zwischen Spielern und NPC-Konsumenten. Mehr Konkurrenz = niedrigere Preise. Knappheit = Profit.

### 3. Multiplayer von Anfang an

Nicht „Singleplayer mit MP-Bolt-on" — sondern MP-First. 2–8 Spieler, gemeinsame Welt, Handelsverträge, Konkurrenz, Kooperation.

### 4. Städte als lebende Akteure

Städte sind nicht nur Cargo-Quellen/-Senken. Sie wachsen, ihre Bedürfnisse ändern sich, Bevölkerungs-Demografie verschiebt Nachfrage. Stadtinfrastruktur (gute Anbindung) zieht Bevölkerung an.

### 5. Konfigurierbare Infrastruktur

Du baust nicht „einen Flughafen", sondern einen Flughafen mit:
- Frachtterminals mit Klimazonen (Tiefkühl/Kühl/Ambient)
- Runway-Längen (limitiert Flugzeugtypen)
- Zollstationen (für Internationale Cargo)
- Energie-Anschluss

Gleiches Prinzip für Bahnhöfe, Speditionen, Häfen.

### 6. Forschungsbaum mit Spionage-Möglichkeit

Technologien sind nicht „gekauft = freigeschaltet". Sie werden erforscht und können von Konkurrenten kopiert werden, wenn sie Zugang zu deinen Anlagen bekommen. Macht Fortschritt zum MP-Element.

---

## Modalitäten

| Modalität | Phase | Tiefe |
|-----------|-------|-------|
| **LKW + Straßen** | Phase 1 | Reifen, Motor, Aufbau, Straßentypen, Wetter, Verschleiß |
| **Schiene** | Phase 3 | Lokomotiven + Wagen-Sets, Signalsystem, Spurweiten |
| **Luft** | Phase 3 oder 4 | Flugzeugtypen, Flughafen-Konfig, Klima-Cargo |
| **Schiff** | Phase 5+ | Frachtschiff, Häfen, Containerlogistik |

---

## Beispiel: Eine konkrete Tiefe-Mechanik

Du transportierst **Lachs aus Norwegen nach München**:

1. **Norwegen:** Fischfabrik produziert Frischfisch — verderblich, braucht Kühlkette.
2. **Hafen NO:** Container in Kühl-Container laden — kostet Strom (eigenes Kraftwerk?).
3. **Schiff nach Hamburg:** Container-Schiff mit Kühlanlage — Treibstoff, Wartung.
4. **Bahn HH→München:** Spezial-Wagen mit Kühlung — falls keiner verfügbar, LKW auf Autobahn.
5. **München-Lager:** Kühlhaus mit korrekter Temperatur — sonst Cargo verdirbt.
6. **Verteilung in Stadt:** Kleine LKWs mit Kühl-Aufbau zu Restaurants/Supermärkten.

**Eine Kette = 5 Systeme greifen ineinander.** Wenn ein Glied fehlt → Cargo verdirbt → Geld verloren → Reputation sinkt.

---

## Was Cargora NICHT ist

- **Kein Open World/RPG** — keine Spieler-Avatare, keine Ego-Perspektive
- **Kein Echtzeit-Kampfspiel** — Sabotage-Mechaniken sind subtil (Spionage, Übernahmen), keine Gewalt
- **Kein Story-Spiel** — keine Cutscenes, keine Charaktere, keine Hauptquest
- **Kein Mobile-Spiel** — Browser/Desktop, Maus+Tastatur
- **Kein Pay2Win** — überhaupt kein kommerzielles Modell, nur Hobby-Projekt

---

## Spielerzahl & Sitzungs-Format

- **Spielerzahl:** 2–8 (Phase 1: 2 für MVP, später skalieren)
- **Sitzungslänge:** 30–120 Minuten pro Sitzung
- **Persistenz:** Save & Continue über Tage/Wochen — eine Kampagne kann Wochen dauern
- **Asynchron?** TBD — eventuell „Welt läuft weiter, du loggst dich ein, machst was, gehst raus"

---

## Phasen-Plan (kurz, Details in `SCOPE.md` TBD)

| Phase | Dauer | Ziel |
|-------|-------|------|
| **Phase 1 (MVP)** | Mon 1–3 | LKW + 4 Straßentypen, 2 Cargo-Typen, lokales Singleplayer + Basis-Multiplayer |
| **Phase 2 (Tiefe)** | Mon 4–6 | Modulare Fahrzeuge (Reifen/Motor/Aufbau), Forschungsbaum, eine Warenkette |
| **Phase 3 (Wirtschaft)** | Mon 7–9 | Echter Markt, Städte mit Bedarfsmodell, zweite Modalität |
| **Phase 4 (Polish)** | Mon 10–12 | Wetter, Verschleiß-Mechaniken, Sound, UX, Save/Load, Spielbarkeit für Freunde |
| **Phase 5+** | Mon 13+ | Dritte Modalität, Spionage, Karten-Editor, Mod-Support? |

---

## Offene Fragen (zu klären in Game-Design-Sessions)

- [ ] Karten-Größe? Realistische Geografie oder fiktive Welt?
- [ ] Tech-Niveau: Heute, alternativ-Geschichte, Sci-Fi, Steampunk?
- [ ] Wie alt werden Welten? (Eine Kampagne 1 Jahr Echtzeit oder kurze Sessions?)
- [ ] Konfliktlösung MP: Reine Konkurrenz, Allianzen, formelle Verträge?
- [ ] Wie krass ist Sabotage erlaubt? (Rein Spionage, oder auch direkter Schaden?)
- [ ] Städte: Spieler darf Stadtwachstum beeinflussen, oder nur reagieren?
- [ ] Wirtschaftsmodell: Reines Cash-Flow, oder Aktien/Investition/Kredit?

---

## Revisions-Notizen

- **2026-05-03:** Initial-Version. Kern-Pillars festgelegt. Phasen-Plan grob skizziert. 7 offene Fragen markiert.
