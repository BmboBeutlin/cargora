/**
 * Vehicle: ein autonomer LKW auf der Karte.
 * Eigene Position, Heading, Color. Eigener Auto-Drive-Loop.
 */

import Phaser from 'phaser';
import { TILE_INFO, BASE_PIXELS_PER_MS } from '../world/map';
import type { TileType } from '../world/map';
import { findPath } from '../world/pathfinding';
import type { Point } from '../world/pathfinding';
import { coloredTruckKey } from '../assets/sprites';
import type { Heading, TruckColor } from '../assets/sprites';

const HEIGHT_PIXELS = 8;
const DEPTH_PER_ROW = 100;
const DEPTH_VEHICLE = 50;

export type VehicleConfig = {
  scene: Phaser.Scene;
  startTile: Point;
  color: TruckColor;
  heading: Heading;
  gridToScreen: (gx: number, gy: number) => { x: number; y: number };
  map: TileType[][];
  heights: number[][];
  scale?: number;
  autoDriveDelay?: number; // ms zwischen Routen
};

export class Vehicle {
  public readonly img: Phaser.GameObjects.Image;
  public currentTile: Point;
  public heading: Heading;
  public color: TruckColor;
  public moving = false;
  private currentPath: Point[] = [];
  private pathStepIndex = 0;
  private scene: Phaser.Scene;
  private gridToScreen: (gx: number, gy: number) => { x: number; y: number };
  private map: TileType[][];
  private heights: number[][];
  private autoDriveDelay: number;

  constructor(cfg: VehicleConfig) {
    this.scene = cfg.scene;
    this.currentTile = { ...cfg.startTile };
    this.heading = cfg.heading;
    this.color = cfg.color;
    this.gridToScreen = cfg.gridToScreen;
    this.map = cfg.map;
    this.heights = cfg.heights;
    this.autoDriveDelay = cfg.autoDriveDelay ?? 1200;

    const start = this.gridToScreen(this.currentTile.x, this.currentTile.y);
    const startH = this.heights[this.currentTile.y][this.currentTile.x];
    this.img = cfg.scene.add.image(
      start.x,
      start.y - 10 - startH * HEIGHT_PIXELS,
      coloredTruckKey(cfg.color, cfg.heading)
    );
    this.img.setScale(cfg.scale ?? 1.0);
    this.img.setDepth(this.currentTile.y * DEPTH_PER_ROW + DEPTH_VEHICLE);
  }

  setHeading(h: Heading): void {
    if (h === this.heading) return;
    this.heading = h;
    this.img.setTexture(coloredTruckKey(this.color, h));
  }

  navigateTo(tx: number, ty: number, onComplete?: () => void): void {
    const target = this.map[ty][tx];
    if (TILE_INFO[target].speedMod === 0) {
      onComplete?.();
      return;
    }
    const path = findPath(
      { x: this.currentTile.x, y: this.currentTile.y },
      { x: tx, y: ty },
      this.map
    );
    if (!path || path.length < 2) {
      onComplete?.();
      return;
    }
    this.currentPath = path;
    this.pathStepIndex = 1;
    this.moving = true;
    this.advancePath(onComplete);
  }

  private advancePath(onComplete?: () => void): void {
    if (this.pathStepIndex >= this.currentPath.length) {
      this.moving = false;
      onComplete?.();
      return;
    }
    const next = this.currentPath[this.pathStepIndex];
    const fromTile = this.currentPath[this.pathStepIndex - 1];
    const dx = next.x - fromTile.x;
    const dy = next.y - fromTile.y;
    let h: Heading = this.heading;
    if (dx > 0) h = 'se';
    else if (dx < 0) h = 'nw';
    else if (dy > 0) h = 'sw';
    else h = 'ne';
    this.setHeading(h);

    const fromInfo = TILE_INFO[this.map[fromTile.y][fromTile.x]];
    const toInfo = TILE_INFO[this.map[next.y][next.x]];
    const avgSpeed = (fromInfo.speedMod + toInfo.speedMod) / 2;

    const fromS = this.gridToScreen(fromTile.x, fromTile.y);
    const toS = this.gridToScreen(next.x, next.y);
    const toH = this.heights[next.y][next.x];
    const distance = Math.hypot(toS.x - fromS.x, toS.y - fromS.y);
    const duration = distance / (BASE_PIXELS_PER_MS * avgSpeed);
    const fromGy = fromTile.y;
    const toGy = next.y;

    this.scene.tweens.add({
      targets: this.img,
      x: toS.x,
      y: toS.y - 10 - toH * HEIGHT_PIXELS,
      duration,
      ease: 'Linear',
      onUpdate: (tween) => {
        const t = tween.progress;
        const interpGy = fromGy + (toGy - fromGy) * t;
        this.img.setDepth(interpGy * DEPTH_PER_ROW + DEPTH_VEHICLE);
      },
      onComplete: () => {
        this.currentTile = { x: next.x, y: next.y };
        this.pathStepIndex++;
        this.advancePath(onComplete);
      },
    });
  }

  startAutoDrive(targets: Point[]): void {
    const next = () => {
      if (targets.length === 0) return;
      // zufaelliges Target aus den 5 weitesten
      const sorted = targets
        .map((t) => ({ t, d: Math.abs(t.x - this.currentTile.x) + Math.abs(t.y - this.currentTile.y) }))
        .sort((a, b) => b.d - a.d)
        .slice(0, 6);
      const pick = sorted[Math.floor(Math.random() * sorted.length)].t;
      this.navigateTo(pick.x, pick.y, () => {
        this.scene.time.delayedCall(this.autoDriveDelay, next);
      });
    };
    this.scene.time.delayedCall(800 + Math.random() * 400, next);
  }
}
