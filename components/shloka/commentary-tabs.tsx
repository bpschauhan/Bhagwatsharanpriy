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
            {commentary.school ?? commentary.tradition}
          </button>
        ))}
      </div>
      <div className="pt-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{active.author}</Badge>
          <Badge variant="muted">{active.tradition}</Badge>
          {active.school ? <Badge variant="outline">{active.school}</Badge> : null}
          {active.layerType ? <Badge variant="muted">{active.layerType.replaceAll("_", " ").toLowerCase()}</Badge> : null}
        </div>
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Commentary, not scripture</p>
        <h3 className="font-serif text-2xl font-semibold">{active.title}</h3>
        <dl className="mt-4 grid gap-3 rounded-lg border border-border bg-background/55 p-3 text-sm sm:grid-cols-3">
          <MetadataItem label="School" value={active.school ?? active.tradition} />
          <MetadataItem label="Period" value={active.historicalPeriod ?? "Unspecified"} />
          <MetadataItem label="Locator" value={active.sourceLocator ?? "Verse-level note"} />
        </dl>
        <p className="reading-copy mt-4 text-foreground/78">{active.body}</p>
        {active.layers && active.layers.length > 0 ? (
          <div className="mt-5 space-y-3">
            {active.layers.map((layer) => (
              <section key={`${active.author}-${layer.type}-${layer.title}`} className="rounded-lg border border-border bg-background/60 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{layer.type.replaceAll("_", " ").toLowerCase()}</Badge>
                  <h4 className="font-serif text-lg font-semibold">{layer.title}</h4>
                </div>
                <p className="text-sm leading-7 text-foreground/72">{layer.body}</p>
              </section>
            ))}
          </div>
        ) : null}
        <p className="mt-5 border-l-2 border-primary/45 pl-4 text-sm leading-7 text-foreground/70">
          {active.interpretationNote}
        </p>
        {active.attributionNote ? (
          <p className="mt-3 text-xs leading-6 text-muted-foreground">{active.attributionNote}</p>
        ) : null}
      </div>
    </div>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  );
}
