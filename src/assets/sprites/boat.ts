/**
 * Boot-Sprite — Frachtboot auf dem Wasser, Cabinet-Iso.
 */

const COL = {
  hull: '#3a2010',
  hullDark: '#1a0a04',
  hullLight: '#5a3820',
  deck: '#7a5e3e',
  cabin: '#c8c878',
  cabinSide: '#8e8a4a',
  cabinRoof: '#a8a8b8',
  smokestack: '#3a3a44',
  cargo: '#5a4838',
  water: '#5a7aae',
} as const;

function rect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

export function createBoatSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 56;
  canvas.height = 24;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Wellen unter dem Boot (Wasser-Linien, vorne und hinten)
  for (let i = 0; i < 6; i++) {
    const x = 4 + i * 3;
    px(ctx, '#9abaef', x, 22);
  }
  for (let i = 0; i < 4; i++) {
    const x = 44 + i * 3;
    px(ctx, '#9abaef', x, 22);
  }

  // Hull (Schiffsrumpf — lange Cabinet-Iso-Form)
  // Boden (gerade Linie)
  rect(ctx, COL.hull, 8, 18, 40, 3);
  // Iso-Slope nach hinten oben (rechts)
  for (let i = 0; i < 6; i++) {
    rect(ctx, COL.hull, 48 + i, 17 - Math.floor(i / 2), 1, 3 + Math.floor(i / 2));
  }
  // Iso-Slope nach vorn (links abgerundet)
  for (let i = 0; i < 6; i++) {
    rect(ctx, COL.hull, 8 - i, 18 + Math.floor(i / 2) - i, 1, 3 + i - Math.floor(i / 2));
  }
  // Hull-Top-Edge (heller)
  rect(ctx, COL.hullLight, 8, 17, 40, 1);
  // Hull-Bottom-Schatten
  rect(ctx, COL.hullDark, 8, 20, 40, 1);

  // Deck (oben auf Hull, sichtbar)
  rect(ctx, COL.deck, 10, 14, 36, 4);

  // Kabine (hinten, mittig)
  rect(ctx, COL.cabin, 30, 6, 12, 8);
  rect(ctx, COL.cabinSide, 30, 6, 2, 8);
  rect(ctx, COL.cabinRoof, 28, 4, 16, 2);
  // Fenster
  rect(ctx, '#a8c8e0', 32, 8, 3, 3);
  rect(ctx, '#a8c8e0', 37, 8, 3, 3);

  // Schornstein
  rect(ctx, COL.smokestack, 36, 0, 3, 6);
  rect(ctx, '#1a1a20', 36, 0, 3, 1);
  // Rauch
  ctx.fillStyle = 'rgba(180, 180, 200, 0.6)';
  ctx.beginPath();
  ctx.arc(40, -2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Cargo-Container vorne auf Deck
  rect(ctx, COL.cargo, 12, 8, 14, 6);
  rect(ctx, '#7a6048', 12, 8, 1, 6);
  rect(ctx, '#3a2818', 12, 13, 14, 1);
  // Container-Linien
  px(ctx, '#3a2818', 18, 11);
  px(ctx, '#3a2818', 22, 11);

  return canvas;
}
