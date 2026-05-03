/**
 * Container-Truck Sprites (48x48 each) — 4 Heading-Varianten in echter Cabinet-Iso-Optik.
 *
 * Heading-Konvention:
 *   'se' = nach rechts-unten   (Welt: X+)
 *   'nw' = nach links-oben     (Welt: X-)
 *   'sw' = nach links-unten    (Welt: Y+)
 *   'ne' = nach rechts-oben    (Welt: Y-)
 */

export type Heading = 'se' | 'nw' | 'sw' | 'ne';

const COL = {
  containerTop: '#a86c40',
  containerSide: '#7a4a28',
  containerFront: '#8e5838',
  containerOutline: '#3a2010',
  cabinTop: '#3a3a44',
  cabinSide: '#28282e',
  cabinFront: '#2e2e36',
  windowGlass: '#7aa8d8',
  windowFrame: '#1a1a20',
  wheel: '#0e0e0e',
  shadow: 'rgba(0, 0, 0, 0.4)',
  highlight: '#c08454',
} as const;

function makeBase(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function drawShadow(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.fillStyle = COL.shadow;
  for (let dy = -3; dy <= 3; dy++) {
    const halfW = 12 - Math.abs(dy) * 3;
    ctx.fillRect(cx - halfW, cy + dy, halfW * 2, 1);
  }
}

// SE: rechts-unten (Welt-X+)
function renderSE(): HTMLCanvasElement {
  const { canvas, ctx } = makeBase();
  drawShadow(ctx, 24, 38);

  // Container hinten links-oben — Iso-Top mit slope right-down
  for (let i = 0; i < 16; i++) {
    const yOff = Math.floor(i / 2);
    rect(ctx, 6 + i, 12 + yOff, 1, 8, COL.containerTop);
    rect(ctx, 6 + i, 20 + yOff, 1, 6, COL.containerSide);
  }
  rect(ctx, 22, 20, 4, 8, COL.containerFront);

  // Cabin vorne rechts-unten
  for (let i = 0; i < 10; i++) {
    const yOff = Math.floor(i / 2);
    rect(ctx, 26 + i, 18 + yOff, 1, 5, COL.cabinTop);
    rect(ctx, 26 + i, 23 + yOff, 1, 6, COL.cabinSide);
  }
  rect(ctx, 36, 23, 4, 6, COL.cabinFront);
  rect(ctx, 32, 22, 6, 4, COL.windowGlass);
  px(ctx, 36, 24, COL.windowFrame);
  px(ctx, 36, 25, COL.windowFrame);

  rect(ctx, 9, 27, 4, 2, COL.wheel);
  rect(ctx, 17, 30, 4, 2, COL.wheel);
  rect(ctx, 28, 30, 4, 2, COL.wheel);
  rect(ctx, 33, 31, 3, 2, COL.wheel);

  // Highlight (Licht oben-rechts)
  for (let i = 8; i < 16; i++) {
    const yOff = Math.floor(i / 2);
    px(ctx, 6 + i, 12 + yOff, COL.highlight);
  }
  return canvas;
}

// NW: links-oben (Welt-X-)
function renderNW(): HTMLCanvasElement {
  const { canvas, ctx } = makeBase();
  drawShadow(ctx, 24, 38);

  // Cabin vorne links-oben
  for (let i = 0; i < 10; i++) {
    const yOff = Math.floor(i / 2);
    rect(ctx, 8 + i, 18 + yOff, 1, 5, COL.cabinTop);
    rect(ctx, 8 + i, 23 + yOff, 1, 6, COL.cabinSide);
  }
  rect(ctx, 18, 23, 4, 6, COL.cabinFront);
  rect(ctx, 8, 22, 6, 4, COL.windowGlass);

  // Container hinten rechts-unten
  for (let i = 0; i < 16; i++) {
    const yOff = Math.floor(i / 2);
    rect(ctx, 22 + i, 12 + yOff, 1, 8, COL.containerTop);
    rect(ctx, 22 + i, 20 + yOff, 1, 6, COL.containerSide);
  }
  rect(ctx, 38, 20, 4, 8, COL.containerFront);

  rect(ctx, 11, 30, 4, 2, COL.wheel);
  rect(ctx, 17, 31, 3, 2, COL.wheel);
  rect(ctx, 25, 30, 4, 2, COL.wheel);
  rect(ctx, 33, 31, 4, 2, COL.wheel);

  for (let i = 8; i < 16; i++) {
    const yOff = Math.floor(i / 2);
    px(ctx, 22 + i, 12 + yOff, COL.highlight);
  }
  return canvas;
}

// SW: links-unten (Welt-Y+) — slope left-down
function renderSW(): HTMLCanvasElement {
  const { canvas, ctx } = makeBase();
  drawShadow(ctx, 24, 38);

  // Container hinten rechts-oben
  for (let i = 0; i < 16; i++) {
    const yOff = Math.floor((15 - i) / 2);
    rect(ctx, 22 + i, 12 + yOff, 1, 8, COL.containerTop);
    rect(ctx, 22 + i, 20 + yOff, 1, 6, COL.containerSide);
  }
  rect(ctx, 22, 20, 4, 8, COL.containerFront);

  // Cabin vorne links-unten
  for (let i = 0; i < 10; i++) {
    const yOff = Math.floor((9 - i) / 2);
    rect(ctx, 12 + i, 18 + yOff, 1, 5, COL.cabinTop);
    rect(ctx, 12 + i, 23 + yOff, 1, 6, COL.cabinSide);
  }
  rect(ctx, 12, 23, 4, 6, COL.cabinFront);
  rect(ctx, 14, 22, 6, 4, COL.windowGlass);

  rect(ctx, 14, 30, 4, 2, COL.wheel);
  rect(ctx, 21, 31, 3, 2, COL.wheel);
  rect(ctx, 28, 30, 4, 2, COL.wheel);
  rect(ctx, 34, 28, 4, 2, COL.wheel);

  for (let i = 0; i < 8; i++) {
    const yOff = Math.floor((15 - i) / 2);
    px(ctx, 22 + i, 12 + yOff, COL.highlight);
  }
  return canvas;
}

// NE: rechts-oben (Welt-Y-)
function renderNE(): HTMLCanvasElement {
  const { canvas, ctx } = makeBase();
  drawShadow(ctx, 24, 38);

  // Cabin vorne rechts-oben
  for (let i = 0; i < 10; i++) {
    const yOff = Math.floor((9 - i) / 2);
    rect(ctx, 28 + i, 14 + yOff, 1, 5, COL.cabinTop);
    rect(ctx, 28 + i, 19 + yOff, 1, 6, COL.cabinSide);
  }
  rect(ctx, 28, 19, 4, 6, COL.cabinFront);
  rect(ctx, 30, 18, 6, 4, COL.windowGlass);

  // Container hinten links-unten
  for (let i = 0; i < 16; i++) {
    const yOff = Math.floor((15 - i) / 2);
    rect(ctx, 6 + i, 16 + yOff, 1, 8, COL.containerTop);
    rect(ctx, 6 + i, 24 + yOff, 1, 6, COL.containerSide);
  }
  rect(ctx, 6, 24, 4, 8, COL.containerFront);

  rect(ctx, 8, 32, 4, 2, COL.wheel);
  rect(ctx, 14, 30, 4, 2, COL.wheel);
  rect(ctx, 20, 28, 4, 2, COL.wheel);
  rect(ctx, 30, 26, 4, 2, COL.wheel);

  for (let i = 0; i < 8; i++) {
    const yOff = Math.floor((15 - i) / 2);
    px(ctx, 6 + i, 16 + yOff, COL.highlight);
  }
  return canvas;
}

const RENDERERS: Record<Heading, () => HTMLCanvasElement> = {
  se: renderSE,
  nw: renderNW,
  sw: renderSW,
  ne: renderNE,
};

export function createTruckSprite(heading: Heading = 'se'): HTMLCanvasElement {
  return RENDERERS[heading]();
}

export function createTruckSpriteSet(): Record<Heading, HTMLCanvasElement> {
  return {
    se: renderSE(),
    nw: renderNW(),
    sw: renderSW(),
    ne: renderNE(),
  };
}
