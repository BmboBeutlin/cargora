/**
 * Spline-Renderer: zeichnet RoadEdges als Asphalt-Linien in der Cabinet-Iso-Welt.
 *
 * Pfad B Schritt 2 — initial demo, kein Auto-Connect mit anderen Edges,
 * keine echten Pixel-Art-Sprites (Phaser Graphics mit Anti-Aliasing für jetzt).
 *
 * Spätere Iterationen:
 *   - Auto-Connect zwischen Edges an Junctions
 *   - Pixel-perfect Linien (Off-Screen-Canvas + Texture-Cache)
 *   - Z-Höhe-Visualisierung (Brücken-Schatten + Pfeiler)
 *   - Lane-Markierungen (Mittelstreifen abhängig von Lane-Count)
 */

import Phaser from 'phaser';
import type { RoadGraph } from './road-graph';
import { positionOnEdge } from './road-graph';

export type GridToScreenFn = (gx: number, gy: number) => { x: number; y: number };

const SAMPLES_PER_EDGE = 30;
const HEIGHT_PIXELS = 8; // 1 Welt-Z-Einheit = 8 Pixel Höhe auf dem Bildschirm

const COLORS = {
  asphalt: 0x3a3a42,
  asphaltOutline: 0x2a2a30,
  centerLine: 0x9a9a52,
} as const;

const WIDTHS = {
  asphalt: 11,
  asphaltOutline: 13,
  centerLine: 1,
} as const;

type ScreenPoint = { x: number; y: number };

function sampleEdge(
  graph: RoadGraph,
  edgeId: string,
  gridToScreen: GridToScreenFn,
): ScreenPoint[] {
  const points: ScreenPoint[] = [];
  for (let i = 0; i <= SAMPLES_PER_EDGE; i++) {
    const t = i / SAMPLES_PER_EDGE;
    const wp = positionOnEdge(graph, edgeId, t);
    if (!wp) continue;
    const sp = gridToScreen(wp.x, wp.y);
    points.push({ x: sp.x, y: sp.y - wp.z * HEIGHT_PIXELS });
  }
  return points;
}

function drawPath(g: Phaser.GameObjects.Graphics, points: ScreenPoint[]): void {
  if (points.length < 2) return;
  g.beginPath();
  g.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    g.lineTo(points[i].x, points[i].y);
  }
  g.strokePath();
}

function drawDashedPath(g: Phaser.GameObjects.Graphics, points: ScreenPoint[]): void {
  // Gestrichelte Mittellinie: zeichne nur jedes zweite Segment
  for (let i = 0; i < points.length - 1; i += 2) {
    g.beginPath();
    g.moveTo(points[i].x, points[i].y);
    const next = Math.min(i + 1, points.length - 1);
    g.lineTo(points[next].x, points[next].y);
    g.strokePath();
  }
}

export function renderEdge(
  scene: Phaser.Scene,
  graph: RoadGraph,
  edgeId: string,
  gridToScreen: GridToScreenFn,
): Phaser.GameObjects.Graphics | null {
  const points = sampleEdge(graph, edgeId, gridToScreen);
  if (points.length < 2) return null;

  const g = scene.add.graphics();

  // Asphalt-Outline (etwas dicker, dunkler) — gibt Tiefe-Hint
  g.lineStyle(WIDTHS.asphaltOutline, COLORS.asphaltOutline, 1);
  drawPath(g, points);

  // Asphalt-Body
  g.lineStyle(WIDTHS.asphalt, COLORS.asphalt, 1);
  drawPath(g, points);

  // Mittellinie (gestrichelt, gelblich)
  g.lineStyle(WIDTHS.centerLine, COLORS.centerLine, 0.85);
  drawDashedPath(g, points);

  // Depth: Y-Sort basierend auf der mittleren Y-Position der Edge
  const midY = points[Math.floor(points.length / 2)].y;
  g.setDepth(midY + 100); // leicht über Tiles, unter Vehicles

  return g;
}

export function renderGraph(
  scene: Phaser.Scene,
  graph: RoadGraph,
  gridToScreen: GridToScreenFn,
): Phaser.GameObjects.Graphics[] {
  const result: Phaser.GameObjects.Graphics[] = [];
  for (const [edgeId] of graph.edges) {
    const g = renderEdge(scene, graph, edgeId, gridToScreen);
    if (g) result.push(g);
  }
  return result;
}
