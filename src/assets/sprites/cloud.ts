/**
 * Wolken-Sprites — fluffige weiße Wolken in 3 Größen.
 * Werden über der Karte gerendert und langsam animiert.
 */

const COL = {
  cloudWhite: '#f8f8fa',
  cloudLight: '#e8e8ec',
  cloudShadow: '#c0c0c8',
} as const;

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function rect(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Große Wolke 36×16
export function createCloudLargeSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 36;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Hauptkörper (mehrere überlappende Kreise)
  const circles: Array<[number, number, number]> = [
    [8, 9, 5], [14, 7, 6], [22, 7, 6], [28, 9, 5], [18, 11, 4],
  ];
  for (const [cx, cy, r] of circles) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        px(ctx, COL.cloudWhite, cx + dx, cy + dy);
      }
    }
  }
  // Schatten unten
  for (let x = 4; x < 32; x++) {
    for (let y = 12; y < 15; y++) {
      const data = ctx.getImageData(x, y, 1, 1).data;
      if (data[3] > 0) px(ctx, COL.cloudShadow, x, y);
    }
  }
  // Highlight oben
  rect(ctx, COL.cloudLight, 13, 4, 10, 1);

  return canvas;
}

// Mittlere Wolke 24×12
export function createCloudMediumSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 24;
  canvas.height = 12;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const circles: Array<[number, number, number]> = [
    [6, 7, 4], [12, 5, 5], [18, 7, 4],
  ];
  for (const [cx, cy, r] of circles) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        px(ctx, COL.cloudWhite, cx + dx, cy + dy);
      }
    }
  }
  for (let x = 3; x < 20; x++) {
    for (let y = 9; y < 11; y++) {
      const data = ctx.getImageData(x, y, 1, 1).data;
      if (data[3] > 0) px(ctx, COL.cloudShadow, x, y);
    }
  }
  return canvas;
}

// Kleine Wolke 16×8
export function createCloudSmallSprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 8;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const circles: Array<[number, number, number]> = [
    [4, 4, 3], [8, 3, 3], [12, 4, 3],
  ];
  for (const [cx, cy, r] of circles) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        px(ctx, COL.cloudWhite, cx + dx, cy + dy);
      }
    }
  }
  for (let x = 2; x < 14; x++) {
    const data = ctx.getImageData(x, 6, 1, 1).data;
    if (data[3] > 0) px(ctx, COL.cloudShadow, x, 6);
  }
  return canvas;
}
