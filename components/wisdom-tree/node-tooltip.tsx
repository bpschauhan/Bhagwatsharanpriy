"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { KnowledgeNode } from "@/types/knowledge";

type NodeTooltipProps = {
  node: KnowledgeNode;
};

export function NodeTooltip({ node }: NodeTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none absolute left-1/2 top-full z-30 mt-3 hidden w-64 -translate-x-1/2 rounded-lg border border-border bg-background/95 p-4 text-left shadow-soft backdrop-blur md:block"
    >
      <Badge variant="outline">{node.nodeType.replaceAll("_", " ").toLowerCase()}</Badge>
      <p className="mt-3 font-serif text-lg font-semibold">{node.title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{node.summary}</p>
    </motion.div>
  );
}
