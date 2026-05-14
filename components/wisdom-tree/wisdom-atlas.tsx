/**
 * COMPREHENSIVE WISDOM ATLAS
 * 
 * Advanced multi-mode interactive visualization of the complete Sanatana Dharma knowledge graph.
 * Supports 7 different exploration modes that reveal different aspects of the knowledge structure:
 * 
 * 1. SCRIPTURE_LINEAGE: Shows derivation chains (Vedas → Upanishads → Vedanta)
 * 2. CONCEPT_DEPENDENCY: Shows how concepts depend on textual sources
 * 3. TRADITION_MAP: Shows traditions as hubs with component schools
 * 4. LEARNING_JOURNEY: Guided paths from novice to advanced understanding
 * 5. HISTORICAL_EVOLUTION: Timeline-based intellectual development
 * 6. BEGINNER_GUIDED: Step-by-step introduction to Sanatana Dharma
 * 7. COMPARATIVE_PHILOSOPHY: Side-by-side school comparison
 */

"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import type { KnowledgeNode, KnowledgeEdge } from "@/types/knowledge";
import {
  buildSemanticZoneLayout,
  buildHierarchyFocusedLayout,
  buildConceptDependencyLayout,
  buildTraditionLayout,
  type LayoutNode,
  type SemanticZone,
} from "@/lib/graph/semantic-zone-layout";

export type AtlasMode =
  | "scripture-lineage"
  | "concept-dependency"
  | "tradition-map"
  | "learning-journey"
  | "historical-evolution"
  | "beginner-guided"
  | "comparative-philosophy";

interface WisdomAtlasProps {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  initialMode?: AtlasMode;
  onNodeSelect?: (node: LayoutNode) => void;
  className?: string;
}

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1000;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

export const WisdomAtlas: React.FC<WisdomAtlasProps> = ({
  nodes,
  edges,
  initialMode = "scripture-lineage",
  onNodeSelect,
  className = "",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<AtlasMode>(initialMode);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  // Get layout based on mode
  const layoutNodes = useMemo(() => {
    const zones: Record<string, SemanticZone> = {
      SHRUTI: { label: "Shruti", color: "#B8860B", order: 0, x: 100, y: 100, width: 250, height: 200 },
      SMRITI: { label: "Smriti", color: "#DAA520", order: 1, x: 400, y: 100, width: 250, height: 200 },
      PURANAS: { label: "Puranas", color: "#CD853F", order: 2, x: 700, y: 100, width: 250, height: 200 },
      DARSHANAS: { label: "Darshanas", color: "#7C3AED", order: 3, x: 1000, y: 100, width: 250, height: 200 },
      BHAKTI: { label: "Bhakti", color: "#DC2626", order: 4, x: 400, y: 500, width: 250, height: 200 },
      TANTRA: { label: "Tantra", color: "#EC4899", order: 5, x: 700, y: 500, width: 250, height: 200 },
      YOGA_SYSTEMS: { label: "Yoga Systems", color: "#0891B2", order: 6, x: 100, y: 500, width: 250, height: 200 },
      PRACTICES: { label: "Practices", color: "#CA8A04", order: 7, x: 1000, y: 500, width: 250, height: 200 },
    };

    switch (mode) {
      case "scripture-lineage":
      case "learning-journey":
      case "historical-evolution":
        return buildHierarchyFocusedLayout(nodes, edges, zones);
      case "concept-dependency":
        return buildConceptDependencyLayout(nodes, edges, zones);
      case "tradition-map":
        return buildTraditionLayout(nodes, edges, zones);
      case "beginner-guided":
        return buildHierarchyFocusedLayout(nodes, edges, zones);
      case "comparative-philosophy":
        return buildConceptDependencyLayout(nodes, edges, zones);
      default:
        return buildSemanticZoneLayout(nodes, edges, zones);
    }
  }, [mode, nodes, edges]);

  // Get edges to render based on mode
  const visibleEdges = useMemo(() => {
    if (mode === "scripture-lineage") {
      return edges.filter((e) => ["BELONGS_TO", "DERIVED_FROM", "EXPLAINED_BY"].includes(e.relationshipType));
    } else if (mode === "concept-dependency") {
      return edges.filter((e) => ["EXPLAINS", "DERIVED_FROM", "RELATED_TO"].includes(e.relationshipType));
    } else if (mode === "tradition-map") {
      return edges.filter((e) => ["BELONGS_TO", "PHILOSOPHICALLY_SIMILAR"].includes(e.relationshipType));
    } else if (mode === "comparative-philosophy") {
      return edges.filter((e) =>
        ["PHILOSOPHICALLY_SIMILAR", "PHILOSOPHICALLY_OPPOSED"].includes(e.relationshipType)
      );
    }
    return edges;
  }, [edges, mode]);

  // Handle pan and zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2 || e.ctrlKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom * delta));

    setZoom(newZoom);
  };

  const modeDescriptions: Record<AtlasMode, { title: string; description: string }> = {
    "scripture-lineage": {
      title: "Scripture Lineage",
      description: "Explore the derivation chain: How Upanishads evolved from Vedas, how Vedanta schools interpreted them",
    },
    "concept-dependency": {
      title: "Concept Dependency",
      description: "Understand which philosophical concepts depend on which textual sources",
    },
    "tradition-map": {
      title: "Tradition Map",
      description: "Visualize major traditions (Shaivism, Vaishnavism, Shaktism, etc.) and their schools",
    },
    "learning-journey": {
      title: "Learning Journey",
      description: "Guided paths: Beginner → Intermediate → Advanced understanding of Sanatana Dharma",
    },
    "historical-evolution": {
      title: "Historical Evolution",
      description: "Timeline of intellectual development: How ideas and traditions evolved over centuries",
    },
    "beginner-guided": {
      title: "Beginner's Guide",
      description: "Step-by-step introduction to the foundations of Sanatana Dharma",
    },
    "comparative-philosophy": {
      title: "Philosophy Comparison",
      description: "Compare and contrast philosophical schools: similarities and key disagreements",
    },
  };

  return (
    <div className={`w-full bg-gradient-to-b from-amber-50 to-white border-2 border-amber-200 rounded-lg overflow-hidden ${className}`}>
      {/* Controls Header */}
      <div className="bg-white border-b border-amber-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-amber-900">
              {modeDescriptions[mode].title}
            </h2>
            <p className="text-sm text-amber-700 mt-1">{modeDescriptions[mode].description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="px-3 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 rounded transition"
            >
              {showLabels ? "Hide" : "Show"} Labels
            </button>
            <button
              onClick={() => {
                setPanX(0);
                setPanY(0);
                setZoom(1);
              }}
              className="px-3 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 rounded transition"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 flex-wrap">
          {(
            [
              "scripture-lineage",
              "concept-dependency",
              "tradition-map",
              "learning-journey",
              "historical-evolution",
              "beginner-guided",
              "comparative-philosophy",
            ] as AtlasMode[]
          ).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-xs font-medium rounded transition ${
                mode === m
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              {modeDescriptions[m].title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-amber-50 via-white to-amber-25">
        <svg
          ref={svgRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3e5d8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#grid)" />

          {/* Render Edges */}
          {visibleEdges.map((edge, idx) => {
            const sourceNode = layoutNodes.find((n) => n.id === edge.source);
            const targetNode = layoutNodes.find((n) => n.id === edge.target);

            if (!sourceNode || !targetNode) return null;

            const isHighlighted =
              selectedNodeId === edge.source ||
              selectedNodeId === edge.target ||
              hoveredNodeId === edge.source ||
              hoveredNodeId === edge.target;

            return (
              <g key={`edge-${idx}`} opacity={isHighlighted ? 1 : 0.3}>
                <line
                  x1={sourceNode.globalX}
                  y1={sourceNode.globalY}
                  x2={targetNode.globalX}
                  y2={targetNode.globalY}
                  stroke={getEdgeColor(edge.relationshipType)}
                  strokeWidth={isHighlighted ? 3 : 2}
                  className="transition-all"
                  markerEnd="url(#arrowhead)"
                />
                {showLabels && (
                  <text
                    x={(sourceNode.globalX + targetNode.globalX) / 2}
                    y={(sourceNode.globalY + targetNode.globalY) / 2 - 5}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#a0704d"
                    className="pointer-events-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#a0704d" />
            </marker>
          </defs>

          {/* Render Nodes */}
          {layoutNodes.map((node) => (
            <g
              key={node.id}
              onClick={() => {
                setSelectedNodeId(node.id);
                onNodeSelect?.(node);
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              className="cursor-pointer"
            >
              {/* Node Circle */}
              <motion.circle
                cx={node.globalX}
                cy={node.globalY}
                r={node.visualRadius}
                fill={getNodeColor(node.nodeType)}
                stroke={
                  selectedNodeId === node.id
                    ? "#d97706"
                    : hoveredNodeId === node.id
                      ? "#ca8a04"
                      : "#a0704d"
                }
                strokeWidth={selectedNodeId === node.id ? 4 : hoveredNodeId === node.id ? 3 : 2}
                opacity={selectedNodeId === null || selectedNodeId === node.id ? 1 : 0.6}
                className="transition-all"
                animate={{
                  r: hoveredNodeId === node.id ? node.visualRadius + 5 : node.visualRadius,
                }}
              />

              {/* Node Label */}
              {showLabels && (
                <text
                  x={node.globalX}
                  y={node.globalY + node.visualRadius + 15}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#654321"
                  className="pointer-events-none font-serif"
                  style={{ maxWidth: node.visualRadius * 2 }}
                >
                  {node.title.length > 20 ? node.title.substring(0, 17) + "..." : node.title}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Info Panel */}
        {selectedNodeId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 bg-white border-2 border-amber-200 rounded-lg p-4 max-w-md max-h-80 overflow-y-auto shadow-lg"
          >
            {(() => {
              const node = layoutNodes.find((n) => n.id === selectedNodeId);
              if (!node) return null;

              return (
                <div className="font-serif text-amber-900">
                  <h3 className="text-lg font-bold mb-2">{node.title}</h3>
                  <p className="text-sm mb-2">{node.summary}</p>
                  <div className="text-xs space-y-1">
                    <p>
                      <strong>Type:</strong> {node.nodeType}
                    </p>
                    <p>
                      <strong>Zone:</strong> {node.cluster}
                    </p>
                    {node.tags && (
                      <p>
                        <strong>Tags:</strong> {node.tags.join(", ")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedNodeId(null)}
                    className="mt-3 text-xs px-3 py-1 bg-amber-100 hover:bg-amber-200 rounded transition"
                  >
                    Close
                  </button>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* Zoom Info */}
        <div className="absolute top-4 right-4 text-xs text-amber-700 bg-white px-2 py-1 rounded border border-amber-200">
          Zoom: {(zoom * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

function getNodeColor(nodeType: string): string {
  const colors: Record<string, string> = {
    SCRIPTURE: "#fbbf24",
    BOOK: "#f59e0b",
    CHAPTER: "#d97706",
    CONCEPT: "#c084fc",
    PHILOSOPHY_SCHOOL: "#60a5fa",
    PRACTICE: "#34d399",
    TRADITION: "#f472b6",
    COMMENTARY: "#fbbf24",
    ROOT: "#b45309",
  };
  return colors[nodeType] || "#cbd5e1";
}

function getEdgeColor(relationshipType: string): string {
  const colors: Record<string, string> = {
    BELONGS_TO: "#a0704d",
    INFLUENCED: "#9333ea",
    RELATED_TO: "#06b6d4",
    EXPLAINS: "#ec4899",
    COMMENTARY_ON: "#f59e0b",
    DERIVED_FROM: "#8b5cf6",
    EXPANDS_UPON: "#06b6d4",
    REFERENCES: "#6b7280",
    PHILOSOPHICALLY_SIMILAR: "#10b981",
    PHILOSOPHICALLY_OPPOSED: "#ef4444",
    PRACTICAL_PARALLEL: "#14b8a6",
    CONTEXTUALIZES: "#f97316",
  };
  return colors[relationshipType] || "#9ca3af";
}
