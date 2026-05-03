/**
 * Grass-Tile (Diamond, 64x32) — Cabinet-Iso.
 * Variante B: Subtile Variation in zwei Grüntönen, kein Outline (nahtlose Übergänge).
 */

const COL = {
  base: '#3a5a3a',
  variation: '#446644',
  highlight: '#4e764e',
  shadow: '#2e4a2e',
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

// Deterministic pseudo-random for reproducible texture
function seedRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function createGrassTileSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  fillDiamond(ctx, COL.base);

  // Subtile Variation: dezente helle/dunkle Pixel
  const r = seedRand(42);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 64; x++) {
      if (!inDiamond(x, y)) continue;
      const k = r();
      if (k < 0.12) px(ctx, COL.variation, x, y);
      else if (k < 0.18) px(ctx, COL.shadow, x, y);
      else if (k < 0.22) px(ctx, COL.highlight, x, y);
    }
  }

  return canvas;
}
