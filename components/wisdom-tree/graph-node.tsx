"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { GraphLayoutNode } from "@/lib/graph/layout";
import { NodeTooltip } from "./node-tooltip";

type GraphNodeProps = {
  node: GraphLayoutNode;
  active: boolean;
  dimmed: boolean;
  focused: boolean;
  proximity: number;
  showLabel: boolean;
  childCount: number;
  onSelect: (nodeId: string) => void;
  onHover: (nodeId: string | null) => void;
};

const nodeTypeStyles: Record<GraphLayoutNode["nodeType"], string> = {
  TRADITION: "border-primary/45 bg-primary/15",
  SCRIPTURE: "border-secondary/30 bg-secondary/10",
  BOOK: "border-primary/45 bg-background",
  CHAPTER: "border-border bg-card",
  CONCEPT: "border-primary/35 bg-card",
  PHILOSOPHY_SCHOOL: "border-border bg-muted/65",
  PRACTICE: "border-primary/30 bg-background",
  COMMENTARY: "border-border bg-card",
};

export function GraphNode({ node, active, dimmed, focused, proximity, showLabel, childCount, onSelect, onHover }: GraphNodeProps) {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const isCompactLabel = !showLabel && !active;
  const sizeClass = node.id === "wisdom-root" ? "min-w-28 px-5 py-4" : isCompactLabel ? "size-10 p-0" : "min-w-24 max-w-36 px-4 py-3";

  return (
    <motion.div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.layoutX}%`, top: `${node.layoutY}%` }}
      layout
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: dimmed ? 0.18 : 0.72 + proximity * 0.28, scale: active ? 1.1 : focused ? 1.03 + proximity * 0.02 : 1 }}
      transition={{ type: "spring", stiffness: 155, damping: 25, mass: 0.82 }}
      onHoverStart={() => {
        setHovered(true);
        onHover(node.id);
      }}
      onHoverEnd={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <button
        type="button"
        className={cn(
          "focus-ring-calm relative rounded-lg border text-center shadow-soft outline-none transition-all duration-500 ease-premium",
          "hover:border-primary/60 hover:bg-background hover:shadow-glow",
          nodeTypeStyles[node.nodeType],
          active && "border-primary bg-primary/20",
          focused && "border-primary/70 bg-background",
          sizeClass,
        )}
        onClick={() => onSelect(node.id)}
        aria-pressed={active}
        aria-label={`Explore ${node.title}`}
      >
        {isCompactLabel ? (
          <span className="block size-2 rounded-full bg-primary/70" aria-hidden="true" />
        ) : (
          <>
            <span className="line-clamp-2 block font-serif text-[12px] font-semibold leading-tight sm:text-[clamp(0.78rem,0.72rem+0.18vw,0.94rem)]">
              {node.title}
            </span>
            {node.subtitle ? <span className="mt-1 line-clamp-1 block text-xs text-muted-foreground">{node.subtitle}</span> : null}
          </>
        )}
        {childCount > 0 && !isCompactLabel ? (
          <span className="mt-2 inline-flex rounded-full bg-background/70 px-2 py-0.5 text-[10px] text-muted-foreground">
            {childCount} hidden
          </span>
        ) : null}
        {active ? (
          <>
            <span className="absolute -inset-4 -z-10 rounded-2xl bg-primary/20 blur-xl" />
            <span className="absolute -inset-8 -z-20 rounded-full bg-primary/10 blur-2xl" />
          </>
        ) : null}
      </button>
      <AnimatePresence>{hovered ? <NodeTooltip node={node} /> : null}</AnimatePresence>
    </motion.div>
  );
}
