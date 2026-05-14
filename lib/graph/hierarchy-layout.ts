import type { KnowledgeNode } from "@/types/knowledge";

/**
 * Deterministic hierarchy-based layout system for knowledge tree visualization.
 * Replaces force-directed physics with structured tree algorithms.
 */

export type LayoutNode = KnowledgeNode & {
  depth: number;
  layerIndex: number;
  childCount: number;
  hierarchyX: number;
  hierarchyY: number;
  width: number;
  height: number;
};

export type LayoutConfig = {
  nodeSpacing: number; // Vertical spacing between nodes
  layerSpacing: number; // Horizontal spacing between depth layers
  containerWidth: number;
  containerHeight: number;
  layoutMode: "tree" | "radial" | "timeline" | "columns";
};

const defaultConfig: LayoutConfig = {
  nodeSpacing: 80,
  layerSpacing: 200,
  containerWidth: 1200,
  containerHeight: 800,
  layoutMode: "tree",
};

/**
 * Build a hierarchical tree layout from nodes and edges
 */
export function buildHierarchyLayout(
  nodes: KnowledgeNode[],
  parentMap: Map<string, string[]>,
  config: Partial<LayoutConfig> = {}
): LayoutNode[] {
  const finalConfig = { ...defaultConfig, ...config };

  // Build depth information
  const nodeDepth = new Map<string, number>();
  const nodeWithDepth: LayoutNode[] = [];

  function getDepth(nodeId: string, visited = new Set<string>()): number {
    if (visited.has(nodeId)) return 0;
    if (nodeDepth.has(nodeId)) return nodeDepth.get(nodeId)!;

    visited.add(nodeId);
    const children = parentMap.get(nodeId) || [];
    const maxChildDepth = children.length === 0 ? 0 : Math.max(...children.map((id) => getDepth(id, new Set(visited))));
    const depth = maxChildDepth + 1;

    nodeDepth.set(nodeId, depth);
    return depth;
  }

  // Calculate depths
  nodes.forEach((node) => getDepth(node.id));

  // Group nodes by parent
  const nodesByParent = new Map<string | undefined, KnowledgeNode[]>();
  nodes.forEach((node) => {
    const parent = node.parentId;
    if (!nodesByParent.has(parent)) {
      nodesByParent.set(parent, []);
    }
    nodesByParent.get(parent)!.push(node);
  });

  // Sort nodes by type priority for visual clarity
  const typeOrder: Record<string, number> = {
    TRADITION: 0,
    SCRIPTURE: 1,
    BOOK: 2,
    CHAPTER: 3,
    PHILOSOPHY_SCHOOL: 4,
    CONCEPT: 5,
    PRACTICE: 6,
    COMMENTARY: 7,
  };

  nodesByParent.forEach((siblings) => {
    siblings.sort((a, b) => (typeOrder[a.nodeType] ?? 99) - (typeOrder[b.nodeType] ?? 99));
  });

  // Build layout nodes with positioning
  const positionMap = new Map<string, { x: number; y: number; layerIndex: number }>();

  function layoutSubtree(parentId: string | undefined, depth: number): void {
    const children = nodesByParent.get(parentId) || [];
    const totalHeight = (children.length - 1) * finalConfig.nodeSpacing + 100;
    const startY = -totalHeight / 2;

    children.forEach((child, index) => {
      const y = startY + index * finalConfig.nodeSpacing + 50;
      const x = depth * finalConfig.layerSpacing;

      positionMap.set(child.id, { x, y, layerIndex: index });

      // Recursively layout children
      layoutSubtree(child.id, depth + 1);
    });
  }

  // Root nodes
  const roots = nodesByParent.get(undefined) || [];

  if (finalConfig.layoutMode === "tree") {
    layoutSubtree(undefined, 0);
  } else if (finalConfig.layoutMode === "radial") {
    layoutRadial(roots, positionMap, nodesByParent, finalConfig);
  } else if (finalConfig.layoutMode === "timeline") {
    layoutTimeline(nodes, nodesByParent, positionMap, finalConfig);
  }

  // Create final layout nodes
  nodes.forEach((node) => {
    const pos = positionMap.get(node.id) || { x: 0, y: 0, layerIndex: 0 };
    const childCount = (nodesByParent.get(node.id) || []).length;
    const depth = nodeDepth.get(node.id) || 0;

    nodeWithDepth.push({
      ...node,
      depth,
      layerIndex: pos.layerIndex,
      childCount,
      hierarchyX: pos.x,
      hierarchyY: pos.y,
      width: 160,
      height: 80,
    });
  });

  return nodeWithDepth;
}

/**
 * Radial/circular layout - nodes arranged in concentric circles
 */
function layoutRadial(
  roots: KnowledgeNode[],
  positionMap: Map<string, { x: number; y: number; layerIndex: number }>,
  nodesByParent: Map<string | undefined, KnowledgeNode[]>,
  config: LayoutConfig
): void {
  const centerX = config.containerWidth / 2;
  const centerY = config.containerHeight / 2;
  const radiusIncrement = config.layerSpacing;
  let currentRadius = 100;

  function layoutRadialLevel(parentId: string | undefined, depth: number): void {
    const children = nodesByParent.get(parentId) || [];
    if (children.length === 0) return;

    const angleStep = (2 * Math.PI) / children.length;

    children.forEach((child, index) => {
      const angle = index * angleStep;
      const x = centerX + Math.cos(angle) * currentRadius;
      const y = centerY + Math.sin(angle) * currentRadius;

      positionMap.set(child.id, { x, y, layerIndex: index });

      layoutRadialLevel(child.id, depth + 1);
    });

    currentRadius += radiusIncrement;
  }

  // Start with root nodes
  roots.forEach((root, index) => {
    const angle = (index / roots.length) * 2 * Math.PI;
    positionMap.set(root.id, {
      x: centerX + Math.cos(angle) * 80,
      y: centerY + Math.sin(angle) * 80,
      layerIndex: index,
    });

    layoutRadialLevel(root.id, 1);
  });
}

/**
 * Timeline layout - horizontal progression showing intellectual evolution
 */
function layoutTimeline(
  nodes: KnowledgeNode[],
  nodesByParent: Map<string | undefined, KnowledgeNode[]>,
  positionMap: Map<string, { x: number; y: number; layerIndex: number }>,
  config: LayoutConfig
): void {
  // Group nodes by estimated historical period
  const periodMap: Record<string, KnowledgeNode[]> = {
    vedic: [],
    upanishadic: [],
    classical: [],
    devotional: [],
    modern: [],
  };

  // Rough historical grouping
  const periodsByNodeId: Record<string, string> = {
    vedas: "vedic",
    rigveda: "vedic",
    yajurveda: "vedic",
    samaveda: "vedic",
    atharvaveda: "vedic",
    upanishads: "upanishadic",
    "isha-upanishad": "upanishadic",
    "katha-upanishad": "upanishadic",
    "chandogya-upanishad": "upanishadic",
    "brihadaranyaka-upanishad": "upanishadic",
    vedanta: "classical",
    sankhya: "classical",
    yoga: "classical",
    "yoga-sutras": "classical",
    darshanas: "classical",
    "bhagavad-gita": "devotional",
  };

  const periodWidths: Record<string, number> = {
    vedic: 150,
    upanishadic: 200,
    classical: 300,
    devotional: 250,
    modern: 200,
  };

  nodes.forEach((node) => {
    const period = periodsByNodeId[node.id] || "modern";
    if (!periodMap[period]) periodMap[period] = [];
    periodMap[period].push(node);
  });

  let currentX = 100;

  Object.keys(periodMap).forEach((period) => {
    const nodesInPeriod = periodMap[period];
    const maxHeight = nodesInPeriod.length * 80;
    const startY = (config.containerHeight - maxHeight) / 2;

    nodesInPeriod.forEach((node, index) => {
      positionMap.set(node.id, {
        x: currentX,
        y: startY + index * 80,
        layerIndex: index,
      });
    });

    currentX += periodWidths[period];
  });
}

/**
 * Calculate the parent-child relationship map
 */
export function buildParentMap(nodes: KnowledgeNode[]): Map<string, string[]> {
  const map = new Map<string, string[]>();

  nodes.forEach((node) => {
    if (node.parentId) {
      if (!map.has(node.parentId)) {
        map.set(node.parentId, []);
      }
      map.get(node.parentId)!.push(node.id);
    }
  });

  return map;
}

/**
 * Get the ancestor chain for breadcrumb navigation
 */
export function getAncestorChain(nodeId: string, nodes: KnowledgeNode[]): KnowledgeNode[] {
  const chain: KnowledgeNode[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  let current = nodeMap.get(nodeId);

  while (current) {
    chain.unshift(current);
    current = current.parentId ? nodeMap.get(current.parentId) : undefined;
  }

  return chain;
}

/**
 * Get direct children of a node
 */
export function getChildren(parentId: string, nodes: KnowledgeNode[]): KnowledgeNode[] {
  return nodes.filter((node) => node.parentId === parentId);
}
