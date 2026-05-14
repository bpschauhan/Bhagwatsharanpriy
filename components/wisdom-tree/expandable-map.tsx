"use client";

import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
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

type ExpandableMapProps = {
  initialNodeId?: string;
  compact?: boolean;
};

type RoadmapStage = {
  id: string;
  label: string;
  summary: string;
  nodeIds: string[];
};

type RoadmapStyle = CSSProperties & {
  "--roadmap-detail-width": string;
};

const stages: RoadmapStage[] = [
  {
    id: "foundation",
    label: "Foundation",
    summary: "Sanatana Dharma as the root archive from which the learning worlds unfold.",
    nodeIds: ["wisdom-root"],
  },
  {
    id: "scriptures",
    label: "Scriptures",
    summary: "Shruti and Smriti: revealed foundation, remembered tradition, epics, and teaching texts.",
    nodeIds: ["shruti", "smriti", "vedas", "upanishads", "bhagavad-gita"],
  },
  {
    id: "philosophies",
    label: "Philosophies",
    summary: "Darshanas and their schools as disciplined ways of seeing reality, knowledge, and liberation.",
    nodeIds: ["darshanas", "vedanta", "sankhya", "nyaya", "mimamsa"],
  },
  {
    id: "practices",
    label: "Practices",
    summary: "Yogas and embodied disciplines that turn learning into action, attention, and devotion.",
    nodeIds: ["yogas", "yoga", "karma-yoga", "jnana-yoga", "bhakti-yoga", "practices"],
  },
  {
    id: "concepts",
    label: "Concepts",
    summary: "Key ideas that help the learner recognize patterns across scripture, philosophy, and practice.",
    nodeIds: ["concepts", "dharma", "karma", "atma", "jnana", "moksha", "samatva"],
  },
  {
    id: "lineages",
    label: "Lineages",
    summary: "Sampradayas and acharyas as the channels through which learning is interpreted and transmitted.",
    nodeIds: ["sampradayas", "vaishnavism", "shaivism", "shaktism", "acharyas", "adi-shankara", "ramanuja"],
  },
  {
    id: "modern-influence",
    label: "Modern Influence",
    summary: "Contemporary study, translation, comparative learning, and practice communities extending the archive.",
    nodeIds: ["bhagavad-gita", "yoga", "vedanta", "concepts", "practices"],
  },
];

export function ExpandableMap({ initialNodeId = "wisdom-root", compact = false }: ExpandableMapProps) {
  const initialStage = findStageForNode(initialNodeId)?.id ?? "foundation";
  const [activeStageId, setActiveStageId] = useState(initialStage);
  const [selectedNodeId, setSelectedNodeId] = useState(initialNodeId);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState(360);

  const activeStage = stages.find((stage) => stage.id === activeStageId) ?? stages[0];
  const stageNodes = useMemo(() => activeStage.nodeIds.map(getKnowledgeNode).filter(Boolean) as KnowledgeNode[], [activeStage]);
  const selectedNode = getKnowledgeNode(selectedNodeId) ?? stageNodes[0] ?? knowledgeNodes[0];
  const activeIndex = stages.findIndex((stage) => stage.id === activeStage.id);
  const contextualEdges = useMemo(
    () =>
      getRelatedEdges(selectedNode.id)
        .filter((edge) => edge.weight >= 4 || edge.relationshipType !== "BELONGS_TO")
        .slice(0, 5),
    [selectedNode.id],
  );

  function activateStage(stage: RoadmapStage) {
    setActiveStageId(stage.id);
    setSelectedNodeId(stage.nodeIds[0]);
  }

  function reset() {
    setActiveStageId("foundation");
    setSelectedNodeId("wisdom-root");
  }

  return (
    <div
      className={cn(
        "grid gap-5",
        panelCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_var(--roadmap-detail-width)]",
        isFocusMode && "fixed inset-3 z-50 overflow-auto bg-background p-3 shadow-2xl sm:inset-5 sm:p-5",
      )}
      style={{ "--roadmap-detail-width": `${panelWidth}px` } as RoadmapStyle}
    >
      <section className="surface-calm overflow-hidden rounded-lg">
        <div className="flex flex-col gap-4 border-b border-border bg-background/45 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {stages.slice(0, activeIndex + 1).map((stage, index) => (
                <span key={stage.id} className="inline-flex items-center gap-1.5">
                  <button type="button" className="rounded-sm hover:text-foreground" onClick={() => activateStage(stage)}>
                    {stage.label}
                  </button>
                  {index < activeIndex ? <ChevronRight className="size-3" aria-hidden="true" /> : null}
                </span>
              ))}
            </div>
            <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight sm:text-3xl">Civilization Roadmap</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="ghost" size="icon" aria-label="Reset roadmap" onClick={reset}>
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
          <div className="grid gap-3 xl:grid-cols-7">
            {stages.map((stage, index) => (
              <RoadmapStep
                key={stage.id}
                stage={stage}
                index={index}
                active={stage.id === activeStage.id}
                compact={compact}
                onSelect={() => activateStage(stage)}
              />
            ))}
          </div>

          <motion.div
            key={activeStage.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="mt-5 rounded-lg border border-border bg-background/62 p-4"
          >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{activeStage.label}</p>
                <h3 className="mt-1 font-serif text-2xl font-semibold">{activeStage.summary}</h3>
              </div>
              <Badge variant="outline">{stageNodes.length} entries</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {stageNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className={cn(
                    "focus-ring-calm min-h-36 rounded-lg border p-4 text-left transition-colors duration-300",
                    selectedNode.id === node.id ? "border-primary bg-primary/12 shadow-glow" : "border-border bg-card/86 hover:border-primary/45",
                  )}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <Badge variant={selectedNode.id === node.id ? "default" : "outline"}>{node.nodeType.replaceAll("_", " ").toLowerCase()}</Badge>
                  <span className="mt-3 block font-serif text-xl font-semibold leading-snug">{node.title}</span>
                  <span className="mt-2 line-clamp-3 block text-sm leading-6 text-foreground/70">{node.summary}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {!panelCollapsed ? (
        <RoadmapDetail
          stage={activeStage}
          node={selectedNode}
          panelWidth={panelWidth}
          onPanelWidthChange={setPanelWidth}
          edges={contextualEdges}
          onSelectNode={setSelectedNodeId}
        />
      ) : null}
    </div>
  );
}

function RoadmapStep({
  stage,
  index,
  active,
  compact,
  onSelect,
}: {
  stage: RoadmapStage;
  index: number;
  active: boolean;
  compact: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "focus-ring-calm relative rounded-lg border p-4 text-left transition-all duration-300",
        active ? "border-primary bg-primary/12 shadow-glow" : "border-border bg-card/82 hover:border-primary/45",
        compact && "p-3",
      )}
      onClick={onSelect}
    >
      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
      <span className="mt-2 block font-serif text-lg font-semibold leading-tight">{stage.label}</span>
      <span className="mt-2 line-clamp-3 block text-xs leading-5 text-foreground/68">{stage.summary}</span>
      {index < stages.length - 1 ? (
        <span className="mt-3 inline-flex size-7 items-center justify-center rounded-full border border-border bg-background text-primary xl:absolute xl:-right-5 xl:top-1/2 xl:mt-0 xl:-translate-y-1/2 xl:rotate-[-90deg]">
          <ArrowDown className="size-4" aria-hidden="true" />
        </span>
      ) : null}
    </button>
  );
}

function RoadmapDetail({
  stage,
  node,
  panelWidth,
  onPanelWidthChange,
  edges,
  onSelectNode,
}: {
  stage: RoadmapStage;
  node: KnowledgeNode;
  panelWidth: number;
  onPanelWidthChange: (value: number) => void;
  edges: KnowledgeEdge[];
  onSelectNode: (nodeId: string) => void;
}) {
  const children = knowledgeNodes.filter((candidate) => candidate.parentId === node.id);

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
          max={500}
          step={20}
          value={panelWidth}
          onChange={(event) => onPanelWidthChange(Number(event.target.value))}
          className="mt-3 w-full accent-primary"
        />
      </div>
      <div className="p-5 lg:p-6">
        <Badge>{stage.label}</Badge>
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

        {children.length > 0 ? (
          <div className="mt-7 border-t border-border pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Next Layer</h3>
            <div className="mt-3 space-y-2">
              {children.slice(0, 6).map((child) => (
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Nearby Context</h3>
            <div className="mt-3 space-y-3">
              {edges.map((edge) => {
                if (!edge) return null;
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
      </div>
    </aside>
  );
}

function findStageForNode(nodeId: string) {
  return stages.find((stage) => stage.nodeIds.includes(nodeId));
}
