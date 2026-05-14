"use client";

import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
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

type KnowledgeLayer = {
  parent: KnowledgeNode;
  children: KnowledgeNode[];
};

type ExplorerStyle = CSSProperties & {
  "--detail-width": string;
};

const ROOT_ID = "wisdom-root";

export function HierarchyNavigator({ initialNodeId = ROOT_ID, compact = false }: HierarchyNavigatorProps) {
  const [selectedId, setSelectedId] = useState(initialNodeId);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set([ROOT_ID, initialNodeId]));
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState(380);

  const selectedNode = getKnowledgeNode(selectedId) ?? getKnowledgeNode(ROOT_ID) ?? knowledgeNodes[0];
  const breadcrumb = useMemo(() => getLineage(selectedNode.id), [selectedNode.id]);
  const layers = useMemo(() => buildVisibleLayers(breadcrumb, expandedIds), [breadcrumb, expandedIds]);
  const contextualEdges = useMemo(() => getContextualEdges(selectedNode.id), [selectedNode.id]);

  function selectNode(nodeId: string) {
    setSelectedId(nodeId);
    setExpandedIds((current) => new Set([...current, nodeId]));
  }

  function collapseNode(nodeId: string) {
    setExpandedIds((current) => {
      const updated = new Set(current);
      updated.delete(nodeId);
      return updated;
    });
  }

  function reset() {
    setSelectedId(ROOT_ID);
    setExpandedIds(new Set([ROOT_ID]));
  }

  const parent = selectedNode.parentId ? getKnowledgeNode(selectedNode.parentId) : undefined;

  return (
    <div
      className={cn(
        "grid gap-5",
        panelCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_var(--detail-width)]",
        isFocusMode && "fixed inset-3 z-50 overflow-auto bg-background p-3 shadow-2xl sm:inset-5 sm:p-5",
      )}
      style={{ "--detail-width": `${panelWidth}px` } as ExplorerStyle}
    >
      <section className="surface-calm overflow-hidden rounded-lg">
        <div className="flex flex-col gap-4 border-b border-border bg-background/45 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {breadcrumb.map((node, index) => (
                <span key={node.id} className="inline-flex items-center gap-1.5">
                  <button type="button" className="rounded-sm hover:text-foreground" onClick={() => selectNode(node.id)}>
                    {node.title}
                  </button>
                  {index < breadcrumb.length - 1 ? <ChevronRight className="size-3" aria-hidden="true" /> : null}
                </span>
              ))}
            </div>
            <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              {selectedNode.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {parent ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => selectNode(parent.id)}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </Button>
            ) : null}
            <Button type="button" variant="ghost" size="icon" aria-label="Reset archive" onClick={reset}>
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
              aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
              onClick={() => setIsFocusMode((value) => !value)}
            >
              {isFocusMode ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        <div className="bg-wisdom-layered p-4 sm:p-6">
          <ArchiveRoot node={breadcrumb[0] ?? selectedNode} active={selectedNode.id === ROOT_ID} onSelect={selectNode} />

          <div className={cn("mt-5 space-y-4", compact && "space-y-3")}>
            <AnimatePresence initial={false}>
              {layers.map((layer, index) => (
                <motion.div
                  key={layer.parent.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="rounded-lg border border-border/80 bg-background/58 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Layer {index + 1}
                      </p>
                      <h3 className="mt-1 font-serif text-xl font-semibold">{layer.parent.title}</h3>
                    </div>
                    {layer.parent.id !== ROOT_ID && expandedIds.has(layer.parent.id) ? (
                      <Button type="button" variant="ghost" size="sm" onClick={() => collapseNode(layer.parent.id)}>
                        Collapse
                      </Button>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {layer.children.map((child) => (
                      <KnowledgeBlock
                        key={child.id}
                        node={child}
                        active={child.id === selectedNode.id}
                        childCount={getChildren(child.id).length}
                        onSelect={() => selectNode(child.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {!panelCollapsed ? (
        <ArchiveDetailPanel
          node={selectedNode}
          breadcrumb={breadcrumb}
          edges={contextualEdges}
          panelWidth={panelWidth}
          onPanelWidthChange={setPanelWidth}
          onSelectNode={selectNode}
        />
      ) : null}
    </div>
  );
}

function ArchiveRoot({ node, active, onSelect }: { node: KnowledgeNode; active: boolean; onSelect: (nodeId: string) => void }) {
  return (
    <button
      type="button"
      className={cn(
        "focus-ring-calm block w-full rounded-lg border p-5 text-left transition-all duration-300",
        active ? "border-primary bg-primary/12 shadow-glow" : "border-border bg-card/86 hover:border-primary/45",
      )}
      onClick={() => onSelect(node.id)}
    >
      <span className="flex flex-wrap items-center justify-between gap-3">
        <span>
          <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">Foundation</span>
          <span className="mt-2 block font-serif text-3xl font-semibold leading-tight">{node.title}</span>
        </span>
        <Badge variant="outline">{getChildren(node.id).length} worlds</Badge>
      </span>
      <span className="mt-3 block max-w-3xl text-sm leading-6 text-foreground/72">{node.summary}</span>
    </button>
  );
}

function KnowledgeBlock({
  node,
  active,
  childCount,
  onSelect,
}: {
  node: KnowledgeNode;
  active: boolean;
  childCount: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "focus-ring-calm group min-h-40 rounded-lg border p-4 text-left transition-all duration-300 ease-premium",
        active ? "border-primary bg-primary/12 shadow-glow" : "border-border bg-card/88 hover:border-primary/45 hover:bg-card",
      )}
      onClick={onSelect}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <Badge variant={active ? "default" : "outline"}>{labelForType(node.nodeType)}</Badge>
          <span className="mt-3 block font-serif text-xl font-semibold leading-snug text-foreground">{node.title}</span>
        </span>
        <span className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors group-hover:text-primary">
          <ChevronRight className="size-4" aria-hidden="true" />
        </span>
      </span>
      <span className="mt-3 line-clamp-3 block text-sm leading-6 text-foreground/72">{node.summary}</span>
      <span className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <BookOpen className="size-3.5 text-primary" aria-hidden="true" />
        {childCount > 0 ? `${childCount} subdivisions` : "leaf archive"}
      </span>
    </button>
  );
}

function ArchiveDetailPanel({
  node,
  breadcrumb,
  edges,
  panelWidth,
  onPanelWidthChange,
  onSelectNode,
}: {
  node: KnowledgeNode;
  breadcrumb: KnowledgeNode[];
  edges: KnowledgeEdge[];
  panelWidth: number;
  onPanelWidthChange: (value: number) => void;
  onSelectNode: (nodeId: string) => void;
}) {
  const children = getChildren(node.id);

  return (
    <aside className="surface-calm overflow-hidden rounded-lg lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="border-b border-border p-4">
        <label className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Panel width
          <span>{panelWidth}px</span>
        </label>
        <input
          type="range"
          min={320}
          max={520}
          step={20}
          value={panelWidth}
          onChange={(event) => onPanelWidthChange(Number(event.target.value))}
          className="mt-3 w-full accent-primary"
        />
      </div>

      <motion.div key={node.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-5 lg:p-6">
        <div className="flex flex-wrap gap-2">
          <Badge>{labelForType(node.nodeType)}</Badge>
          {node.tags?.slice(0, 3).map((tag) => (
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

        {breadcrumb.length > 1 ? (
          <div className="mt-7 border-t border-border pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Lineage</h3>
            <div className="mt-3 space-y-2">
              {breadcrumb.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
                    item.id === node.id ? "border-primary bg-primary/10" : "border-border bg-background/60 hover:bg-muted",
                  )}
                  onClick={() => onSelectNode(item.id)}
                >
                  <span className="text-xs text-muted-foreground">Level {index}</span>
                  <span className="block font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {children.length > 0 ? (
          <div className="mt-7 border-t border-border pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Next Layer</h3>
            <div className="mt-3 space-y-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className="block w-full rounded-md border border-border bg-background/60 px-3 py-2 text-left transition-colors hover:bg-muted"
                  onClick={() => onSelectNode(child.id)}
                >
                  <span className="block text-sm font-medium">{child.title}</span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-5 text-foreground/64">{child.summary}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {edges.length > 0 ? (
          <div className="mt-7 border-t border-border pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Contextual Relationships</h3>
            <div className="mt-3 space-y-3">
              {edges.slice(0, 4).map((edge) => {
                const otherId = edge.source === node.id ? edge.target : edge.source;
                const other = getKnowledgeNode(otherId);
                if (!other) return null;

                return (
                  <button
                    key={edge.id}
                    type="button"
                    className="block w-full rounded-md border border-border bg-background/60 p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted"
                    onClick={() => onSelectNode(other.id)}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-medium">{other.title}</span>
                      <Badge variant="muted">{edge.relationshipType.replaceAll("_", " ").toLowerCase()}</Badge>
                    </span>
                    <span className="mt-2 line-clamp-3 block text-xs leading-5 text-foreground/68">{edge.explanation ?? edge.summary}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </motion.div>
    </aside>
  );
}

function buildVisibleLayers(breadcrumb: KnowledgeNode[], expandedIds: Set<string>): KnowledgeLayer[] {
  const activeLineage = breadcrumb.length > 0 ? breadcrumb : [knowledgeNodes[0]];

  return activeLineage
    .filter((node) => expandedIds.has(node.id))
    .map((node) => ({ parent: node, children: getChildren(node.id) }))
    .filter((layer) => layer.children.length > 0);
}

function getChildren(nodeId: string): KnowledgeNode[] {
  return knowledgeNodes.filter((node) => node.parentId === nodeId);
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
