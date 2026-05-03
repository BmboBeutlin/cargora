/**
 * Feldweg-Tile (Diamond, 64x32) — Cabinet-Iso.
 * Variante C: Matschig dunkel mit Pfützen-Pixeln, ohne Outline.
 */

const COL = {
  base: '#7e6840',
  variation: '#8e7a4a',
  puddle: '#5a4a30',
  highlight: '#9a8650',
  shadow: '#5a4830',
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

export function createFeldwegTileSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  fillDiamond(ctx, COL.base);

  // Variation + Pfützen-Pixel
  const r = seedRand(13);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 64; x++) {
      if (!inDiamond(x, y)) continue;
      const k = r();
      if (k < 0.06) px(ctx, COL.puddle, x, y);
      else if (k < 0.18) px(ctx, COL.variation, x, y);
      else if (k < 0.22) px(ctx, COL.shadow, x, y);
    }
  }

  // Größere Pfütze in der Mitte (matschiger Eindruck)
  const puddle: Array<[number, number]> = [
    [28, 14], [29, 14], [30, 14], [31, 14], [32, 14],
    [27, 15], [28, 15], [33, 15], [34, 15],
    [29, 16], [32, 16],
  ];
  for (const [x, y] of puddle) px(ctx, COL.puddle, x, y);

  // Light band oben-rechts
  for (let y = 2; y < 14; y++) {
    const dy = y;
    const halfW = (dy + 1) * 2;
    ctx.fillStyle = COL.highlight;
    ctx.fillRect(32, y, halfW - 1, 1);
  }

  return canvas;
}
