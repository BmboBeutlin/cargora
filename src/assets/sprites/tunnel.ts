/**
 * Tunnel-Eingangs-Sprite — Cabinet-Iso, größer und deutlicher.
 */

const COL = {
  archStone: '#5a4d40',
  archStoneDark: '#2a221a',
  archStoneLight: '#7a6e5e',
  archMortar: '#3a3024',
  tunnelDark: '#050402',
  tunnelMid: '#181410',
  tunnelEdge: '#0a0805',
  road: '#3a3a42',
  roadLine: '#9a9a52',
} as const;

function rect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Tunnel-Eingang: 48×42 Pixel, mit großem Bogen + Stein-Quadern + tiefem Loch
export function createTunnelEastSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 42;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Stein-Bogen-Wand (ganzer Block)
  rect(ctx, COL.archStone, 6, 4, 36, 36);

  // Bogen-Innen-Schatten (links, dunkler)
  rect(ctx, COL.archStoneDark, 6, 4, 4, 36);
  // Bogen-Highlight (rechts, heller)
  rect(ctx, COL.archStoneLight, 38, 4, 4, 36);
  // Top edge dunkler
  rect(ctx, COL.archStoneDark, 6, 4, 36, 2);

  // Stein-Quader (Mörtel-Linien horizontal alle 6 px)
  for (let y = 8; y < 40; y += 6) {
    rect(ctx, COL.archMortar, 6, y, 36, 1);
  }
  // Stein-Quader vertikal — versetzt pro Reihe
  for (let row = 0; row < 6; row++) {
    const yStart = 4 + row * 6;
    const offset = row % 2 === 0 ? 0 : 6;
    for (let x = 6 + offset; x < 42; x += 12) {
      rect(ctx, COL.archMortar, x, yStart, 1, 6);
    }
  }

  // Tunnel-Loch (großer dunkler Bogen in der Mitte)
  // Bogen-Form: gerundetes Rechteck mit halbkreisförmiger Oberseite
  for (let y = 12; y < 36; y++) {
    let leftX = 16;
    let rightX = 32;
    if (y < 18) {
      // Halbkreis-Oberseite
      const dy = 18 - y;
      const r = Math.sqrt(36 - dy * dy);
      leftX = Math.round(24 - r);
      rightX = Math.round(24 + r);
    }
    rect(ctx, COL.tunnelDark, leftX, y, rightX - leftX, 1);
    // Loch-Innen-Schatten (links 1px, oben 1px)
    rect(ctx, COL.tunnelEdge, leftX, y, 1, 1);
    rect(ctx, COL.tunnelEdge, rightX - 1, y, 1, 1);
    if (y === 12 || y === 13) {
      rect(ctx, COL.tunnelEdge, leftX, y, rightX - leftX, 1);
    }
  }

  // Innen-Schatten oben (gibt Tiefe)
  rect(ctx, COL.tunnelMid, 17, 14, 14, 2);

  // Straße in den Tunnel hinein
  rect(ctx, COL.road, 18, 36, 12, 6);
  // Mittelstreifen
  rect(ctx, COL.roadLine, 22, 38, 1, 1);
  rect(ctx, COL.roadLine, 22, 40, 1, 1);
  rect(ctx, COL.roadLine, 25, 38, 1, 1);
  rect(ctx, COL.roadLine, 25, 40, 1, 1);

  return canvas;
}
