/**
 * Warehouse-Sprite (Lager-Halle, modern industrial) — 64x96 px Cabinet-Iso.
 *
 * Einfache Halle mit Roll-Tor, Wellblech-Anmutung.
 * Footprint sitzt im unteren Drittel; oberer Teil ist Dach + Wand-Hoehe.
 *
 * Lichtquelle: oben-rechts.
 */

const COL = {
  outline: '#1a1d22',
  wallDark: '#5a626c',
  wallMid: '#7a838f',
  wallLight: '#a0a8b2',
  roofDark: '#2e3640',
  roofMid: '#3e464f',
  roofLight: '#525a64',
  trim: '#3a4048',
  doorDark: '#3a4048',
  doorMid: '#5a626c',
  doorLight: '#7a838f',
  windowGlass: '#a8c4d8',
  windowFrame: '#3a4048',
  shadow: 'rgba(0,0,0,0.35)',
  ground: '#2a2e34',
} as const;

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w = 1, h = 1): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function createWarehouseSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // ----- Ground shadow (diamond footprint shadow under building) -----
  for (let y = 0; y < 16; y++) {
    const dy = y < 8 ? y : 15 - y;
    const halfW = (dy + 1) * 3;
    px(ctx, COL.shadow, 32 - halfW, 80 + y, halfW * 2, 1);
  }

  // ----- Building body: rectangular box, Cabinet-Iso seen from front-right -----
  // Layout reference (y = 96 bottom):
  //   y 16..28  : roof
  //   y 28..82  : front + right walls
  //   y 82..88  : ground line area

  // Roof top (lightest, faces up-right to light source)
  // Roof is a flat-ish double slope: gable on top.
  // We'll draw it as two angled bands.
  // Roof front face (lighter, angled toward upper-right)
  for (let row = 0; row < 14; row++) {
    const y = 16 + row;
    // narrow at top, widens down
    const startX = 12 + Math.floor(row / 2);
    const w = 40 - Math.floor(row / 2);
    if (row < 7) {
      px(ctx, COL.roofMid, startX, y, w, 1);
    } else {
      px(ctx, COL.roofLight, startX, y, w, 1);
    }
  }

  // Roof ridge highlight (top edge, light source)
  px(ctx, COL.roofLight, 16, 17, 32, 1);
  // Roof outline
  px(ctx, COL.outline, 12, 28, 40, 1);
  px(ctx, COL.outline, 12, 28, 1, 1);
  px(ctx, COL.outline, 51, 28, 1, 1);
  // Top ridge outline
  for (let i = 0; i < 30; i++) {
    px(ctx, COL.outline, 17 + i, 16);
  }
  // Roof slope diagonals
  for (let i = 0; i < 12; i++) {
    px(ctx, COL.outline, 16 - Math.floor(i / 2), 17 + i);
    px(ctx, COL.outline, 47 + Math.floor(i / 2), 17 + i);
  }

  // Roof corrugation hint (vertical stripes within the roof body)
  for (let i = 0; i < 7; i++) {
    const x = 16 + i * 4;
    for (let y = 19; y < 28; y++) {
      px(ctx, COL.roofDark, x, y);
    }
  }

  // ----- Front wall (large rectangle 12..52 wide, 28..82 tall) -----
  px(ctx, COL.wallMid, 12, 29, 40, 53);
  // Outline
  px(ctx, COL.outline, 12, 29, 1, 53);
  px(ctx, COL.outline, 51, 29, 1, 53);
  px(ctx, COL.outline, 12, 81, 40, 1);

  // Vertical corrugation/panel lines on wall
  for (let i = 1; i < 8; i++) {
    const x = 12 + i * 5;
    px(ctx, COL.wallDark, x, 29, 1, 53);
  }
  // Right-side highlight column (light from upper-right)
  px(ctx, COL.wallLight, 50, 29, 1, 53);
  px(ctx, COL.wallLight, 49, 29, 1, 53);

  // ----- Roll-up door (big, centered) -----
  // Door 16x28, centered around x=32, sits at bottom (y 53..81)
  const doorX = 22;
  const doorY = 53;
  const doorW = 20;
  const doorH = 28;
  px(ctx, COL.doorMid, doorX, doorY, doorW, doorH);
  // Door horizontal slats (every 3px)
  for (let i = 0; i < doorH; i += 3) {
    px(ctx, COL.doorDark, doorX, doorY + i, doorW, 1);
  }
  // Door light edge (top + right)
  px(ctx, COL.doorLight, doorX, doorY, doorW, 1);
  px(ctx, COL.doorLight, doorX + doorW - 1, doorY, 1, doorH);
  // Door outline
  px(ctx, COL.outline, doorX - 1, doorY - 1, doorW + 2, 1);
  px(ctx, COL.outline, doorX - 1, doorY - 1, 1, doorH + 1);
  px(ctx, COL.outline, doorX + doorW, doorY - 1, 1, doorH + 1);
  px(ctx, COL.outline, doorX - 1, doorY + doorH, doorW + 2, 1);

  // Door handle / lock band
  px(ctx, COL.outline, doorX + 9, doorY + doorH - 4, 2, 1);

  // ----- Windows row (above door) -----
  // 3 small windows
  const winY = 38;
  const winH = 6;
  const winW = 6;
  const xs = [16, 28, 40];
  for (const wx of xs) {
    px(ctx, COL.windowFrame, wx - 1, winY - 1, winW + 2, 1);
    px(ctx, COL.windowFrame, wx - 1, winY - 1, 1, winH + 2);
    px(ctx, COL.windowFrame, wx + winW, winY - 1, 1, winH + 2);
    px(ctx, COL.windowFrame, wx - 1, winY + winH, winW + 2, 1);
    px(ctx, COL.windowGlass, wx, winY, winW, winH);
    // Cross frame
    px(ctx, COL.windowFrame, wx + 2, winY, 1, winH);
    px(ctx, COL.windowFrame, wx, winY + 2, winW, 1);
  }

  // ----- Trim band above door (signage) -----
  px(ctx, COL.trim, 14, 48, 36, 3);
  px(ctx, COL.outline, 14, 48, 36, 1);
  px(ctx, COL.outline, 14, 50, 36, 1);
  // Tiny "WAREHOUSE" hint - just abstract pixel pattern
  for (let i = 0; i < 9; i++) {
    px(ctx, COL.wallLight, 18 + i * 3, 49);
  }

  // ----- Ground line / base shadow line -----
  px(ctx, COL.outline, 12, 82, 40, 1);
  px(ctx, COL.ground, 12, 83, 40, 2);

  // Front foundation (slightly darker strip)
  px(ctx, COL.wallDark, 12, 78, 40, 3);

  return canvas;
}
