import Phaser from 'phaser';
import {
  MAP_W, MAP_H,
  TILE_INFO, BASE_PIXELS_PER_MS,
  START_TILE,
  buildWorld,
} from '../world/map';
import type { TileType, BridgeTile } from '../world/map';
import { findPath } from '../world/pathfinding';
import type { Point } from '../world/pathfinding';
import { renderHud, flashHud } from '../ui/hud';
import {
  createTruckSpriteSet,
  createGrassTileSprite,
  createSchotterTileSprite,
  createFeldwegTileSprite,
  createAsphaltOverlaySprite,
  createEastWallSprite,
  createSouthWallSprite,
  createBridgePillarSprite,
  parseConnectionsKey,
  ALL_CONNECTION_KEYS,
  SPRITE_KEYS,
  eastWallKey,
  southWallKey,
  bridgePillarKey,
} from '../assets/sprites';
import type { Heading } from '../assets/sprites';

const TILE_W = 64;
const TILE_H = 32;
const HEIGHT_PIXELS = 8; // 1 Welt-Z = 8 Pixel höher auf dem Bildschirm

const ORIGIN_X = 480 - ((MAP_W - 1) - (MAP_H - 1)) * (TILE_W / 4);
const ORIGIN_Y = 350 - ((MAP_W - 1) + (MAP_H - 1)) * (TILE_H / 4);


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

const HEADING_TEXTURE_KEY: Record<Heading, string> = {
  se: SPRITE_KEYS.truckSE,
  nw: SPRITE_KEYS.truckNW,
  sw: SPRITE_KEYS.truckSW,
  ne: SPRITE_KEYS.truckNE,
};

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

// Brücken-Connections: Brücke verbindet sich mit anderen Brücken UND mit Boden-Asphalt am Endpunkt
function getBridgeConnectionsKey(bridges: BridgeTile[], x: number, y: number): string {
  const hasBridge = (xx: number, yy: number): boolean =>
    bridges.some((b) => b.x === xx && b.y === yy);
  const N = hasBridge(x, y - 1);
  const E = hasBridge(x + 1, y);
  const S = hasBridge(x, y + 1);
  const W = hasBridge(x - 1, y);
  return `${N ? '1' : '0'}${E ? '1' : '0'}${S ? '1' : '0'}${W ? '1' : '0'}`;
}

export class CabinetIsoScene extends Phaser.Scene {
  private map: TileType[][] = [];
  private heights: number[][] = [];
  private bridges: BridgeTile[] = [];
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
    const world = buildWorld();
    this.map = world.tiles;
    this.heights = world.heights;
    this.bridges = world.bridges;

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const tile = this.map[y][x];
        const h = this.heights[y][x];
        const { x: sx, y: sy } = gridToScreen(x, y);
        const renderY = sy - h * HEIGHT_PIXELS;
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
        const img = this.add.image(sx, renderY, textureKey);
        // Depth: grundsätzlich Iso-Y-Sort, höhere Tiles bekommen leichten Bonus
        img.setDepth(sy + h * 0.5);

        // Höhen-Schattierung: höhere Tiles bekommen Licht-Highlight (Sonnenlicht-Effekt)
        if (h > 0) {
          const highlight = this.add.image(sx, renderY, textureKey);
          highlight.setAlpha(Math.min(0.35, 0.15 * h));
          highlight.setTint(0xffffe8);
          highlight.setBlendMode(Phaser.BlendModes.ADD);
          highlight.setDepth(sy + h * 0.5 + 0.01);
        }

        // Höhen-Wände: rendere Wand-Sprites zur E- und S-Seite, wenn höher als Nachbar
        // East-Wand (Welt X+, Bildschirm rechts-unten)
        // Geteilte Edge geht von Tile-S-Spitze (sx, renderY+16) zu Tile-E-Spitze (sx+32, renderY)
        // Sprite-Top-Left bei (sx, renderY): Edge verläuft im Sprite von (0, 16) nach (32, 0)
        if (x + 1 < MAP_W) {
          const hE = this.heights[y][x + 1];
          if (h > hE) {
            const diff = h - hE;
            const wall = this.add.image(sx, renderY, eastWallKey(diff));
            wall.setOrigin(0, 0);
            wall.setDepth(sy + h * 0.5 - 0.1);
          }
        }
        // South-Nachbar (Welt Y+, Bildschirm links-unten)
        // Geteilte Edge: zwischen W-Spitze (sx-32, sy) und S-Spitze (sx, sy+16)
        // Sprite-Top-Left bei (sx - 32, sy - h*HEIGHT_PIXELS) (= W-Spitze des erhöhten Tiles)
        if (y + 1 < MAP_H) {
          const hS = this.heights[y + 1][x];
          if (h > hS) {
            const diff = h - hS;
            const wall = this.add.image(sx - TILE_W / 2, renderY, southWallKey(diff));
            wall.setOrigin(0, 0);
            wall.setDepth(sy + h * 0.5 - 0.1);
          }
        }
      }
    }

    // Brücken rendern: Asphalt-Tile auf erhöhter Position + Pfeiler darunter
    for (const bridge of this.bridges) {
      const { x: sx, y: sy } = gridToScreen(bridge.x, bridge.y);
      const baseH = this.heights[bridge.y][bridge.x];
      const bridgeH = bridge.bridgeHeight;
      const pillarH = (bridgeH - baseH) * HEIGHT_PIXELS;

      // Pfeiler links und rechts vom Tile-Center, an den seitlichen Diamond-Spitzen
      if (pillarH > 0) {
        const pKey = bridgePillarKey(pillarH);
        // Linker Pfeiler an W-Diamond-Spitze (sx-32, sy)
        const pillarLeft = this.add.image(sx - 16, sy + 4 - baseH * HEIGHT_PIXELS, pKey);
        pillarLeft.setOrigin(0.5, 1);
        pillarLeft.setDepth(sy + 2);
        // Rechter Pfeiler an E-Diamond-Spitze (sx+32, sy)
        const pillarRight = this.add.image(sx + 16, sy + 4 - baseH * HEIGHT_PIXELS, pKey);
        pillarRight.setOrigin(0.5, 1);
        pillarRight.setDepth(sy + 2);
      }

      // Brücken-Asphalt-Sprite — Auto-Tile basierend auf anderen Brücken-Tiles
      const bridgeConnKey = getBridgeConnectionsKey(this.bridges, bridge.x, bridge.y);
      const bridgeImg = this.add.image(sx, sy - bridgeH * HEIGHT_PIXELS, asphaltKey(bridgeConnKey));
      bridgeImg.setDepth(sy + bridgeH * 8 + 1000); // immer ÜBER allem darunter
    }

    const halfW = TILE_W / 2;
    const halfH = TILE_H / 2;
    const diamond = [-halfW, 0, 0, -halfH, halfW, 0, 0, halfH];
    this.hoverTile = this.add.polygon(0, 0, diamond, 0xffffff, 0);
    this.hoverTile.setStrokeStyle(2, 0xffffff, 0.85);
    this.hoverTile.setDepth(99999);
    this.hoverTile.setVisible(false);

    const start = gridToScreen(this.currentTile.x, this.currentTile.y);
    const startH = this.heights[this.currentTile.y][this.currentTile.x];
    this.truck = this.add.image(start.x, start.y - 6 - startH * HEIGHT_PIXELS, HEADING_TEXTURE_KEY[this.currentHeading]);
    this.truck.setScale(0.65);
    this.truck.setDepth(start.y + 1000 + startH);

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

    // Wand-Sprites für Höhendifferenzen 1, 2, 3 (mehr falls benötigt)
    for (let diff = 1; diff <= 3; diff++) {
      const eKey = eastWallKey(diff);
      if (!tex.exists(eKey)) tex.addCanvas(eKey, createEastWallSprite(diff));
      const sKey = southWallKey(diff);
      if (!tex.exists(sKey)) tex.addCanvas(sKey, createSouthWallSprite(diff));
    }

    // Brücken-Pfeiler-Sprites (1-3 Höhe)
    for (let h = 1; h <= 3; h++) {
      const pKey = bridgePillarKey(h * HEIGHT_PIXELS);
      if (!tex.exists(pKey)) tex.addCanvas(pKey, createBridgePillarSprite(h * HEIGHT_PIXELS));
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
    const toH = this.heights[next.y][next.x];
    const distance = Math.hypot(toS.x - fromS.x, toS.y - fromS.y);
    const duration = distance / (BASE_PIXELS_PER_MS * avgSpeed);

    this.tweens.add({
      targets: this.truck,
      x: toS.x,
      y: toS.y - 6 - toH * HEIGHT_PIXELS,
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
