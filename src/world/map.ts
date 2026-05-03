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
};

const ASCII_TO_TILE: Record<string, TileType> = {
  A: 'asphalt',
  s: 'schotter',
  f: 'feldweg',
  '.': 'gras',
};

// "Stadt-Block"-Layout — schmale Asphalt-Straßen (2 Tiles breit) bilden ein Straßennetz,
// Schotter-Quadrate sind Bezirke (Lager/Stadtviertel) zwischen den Straßen,
// Feldweg ist ein abgelegener Nebenpfad, Gras ist Map-Hintergrund.
// Map ist 18×14 → passt in den Game-Canvas, kein Overflow rechts.
const MAP_ASCII: string[] = [
  '..................', // 0  Gras-Rand
  '..................', // 1
  '..AAAAAAAAAAAAAA..', // 2  Hauptstraße (West-Ost) oben
  '..AAAAAAAAAAAAAA..', // 3
  '..AA..ssss..ss..AA', // 4  Lager links + Mini-Lager rechts, Asphalt-Verbindung außen
  '..AA..ssss..ss..AA', // 5
  '..AA..........AA..', // 6
  '..AAAAAAAAAAAAAA..', // 7  Querstraße
  '..AAAAAAAAAAAAAA..', // 8
  '..AA..fff...sss.AA', // 9  Feldweg-Bezirk + Lager-Bezirk
  '..AA..fff...sss.AA', // 10
  '..AA............AA', // 11
  '..AAAAAAAAAAAAAAAA', // 12 Hauptstraße unten
  '..................', // 13
];

export type WorldData = {
  width: number;
  height: number;
  tiles: TileType[][];
  heights: number[][];
  biomes: (BiomeType | null)[][];
  eras: (EraType | null)[][];
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
  // Kleiner Hügel unten Gras
  heights[13][7] = 1;
  heights[13][8] = 2;
  heights[13][9] = 2;
  heights[13][10] = 1;

  return {
    width: MAP_W,
    height: MAP_H,
    tiles,
    heights,
    biomes,
    eras,
  };
}

export function buildMap(): TileType[][] {
  return buildWorld().tiles;
}

export const START_TILE = { x: 8, y: 2 }; // Auf der oberen Hauptstraße, Mitte
export const BASE_PIXELS_PER_MS = 0.15;
