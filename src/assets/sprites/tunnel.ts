/**
 * Tunnel-Eingangs-Sprite — Cabinet-Iso.
 *
 * Erscheint als dunkler Bogen in einem Berg-Hang. 4 Richtungen (N/E/S/W).
 * Wird auf einer Asphalt-Tile gerendert, der "in den Berg führt".
 */

const COL = {
  archStone: '#4a4238',
  archStoneDark: '#2a2218',
  archStoneLight: '#6a6248',
  tunnelDark: '#0a0805',
  tunnelMid: '#181410',
  road: '#2a2a32',
  roadLine: '#7a7a52',
} as const;

function rect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Tunnel-Eingang Richtung E (Welt X+, Bildschirm rechts-unten)
// Größe: 32x32, Anchor (0.5, 1) = bottom-center auf der Tile
export function createTunnelEastSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 28;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Stein-Bogen außen
  rect(ctx, COL.archStone, 8, 4, 16, 22);
  // Innenseite Bogen (links Schatten)
  rect(ctx, COL.archStoneDark, 8, 4, 2, 22);
  // Highlights rechts
  rect(ctx, COL.archStoneLight, 22, 4, 2, 22);
  // Top edge dunkler
  rect(ctx, COL.archStoneDark, 8, 4, 16, 1);

  // Tunnel-Loch (dunkle Öffnung)
  rect(ctx, COL.tunnelDark, 11, 8, 10, 14);
  // Loch-Innen-Schatten
  rect(ctx, COL.tunnelMid, 11, 8, 2, 14);
  rect(ctx, COL.tunnelMid, 19, 8, 2, 14);
  rect(ctx, COL.tunnelMid, 11, 8, 10, 2);

  // Stein-Pixel-Variation
  for (let y = 4; y < 26; y += 4) {
    rect(ctx, COL.archStoneDark, 8, y, 16, 1);
  }

  // Straße in den Tunnel rein (kleine Andeutung)
  rect(ctx, COL.road, 13, 22, 6, 4);
  rect(ctx, COL.roadLine, 15, 23, 2, 1);
  rect(ctx, COL.roadLine, 15, 25, 2, 1);

  return canvas;
}

// Spiegel-Variante für andere Richtungen — könnten wir später machen.
// Für jetzt nur East-Richtung als Demo.
