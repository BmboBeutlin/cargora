// World data model for Cargora.
// Phase 1: Single-Era (Modern). Era-Progression structurally prepared but not yet active.

export const TILE_SIZE = 32;
export const MAP_W = 30;
export const MAP_H = 16;

// Tile types — visual + speed properties.
export const TileType = {
  Asphalt: 'asphalt',
  Schotter: 'schotter',
  Feldweg: 'feldweg',
  Gras: 'gras',
} as const;
export type TileType = (typeof TileType)[keyof typeof TileType];

// Era system — prepared for Phase 4+, currently not used in gameplay.
// Tiles default to no era tag. When era progression activates, the map editor
// will assign era tags per tile (e.g. "this district stays medieval, that one industrializes").
export const EraType = {
  Medieval: 'medieval',
  EarlyModern: 'early_modern',
  Industrial: 'industrial',
  Modern: 'modern',
  SciFi: 'scifi',
} as const;
export type EraType = (typeof EraType)[keyof typeof EraType];

// Biome system — prepared for Phase 1.5+, currently all tiles are "temperate" by default.
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

// Productive Phase-1 map: a coherent paved area with material variation.
// EVERYTHING in the inner area is drivable. Only the outer 2-tile gras-frame is impassable.
// Material patches (schotter, feldweg) are inside the asphalt platform — different speed modifiers,
// but all reachable. This makes the map a sandbox where the player can drive anywhere.
const MAP_ASCII: string[] = [
  '..............................', // 0  Gras-Rand
  '..AAAAAAAAAAAAAAAAAAAAAAAAAA..', // 1  Asphalt-Plattform start
  '..AAAAAAAAAAAAAAAAAAAAAAAAAA..', // 2
  '..AAssssssAAAAAAAAAAffffffAA..', // 3  Schotter-Lager links + Feldweg rechts
  '..AAssssssAAAAAAAAAAffffffAA..', // 4
  '..AAssssssAAAAAAAAAAffffffAA..', // 5
  '..AAssssssAAAAAAAAAAffffffAA..', // 6
  '..AAAAAAAAAAAAAAAAAAAAAAAAAA..', // 7  Querverbindung Asphalt
  '..AAAAAAAAAAAAAAAAAAAAAAAAAA..', // 8
  '..AAAAAAAAffffffAAssssssAAAA..', // 9  Feldweg links + Schotter rechts
  '..AAAAAAAAffffffAAssssssAAAA..', // 10
  '..AAAAAAAAffffffAAssssssAAAA..', // 11
  '..AAAAAAAAAAAAAAAAAAAAAAAAAA..', // 12
  '..AAAAAAAAAAAAAAAAAAAAAAAAAA..', // 13 Asphalt-Plattform end
  '..............................', // 14 Gras-Rand
  '..............................', // 15
];

// World data — central data structure that scales for future features.
export type WorldData = {
  width: number;
  height: number;
  tiles: TileType[][];
  heights: number[][];           // 0 = Meereshöhe, default everywhere
  biomes: (BiomeType | null)[][];// null = default biome
  eras: (EraType | null)[][];    // null = no era assignment
};

export function buildWorld(): WorldData {
  const tiles = MAP_ASCII.map((row) =>
    row.split('').map((ch) => ASCII_TO_TILE[ch] ?? 'gras')
  );
  const heights = Array.from({ length: MAP_H }, () => new Array(MAP_W).fill(0));
  const biomes = Array.from({ length: MAP_H }, () => new Array(MAP_W).fill(null));
  const eras = Array.from({ length: MAP_H }, () => new Array(MAP_W).fill(null));
  return {
    width: MAP_W,
    height: MAP_H,
    tiles,
    heights,
    biomes,
    eras,
  };
}

// Backwards-compatible export for scenes that just want tiles.
export function buildMap(): TileType[][] {
  return buildWorld().tiles;
}

export const START_TILE = { x: 14, y: 7 }; // Mitte der Asphalt-Plattform, sicher befahrbar
export const BASE_PIXELS_PER_MS = 0.15;
