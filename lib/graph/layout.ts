import type { KnowledgeEdge, KnowledgeNode } from "@/types/knowledge";

export type GraphLayoutNode = KnowledgeNode & {
  layoutX: number;
  layoutY: number;
  radius: number;
  labelSide: "top" | "right" | "bottom" | "left";
  cluster: "scripture" | "concept" | "practice" | "philosophy" | "orbit";
};

export type GraphLayoutEdge = KnowledgeEdge & {
  sourceNode: GraphLayoutNode;
  targetNode: GraphLayoutNode;
  curve: number;
};

type LayoutGraphInput = {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  focusId: string;
  compact?: boolean;
};

const bounds = {
  minX: 9,
  maxX: 91,
  minY: 10,
  maxY: 90,
};

export function buildGraphLayout({ nodes, edges, focusId, compact = false }: LayoutGraphInput) {
  const visibleIds = new Set(nodes.map((node) => node.id));
  const focusNeighborhood = new Set<string>([focusId]);

  for (const edge of edges) {
    if (edge.source === focusId) {
      focusNeighborhood.add(edge.target);
    }

    if (edge.target === focusId) {
      focusNeighborhood.add(edge.source);
    }
  }

  const simulated = nodes.map((node, index) => {
    const target = getSemanticTarget(node, index, nodes.length);
    const focusPull = node.id === focusId ? 0.62 : focusNeighborhood.has(node.id) ? 0.26 : 0;

    return {
      ...node,
      vx: 0,
      vy: 0,
      x: clamp(mix(node.x, target.x, 0.74 + focusPull), bounds.minX, bounds.maxX),
      y: clamp(mix(node.y, target.y, 0.74 + focusPull), bounds.minY, bounds.maxY),
      targetX: target.x,
      targetY: target.y,
      radius: getNodeRadius(node, compact),
      cluster: target.cluster,
    };
  });

  const graphEdges = edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));
  const iterations = compact ? 90 : 150;

  for (let step = 0; step < iterations; step += 1) {
    const cooling = 1 - step / iterations;

    for (const node of simulated) {
      node.vx += (node.targetX - node.x) * 0.006 * cooling;
      node.vy += (node.targetY - node.y) * 0.006 * cooling;

      if (node.id === focusId) {
        node.vx += (50 - node.x) * 0.012 * cooling;
        node.vy += (50 - node.y) * 0.012 * cooling;
      }
    }

    for (let i = 0; i < simulated.length; i += 1) {
      for (let j = i + 1; j < simulated.length; j += 1) {
        const a = simulated[i];
        const b = simulated[j];
        const dx = b.x - a.x || 0.01;
        const dy = b.y - a.y || 0.01;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = a.radius + b.radius + (compact ? 4.5 : 6.5);

        if (distance < minDistance) {
          const force = ((minDistance - distance) / distance) * 0.028 * cooling;
          const fx = dx * force;
          const fy = dy * force;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }
    }

    for (const edge of graphEdges) {
      const source = simulated.find((node) => node.id === edge.source);
      const target = simulated.find((node) => node.id === edge.target);

      if (!source || !target) {
        continue;
      }

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const desired = edge.source === focusId || edge.target === focusId ? 21 : 30;
      const force = (distance - desired) * 0.0018 * edge.weight * cooling;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;

      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    }

    for (const node of simulated) {
      node.x = clamp(node.x + node.vx, bounds.minX, bounds.maxX);
      node.y = clamp(node.y + node.vy, bounds.minY, bounds.maxY);
      node.vx *= 0.72;
      node.vy *= 0.72;
    }
  }

  const layoutNodes: GraphLayoutNode[] = simulated.map((node) => ({
    id: node.id,
    slug: node.slug,
    title: node.title,
    subtitle: node.subtitle,
    summary: node.summary,
    nodeType: node.nodeType,
    parentId: node.parentId,
    x: node.x,
    y: node.y,
    href: node.href,
    tags: node.tags,
    layoutX: node.x,
    layoutY: node.y,
    radius: node.radius,
    cluster: node.cluster,
    labelSide: getLabelSide(node.x, node.y),
  }));

  const nodeById = new Map(layoutNodes.map((node) => [node.id, node]));
  const layoutEdges: GraphLayoutEdge[] = graphEdges.flatMap((edge, index) => {
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);

    if (!sourceNode || !targetNode) {
      return [];
    }

    return [
      {
        ...edge,
        sourceNode,
        targetNode,
        curve: (index % 2 === 0 ? 1 : -1) * (compact ? 2.2 : 3.8),
      },
    ];
  });

  return {
    nodes: layoutNodes,
    edges: layoutEdges,
  };
}

function getSemanticTarget(node: KnowledgeNode, index: number, total: number) {
  if (node.id === "wisdom-root") {
    return { x: 50, y: 50, cluster: "concept" as const };
  }

  if (node.nodeType === "SCRIPTURE" || node.nodeType === "BOOK") {
    return distribute(node, index, total, { x: 50, y: 21 }, 29, 11, "scripture");
  }

  if (node.nodeType === "CONCEPT") {
    return distribute(node, index, total, { x: 51, y: 50 }, 24, 16, "concept");
  }

  if (node.nodeType === "PRACTICE") {
    return distribute(node, index, total, { x: 76, y: 70 }, 13, 10, "practice");
  }

  if (node.nodeType === "PHILOSOPHY_SCHOOL") {
    return distribute(node, index, total, { x: 30, y: 73 }, 25, 13, "philosophy");
  }

  return distribute(node, index, total, { x: 50, y: 50 }, 38, 25, "orbit");
}

function distribute(
  node: KnowledgeNode,
  index: number,
  total: number,
  center: { x: number; y: number },
  radiusX: number,
  radiusY: number,
  cluster: GraphLayoutNode["cluster"],
) {
  const seed = seededNumber(node.id);
  const angle = seed * Math.PI * 2 + (index / Math.max(total, 1)) * Math.PI;

  return {
    x: clamp(center.x + Math.cos(angle) * radiusX * (0.42 + seed * 0.58), bounds.minX, bounds.maxX),
    y: clamp(center.y + Math.sin(angle) * radiusY * (0.42 + (1 - seed) * 0.58), bounds.minY, bounds.maxY),
    cluster,
  };
}

function getNodeRadius(node: KnowledgeNode, compact: boolean) {
  const base = node.id === "wisdom-root" ? 9 : node.nodeType === "CONCEPT" ? 7.7 : 8.4;
  const labelFactor = Math.min(node.title.length * 0.18, 4.2);
  return (base + labelFactor) * (compact ? 0.86 : 1);
}

function getLabelSide(x: number, y: number): GraphLayoutNode["labelSide"] {
  if (y < 24) {
    return "bottom";
  }

  if (y > 76) {
    return "top";
  }

  return x > 58 ? "left" : "right";
}

function seededNumber(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 9973;
  }

  return hash / 9973;
}

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
