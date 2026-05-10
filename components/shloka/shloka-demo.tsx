"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ShlokaContent } from "@/types/content";

const demoShloka: ShlokaContent = {
  sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।",
  transliteration: "yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya",
  layers: [
    {
      title: "Simple meaning",
      body: "Act from steadiness. Let the mind be rooted in clarity rather than attachment to outcome.",
    },
    {
      title: "Deeper reflection",
      body: "The teaching does not reject action. It refines the inner posture from which action arises.",
    },
    {
      title: "Practice",
      body: "Before an important task, pause for one breath and ask: can this be done with sincerity instead of restlessness?",
    },
  ],
};

export function ShlokaDemo() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Card id="study" className="overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        <p className="font-devanagari text-3xl leading-relaxed text-foreground sm:text-4xl">{demoShloka.sanskrit}</p>
        <p className="mt-4 text-sm italic leading-7 text-muted-foreground">{demoShloka.transliteration}</p>
        <div className="mt-8 divide-y divide-border">
          {demoShloka.layers.map((layer, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={layer.title} className="py-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 text-left font-medium"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  {layer.title}
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-7 text-muted-foreground">{layer.body}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
