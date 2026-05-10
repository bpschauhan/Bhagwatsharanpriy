"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { MeaningLayerContent } from "@/types/gita";

type MeaningAccordionProps = {
  layers: MeaningLayerContent[];
};

const layerLabels: Record<MeaningLayerContent["type"], string> = {
  SIMPLE: "Simple",
  BEGINNER: "Beginner",
  DEEP: "Deep",
  PRACTICAL: "Practical",
  PHILOSOPHICAL: "Philosophical",
  SCIENTIFIC_PARALLEL: "Careful parallel",
};

export function MeaningAccordion({ layers }: MeaningAccordionProps) {
  const [openType, setOpenType] = useState<MeaningLayerContent["type"]>("SIMPLE");

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {layers.map((layer) => {
        const isOpen = openType === layer.type;

        return (
          <div key={layer.type} className="px-5 py-4 sm:px-6">
            <button
              type="button"
              className="focus-ring-calm flex w-full items-center justify-between gap-4 rounded-md text-left"
              onClick={() => setOpenType(isOpen ? "SIMPLE" : layer.type)}
              aria-expanded={isOpen}
            >
              <span>
                <Badge variant={layer.type === "SCIENTIFIC_PARALLEL" ? "secondary" : "default"}>
                  {layerLabels[layer.type]}
                </Badge>
                <span className="mt-3 block font-serif text-xl font-semibold">{layer.title}</span>
              </span>
              <ChevronDown
                className={`size-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="reading-copy pt-4 text-foreground/78">{layer.body}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
