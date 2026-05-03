import { Schema, MapSchema, type } from "@colyseus/schema";

// Player-Schema: ein verbundener Spieler im Room.
export class Player extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("number") joinedAt: number = 0;
}

// Vehicle-Schema: ein Fahrzeug auf der Karte. Position ist tile-basiert
// (Grid-Koordinaten), nicht pixel-basiert.
export class Vehicle extends Schema {
  @type("string") id: string = "";
  @type("string") ownerId: string = "";
  @type("string") kind: string = "truck";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") heading: number = 0;
}

// Top-level GameState: wird vom Server gehalten und automatisch zu allen
// Clients gesynced. MapSchema-Eintraege loesen entity-spezifische
// add/remove/change-Events aus.
export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Vehicle }) vehicles = new MapSchema<Vehicle>();
  @type("number") tick: number = 0;
}
