"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildGraphLayout } from "@/lib/graph/layout";
import {
  getKnowledgeNode,
  getNeighborNodeIds,
  getRelatedEdges,
  knowledgeEdges,
  knowledgeNodes,
} from "@/lib/content/knowledge-graph";
import type { KnowledgeNode } from "@/types/knowledge";
import { cn } from "@/lib/utils/cn";
import { BreadcrumbTrail } from "./breadcrumb-trail";
import { GraphEdge } from "./graph-edge";
import { GraphNode } from "./graph-node";
import { RelationshipPanel } from "./relationship-panel";

type ExpandableMapProps = {
  initialNodeId?: string;
  compact?: boolean;
};

export function ExpandableMap({ initialNodeId = "wisdom-root", compact = false }: ExpandableMapProps) {
  const [selectedId, setSelectedId] = useState(initialNodeId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(["wisdom-root", initialNodeId]));
  const [zoom, setZoom] = useState(1);

  const selectedNode = getKnowledgeNode(selectedId) ?? knowledgeNodes[0];
  const focusId = hoveredId ?? selectedNode.id;
  const panelNode = getKnowledgeNode(focusId) ?? selectedNode;
  const selectedEdges = getRelatedEdges(panelNode.id).sort((a, b) => b.weight - a.weight);

  const visibleNodeIds = useMemo(() => {
    const ids = new Set<string>(["wisdom-root", selectedNode.id]);

    for (const id of expandedIds) {
      ids.add(id);
      knowledgeNodes.filter((node) => node.parentId === id).forEach((node) => ids.add(node.id));
    }

    getAncestorIds(selectedNode).forEach((id) => ids.add(id));
    getNeighborNodeIds(focusId)
      .slice(0, compact ? 4 : 9)
      .forEach((id) => ids.add(id));

    return ids;
  }, [compact, expandedIds, focusId, selectedNode]);

  const layout = useMemo(() => {
    const rawVisibleNodes = knowledgeNodes.filter((node) => visibleNodeIds.has(node.id));
    const rawVisibleEdges = knowledgeEdges
      .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
      .filter((edge) => edge.source === focusId || edge.target === focusId || edge.weight >= (compact ? 5 : 4));

    return buildGraphLayout({ nodes: rawVisibleNodes, edges: rawVisibleEdges, focusId, compact });
  }, [compact, focusId, visibleNodeIds]);
  const activeNodeIds = new Set([focusId, ...getNeighborNodeIds(focusId)]);
  const proximityById = useMemo(() => {
    const values = new Map<string, number>([[focusId, 1]]);
    const firstRing = getNeighborNodeIds(focusId);

    firstRing.forEach((id) => values.set(id, 0.74));

    firstRing
      .flatMap((id) => getNeighborNodeIds(id))
      .filter((id) => !values.has(id))
      .forEach((id) => values.set(id, 0.38));

    return values;
  }, [focusId]);
  const trail = getTrail(selectedNode);
  const focusLayoutNode = layout.nodes.find((node) => node.id === focusId);
  const cameraX = focusLayoutNode ? (50 - focusLayoutNode.layoutX) * 1.4 : 0;
  const cameraY = focusLayoutNode ? (50 - focusLayoutNode.layoutY) * 1.2 : 0;
  const clusterCounts = layout.nodes.reduce<Record<string, number>>((counts, node) => {
    counts[node.cluster] = (counts[node.cluster] ?? 0) + 1;
    return counts;
  }, {});
  const simplifiedEdges = zoom < 0.94;
  const visibleEdges = simplifiedEdges ? layout.edges.filter((edge) => edge.weight >= 5 || edge.source === focusId || edge.target === focusId) : layout.edges;

  function selectNode(nodeId: string) {
    setSelectedId(nodeId);
    setExpandedIds((current) => new Set([...current, nodeId]));
  }

  function resetFocus() {
    setSelectedId(initialNodeId);
    setHoveredId(null);
    setExpandedIds(new Set(["wisdom-root", initialNodeId]));
    setZoom(1);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="surface-calm overflow-hidden rounded-lg">
        <div className="flex flex-col gap-4 border-b border-border bg-background/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <BreadcrumbTrail trail={trail} onSelect={selectNode} />
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.82, z - 0.08))}>
              <Minus className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Reset focus" onClick={resetFocus}>
              <RotateCcw className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.18, z + 0.08))}>
              <Plus className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="border-b border-border bg-background/55 px-4 py-3 text-sm leading-6 text-foreground/72">
          Select a node to read its immediate intellectual neighborhood. Stronger gold lines indicate closer textual or conceptual dependence.
        </div>

        <div className="relative hidden min-h-[560px] overflow-hidden bg-wisdom-layered md:block xl:min-h-[700px]">
          <div className="absolute inset-0 opacity-[0.26] [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="pointer-events-none absolute inset-6 hidden rounded-lg border border-border/70 lg:block" />
          <div className="pointer-events-none absolute left-8 top-7 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Scriptures
          </div>
          <div className="pointer-events-none absolute bottom-7 left-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Philosophies
          </div>
          <div className="pointer-events-none absolute bottom-7 right-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Practices
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.18em] text-muted-foreground/75">
            Concepts
          </div>
          <motion.div
            className="absolute inset-0 origin-center"
            animate={{ scale: zoom, x: cameraX, y: cameraY }}
            transition={{ type: "spring", stiffness: 90, damping: 26, mass: 0.9 }}
          >
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <AnimatePresence>
                {visibleEdges.map((edge) => {
                  const active = edge.source === focusId || edge.target === focusId;
                  const proximity = Math.max(proximityById.get(edge.source) ?? 0, proximityById.get(edge.target) ?? 0);
                  const dimmed = hoveredId ? !active : !active && proximity < 0.5;

                  return <GraphEdge key={edge.id} edge={edge} active={active} dimmed={dimmed} proximity={proximity} simplified={simplifiedEdges} />;
                })}
              </AnimatePresence>
            </svg>

            {layout.nodes.map((node) => (
              <GraphNode
                key={node.id}
                node={node}
                active={node.id === selectedNode.id}
                focused={node.id === focusId || activeNodeIds.has(node.id)}
                proximity={proximityById.get(node.id) ?? 0.24}
                dimmed={!activeNodeIds.has(node.id) && node.id !== "wisdom-root"}
                showLabel={zoom > 0.98 || activeNodeIds.has(node.id) || node.id === "wisdom-root"}
                childCount={knowledgeNodes.filter((candidate) => candidate.parentId === node.id && !visibleNodeIds.has(candidate.id)).length}
                onSelect={selectNode}
                onHover={setHoveredId}
              />
            ))}
          </motion.div>
          <GraphNavigator nodes={layout.nodes} focusId={focusId} selectedId={selectedNode.id} zoom={zoom} onSelect={selectNode} />
          <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-2">
            {Object.entries(clusterCounts).map(([cluster, count]) => (
              <span key={cluster} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                {cluster}: {count}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-wisdom-layered p-4 md:hidden">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Guided exploration</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Swipe through the nearest relationships and expand one neighborhood at a time.</p>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Reset focus" onClick={resetFocus}>
              <RotateCcw className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
            {layout.nodes
              .filter((node) => node.id === focusId || activeNodeIds.has(node.id))
              .slice(0, 8)
              .map((node, index) => (
              <button
                key={node.id}
                type="button"
                className={cn(
                  "focus-ring-calm min-w-[82%] snap-center rounded-lg border p-4 text-left transition-all duration-300",
                  node.id === selectedNode.id ? "border-primary bg-primary/15 shadow-glow" : "border-border bg-card/85",
                )}
                onClick={() => selectNode(node.id)}
              >
                <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Step {index + 1}</span>
                <span className="block font-serif text-lg font-semibold">{node.title}</span>
                <span className="mt-2 line-clamp-2 block text-sm leading-6 text-muted-foreground">{node.summary}</span>
              </button>
              ))}
          </div>
        </div>
      </div>

      <RelationshipPanel node={panelNode} edges={selectedEdges} onSelect={selectNode} />
    </div>
  );
}

function GraphNavigator({
  nodes,
  focusId,
  selectedId,
  zoom,
  onSelect,
}: {
  nodes: ReturnType<typeof buildGraphLayout>["nodes"];
  focusId: string;
  selectedId: string;
  zoom: number;
  onSelect: (nodeId: string) => void;
}) {
  return (
    <div className="absolute right-4 top-4 w-48 rounded-lg border border-border bg-background/95 p-3 shadow-calm">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em]">
          <Compass className="size-3.5 text-primary" aria-hidden="true" />
          Navigator
        </span>
        <span>{Math.round(zoom * 100)}%</span>
      </div>
      <div className="relative h-28 overflow-hidden rounded-md border border-border/70 bg-card/70">
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            aria-label={`Focus ${node.title}`}
            className={cn(
              "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300",
              node.id === focusId || node.id === selectedId ? "bg-primary shadow-glow" : "bg-muted-foreground/35 hover:bg-primary/70",
            )}
            style={{ left: `${node.layoutX}%`, top: `${node.layoutY}%` }}
            onClick={() => onSelect(node.id)}
          />
        ))}
        <span
          className="pointer-events-none absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/45 bg-primary/10"
          style={{ left: `${nodes.find((node) => node.id === focusId)?.layoutX ?? 50}%`, top: `${nodes.find((node) => node.id === focusId)?.layoutY ?? 50}%` }}
        />
      </div>
    </div>
  );
}

function getTrail(node: KnowledgeNode) {
  const trail: KnowledgeNode[] = [];
  let current: KnowledgeNode | undefined = node;

  while (current) {
    trail.unshift(current);
    current = current.parentId ? getKnowledgeNode(current.parentId) : undefined;
  }

  return trail;
}

function getAncestorIds(node: KnowledgeNode) {
  return getTrail(node).map((item) => item.id);
}
