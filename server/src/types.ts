// Shared types for the Cargora multiplayer server.
// These mirror the data shapes carried by the Colyseus state schema
// and are useful for typing message payloads exchanged with clients.

// Plain grid position on the tile map.
export interface GridPosition {
  x: number;
  y: number;
}

// Default heading values (degrees, 0 = north). Cabinet-Iso rendering on the
// client may map these to sprite directions.
export const Heading = {
  North: 0,
  East: 90,
  South: 180,
  West: 270,
} as const;
export type Heading = (typeof Heading)[keyof typeof Heading];

// Vehicle kinds we expect to support across eras. Phase-1 only uses Truck.
export const VehicleKind = {
  HorseCart: "horse-cart",
  Truck: "truck",
} as const;
export type VehicleKind = (typeof VehicleKind)[keyof typeof VehicleKind];

// Client -> server: request to move a vehicle to a target tile.
export interface MoveVehicleMessage {
  vehicleId: string;
  targetX: number;
  targetY: number;
}

// Optional client-supplied join data.
export interface JoinOptions {
  name?: string;
}
