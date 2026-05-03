/**
 * Asphalt-Tile (Diamond, 64x32) — Cabinet-Iso.
 * Variante A: Einheitlich glatt, ohne Outline (nahtlose Übergänge).
 */

const COL = {
  base: '#3a3a42',
  highlight: '#42424a',
  shadow: '#32323a',
} as const;

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

  fillDiamond(ctx, COL.base);

  // Sehr dezente Light/Shadow-Bands
  for (let y = 0; y < 16; y++) {
    const dy = y;
    const halfW = (dy + 1) * 2;
    ctx.fillStyle = COL.highlight;
    ctx.fillRect(32, y, halfW - 1, 1);
  }
  for (let y = 16; y < 32; y++) {
    const dy = 31 - y;
    const halfW = (dy + 1) * 2;
    ctx.fillStyle = COL.shadow;
    ctx.fillRect(32 - halfW + 1, y, halfW - 1, 1);
  }

  return canvas;
}
