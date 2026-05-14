"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getKnowledgeNode, knowledgeNodes } from "@/lib/content/knowledge-graph";
import type { KnowledgeNode } from "@/types/knowledge";
import Link from "next/link";
import type { Route } from "next";

/**
 * Timeline view showing intellectual evolution from Vedas through modern interpretations
 */
export function TimelineView({ initialNodeId = "wisdom-root" }: { initialNodeId?: string }) {
  const [selectedId, setSelectedId] = useState(initialNodeId);
  const selectedNode = getKnowledgeNode(selectedId) ?? knowledgeNodes[0];

  const periods = useMemo(
    () => [
      {
        period: "Vedic Era",
        label: "~1500-800 BCE",
        description: "Foundations of knowledge in hymnody and ritual",
        nodes: knowledgeNodes.filter((n) => ["vedas", "rigveda", "yajurveda", "samaveda", "atharvaveda"].includes(n.id)),
        color: "from-amber-700 to-amber-600",
      },
      {
        period: "Upanishadic Era",
        label: "~800-200 BCE",
        description: "Philosophical inquiry into self, Brahman, and reality",
        nodes: knowledgeNodes.filter((n) =>
          ["upanishads", "isha-upanishad", "katha-upanishad", "chandogya-upanishad", "brihadaranyaka-upanishad"].includes(n.id)
        ),
        color: "from-amber-600 to-yellow-500",
      },
      {
        period: "Classical Era",
        label: "~200 BCE-800 CE",
        description: "Systematization of philosophy, yoga, and ritual interpretation",
        nodes: knowledgeNodes.filter((n) => ["yoga", "yoga-sutras", "sankhya", "vedanta", "darshanas", "nyaya", "mimamsa"].includes(n.id)),
        color: "from-yellow-500 to-yellow-400",
      },
      {
        period: "Devotional Era",
        label: "~600-1800 CE",
        description: "Personal relationship with the divine through practice",
        nodes: knowledgeNodes.filter((n) => ["bhagavad-gita"].includes(n.id)),
        color: "from-yellow-400 to-green-500",
      },
    ],
    []
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* Timeline visualization */}
      <div className="surface-calm overflow-hidden rounded-lg">
        <div className="border-b border-border bg-background/30 p-6">
          <h2 className="font-serif text-2xl font-semibold mb-2">Intellectual Evolution</h2>
          <p className="text-sm text-foreground/70">How Indian philosophical traditions developed across epochs</p>
        </div>

        <div className="p-6 space-y-8">
          {periods.map((period, idx) => (
            <div key={period.period} className="relative">
              {/* Timeline marker */}
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center mt-1">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-b ${period.color} border-4 border-background relative z-10`}
                  />
                  {idx < periods.length - 1 && <div className="w-1 h-24 bg-gradient-to-b from-border to-transparent mt-2" />}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="mb-3">
                    <h3 className="font-serif text-xl font-semibold text-foreground">{period.period}</h3>
                    <p className="text-sm text-muted-foreground">{period.label}</p>
                  </div>
                  <p className="text-sm text-foreground/70 mb-4">{period.description}</p>

                  {/* Node list for period */}
                  <div className="grid gap-2">
                    {period.nodes.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => setSelectedId(node.id)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          selectedId === node.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-sm text-foreground">{node.title}</div>
                        <div className="text-xs text-foreground/60 mt-1 line-clamp-2">{node.summary}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node details panel */}
      <TimelineNodePanel selectedNode={selectedNode} />
    </div>
  );
}

function TimelineNodePanel({ selectedNode }: { selectedNode: KnowledgeNode }) {
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
            Explore <ArrowRight className="size-3" />
          </Link>
        )}

        {/* Historical context */}
        <div className="mt-6 pt-5 border-t border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">Historical significance</h3>
          <p className="text-sm text-foreground/70 leading-6">
            {selectedNode.nodeType === "SCRIPTURE"
              ? "This foundational scripture emerged from its era and continues to influence philosophical thought."
              : "This teaching systematized insights from earlier periods and became foundational for later traditions."}
          </p>
        </div>
      </motion.div>
    </aside>
  );
}
