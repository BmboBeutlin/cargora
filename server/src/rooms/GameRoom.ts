import { Room, Client } from "colyseus";
import { GameState, Player, Vehicle } from "../schema/GameState";
import type { JoinOptions, MoveVehicleMessage } from "../types";

// Default-Spawn-Position fuer neue Spieler-LKWs.
const DEFAULT_SPAWN_X = 6;
const DEFAULT_SPAWN_Y = 4;

// Maximale Spieler pro Room. Phase-1 MVP: klein halten.
const MAX_CLIENTS = 8;

export class GameRoom extends Room<GameState> {
  override maxClients = MAX_CLIENTS;

  override onCreate(_options: unknown): void {
    this.setState(new GameState());

    // Message-Handler: Bewegungs-Anfrage eines Clients fuer ein Vehicle.
    this.onMessage("move-vehicle", (client: Client, message: MoveVehicleMessage) => {
      this.handleMoveVehicle(client, message);
    });

    console.log(`[GameRoom] created (roomId=${this.roomId})`);
  }

  override onJoin(client: Client, options: JoinOptions = {}): void {
    const player = new Player();
    player.id = client.sessionId;
    player.name = options.name?.trim() || `Player-${client.sessionId.slice(0, 4)}`;
    player.joinedAt = Date.now();
    this.state.players.set(client.sessionId, player);

    // Default-Vehicle (Truck) fuer den neuen Player anlegen.
    const vehicle = new Vehicle();
    vehicle.id = `veh-${client.sessionId}-1`;
    vehicle.ownerId = client.sessionId;
    vehicle.kind = "truck";
    vehicle.x = DEFAULT_SPAWN_X;
    vehicle.y = DEFAULT_SPAWN_Y;
    vehicle.heading = 0;
    this.state.vehicles.set(vehicle.id, vehicle);

    console.log(
      `[GameRoom] join: ${player.name} (${client.sessionId}) -> spawned ${vehicle.id} at (${vehicle.x}, ${vehicle.y})`,
    );
  }

  override onLeave(client: Client, _consented?: boolean): void {
    const player = this.state.players.get(client.sessionId);
    const playerName = player?.name ?? client.sessionId;

    // Alle Vehicles dieses Players entfernen.
    const ownedVehicleIds: string[] = [];
    this.state.vehicles.forEach((veh, id) => {
      if (veh.ownerId === client.sessionId) {
        ownedVehicleIds.push(id);
      }
    });
    for (const id of ownedVehicleIds) {
      this.state.vehicles.delete(id);
    }

    this.state.players.delete(client.sessionId);

    console.log(
      `[GameRoom] leave: ${playerName} (${client.sessionId}) — removed ${ownedVehicleIds.length} vehicle(s)`,
    );
  }

  override onDispose(): void {
    console.log(`[GameRoom] disposed (roomId=${this.roomId})`);
  }

  // --- Internals --------------------------------------------------------

  private handleMoveVehicle(client: Client, message: MoveVehicleMessage): void {
    if (!message || typeof message.vehicleId !== "string") {
      return;
    }
    const vehicle = this.state.vehicles.get(message.vehicleId);
    if (!vehicle) {
      return;
    }
    // Ownership-Check: nur der Besitzer darf sein Vehicle bewegen.
    if (vehicle.ownerId !== client.sessionId) {
      console.warn(
        `[GameRoom] reject move: ${client.sessionId} is not owner of ${vehicle.id}`,
      );
      return;
    }
    if (
      typeof message.targetX !== "number" ||
      typeof message.targetY !== "number" ||
      !Number.isFinite(message.targetX) ||
      !Number.isFinite(message.targetY)
    ) {
      return;
    }

    // Phase-1-Stub: keine Pathfinding-Validierung, einfach Position setzen.
    // Heading rudimentaer aus dx/dy ableiten.
    const dx = message.targetX - vehicle.x;
    const dy = message.targetY - vehicle.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      vehicle.heading = dx >= 0 ? 90 : 270;
    } else if (dy !== 0 || dx !== 0) {
      vehicle.heading = dy >= 0 ? 180 : 0;
    }
    vehicle.x = Math.trunc(message.targetX);
    vehicle.y = Math.trunc(message.targetY);
  }
}
