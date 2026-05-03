/**
 * Asphalt-Tile (Diamond, 64x32) — Cabinet-Iso.
 *
 * Dezente Spurrillen entlang der Diagonalen, Standard-Grau.
 */

const COL = {
  outline: '#1a1d22',
  asphaltDark: '#2a2e34',
  asphaltMid: '#363b42',
  asphaltLight: '#454a52',
  rut: '#22262c',
  speck: '#5a5f68',
} as const;

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w = 1, h = 1): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/** Fill a 64x32 diamond row-by-row with `color`. */
function fillDiamond(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.fillStyle = color;
  for (let y = 0; y < 32; y++) {
    const dy = y < 16 ? y : 31 - y;
    const halfW = (dy + 1) * 2;
    const x = 32 - halfW;
    ctx.fillRect(x, y, halfW * 2, 1);
  }
}

export function createAsphaltTileSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Base
  fillDiamond(ctx, COL.asphaltMid);

  // Slight light area (upper-right half receives light)
  for (let y = 0; y < 16; y++) {
    const dy = y;
    const halfW = (dy + 1) * 2;
    const x = 32; // right half only
    px(ctx, COL.asphaltLight, x, y, halfW, 1);
  }

  // Slight dark area (lower-left half = shadow)
  for (let y = 16; y < 32; y++) {
    const dy = 31 - y;
    const halfW = (dy + 1) * 2;
    const x = 32 - halfW * 2;
    px(ctx, COL.asphaltDark, x, y, halfW, 1);
  }

  // Tire ruts: two parallel dotted lines along the long diagonal (NE direction)
  // Rut 1 (upper)
  for (let i = 0; i < 28; i++) {
    const rx = 4 + i * 2;
    const ry = 14 - Math.floor(i / 2);
    if (ry >= 2 && ry < 30) px(ctx, COL.rut, rx, ry);
  }
  // Rut 2 (lower)
  for (let i = 0; i < 28; i++) {
    const rx = 4 + i * 2;
    const ry = 18 - Math.floor(i / 2);
    if (ry >= 2 && ry < 30) px(ctx, COL.rut, rx, ry);
  }

  // Specks (small lighter pixels = aggregate)
  const specks: Array<[number, number]> = [
    [22, 6], [40, 8], [28, 12], [44, 14], [16, 16],
    [36, 18], [50, 20], [24, 22], [42, 24], [30, 26],
  ];
  for (const [x, y] of specks) px(ctx, COL.speck, x, y);

  // Diamond outline (1px crisp edge)
  for (let y = 0; y < 16; y++) {
    const dy = y;
    const halfW = (dy + 1) * 2;
    px(ctx, COL.outline, 32 - halfW, y);
    px(ctx, COL.outline, 32 + halfW - 1, y);
  }
  for (let y = 16; y < 32; y++) {
    const dy = 31 - y;
    const halfW = (dy + 1) * 2;
    px(ctx, COL.outline, 32 - halfW, y);
    px(ctx, COL.outline, 32 + halfW - 1, y);
  }

  return canvas;
}
