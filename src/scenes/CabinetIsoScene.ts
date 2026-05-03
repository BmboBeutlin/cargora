import Phaser from 'phaser';
import {
  MAP_W, MAP_H,
  TILE_INFO, BASE_PIXELS_PER_MS,
  START_TILE,
  buildWorld,
} from '../world/map';
import type { TileType, BridgeTile, Decoration } from '../world/map';
import { findPath } from '../world/pathfinding';
import type { Point } from '../world/pathfinding';
import { renderHud, flashHud } from '../ui/hud';
import {
  createTruckSpriteSet,
  createColoredTruckSet,
  TRUCK_COLORS,
  coloredTruckKey,
  createGrassTileSprite,
  createSchotterTileSprite,
  createFeldwegTileSprite,
  createAsphaltOverlaySprite,
  createRailOverlaySprite,
  parseRailConnectionsKey,
  createEastWallSprite,
  createSouthWallSprite,
  createBridgePillarSprite,
  createTreeSprite,
  createPineSprite,
  createBushSprite,
  createWaterTileSprite,
  createHouseSprite,
  createApartmentSprite,
  createCottageSprite,
  createTunnelEastSprite,
  createCloudLargeSprite,
  createCloudMediumSprite,
  createCloudSmallSprite,
  createFactorySprite,
  createBoatSprite,
  parseConnectionsKey,
  ALL_CONNECTION_KEYS,
  SPRITE_KEYS,
  eastWallKey,
  southWallKey,
  bridgePillarKey,
  bridgeAsphaltKey,
} from '../assets/sprites';
import type { Heading, TruckColor } from '../assets/sprites';
import { Vehicle } from '../entities/Vehicle';

const TILE_W = 64;
const TILE_H = 32;
const HEIGHT_PIXELS = 8; // 1 Welt-Z = 8 Pixel höher auf dem Bildschirm

// Y-Sort Depth-Berechnung: basiert auf grid_y, nicht screen_y.
// So überdeckt ein Berg vorne (höheres grid_y) automatisch alles dahinter (niedrigeres grid_y),
// inklusive LKWs.
const DEPTH_PER_ROW = 100;
const DEPTH_TILE = 0;
const DEPTH_WALL = 5;
const DEPTH_HIGHLIGHT = 8;
const DEPTH_PILLAR = 20;
const DEPTH_VEHICLE = 50;
const DEPTH_BRIDGE_TILE = 70;
const DEPTH_PATH_MARKER = 30;
const DEPTH_HOVER = 999999;

const ORIGIN_X = 480 - ((MAP_W - 1) - (MAP_H - 1)) * (TILE_W / 4);
const ORIGIN_Y = 350 - ((MAP_W - 1) + (MAP_H - 1)) * (TILE_H / 4);


// Texture-Key für eine Asphalt-Auto-Tile-Variante
function asphaltKey(connKey: string): string {
  return `sprite-asphalt-${connKey}`;
}
function railKey(connKey: string): string {
  return `sprite-rail-${connKey}`;
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

function getRailConnectionsKey(map: TileType[][], x: number, y: number): string {
  const isRail = (xx: number, yy: number): boolean =>
    xx >= 0 && yy >= 0 && xx < MAP_W && yy < MAP_H && map[yy][xx] === 'schiene';
  const N = isRail(x, y - 1);
  const E = isRail(x + 1, y);
  const S = isRail(x, y + 1);
  const W = isRail(x - 1, y);
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
  private decorations: Decoration[] = [];
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
  private autoMode = true;
  private autoTargets: { x: number; y: number }[] = [];
  private extraVehicles: Vehicle[] = [];

  constructor() {
    super('cabinet-iso');
  }

  create(): void {
    this.registerSpriteTextures();
    const world = buildWorld();
    this.map = world.tiles;
    this.heights = world.heights;
    this.bridges = world.bridges;
    this.decorations = world.decorations;

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
        } else if (tile === 'schiene') {
          const connKey = getRailConnectionsKey(this.map, x, y);
          textureKey = railKey(connKey);
        } else if (tile === 'gras') {
          textureKey = SPRITE_KEYS.tileGrass;
        } else if (tile === 'schotter') {
          textureKey = SPRITE_KEYS.tileSchotter;
        } else if (tile === 'wasser') {
          textureKey = SPRITE_KEYS.tileWasser;
        } else {
          textureKey = SPRITE_KEYS.tileFeldweg;
        }
        const img = this.add.image(sx, renderY, textureKey);
        img.setDepth(y * DEPTH_PER_ROW + DEPTH_TILE + h * 0.1);

        // Höhen-Schattierung: höhere Tiles bekommen Licht-Highlight (Sonnenlicht-Effekt)
        if (h > 0) {
          const highlight = this.add.image(sx, renderY, textureKey);
          highlight.setAlpha(Math.min(0.35, 0.15 * h));
          highlight.setTint(0xffffe8);
          highlight.setBlendMode(Phaser.BlendModes.ADD);
          highlight.setDepth(y * DEPTH_PER_ROW + DEPTH_HIGHLIGHT + h * 0.1);
        }

        // Höhen-Wände
        if (x + 1 < MAP_W) {
          const hE = this.heights[y][x + 1];
          if (h > hE) {
            const diff = h - hE;
            const wall = this.add.image(sx, renderY, eastWallKey(diff));
            wall.setOrigin(0, 0);
            // Wand "gehört" optisch zum Nachbar-Tile (er ist niedriger, sieht die Wand zu sich hin)
            wall.setDepth(y * DEPTH_PER_ROW + DEPTH_WALL);
          }
        }
        if (y + 1 < MAP_H) {
          const hS = this.heights[y + 1][x];
          if (h > hS) {
            const diff = h - hS;
            const wall = this.add.image(sx - TILE_W / 2, renderY, southWallKey(diff));
            wall.setOrigin(0, 0);
            // South-Wand: Nachbar-Tile ist y+1, also depth zur diesem Nachbar zuordnen
            wall.setDepth((y + 1) * DEPTH_PER_ROW - 1);
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

      if (pillarH > 0) {
        const pKey = bridgePillarKey(pillarH);
        const pillarLeft = this.add.image(sx - 16, sy + 4 - baseH * HEIGHT_PIXELS, pKey);
        pillarLeft.setOrigin(0.5, 1);
        pillarLeft.setDepth(bridge.y * DEPTH_PER_ROW + DEPTH_PILLAR);
        const pillarRight = this.add.image(sx + 16, sy + 4 - baseH * HEIGHT_PIXELS, pKey);
        pillarRight.setOrigin(0.5, 1);
        pillarRight.setDepth(bridge.y * DEPTH_PER_ROW + DEPTH_PILLAR);
      }

      const bridgeConnKey = getBridgeConnectionsKey(this.bridges, bridge.x, bridge.y);
      // Brücken-Variante OHNE Gras-Hintergrund verwenden
      const bridgeImg = this.add.image(sx, sy - bridgeH * HEIGHT_PIXELS, bridgeAsphaltKey(bridgeConnKey));
      bridgeImg.setDepth(bridge.y * DEPTH_PER_ROW + DEPTH_BRIDGE_TILE);
    }

    // Fabrik rendern (Demo: rechts unten in einem Schotter-Bezirk)
    {
      const factoryPos = { x: 13, y: 9 };
      const fs = gridToScreen(factoryPos.x, factoryPos.y);
      const factory = this.add.image(fs.x, fs.y + 4, SPRITE_KEYS.factory);
      factory.setOrigin(0.5, 1);
      factory.setDepth(factoryPos.y * DEPTH_PER_ROW + DEPTH_VEHICLE - 5);
    }

    // Boot auf dem Fluss — animiert von links nach rechts ziehen
    {
      const startScreen = gridToScreen(2, 13);
      const boat = this.add.image(startScreen.x - 50, startScreen.y - 4, SPRITE_KEYS.boat);
      boat.setDepth(13 * DEPTH_PER_ROW + DEPTH_VEHICLE - 10);
      this.tweens.add({
        targets: boat,
        x: startScreen.x + 700,
        duration: 18000,
        ease: 'Linear',
        repeat: -1,
        onRepeat: () => { boat.x = startScreen.x - 100; },
      });
    }

    // Wolken am Himmel — animiert über die Karte ziehen
    const cloudKeys = [SPRITE_KEYS.cloudLarge, SPRITE_KEYS.cloudMedium, SPRITE_KEYS.cloudSmall];
    for (let i = 0; i < 6; i++) {
      const key = cloudKeys[i % 3];
      const startX = -100 + i * 240 + Math.random() * 100;
      const y = 30 + Math.random() * 80;
      const cloud = this.add.image(startX, y, key);
      cloud.setAlpha(0.85);
      cloud.setDepth(DEPTH_HOVER - 2);
      // Animation: über die Karte ziehen, dann von links wieder rein
      const speed = 8000 + Math.random() * 6000;
      this.tweens.add({
        targets: cloud,
        x: 1200,
        duration: speed,
        ease: 'Linear',
        repeat: -1,
        onRepeat: () => { cloud.x = -100; },
      });
    }

    // Tunnel-Eingang rendern (Demo: einer am Berg-Fuß)
    const tunnelDemo = { x: 11, y: 1 };
    {
      const ts = gridToScreen(tunnelDemo.x, tunnelDemo.y);
      const tunnel = this.add.image(ts.x, ts.y + 4, SPRITE_KEYS.tunnelEast);
      tunnel.setOrigin(0.5, 1);
      tunnel.setDepth(tunnelDemo.y * DEPTH_PER_ROW + DEPTH_VEHICLE - 5);
    }

    // Decorations rendern (Bäume, Sträucher) — nach Tiles + Wänden, vor Vehicles
    for (const dec of this.decorations) {
      const { x: sx, y: sy } = gridToScreen(dec.x, dec.y);
      const h = this.heights[dec.y][dec.x] ?? 0;
      const offsetX = (dec.offsetX ?? 0) * 16;
      const offsetY = (dec.offsetY ?? 0) * 8;
      const key =
        dec.kind === 'pine' ? SPRITE_KEYS.pine
        : dec.kind === 'bush' ? SPRITE_KEYS.bush
        : dec.kind === 'house' ? SPRITE_KEYS.house
        : dec.kind === 'apartment' ? SPRITE_KEYS.apartment
        : dec.kind === 'cottage' ? SPRITE_KEYS.cottage
        : SPRITE_KEYS.tree;
      const dx = sx + offsetX;
      const dy = sy - h * HEIGHT_PIXELS + 8 + offsetY;
      const decImg = this.add.image(dx, dy, key);
      decImg.setOrigin(0.5, 1); // bottom-center anchor
      decImg.setDepth(dec.y * DEPTH_PER_ROW + DEPTH_VEHICLE - 5); // unter Vehicles
    }

    const halfW = TILE_W / 2;
    const halfH = TILE_H / 2;
    const diamond = [-halfW, 0, 0, -halfH, halfW, 0, 0, halfH];
    this.hoverTile = this.add.polygon(0, 0, diamond, 0xffffff, 0);
    this.hoverTile.setStrokeStyle(2, 0xffffff, 0.85);
    this.hoverTile.setDepth(DEPTH_HOVER);
    this.hoverTile.setVisible(false);

    const start = gridToScreen(this.currentTile.x, this.currentTile.y);
    const startH = this.heights[this.currentTile.y][this.currentTile.x];
    this.truck = this.add.image(start.x, start.y - 10 - startH * HEIGHT_PIXELS, HEADING_TEXTURE_KEY[this.currentHeading]);
    this.truck.setScale(1.0);
    this.truck.setDepth(this.currentTile.y * DEPTH_PER_ROW + DEPTH_VEHICLE);

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

    // Auto-Drive: sammle alle ebenen Asphalt-Tiles als Demo-Targets
    if (this.autoMode) {
      for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
          if (this.map[y][x] === 'asphalt' && this.heights[y][x] === 0) {
            this.autoTargets.push({ x, y });
          }
        }
      }
      this.time.delayedCall(800, () => this.autoNext());
    }

    // Multi-Vehicle: 4 weitere LKW in verschiedenen Farben spawnen
    const extraColors: TruckColor[] = ['blue', 'green', 'yellow', 'white'];
    const startTiles: Array<{ x: number; y: number }> = [
      { x: 16, y: 2 }, { x: 2, y: 7 }, { x: 16, y: 12 }, { x: 8, y: 8 },
    ];
    for (let i = 0; i < extraColors.length; i++) {
      const startTile = startTiles[i];
      // nur spawnen falls Tile asphalt ist
      if (this.map[startTile.y][startTile.x] !== 'asphalt') continue;
      const v = new Vehicle({
        scene: this,
        startTile,
        color: extraColors[i],
        heading: 'se',
        gridToScreen,
        map: this.map,
        heights: this.heights,
        scale: 1.0,
        autoDriveDelay: 800 + Math.random() * 800,
      });
      v.startAutoDrive(this.autoTargets);
      this.extraVehicles.push(v);
    }

    this.updateHud();
  }

  private autoNext(): void {
    if (!this.autoMode || this.moving) return;
    if (this.autoTargets.length === 0) return;
    // Nächstes Ziel: zufällig aus den 5 vom aktuellen Tile am weitesten entfernten Tiles
    const sorted = this.autoTargets
      .map((t) => ({ t, d: Math.abs(t.x - this.currentTile.x) + Math.abs(t.y - this.currentTile.y) }))
      .sort((a, b) => b.d - a.d)
      .slice(0, 5);
    const pick = sorted[Math.floor(Math.random() * sorted.length)].t;
    this.startNavigation(pick.x, pick.y);
  }

  private registerSpriteTextures(): void {
    const tex = this.textures;
    if (!tex.exists(SPRITE_KEYS.tileGrass)) tex.addCanvas(SPRITE_KEYS.tileGrass, createGrassTileSprite());
    if (!tex.exists(SPRITE_KEYS.tileSchotter)) tex.addCanvas(SPRITE_KEYS.tileSchotter, createSchotterTileSprite());
    if (!tex.exists(SPRITE_KEYS.tileFeldweg)) tex.addCanvas(SPRITE_KEYS.tileFeldweg, createFeldwegTileSprite());
    if (!tex.exists(SPRITE_KEYS.tileWasser)) tex.addCanvas(SPRITE_KEYS.tileWasser, createWaterTileSprite());

    // Alle 16 Asphalt-Auto-Tiling-Varianten: Strassen-Look mit Gras-Background (OpenTTD-Style)
    for (const key of ALL_CONNECTION_KEYS) {
      const texKey = asphaltKey(key);
      if (!tex.exists(texKey)) {
        tex.addCanvas(texKey, createAsphaltOverlaySprite(parseConnectionsKey(key), true));
      }
      // Bridge-Variante: voller Asphalt-Diamond (Brücke ist eine massive Plattform)
      const bKey = bridgeAsphaltKey(key);
      if (!tex.exists(bKey)) {
        tex.addCanvas(bKey, createAsphaltOverlaySprite(parseConnectionsKey(key), false));
      }
      // Schienen-Auto-Tile-Variante
      const rKey = railKey(key);
      if (!tex.exists(rKey)) {
        tex.addCanvas(rKey, createRailOverlaySprite(parseRailConnectionsKey(key)));
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

    // Decorations: Bäume + Sträucher
    if (!tex.exists(SPRITE_KEYS.tree)) tex.addCanvas(SPRITE_KEYS.tree, createTreeSprite());
    if (!tex.exists(SPRITE_KEYS.pine)) tex.addCanvas(SPRITE_KEYS.pine, createPineSprite());
    if (!tex.exists(SPRITE_KEYS.bush)) tex.addCanvas(SPRITE_KEYS.bush, createBushSprite());
    if (!tex.exists(SPRITE_KEYS.house)) tex.addCanvas(SPRITE_KEYS.house, createHouseSprite());
    if (!tex.exists(SPRITE_KEYS.apartment)) tex.addCanvas(SPRITE_KEYS.apartment, createApartmentSprite());
    if (!tex.exists(SPRITE_KEYS.cottage)) tex.addCanvas(SPRITE_KEYS.cottage, createCottageSprite());
    if (!tex.exists(SPRITE_KEYS.tunnelEast)) tex.addCanvas(SPRITE_KEYS.tunnelEast, createTunnelEastSprite());
    if (!tex.exists(SPRITE_KEYS.cloudLarge)) tex.addCanvas(SPRITE_KEYS.cloudLarge, createCloudLargeSprite());
    if (!tex.exists(SPRITE_KEYS.cloudMedium)) tex.addCanvas(SPRITE_KEYS.cloudMedium, createCloudMediumSprite());
    if (!tex.exists(SPRITE_KEYS.cloudSmall)) tex.addCanvas(SPRITE_KEYS.cloudSmall, createCloudSmallSprite());
    if (!tex.exists(SPRITE_KEYS.factory)) tex.addCanvas(SPRITE_KEYS.factory, createFactorySprite());
    if (!tex.exists(SPRITE_KEYS.boat)) tex.addCanvas(SPRITE_KEYS.boat, createBoatSprite());

    // Default-LKW (rot via createTruckSpriteSet) als Haupt-Truck
    const truckSet = createTruckSpriteSet();
    if (!tex.exists(SPRITE_KEYS.truckSE)) tex.addCanvas(SPRITE_KEYS.truckSE, truckSet.se);
    if (!tex.exists(SPRITE_KEYS.truckNW)) tex.addCanvas(SPRITE_KEYS.truckNW, truckSet.nw);
    if (!tex.exists(SPRITE_KEYS.truckSW)) tex.addCanvas(SPRITE_KEYS.truckSW, truckSet.sw);
    if (!tex.exists(SPRITE_KEYS.truckNE)) tex.addCanvas(SPRITE_KEYS.truckNE, truckSet.ne);

    // Multi-Color-Trucks: alle 6 Farben x 4 Headings registrieren
    for (const color of TRUCK_COLORS) {
      const set = createColoredTruckSet(color);
      for (const heading of ['se', 'nw', 'sw', 'ne'] as Heading[]) {
        const key = coloredTruckKey(color, heading);
        if (!tex.exists(key)) tex.addCanvas(key, set[heading]);
      }
    }

    // LKW-Sprite kommt aus vehicles.png (preload)
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
      // Auto-Drive: nächstes Target nach kurzer Pause
      if (this.autoMode) {
        this.time.delayedCall(1200, () => this.autoNext());
      }
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

    // Während des Tweens kontinuierlich Depth aktualisieren basierend auf interpolierter grid_y
    const fromGy = fromTile.y;
    const toGy = next.y;
    this.tweens.add({
      targets: this.truck,
      x: toS.x,
      y: toS.y - 10 - toH * HEIGHT_PIXELS,
      duration,
      ease: 'Linear',
      onUpdate: (tween) => {
        const t = tween.progress;
        const interpGy = fromGy + (toGy - fromGy) * t;
        this.truck.setDepth(interpGy * DEPTH_PER_ROW + DEPTH_VEHICLE);
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
      marker.setDepth(p.y * DEPTH_PER_ROW + DEPTH_PATH_MARKER);
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
