/**
 * Baum-Sprites — Cabinet-Iso, kompakter Baum mit Stamm + Krone.
 *
 * Anchor: bottom-center (Sprite "steht" auf der Tile).
 * Drei Varianten für Variation auf der Karte.
 */

const COL = {
  trunkDark: '#3a2614',
  trunk: '#5a3a20',
  leafDark: '#1e3a1e',
  leaf: '#2e5a2e',
  leafLight: '#3e7a3e',
  leafShadow: '#142a14',
} as const;

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function rect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Variant 1: Klassischer Laubbaum, oval-Krone
export function createTreeSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 28;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Stamm (Mitte unten, 2px breit)
  rect(ctx, COL.trunk, 7, 18, 2, 8);
  px(ctx, COL.trunkDark, 7, 18);
  px(ctx, COL.trunkDark, 7, 19);
  px(ctx, COL.trunkDark, 7, 22);
  px(ctx, COL.trunkDark, 7, 25);

  // Schatten unter Baum (Iso-Diamond)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  for (let dy = -2; dy <= 2; dy++) {
    const halfW = 6 - Math.abs(dy) * 2;
    ctx.fillRect(8 - halfW, 26 + dy, halfW * 2, 1);
  }

  // Krone (Pixel-Wolke)
  const crown: Array<[number, number, string]> = [
    // Mittelschicht (breit)
    [4, 10, COL.leaf], [5, 10, COL.leaf], [6, 10, COL.leaf], [7, 10, COL.leafLight], [8, 10, COL.leafLight], [9, 10, COL.leaf], [10, 10, COL.leaf], [11, 10, COL.leafDark],
    [3, 11, COL.leafDark], [4, 11, COL.leaf], [5, 11, COL.leaf], [6, 11, COL.leafLight], [7, 11, COL.leafLight], [8, 11, COL.leafLight], [9, 11, COL.leaf], [10, 11, COL.leaf], [11, 11, COL.leaf], [12, 11, COL.leafDark],
    [3, 12, COL.leafDark], [4, 12, COL.leaf], [5, 12, COL.leaf], [6, 12, COL.leaf], [7, 12, COL.leafLight], [8, 12, COL.leaf], [9, 12, COL.leaf], [10, 12, COL.leaf], [11, 12, COL.leaf], [12, 12, COL.leafDark],
    [3, 13, COL.leafShadow], [4, 13, COL.leafDark], [5, 13, COL.leaf], [6, 13, COL.leaf], [7, 13, COL.leaf], [8, 13, COL.leaf], [9, 13, COL.leafDark], [10, 13, COL.leafDark], [11, 13, COL.leafShadow], [12, 13, COL.leafShadow],
    // Oben (schmaler)
    [5, 7, COL.leaf], [6, 7, COL.leafLight], [7, 7, COL.leafLight], [8, 7, COL.leaf], [9, 7, COL.leaf], [10, 7, COL.leafDark],
    [4, 8, COL.leafDark], [5, 8, COL.leaf], [6, 8, COL.leafLight], [7, 8, COL.leafLight], [8, 8, COL.leafLight], [9, 8, COL.leaf], [10, 8, COL.leaf], [11, 8, COL.leafDark],
    [4, 9, COL.leafDark], [5, 9, COL.leaf], [6, 9, COL.leaf], [7, 9, COL.leafLight], [8, 9, COL.leafLight], [9, 9, COL.leaf], [10, 9, COL.leaf], [11, 9, COL.leafDark],
    // Spitze
    [6, 5, COL.leaf], [7, 5, COL.leafLight], [8, 5, COL.leaf], [9, 5, COL.leafDark],
    [5, 6, COL.leafDark], [6, 6, COL.leaf], [7, 6, COL.leafLight], [8, 6, COL.leaf], [9, 6, COL.leaf], [10, 6, COL.leafDark],
    // Unten (Auslaeufer)
    [4, 14, COL.leafShadow], [5, 14, COL.leafDark], [6, 14, COL.leafDark], [7, 14, COL.leaf], [8, 14, COL.leafDark], [9, 14, COL.leafDark], [10, 14, COL.leafShadow],
    [5, 15, COL.leafShadow], [6, 15, COL.leafDark], [7, 15, COL.leafDark], [8, 15, COL.leafShadow], [9, 15, COL.leafShadow],
    [6, 16, COL.leafShadow], [7, 16, COL.leafShadow], [8, 16, COL.leafShadow],
  ];
  for (const [x, y, c] of crown) px(ctx, c, x, y);

  return canvas;
}

// Variant 2: Hoher schmaler Nadelbaum
export function createPineSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 14;
  canvas.height = 30;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Stamm
  rect(ctx, COL.trunk, 6, 24, 2, 5);
  px(ctx, COL.trunkDark, 6, 24);
  px(ctx, COL.trunkDark, 6, 28);

  // Schatten
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (let dy = -1; dy <= 1; dy++) {
    const halfW = 4 - Math.abs(dy);
    ctx.fillRect(7 - halfW, 28 + dy, halfW * 2, 1);
  }

  // Nadelbaum: dreieckige Krone in Schichten
  // Spitze
  px(ctx, COL.leafLight, 6, 2);
  px(ctx, COL.leaf, 7, 2);
  // Schicht 1
  for (let x = 5; x <= 8; x++) px(ctx, COL.leaf, x, 4);
  px(ctx, COL.leafLight, 6, 3);
  px(ctx, COL.leafLight, 7, 3);
  // Schicht 2
  for (let x = 4; x <= 9; x++) px(ctx, COL.leaf, x, 7);
  for (let x = 5; x <= 8; x++) px(ctx, COL.leafLight, x, 6);
  px(ctx, COL.leafShadow, 4, 7);
  px(ctx, COL.leafDark, 9, 7);
  // Schicht 3
  for (let x = 3; x <= 10; x++) px(ctx, COL.leaf, x, 11);
  for (let x = 4; x <= 9; x++) px(ctx, COL.leafLight, x, 10);
  for (let x = 5; x <= 8; x++) px(ctx, COL.leafLight, x, 9);
  px(ctx, COL.leafShadow, 3, 11);
  px(ctx, COL.leafShadow, 4, 12);
  // Schicht 4
  for (let x = 2; x <= 11; x++) px(ctx, COL.leaf, x, 16);
  for (let x = 3; x <= 10; x++) px(ctx, COL.leafLight, x, 15);
  for (let x = 4; x <= 9; x++) px(ctx, COL.leafLight, x, 14);
  for (let x = 5; x <= 8; x++) px(ctx, COL.leafLight, x, 13);
  px(ctx, COL.leafShadow, 2, 16);
  px(ctx, COL.leafShadow, 3, 17);
  // Schicht 5 (basis)
  for (let x = 1; x <= 12; x++) px(ctx, COL.leaf, x, 22);
  for (let x = 2; x <= 11; x++) px(ctx, COL.leafLight, x, 21);
  for (let x = 3; x <= 10; x++) px(ctx, COL.leafLight, x, 20);
  for (let x = 4; x <= 9; x++) px(ctx, COL.leafLight, x, 19);
  for (let x = 5; x <= 8; x++) px(ctx, COL.leafLight, x, 18);
  px(ctx, COL.leafShadow, 1, 22);
  px(ctx, COL.leafShadow, 2, 23);

  return canvas;
}

// Variant 3: Kleines Buschwerk
export function createBushSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 12;
  canvas.height = 12;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(2, 10, 8, 2);

  const blob: Array<[number, number, string]> = [
    [4, 2, COL.leaf], [5, 2, COL.leafLight], [6, 2, COL.leaf], [7, 2, COL.leaf],
    [3, 3, COL.leafDark], [4, 3, COL.leafLight], [5, 3, COL.leafLight], [6, 3, COL.leafLight], [7, 3, COL.leaf], [8, 3, COL.leafDark],
    [2, 4, COL.leafDark], [3, 4, COL.leaf], [4, 4, COL.leafLight], [5, 4, COL.leafLight], [6, 4, COL.leafLight], [7, 4, COL.leaf], [8, 4, COL.leaf], [9, 4, COL.leafShadow],
    [2, 5, COL.leafDark], [3, 5, COL.leaf], [4, 5, COL.leaf], [5, 5, COL.leafLight], [6, 5, COL.leaf], [7, 5, COL.leaf], [8, 5, COL.leaf], [9, 5, COL.leafShadow],
    [2, 6, COL.leafShadow], [3, 6, COL.leafDark], [4, 6, COL.leaf], [5, 6, COL.leaf], [6, 6, COL.leaf], [7, 6, COL.leafDark], [8, 6, COL.leafShadow], [9, 6, COL.leafShadow],
    [3, 7, COL.leafShadow], [4, 7, COL.leafDark], [5, 7, COL.leafDark], [6, 7, COL.leafDark], [7, 7, COL.leafShadow],
    [4, 8, COL.leafShadow], [5, 8, COL.leafShadow], [6, 8, COL.leafShadow],
  ];
  for (const [x, y, c] of blob) px(ctx, c, x, y);

  return canvas;
}
