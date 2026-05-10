"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { RevisionEntry } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type RevisionPanelProps = {
  revisions: RevisionEntry[];
};

export function RevisionPanel({ revisions }: RevisionPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revision history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {revisions.map((revision, index) => (
          <motion.article
            key={revision.id}
            className="rounded-lg border border-border bg-background/60 p-4"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.18, delay: index * 0.04 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium">v{revision.version}: {revision.title}</p>
              <Button type="button" variant="ghost" size="sm" disabled title="Rollback architecture placeholder">
                <RotateCcw className="size-4" aria-hidden="true" />
                Rollback
              </Button>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{revision.changeNote}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {revision.author} · {revision.createdAt}
            </p>
          </motion.article>
        ))}
      </CardContent>
    </Card>
  );
}
