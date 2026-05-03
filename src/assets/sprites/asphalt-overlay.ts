/**
 * Asphalt-Auto-Tiling-Sprites (Diamond, 64x32) — OpenTTD-Stil.
 *
 * Pro Asphalt-Tile wird basierend auf den 4 Welt-Nachbarn (N, E, S, W)
 * ein passender Sprite gewählt: gerade Strecken, Kurven, T-Kreuzungen,
 * X-Kreuzung, Endpunkte, isoliert.
 *
 * 16 Varianten total (2^4 Nachbar-Kombinationen).
 *
 * Welt-Richtung → Bildschirm-Slope:
 *   N (Y-) = rechts-oben   → Slope (+1, -0.5)
 *   E (X+) = rechts-unten  → Slope (+1, +0.5)
 *   S (Y+) = links-unten   → Slope (-1, +0.5)
 *   W (X-) = links-oben    → Slope (-1, -0.5)
 */

export type Connections = { N: boolean; E: boolean; S: boolean; W: boolean };

const COL = {
  grass: '#3a5a3a',
  grassVar: '#446644',
  asphalt: '#3a3a42',
  asphaltDark: '#2a2a32',
  asphaltLight: '#48484f',
  asphaltLine: '#9a9a52', // gelblicher Mittelstreifen
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

// Asphalt-Streifen vom Tile-Center (32, 16) zu einer Edge-Mitte.
// dirX/dirY = Bildschirm-Direction (+1 nach rechts, +1 nach unten).
// Welt-Math: Bei Iso ist 1 Welt-Step in X-Achse = (+32 px, +16 px) Bildschirm,
// d.h. Slope 1:2 für E (Welt X+).
//
// Streifen ist 8 Pixel breit (orthogonal zur Bewegungsrichtung im Iso-Raum).
function drawStripe(
  ctx: CanvasRenderingContext2D,
  dirScreenX: 1 | -1,
  dirScreenY: 1 | -1,
  withCenterLine: boolean,
): void {
  // Streifen läuft vom Center (32, 16) nach (32 + dirScreenX*16, 16 + dirScreenY*8)
  // Slope: dy/dx = dirScreenY * 0.5 / dirScreenX
  // Streifen-Breite: orthogonale Richtung
  const length = 17;
  for (let i = 0; i <= length; i++) {
    const xMid = 32 + dirScreenX * i;
    const yMid = 16 + dirScreenY * (i * 0.5);
    // Streifen orthogonal zum Slope
    // Für Slope (1, 0.5): Orthogonale ist ungefähr (-0.5, 1) normiert
    // Pragmatisch: vertikaler Streifen (4 Pixel oben/unten)
    for (let dy = -4; dy <= 4; dy++) {
      const y = Math.round(yMid + dy);
      const x = Math.round(xMid);
      // Diamond-Edge respect: nur innerhalb Diamond
      if (!inDiamond(x, y)) continue;
      // Schatten am Rand, hell in Mitte
      if (Math.abs(dy) === 4) px(ctx, COL.asphaltDark, x, y);
      else if (Math.abs(dy) >= 3) px(ctx, COL.asphalt, x, y);
      else if (Math.abs(dy) <= 1) px(ctx, COL.asphaltLight, x, y);
      else px(ctx, COL.asphalt, x, y);
    }
  }

  if (withCenterLine) {
    // Mittelstreifen: gestrichelt, 1 Pixel
    for (let i = 4; i <= length; i += 4) {
      const xMid = 32 + dirScreenX * i;
      const yMid = 16 + dirScreenY * (i * 0.5);
      const x = Math.round(xMid);
      const y = Math.round(yMid);
      if (inDiamond(x, y)) px(ctx, COL.asphaltLine, x, y);
    }
  }
}

// Center-Pad: kreisförmiger Asphalt-Spot in der Tile-Mitte
function drawCenterPad(ctx: CanvasRenderingContext2D): void {
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -5; dx <= 5; dx++) {
      const x = 32 + dx;
      const y = 16 + dy;
      if (!inDiamond(x, y)) continue;
      const dist = Math.abs(dx) / 5 + Math.abs(dy) / 3;
      if (dist > 1.0) continue;
      if (dist > 0.85) px(ctx, COL.asphaltDark, x, y);
      else if (dist < 0.4) px(ctx, COL.asphaltLight, x, y);
      else px(ctx, COL.asphalt, x, y);
    }
  }
}

export function createAsphaltOverlaySprite(c: Connections): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  drawGrassBase(ctx);
  drawCenterPad(ctx);

  // Welt-Direction → Bildschirm-Slope:
  // N (Y-): Bildschirm rechts-oben (dirX=+1, dirY=-1)
  // E (X+): Bildschirm rechts-unten (dirX=+1, dirY=+1)
  // S (Y+): Bildschirm links-unten  (dirX=-1, dirY=+1)
  // W (X-): Bildschirm links-oben   (dirX=-1, dirY=-1)
  //
  // Mittelstreifen IMMER pro Verbindung (auch in Kurven/T/X) → konsistente Optik.
  if (c.N) drawStripe(ctx, +1, -1, true);
  if (c.E) drawStripe(ctx, +1, +1, true);
  if (c.S) drawStripe(ctx, -1, +1, true);
  if (c.W) drawStripe(ctx, -1, -1, true);

  return canvas;
}

// Schlüssel-String für eine Verbindungs-Maske (z.B. "1010" = N+S, gerade NS)
export function connectionsKey(c: Connections): string {
  return `${c.N ? '1' : '0'}${c.E ? '1' : '0'}${c.S ? '1' : '0'}${c.W ? '1' : '0'}`;
}

export function parseConnectionsKey(key: string): Connections {
  return {
    N: key[0] === '1',
    E: key[1] === '1',
    S: key[2] === '1',
    W: key[3] === '1',
  };
}

export const ALL_CONNECTION_KEYS: ReadonlyArray<string> = (() => {
  const keys: string[] = [];
  for (let i = 0; i < 16; i++) {
    keys.push(i.toString(2).padStart(4, '0'));
  }
  return keys;
})();
