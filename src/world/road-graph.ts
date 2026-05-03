/**
 * Road-Graph: Datenmodell für Spline-basiertes Straßennetz (Pfad B).
 *
 * Tile-Welt bleibt für Boden (Gras, Schotter-Bezirke, Wasser, Berge).
 * Straßen sind unabhängige Polyline/Spline-Objekte mit:
 *   - Knoten (RoadNode) mit Welt-Position + Z-Höhe (für Brücken/Tunnel)
 *   - Kanten (RoadEdge) als Verbindungen zwischen Knoten, mit optionaler Krümmung
 *   - Lanes pro Kante (1 oder 2 für Gegenverkehr)
 *
 * Migration-Status (Stand: Initial):
 *   - Datenmodell: skizziert (diese Datei)
 *   - Renderer: TBD
 *   - Pathfinding: TBD (Graph-A* statt Grid-A*)
 *   - LKW-Bewegung: TBD (Spline-Following statt Tile-Schritt)
 *
 * Siehe ADR-010 für Migration-Strategie.
 */

export type RoadNodeId = string;
export type RoadEdgeId = string;

// Welt-Position mit optionaler Höhe (Z = 0 = Boden)
export type WorldPosition = {
  x: number; // Welt-X (kann zwischen Tile-Grid liegen — kontinuierlich)
  y: number; // Welt-Y
  z: number; // Höhe (0 = Boden, > 0 = Brücke, < 0 = Tunnel)
};

export type RoadNode = {
  id: RoadNodeId;
  position: WorldPosition;
  // Knoten-Typ — bestimmt Render-Stil und Funktion
  type: 'junction' | 'endpoint' | 'bridge_pillar' | 'tunnel_entrance';
};

export type RoadEdge = {
  id: RoadEdgeId;
  from: RoadNodeId;
  to: RoadNodeId;
  // Optionale Mittelpunkte für Kurven (Bezier-Kontrollpunkte)
  controlPoints: WorldPosition[];
  // Anzahl Lanes (1 = Einbahnstraße, 2 = Standard, 4 = Highway)
  lanes: number;
  // Material — bestimmt Geschwindigkeits-Modifier und Render-Optik
  material: 'asphalt' | 'gravel' | 'dirt' | 'rail';
};

// Zentrale Datenstruktur: das gesamte Straßennetz einer Welt
export type RoadGraph = {
  nodes: Map<RoadNodeId, RoadNode>;
  edges: Map<RoadEdgeId, RoadEdge>;
  // Adjacency-Liste für schnelles Pathfinding (NodeId → [EdgeIds])
  adjacency: Map<RoadNodeId, RoadEdgeId[]>;
};

export function createEmptyGraph(): RoadGraph {
  return {
    nodes: new Map(),
    edges: new Map(),
    adjacency: new Map(),
  };
}

export function addNode(graph: RoadGraph, node: RoadNode): void {
  graph.nodes.set(node.id, node);
  if (!graph.adjacency.has(node.id)) {
    graph.adjacency.set(node.id, []);
  }
}

export function addEdge(graph: RoadGraph, edge: RoadEdge): void {
  graph.edges.set(edge.id, edge);
  const fromAdj = graph.adjacency.get(edge.from) ?? [];
  fromAdj.push(edge.id);
  graph.adjacency.set(edge.from, fromAdj);
  const toAdj = graph.adjacency.get(edge.to) ?? [];
  toAdj.push(edge.id);
  graph.adjacency.set(edge.to, toAdj);
}

// Berechnet Position auf einer Edge bei Parameter t ∈ [0, 1].
// Bei controlPoints leer = lineare Interpolation.
// Bei controlPoints vorhanden = Bezier-Spline.
export function positionOnEdge(graph: RoadGraph, edgeId: RoadEdgeId, t: number): WorldPosition | null {
  const edge = graph.edges.get(edgeId);
  if (!edge) return null;
  const from = graph.nodes.get(edge.from)?.position;
  const to = graph.nodes.get(edge.to)?.position;
  if (!from || !to) return null;

  if (edge.controlPoints.length === 0) {
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
      z: from.z + (to.z - from.z) * t,
    };
  }

  // Quadratische Bezier (1 Kontrollpunkt) oder kubische (2 Kontrollpunkte).
  // Höhere Ordnungen werden auf max 2 Kontrollpunkte reduziert.
  const cp = edge.controlPoints[0];
  if (edge.controlPoints.length === 1) {
    const u = 1 - t;
    return {
      x: u * u * from.x + 2 * u * t * cp.x + t * t * to.x,
      y: u * u * from.y + 2 * u * t * cp.y + t * t * to.y,
      z: u * u * from.z + 2 * u * t * cp.z + t * t * to.z,
    };
  }

  const cp2 = edge.controlPoints[1];
  const u = 1 - t;
  return {
    x: u * u * u * from.x + 3 * u * u * t * cp.x + 3 * u * t * t * cp2.x + t * t * t * to.x,
    y: u * u * u * from.y + 3 * u * u * t * cp.y + 3 * u * t * t * cp2.y + t * t * t * to.y,
    z: u * u * u * from.z + 3 * u * u * t * cp.z + 3 * u * t * t * cp2.z + t * t * t * to.z,
  };
}

// Demo-Graph: drei Edges um verschiedene Pfad-B-Features zu demonstrieren:
//   1. Gerade Diagonale (von oben-links nach unten-rechts)
//   2. Kurve mit einem Bezier-Kontrollpunkt
//   3. Brücke (Edge mit erhöhter Mitte via Z-Höhe)
export function createDemoGraph(): RoadGraph {
  const graph = createEmptyGraph();
  const n1: RoadNode = { id: 'n1', position: { x: 3, y: 11, z: 0 }, type: 'endpoint' };
  const n2: RoadNode = { id: 'n2', position: { x: 15, y: 3, z: 0 }, type: 'endpoint' };
  const n3: RoadNode = { id: 'n3', position: { x: 3, y: 3, z: 0 }, type: 'endpoint' };
  const n4: RoadNode = { id: 'n4', position: { x: 15, y: 11, z: 0 }, type: 'endpoint' };
  addNode(graph, n1);
  addNode(graph, n2);
  addNode(graph, n3);
  addNode(graph, n4);

  // Edge 1: gerade Diagonale n1 → n2 (von links-unten nach rechts-oben)
  addEdge(graph, {
    id: 'e-straight',
    from: 'n1', to: 'n2',
    controlPoints: [],
    lanes: 2, material: 'asphalt',
  });

  // Edge 2: Kurve n3 → n4 mit Bezier-Kontrollpunkt
  addEdge(graph, {
    id: 'e-curve',
    from: 'n3', to: 'n4',
    controlPoints: [{ x: 9, y: 1, z: 0 }],
    lanes: 2, material: 'asphalt',
  });

  // Edge 3: Brücke — gleiche Endpunkte aber mit erhöhter Mitte (Z=3)
  // (Für jetzt eine Edge, die wie eine Brücke aussieht — visuell höher)
  const nBridgeA: RoadNode = { id: 'nb1', position: { x: 5, y: 8, z: 0 }, type: 'endpoint' };
  const nBridgeB: RoadNode = { id: 'nb2', position: { x: 13, y: 8, z: 0 }, type: 'endpoint' };
  addNode(graph, nBridgeA);
  addNode(graph, nBridgeB);
  addEdge(graph, {
    id: 'e-bridge',
    from: 'nb1', to: 'nb2',
    controlPoints: [{ x: 9, y: 8, z: 3 }],
    lanes: 2, material: 'asphalt',
  });

  return graph;
}
