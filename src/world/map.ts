export const TILE_SIZE = 32;
export const MAP_W = 30;
export const MAP_H = 18;

export const TileType = {
  Asphalt: 'asphalt',
  Schotter: 'schotter',
  Feldweg: 'feldweg',
  Gras: 'gras',
} as const;
export type TileType = (typeof TileType)[keyof typeof TileType];

export type TileInfo = {
  name: string;
  color: number;
  edgeColor: number;
  speedMod: number;
};

export const TILE_INFO: Record<TileType, TileInfo> = {
  asphalt:  { name: 'Asphalt',  color: 0x4a4a52, edgeColor: 0x2a2a30, speedMod: 1.0  },
  schotter: { name: 'Schotter', color: 0x8a7a5e, edgeColor: 0x6a5a3e, speedMod: 0.55 },
  feldweg:  { name: 'Feldweg',  color: 0xa68a52, edgeColor: 0x866a32, speedMod: 0.30 },
  gras:     { name: 'Gras',     color: 0x2e4a2e, edgeColor: 0x1e3a1e, speedMod: 0    },
};

const ASCII_TO_TILE: Record<string, TileType> = {
  A: 'asphalt',
  s: 'schotter',
  f: 'feldweg',
  '.': 'gras',
};

const MAP_ASCII: string[] = [
  '..............................',
  '..AAAAAAAAAAAAAAAAAAAAA.......',
  '..A...................A.......',
  '..A..ssssssssssss.....A.......',
  '..A..s..........s.....A.......',
  '..A..s..fffffff.s.....AAAAAA..',
  '..A..s..f.....f.s..........A..',
  '..A..s..f.....f.s....sssss.A..',
  '..A..s..fffffff.s....s...s.A..',
  '..A..s..........s....s...s.A..',
  '..A..ssssssssssss....sssss.A..',
  '..A........................A..',
  '..A..AAAAAAAAAAAAAAAAAAAAAAA..',
  '..A..A........................',
  '..A..A........................',
  '..AAAA........................',
  '..............................',
  '..............................',
];

export function buildMap(): TileType[][] {
  return MAP_ASCII.map((row) =>
    row.split('').map((ch) => ASCII_TO_TILE[ch] ?? 'gras')
  );
}

export const START_TILE = { x: 5, y: 2 };
export const BASE_PIXELS_PER_MS = 0.15;
