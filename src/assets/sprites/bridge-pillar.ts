/**
 * Brücken-Pfeiler-Sprite — vertikaler Stein-Pfosten unter Brücken-Tiles.
 *
 * Wird zwischen Boden-Tile-Höhe und Brücken-Höhe gerendert.
 * Standard-Pfeiler ist 6 Pixel breit, variabel in der Höhe.
 */

const COL = {
  stone: '#5a5048',
  stoneLight: '#7a6e64',
  stoneDark: '#2a221c',
  stoneEdge: '#1a1510',
} as const;

export function createBridgePillarSprite(pillarHeight: number): HTMLCanvasElement {
  const w = 8; // breiter, sichtbarer
  const h = pillarHeight + 4;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Vertikaler Pfosten
  ctx.fillStyle = COL.stone;
  ctx.fillRect(0, 0, w, pillarHeight);

  // Linke Kante (Schatten, dunkler)
  ctx.fillStyle = COL.stoneDark;
  ctx.fillRect(0, 0, 2, pillarHeight);

  // Rechte Kante (Highlight)
  ctx.fillStyle = COL.stoneLight;
  ctx.fillRect(w - 2, 0, 2, pillarHeight);

  // Stein-Fugen
  for (let y = 4; y < pillarHeight; y += 6) {
    ctx.fillStyle = COL.stoneEdge;
    ctx.fillRect(0, y, w, 1);
  }

  // Fußplatte (etwas breiter)
  ctx.fillStyle = COL.stoneDark;
  ctx.fillRect(-1, pillarHeight, w + 2, 3);
  ctx.fillStyle = COL.stoneEdge;
  ctx.fillRect(-1, pillarHeight + 3, w + 2, 1);

  return canvas;
}
