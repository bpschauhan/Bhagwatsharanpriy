/**
 * SEMANTIC ZONE LAYOUT SYSTEM
 * 
 * Advanced positioning that organizes nodes into meaningful semantic clusters
 * rather than random physics-based layouts.
 * 
 * Creates a structured 2D topology resembling:
 * - Knowledge atlases
 * - Civilization tech trees
 * - Interactive philosophy maps
 */

import type { KnowledgeNode, KnowledgeEdge } from "@/types/knowledge";

export type SemanticZone = {
  label: string;
  color: string;
  order: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LayoutNode = KnowledgeNode & {
  zoneX: number;
  zoneY: number;
  globalX: number;
  globalY: number;
  visualRadius: number;
  importance: number;
  cluster: string;
};

const CANVAS_WIDTH = 1600;

/**
 * Build semantic zone layout
 * Positions nodes into structured clusters based on knowledge type
 */
export function buildSemanticZoneLayout(
  nodes: KnowledgeNode[],
  edges: KnowledgeEdge[],
  zones: Record<string, SemanticZone>
): LayoutNode[] {
  const layoutNodes: LayoutNode[] = [];
  const edgeMap = new Map<string, KnowledgeEdge[]>();

  // Build edge index
  edges.forEach((edge) => {
    if (!edgeMap.has(edge.source)) edgeMap.set(edge.source, []);
    if (!edgeMap.has(edge.target)) edgeMap.set(edge.target, []);
    edgeMap.get(edge.source)!.push(edge);
    edgeMap.get(edge.target)!.push(edge);
  });

  // Calculate node importance (based on connections and depth)
  const importanceMap = new Map<string, number>();
  nodes.forEach((node) => {
    const connections = (edgeMap.get(node.id) || []).length;
    const depthPenalty = Math.max(0, 5 - (node.depth || 0));
    importanceMap.set(node.id, connections * 2 + depthPenalty);
  });

  // Group nodes by zone
  const zoneGroups = new Map<string, KnowledgeNode[]>();
  nodes.forEach((node) => {
    const zone = node.zone || "ROOT";
    if (!zoneGroups.has(zone)) {
      zoneGroups.set(zone, []);
    }
    zoneGroups.get(zone)!.push(node);
  });

  // Sort nodes within each zone by importance
  zoneGroups.forEach((groupNodes) => {
    groupNodes.sort((a, b) => {
      const impA = importanceMap.get(a.id) || 0;
      const impB = importanceMap.get(b.id) || 0;
      return impB - impA; // Higher importance first
    });
  });

  // Position nodes within zones
  zoneGroups.forEach((groupNodes, zoneName) => {
    const zone = zones[zoneName];
    if (!zone) return;

    const zoneWidth = zone.width || 200;
    const nodeSpacing = 60;
    const nodesPerRow = Math.max(1, Math.floor(zoneWidth / nodeSpacing));
    const rowSpacing = (zone.height || 150) / Math.max(2, Math.ceil(groupNodes.length / nodesPerRow) + 1);

    groupNodes.forEach((node, idx) => {
      const row = Math.floor(idx / nodesPerRow);
      const col = idx % nodesPerRow;

      const localX = 40 + col * nodeSpacing;
      const localY = 30 + row * Math.min(nodeSpacing * 0.8, rowSpacing);

      const globalX = zone.x + (localX / 100) * 200;
      const globalY = zone.y + (localY / 100) * 150;

      const importance = importanceMap.get(node.id) || 0;
      const visualRadius = Math.min(40, 20 + importance * 2);

      layoutNodes.push({
        ...node,
        zoneX: localX,
        zoneY: localY,
        globalX,
        globalY,
        visualRadius,
        importance,
        cluster: zoneName,
      });
    });
  });

  return layoutNodes;
}

/**
 * Build hierarchy-focused layout (emphasizes parent-child relationships)
 */
export function buildHierarchyFocusedLayout(
  nodes: KnowledgeNode[],
  edges: KnowledgeEdge[],
  zones: Record<string, SemanticZone>
): LayoutNode[] {
  void edges;
  void zones;

  const layoutNodes: LayoutNode[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const childrenMap = new Map<string, KnowledgeNode[]>();

  // Build parent-child relationships
  nodes.forEach((node) => {
    if (node.parentId) {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, []);
      }
      childrenMap.get(node.parentId)!.push(node);
    }
  });

  // Recursively position nodes based on hierarchy
  function layoutSubtree(
    parentId: string,
    baseX: number,
    baseY: number,
    levelWidth: number
  ): LayoutNode[] {
    const children = childrenMap.get(parentId) || [];
    if (children.length === 0) return [];

    const result: LayoutNode[] = [];
    const totalWidth = Math.max(children.length * 120, levelWidth);
    const startX = baseX - totalWidth / 2;

    children.forEach((child, idx) => {
      const x = startX + idx * (totalWidth / children.length);
      const y = baseY + 120;

      const node = nodeMap.get(child.id);
      if (node) {
        result.push({
          ...node,
          zoneX: x,
          zoneY: y,
          globalX: x,
          globalY: y,
          visualRadius: 25,
          importance: 1,
          cluster: child.zone || "unknown",
        });

        // Recursively position children
        result.push(...layoutSubtree(child.id, x, y, totalWidth / Math.max(1, children.length)));
      }
    });

    return result;
  }

  // Start from roots
  nodes
    .filter((n) => !n.parentId || n.id === "sanatana-dharma-root")
    .forEach((root, idx) => {
      layoutNodes.push({
        ...root,
        zoneX: CANVAS_WIDTH / 2 + idx * 300 - 150,
        zoneY: 50,
        globalX: CANVAS_WIDTH / 2 + idx * 300 - 150,
        globalY: 50,
        visualRadius: 35,
        importance: 10,
        cluster: root.zone || "root",
      });

      layoutNodes.push(...layoutSubtree(root.id, CANVAS_WIDTH / 2 + idx * 300 - 150, 50, 300));
    });

  return layoutNodes;
}

/**
 * Build concept dependency layout (emphasizes relationships between ideas)
 */
export function buildConceptDependencyLayout(
  nodes: KnowledgeNode[],
  edges: KnowledgeEdge[],
  zones: Record<string, SemanticZone>
): LayoutNode[] {
  void zones;

  const layoutNodes: LayoutNode[] = [];

  // Calculate graph distance from root
  const distances = new Map<string, number>();
  const visited = new Set<string>();

  function bfs(nodeId: string, dist: number) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    distances.set(nodeId, dist);

    edges.forEach((edge) => {
      if (edge.source === nodeId && !visited.has(edge.target)) {
        bfs(edge.target, dist + 1);
      }
      if (edge.target === nodeId && !visited.has(edge.source)) {
        bfs(edge.source, dist + 1);
      }
    });
  }

  // Start BFS from root
  bfs("sanatana-dharma-root", 0);

  // Group by distance level
  const levels = new Map<number, KnowledgeNode[]>();
  nodes.forEach((node) => {
    const dist = distances.get(node.id) || 999;
    if (!levels.has(dist)) levels.set(dist, []);
    levels.get(dist)!.push(node);
  });

  // Position nodes level by level
  let currentY = 50;
  levels.forEach((levelNodes, level) => {
    const levelWidth = Math.min(CANVAS_WIDTH * 0.9, levelNodes.length * 100);
    const startX = CANVAS_WIDTH / 2 - levelWidth / 2;

    levelNodes.forEach((node, idx) => {
      const x = startX + (idx / Math.max(1, levelNodes.length - 1)) * levelWidth;

      layoutNodes.push({
        ...node,
        zoneX: x,
        zoneY: currentY,
        globalX: x,
        globalY: currentY,
        visualRadius: 20 + Math.max(0, 10 - level),
        importance: level,
        cluster: node.zone || "unknown",
      });
    });

    currentY += 120;
  });

  return layoutNodes;
}

/**
 * Build tradition mode layout (emphasizes sectarian traditions)
 */
export function buildTraditionLayout(
  nodes: KnowledgeNode[],
  edges: KnowledgeEdge[],
  zones: Record<string, SemanticZone>
): LayoutNode[] {
  void edges;
  void zones;

  const layoutNodes: LayoutNode[] = [];

  // Define tradition regions
  const traditions: Record<string, { x: number; y: number; label: string }> = {
    SHRUTI: { x: 100, y: 150, label: "Shruti" },
    SMRITI: { x: 300, y: 150, label: "Smriti" },
    PURANAS: { x: 500, y: 150, label: "Puranas" },
    DARSHANAS: { x: 700, y: 150, label: "Darshanas" },
    BHAKTI: { x: 300, y: 500, label: "Bhakti" },
    TANTRA: { x: 700, y: 500, label: "Tantra" },
    YOGA_SYSTEMS: { x: 900, y: 150, label: "Yoga" },
  };

  nodes.forEach((node) => {
    const trad = traditions[node.zone as string];
    if (trad) {
      layoutNodes.push({
        ...node,
        zoneX: trad.x + Math.random() * 100 - 50,
        zoneY: trad.y + Math.random() * 100 - 50,
        globalX: trad.x + Math.random() * 100 - 50,
        globalY: trad.y + Math.random() * 100 - 50,
        visualRadius: 22,
        importance: 1,
        cluster: node.zone || "unknown",
      });
    }
  });

  return layoutNodes;
}

/**
 * Calculate visual prominence based on multiple factors
 */
export function calculateImportance(
  node: KnowledgeNode,
  connectionsCount: number,
  depth: number,
  isRoot: boolean
): number {
  let importance = 0;

  if (isRoot) importance += 100;
  importance += connectionsCount * 5;
  importance += Math.max(0, 10 - depth) * 3;

  if (node.tags?.includes("core")) importance += 20;
  if (node.tags?.includes("foundation")) importance += 15;
  if (node.tags?.includes("widely-studied")) importance += 10;

  return importance;
}
