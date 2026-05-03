import Phaser from 'phaser';
import {
  TILE_SIZE, MAP_W, MAP_H,
  TILE_INFO, BASE_PIXELS_PER_MS,
  START_TILE,
  buildMap,
} from '../world/map';
import type { TileType } from '../world/map';
import { renderHud, flashHud } from '../ui/hud';

export class TopDownScene extends Phaser.Scene {
  private map: TileType[][] = [];
  private truck!: Phaser.GameObjects.Rectangle;
  private direction!: Phaser.GameObjects.Rectangle;
  private moving = false;
  private currentTile = { ...START_TILE };
  private flashTimer = 0;
  private flashMessage = '';

  constructor() {
    super('top-down');
  }

  create(): void {
    this.map = buildMap();

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

    this.input.on('wheel', (_p: Phaser.Input.Pointer, _go: unknown, _dx: number, dy: number) => {
      const z = this.cameras.main.zoom;
      const next = Phaser.Math.Clamp(z - dy * 0.001, 0.5, 2.5);
      this.cameras.main.setZoom(next);
    });

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
    flashHud(message, 1500);
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
    const tile = this.map[this.currentTile.y][this.currentTile.x];
    renderHud({
      mode: 'Top-Down (klassisch)',
      tile,
      position: this.currentTile,
      flashMessage: this.flashMessage,
    });
  }
}
