/**
 * Truck-Sprite (modern Cargo-LKW) — 48x48 px Cabinet-Iso.
 *
 * Programmatisch via Canvas-API gerenderte Pixel-Art als Platzhalter,
 * bis echte Aseprite-Sprites verfuegbar sind.
 *
 * Lichtquelle: oben-rechts -> Schatten links/unten.
 * Palette: ~7 Blau-/Grau-Toene, hartes 1px-Detail.
 */

// Color palette (Modern era, blue truck)
const COL = {
  outline: '#1a2230',
  cabDark: '#2c4a78',
  cabMid: '#4775a8',
  cabLight: '#6a9bd0',
  glass: '#9ec8e8',
  glassDark: '#5a7a98',
  boxDark: '#cfd5dd',
  boxMid: '#e8edf3',
  boxLight: '#ffffff',
  wheel: '#1a1d24',
  wheelHub: '#3a4250',
  shadow: 'rgba(0,0,0,0.35)',
  bumper: '#2a323e',
  light: '#f0e8b8',
} as const;

// Helper: pixel-precise rect (works with imageSmoothingEnabled = false)
function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w = 1, h = 1): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function createTruckSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Ground shadow ellipse-ish (drawn as flat pixels, since ctx.ellipse antialiases)
  px(ctx, COL.shadow, 8, 41, 32, 1);
  px(ctx, COL.shadow, 6, 42, 36, 2);
  px(ctx, COL.shadow, 8, 44, 32, 1);

  // ----- Cargo box (rear/upper-left), Cabinet-Iso ~30deg -----
  // Top face (lightest)
  for (let i = 0; i < 8; i++) {
    px(ctx, COL.boxLight, 6 + i, 11 - Math.floor(i / 2), 18, 1);
  }
  // Front face (mid)
  px(ctx, COL.boxMid, 6, 12, 18, 18);
  // Box outline
  px(ctx, COL.outline, 6, 12, 1, 18);
  px(ctx, COL.outline, 23, 12, 1, 18);
  px(ctx, COL.outline, 6, 11, 18, 1);
  px(ctx, COL.outline, 6, 30, 18, 1);
  // Box top edge outline
  px(ctx, COL.outline, 13, 7, 11, 1);
  px(ctx, COL.outline, 23, 7, 1, 5);

  // Box panel detail lines (vertical seams)
  px(ctx, COL.boxDark, 11, 13, 1, 16);
  px(ctx, COL.boxDark, 17, 13, 1, 16);

  // Box right side (darker, in shadow toward viewer-right? Light from upper-right
  // means right side gets light, left side gets shadow. Adjusting:)
  px(ctx, COL.boxDark, 6, 12, 1, 18); // left edge shadow band
  px(ctx, COL.boxDark, 7, 12, 1, 18);

  // Rear door handle hint
  px(ctx, COL.outline, 14, 20, 2, 1);

  // ----- Cab (front, right side) -----
  // Cab roof (top)
  px(ctx, COL.cabLight, 24, 14, 12, 1);
  px(ctx, COL.cabLight, 25, 13, 11, 1);
  // Cab front face
  px(ctx, COL.cabMid, 24, 15, 12, 14);
  // Cab outline
  px(ctx, COL.outline, 23, 14, 1, 16);
  px(ctx, COL.outline, 36, 13, 1, 17);
  px(ctx, COL.outline, 24, 13, 12, 1);
  px(ctx, COL.outline, 24, 30, 13, 1);

  // Right side highlight (light from upper-right)
  px(ctx, COL.cabLight, 35, 15, 1, 14);

  // Left side of cab (shadow toward box)
  px(ctx, COL.cabDark, 24, 15, 1, 14);

  // Windshield (upper area of cab)
  px(ctx, COL.glass, 26, 16, 9, 5);
  px(ctx, COL.glassDark, 26, 16, 9, 1);
  px(ctx, COL.glassDark, 26, 16, 1, 5);
  // Window split
  px(ctx, COL.cabDark, 30, 16, 1, 5);

  // Headlights
  px(ctx, COL.light, 26, 27, 2, 1);
  px(ctx, COL.light, 33, 27, 2, 1);

  // Bumper / grille
  px(ctx, COL.bumper, 24, 28, 12, 2);
  px(ctx, COL.outline, 24, 28, 12, 1);

  // Cab door handle
  px(ctx, COL.outline, 28, 23, 1, 1);

  // ----- Wheels (4: 2 visible per side; we show front-right pair + rear-right) -----
  // Rear wheels (under cargo box)
  drawWheel(ctx, 9, 31);
  drawWheel(ctx, 17, 31);
  // Front wheel (under cab)
  drawWheel(ctx, 28, 31);
  drawWheel(ctx, 33, 31);

  return canvas;
}

function drawWheel(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // 4x5 wheel: outline ring + hub
  px(ctx, COL.outline, x, y, 4, 1);
  px(ctx, COL.outline, x, y + 4, 4, 1);
  px(ctx, COL.outline, x, y + 1, 1, 3);
  px(ctx, COL.outline, x + 3, y + 1, 1, 3);
  px(ctx, COL.wheel, x + 1, y + 1, 2, 3);
  px(ctx, COL.wheelHub, x + 1, y + 2, 2, 1);
}
