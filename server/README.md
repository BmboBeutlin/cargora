# cargora-server

Colyseus-Multiplayer-Server-Stub fuer Cargora. Eigenstaendiges Subprojekt
mit eigenem `package.json` und `node_modules`. Greift NICHT auf den
Hauptprojekt-Code zu.

## Status

Phase-1 **Stub**. Funktional genug fuer:
- Mehrere Clients koennen joinen
- Jeder Spieler bekommt einen Default-LKW auf Tile `(6, 4)`
- Clients koennen ihre Vehicles ueber `move-vehicle`-Messages bewegen
- State (Players + Vehicles) wird automatisch zu allen Clients gesynct

## Voraussetzungen

- Node.js 20+ (Hauptprojekt nutzt v20 LTS auf dem Server)
- npm

## Setup

```bash
cd server
npm install
```

## Starten

```bash
# Dev-Modus (mit Auto-Reload via tsx watch)
npm run dev

# Production-Build + Start
npm run build
npm start

# Type-Check ohne Build
npm run typecheck
```

Standard-Port: **2567** (Colyseus-Default). Ueberschreibbar via `PORT` ENV.

## Endpoints

| Pfad | Zweck |
|------|-------|
| `ws://localhost:2567`        | Colyseus WebSocket-Endpoint (Game-Rooms) |
| `http://localhost:2567/health`    | JSON-Health-Check |
| `http://localhost:2567/colyseus`  | Colyseus-Monitor Debug-UI |

## Rooms

| Name   | Klasse     | Max Clients | Beschreibung |
|--------|------------|-------------|--------------|
| `game` | `GameRoom` | 8           | Default Spielraum, hostet `GameState` |

## Manueller Test (Browser-Console)

Du brauchst die `colyseus.js`-Client-Lib. Schnellster Weg ohne Build-Setup:
oeffne `https://docs.colyseus.io/colyseus/getting-started/javascript-client/`,
nutze die Browser-Devtools dort, oder lade die Lib via CDN in eine leere
HTML-Seite.

```html
<!doctype html>
<html>
  <body>
    <script src="https://unpkg.com/colyseus.js@^0.16.0/dist/colyseus.js"></script>
    <script>
      (async () => {
        const client = new Colyseus.Client("ws://localhost:2567");
        const room = await client.joinOrCreate("game", { name: "TestPlayer" });
        console.log("joined room:", room.roomId, "as", room.sessionId);

        room.onStateChange((state) => {
          console.log("state tick:", state.tick,
            "players:", state.players.size,
            "vehicles:", state.vehicles.size);
        });

        // Beispiel: ersten eigenen LKW eine Tile nach rechts bewegen.
        setTimeout(() => {
          const own = [...room.state.vehicles.values()]
            .find(v => v.ownerId === room.sessionId);
          if (own) {
            room.send("move-vehicle", {
              vehicleId: own.id,
              targetX: own.x + 1,
              targetY: own.y,
            });
          }
        }, 1000);
      })();
    </script>
  </body>
</html>
```

Alternative: Colyseus-Monitor unter `http://localhost:2567/colyseus`
zeigt aktive Rooms, Clients und State-Inhalte direkt im Browser.

## Messages (Client -> Server)

| Type           | Payload                                                     | Effekt |
|----------------|-------------------------------------------------------------|--------|
| `move-vehicle` | `{ vehicleId: string; targetX: number; targetY: number }`   | Setzt Vehicle-Position (Tile-Koordinaten). Server prueft Ownership. |

## State-Schema

```
GameState
├── tick:     number
├── players:  Map<sessionId, Player>
│              ├── id:       string
│              ├── name:     string
│              └── joinedAt: number (ms-timestamp)
└── vehicles: Map<vehicleId, Vehicle>
               ├── id:       string  (z.B. "veh-<sessionId>-1")
               ├── ownerId:  string  (sessionId des Besitzers)
               ├── kind:     string  ("truck" im Stub)
               ├── x:        number  (Tile-Grid)
               ├── y:        number  (Tile-Grid)
               └── heading:  number  (0=N, 90=E, 180=S, 270=W)
```

## Was NICHT implementiert ist (bewusst)

- **Authentifizierung** — jeder kann joinen
- **Persistenz** — alles in-memory, Server-Restart loescht Welt
- **Pathfinding-Validation** — Server akzeptiert beliebige Ziel-Tiles
- **Cargo-System** — keine Waren, keine Vertraege
- **Tick-Loop / Simulation** — `state.tick` ist Platzhalter, kein Update-Loop aktiv
- **Forschung, Eras, Markt** — alles spaetere Phasen
- **Client-Anbindung im Hauptprojekt** — `src/net/` existiert noch nicht

## Integration ins Hauptprojekt (TODO fuer spaeter)

Geplant: `cargora/src/net/colyseusClient.ts` haelt eine `Colyseus.Client`-
Instanz, joined `game` und broadcasted State-Aenderungen an Phaser-Scenes.
Nicht Teil dieses Stubs.

## Deployment (TBD)

Phase-2: Railway oder Render (siehe `docs/TECH_STACK.md`).
