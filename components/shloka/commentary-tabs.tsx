"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { CommentaryContent } from "@/types/gita";

type CommentaryTabsProps = {
  commentaries: CommentaryContent[];
};

export function CommentaryTabs({ commentaries }: CommentaryTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = commentaries[activeIndex];

  if (!active) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Commentary views">
        {commentaries.map((commentary, index) => (
          <button
            key={`${commentary.author}-${commentary.title}`}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            className={`focus-ring-calm shrink-0 rounded-md border px-3 py-2 text-sm transition-colors ${
              activeIndex === index
                ? "border-primary/40 bg-primary/15 text-foreground"
                : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {commentary.tradition}
          </button>
        ))}
      </div>
      <div className="pt-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{active.author}</Badge>
          <Badge variant="muted">Interpretation</Badge>
        </div>
        <h3 className="font-serif text-2xl font-semibold">{active.title}</h3>
        <p className="reading-copy mt-4 text-foreground/78">{active.body}</p>
        <p className="mt-5 border-l-2 border-primary/45 pl-4 text-sm leading-7 text-foreground/70">
          {active.interpretationNote}
        </p>
      </div>
    </div>
  );
}
