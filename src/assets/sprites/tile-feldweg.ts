/**
 * Feldweg-Tile (Diamond, 64x32) — Cabinet-Iso.
 *
 * Sandiger Erdweg mit Reifenspuren-Hint, weicher als Schotter.
 */

const COL = {
  outline: '#3a2e1e',
  sandDark: '#7a6240',
  sandMid: '#9a7e54',
  sandLight: '#b89a6e',
  rut: '#5a4528',
  rutEdge: '#6a5230',
  speck: '#c8b088',
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

export function createFeldwegTileSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Base
  fillDiamond(ctx, COL.sandMid);

  // Light band upper-right
  for (let y = 2; y < 14; y++) {
    const dy = y;
    const halfW = (dy + 1) * 2;
    px(ctx, COL.sandLight, 32, y, halfW - 2, 1);
  }
  // Dark band lower-left
  for (let y = 18; y < 30; y++) {
    const dy = 31 - y;
    const halfW = (dy + 1) * 2;
    px(ctx, COL.sandDark, 32 - halfW + 2, y, halfW - 2, 1);
  }

  // Two soft tire ruts (continuous, slightly faded)
  // Rut 1
  for (let i = 0; i < 28; i++) {
    const rx = 4 + i * 2;
    const ry = 13 - Math.floor(i / 2);
    if (ry >= 2 && ry < 30) {
      px(ctx, COL.rutEdge, rx, ry - 1);
      px(ctx, COL.rut, rx, ry);
      px(ctx, COL.rut, rx + 1, ry);
    }
  }
  // Rut 2
  for (let i = 0; i < 28; i++) {
    const rx = 4 + i * 2;
    const ry = 19 - Math.floor(i / 2);
    if (ry >= 2 && ry < 30) {
      px(ctx, COL.rutEdge, rx, ry - 1);
      px(ctx, COL.rut, rx, ry);
      px(ctx, COL.rut, rx + 1, ry);
    }
  }

  // Lighter sand specks
  const specks: Array<[number, number]> = [
    [22, 6], [40, 8], [44, 14], [16, 16],
    [50, 20], [24, 22], [42, 24], [30, 26],
    [18, 12], [36, 18],
  ];
  for (const [x, y] of specks) px(ctx, COL.speck, x, y);

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
