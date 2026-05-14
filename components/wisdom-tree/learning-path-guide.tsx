"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, BookOpen, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getKnowledgeNode, knowledgeNodes } from "@/lib/content/knowledge-graph";
import type { KnowledgeNode } from "@/types/knowledge";
import Link from "next/link";
import type { Route } from "next";

/**
 * Guided learning paths - structured progressions for different learning styles
 */
export function LearningPathGuide({ initialNodeId = "wisdom-root" }: { initialNodeId?: string }) {
  const [selectedPathId, setSelectedPathId] = useState("scripture-journey");
  const [selectedNodeInPath, setSelectedNodeInPath] = useState<string | null>(initialNodeId === "wisdom-root" ? null : initialNodeId);

  const learningPaths = useMemo(
    () => [
      {
        id: "scripture-journey",
        title: "Scripture Journey",
        icon: BookOpen,
        description: "Start with foundational texts and progressively explore deeper meanings",
        pathSequence: ["vedas", "upanishads", "bhagavad-gita"],
        beginner: true,
        estimatedTime: "8-12 weeks",
      },
      {
        id: "philosophical-systems",
        title: "Philosophical Systems",
        icon: Compass,
        description: "Understand the major schools of thought and their distinctions",
        pathSequence: ["darshanas", "vedanta", "sankhya", "yoga"],
        beginner: false,
        estimatedTime: "10-14 weeks",
      },
      {
        id: "practical-wisdom",
        title: "Practical Wisdom",
        icon: Lightbulb,
        description: "Learn teachings that can be applied to daily life and practice",
        pathSequence: ["bhagavad-gita", "yoga", "concepts"],
        beginner: true,
        estimatedTime: "6-10 weeks",
      },
    ],
    []
  );

  const currentPath = learningPaths.find((p) => p.id === selectedPathId);
  const pathNodes = currentPath?.pathSequence.map((id) => getKnowledgeNode(id)).filter(Boolean) as KnowledgeNode[];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* Path selector and visualization */}
      <div className="surface-calm overflow-hidden rounded-lg flex flex-col">
        <div className="border-b border-border bg-background/30 p-6">
          <h2 className="font-serif text-2xl font-semibold mb-2">Guided Learning Paths</h2>
          <p className="text-sm text-foreground/70">Choose a learning structure suited to your goals</p>
        </div>

        {/* Path options */}
        <div className="border-b border-border bg-background/50 p-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {learningPaths.map((path) => {
            const Icon = path.icon;
            return (
              <button
                key={path.id}
                onClick={() => {
                  setSelectedPathId(path.id);
                  setSelectedNodeInPath(null);
                }}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedPathId === path.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Icon className="size-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-sm">{path.title}</span>
                </div>
                <p className="text-xs text-foreground/60">{path.estimatedTime}</p>
              </button>
            );
          })}
        </div>

        {/* Path visualization */}
        <div className="flex-1 p-6">
          {pathNodes && (
            <div>
              <p className="text-sm text-foreground/70 mb-6">{currentPath?.description}</p>

              <div className="space-y-4">
                {pathNodes.map((node, idx) => (
                  <div key={node.id}>
                    <button
                      onClick={() => setSelectedNodeInPath(node.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedNodeInPath === node.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{node.title}</h3>
                          <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{node.summary}</p>
                          {node.href && (
                            <Link
                              href={node.href as Route}
                              className="inline-flex items-center gap-2 mt-3 text-xs text-primary hover:underline"
                            >
                              Begin study <ArrowRight className="size-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </button>

                    {idx < pathNodes.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowRight className="size-4 text-muted-foreground transform rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Guidance */}
              <div className="mt-8 p-4 bg-background/60 rounded-lg border border-border">
                <h3 className="font-semibold text-sm mb-2">How to use this path</h3>
                <ul className="text-xs space-y-1 text-foreground/70">
                  <li>• Start with the first item and progress sequentially</li>
                  <li>• Spend 1-2 weeks on each topic to allow deeper understanding</li>
                  <li>• Keep a journal of insights and questions</li>
                  <li>• Move to the next item once key concepts feel integrated</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Node details */}
      {selectedNodeInPath && (
        <PathNodePanel selectedNode={getKnowledgeNode(selectedNodeInPath) || knowledgeNodes[0]} />
      )}
    </div>
  );
}

function PathNodePanel({ selectedNode }: { selectedNode: KnowledgeNode }) {
  return (
    <aside className="surface-calm overflow-hidden rounded-lg lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
        <Badge variant="outline" className="text-xs mb-3">
          {selectedNode.nodeType.replace(/_/g, " ").toLowerCase()}
        </Badge>

        <h2 className="font-serif text-2xl font-semibold leading-tight mb-3">{selectedNode.title}</h2>

        <p className="text-sm leading-6 text-foreground/72 mb-4">{selectedNode.summary}</p>

        {selectedNode.href && (
          <Link
            href={selectedNode.href as Route}
            className="inline-flex h-8 items-center gap-2 rounded border border-border bg-background/70 px-3 text-xs font-medium hover:bg-muted transition-colors"
          >
            Begin study <ArrowRight className="size-3" />
          </Link>
        )}

        {/* Study guidance */}
        <div className="mt-6 pt-5 border-t border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">Study approach</h3>
          <ul className="text-xs space-y-2 text-foreground/70">
            <li>
              <strong className="text-foreground">Start with:</strong> Read summary and introduction
            </li>
            <li>
              <strong className="text-foreground">Then explore:</strong> Main teachings and key concepts
            </li>
            <li>
              <strong className="text-foreground">Practice:</strong> Related practices or contemplation
            </li>
          </ul>
        </div>

        {/* Common questions */}
        <div className="mt-6 pt-5 border-t border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">Common questions</h3>
          <p className="text-xs text-foreground/70">
            {selectedNode.nodeType === "SCRIPTURE"
              ? "How is this scripture structured? What are its main themes? What are the key verses?"
              : "What makes this philosophy distinctive? How does it approach the fundamental questions?"}
          </p>
        </div>
      </motion.div>
    </aside>
  );
}
