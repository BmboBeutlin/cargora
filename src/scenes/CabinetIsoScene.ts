import Phaser from 'phaser';
import {
  MAP_W, MAP_H,
  TILE_INFO, BASE_PIXELS_PER_MS,
  START_TILE,
  buildMap,
} from '../world/map';
import type { TileType } from '../world/map';
import { findPath } from '../world/pathfinding';
import type { Point } from '../world/pathfinding';
import { renderHud, flashHud } from '../ui/hud';
import {
  createTruckSpriteSet,
  createGrassTileSprite,
  createSchotterTileSprite,
  createFeldwegTileSprite,
  createAsphaltOverlaySprite,
  parseConnectionsKey,
  ALL_CONNECTION_KEYS,
  SPRITE_KEYS,
} from '../assets/sprites';
import type { Heading } from '../assets/sprites';

const TILE_W = 64;
const TILE_H = 32;

const ORIGIN_X = 480 - ((MAP_W - 1) - (MAP_H - 1)) * (TILE_W / 4);
const ORIGIN_Y = 350 - ((MAP_W - 1) + (MAP_H - 1)) * (TILE_H / 4);

const HEADING_TEXTURE_KEY: Record<Heading, string> = {
  se: SPRITE_KEYS.truckSE,
  nw: SPRITE_KEYS.truckNW,
  sw: SPRITE_KEYS.truckSW,
  ne: SPRITE_KEYS.truckNE,
};

// Texture-Key für eine Asphalt-Auto-Tile-Variante
function asphaltKey(connKey: string): string {
  return `sprite-asphalt-${connKey}`;
}

function gridToScreen(gx: number, gy: number): { x: number; y: number } {
  return {
    x: ORIGIN_X + (gx - gy) * (TILE_W / 2),
    y: ORIGIN_Y + (gx + gy) * (TILE_H / 2),
  };
}

function screenToGrid(sx: number, sy: number): { x: number; y: number } {
  const dx = (sx - ORIGIN_X) / (TILE_W / 2);
  const dy = (sy - ORIGIN_Y) / (TILE_H / 2);
  return {
    x: Math.round((dx + dy) / 2),
    y: Math.round((dy - dx) / 2),
  };
}

function computeHeading(from: Point, to: Point): Heading {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx > 0) return 'se';
  if (dx < 0) return 'nw';
  if (dy > 0) return 'sw';
  return 'ne';
}

// Berechne Asphalt-Connections-Key für eine Tile basierend auf Welt-Nachbarn
function getAsphaltConnectionsKey(map: TileType[][], x: number, y: number): string {
  const isAsphalt = (xx: number, yy: number): boolean =>
    xx >= 0 && yy >= 0 && xx < MAP_W && yy < MAP_H && map[yy][xx] === 'asphalt';
  const N = isAsphalt(x, y - 1);
  const E = isAsphalt(x + 1, y);
  const S = isAsphalt(x, y + 1);
  const W = isAsphalt(x - 1, y);
  return `${N ? '1' : '0'}${E ? '1' : '0'}${S ? '1' : '0'}${W ? '1' : '0'}`;
}

export class CabinetIsoScene extends Phaser.Scene {
  private map: TileType[][] = [];
  private truck!: Phaser.GameObjects.Image;
  private hoverTile!: Phaser.GameObjects.Polygon;
  private pathMarkers: Phaser.GameObjects.Arc[] = [];
  private moving = false;
  private currentTile = { ...START_TILE };
  private hoveredTile: { x: number; y: number } | null = null;
  private flashTimer = 0;
  private flashMessage = '';
  private currentPath: Point[] = [];
  private pathStepIndex = 0;
  private currentHeading: Heading = 'se';

  constructor() {
    super('cabinet-iso');
  }

  create(): void {
    this.registerSpriteTextures();
    this.map = buildMap();

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const tile = this.map[y][x];
        const { x: sx, y: sy } = gridToScreen(x, y);
        let textureKey: string;
        if (tile === 'asphalt') {
          const connKey = getAsphaltConnectionsKey(this.map, x, y);
          textureKey = asphaltKey(connKey);
        } else if (tile === 'gras') {
          textureKey = SPRITE_KEYS.tileGrass;
        } else if (tile === 'schotter') {
          textureKey = SPRITE_KEYS.tileSchotter;
        } else {
          textureKey = SPRITE_KEYS.tileFeldweg;
        }
        const img = this.add.image(sx, sy, textureKey);
        img.setDepth(sy);
      }
    }

    const halfW = TILE_W / 2;
    const halfH = TILE_H / 2;
    const diamond = [-halfW, 0, 0, -halfH, halfW, 0, 0, halfH];
    this.hoverTile = this.add.polygon(0, 0, diamond, 0xffffff, 0);
    this.hoverTile.setStrokeStyle(2, 0xffffff, 0.85);
    this.hoverTile.setDepth(99999);
    this.hoverTile.setVisible(false);

    const start = gridToScreen(this.currentTile.x, this.currentTile.y);
    this.truck = this.add.image(start.x, start.y - 6, HEADING_TEXTURE_KEY[this.currentHeading]);
    this.truck.setScale(0.65); // LKW kleiner: ca 1/3 Tile-Breite, OpenTTD-Maßstab
    this.truck.setDepth(start.y + 1000);

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
      this.startNavigation(grid.x, grid.y);
    });

    this.input.on('wheel', (_p: Phaser.Input.Pointer, _go: unknown, _dx: number, dy: number) => {
      const z = this.cameras.main.zoom;
      const next = Phaser.Math.Clamp(z - dy * 0.001, 0.5, 2.5);
      this.cameras.main.setZoom(next);
    });

    this.updateHud();
  }

  private registerSpriteTextures(): void {
    const tex = this.textures;
    if (!tex.exists(SPRITE_KEYS.tileGrass)) tex.addCanvas(SPRITE_KEYS.tileGrass, createGrassTileSprite());
    if (!tex.exists(SPRITE_KEYS.tileSchotter)) tex.addCanvas(SPRITE_KEYS.tileSchotter, createSchotterTileSprite());
    if (!tex.exists(SPRITE_KEYS.tileFeldweg)) tex.addCanvas(SPRITE_KEYS.tileFeldweg, createFeldwegTileSprite());

    // Alle 16 Asphalt-Auto-Tiling-Varianten registrieren
    for (const key of ALL_CONNECTION_KEYS) {
      const texKey = asphaltKey(key);
      if (!tex.exists(texKey)) {
        tex.addCanvas(texKey, createAsphaltOverlaySprite(parseConnectionsKey(key)));
      }
    }

    const truckSet = createTruckSpriteSet();
    if (!tex.exists(SPRITE_KEYS.truckSE)) tex.addCanvas(SPRITE_KEYS.truckSE, truckSet.se);
    if (!tex.exists(SPRITE_KEYS.truckNW)) tex.addCanvas(SPRITE_KEYS.truckNW, truckSet.nw);
    if (!tex.exists(SPRITE_KEYS.truckSW)) tex.addCanvas(SPRITE_KEYS.truckSW, truckSet.sw);
    if (!tex.exists(SPRITE_KEYS.truckNE)) tex.addCanvas(SPRITE_KEYS.truckNE, truckSet.ne);
  }

  private setHeading(h: Heading): void {
    if (h === this.currentHeading) return;
    this.currentHeading = h;
    this.truck.setTexture(HEADING_TEXTURE_KEY[h]);
  }

  private startNavigation(tx: number, ty: number): void {
    const target = this.map[ty][tx];
    const targetInfo = TILE_INFO[target];
    if (targetInfo.speedMod === 0) {
      this.flash(`${targetInfo.name} – nicht befahrbar`);
      return;
    }

    const path = findPath(
      { x: this.currentTile.x, y: this.currentTile.y },
      { x: tx, y: ty },
      this.map
    );

    if (!path || path.length < 2) {
      this.flash('Kein Weg gefunden');
      return;
    }

    this.drawPath(path);
    this.currentPath = path;
    this.pathStepIndex = 1;
    this.moving = true;
    this.advancePath();
  }

  private advancePath(): void {
    if (this.pathStepIndex >= this.currentPath.length) {
      this.moving = false;
      this.clearPathMarkers();
      this.updateHud();
      return;
    }

    const next = this.currentPath[this.pathStepIndex];
    const fromTile = this.currentPath[this.pathStepIndex - 1];

    this.setHeading(computeHeading(fromTile, next));

    const fromInfo = TILE_INFO[this.map[fromTile.y][fromTile.x]];
    const toInfo = TILE_INFO[this.map[next.y][next.x]];
    const avgSpeed = (fromInfo.speedMod + toInfo.speedMod) / 2;

    const fromS = gridToScreen(fromTile.x, fromTile.y);
    const toS = gridToScreen(next.x, next.y);
    const distance = Math.hypot(toS.x - fromS.x, toS.y - fromS.y);
    const duration = distance / (BASE_PIXELS_PER_MS * avgSpeed);

    this.tweens.add({
      targets: this.truck,
      x: toS.x,
      y: toS.y - 6,
      duration,
      ease: 'Linear',
      onUpdate: () => {
        this.truck.setDepth(this.truck.y + 1000);
      },
      onComplete: () => {
        this.currentTile = { x: next.x, y: next.y };
        this.consumePathMarker();
        this.pathStepIndex++;
        this.updateHud();
        this.advancePath();
      },
    });
  }

  private drawPath(path: Point[]): void {
    this.clearPathMarkers();
    for (let i = 1; i < path.length; i++) {
      const p = path[i];
      const s = gridToScreen(p.x, p.y);
      const isLast = i === path.length - 1;
      const marker = this.add.circle(
        s.x,
        s.y,
        isLast ? 5 : 3,
        isLast ? 0xf0882a : 0xffffff,
        isLast ? 1 : 0.55
      );
      marker.setDepth(s.y + 500);
      this.pathMarkers.push(marker);
    }
  }

  private consumePathMarker(): void {
    const marker = this.pathMarkers.shift();
    if (marker) marker.destroy();
  }

  private clearPathMarkers(): void {
    for (const m of this.pathMarkers) m.destroy();
    this.pathMarkers = [];
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
      mode: 'Cabinet-Iso · Auto-Tiling · Heading',
      tile,
      position: this.currentTile,
      flashMessage: this.flashMessage,
      hovered: hoveredInfo,
    });
  }
}
