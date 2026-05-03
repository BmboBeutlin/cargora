/**
 * Fabrik-Sprite — industrielles Gebäude mit Schornstein.
 * Cabinet-Iso, Anchor bottom-center.
 */

const COL = {
  wallA: '#7a6858', wallAside: '#4a3828',
  roofA: '#3a3a44', roofAdark: '#1a1a24',
  chimney: '#5a4a3a', chimneyDark: '#2a2010', chimneyTop: '#0a0805',
  smoke: '#a8a8b8', smokeLight: '#c8c8d8',
  window: '#c8c878', windowFrame: '#1a1a20',
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

export function createFactorySprite(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 56;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Schatten
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  for (let dy = -2; dy <= 2; dy++) {
    const halfW = 18 - Math.abs(dy) * 3;
    ctx.fillRect(24 - halfW, 53 + dy, halfW * 2, 1);
  }

  // Hauptbau — Fabrikhalle (front face)
  rect(ctx, COL.wallA, 8, 28, 28, 24);
  // Side face (links unten, dunkler)
  for (let i = 0; i < 8; i++) {
    rect(ctx, COL.wallAside, 0 + i, 32 - i / 2, 1, 24);
  }
  // Top edge
  rect(ctx, COL.wallAside, 8, 27, 28, 1);

  // Sägezahn-Dach (typisch für Fabrik)
  for (let i = 0; i < 28; i++) {
    const yOff = Math.floor((27 - i) / 2);
    rect(ctx, COL.roofA, 8 + i, 22 + yOff, 1, 6);
  }
  for (let i = 0; i < 8; i++) {
    rect(ctx, COL.roofAdark, i, 25 - Math.floor(i / 2), 1, 6);
  }
  // Sägezahn-Linien (3 Spitzen)
  for (let zigzag = 0; zigzag < 3; zigzag++) {
    const x0 = 11 + zigzag * 8;
    for (let i = 0; i < 6; i++) {
      px(ctx, COL.roofAdark, x0 + i, 23 + i / 2);
    }
  }

  // Schornstein (links auf dem Dach)
  rect(ctx, COL.chimney, 12, 4, 6, 22);
  rect(ctx, COL.chimneyDark, 12, 4, 1, 22); // links Schatten
  rect(ctx, COL.chimneyTop, 11, 2, 8, 2); // Oberkante

  // Schornstein-Streifen
  rect(ctx, COL.chimneyDark, 12, 8, 6, 1);
  rect(ctx, COL.chimneyDark, 12, 16, 6, 1);

  // Rauch (statisch, nach oben rechts)
  ctx.fillStyle = COL.smokeLight;
  for (const [x, y, r] of [[19, -2, 3], [22, -6, 3], [26, -10, 4]] as Array<[number, number, number]>) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        const px_ = x + dx;
        const py = y + dy;
        if (py < 0 || py >= 56 || px_ < 0 || px_ >= 48) continue;
        ctx.fillRect(px_, py, 1, 1);
      }
    }
  }

  // Fenster-Reihe (gelb, Industrie)
  for (let i = 0; i < 4; i++) {
    rect(ctx, COL.window, 12 + i * 5, 38, 3, 4);
    rect(ctx, COL.windowFrame, 13 + i * 5, 38, 1, 4);
    rect(ctx, COL.windowFrame, 12 + i * 5, 40, 3, 1);
  }

  // Tor in der Mitte unten
  rect(ctx, COL.door, 22, 44, 8, 8);
  rect(ctx, COL.windowFrame, 26, 44, 1, 8);

  return canvas;
}
