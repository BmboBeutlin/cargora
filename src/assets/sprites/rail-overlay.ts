/**
 * Schienen-Auto-Tiling-Sprites (Diamond, 64x32) — wie Asphalt aber als Schienen.
 * 16 Varianten basierend auf Welt-Nachbarn (N, E, S, W).
 */

export type RailConnections = { N: boolean; E: boolean; S: boolean; W: boolean };

const COL = {
  grass: '#3a5a3a',
  grassVar: '#446644',
  ballast: '#5a4838', // Schotter unter Schienen
  ballastDark: '#3a2818',
  sleeper: '#3a2010', // Schwellen
  sleeperDark: '#1a0a04',
  rail: '#9a8a7a', // Eisen-Schienen
  railDark: '#5a4838',
  railLight: '#cabaaa',
} as const;

function inDiamond(x: number, y: number): boolean {
  const dx = Math.abs(x - 31.5) / 32;
  const dy = Math.abs(y - 15.5) / 16;
  return dx + dy <= 1;
}

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number): void {
  if (x < 0 || y < 0 || x >= 64 || y >= 32) return;
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
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function drawGrassBase(ctx: CanvasRenderingContext2D): void {
  fillDiamond(ctx, COL.grass);
  const r = seedRand(42);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 64; x++) {
      if (!inDiamond(x, y)) continue;
      if (r() < 0.12) px(ctx, COL.grassVar, x, y);
    }
  }
}

// Schienen-Streifen vom Tile-Center zu einer Edge-Mitte.
// 2 parallele Schienen + Schwellen quer dazu + Schotter-Bett darunter.
function drawRailStripe(
  ctx: CanvasRenderingContext2D,
  dirScreenX: 1 | -1,
  dirScreenY: 1 | -1,
): void {
  const length = 18;
  // 1. Ballast (Schotter-Bett)
  for (let i = 0; i <= length; i++) {
    const xMid = 32 + dirScreenX * i;
    const yMid = 16 + dirScreenY * (i * 0.5);
    for (let dy = -5; dy <= 5; dy++) {
      const y = Math.round(yMid + dy);
      const x = Math.round(xMid);
      if (!inDiamond(x, y)) continue;
      if (Math.abs(dy) >= 5) px(ctx, COL.ballastDark, x, y);
      else px(ctx, COL.ballast, x, y);
    }
  }
  // 2. Schwellen quer (alle 4 Pixel)
  for (let i = 2; i <= length; i += 4) {
    const xMid = 32 + dirScreenX * i;
    const yMid = 16 + dirScreenY * (i * 0.5);
    for (let dy = -4; dy <= 4; dy++) {
      const y = Math.round(yMid + dy);
      const x = Math.round(xMid);
      if (!inDiamond(x, y)) continue;
      if (Math.abs(dy) === 4) px(ctx, COL.sleeperDark, x, y);
      else px(ctx, COL.sleeper, x, y);
    }
  }
  // 3. Zwei Schienen (parallel)
  for (let i = 0; i <= length; i++) {
    const xMid = 32 + dirScreenX * i;
    const yMid = 16 + dirScreenY * (i * 0.5);
    // Schiene oben (-2 dy)
    {
      const y = Math.round(yMid - 2);
      const x = Math.round(xMid);
      if (inDiamond(x, y)) px(ctx, COL.rail, x, y);
    }
    // Schiene unten (+2 dy)
    {
      const y = Math.round(yMid + 2);
      const x = Math.round(xMid);
      if (inDiamond(x, y)) px(ctx, COL.rail, x, y);
    }
  }
}

function drawCenterPad(ctx: CanvasRenderingContext2D): void {
  for (let dy = -5; dy <= 5; dy++) {
    for (let dx = -8; dx <= 8; dx++) {
      const x = 32 + dx;
      const y = 16 + dy;
      if (!inDiamond(x, y)) continue;
      const dist = Math.abs(dx) / 8 + Math.abs(dy) / 5;
      if (dist > 1.0) continue;
      px(ctx, COL.ballast, x, y);
    }
  }
}

export function createRailOverlaySprite(c: RailConnections): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  drawGrassBase(ctx);
  drawCenterPad(ctx);

  if (c.N) drawRailStripe(ctx, +1, -1);
  if (c.E) drawRailStripe(ctx, +1, +1);
  if (c.S) drawRailStripe(ctx, -1, +1);
  if (c.W) drawRailStripe(ctx, -1, -1);

  return canvas;
}

export function railConnectionsKey(c: RailConnections): string {
  return `${c.N ? '1' : '0'}${c.E ? '1' : '0'}${c.S ? '1' : '0'}${c.W ? '1' : '0'}`;
}

export function parseRailConnectionsKey(key: string): RailConnections {
  return { N: key[0] === '1', E: key[1] === '1', S: key[2] === '1', W: key[3] === '1' };
}
