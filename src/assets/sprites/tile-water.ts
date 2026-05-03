/**
 * Wasser-Tile (Diamond, 64x32) — Cabinet-Iso.
 * Blau-Töne mit subtilen Wellen-Pixeln.
 */

const COL = {
  base: '#3a5a8e',
  highlight: '#5a7aae',
  shadow: '#2a4a7e',
  wave: '#7a9ace',
} as const;

function inDiamond(x: number, y: number): boolean {
  const dx = Math.abs(x - 31.5) / 32;
  const dy = Math.abs(y - 15.5) / 16;
  return dx + dy <= 1;
}

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number): void {
  if (!inDiamond(x, y)) return;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
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

function seedRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function createWaterTileSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  fillDiamond(ctx, COL.base);

  // Reflektion oben rechts (Sonne)
  for (let y = 1; y < 14; y++) {
    const dy = y;
    const halfW = (dy + 1) * 2;
    ctx.fillStyle = COL.highlight;
    ctx.fillRect(32, y, Math.min(halfW - 1, 8), 1);
  }

  // Wellen-Pixel verstreut
  const r = seedRand(99);
  const waves: Array<[number, number]> = [
    [20, 8], [30, 6], [40, 10], [50, 14],
    [16, 14], [26, 18], [36, 20], [46, 22],
    [22, 22], [32, 24], [42, 24],
  ];
  for (const [x, y] of waves) {
    px(ctx, COL.wave, x, y);
    if (r() > 0.5) px(ctx, COL.wave, x + 1, y);
  }

  // Schatten unten links
  for (let y = 18; y < 31; y++) {
    const dy = 31 - y;
    const halfW = (dy + 1) * 2;
    ctx.fillStyle = COL.shadow;
    ctx.fillRect(32 - halfW + 1, y, Math.min(halfW - 1, 6), 1);
  }

  return canvas;
}
