/**
 * Sprite-Index — zentrale Re-Exports aller programmatisch erzeugten
 * Pixel-Art-Canvases fuer Cargora Phase 1 (Modern-Setting).
 *
 * Verwendung:
 *   import { createTruckSprite, SPRITE_KEYS } from '@/assets/sprites';
 *   const canvas = createTruckSprite();
 *   // -> Phaser z.B. via this.textures.addCanvas(SPRITE_KEYS.truck, canvas);
 */

export { createTruckSprite } from './truck.ts';
export { createAsphaltTileSprite } from './tile-asphalt.ts';
export { createGrassTileSprite } from './tile-grass.ts';
export { createSchotterTileSprite } from './tile-schotter.ts';
export { createFeldwegTileSprite } from './tile-feldweg.ts';
export { createWarehouseSprite } from './warehouse.ts';

/**
 * Recommended texture keys for Phaser registration.
 * Const-object pattern (no TS enums per code conventions).
 */
export const SPRITE_KEYS = {
  truck: 'sprite-truck',
  tileAsphalt: 'sprite-tile-asphalt',
  tileGrass: 'sprite-tile-grass',
  tileSchotter: 'sprite-tile-schotter',
  tileFeldweg: 'sprite-tile-feldweg',
  warehouse: 'sprite-warehouse',
} as const;

export type SpriteKey = (typeof SPRITE_KEYS)[keyof typeof SPRITE_KEYS];

/** Pixel dimensions of each sprite (width x height). */
export const SPRITE_DIMENSIONS = {
  truck: { width: 48, height: 48 },
  tileAsphalt: { width: 64, height: 32 },
  tileGrass: { width: 64, height: 32 },
  tileSchotter: { width: 64, height: 32 },
  tileFeldweg: { width: 64, height: 32 },
  warehouse: { width: 64, height: 96 },
} as const;
