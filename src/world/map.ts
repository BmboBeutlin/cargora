// World data model for Cargora.
// Phase 1: Single-Era (Modern). Era-Progression structurally prepared but not yet active.

export const TILE_SIZE = 32;
export const MAP_W = 18;
export const MAP_H = 14;

export const TileType = {
  Asphalt: 'asphalt',
  Schotter: 'schotter',
  Feldweg: 'feldweg',
  Gras: 'gras',
  Wasser: 'wasser',
  Schiene: 'schiene',
} as const;
export type TileType = (typeof TileType)[keyof typeof TileType];

export const EraType = {
  Medieval: 'medieval',
  EarlyModern: 'early_modern',
  Industrial: 'industrial',
  Modern: 'modern',
  SciFi: 'scifi',
} as const;
export type EraType = (typeof EraType)[keyof typeof EraType];

export const BiomeType = {
  Temperate: 'temperate',
  Forest: 'forest',
  Desert: 'desert',
  Tundra: 'tundra',
  Mountain: 'mountain',
} as const;
export type BiomeType = (typeof BiomeType)[keyof typeof BiomeType];

export type TileInfo = {
  name: string;
  color: number;
  edgeColor: number;
  speedMod: number;
};

export const TILE_INFO: Record<TileType, TileInfo> = {
  asphalt:  { name: 'Asphalt',  color: 0x3a3a42, edgeColor: 0x2a2a30, speedMod: 1.0  },
  schotter: { name: 'Schotter', color: 0x8a7a5e, edgeColor: 0x6a5a3e, speedMod: 0.55 },
  feldweg:  { name: 'Feldweg',  color: 0xa68a52, edgeColor: 0x866a32, speedMod: 0.30 },
  gras:     { name: 'Gras',     color: 0x3a5a3a, edgeColor: 0x1e3a1e, speedMod: 0    },
  wasser:   { name: 'Wasser',   color: 0x3a5a8e, edgeColor: 0x2a4a7e, speedMod: 0    },
  schiene:  { name: 'Schiene',  color: 0x5a4838, edgeColor: 0x3a2818, speedMod: 0    },
};

const ASCII_TO_TILE: Record<string, TileType> = {
  A: 'asphalt',
  s: 'schotter',
  f: 'feldweg',
  '.': 'gras',
  '~': 'wasser',
  'R': 'schiene',
};

// "Stadt-Block"-Layout — schmale Asphalt-Straßen (2 Tiles breit) bilden ein Straßennetz,
// Schotter-Quadrate sind Bezirke (Lager/Stadtviertel) zwischen den Straßen,
// Feldweg ist ein abgelegener Nebenpfad, Gras ist Map-Hintergrund.
// Map ist 18×14 → passt in den Game-Canvas, kein Overflow rechts.
const MAP_ASCII: string[] = [
  '..RRRRRRRRRRRRRR..', // 0  SCHIENEN oben (West-Ost)
  '..................', // 1
  '..AAAAAAAAAAAAAA..', // 2  Hauptstraße (West-Ost) oben
  '..AAAAAAAAAAAAAA..', // 3
  '..AA..ssss..ss..AA', // 4  Lager links + Mini-Lager rechts
  '..AA..ssss..ss..AA', // 5
  '..AA..........AA..', // 6
  '..AAAAAAAAAAAAAA..', // 7  Querstraße
  '..AAAAAAAAAAAAAA..', // 8
  '..AA..fff...sss.AA', // 9  Feldweg-Bezirk + Lager-Bezirk
  '..AA..fff...sss.AA', // 10
  '..AA............AA', // 11
  '..AAAAAAAAAAAAAAAA', // 12 Hauptstraße unten
  '....~~~~~~~~~~....', // 13 FLUSS unten
];

// Brücke: Asphalt auf Höhe X über Boden-Tile auf Höhe Y (X > Y)
// bridgeHeight ist absolut (nicht relativ zum Boden)
export type BridgeTile = {
  x: number;
  y: number;
  bridgeHeight: number;
};

// Tunnel-Tile: Eingang in Berg
export type TunnelTile = {
  x: number;
  y: number;
  direction: 'N' | 'E' | 'S' | 'W'; // wohin der Tunnel geht
};

// Slope/Rampe: Asphalt-Tile, das schräg von Höhe X zu Höhe X+1 ansteigt
// direction = wohin die Steigung zeigt (höhere Seite)
export type SlopeTile = {
  x: number;
  y: number;
  direction: 'N' | 'E' | 'S' | 'W';
  baseHeight: number; // niedrigere Seite
};

// Decoration: Baum/Strauch/Haus/anderes auf einer Tile
export type Decoration = {
  x: number;
  y: number;
  kind: 'tree' | 'pine' | 'bush' | 'house' | 'apartment' | 'cottage';
  // Sub-Position innerhalb des Tiles (0-1 für jitter)
  offsetX?: number;
  offsetY?: number;
};

export type WorldData = {
  width: number;
  height: number;
  tiles: TileType[][];
  heights: number[][];
  biomes: (BiomeType | null)[][];
  eras: (EraType | null)[][];
  bridges: BridgeTile[];
  tunnels: TunnelTile[];
  slopes: SlopeTile[];
  decorations: Decoration[];
};

export function buildWorld(): WorldData {
  const tiles = MAP_ASCII.map((row) =>
    row.split('').map((ch) => ASCII_TO_TILE[ch] ?? 'gras')
  );
  const heights: number[][] = Array.from({ length: MAP_H }, () => new Array<number>(MAP_W).fill(0));
  const biomes = Array.from({ length: MAP_H }, () => new Array(MAP_W).fill(null));
  const eras = Array.from({ length: MAP_H }, () => new Array(MAP_W).fill(null));

  // Demo-Berg: deutlicher Pyramiden-Hügel auf der oberen Gras-Fläche (Zeile 0-1, alle Gras)
  // Plus kleiner Hügel auf der unteren Gras-Fläche (Zeile 13)
  // Heights erst NUR auf Gras setzen, nicht auf Asphalt/Schotter (würde Auto-Tiling brechen)
  heights[0][7] = 1;
  heights[0][8] = 2;
  heights[0][9] = 3;
  heights[0][10] = 3;
  heights[0][11] = 2;
  heights[0][12] = 1;
  heights[1][7] = 1;
  heights[1][8] = 2;
  heights[1][9] = 2;
  heights[1][10] = 2;
  heights[1][11] = 2;
  heights[1][12] = 1;
  // Wasser ist auf Höhe 0 (default), Brücke darüber auf Höhe 2

  // Demo-Brücken über Fluss (Zeile 13) — eine längere + eine kleine
  const bridges: BridgeTile[] = [
    { x: 4, y: 13, bridgeHeight: 2 },
    { x: 5, y: 13, bridgeHeight: 2 },
    { x: 6, y: 13, bridgeHeight: 2 },
    { x: 7, y: 13, bridgeHeight: 2 },
    { x: 11, y: 13, bridgeHeight: 2 },
    { x: 12, y: 13, bridgeHeight: 2 },
    { x: 13, y: 13, bridgeHeight: 2 },
  ];

  // Demo-Tunnel: Eingang am Berg-Fuß
  const tunnels: TunnelTile[] = [
    { x: 7, y: 1, direction: 'E' }, // Eingang Richtung Osten
  ];

  // Demo-Rampe: Asphalt-Steigung am Berg-Fuß
  const slopes: SlopeTile[] = [
    { x: 6, y: 0, direction: 'E', baseHeight: 0 },
  ];

  // Decoration: Bäume verstreut auf Gras-Flächen, Pinien an den Bergen
  const decorations: Decoration[] = [
    // Pinien-Wald oben links
    { x: 2, y: 0, kind: 'pine', offsetX: 0.2 },
    { x: 3, y: 0, kind: 'pine', offsetX: -0.1 },
    { x: 4, y: 0, kind: 'tree' },
    { x: 4, y: 1, kind: 'bush', offsetX: 0.3 },
    // Bäume um den Berg oben (zwischen Berg und Asphalt)
    { x: 13, y: 0, kind: 'pine' },
    { x: 13, y: 1, kind: 'tree', offsetX: 0.2 },
    { x: 14, y: 1, kind: 'tree' },
    { x: 15, y: 1, kind: 'pine', offsetX: -0.1 },
    // Bäume an den Fluss-Ufern
    { x: 1, y: 13, kind: 'pine' },
    { x: 2, y: 13, kind: 'tree', offsetX: 0.3 },
    { x: 14, y: 13, kind: 'pine', offsetX: 0.1 },
    { x: 15, y: 13, kind: 'tree' },
    { x: 16, y: 13, kind: 'pine', offsetX: -0.2 },
    // Sträucher zwischen Asphalt-Bezirken
    { x: 4, y: 6, kind: 'bush', offsetX: 0.2 },
    { x: 13, y: 6, kind: 'bush' },
    { x: 4, y: 11, kind: 'bush', offsetX: -0.1 },
    { x: 13, y: 11, kind: 'bush', offsetX: 0.2 },
    // Häuser auf den Schotter-Bezirken (Stadt-Effekt)
    { x: 6, y: 4, kind: 'house' },
    { x: 8, y: 4, kind: 'apartment', offsetX: 0.2 },
    { x: 6, y: 5, kind: 'cottage', offsetX: -0.2 },
    { x: 8, y: 5, kind: 'house', offsetX: 0.1 },
    { x: 12, y: 4, kind: 'apartment' },
    { x: 13, y: 4, kind: 'house', offsetX: 0.1 },
    { x: 12, y: 5, kind: 'cottage' },
    { x: 13, y: 5, kind: 'house', offsetX: -0.1 },
    // Häuser auf Schotter unten
    { x: 12, y: 9, kind: 'apartment', offsetX: 0.2 },
    { x: 14, y: 9, kind: 'house' },
    { x: 12, y: 10, kind: 'house', offsetX: -0.1 },
    { x: 14, y: 10, kind: 'cottage', offsetX: 0.2 },
  ];

  return {
    width: MAP_W,
    height: MAP_H,
    tiles,
    heights,
    biomes,
    eras,
    bridges,
    tunnels,
    slopes,
    decorations,
  };
}

export function buildMap(): TileType[][] {
  return buildWorld().tiles;
}

export const START_TILE = { x: 8, y: 2 }; // Auf der oberen Hauptstraße, Mitte
export const BASE_PIXELS_PER_MS = 0.25; // schneller — auto-drive sieht lebendiger aus
