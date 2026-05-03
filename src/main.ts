import Phaser from 'phaser';

const TILE_SIZE = 32;
const MAP_W = 30;
const MAP_H = 18;

const TileType = {
  Asphalt: 'asphalt',
  Schotter: 'schotter',
  Feldweg: 'feldweg',
  Gras: 'gras',
} as const;
type TileType = (typeof TileType)[keyof typeof TileType];

type TileInfo = { name: string; color: number; speedMod: number };

const TILE_INFO: Record<TileType, TileInfo> = {
  asphalt:  { name: 'Asphalt',  color: 0x4a4a52, speedMod: 1.0  },
  schotter: { name: 'Schotter', color: 0x8a7a5e, speedMod: 0.55 },
  feldweg:  { name: 'Feldweg',  color: 0xa68a52, speedMod: 0.30 },
  gras:     { name: 'Gras',     color: 0x2e4a2e, speedMod: 0    },
};

const ASCII_TO_TILE: Record<string, TileType> = {
  A: 'asphalt',
  s: 'schotter',
  f: 'feldweg',
  '.': 'gras',
};

const MAP_ASCII: string[] = [
  '..............................',
  '..AAAAAAAAAAAAAAAAAAAAA.......',
  '..A...................A.......',
  '..A..ssssssssssss.....A.......',
  '..A..s..........s.....A.......',
  '..A..s..fffffff.s.....AAAAAA..',
  '..A..s..f.....f.s..........A..',
  '..A..s..f.....f.s....sssss.A..',
  '..A..s..fffffff.s....s...s.A..',
  '..A..s..........s....s...s.A..',
  '..A..ssssssssssss....sssss.A..',
  '..A........................A..',
  '..A..AAAAAAAAAAAAAAAAAAAAAAA..',
  '..A..A........................',
  '..A..A........................',
  '..AAAA........................',
  '..............................',
  '..............................',
];

const BASE_PIXELS_PER_MS = 0.15; // bei speedMod=1.0

class GameScene extends Phaser.Scene {
  private map: TileType[][] = [];
  private truck!: Phaser.GameObjects.Rectangle;
  private direction!: Phaser.GameObjects.Rectangle;
  private hudEl: HTMLDivElement | null = null;
  private moving = false;
  private currentTile = { x: 5, y: 2 };
  private flashTimer = 0;
  private flashMessage = '';

  constructor() {
    super('game');
  }

  create(): void {
    this.hudEl = document.getElementById('hud') as HTMLDivElement;
    this.map = MAP_ASCII.map((row) =>
      row.split('').map((ch) => ASCII_TO_TILE[ch] ?? 'gras')
    );

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const info = TILE_INFO[this.map[y][x]];
        const rect = this.add.rectangle(
          x * TILE_SIZE + TILE_SIZE / 2,
          y * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE - 1,
          TILE_SIZE - 1,
          info.color
        );
        rect.setStrokeStyle(1, 0x000000, 0.18);
      }
    }

    const startX = this.currentTile.x * TILE_SIZE + TILE_SIZE / 2;
    const startY = this.currentTile.y * TILE_SIZE + TILE_SIZE / 2;
    this.truck = this.add.rectangle(startX, startY, TILE_SIZE * 0.6, TILE_SIZE * 0.6, 0x3a78c8);
    this.truck.setStrokeStyle(2, 0xffffff, 0.92);
    this.truck.setDepth(10);

    this.direction = this.add.rectangle(startX, startY, 5, 5, 0xffffff);
    this.direction.setDepth(11);

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.moving) return;
      const wp = this.cameras.main.getWorldPoint(p.x, p.y);
      const tx = Math.floor(wp.x / TILE_SIZE);
      const ty = Math.floor(wp.y / TILE_SIZE);
      if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return;
      this.moveTo(tx, ty);
    });

    this.input.on(
      'wheel',
      (_p: Phaser.Input.Pointer, _go: unknown, _dx: number, dy: number) => {
        const z = this.cameras.main.zoom;
        const next = Phaser.Math.Clamp(z - dy * 0.001, 0.5, 2.5);
        this.cameras.main.setZoom(next);
      }
    );

    this.updateHud();
  }

  private moveTo(tx: number, ty: number): void {
    const target = this.map[ty][tx];
    const info = TILE_INFO[target];
    if (info.speedMod === 0) {
      this.flash(`${info.name} – nicht befahrbar`);
      return;
    }

    const startTile = this.map[this.currentTile.y][this.currentTile.x];
    const startInfo = TILE_INFO[startTile];
    const avgSpeed = (startInfo.speedMod + info.speedMod) / 2;

    const fromX = this.truck.x;
    const fromY = this.truck.y;
    const toX = tx * TILE_SIZE + TILE_SIZE / 2;
    const toY = ty * TILE_SIZE + TILE_SIZE / 2;
    const distance = Math.hypot(toX - fromX, toY - fromY);
    const duration = distance / (BASE_PIXELS_PER_MS * avgSpeed);

    const dirX = (toX - fromX) / distance;
    const dirY = (toY - fromY) / distance;

    this.moving = true;
    this.tweens.add({
      targets: [this.truck, this.direction],
      x: '+=' + (toX - fromX),
      y: '+=' + (toY - fromY),
      duration,
      ease: 'Linear',
      onUpdate: () => {
        const offset = TILE_SIZE * 0.22;
        this.direction.x = this.truck.x + dirX * offset;
        this.direction.y = this.truck.y + dirY * offset;
      },
      onComplete: () => {
        this.moving = false;
        this.currentTile = { x: tx, y: ty };
        this.updateHud();
      },
    });
    this.updateHud();
  }

  private flash(message: string): void {
    this.flashMessage = message;
    this.flashTimer = 1500;
    this.updateHud();
  }

  override update(_time: number, delta: number): void {
    if (this.flashTimer > 0) {
      this.flashTimer -= delta;
      if (this.flashTimer <= 0) {
        this.flashMessage = '';
        this.updateHud();
      }
    }
  }

  private updateHud(): void {
    if (!this.hudEl) return;
    const tile = this.map[this.currentTile.y][this.currentTile.x];
    const info = TILE_INFO[tile];
    const speedPct = Math.round(info.speedMod * 100);
    const flashLine = this.flashMessage
      ? `<div style="color:#d97070;margin-top:6px">⚠ ${this.flashMessage}</div>`
      : '';
    this.hudEl.innerHTML = `
      <div><b>CARGORA</b> · Stunde-1-Prototyp</div>
      <div style="margin-top:4px;color:#7a8494;font-size:0.7rem">Untergrund: ${info.name}</div>
      <div style="color:#7a8494;font-size:0.7rem">Speed-Modifier: ${speedPct}%</div>
      <div style="color:#7a8494;font-size:0.7rem">Position: (${this.currentTile.x}, ${this.currentTile.y})</div>
      <div style="margin-top:8px;color:#3a424e;font-size:0.65rem">Klick: LKW fahren · Scroll: Zoom</div>
      ${flashLine}
    `;
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: MAP_W * TILE_SIZE,
  height: MAP_H * TILE_SIZE,
  parent: 'app',
  backgroundColor: '#0d0f13',
  scene: [GameScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
