/**
 * Multi-Color Truck-Sprite-Generator.
 * Produziert Container-Trucks in verschiedenen Farben (Cab + Container individuell).
 */

import type { Heading } from './truck';

export type TruckColor = 'red' | 'blue' | 'green' | 'yellow' | 'black' | 'white';

type Palette = {
  cabTop: string;
  cabSide: string;
  cabFront: string;
  containerTop: string;
  containerSide: string;
  containerFront: string;
  highlight: string;
};

const PALETTES: Record<TruckColor, Palette> = {
  red:    { cabTop: '#c04030', cabSide: '#8a2820', cabFront: '#a03028', containerTop: '#a86c40', containerSide: '#7a4a28', containerFront: '#8e5838', highlight: '#e06050' },
  blue:   { cabTop: '#3a78c8', cabSide: '#284a8a', cabFront: '#2e5aa0', containerTop: '#5a8c5a', containerSide: '#3a6a3a', containerFront: '#4a7a4a', highlight: '#5a98e8' },
  green:  { cabTop: '#5a9a4a', cabSide: '#3a6a30', cabFront: '#487a3a', containerTop: '#807060', containerSide: '#504838', containerFront: '#605040', highlight: '#7abb5a' },
  yellow: { cabTop: '#d8a818', cabSide: '#9a7810', cabFront: '#b88a14', containerTop: '#7a3a3a', containerSide: '#5a2424', containerFront: '#6a2e2e', highlight: '#f0c838' },
  black:  { cabTop: '#1e1e22', cabSide: '#0a0a0e', cabFront: '#14141a', containerTop: '#3a3a44', containerSide: '#1e1e26', containerFront: '#2a2a32', highlight: '#404048' },
  white:  { cabTop: '#e8e8eb', cabSide: '#a8a8ab', cabFront: '#c8c8cb', containerTop: '#5a5078', containerSide: '#3a3258', containerFront: '#4a4068', highlight: '#ffffff' },
};

const COL_COMMON = {
  windowGlass: '#7aa8d8',
  windowFrame: '#1a1a20',
  wheel: '#0e0e0e',
  shadow: 'rgba(0, 0, 0, 0.4)',
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
  ctx.fillStyle = COL_COMMON.shadow;
  for (let dy = -3; dy <= 3; dy++) {
    const halfW = 12 - Math.abs(dy) * 3;
    ctx.fillRect(cx - halfW, cy + dy, halfW * 2, 1);
  }
}

function renderTruck(p: Palette, heading: Heading): HTMLCanvasElement {
  const { canvas, ctx } = makeBase();
  drawShadow(ctx, 24, 38);

  if (heading === 'se') {
    for (let i = 0; i < 16; i++) {
      const yOff = Math.floor(i / 2);
      rect(ctx, 6 + i, 12 + yOff, 1, 8, p.containerTop);
      rect(ctx, 6 + i, 20 + yOff, 1, 6, p.containerSide);
    }
    rect(ctx, 22, 20, 4, 8, p.containerFront);
    for (let i = 0; i < 10; i++) {
      const yOff = Math.floor(i / 2);
      rect(ctx, 26 + i, 18 + yOff, 1, 5, p.cabTop);
      rect(ctx, 26 + i, 23 + yOff, 1, 6, p.cabSide);
    }
    rect(ctx, 36, 23, 4, 6, p.cabFront);
    rect(ctx, 32, 22, 6, 4, COL_COMMON.windowGlass);
    px(ctx, 36, 24, COL_COMMON.windowFrame);
    px(ctx, 36, 25, COL_COMMON.windowFrame);
    rect(ctx, 9, 27, 4, 2, COL_COMMON.wheel);
    rect(ctx, 17, 30, 4, 2, COL_COMMON.wheel);
    rect(ctx, 28, 30, 4, 2, COL_COMMON.wheel);
    rect(ctx, 33, 31, 3, 2, COL_COMMON.wheel);
    for (let i = 8; i < 16; i++) {
      const yOff = Math.floor(i / 2);
      px(ctx, 6 + i, 12 + yOff, p.highlight);
    }
  } else if (heading === 'nw') {
    for (let i = 0; i < 10; i++) {
      const yOff = Math.floor(i / 2);
      rect(ctx, 8 + i, 18 + yOff, 1, 5, p.cabTop);
      rect(ctx, 8 + i, 23 + yOff, 1, 6, p.cabSide);
    }
    rect(ctx, 18, 23, 4, 6, p.cabFront);
    rect(ctx, 8, 22, 6, 4, COL_COMMON.windowGlass);
    for (let i = 0; i < 16; i++) {
      const yOff = Math.floor(i / 2);
      rect(ctx, 22 + i, 12 + yOff, 1, 8, p.containerTop);
      rect(ctx, 22 + i, 20 + yOff, 1, 6, p.containerSide);
    }
    rect(ctx, 38, 20, 4, 8, p.containerFront);
    rect(ctx, 11, 30, 4, 2, COL_COMMON.wheel);
    rect(ctx, 17, 31, 3, 2, COL_COMMON.wheel);
    rect(ctx, 25, 30, 4, 2, COL_COMMON.wheel);
    rect(ctx, 33, 31, 4, 2, COL_COMMON.wheel);
    for (let i = 8; i < 16; i++) {
      const yOff = Math.floor(i / 2);
      px(ctx, 22 + i, 12 + yOff, p.highlight);
    }
  } else if (heading === 'sw') {
    for (let i = 0; i < 16; i++) {
      const yOff = Math.floor((15 - i) / 2);
      rect(ctx, 22 + i, 12 + yOff, 1, 8, p.containerTop);
      rect(ctx, 22 + i, 20 + yOff, 1, 6, p.containerSide);
    }
    rect(ctx, 22, 20, 4, 8, p.containerFront);
    for (let i = 0; i < 10; i++) {
      const yOff = Math.floor((9 - i) / 2);
      rect(ctx, 12 + i, 18 + yOff, 1, 5, p.cabTop);
      rect(ctx, 12 + i, 23 + yOff, 1, 6, p.cabSide);
    }
    rect(ctx, 12, 23, 4, 6, p.cabFront);
    rect(ctx, 14, 22, 6, 4, COL_COMMON.windowGlass);
    rect(ctx, 14, 30, 4, 2, COL_COMMON.wheel);
    rect(ctx, 21, 31, 3, 2, COL_COMMON.wheel);
    rect(ctx, 28, 30, 4, 2, COL_COMMON.wheel);
    rect(ctx, 34, 28, 4, 2, COL_COMMON.wheel);
    for (let i = 0; i < 8; i++) {
      const yOff = Math.floor((15 - i) / 2);
      px(ctx, 22 + i, 12 + yOff, p.highlight);
    }
  } else { // ne
    for (let i = 0; i < 10; i++) {
      const yOff = Math.floor((9 - i) / 2);
      rect(ctx, 28 + i, 14 + yOff, 1, 5, p.cabTop);
      rect(ctx, 28 + i, 19 + yOff, 1, 6, p.cabSide);
    }
    rect(ctx, 28, 19, 4, 6, p.cabFront);
    rect(ctx, 30, 18, 6, 4, COL_COMMON.windowGlass);
    for (let i = 0; i < 16; i++) {
      const yOff = Math.floor((15 - i) / 2);
      rect(ctx, 6 + i, 16 + yOff, 1, 8, p.containerTop);
      rect(ctx, 6 + i, 24 + yOff, 1, 6, p.containerSide);
    }
    rect(ctx, 6, 24, 4, 8, p.containerFront);
    rect(ctx, 8, 32, 4, 2, COL_COMMON.wheel);
    rect(ctx, 14, 30, 4, 2, COL_COMMON.wheel);
    rect(ctx, 20, 28, 4, 2, COL_COMMON.wheel);
    rect(ctx, 30, 26, 4, 2, COL_COMMON.wheel);
    for (let i = 0; i < 8; i++) {
      const yOff = Math.floor((15 - i) / 2);
      px(ctx, 6 + i, 16 + yOff, p.highlight);
    }
  }
  return canvas;
}

export function createColoredTruckSet(color: TruckColor): Record<Heading, HTMLCanvasElement> {
  const p = PALETTES[color];
  return {
    se: renderTruck(p, 'se'),
    nw: renderTruck(p, 'nw'),
    sw: renderTruck(p, 'sw'),
    ne: renderTruck(p, 'ne'),
  };
}

export const TRUCK_COLORS: TruckColor[] = ['red', 'blue', 'green', 'yellow', 'black', 'white'];

export function coloredTruckKey(color: TruckColor, heading: Heading): string {
  return `sprite-truck-${color}-${heading}`;
}
