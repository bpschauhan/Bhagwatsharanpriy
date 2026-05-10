"use client";

import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getKnowledgeNode } from "@/lib/content/knowledge-graph";
import type { KnowledgeEdge, KnowledgeNode } from "@/types/knowledge";

type RelationshipPanelProps = {
  node: KnowledgeNode;
  edges: KnowledgeEdge[];
  onSelect: (nodeId: string) => void;
};

export function RelationshipPanel({ node, edges, onSelect }: RelationshipPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <aside className="surface-calm overflow-hidden rounded-lg lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={node.id}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
          className="p-5 lg:p-6"
        >
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="size-4 text-primary" aria-hidden="true" />
            <span>Node explorer</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{node.nodeType.replaceAll("_", " ").toLowerCase()}</Badge>
            {node.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight">{node.title}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{node.summary}</p>
          {node.href ? (
            <Link
              href={node.href as Route}
              className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background/70 px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open study page
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
          <div className="mt-7">
            <h3 className="font-serif text-lg font-semibold">Why this connects</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              Connections show textual belonging, philosophical influence, or shared practice language.
            </p>
            <div className="mt-3 space-y-3">
              {edges.slice(0, 6).map((edge) => {
                const otherId = edge.source === node.id ? edge.target : edge.source;
                const other = getKnowledgeNode(otherId);

                if (!other) {
                  return null;
                }

                return (
                  <button
                    key={edge.id}
                    type="button"
                    className="focus-ring-calm block w-full rounded-lg border border-border bg-background/70 p-3 text-left transition-colors duration-300 ease-premium hover:border-primary/45 hover:bg-muted"
                    onClick={() => onSelect(other.id)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium">{other.title}</span>
                      <Badge variant="muted">{edge.relationshipType.replaceAll("_", " ").toLowerCase()}</Badge>
                    </span>
                    <span className="mt-2 line-clamp-3 block text-sm leading-6 text-foreground/72">{edge.summary}</span>
                    <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-muted" aria-label={`Relationship strength ${edge.weight} of 5`}>
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${(edge.weight / 5) * 100}%` }} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
