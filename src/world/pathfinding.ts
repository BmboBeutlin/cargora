import { TILE_INFO } from './map';
import type { TileType } from './map';

export type Point = { x: number; y: number };

// A* pathfinding on a 4-connected grid.
// Cost per tile = 1 / speedMod (slower tiles cost more, faster ones cost less).
// Tiles with speedMod=0 are impassable.
export function findPath(
  start: Point,
  goal: Point,
  tiles: TileType[][]
): Point[] | null {
  const H = tiles.length;
  if (H === 0) return null;
  const W = tiles[0].length;

  const isInBounds = (p: Point) => p.x >= 0 && p.y >= 0 && p.x < W && p.y < H;
  const isWalkable = (p: Point) =>
    isInBounds(p) && TILE_INFO[tiles[p.y][p.x]].speedMod > 0;
  const tileCost = (p: Point) => 1 / TILE_INFO[tiles[p.y][p.x]].speedMod;
  const heuristic = (a: Point, b: Point) =>
    Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  const key = (p: Point) => `${p.x},${p.y}`;

  if (!isWalkable(goal)) return null;

  const open = new Map<string, Point>();
  open.set(key(start), start);
  const cameFrom = new Map<string, Point>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  gScore.set(key(start), 0);
  fScore.set(key(start), heuristic(start, goal));

  // Cap iterations to prevent runaway loops on disconnected maps.
  let iterations = 0;
  const maxIterations = W * H * 4;

  while (open.size > 0 && iterations < maxIterations) {
    iterations++;

    let current: Point | null = null;
    let currentF = Infinity;
    for (const [k, p] of open) {
      const f = fScore.get(k) ?? Infinity;
      if (f < currentF) {
        currentF = f;
        current = p;
      }
    }
    if (!current) break;

    if (current.x === goal.x && current.y === goal.y) {
      const path: Point[] = [current];
      let cur: Point = current;
      while (cameFrom.has(key(cur))) {
        cur = cameFrom.get(key(cur))!;
        path.unshift(cur);
      }
      return path;
    }

    open.delete(key(current));

    const neighbors: Point[] = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const n of neighbors) {
      if (!isWalkable(n)) continue;
      const tentativeG =
        (gScore.get(key(current)) ?? Infinity) + tileCost(n);
      if (tentativeG < (gScore.get(key(n)) ?? Infinity)) {
        cameFrom.set(key(n), current);
        gScore.set(key(n), tentativeG);
        fScore.set(key(n), tentativeG + heuristic(n, goal));
        if (!open.has(key(n))) open.set(key(n), n);
      }
    }
  }

  return null;
}
