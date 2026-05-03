import http from "http";
import express, { type Express } from "express";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import { GameRoom } from "./rooms/GameRoom";

// Default-Port fuer den Colyseus-Server. Per ENV ueberschreibbar.
const PORT = Number(process.env.PORT ?? 2567);

function createApp(): Express {
  const app = express();
  app.use(express.json());

  // Health-Check fuer manuelle Tests / Uptime-Monitoring.
  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "cargora-server", time: Date.now() });
  });

  // Colyseus-Monitor (Debug-UI) unter /colyseus.
  app.use("/colyseus", monitor());

  return app;
}

function bootstrap(): void {
  const app = createApp();
  const httpServer = http.createServer(app);

  const gameServer = new Server({
    transport: new WebSocketTransport({ server: httpServer }),
  });

  // Room-Registrierung. Clients joinen via `client.joinOrCreate("game")`.
  gameServer.define("game", GameRoom);

  gameServer
    .listen(PORT)
    .then(() => {
      console.log(`[cargora-server] listening on http://localhost:${PORT}`);
      console.log(`[cargora-server] colyseus monitor: http://localhost:${PORT}/colyseus`);
      console.log(`[cargora-server] health-check:    http://localhost:${PORT}/health`);
    })
    .catch((err) => {
      console.error("[cargora-server] failed to start:", err);
      process.exit(1);
    });
}

bootstrap();
