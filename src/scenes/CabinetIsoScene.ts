import Phaser from 'phaser';
import {
  MAP_W, MAP_H,
  TILE_INFO, BASE_PIXELS_PER_MS,
  START_TILE,
  buildMap,
} from '../world/map';
import type { TileType } from '../world/map';
import { renderHud, flashHud } from '../ui/hud';

const TILE_W = 64;
const TILE_H = 32;
const ORIGIN_X = 480;
const ORIGIN_Y = 80;

function gridToScreen(gx: number, gy: number): { x: number; y: number } {
  return {
    x: ORIGIN_X + (gx - gy) * (TILE_W / 2),
    y: ORIGIN_Y + (gx + gy) * (TILE_H / 2),
  };
}

function screenToGrid(sx: number, sy: number): { x: number; y: number } {
  const dx = (sx - ORIGIN_X) / (TILE_W / 2);
  const dy = (sy - ORIGIN_Y) / (TILE_H / 2);
  // Math.round, nicht floor: Diamond-Tiles sind um ihre Welt-Koords ZENTRIERT.
  return {
    x: Math.round((dx + dy) / 2),
    y: Math.round((dy - dx) / 2),
  };
}

export class CabinetIsoScene extends Phaser.Scene {
  private map: TileType[][] = [];
  private truck!: Phaser.GameObjects.Polygon;
  private truckTop!: Phaser.GameObjects.Polygon;
  private hoverTile!: Phaser.GameObjects.Polygon;
  private moving = false;
  private currentTile = { ...START_TILE };
  private hoveredTile: { x: number; y: number } | null = null;
  private flashTimer = 0;
  private flashMessage = '';

  constructor() {
    super('cabinet-iso');
  }

  create(): void {
    this.map = buildMap();

    const halfW = TILE_W / 2;
    const halfH = TILE_H / 2;
    const diamond = [-halfW, 0, 0, -halfH, halfW, 0, 0, halfH];

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const info = TILE_INFO[this.map[y][x]];
        const { x: sx, y: sy } = gridToScreen(x, y);
        const tile = this.add.polygon(sx, sy, diamond, info.color);
        // KEIN Stroke mehr — Tiles fließen ineinander
        tile.setDepth(sy);
      }
    }

    // Hover-Highlight (über allen Tiles, unter den Vehicles)
    this.hoverTile = this.add.polygon(0, 0, diamond, 0xffffff, 0);
    this.hoverTile.setStrokeStyle(2, 0xffffff, 0.85);
    this.hoverTile.setDepth(99999);
    this.hoverTile.setVisible(false);

    const start = gridToScreen(this.currentTile.x, this.currentTile.y);
    const truckBox = [-12, -6, 12, -6, 12, 6, -12, 6];
    const truckTop = [-10, -16, 10, -16, 12, -6, -12, -6];
    this.truck = this.add.polygon(start.x, start.y - 6, truckBox, 0x3a78c8);
    this.truck.setDepth(start.y + 1000);
    this.truckTop = this.add.polygon(start.x, start.y - 6, truckTop, 0x5a98e8);
    this.truckTop.setDepth(start.y + 1001);

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      const wp = this.cameras.main.getWorldPoint(p.x, p.y);
      const grid = screenToGrid(wp.x, wp.y);
      if (grid.x < 0 || grid.y < 0 || grid.x >= MAP_W || grid.y >= MAP_H) {
        this.hoveredTile = null;
        this.hoverTile.setVisible(false);
        return;
      }
      this.hoveredTile = grid;
      const screen = gridToScreen(grid.x, grid.y);
      this.hoverTile.setPosition(screen.x, screen.y);
      this.hoverTile.setVisible(true);
      this.updateHud();
    });

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.moving) return;
      const wp = this.cameras.main.getWorldPoint(p.x, p.y);
      const grid = screenToGrid(wp.x, wp.y);
      if (grid.x < 0 || grid.y < 0 || grid.x >= MAP_W || grid.y >= MAP_H) return;
      this.moveTo(grid.x, grid.y);
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

    const fromS = gridToScreen(this.currentTile.x, this.currentTile.y);
    const toS = gridToScreen(tx, ty);
    const distance = Math.hypot(toS.x - fromS.x, toS.y - fromS.y);
    const duration = distance / (BASE_PIXELS_PER_MS * avgSpeed);

    this.moving = true;
    this.tweens.add({
      targets: [this.truck, this.truckTop],
      x: toS.x,
      y: toS.y - 6,
      duration,
      ease: 'Linear',
      onUpdate: () => {
        this.truck.setDepth(this.truck.y + 1000);
        this.truckTop.setDepth(this.truck.y + 1001);
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
    const hoveredInfo = this.hoveredTile
      ? {
          tile: this.map[this.hoveredTile.y][this.hoveredTile.x],
          position: this.hoveredTile,
        }
      : null;
    renderHud({
      mode: 'Cabinet-Iso',
      tile,
      position: this.currentTile,
      flashMessage: this.flashMessage,
      hovered: hoveredInfo,
    });
  }
}
