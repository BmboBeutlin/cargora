/**
 * Schotter-Tile (Diamond, 64x32) — Cabinet-Iso.
 * Variante B: mit Stein-Pixeln in mehreren Tönen, ohne Outline.
 */

const COL = {
  base: '#8a7a5e',
  stone1: '#a08068',
  stone2: '#6e5e44',
  stone3: '#beae8e',
  highlight: '#9a8a6e',
  shadow: '#6a5a3e',
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

export function createSchotterTileSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  fillDiamond(ctx, COL.base);

  // 3D-Hint: light band oben-rechts, shadow links-unten
  for (let y = 1; y < 14; y++) {
    const dy = y;
    const halfW = (dy + 1) * 2;
    ctx.fillStyle = COL.highlight;
    ctx.fillRect(32, y, halfW - 1, 1);
  }
  for (let y = 18; y < 31; y++) {
    const dy = 31 - y;
    const halfW = (dy + 1) * 2;
    ctx.fillStyle = COL.shadow;
    ctx.fillRect(32 - halfW + 1, y, halfW - 1, 1);
  }

  // Stein-Pixel verteilt
  const r = seedRand(33);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 64; x++) {
      if (!inDiamond(x, y)) continue;
      const k = r();
      if (k < 0.08) px(ctx, COL.stone1, x, y);
      else if (k < 0.13) px(ctx, COL.stone2, x, y);
      else if (k < 0.16) px(ctx, COL.stone3, x, y);
    }
  }

  return canvas;
}
