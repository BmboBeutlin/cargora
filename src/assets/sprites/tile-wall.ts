/**
 * Wand-Sprites für sichtbare Höhen-Übergänge zwischen Tiles in Cabinet-Iso.
 *
 * Wenn Tile A höher steht als Nachbar B, wird die "Seitenwand" zwischen
 * ihnen sichtbar. In Cabinet-Iso sind nur die zwei "vorderen" Wände sichtbar:
 *   - East-Wand: zur Welt-X+ Richtung (rechts-unten am Bildschirm)
 *   - South-Wand: zur Welt-Y+ Richtung (links-unten am Bildschirm)
 *
 * Beide werden gerendert je nach Höhendifferenz.
 */

const COL = {
  earth: '#5a4530',
  earthDark: '#3a2a1a',
  earthLight: '#7a5e40',
  earthMid: '#6a5238',
} as const;

const HEIGHT_PIXELS = 8;
const TILE_W = 64;
const TILE_H = 32;

// East-Wand: zwischen Tile (x,y) und Nachbar (x+1,y).
// Diese Wand verläuft auf der rechts-unteren Diamond-Kante des höheren Tiles.
// Iso-Slope: 1:-2 (von links-oben nach rechts-unten der Edge)
//
// Sprite-Größe: TILE_W/2 = 32 px breit, plus heightDiff*HEIGHT_PIXELS in Wand-Höhe,
// plus TILE_H/2 = 16 für die Iso-Slope-Verzerrung.
export function createEastWallSprite(heightDiff: number): HTMLCanvasElement {
  const wallH = heightDiff * HEIGHT_PIXELS;
  const w = TILE_W / 2; // 32
  const h = wallH + TILE_H / 2 + 1; // 16 + wall

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // East-Wand-Geometrie:
  // Top-Edge geht von (0, 16) nach (32, 0) — die rechts-untere Diamond-Edge
  // Wand erstreckt sich nach unten um wallH Pixel
  for (let x = 0; x < w; x++) {
    const topY = Math.floor((w - 1 - x) / 2); // top edge slope: rechts geht hoch
    for (let dy = 0; dy < wallH; dy++) {
      const y = topY + dy;
      // Schattierung: oben hell, unten dunkel (Licht von oben)
      let color: string = COL.earth;
      if (dy < 2) color = COL.earthLight;
      else if (dy < wallH / 3) color = COL.earthMid;
      else if (dy >= wallH - 2) color = COL.earthDark;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
    // Vertikale Variation für Erd-Look
    if ((x * 7 + 3) % 11 < 2) {
      const yMid = topY + Math.floor(wallH / 2);
      ctx.fillStyle = COL.earthDark;
      ctx.fillRect(x, yMid, 1, 1);
    }
  }

  return canvas;
}

// South-Wand: zwischen Tile (x,y) und Nachbar (x,y+1).
// Diese Wand verläuft auf der links-unteren Diamond-Kante des höheren Tiles.
// Iso-Slope: -1:-2 (Spiegel von East)
export function createSouthWallSprite(heightDiff: number): HTMLCanvasElement {
  const wallH = heightDiff * HEIGHT_PIXELS;
  const w = TILE_W / 2;
  const h = wallH + TILE_H / 2 + 1;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  for (let x = 0; x < w; x++) {
    const topY = Math.floor(x / 2); // top edge slope: rechts geht runter
    for (let dy = 0; dy < wallH; dy++) {
      const y = topY + dy;
      // S-Wand ist im Schatten (von Licht abgewandt) → dunkler
      let color: string = COL.earthMid;
      if (dy < 2) color = COL.earth;
      else if (dy >= wallH - 2) color = COL.earthDark;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
    if ((x * 5 + 7) % 13 < 2) {
      const yMid = topY + Math.floor(wallH / 2);
      ctx.fillStyle = COL.earthDark;
      ctx.fillRect(x, yMid, 1, 1);
    }
  }

  return canvas;
}
