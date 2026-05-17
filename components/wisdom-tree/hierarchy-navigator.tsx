"use client";

import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  LocateFixed,
  Maximize2,
  Minimize2,
  Minus,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getKnowledgeNode, getRelatedEdges, knowledgeNodes } from "@/lib/content/knowledge-graph";
import { cn } from "@/lib/utils/cn";
import type { KnowledgeEdge, KnowledgeNode } from "@/types/knowledge";

type HierarchyNavigatorProps = {
  initialNodeId?: string;
  viewMode?: "tree" | "radial" | "timeline";
  compact?: boolean;
};

type ExplorerStyle = CSSProperties & {
  "--detail-width": string;
};

type Point = {
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

type MindColumn = {
  id: string;
  parentId?: string;
  nodes: KnowledgeNode[];
};

type MindLayout = {
  columns: MindColumn[];
  positions: Map<string, NodePosition>;
  connectors: Connector[];
  width: number;
  height: number;
};

type NodePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
};

type Connector = {
  id: string;
  source: KnowledgeNode;
  target: KnowledgeNode;
  path: string;
  active: boolean;
};

const ROOT_ID = "wisdom-root";
const NODE_WIDTH = 316;
const ROOT_WIDTH = 370;
const NODE_HEIGHT = 128;
const ROOT_HEIGHT = 158;
const COLUMN_GAP = 150;
const ROW_GAP = 18;
const CANVAS_PADDING = 52;
const MIN_ZOOM = 0.72;
const MAX_ZOOM = 1.22;

export function HierarchyNavigator({ initialNodeId = ROOT_ID, compact = false }: HierarchyNavigatorProps) {
  const initialLineage = useMemo(() => getLineage(initialNodeId), [initialNodeId]);
  const [selectedId, setSelectedId] = useState(initialNodeId);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([ROOT_ID, ...initialLineage.slice(0, -1).map((node) => node.id)]),
  );
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [zoom, setZoom] = useState(0.88);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 900, height: 680 });
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const selectedNode = getKnowledgeNode(selectedId) ?? getKnowledgeNode(ROOT_ID) ?? knowledgeNodes[0];
  const rootNode = getKnowledgeNode(ROOT_ID) ?? knowledgeNodes[0];
  const breadcrumb = useMemo(() => getLineage(selectedNode.id), [selectedNode.id]);
  const breadcrumbIds = useMemo(() => new Set(breadcrumb.map((node) => node.id)), [breadcrumb]);
  const layout = useMemo(
    () => buildMindLayout(rootNode, selectedNode.id, expandedIds, breadcrumbIds),
    [rootNode, selectedNode.id, expandedIds, breadcrumbIds],
  );
  const contextualEdges = useMemo(() => getContextualEdges(selectedNode.id), [selectedNode.id]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewportSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const position = layout.positions.get(selectedNode.id);
    if (!position) return;

    const hasOpenChildren = expandedIds.has(selectedNode.id) && getChildren(selectedNode.id).length > 0;
    const focusX = viewportSize.width * (hasOpenChildren ? 0.28 : 0.46);
    const focusY = viewportSize.height * 0.48;

    setPan({
      x: Math.round(focusX - (position.x + position.width / 2) * zoom),
      y: Math.round(focusY - (position.y + position.height / 2) * zoom),
    });
  }, [expandedIds, layout.positions, selectedNode.id, viewportSize.height, viewportSize.width, zoom]);

  function handleNodeClick(node: KnowledgeNode) {
    const children = getChildren(node.id);
    const lineage = getLineage(node.id);

    setSelectedId(node.id);

    if (children.length === 0) {
      setExpandedIds(new Set(lineage.slice(0, -1).map((item) => item.id)));
      return;
    }

    setExpandedIds((current) => {
      if (current.has(node.id)) {
        const descendants = new Set(getDescendantIds(node.id));
        const next = new Set(current);
        next.delete(node.id);
        descendants.forEach((id) => next.delete(id));
        lineage.slice(0, -1).forEach((item) => next.add(item.id));
        return next;
      }

      return new Set([...lineage.map((item) => item.id), node.id]);
    });
  }

  function resetArchive() {
    setSelectedId(ROOT_ID);
    setExpandedIds(new Set([ROOT_ID]));
    setZoom(0.88);
  }

  function resetViewport() {
    const position = layout.positions.get(selectedNode.id);
    if (!position) {
      setPan({ x: 0, y: 0 });
      return;
    }

    setPan({
      x: Math.round(viewportSize.width * 0.4 - (position.x + position.width / 2) * zoom),
      y: Math.round(viewportSize.height * 0.48 - (position.y + position.height / 2) * zoom),
    });
  }

  function adjustZoom(delta: number) {
    setZoom((value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((value + delta).toFixed(2)))));
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button, a")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragState({
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    });
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    setPan({
      x: dragState.originX + event.clientX - dragState.startX,
      y: dragState.originY + event.clientY - dragState.startY,
    });
  }

  function stopDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragState?.pointerId === event.pointerId) {
      setDragState(null);
    }
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        panelCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_var(--detail-width)]",
        isFocusMode && "fixed inset-3 z-50 overflow-hidden bg-background p-3 shadow-2xl sm:inset-5 sm:p-5",
      )}
      style={{ "--detail-width": "340px" } as ExplorerStyle}
    >
      <section className="surface-calm overflow-hidden rounded-lg">
        <div className="flex flex-col gap-4 border-b border-border bg-background/72 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {breadcrumb.map((node, index) => (
                <span key={node.id} className="inline-flex items-center gap-1.5">
                  <button type="button" className="rounded-sm hover:text-foreground" onClick={() => handleNodeClick(node)}>
                    {node.title}
                  </button>
                  {index < breadcrumb.length - 1 ? <ChevronRight className="size-3" aria-hidden="true" /> : null}
                </span>
              ))}
            </div>
            <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight sm:text-3xl">
              {selectedNode.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="ghost" size="icon" aria-label="Zoom out" onClick={() => adjustZoom(-0.08)}>
              <Minus className="size-4" aria-hidden="true" />
            </Button>
            <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <Button type="button" variant="ghost" size="icon" aria-label="Zoom in" onClick={() => adjustZoom(0.08)}>
              <Plus className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Recenter mind map" onClick={resetViewport}>
              <LocateFixed className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Reset mind map" onClick={resetArchive}>
              <RotateCcw className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={panelCollapsed ? "Show detail panel" : "Hide detail panel"}
              onClick={() => setPanelCollapsed((value) => !value)}
            >
              {panelCollapsed ? <PanelRightOpen className="size-4" aria-hidden="true" /> : <PanelRightClose className="size-4" aria-hidden="true" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isFocusMode ? "Exit fullscreen map" : "Enter fullscreen map"}
              onClick={() => setIsFocusMode((value) => !value)}
            >
              {isFocusMode ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        <div
          ref={viewportRef}
          className={cn(
            "relative min-h-[720px] cursor-grab overflow-hidden bg-wisdom-layered",
            compact && "min-h-[620px]",
            isFocusMode && "h-[calc(100vh-9rem)]",
            dragState && "cursor-grabbing",
          )}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:96px_96px]" />

          <motion.div
            className="absolute left-0 top-0"
            animate={{ x: pan.x, y: pan.y, scale: zoom }}
            transition={{ type: "spring", stiffness: 240, damping: 32, mass: 0.55 }}
            style={{ transformOrigin: "0 0" }}
          >
            <MindMapCanvas
              layout={layout}
              selectedId={selectedNode.id}
              expandedIds={expandedIds}
              breadcrumbIds={breadcrumbIds}
              onNodeClick={handleNodeClick}
            />
          </motion.div>
        </div>
      </section>

      {!panelCollapsed ? (
        <ArchiveDetailPanel node={selectedNode} breadcrumb={breadcrumb} edges={contextualEdges} onSelectNode={(node) => handleNodeClick(node)} />
      ) : null}
    </div>
  );
}

function MindMapCanvas({
  layout,
  selectedId,
  expandedIds,
  breadcrumbIds,
  onNodeClick,
}: {
  layout: MindLayout;
  selectedId: string;
  expandedIds: Set<string>;
  breadcrumbIds: Set<string>;
  onNodeClick: (node: KnowledgeNode) => void;
}) {
  return (
    <div className="relative" style={{ width: layout.width, height: layout.height }}>
      <svg className="pointer-events-none absolute inset-0" width={layout.width} height={layout.height} aria-hidden="true">
        {layout.connectors.map((connector) => (
          <motion.path
            key={connector.id}
            d={connector.path}
            fill="none"
            stroke={connector.active ? "hsl(var(--primary) / 0.78)" : "hsl(var(--primary) / 0.34)"}
            strokeLinecap="round"
            strokeWidth={connector.active ? 3 : 2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          />
        ))}
      </svg>

      {layout.columns.flatMap((column) =>
        column.nodes.map((node) => {
          const position = layout.positions.get(node.id);
          if (!position) return null;

          return (
            <motion.div
              key={node.id}
              layout
              className="absolute"
              style={{ left: position.x, top: position.y, width: position.width, height: position.height }}
              initial={{ opacity: 0, scale: 0.96, x: -18 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
            >
              <MindNode
                node={node}
                active={selectedId === node.id}
                lineage={breadcrumbIds.has(node.id)}
                expanded={expandedIds.has(node.id)}
                childCount={getChildren(node.id).length}
                depth={position.column}
                onClick={() => onNodeClick(node)}
              />
            </motion.div>
          );
        }),
      )}
    </div>
  );
}

function MindNode({
  node,
  active,
  lineage,
  expanded,
  childCount,
  depth,
  onClick,
}: {
  node: KnowledgeNode;
  active: boolean;
  lineage: boolean;
  expanded: boolean;
  childCount: number;
  depth: number;
  onClick: () => void;
}) {
  const root = depth === 0;
  const important = root || node.id === "vedas" || node.id === "bhagavad-gita";
  const canExpand = childCount > 0;

  return (
    <button
      type="button"
      className={cn(
        "focus-ring-calm flex h-full w-full flex-col justify-between rounded-lg border p-4 text-left shadow-calm transition-all duration-300 ease-premium",
        "bg-[linear-gradient(180deg,hsl(var(--card)/0.98),hsl(var(--background)/0.88))]",
        active && "border-primary shadow-glow",
        !active && lineage && "border-primary/55",
        !active && !lineage && "border-border hover:border-primary/45",
      )}
      onClick={onClick}
    >
      <span>
        <span className="flex items-center justify-between gap-3">
          <Badge variant={active ? "default" : "outline"}>{root ? "root" : labelForType(node.nodeType)}</Badge>
          {canExpand ? (
            <span className={cn("inline-flex size-8 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground", expanded && "text-primary")}>
              {expanded ? <ChevronDown className="size-4" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
            </span>
          ) : null}
        </span>
        <span
          className={cn(
            "mt-3 block font-serif font-semibold leading-tight text-foreground",
            root ? "text-3xl" : important ? "text-2xl" : "text-xl",
          )}
        >
          {node.title}
        </span>
        <span className="mt-2 line-clamp-2 block text-sm leading-6 text-foreground/70">{node.summary}</span>
      </span>

      <span className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <BookOpen className="size-3.5 text-primary" aria-hidden="true" />
        {childCount > 0 ? `${childCount} branches` : "end node"}
      </span>
    </button>
  );
}

function ArchiveDetailPanel({
  node,
  breadcrumb,
  edges,
  onSelectNode,
}: {
  node: KnowledgeNode;
  breadcrumb: KnowledgeNode[];
  edges: KnowledgeEdge[];
  onSelectNode: (node: KnowledgeNode) => void;
}) {
  const children = getChildren(node.id);

  return (
    <aside className="surface-calm overflow-hidden rounded-lg lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <motion.div key={node.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-5">
        <div className="flex flex-wrap gap-2">
          <Badge>{labelForType(node.nodeType)}</Badge>
          {node.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight">{node.title}</h2>
        <p className="mt-3 text-sm leading-7 text-foreground/74">{node.summary}</p>

        {node.href ? (
          <Link
            href={node.href as Route}
            className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background/70 px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open study page
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}

        <PanelSection title="Lineage">
          <div className="space-y-2">
            {breadcrumb.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
                  item.id === node.id ? "border-primary bg-primary/10" : "border-border bg-background/60 hover:bg-muted",
                )}
                onClick={() => onSelectNode(item)}
              >
                <span className="text-xs text-muted-foreground">Generation {index}</span>
                <span className="block font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </PanelSection>

        {children.length > 0 ? (
          <PanelSection title="Next Branches">
            <div className="space-y-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className="block w-full rounded-md border border-border bg-background/60 px-3 py-2 text-left transition-colors hover:bg-muted"
                  onClick={() => onSelectNode(child)}
                >
                  <span className="block text-sm font-medium">{child.title}</span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-5 text-foreground/64">{child.summary}</span>
                </button>
              ))}
            </div>
          </PanelSection>
        ) : null}

        {edges.length > 0 ? (
          <PanelSection title="Related">
            <div className="space-y-3">
              {edges.slice(0, 3).map((edge) => {
                const otherId = edge.source === node.id ? edge.target : edge.source;
                const other = getKnowledgeNode(otherId);
                if (!other) return null;

                return (
                  <button
                    key={edge.id}
                    type="button"
                    className="block w-full rounded-md border border-border bg-background/60 p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted"
                    onClick={() => onSelectNode(other)}
                  >
                    <span className="font-medium">{other.title}</span>
                    <span className="mt-2 line-clamp-2 block text-xs leading-5 text-foreground/68">{edge.explanation ?? edge.summary}</span>
                  </button>
                );
              })}
            </div>
          </PanelSection>
        ) : null}
      </motion.div>
    </aside>
  );
}

function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-7 border-t border-border pt-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function buildMindLayout(rootNode: KnowledgeNode, selectedId: string, expandedIds: Set<string>, breadcrumbIds: Set<string>): MindLayout {
  const columns = buildColumns(rootNode, selectedId, expandedIds);
  const maxRows = Math.max(...columns.map((column) => column.nodes.length), 1);
  const positions = new Map<string, NodePosition>();
  const stackHeight = maxRows * NODE_HEIGHT + Math.max(0, maxRows - 1) * ROW_GAP;

  columns.forEach((column, columnIndex) => {
    const columnWidth = columnIndex === 0 ? ROOT_WIDTH : NODE_WIDTH;
    const nodeHeight = columnIndex === 0 ? ROOT_HEIGHT : NODE_HEIGHT;
    const x = CANVAS_PADDING + columnIndex * (NODE_WIDTH + COLUMN_GAP);
    const columnHeight = column.nodes.length * nodeHeight + Math.max(0, column.nodes.length - 1) * ROW_GAP;
    const startY = CANVAS_PADDING + Math.max(0, (stackHeight - columnHeight) / 2);

    column.nodes.forEach((node, rowIndex) => {
      positions.set(node.id, {
        x,
        y: startY + rowIndex * (nodeHeight + ROW_GAP),
        width: columnWidth,
        height: nodeHeight,
        column: columnIndex,
      });
    });
  });

  const connectors = columns.flatMap((column) => {
    if (!column.parentId) return [];
    const source = getKnowledgeNode(column.parentId);
    const sourcePosition = source ? positions.get(source.id) : undefined;
    if (!source || !sourcePosition) return [];

    return column.nodes.flatMap((target) => {
      const targetPosition = positions.get(target.id);
      if (!targetPosition) return [];

      const startX = sourcePosition.x + sourcePosition.width;
      const startY = sourcePosition.y + sourcePosition.height / 2;
      const endX = targetPosition.x;
      const endY = targetPosition.y + targetPosition.height / 2;
      const curve = Math.max(80, (endX - startX) * 0.55);

      return {
        id: `${source.id}-${target.id}`,
        source,
        target,
        path: `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`,
        active: breadcrumbIds.has(source.id) && breadcrumbIds.has(target.id),
      };
    });
  });

  return {
    columns,
    positions,
    connectors,
    width: CANVAS_PADDING * 2 + columns.length * NODE_WIDTH + Math.max(0, columns.length - 1) * COLUMN_GAP + 80,
    height: CANVAS_PADDING * 2 + Math.max(stackHeight, ROOT_HEIGHT, 560),
  };
}

function buildColumns(rootNode: KnowledgeNode, selectedId: string, expandedIds: Set<string>): MindColumn[] {
  const lineage = getLineage(selectedId);
  const columns: MindColumn[] = [{ id: "root", nodes: [rootNode] }];
  const rootChildren = expandedIds.has(rootNode.id) ? getChildren(rootNode.id) : [];

  if (rootChildren.length > 0) {
    columns.push({ id: `${rootNode.id}-children`, parentId: rootNode.id, nodes: rootChildren });
  }

  lineage.slice(1).forEach((node) => {
    const children = expandedIds.has(node.id) ? getChildren(node.id) : [];
    if (children.length > 0) {
      columns.push({ id: `${node.id}-children`, parentId: node.id, nodes: children });
    }
  });

  return columns;
}

function getChildren(nodeId: string): KnowledgeNode[] {
  return knowledgeNodes.filter((node) => node.parentId === nodeId);
}

function getDescendantIds(nodeId: string): string[] {
  const children = getChildren(nodeId);
  return children.flatMap((child) => [child.id, ...getDescendantIds(child.id)]);
}

function getLineage(nodeId: string): KnowledgeNode[] {
  const nodeMap = new Map(knowledgeNodes.map((node) => [node.id, node]));
  const lineage: KnowledgeNode[] = [];
  let current = nodeMap.get(nodeId);

  while (current) {
    lineage.unshift(current);
    current = current.parentId ? nodeMap.get(current.parentId) : undefined;
  }

  return lineage;
}

function getContextualEdges(nodeId: string) {
  return getRelatedEdges(nodeId)
    .filter((edge) => edge.relationshipType !== "BELONGS_TO" || edge.weight >= 4)
    .sort((a, b) => b.weight - a.weight);
}

function labelForType(nodeType: KnowledgeNode["nodeType"]) {
  return nodeType.replaceAll("_", " ").toLowerCase();
}
