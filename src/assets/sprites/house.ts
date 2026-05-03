/**
 * Haus-Sprites — Cabinet-Iso Wohngebäude.
 *
 * Anchor: bottom-center.
 * Drei Varianten für Stadt-Variation.
 */

const COL = {
  // Wand-Farben (3 Varianten)
  wallA: '#a07050', wallAside: '#704830',
  wallB: '#b89878', wallBside: '#806848',
  wallC: '#807060', wallCside: '#504838',
  // Dach
  roofA: '#7a3030', roofAdark: '#4a1818',
  roofB: '#3a4858', roofBdark: '#1f2530',
  roofC: '#5a3a20', roofCdark: '#3a2010',
  // Fenster
  window: '#a8c8e0',
  windowFrame: '#1a1a20',
  // Tür
  door: '#3a2010',
} as const;

function rect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

// Variant 1: Klassisches Einfamilienhaus mit Spitzdach
export function createHouseSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 36;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Schatten
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (let dy = -2; dy <= 2; dy++) {
    const halfW = 13 - Math.abs(dy) * 3;
    ctx.fillRect(16 - halfW, 33 + dy, halfW * 2, 1);
  }

  // Body — front face (rechts-unten, Cabinet-Iso)
  rect(ctx, COL.wallA, 6, 18, 18, 14);
  // Side face (links-unten, dunkler)
  for (let i = 0; i < 6; i++) {
    rect(ctx, COL.wallAside, 0 + i, 21 - i / 2, 1, 14);
  }
  // Top edge (Wand-Linie zur Dach)
  rect(ctx, COL.wallAside, 6, 17, 18, 1);

  // Dach (front face)
  for (let i = 0; i < 18; i++) {
    const yOff = Math.floor((17 - i) / 2);
    rect(ctx, COL.roofA, 6 + i, 8 + yOff, 1, 10);
  }
  // Dach side (links unten, dunkler)
  for (let i = 0; i < 6; i++) {
    const yTop = 11 - Math.floor(i / 2);
    rect(ctx, COL.roofAdark, i, yTop, 1, 10);
  }
  // Dach-Spitze
  for (let i = 0; i < 18; i++) {
    const yOff = Math.floor((17 - i) / 2);
    px(ctx, COL.roofAdark, 6 + i, 8 + yOff);
  }

  // Fenster
  rect(ctx, COL.window, 9, 22, 4, 4);
  rect(ctx, COL.windowFrame, 11, 22, 1, 4);
  rect(ctx, COL.windowFrame, 9, 24, 4, 1);
  rect(ctx, COL.window, 17, 22, 4, 4);
  rect(ctx, COL.windowFrame, 19, 22, 1, 4);
  rect(ctx, COL.windowFrame, 17, 24, 4, 1);

  // Tür
  rect(ctx, COL.door, 13, 26, 3, 6);

  return canvas;
}

// Variant 2: Mehrfamilienhaus, Flachdach
export function createApartmentSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 44;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (let dy = -2; dy <= 2; dy++) {
    const halfW = 13 - Math.abs(dy) * 3;
    ctx.fillRect(16 - halfW, 41 + dy, halfW * 2, 1);
  }

  // Front face (höher)
  rect(ctx, COL.wallB, 6, 8, 18, 32);
  // Side face
  for (let i = 0; i < 6; i++) {
    rect(ctx, COL.wallBside, 0 + i, 11 - i / 2, 1, 32);
  }
  // Top edge
  rect(ctx, COL.wallBside, 6, 7, 18, 1);
  // Top face (Dach flach)
  for (let i = 0; i < 18; i++) {
    const yOff = Math.floor((17 - i) / 2);
    rect(ctx, COL.roofB, 6 + i, 4 + yOff, 1, 4);
  }
  for (let i = 0; i < 6; i++) {
    px(ctx, COL.roofBdark, i, 7 - Math.floor(i / 2));
  }

  // Fenster-Reihen (mehrere Etagen)
  for (let row = 0; row < 4; row++) {
    const yWin = 11 + row * 7;
    rect(ctx, COL.window, 9, yWin, 3, 3);
    rect(ctx, COL.windowFrame, 10, yWin, 1, 3);
    rect(ctx, COL.window, 14, yWin, 3, 3);
    rect(ctx, COL.windowFrame, 15, yWin, 1, 3);
    rect(ctx, COL.window, 19, yWin, 3, 3);
    rect(ctx, COL.windowFrame, 20, yWin, 1, 3);
  }

  // Tür unten Mitte
  rect(ctx, COL.door, 13, 36, 3, 4);

  return canvas;
}

// Variant 3: Kleine Hütte
export function createCottageSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 24;
  canvas.height = 24;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (let dy = -1; dy <= 1; dy++) {
    const halfW = 8 - Math.abs(dy) * 2;
    ctx.fillRect(12 - halfW, 22 + dy, halfW * 2, 1);
  }

  rect(ctx, COL.wallC, 6, 12, 12, 10);
  for (let i = 0; i < 4; i++) {
    rect(ctx, COL.wallCside, 2 + i, 14 - i / 2, 1, 10);
  }
  rect(ctx, COL.wallCside, 6, 11, 12, 1);

  // Dach
  for (let i = 0; i < 12; i++) {
    const yOff = Math.floor((11 - i) / 2);
    rect(ctx, COL.roofC, 6 + i, 4 + yOff, 1, 8);
  }
  for (let i = 0; i < 4; i++) {
    rect(ctx, COL.roofCdark, 2 + i, 7 - Math.floor(i / 2), 1, 8);
  }

  // Klein Fenster
  rect(ctx, COL.window, 9, 15, 3, 3);
  rect(ctx, COL.windowFrame, 10, 15, 1, 3);
  // Tür
  rect(ctx, COL.door, 14, 17, 2, 5);

  return canvas;
}
