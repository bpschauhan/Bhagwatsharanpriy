"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { GraphLayoutEdge } from "@/lib/graph/layout";

type GraphEdgeProps = {
  edge: GraphLayoutEdge;
  active: boolean;
  dimmed: boolean;
  proximity?: number;
  simplified?: boolean;
};

export function GraphEdge({ edge, active, dimmed, proximity = 0, simplified = false }: GraphEdgeProps) {
  const reduceMotion = useReducedMotion();
  const source = edge.sourceNode;
  const target = edge.targetNode;
  const midX = (source.layoutX + target.layoutX) / 2;
  const midY = (source.layoutY + target.layoutY) / 2;
  const dx = target.layoutX - source.layoutX;
  const dy = target.layoutY - source.layoutY;
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const controlX = midX + (-dy / length) * edge.curve;
  const controlY = midY + (dx / length) * edge.curve;
  const path = `M ${source.layoutX} ${source.layoutY} Q ${controlX} ${controlY} ${target.layoutX} ${target.layoutY}`;

  return (
    <motion.path
      d={path}
      stroke="currentColor"
      strokeWidth={active ? 0.44 : simplified ? 0.16 : 0.22 + proximity * 0.06}
      strokeLinecap="round"
      fill="none"
      vectorEffect="non-scaling-stroke"
      className={active ? "text-primary/85" : proximity > 0 ? "text-primary/45" : "text-border"}
      initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: dimmed ? 0.22 : active ? 0.96 : simplified ? 0.28 : 0.34 + proximity * 0.24 }}
      transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
      aria-label={edge.label}
    />
  );
}
