// World data model for Cargora.
// Phase 1: Single-Era (Modern). Era-Progression structurally prepared but not yet active.

export const TILE_SIZE = 32;
export const MAP_W = 30;
export const MAP_H = 22;

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

// Productive Phase-1 map: small modern industrial district.
// - Outer Asphalt-Ring as main highway
// - Two inner districts: warehouse zone (Schotter) and rural connector (Feldweg)
// - Wide grass surroundings for future Berge/Wasser/Wald-Erweiterung
const MAP_ASCII: string[] = [
  '..............................', // 0
  '..AAAAAAAAAAAAAAAAAAAAAAAA....', // 1  — Hauptstraße West-Ost (oben)
  '..A......................A....', // 2
  '..A..ssssss......ssssss..A....', // 3  — Lagerbezirk West + Ost
  '..A..s....s......s....s..A....', // 4
  '..A..s....s......s....s..A....', // 5
  '..A..ssssss......ssssss..A....', // 6
  '..A......................A....', // 7
  '..A...AAAAAAAAAAAAAAAA...A....', // 8  — Querstraße
  '..A...A..............A...A....', // 9
  '..A...A..ffffffffff..A...A....', // 10 — Feldweg-Innenhof
  '..A...A..f........f..A...A....', // 11
  '..A...A..f........f..A...A....', // 12
  '..A...A..ffffffffff..A...A....', // 13
  '..A...A..............A...A....', // 14
  '..A...AAAAAAAAAAAAAAAA...A....', // 15
  '..A......................A....', // 16
  '..A......................A....', // 17
  '..AAAAAAAAAAAAAAAAAAAAAAAA....', // 18 — Hauptstraße West-Ost (unten)
  '..............................', // 19
  '..............................', // 20
  '..............................', // 21
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

export const START_TILE = { x: 6, y: 4 };
export const BASE_PIXELS_PER_MS = 0.15;
