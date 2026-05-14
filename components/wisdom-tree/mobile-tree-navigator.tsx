"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getChildren } from "@/lib/graph/hierarchy-layout";
import { getKnowledgeNode, knowledgeNodes } from "@/lib/content/knowledge-graph";
import type { KnowledgeNode } from "@/types/knowledge";
import Link from "next/link";
import type { Route } from "next";

/**
 * Mobile-optimized tree navigator with progressive disclosure
 */
export function MobileTreeNavigator({ initialNodeId = "wisdom-root" }: { initialNodeId?: string }) {
  const [selectedId, setSelectedId] = useState(initialNodeId);

  const selectedNode = getKnowledgeNode(selectedId) ?? knowledgeNodes[0];
  const breadcrumb = getBreadcrumb(selectedId, knowledgeNodes);
  const children = getChildren(selectedId, knowledgeNodes);
  const siblings = selectedNode.parentId ? getChildren(selectedNode.parentId, knowledgeNodes) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Breadcrumb navigation */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
        <div className="flex items-center gap-1 text-xs text-foreground/60 overflow-x-auto pb-2">
          {breadcrumb.map((node, idx) => (
            <button
              key={node.id}
              onClick={() => setSelectedId(node.id)}
              className="whitespace-nowrap hover:text-foreground transition-colors"
            >
              {node.title}
              {idx < breadcrumb.length - 1 && <span className="mx-1 text-border">/</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 space-y-6">
        {/* Selected node info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <Badge variant="outline" className="text-xs">
              {selectedNode.nodeType.replace(/_/g, " ").toLowerCase()}
            </Badge>

            <h1 className="font-serif text-2xl font-semibold text-foreground">{selectedNode.title}</h1>

            <p className="text-sm leading-6 text-foreground/72">{selectedNode.summary}</p>

            {selectedNode.href && (
              <Link
                href={selectedNode.href as Route}
                className="inline-block mt-3 px-3 py-2 text-xs font-medium border border-border rounded hover:bg-muted transition-colors"
              >
                Explore →
              </Link>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Children section */}
        {children.length > 0 && (
          <div className="pt-6 border-t border-border">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-4">Subdivisions ({children.length})</h2>
            <div className="space-y-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedId(child.id)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground">{child.title}</div>
                      <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{child.summary}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Siblings section for context */}
        {siblings.length > 1 && (
          <div className="pt-6 border-t border-border">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-4">Related topics</h2>
            <div className="space-y-2">
              {siblings
                .filter((s) => s.id !== selectedId)
                .slice(0, 3)
                .map((sibling) => (
                  <button
                    key={sibling.id}
                    onClick={() => setSelectedId(sibling.id)}
                    className="w-full text-left p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-all"
                  >
                    <div className="font-medium text-xs text-primary">{sibling.title}</div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getBreadcrumb(nodeId: string, nodes: KnowledgeNode[]): KnowledgeNode[] {
  const chain: KnowledgeNode[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  let current = nodeMap.get(nodeId);

  while (current) {
    chain.unshift(current);
    current = current.parentId ? nodeMap.get(current.parentId) : undefined;
  }

  return chain;
}
