"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildHierarchyLayout, buildParentMap, getAncestorChain, getChildren, type LayoutNode } from "@/lib/graph/hierarchy-layout";
import { getKnowledgeNode, knowledgeNodes } from "@/lib/content/knowledge-graph";
import type { KnowledgeNode } from "@/types/knowledge";

type HierarchyNavigatorProps = {
  initialNodeId?: string;
  viewMode?: "tree" | "radial" | "timeline";
  compact?: boolean;
};

/**
 * New hierarchical knowledge navigator - replaces abstract force-graph with structured tree
 */
export function HierarchyNavigator({ initialNodeId = "wisdom-root", viewMode = "tree", compact = false }: HierarchyNavigatorProps) {
  const [selectedId, setSelectedId] = useState(initialNodeId);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(["wisdom-root", initialNodeId]));
  const [zoom, setZoom] = useState(1);

  const selectedNode = getKnowledgeNode(selectedId) ?? knowledgeNodes[0];
  const parentMap = useMemo(() => buildParentMap(knowledgeNodes), []);
  const layoutNodes = useMemo(
    () =>
      buildHierarchyLayout(knowledgeNodes, parentMap, {
        layoutMode: viewMode,
        nodeSpacing: compact ? 60 : 80,
        layerSpacing: compact ? 150 : 200,
        containerWidth: 1200,
        containerHeight: 800,
      }),
    [viewMode, compact, parentMap]
  );

  const breadcrumb = useMemo(() => getAncestorChain(selectedId, knowledgeNodes), [selectedId]);

  const toggleExpanded = (nodeId: string) => {
    setExpandedIds((current) => {
      const updated = new Set(current);
      if (updated.has(nodeId)) {
        updated.delete(nodeId);
      } else {
        updated.add(nodeId);
      }
      return updated;
    });
  };

  const selectNode = (nodeId: string) => {
    setSelectedId(nodeId);
    setExpandedIds((current) => new Set([...current, nodeId]));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* Main visualization area */}
      <div className="surface-calm overflow-hidden rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border bg-background/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-foreground/75">Knowledge Atlas</h2>
            <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
              {breadcrumb.map((node, index) => (
                <button
                  key={node.id}
                  onClick={() => selectNode(node.id)}
                  className="hover:text-foreground transition-colors"
                >
                  {node.title}
                  {index < breadcrumb.length - 1 && <span className="mx-1">/</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}>
              <Minus className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Reset"
              onClick={() => {
                setSelectedId(initialNodeId);
                setZoom(1);
              }}
            >
              <Compass className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}>
              <Plus className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="border-b border-border bg-background/55 px-4 py-3 text-sm leading-6 text-foreground/72">
          {viewMode === "tree" && (
            <>
              This knowledge tree shows how Indian philosophical teachings develop from foundational scriptures. Select any node to explore its position in the
              knowledge lineage.
            </>
          )}
          {viewMode === "timeline" && (
            <>
              This timeline shows the intellectual evolution from Vedic foundations through classical schools to contemporary understanding. Each era built upon
              previous insights.
            </>
          )}
          {viewMode === "radial" && <>This radial map shows concentric circles of knowledge, with root traditions at the center expanding outward.</>}
        </div>

        {/* Tree visualization */}
        <div className="flex-1 overflow-auto bg-wisdom-layered relative">
          <TreeRenderer
            layoutNodes={layoutNodes}
            selectedId={selectedId}
            expandedIds={expandedIds}
            zoom={zoom}
            onSelectNode={selectNode}
            onToggleExpanded={toggleExpanded}
          />
        </div>
      </div>

      {/* Right panel - Node information */}
      <EnhancedNodePanel selectedNode={selectedNode} onSelectNode={selectNode} />
    </div>
  );
}

/**
 * Tree visualization with SVG rendering
 */
function TreeRenderer({
  layoutNodes,
  selectedId,
  expandedIds,
  zoom,
  onSelectNode,
  onToggleExpanded,
}: {
  layoutNodes: LayoutNode[];
  selectedId: string;
  expandedIds: Set<string>;
  zoom: number;
  onSelectNode: (nodeId: string) => void;
  onToggleExpanded: (nodeId: string) => void;
}) {
  const visibleNodes = layoutNodes.filter((node) => {
    if (node.id === "wisdom-root") return true;
    const ancestors = getAncestorChain(node.id, layoutNodes);
    return ancestors.some((a) => expandedIds.has(a.id));
  });

  const minX = Math.min(...visibleNodes.map((n) => n.hierarchyX));
  const maxX = Math.max(...visibleNodes.map((n) => n.hierarchyX)) + 200;
  const minY = Math.min(...visibleNodes.map((n) => n.hierarchyY));
  const maxY = Math.max(...visibleNodes.map((n) => n.hierarchyY)) + 100;

  const padding = 40;
  const viewBoxWidth = maxX - minX + padding * 2;
  const viewBoxHeight = maxY - minY + padding * 2;

  return (
    <svg
      viewBox={`${minX - padding} ${minY - padding} ${viewBoxWidth} ${viewBoxHeight}`}
      className="h-full w-full"
      style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
    >
      {/* Connection lines */}
      {visibleNodes.map((node) => {
        if (!node.parentId) return null;
        const parent = layoutNodes.find((n) => n.id === node.parentId);
        if (!parent) return null;

        return (
          <line
            key={`edge-${node.id}`}
            x1={parent.hierarchyX + 80}
            y1={parent.hierarchyY + 40}
            x2={node.hierarchyX + 80}
            y2={node.hierarchyY}
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
            opacity="0.6"
          />
        );
      })}

      {/* Nodes */}
      {visibleNodes.map((node) => (
        <NodeRenderer
          key={node.id}
          node={node}
          isSelected={node.id === selectedId}
          isExpanded={expandedIds.has(node.id)}
          hasChildren={node.childCount > 0}
          onSelect={() => onSelectNode(node.id)}
          onToggleExpanded={() => onToggleExpanded(node.id)}
        />
      ))}
    </svg>
  );
}

/**
 * Individual node in the tree
 */
function NodeRenderer({
  node,
  isSelected,
  isExpanded,
  hasChildren,
  onSelect,
  onToggleExpanded,
}: {
  node: LayoutNode;
  isSelected: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onSelect: () => void;
  onToggleExpanded: () => void;
}) {
  const nodeColor = getNodeColor(node.nodeType);

  return (
    <g key={node.id} className="cursor-pointer">
      {/* Node background */}
      <rect
        x={node.hierarchyX}
        y={node.hierarchyY}
        width={160}
        height={80}
        rx="8"
        fill={isSelected ? "hsl(var(--primary) / 0.15)" : "hsl(var(--background))"}
        stroke={isSelected ? "hsl(var(--primary))" : nodeColor}
        strokeWidth={isSelected ? "2" : "1.5"}
        opacity="0.9"
        className="transition-all duration-200"
      />

      {/* Expand/collapse button */}
      {hasChildren && (
        <g onClick={onToggleExpanded} className="cursor-pointer">
          <circle cx={node.hierarchyX + 140} cy={node.hierarchyY + 10} r="6" fill={nodeColor} opacity="0.7" />
          <text x={node.hierarchyX + 140} y={node.hierarchyY + 15} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" pointerEvents="none">
            {isExpanded ? "−" : "+"}
          </text>
        </g>
      )}

      {/* Text content */}
      <text x={node.hierarchyX + 80} y={node.hierarchyY + 28} textAnchor="middle" fontSize="13" fontWeight="600" fill="hsl(var(--foreground))">
        {node.title}
      </text>
      <text x={node.hierarchyX + 80} y={node.hierarchyY + 48} textAnchor="middle" fontSize="10" fill="hsl(var(--foreground) / 0.6)" className="line-clamp-2">
        {node.subtitle || node.summary.substring(0, 40)}
      </text>

      {/* Click handler */}
      <rect
        x={node.hierarchyX}
        y={node.hierarchyY}
        width={160}
        height={80}
        rx="8"
        fill="transparent"
        onClick={onSelect}
        className="hover:opacity-50"
      />
    </g>
  );
}

/**
 * Enhanced right panel with better information architecture
 */
function EnhancedNodePanel({ selectedNode, onSelectNode }: { selectedNode: KnowledgeNode; onSelectNode: (nodeId: string) => void }) {
  const relatedNodes = useMemo(() => {
    const children = getChildren(selectedNode.id, knowledgeNodes);
    const ancestors = getAncestorChain(selectedNode.id, knowledgeNodes);
    return { children, ancestors };
  }, [selectedNode]);

  return (
    <aside className="surface-calm overflow-hidden rounded-lg lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-5 lg:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {selectedNode.nodeType.replace(/_/g, " ").toLowerCase()}
          </Badge>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl font-semibold leading-tight text-foreground">{selectedNode.title}</h2>

        {/* Summary */}
        <p className="mt-3 text-sm leading-6 text-foreground/72">{selectedNode.summary}</p>

        {/* Action button */}
        {selectedNode.href && (
          <Link
            href={selectedNode.href as Route}
            className="mt-4 inline-flex h-8 items-center gap-2 rounded border border-border bg-background/70 px-3 text-xs font-medium hover:bg-muted transition-colors"
          >
            Explore further →
          </Link>
        )}

        {/* Knowledge structure section */}
        {relatedNodes.ancestors.length > 1 && (
          <div className="mt-6 pt-5 border-t border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Knowledge lineage</h3>
            <div className="mt-3 space-y-2">
              {relatedNodes.ancestors.slice(0, -1).map((node, idx) => (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  className="block w-full text-left px-3 py-2 rounded text-sm hover:bg-muted/50 transition-colors"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {"  ".repeat(relatedNodes.ancestors.length - idx - 2)}↑ derived from
                  </div>
                  <div className="font-medium text-foreground">{node.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Child nodes section */}
        {relatedNodes.children.length > 0 && (
          <div className="mt-6 pt-5 border-t border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Subdivisions ({relatedNodes.children.length})</h3>
            <div className="mt-3 space-y-2">
              {relatedNodes.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => onSelectNode(child.id)}
                  className="block w-full text-left px-3 py-2 rounded text-sm hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium text-foreground text-sm">{child.title}</div>
                  <div className="text-xs text-foreground/60 line-clamp-2 mt-1">{child.summary}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Beginning guidance */}
        {selectedNode.tags?.includes("entry-point") && (
          <div className="mt-6 pt-5 border-t border-border bg-background/40 rounded-lg p-3">
            <p className="text-xs font-semibold text-primary mb-2">Good starting point</p>
            <p className="text-xs leading-5 text-foreground/70">
              {selectedNode.nodeType === "SCRIPTURE"
                ? "This foundational scripture is an excellent place to begin studying this tradition."
                : selectedNode.nodeType === "CONCEPT"
                  ? "This concept appears throughout many teachings and is worth understanding early."
                  : "This is a recommended entry point for exploring this area."}
            </p>
          </div>
        )}
      </motion.div>
    </aside>
  );
}

/**
 * Color coding by node type
 */
function getNodeColor(nodeType: string): string {
  const colors: Record<string, string> = {
    TRADITION: "hsl(var(--primary))",
    SCRIPTURE: "hsl(45, 93%, 47%)", // Gold
    BOOK: "hsl(45, 93%, 55%)", // Lighter gold
    CHAPTER: "hsl(45, 80%, 60%)",
    CONCEPT: "hsl(120, 73%, 42%)", // Green
    PHILOSOPHY_SCHOOL: "hsl(280, 85%, 45%)", // Purple
    PRACTICE: "hsl(200, 70%, 45%)", // Blue
    COMMENTARY: "hsl(30, 80%, 50%)", // Orange
  };
  return colors[nodeType] || "hsl(var(--border))";
}

