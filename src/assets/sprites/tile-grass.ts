/**
 * Grass-Tile (Diamond, 64x32) — Cabinet-Iso.
 *
 * Gedaempftes Gruen mit ein paar Halmen + Variation (helle Specks).
 */

const COL = {
  outline: '#1f2e1a',
  grassDark: '#3a5a2a',
  grassMid: '#4a7a3a',
  grassLight: '#5e9248',
  blade: '#74a85a',
  bladeShadow: '#2a4220',
} as const;

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w = 1, h = 1): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function fillDiamond(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.fillStyle = color;
  for (let y = 0; y < 32; y++) {
    const dy = y < 16 ? y : 31 - y;
    const halfW = (dy + 1) * 2;
    const x = 32 - halfW;
    ctx.fillRect(x, y, halfW * 2, 1);
  }
}

export function createGrassTileSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Base
  fillDiamond(ctx, COL.grassMid);

  // Lighter band (upper-right, light source)
  for (let y = 2; y < 14; y++) {
    const dy = y;
    const halfW = (dy + 1) * 2;
    px(ctx, COL.grassLight, 32, y, halfW - 2, 1);
  }

  // Darker band (lower-left, shadow)
  for (let y = 18; y < 30; y++) {
    const dy = 31 - y;
    const halfW = (dy + 1) * 2;
    px(ctx, COL.grassDark, 32 - halfW + 2, y, halfW - 2, 1);
  }

  // Texture specks (small variations)
  const specks: Array<[number, number, string]> = [
    [20, 8, COL.grassDark],
    [38, 10, COL.grassLight],
    [28, 14, COL.grassDark],
    [46, 16, COL.grassLight],
    [16, 18, COL.grassDark],
    [34, 20, COL.grassLight],
    [42, 22, COL.grassDark],
    [24, 24, COL.grassLight],
    [30, 6, COL.grassDark],
    [44, 12, COL.grassDark],
  ];
  for (const [x, y, c] of specks) px(ctx, c, x, y);

  // Grass blades (small vertical 2px tufts with a shadow)
  const blades: Array<[number, number]> = [
    [22, 10], [36, 13], [27, 18], [44, 19], [18, 14], [40, 24],
  ];
  for (const [x, y] of blades) {
    px(ctx, COL.bladeShadow, x, y + 1);
    px(ctx, COL.blade, x, y);
    px(ctx, COL.blade, x + 1, y - 1);
  }

  // Diamond outline
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
