/**
 * Schotter-Tile (Diamond, 64x32) — Cabinet-Iso.
 *
 * Beige-Braune Basis mit kleinen Stein-Pixeln in mehreren Toenen.
 */

const COL = {
  outline: '#3a2e1e',
  baseDark: '#6a5238',
  baseMid: '#856a48',
  baseLight: '#a08458',
  stone1: '#bfa07a',
  stone2: '#5a4530',
  stone3: '#d6c094',
  stone4: '#8a7050',
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

export function createSchotterTileSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Base
  fillDiamond(ctx, COL.baseMid);

  // Lighter upper-right
  for (let y = 2; y < 14; y++) {
    const dy = y;
    const halfW = (dy + 1) * 2;
    px(ctx, COL.baseLight, 32, y, halfW - 2, 1);
  }
  // Darker lower-left
  for (let y = 18; y < 30; y++) {
    const dy = 31 - y;
    const halfW = (dy + 1) * 2;
    px(ctx, COL.baseDark, 32 - halfW + 2, y, halfW - 2, 1);
  }

  // Lots of small stones (deterministic pattern, scattered)
  const stones: Array<[number, number, string, number]> = [
    [16, 14, COL.stone1, 2], [22, 8, COL.stone2, 1], [28, 12, COL.stone3, 2],
    [34, 6, COL.stone1, 1], [40, 10, COL.stone2, 2], [46, 14, COL.stone3, 1],
    [18, 20, COL.stone2, 2], [24, 18, COL.stone1, 1], [30, 22, COL.stone3, 2],
    [36, 20, COL.stone4, 1], [42, 22, COL.stone1, 2], [44, 18, COL.stone2, 1],
    [20, 12, COL.stone4, 1], [26, 14, COL.stone1, 1], [32, 18, COL.stone2, 1],
    [38, 14, COL.stone3, 1], [12, 16, COL.stone4, 1], [50, 16, COL.stone3, 1],
    [25, 24, COL.stone4, 1], [33, 26, COL.stone2, 1], [29, 4, COL.stone4, 1],
    [37, 24, COL.stone1, 1], [21, 22, COL.stone3, 1], [43, 8, COL.stone4, 1],
  ];
  for (const [x, y, c, s] of stones) {
    px(ctx, c, x, y, s, s);
    if (s > 1) px(ctx, COL.outline, x, y + s); // tiny shadow under bigger stones
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
