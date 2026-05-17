"use client";

import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  BookMarked,
  ChevronDown,
  ChevronRight,
  Circle,
  Flame,
  GraduationCap,
  LocateFixed,
  Landmark,
  Library,
  Maximize2,
  Minimize2,
  Minus,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  RotateCcw,
  ScrollText,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getKnowledgeNode, getRelatedEdges, guidedExplorationPaths, knowledgeNodes } from "@/lib/content/knowledge-graph";
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

type ViewportSize = {
  width: number;
  height: number;
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

type NodeDimension = {
  width: number;
  height: number;
};

type Connector = {
  id: string;
  source: KnowledgeNode;
  target: KnowledgeNode;
  path: string;
  active: boolean;
  focused: boolean;
};

const ROOT_ID = "wisdom-root";
const NODE_WIDTH = 316;
const ROOT_WIDTH = 370;
const NODE_HEIGHT = 128;
const ROOT_HEIGHT = 158;
const BASE_COLUMN_GAP = 188;
const BASE_ROW_GAP = 30;
const CANVAS_PADDING = 52;
const VIEWPORT_MARGIN = 42;
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
  const lastAutoFocusRef = useRef(initialNodeId);

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

    if (dragState) return;

    const selectedChanged = lastAutoFocusRef.current !== selectedNode.id;

    setPan((current) => {
      const target = getSmartPanTarget(layout, selectedNode.id, viewportSize, zoom, current);
      const easing = selectedChanged ? 0.86 : 0.58;
      const next = {
        x: Math.round(current.x + (target.x - current.x) * easing),
        y: Math.round(current.y + (target.y - current.y) * easing),
      };

      if (Math.abs(next.x - current.x) < 1 && Math.abs(next.y - current.y) < 1) {
        return current;
      }

      return next;
    });

    lastAutoFocusRef.current = selectedNode.id;
  }, [dragState, expandedIds, layout, selectedNode.id, viewportSize, zoom]);

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

    setPan(getSmartPanTarget(layout, selectedNode.id, viewportSize, zoom, pan, true));
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
            transition={{ type: "spring", stiffness: 170, damping: 34, mass: 0.72 }}
            style={{ transformOrigin: "0 0" }}
          >
            <MindMapCanvas
              layout={layout}
              selectedId={selectedNode.id}
              expandedIds={expandedIds}
              breadcrumbIds={breadcrumbIds}
              zoom={zoom}
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
  zoom,
  onNodeClick,
}: {
  layout: MindLayout;
  selectedId: string;
  expandedIds: Set<string>;
  breadcrumbIds: Set<string>;
  zoom: number;
  onNodeClick: (node: KnowledgeNode) => void;
}) {
  return (
    <div className="relative" style={{ width: layout.width, height: layout.height }}>
      <svg className="pointer-events-none absolute inset-0" width={layout.width} height={layout.height} aria-hidden="true">
        {layout.connectors.map((connector) => {
          const visual = getConnectorVisual(connector);

          return (
            <motion.path
              key={connector.id}
              d={connector.path}
              fill="none"
              stroke={visual.stroke}
              strokeLinecap="round"
              strokeWidth={visual.width}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: visual.opacity }}
              transition={{ duration: 0.42, ease: "easeOut" }}
            />
          );
        })}
      </svg>

      {layout.columns.flatMap((column) =>
        column.nodes.map((node) => {
          const position = layout.positions.get(node.id);
          if (!position) return null;
          const active = selectedId === node.id;
          const lineage = breadcrumbIds.has(node.id);
          const parent = getKnowledgeNode(selectedId)?.parentId === node.id;
          const focused = active || lineage || parent || node.parentId === selectedId;

          return (
            <motion.div
              key={node.id}
              layout
              className={cn("absolute", !focused && "opacity-[0.72] saturate-[0.82]")}
              style={{ left: position.x, top: position.y, width: position.width, height: position.height }}
              initial={{ opacity: 0, scale: 0.96, x: -18 }}
              animate={{ opacity: focused ? 1 : 0.72, scale: 1, x: 0 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
            >
              <MindNode
                node={node}
                active={active}
                lineage={lineage}
                parent={parent}
                focused={focused}
                expanded={expandedIds.has(node.id)}
                childCount={getChildren(node.id).length}
                depth={position.column}
                zoom={zoom}
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
  parent,
  focused,
  expanded,
  childCount,
  depth,
  zoom,
  onClick,
}: {
  node: KnowledgeNode;
  active: boolean;
  lineage: boolean;
  parent: boolean;
  focused: boolean;
  expanded: boolean;
  childCount: number;
  depth: number;
  zoom: number;
  onClick: () => void;
}) {
  const root = depth === 0;
  const importance = getNodeImportance(node);
  const important = root || importance >= 2;
  const canExpand = childCount > 0;
  const lowZoom = zoom < 0.82;
  const highZoom = zoom > 0.96;
  const semanticStyle = getNodeSemanticStyle(node.nodeType);
  const TypeIcon = semanticStyle.icon;

  return (
    <button
      type="button"
      className={cn(
        "focus-ring-calm relative flex h-full w-full flex-col overflow-hidden rounded-lg border text-left shadow-calm transition-all duration-300 ease-premium",
        lowZoom ? "justify-center p-3.5" : "justify-between p-4",
        semanticStyle.surface,
        semanticStyle.border,
        focused && !active && "shadow-soft",
        active && "border-primary shadow-glow ring-1 ring-primary/24",
        parent && !active && "border-primary/45 ring-1 ring-primary/10",
        !active && lineage && "border-primary/60 shadow-soft",
        !active && focused && !lineage && !parent && "border-primary/35",
        !active && !focused && "border-border hover:border-primary/45 hover:opacity-100 hover:saturate-100",
      )}
      onClick={onClick}
    >
      <span className={cn("pointer-events-none absolute inset-y-3 left-0 w-1 rounded-r-full", active ? "bg-primary/70" : lineage ? "bg-primary/38" : semanticStyle.accent)} />
      <span>
        <span className={cn("flex items-center justify-between gap-3", lowZoom && "mb-1")}>
          {!lowZoom ? (
            <Badge
              variant={active ? "default" : "outline"}
              className={cn("gap-1.5 pl-2", !focused && "text-muted-foreground/80")}
            >
              <TypeIcon className={cn("size-3.5", semanticStyle.iconTone)} aria-hidden="true" />
              {root ? "root" : labelForType(node.nodeType)}
            </Badge>
          ) : (
            <span className={cn("inline-flex size-7 items-center justify-center rounded-full border bg-background/74", active ? "border-primary/50 text-primary" : semanticStyle.iconRing)}>
              <TypeIcon className="size-3.5" aria-hidden="true" />
            </span>
          )}
          {canExpand ? (
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full border bg-background/76 text-muted-foreground transition-colors",
                lowZoom ? "size-7" : "size-8",
                expanded ? "border-primary/45 text-primary" : "border-border",
                active && "bg-primary/10",
              )}
              aria-hidden="true"
            >
              {expanded ? <ChevronDown className="size-4" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/48 text-muted-foreground/70",
                lowZoom ? "size-6" : "size-7",
              )}
              aria-hidden="true"
            >
              <Circle className="size-2 fill-current" aria-hidden="true" />
            </span>
          )}
        </span>
        <span
          className={cn(
            "block font-serif leading-tight text-foreground",
            lowZoom ? "mt-2" : "mt-3",
            root ? "text-3xl font-semibold" : important ? "text-2xl font-semibold" : node.nodeType === "CONCEPT" ? "text-lg font-medium" : "text-xl font-semibold",
            active && "text-primary",
            parent && !active && "text-foreground/88",
          )}
        >
          {node.title}
        </span>
        {!lowZoom ? (
          <span className={cn("mt-2 block text-sm leading-6", highZoom ? "line-clamp-2" : "line-clamp-1", focused ? "text-foreground/74" : "text-foreground/56")}>{node.summary}</span>
        ) : null}
      </span>

      {!lowZoom ? (
        <span className={cn("mt-3 flex items-center justify-between gap-2 text-xs", focused ? "text-muted-foreground" : "text-muted-foreground/72")}>
          <span className="inline-flex min-w-0 items-center gap-2">
            <BookOpen className={cn("size-3.5", focused ? "text-primary" : "text-primary/60")} aria-hidden="true" />
            <span>{childCount > 0 ? `${childCount} branches` : "terminal"}</span>
          </span>
          {lineage ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary/90">{active ? "focus" : parent ? "parent" : "lineage"}</span> : null}
        </span>
      ) : null}
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
  const recommendations = getGuidedRecommendations(node, children, edges);
  const startHerePath = node.id === ROOT_ID ? guidedExplorationPaths.find((path) => path.id === "start-here") : undefined;
  const relevantPaths = guidedExplorationPaths.filter((path) => path.id !== "start-here" && path.nodeIds.includes(node.id)).slice(0, 3);
  const comparisonEdges = getComparisonEdges(node, edges);

  return (
    <aside className="surface-calm overflow-hidden rounded-lg lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <motion.div key={node.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-5">
        <div className="flex flex-wrap gap-2">
          <Badge>{labelForType(node.nodeType)}</Badge>
          {node.difficulty ? <Badge variant="secondary">{labelForDifficulty(node.difficulty)}</Badge> : null}
          {node.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight">{node.title}</h2>
        <p className="mt-3 text-sm leading-7 text-foreground/74">{node.summary}</p>
        {node.era || node.century || node.region ? (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {[node.era, node.century, node.region].filter(Boolean).join(" - ")}
          </p>
        ) : null}

        {node.guidance ? (
          <div className="mt-5 rounded-md border border-border bg-background/58 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Study Note</p>
            <p className="mt-2 text-sm leading-6 text-foreground/76">{node.guidance.whyItMatters}</p>
            {node.guidance.levelNote ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{node.guidance.levelNote}</p> : null}
            {node.guidance.emerged ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{node.guidance.emerged}</p> : null}
          </div>
        ) : null}

        {node.href ? (
          <Link
            href={node.href as Route}
            className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background/70 px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open study page
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}

        {startHerePath ? (
          <PanelSection title="Start Here">
            <p className="mb-3 text-sm leading-6 text-foreground/70">{startHerePath.summary}</p>
            <PathSequence nodeIds={startHerePath.nodeIds} currentId={node.id} onSelectNode={onSelectNode} />
          </PanelSection>
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

        {(recommendations.prerequisites.length > 0 || recommendations.next.length > 0) ? (
          <PanelSection title="Recommended Study">
            {recommendations.prerequisites.length > 0 ? (
              <GuidedNodeList title="Foundations" nodes={recommendations.prerequisites} onSelectNode={onSelectNode} />
            ) : null}
            {recommendations.next.length > 0 ? (
              <GuidedNodeList title="Next Exploration" nodes={recommendations.next} onSelectNode={onSelectNode} />
            ) : null}
          </PanelSection>
        ) : null}

        {relevantPaths.length > 0 ? (
          <PanelSection title="Guided Paths">
            <div className="space-y-3">
              {relevantPaths.map((path) => (
                <div key={path.id} className="rounded-md border border-border bg-background/55 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{path.title}</p>
                      <p className="mt-1 text-xs leading-5 text-foreground/64">{path.summary}</p>
                    </div>
                    <Badge variant="outline">{labelForDifficulty(path.difficulty)}</Badge>
                  </div>
                  <div className="mt-3">
                    <PathSequence nodeIds={path.nodeIds} currentId={node.id} onSelectNode={onSelectNode} compact />
                  </div>
                </div>
              ))}
            </div>
          </PanelSection>
        ) : null}

        {comparisonEdges.length > 0 ? (
          <PanelSection title="Comparative View">
            <div className="space-y-3">
              {comparisonEdges.map((edge) => {
                const otherId = edge.source === node.id ? edge.target : edge.source;
                const other = getKnowledgeNode(otherId);
                if (!other?.comparison || !node.comparison) return null;

                return <ComparisonCard key={edge.id} node={node} other={other} edge={edge} onSelectNode={onSelectNode} />;
              })}
            </div>
          </PanelSection>
        ) : null}

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

function GuidedNodeList({
  title,
  nodes,
  onSelectNode,
}: {
  title: string;
  nodes: KnowledgeNode[];
  onSelectNode: (node: KnowledgeNode) => void;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>
      <div className="space-y-2">
        {nodes.map((item) => (
          <button
            key={item.id}
            type="button"
            className="block w-full rounded-md border border-border bg-background/58 px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-muted"
            onClick={() => onSelectNode(item)}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{item.title}</span>
              {item.difficulty ? <span className="text-[11px] text-muted-foreground">{labelForDifficulty(item.difficulty)}</span> : null}
            </span>
            <span className="mt-1 line-clamp-2 block text-xs leading-5 text-foreground/62">{item.summary}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ComparisonCard({
  node,
  other,
  edge,
  onSelectNode,
}: {
  node: KnowledgeNode;
  other: KnowledgeNode;
  edge: KnowledgeEdge;
  onSelectNode: (node: KnowledgeNode) => void;
}) {
  if (!node.comparison || !other.comparison) return null;

  const allRows: Array<[string, string | undefined, string | undefined]> = [
    ["Core", node.comparison.coreBelief, other.comparison.coreBelief],
    ["Brahman", node.comparison.brahman, other.comparison.brahman],
    ["Atman", node.comparison.atman, other.comparison.atman],
    ["Moksha", node.comparison.moksha, other.comparison.moksha],
    ["Bhakti", node.comparison.bhakti, other.comparison.bhakti],
    ["Ritual", node.comparison.ritual, other.comparison.ritual],
    ["Vedas", node.comparison.vedas, other.comparison.vedas],
  ];
  const rows = allRows.filter(([, left, right]) => left || right);

  return (
    <div className="rounded-md border border-border bg-background/55 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{edge.label}</p>
          <p className="mt-1 text-xs leading-5 text-foreground/64">{edge.explanation ?? edge.summary}</p>
        </div>
        <Badge variant="outline">{labelForRelationship(edge.relationshipType)}</Badge>
      </div>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-foreground/80">
          <span>{node.title}</span>
          <button type="button" className="text-left text-primary hover:underline" onClick={() => onSelectNode(other)}>
            {other.title}
          </button>
        </div>
        {rows.slice(0, 5).map(([label, left, right]) => (
          <div key={label} className="border-t border-border pt-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
            <div className="grid grid-cols-2 gap-3 text-xs leading-5 text-foreground/68">
              <p>{left ?? "Not emphasized in this profile."}</p>
              <p>{right ?? "Not emphasized in this profile."}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PathSequence({
  nodeIds,
  currentId,
  compact = false,
  onSelectNode,
}: {
  nodeIds: string[];
  currentId: string;
  compact?: boolean;
  onSelectNode: (node: KnowledgeNode) => void;
}) {
  const nodes = nodeIds.map((id) => getKnowledgeNode(id)).filter(Boolean) as KnowledgeNode[];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {nodes.map((item, index) => (
        <span key={item.id} className="inline-flex items-center gap-1.5">
          <button
            type="button"
            className={cn(
              "rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors hover:border-primary/40 hover:bg-muted",
              item.id === currentId ? "border-primary bg-primary/10 text-primary" : "border-border bg-background/60 text-foreground/76",
              compact && "px-2 py-1 text-[11px]",
            )}
            onClick={() => onSelectNode(item)}
          >
            {item.title}
          </button>
          {index < nodes.length - 1 ? <ChevronRight className="size-3 text-muted-foreground" aria-hidden="true" /> : null}
        </span>
      ))}
    </div>
  );
}

function getGuidedRecommendations(node: KnowledgeNode, children: KnowledgeNode[], edges: KnowledgeEdge[]) {
  const prerequisiteIds = node.guidance?.prerequisiteIds ?? [];
  const guidedNextIds = node.guidance?.recommendedNextIds ?? [];
  const relationshipNextIds = edges
    .filter((edge) => edge.relationshipType !== "BELONGS_TO")
    .sort((a, b) => b.weight - a.weight)
    .map((edge) => (edge.source === node.id ? edge.target : edge.source));
  const childIds = children.slice(0, 4).map((child) => child.id);
  const nextIds = uniqueIds([...guidedNextIds, ...childIds, ...relationshipNextIds])
    .filter((id) => id !== node.id && !prerequisiteIds.includes(id))
    .slice(0, 6);

  return {
    prerequisites: getNodesByIds(prerequisiteIds).slice(0, 4),
    next: getNodesByIds(nextIds),
  };
}

function getComparisonEdges(node: KnowledgeNode, edges: KnowledgeEdge[]) {
  if (!node.comparison) {
    return [];
  }

  return edges
    .filter((edge) => ["PHILOSOPHICALLY_OPPOSED", "PHILOSOPHICALLY_SIMILAR"].includes(edge.relationshipType))
    .filter((edge) => {
      const otherId = edge.source === node.id ? edge.target : edge.source;
      return Boolean(getKnowledgeNode(otherId)?.comparison);
    })
    .sort((a, b) => {
      const relationshipPriority = Number(b.relationshipType === "PHILOSOPHICALLY_OPPOSED") - Number(a.relationshipType === "PHILOSOPHICALLY_OPPOSED");
      return relationshipPriority || b.weight - a.weight;
    })
    .slice(0, 2);
}

function getNodesByIds(ids: string[]) {
  return uniqueIds(ids).flatMap((id) => {
    const node = getKnowledgeNode(id);
    return node ? [node] : [];
  });
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids));
}

function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-7 border-t border-border pt-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

type NodeSemanticStyle = {
  icon: LucideIcon;
  surface: string;
  border: string;
  accent: string;
  iconTone: string;
  iconRing: string;
};

const majorNodeIds = new Set([
  "vedas",
  "upanishads",
  "bhagavad-gita",
  "vedanta",
  "sampradayas",
  "vaishnavism",
  "shaivism",
  "shaktism",
]);

function getNodeSemanticStyle(nodeType: KnowledgeNode["nodeType"]): NodeSemanticStyle {
  switch (nodeType) {
    case "SCRIPTURE":
    case "BOOK":
    case "CHAPTER":
      return {
        icon: ScrollText,
        surface: "bg-[linear-gradient(180deg,hsl(var(--card)/0.99),hsl(var(--background)/0.9))]",
        border: "border-primary/24",
        accent: "bg-primary/32",
        iconTone: "text-primary",
        iconRing: "border-primary/28 text-primary",
      };
    case "TRADITION":
      return {
        icon: Landmark,
        surface: "bg-[linear-gradient(180deg,hsl(var(--card)/0.98),hsl(var(--muted)/0.34))]",
        border: "border-secondary/28",
        accent: "bg-secondary/40",
        iconTone: "text-secondary-foreground",
        iconRing: "border-secondary/30 text-secondary-foreground",
      };
    case "COMMENTARY":
      return {
        icon: GraduationCap,
        surface: "bg-[linear-gradient(180deg,hsl(var(--card)/0.98),hsl(var(--background)/0.92))]",
        border: "border-primary/18",
        accent: "bg-primary/24",
        iconTone: "text-primary/82",
        iconRing: "border-primary/22 text-primary/82",
      };
    case "CONCEPT":
      return {
        icon: Sparkles,
        surface: "bg-[linear-gradient(180deg,hsl(var(--card)/0.94),hsl(var(--background)/0.84))]",
        border: "border-border",
        accent: "bg-muted-foreground/24",
        iconTone: "text-muted-foreground",
        iconRing: "border-border text-muted-foreground",
      };
    case "PRACTICE":
      return {
        icon: Flame,
        surface: "bg-[linear-gradient(180deg,hsl(var(--card)/0.97),hsl(var(--background)/0.88))]",
        border: "border-primary/20",
        accent: "bg-primary/26",
        iconTone: "text-primary/78",
        iconRing: "border-primary/24 text-primary/78",
      };
    case "PHILOSOPHY_SCHOOL":
      return {
        icon: Library,
        surface: "bg-[linear-gradient(180deg,hsl(var(--card)/0.98),hsl(var(--background)/0.9))]",
        border: "border-secondary/24",
        accent: "bg-secondary/34",
        iconTone: "text-secondary-foreground/88",
        iconRing: "border-secondary/28 text-secondary-foreground/88",
      };
    default:
      return {
        icon: BookMarked,
        surface: "bg-[linear-gradient(180deg,hsl(var(--card)/0.98),hsl(var(--background)/0.88))]",
        border: "border-border",
        accent: "bg-primary/24",
        iconTone: "text-primary",
        iconRing: "border-primary/24 text-primary",
      };
  }
}

function getNodeImportance(node: KnowledgeNode) {
  if (node.id === ROOT_ID) return 3;
  if (majorNodeIds.has(node.id)) return 2;
  if (node.nodeType === "SCRIPTURE" && !node.parentId) return 2;
  if (node.nodeType === "TRADITION" && node.parentId === "sampradayas") return 2;
  if (node.nodeType === "CONCEPT") return 0;
  return 1;
}

function getNodeDimension(node: KnowledgeNode, columnIndex: number): NodeDimension {
  if (columnIndex === 0) {
    return { width: ROOT_WIDTH, height: ROOT_HEIGHT };
  }

  const importance = getNodeImportance(node);

  if (importance >= 2) {
    return { width: NODE_WIDTH + 18, height: NODE_HEIGHT + 16 };
  }

  if (importance === 0) {
    return { width: NODE_WIDTH - 14, height: NODE_HEIGHT - 10 };
  }

  return { width: NODE_WIDTH, height: NODE_HEIGHT };
}

function getConnectorVisual(connector: Connector) {
  const importance = Math.max(getNodeImportance(connector.source), getNodeImportance(connector.target));
  const semanticBoost = connector.target.nodeType === "SCRIPTURE" || connector.target.nodeType === "PHILOSOPHY_SCHOOL" ? 0.18 : 0;

  if (connector.active) {
    return {
      stroke: "hsl(var(--primary) / 0.9)",
      width: importance >= 2 ? 3.7 : 3.2,
      opacity: 1,
    };
  }

  if (connector.focused) {
    return {
      stroke: `hsl(var(--primary) / ${0.42 + semanticBoost})`,
      width: importance >= 2 ? 2.5 : 2.1,
      opacity: 0.86,
    };
  }

  return {
    stroke: "hsl(var(--primary) / 0.2)",
    width: 1.55,
    opacity: 0.55,
  };
}

function buildMindLayout(rootNode: KnowledgeNode, selectedId: string, expandedIds: Set<string>, breadcrumbIds: Set<string>): MindLayout {
  const columns = buildColumns(rootNode, selectedId, expandedIds);
  const positions = new Map<string, NodePosition>();
  const selectedColumnIndex = Math.max(
    0,
    columns.findIndex((column) => column.nodes.some((node) => node.id === selectedId)),
  );
  const visibleSubtreeSizes = new Map<string, number>();
  const columnMetrics = columns.map((column, index) => {
    const dimensions = column.nodes.map((node) => getNodeDimension(node, index));
    const nodeWidth = Math.max(...dimensions.map((dimension) => dimension.width));
    const rowGaps = column.nodes.slice(0, -1).map((node, nodeIndex) =>
      getAdaptiveRowGap({
        node,
        nextNode: column.nodes[nodeIndex + 1],
        siblingCount: column.nodes.length,
        columnIndex: index,
        selectedColumnIndex,
        selectedId,
        breadcrumbIds,
        expandedIds,
        visibleSubtreeSizes,
      }),
    );
    const height = dimensions.reduce((total, dimension) => total + dimension.height, 0) + rowGaps.reduce((total, gap) => total + gap, 0);

    return { nodeWidth, dimensions, rowGaps, height };
  });

  const xPositions: number[] = [];
  let nextX = CANVAS_PADDING;

  columns.forEach((column, index) => {
    xPositions[index] = nextX;
    const nextColumn = columns[index + 1];
    const nextGap = nextColumn ? getAdaptiveColumnGap(index + 1, nextColumn.nodes.length) : 0;
    nextX += columnMetrics[index].nodeWidth + nextGap;
  });

  const firstBranchHeight = columnMetrics[1]?.height ?? ROOT_HEIGHT;
  const rootTop = CANVAS_PADDING + Math.max(0, (firstBranchHeight - ROOT_HEIGHT) / 2);

  columns.forEach((column, columnIndex) => {
    const { nodeWidth, dimensions, rowGaps, height } = columnMetrics[columnIndex];
    const x = xPositions[columnIndex];
    const parentPosition = column.parentId ? positions.get(column.parentId) : undefined;
    const parentCenter = parentPosition ? parentPosition.y + parentPosition.height / 2 : rootTop + ROOT_HEIGHT / 2;
    const startY = Math.max(CANVAS_PADDING, parentCenter - height / 2);
    let y = startY;

    column.nodes.forEach((node, rowIndex) => {
      const dimension = dimensions[rowIndex];

      positions.set(node.id, {
        x: x + (nodeWidth - dimension.width) / 2,
        y,
        width: dimension.width,
        height: dimension.height,
        column: columnIndex,
      });

      y += dimension.height + (rowGaps[rowIndex] ?? 0);
    });
  });

  const connectors = columns.flatMap((column) => {
    if (!column.parentId) return [];
    const source = getKnowledgeNode(column.parentId);
    const sourcePosition = source ? positions.get(source.id) : undefined;
    if (!source || !sourcePosition) return [];

    const middleIndex = (column.nodes.length - 1) / 2;
    const fanStep = Math.max(4, Math.min(12, 38 / Math.max(column.nodes.length, 1)));

    return column.nodes.flatMap((target, targetIndex) => {
      const targetPosition = positions.get(target.id);
      if (!targetPosition) return [];

      const startX = sourcePosition.x + sourcePosition.width;
      const active = breadcrumbIds.has(source.id) && breadcrumbIds.has(target.id);
      const focused = active || source.id === selectedId || target.id === selectedId;
      const fanOffset = active ? 0 : (targetIndex - middleIndex) * fanStep;
      const startY = sourcePosition.y + sourcePosition.height / 2 + fanOffset;
      const endX = targetPosition.x;
      const endY = targetPosition.y + targetPosition.height / 2;
      const distance = Math.max(1, endX - startX);
      const curve = Math.min(172, Math.max(104, distance * (focused ? 0.5 : 0.42)));
      const settleY = active ? endY : startY + (endY - startY) * 0.78;

      return {
        id: `${source.id}-${target.id}`,
        source,
        target,
        path: `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${settleY}, ${endX} ${endY}`,
        active,
        focused,
      };
    });
  }).sort((a, b) => Number(a.active) - Number(b.active) || Number(a.focused) - Number(b.focused));

  const layoutBottom = Math.max(...Array.from(positions.values()).map((position) => position.y + position.height), ROOT_HEIGHT);
  const layoutRight = Math.max(...Array.from(positions.values()).map((position) => position.x + position.width), ROOT_WIDTH);

  return {
    columns,
    positions,
    connectors,
    width: layoutRight + CANVAS_PADDING + 96,
    height: Math.max(layoutBottom + CANVAS_PADDING, 680),
  };
}

function getAdaptiveColumnGap(columnIndex: number, siblingCount: number) {
  const depthBreathingRoom = Math.min(columnIndex, 4) * 12;
  const busyBranchRoom = Math.min(42, Math.max(0, siblingCount - 3) * 7);
  return BASE_COLUMN_GAP + depthBreathingRoom + busyBranchRoom;
}

function getAdaptiveRowGap({
  node,
  nextNode,
  siblingCount,
  columnIndex,
  selectedColumnIndex,
  selectedId,
  breadcrumbIds,
  expandedIds,
  visibleSubtreeSizes,
}: {
  node: KnowledgeNode;
  nextNode?: KnowledgeNode;
  siblingCount: number;
  columnIndex: number;
  selectedColumnIndex: number;
  selectedId: string;
  breadcrumbIds: Set<string>;
  expandedIds: Set<string>;
  visibleSubtreeSizes: Map<string, number>;
}) {
  if (siblingCount <= 1 || !nextNode) {
    return 0;
  }

  const nodeSubtreeSize = getVisibleSubtreeSize(node.id, expandedIds, visibleSubtreeSizes);
  const nextSubtreeSize = getVisibleSubtreeSize(nextNode.id, expandedIds, visibleSubtreeSizes);
  const hasLoadedSubtree = Math.max(nodeSubtreeSize, nextSubtreeSize);
  const touchesLineage = breadcrumbIds.has(node.id) || breadcrumbIds.has(nextNode.id);
  const touchesFocus = node.id === selectedId || nextNode.id === selectedId;
  const isDistantInactive = columnIndex < selectedColumnIndex - 1 && !touchesLineage && !touchesFocus;
  const compactLongList = Math.max(0, siblingCount - 5) * 2.4;
  const sparseBranchRoom = Math.max(0, 5 - siblingCount) * 3;
  const deepBranchRoom = Math.min(columnIndex, 4) * 2.5;
  const subtreeRoom = Math.min(20, hasLoadedSubtree * 2.6);
  const focusRoom = touchesFocus ? 12 : touchesLineage ? 8 : 0;
  const distantCompression = isDistantInactive ? 10 : 0;

  return clamp(BASE_ROW_GAP + sparseBranchRoom + deepBranchRoom + subtreeRoom + focusRoom - compactLongList - distantCompression, 20, 62);
}

function getSmartPanTarget(
  layout: MindLayout,
  selectedId: string,
  viewportSize: ViewportSize,
  zoom: number,
  currentPan: Point,
  force = false,
): Point {
  const selectedPosition = layout.positions.get(selectedId);
  if (!selectedPosition) {
    return currentPan;
  }

  const selectedNode = getKnowledgeNode(selectedId);
  const contextPositions = [
    selectedPosition,
    selectedNode?.parentId ? layout.positions.get(selectedNode.parentId) : undefined,
    ...getChildren(selectedId).map((child) => layout.positions.get(child.id)),
  ].filter(Boolean) as NodePosition[];
  const contextBounds = getPositionBounds(contextPositions);
  const selectedCenter = getPositionCenter(selectedPosition);
  const hasVisibleChildren = getChildren(selectedId).some((child) => layout.positions.has(child.id));
  const deepFocus = selectedPosition.column >= 3;

  if (!force && isFocusGroupComfortable(contextBounds, selectedPosition, viewportSize, zoom, currentPan, hasVisibleChildren)) {
    return currentPan;
  }

  let target: Point = {
    x: viewportSize.width * (hasVisibleChildren ? (deepFocus ? 0.3 : 0.32) : 0.42) - selectedCenter.x * zoom,
    y: viewportSize.height * 0.5 - selectedCenter.y * zoom,
  };

  target = nudgePanToRevealBounds(target, contextBounds, viewportSize, zoom);
  target = nudgePanToRevealBounds(target, getPositionBounds([selectedPosition]), viewportSize, zoom, VIEWPORT_MARGIN + 20);

  return {
    x: Math.round(target.x),
    y: Math.round(target.y),
  };
}

function isFocusGroupComfortable(
  bounds: Bounds,
  selectedPosition: NodePosition,
  viewportSize: ViewportSize,
  zoom: number,
  pan: Point,
  hasVisibleChildren: boolean,
) {
  const selectedCenter = toScreenPoint(getPositionCenter(selectedPosition), zoom, pan);
  const desiredLeft = hasVisibleChildren ? viewportSize.width * 0.18 : viewportSize.width * 0.26;
  const desiredRight = hasVisibleChildren ? viewportSize.width * 0.48 : viewportSize.width * 0.58;
  const selectedInFocusBand =
    selectedCenter.x >= desiredLeft &&
    selectedCenter.x <= desiredRight &&
    selectedCenter.y >= viewportSize.height * 0.28 &&
    selectedCenter.y <= viewportSize.height * 0.72;

  return selectedInFocusBand && isBoundsMostlyVisible(bounds, viewportSize, zoom, pan);
}

function nudgePanToRevealBounds(pan: Point, bounds: Bounds, viewportSize: ViewportSize, zoom: number, margin = VIEWPORT_MARGIN): Point {
  const screenBounds = toScreenBounds(bounds, zoom, pan);
  const availableWidth = viewportSize.width - margin * 2;
  const availableHeight = viewportSize.height - margin * 2;
  let nextX = pan.x;
  let nextY = pan.y;

  if (screenBounds.width <= availableWidth) {
    if (screenBounds.left < margin) nextX += margin - screenBounds.left;
    if (screenBounds.right > viewportSize.width - margin) nextX -= screenBounds.right - (viewportSize.width - margin);
  }

  if (screenBounds.height <= availableHeight) {
    if (screenBounds.top < margin) nextY += margin - screenBounds.top;
    if (screenBounds.bottom > viewportSize.height - margin) nextY -= screenBounds.bottom - (viewportSize.height - margin);
  }

  return { x: nextX, y: nextY };
}

type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function getPositionBounds(positions: NodePosition[]): Bounds {
  return positions.reduce(
    (bounds, position) => ({
      left: Math.min(bounds.left, position.x),
      top: Math.min(bounds.top, position.y),
      right: Math.max(bounds.right, position.x + position.width),
      bottom: Math.max(bounds.bottom, position.y + position.height),
    }),
    { left: Number.POSITIVE_INFINITY, top: Number.POSITIVE_INFINITY, right: 0, bottom: 0 },
  );
}

function getPositionCenter(position: NodePosition) {
  return {
    x: position.x + position.width / 2,
    y: position.y + position.height / 2,
  };
}

function toScreenPoint(point: Point, zoom: number, pan: Point) {
  return {
    x: point.x * zoom + pan.x,
    y: point.y * zoom + pan.y,
  };
}

function toScreenBounds(bounds: Bounds, zoom: number, pan: Point) {
  const left = bounds.left * zoom + pan.x;
  const top = bounds.top * zoom + pan.y;
  const right = bounds.right * zoom + pan.x;
  const bottom = bounds.bottom * zoom + pan.y;

  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

function isBoundsMostlyVisible(bounds: Bounds, viewportSize: ViewportSize, zoom: number, pan: Point) {
  const screenBounds = toScreenBounds(bounds, zoom, pan);
  const relaxedMargin = VIEWPORT_MARGIN * 0.72;

  return (
    screenBounds.right >= relaxedMargin &&
    screenBounds.left <= viewportSize.width - relaxedMargin &&
    screenBounds.bottom >= relaxedMargin &&
    screenBounds.top <= viewportSize.height - relaxedMargin
  );
}

function getVisibleSubtreeSize(nodeId: string, expandedIds: Set<string>, cache: Map<string, number>): number {
  const cached = cache.get(nodeId);
  if (cached !== undefined) {
    return cached;
  }

  if (!expandedIds.has(nodeId)) {
    cache.set(nodeId, 0);
    return 0;
  }

  const children = getChildren(nodeId);
  const count = children.reduce((total, child) => total + 1 + getVisibleSubtreeSize(child.id, expandedIds, cache), 0);
  cache.set(nodeId, count);
  return count;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

function labelForDifficulty(difficulty: NonNullable<KnowledgeNode["difficulty"]>) {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

function labelForRelationship(relationshipType: KnowledgeEdge["relationshipType"]) {
  return relationshipType.replaceAll("_", " ").toLowerCase();
}
